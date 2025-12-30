import { createServer } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { insertMoodEntrySchema, insertGameScoreSchema, journalEntrySchema } from "@shared/schema";
import crypto from "crypto";
import { sendWelcomeEmail } from "./email";
import { z } from "zod";
// Middleware to verify WooCommerce webhook signatures using constant-time comparison
function verifyWebhookSignature(req, res, next) {
    const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("WOOCOMMERCE_WEBHOOK_SECRET is not configured");
        return res.status(500).json({ error: "Webhook secret not configured" });
    }
    const signature = req.headers['x-wc-webhook-signature'];
    if (!signature) {
        console.error("Webhook signature missing");
        return res.status(401).json({ error: "Webhook signature missing" });
    }
    // Use the raw body buffer captured by middleware for accurate signature verification
    const rawBody = req.rawBody;
    if (!rawBody) {
        console.error("Raw body not available for signature verification");
        return res.status(500).json({ error: "Webhook verification error" });
    }
    // Compute HMAC-SHA256 signature using the raw body
    const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('base64');
    // Use constant-time comparison to prevent timing attacks
    try {
        const signatureBuffer = Buffer.from(signature, 'base64');
        const computedBuffer = Buffer.from(computedSignature, 'base64');
        // Ensure buffers are same length before comparing
        if (signatureBuffer.length !== computedBuffer.length) {
            console.error("Invalid webhook signature (length mismatch)");
            return res.status(401).json({ error: "Invalid webhook signature" });
        }
        if (!crypto.timingSafeEqual(signatureBuffer, computedBuffer)) {
            console.error("Invalid webhook signature");
            return res.status(401).json({ error: "Invalid webhook signature" });
        }
    }
    catch (error) {
        console.error("Signature verification error:", error);
        return res.status(401).json({ error: "Invalid webhook signature" });
    }
    next();
}
export async function registerRoutes(app) {
    // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
    setupAuth(app);
    // Production database seeding endpoint (protected)
    app.post("/api/admin/seed-database", async (req, res) => {
        try {
            // Only allow in production or with specific environment variable
            const isProduction = process.env.NODE_ENV === "production";
            const allowSeeding = process.env.ALLOW_DATABASE_SEEDING === "true";
            if (!isProduction && !allowSeeding) {
                return res.status(403).json({
                    error: "Database seeding is only allowed in production or when ALLOW_DATABASE_SEEDING is set"
                });
            }
            // Use the seed-firestore.ts script instead
            res.json({
                success: true,
                message: "Please run 'npm run seed:firestore' to seed the database"
            });
        }
        catch (error) {
            console.error("Seeding error:", error);
            res.status(500).json({
                error: "Failed to seed database",
                message: error.message
            });
        }
    });
    // Clear and re-seed production database (protected)
    app.post("/api/admin/clear-and-reseed", async (req, res) => {
        try {
            // Only allow in production or with specific environment variable
            const isProduction = process.env.NODE_ENV === "production";
            const allowSeeding = process.env.ALLOW_DATABASE_SEEDING === "true";
            if (!isProduction && !allowSeeding) {
                return res.status(403).json({
                    error: "Database operations are only allowed in production or when ALLOW_DATABASE_SEEDING is set"
                });
            }
            console.log("🗑️  Clearing existing static content...");
            // Import db
            const { db } = await import("./db");
            // Delete all collections
            const collections = ['lessons', 'courses', 'iqQuestions'];
            for (const collectionName of collections) {
                const snapshot = await db.collection(collectionName).get();
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
                console.log(`   Deleted ${collectionName}`);
            }
            console.log("✅ Cleared existing data");
            console.log("🌱 Starting fresh seeding...");
            // Now re-seed using seed-firestore.ts
            res.json({
                success: true,
                message: "Database cleared. Run 'npm run seed:firestore' to re-seed",
                cleared: {
                    courses: true,
                    lessons: true,
                    iqQuestions: true
                }
            });
        }
        catch (error) {
            console.error("Clear and reseed error:", error);
            res.status(500).json({
                error: "Failed to clear and reseed database",
                message: error.message
            });
        }
    });
    // Create user endpoint for admin (protected)
    app.post("/api/admin/create-user", async (req, res) => {
        try {
            // Only allow in production or with specific environment variable
            const isProduction = process.env.NODE_ENV === "production";
            const allowSeeding = process.env.ALLOW_DATABASE_SEEDING === "true";
            if (!isProduction && !allowSeeding) {
                return res.status(403).json({
                    error: "User creation is only allowed in production or when ALLOW_DATABASE_SEEDING is set"
                });
            }
            const { email, language = 'en' } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            // Check if user already exists
            let user = await storage.getUserByEmail(email);
            if (user) {
                return res.json({
                    success: true,
                    message: "User already exists",
                    userId: user.id,
                    email: user.email,
                    alreadyExists: true
                });
            }
            // Create new user
            const generatedUsername = email.split('@')[0];
            const dummyPassword = crypto.randomBytes(32).toString('hex');
            user = await storage.createUser({
                username: generatedUsername,
                password: await hashPassword(dummyPassword),
                email,
                language
            });
            console.log(`Admin created user: ${email} with language: ${language}`);
            res.json({
                success: true,
                message: "User created successfully",
                userId: user.id,
                email: user.email,
                language: user.language,
                alreadyExists: false
            });
        }
        catch (error) {
            console.error("Admin user creation error:", error);
            res.status(500).json({
                error: "Failed to create user",
                message: error.message
            });
        }
    });
    // Demo user endpoint for testing
    app.get("/api/user/demo", async (req, res) => {
        try {
            // Check if demo user already exists
            let demoUser = await storage.getUserByUsername("demo");
            if (!demoUser) {
                // Create demo user
                demoUser = await storage.createUser({
                    username: "demo",
                    password: await hashPassword("demo123"),
                    email: "demo@creativewaves.com",
                    language: "en"
                });
            }
            // Log in the demo user
            req.login(demoUser, (err) => {
                if (err) {
                    console.error("Demo login error:", err);
                    return res.status(500).json({ error: "Failed to log in demo user" });
                }
                res.redirect("/dashboard");
            });
        }
        catch (error) {
            console.error("Demo user creation error:", error);
            res.status(500).json({ error: error.message });
        }
    });
    // Webhook endpoint for user creation (called by payment system)
    app.post("/api/webhook/create-user", async (req, res) => {
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
            res.json({ success: true, userId: user.id });
        }
        catch (error) {
            console.error("User creation error:", error);
            res.status(500).json({ error: error.message });
        }
    });
    // Temporary endpoint to seed test users
    app.post("/api/admin/seed-users", async (req, res) => {
        try {
            const emails = ["ricdes@gmail.com", "ricardo@leadprime.net"];
            const results = [];
            for (const email of emails) {
                console.log(`Seeding user: ${email}`);
                let user = await storage.getUserByEmail(email);
                if (user) {
                    await storage.updateSubscriptionStatus(user.id, "active", "manual-test");
                    results.push({ email, status: "updated", userId: user.id });
                    continue;
                }
                const { hashPassword } = await import("./auth");
                const generatedUsername = email.split('@')[0];
                user = await storage.createUser({
                    username: generatedUsername,
                    email: email,
                    password: await hashPassword("temp123"),
                    language: "en"
                });
                await storage.updateSubscriptionStatus(user.id, "active", "manual-test");
                results.push({ email, status: "created", userId: user.id });
            }
            res.json({ success: true, results });
        }
        catch (error) {
            console.error("Seed error:", error);
            res.status(500).json({ error: error.message });
        }
    });
    // Helper function to determine language from country code
    function getLanguageFromCountry(countryCode) {
        if (!countryCode)
            return "en";
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
    // WooCommerce webhook: Subscription created (with signature verification)
    app.post("/api/webhook/subscription-created", verifyWebhookSignature, async (req, res) => {
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
            console.log(`New subscription from ${billingCountry || 'unknown country'}, using language: ${userLanguage}`);
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
                console.log(`New user created: ${email} with language: ${userLanguage}`);
            }
            await storage.updateSubscriptionStatus(user.id, "active", subscriptionId?.toString());
            // Send welcome email for new users (in their language)
            if (isNewUser) {
                try {
                    await sendWelcomeEmail(email, userLanguage);
                    console.log(`Welcome email sent to: ${email} in ${userLanguage}`);
                }
                catch (emailError) {
                    console.error(`Failed to send welcome email to ${email}:`, emailError);
                    // Don't fail the webhook - user account is still created
                }
            }
            res.json({
                success: true,
                userId: user.id,
                message: "Subscription activated",
                language: userLanguage
            });
        }
        catch (error) {
            console.error("Subscription creation error:", error);
            res.status(500).json({ error: error.message });
        }
    });
    // WooCommerce webhook: Subscription cancelled (with signature verification)
    app.post("/api/webhook/subscription-cancelled", verifyWebhookSignature, async (req, res) => {
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
            await storage.updateSubscriptionStatus(user.id, "cancelled", subscriptionId?.toString());
            console.log(`Subscription cancelled for user: ${email}`);
            res.json({
                success: true,
                userId: user.id,
                message: "Subscription cancelled"
            });
        }
        catch (error) {
            console.error("Subscription cancellation error:", error);
            res.status(500).json({ error: error.message });
        }
    });
    // Update audio progress (authenticated)
    app.post("/api/audio/progress", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { session, position } = req.body;
            const user = await storage.updateUserAudioProgress(req.user.id, session, position);
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Mood entry endpoints (authenticated)
    app.post("/api/mood", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            console.log("Received mood entry request:", req.body);
            console.log("User ID:", req.user.id);
            const validated = insertMoodEntrySchema.parse({
                ...req.body,
                userId: req.user.id
            });
            console.log("Validated mood entry:", validated);
            const entry = await storage.createMoodEntry(validated);
            console.log("Created mood entry:", entry);
            res.json(entry);
        }
        catch (error) {
            console.error("Error creating mood entry:", error);
            if (error instanceof z.ZodError) {
                console.error("Validation error:", JSON.stringify(error.errors, null, 2));
            }
            res.status(400).json({ error: error.message });
        }
    });
    app.get("/api/mood", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const entries = await storage.getMoodEntries(req.user.id);
            res.json(entries);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.patch("/api/mood/:id", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { mood, note } = req.body;
            const entry = await storage.updateMoodEntry(req.params.id, mood, note);
            res.json(entry);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.delete("/api/mood/:id", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            await storage.deleteMoodEntry(req.params.id);
            res.sendStatus(200);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Daily plan endpoints (authenticated)
    app.post("/api/daily-plan/complete-task", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { task, status } = req.body;
            const validTasks = ['thetaAudioCompleted', 'breathingCompleted', 'gameCompleted', 'moodCompleted'];
            if (!task || !validTasks.includes(task)) {
                return res.status(400).json({ error: "Invalid task" });
            }
            // Default to 1 (completed) if status not provided, allow 2 for skipped
            const completionStatus = status === 'skipped' ? 2 : 1;
            // Get current date in GMT (YYYY-MM-DD format)
            const today = new Date().toISOString().split('T')[0];
            const plan = await storage.updateDailyPlanTask(req.user.id, today, task, completionStatus);
            res.json(plan);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/daily-plan", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const today = new Date().toISOString().split('T')[0];
            const plan = await storage.getDailyPlan(req.user.id, today);
            // Return existing plan or default empty plan
            res.json(plan || {
                date: today,
                thetaAudioCompleted: 0,
                breathingCompleted: 0,
                gameCompleted: 0,
                moodCompleted: 0
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Game score endpoints (authenticated)
    app.post("/api/game/score", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const validated = insertGameScoreSchema.parse({
                ...req.body,
                userId: req.user.id
            });
            const score = await storage.createGameScore(validated);
            res.json(score);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    app.get("/api/game/scores", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { gameType } = req.query;
            const scores = await storage.getGameScores(req.user.id, gameType);
            res.json(scores);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Course endpoints (authenticated)
    app.get("/api/courses", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const userLanguage = req.user.language || 'en';
            const courses = await storage.getCourses(userLanguage);
            res.json(courses);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/courses/:id", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const course = await storage.getCourse(req.params.id);
            if (!course)
                return res.sendStatus(404);
            res.json(course);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/courses/:courseId/lessons", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const userLanguage = req.user.language || 'en';
            const lessons = await storage.getLessonsByCourse(req.params.courseId, userLanguage);
            res.json(lessons);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/courses/:courseId/progress", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const progress = await storage.getUserProgress(req.user.id, req.params.courseId);
            res.json(progress);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/lessons/:id", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const lesson = await storage.getLesson(req.params.id);
            if (!lesson)
                return res.sendStatus(404);
            res.json(lesson);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.post("/api/lessons/:id/complete", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const progress = await storage.markLessonComplete(req.user.id, req.params.id);
            res.json(progress);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/iq-test/questions", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const count = parseInt(req.query.count) || 20;
            const userLanguage = req.user?.language || 'en';
            const questions = await storage.getRandomIQQuestions(count, userLanguage);
            res.json(questions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.post("/api/iq-test/submit", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { answers } = req.body;
            if (!Array.isArray(answers)) {
                return res.status(400).json({ error: 'Answers must be an array' });
            }
            const totalQuestions = answers.length;
            let correctAnswers = 0;
            const sessionId = crypto.randomUUID();
            const answerResults = [];
            for (const answer of answers) {
                const question = await storage.getIQQuestion(answer.questionId);
                if (!question)
                    continue;
                const isCorrect = answer.userAnswer === question.correctAnswer ? 1 : 0;
                if (isCorrect)
                    correctAnswers++;
                answerResults.push({
                    sessionId,
                    questionId: answer.questionId,
                    userAnswer: answer.userAnswer,
                    isCorrect
                });
            }
            const percentage = (correctAnswers / totalQuestions) * 100;
            const baseScore = 100;
            const scoreRange = 60;
            const score = Math.round(baseScore + (percentage / 100) * scoreRange);
            const session = await storage.createIQTestSessionWithId({
                id: sessionId,
                userId: req.user.id,
                totalQuestions,
                correctAnswers,
                score,
                completedAt: new Date()
            });
            for (const answerData of answerResults) {
                await storage.saveIQTestAnswer(answerData);
            }
            res.json(session);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/iq-test/history", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const sessions = await storage.getIQTestSessions(req.user.id);
            res.json(sessions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/iq-test/session/:sessionId", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const session = await storage.getIQTestSession(req.params.sessionId);
            if (!session || session.userId !== req.user.id) {
                return res.status(404).json({ error: 'Session not found' });
            }
            res.json(session);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/iq-test/answers/:sessionId", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const answers = await storage.getIQTestAnswers(req.params.sessionId);
            res.json(answers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/iq-test/session/:id/answers", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const answers = await storage.getIQTestAnswers(req.params.id);
            res.json(answers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Journal endpoints (authenticated)
    app.get("/api/journal", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const entries = await storage.getJournalEntries(req.user.id);
            res.json(entries);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.post("/api/journal", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const validated = journalEntrySchema.parse({
                ...req.body,
                userId: req.user.id
            });
            const entry = await storage.createJournalEntry(validated);
            res.json(entry);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.errors });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    });
    app.patch("/api/journal/:id", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            // Validate partial updates if needed, or just pass through
            // For simplicity, we'll just pass the body as updates
            const entry = await storage.updateJournalEntry(req.params.id, req.body);
            res.json(entry);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.delete("/api/journal/:id", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            await storage.deleteJournalEntry(req.params.id);
            res.sendStatus(200);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
//# sourceMappingURL=routes.js.map