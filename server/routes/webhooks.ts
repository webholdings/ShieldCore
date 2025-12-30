import { Router, Response, Request } from "express";
import crypto from "crypto";
import { z } from "zod";
import { insertQuizResultSchema } from "@shared/schema";
import { storage } from "../storage";
import { hashPassword } from "../auth";
import { sendWelcomeEmail } from "../email";
import { verifyWebhookSignature } from "../middleware";

const router = Router();

// Helper function to determine language from country code
function getLanguageFromCountry(countryCode: string | undefined): string {
    if (!countryCode) return "en";

    const country = countryCode.toUpperCase();

    // Map country codes to supported languages
    switch (country) {
        case "DE": // Germany
        case "AT": // Austria
        case "CH": // Switzerland (also speaks German)
            return "de";

        case "FR": // France
        case "BE": // Belgium (also speaks French)
        case "LU": // Luxembourg (also speaks French)
            return "fr";

        case "PT": // Portugal
        case "BR": // Brazil
            return "pt";

        default:
            return "en"; // Default to English for all other countries
    }
}

// Quiz Webhook Endpoint
router.post("/quiz", async (req, res) => {
    try {
        console.log("Received quiz webhook:", JSON.stringify(req.body, null, 2));

        const validated = insertQuizResultSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await storage.getUserByEmail(validated.email);

        // If user exists, link immediately
        if (existingUser) {
            validated.userId = existingUser.id;
        }

        const result = await storage.createQuizResult(validated);
        console.log("Stored quiz result for " + validated.email + ", linked to user: " + (validated.userId || 'pending'));

        res.json({ success: true, id: result.id });
    } catch (error: any) {
        console.error("Quiz webhook error:", error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Webhook endpoint for user creation (called by payment system)
router.post("/create-user", async (req, res) => {
    try {
        const { email, username } = req.body;

        // Generate a temporary password (user will set their own later)
        const tempPassword = Math.random().toString(36).slice(-8);

        const user = await storage.createUser({
            username: username || email,
            password: await hashPassword(tempPassword),
            email,
            language: "en"
        });

        // Link any existing quiz results to this user
        const quizResult = await storage.getQuizResultByEmail(email);
        if (quizResult && !quizResult.userId) {
            await storage.linkQuizResultToUser(quizResult.id, user.id);
            console.log("Linked quiz result " + quizResult.id + " to user " + user.id);
        }

        res.json({ success: true, userId: user.id });
    } catch (error: any) {
        console.error("User creation error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Express Upgrade product purchases
router.post("/express-upgrade", async (req, res) => {
    try {
        console.log("Express Upgrade webhook received:", JSON.stringify(req.body, null, 2));

        const { email, product_id, order_id } = req.body;
        const validProductIds = [81, 1098, 1094, 1102];

        if (!email) {
            console.error("Express Upgrade webhook missing email");
            return res.status(400).json({ error: "Email is required" });
        }

        // Validate product ID
        if (!validProductIds.includes(Number(product_id))) {
            console.error("Invalid product_id:", product_id);
            return res.status(400).json({ error: "Invalid product_id" });
        }

        // Find user by email
        const user = await storage.getUserByEmail(email.toLowerCase().trim());

        if (!user) {
            console.error("Express Upgrade: User not found for email:", email);
            return res.status(404).json({ error: "User not found" });
        }

        // Enable express upgrade for this user
        await storage.updateExpressUpgradeStatus(user.id, true);

        console.log("Express Upgrade enabled for user:", email, "Order ID:", order_id);

        res.json({
            success: true,
            userId: user.id,
            message: "Express Upgrade enabled",
            order_id
        });
    } catch (error: any) {
        console.error("Express Upgrade webhook error:", error);
        res.status(500).json({ error: error.message });
    }
});

// WooCommerce webhook: Subscription created (with signature verification)
router.post("/subscription-created", verifyWebhookSignature, async (req, res) => {
    try {
        // WooCommerce sends subscription object with nested billing data
        const { id: subscriptionId, billing } = req.body;

        // Extract email and other data from billing object
        const email = billing?.email;
        const firstName = billing?.first_name;
        const lastName = billing?.last_name;
        const billingCountry = billing?.country;

        if (!email) {
            console.error("Webhook missing email. Body:", JSON.stringify(req.body, null, 2));
            return res.status(400).json({ error: "Email is required" });
        }

        // Determine language from billing country
        const userLanguage = getLanguageFromCountry(billingCountry);

        console.log("New subscription from " + (billingCountry || 'unknown country') + ", using language: " + userLanguage);

        let user = await storage.getUserByEmail(email);
        let isNewUser = false;

        if (!user) {
            const generatedUsername = email.split('@')[0];
            // For passwordless auth, we still need a password field but it won't be used
            const dummyPassword = crypto.randomBytes(32).toString('hex');

            user = await storage.createUser({
                username: generatedUsername,
                password: await hashPassword(dummyPassword),
                email,
                language: userLanguage
            });

            isNewUser = true;
            console.log("New user created: " + email + " with language: " + userLanguage);
        }

        await storage.updateSubscriptionStatus(
            user.id,
            "active",
            subscriptionId?.toString()
        );

        // Send welcome email for new users (in their language)
        if (isNewUser) {
            try {
                await sendWelcomeEmail(email, userLanguage);
                console.log("Welcome email sent to: " + email + " in " + userLanguage);
            } catch (emailError) {
                console.error("Failed to send welcome email to " + email + ": ", emailError);
                // Don't fail the webhook - user account is still created
            }
        }

        // Link any existing quiz results to this user
        const quizResult = await storage.getQuizResultByEmail(email);
        if (quizResult && !quizResult.userId) {
            await storage.linkQuizResultToUser(quizResult.id, user.id);
            console.log("Linked quiz result " + quizResult.id + " to user " + user.id);
        }

        res.json({
            success: true,
            userId: user.id,
            message: "Subscription activated",
            language: userLanguage
        });
    } catch (error: any) {
        console.error("Subscription creation error:", error);
        res.status(500).json({ error: error.message });
    }
});

// WooCommerce webhook: Subscription cancelled (with signature verification)
router.post("/subscription-cancelled", verifyWebhookSignature, async (req, res) => {
    try {
        // WooCommerce sends subscription object with nested billing data
        const { id: subscriptionId, billing } = req.body;
        const email = billing?.email;

        if (!email) {
            console.error("Webhook missing email. Body:", JSON.stringify(req.body, null, 2));
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await storage.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await storage.updateSubscriptionStatus(
            user.id,
            "cancelled",
            subscriptionId?.toString()
        );

        console.log("Subscription cancelled for user: " + email);

        res.json({
            success: true,
            userId: user.id,
            message: "Subscription cancelled"
        });
    } catch (error: any) {
        console.error("Subscription cancellation error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
