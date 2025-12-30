import { Router, Response } from "express";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";

const router = Router();

// Get current user's subscription status from WooCommerce
router.get("/status", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user!;

        // Handle grandfathered users (active status but no wooCommerceSubscriptionId)
        if (!user.wooCommerceSubscriptionId) {
            // Check if user has active subscription status (grandfathered)
            if (user.subscriptionStatus === 'active') {
                return res.json({
                    hasSubscription: false, // No WooCommerce subscription
                    status: 'active',
                    subscription: null,
                    isGrandfathered: true
                });
            }

            return res.json({
                hasSubscription: false,
                status: null,
                subscription: null,
                isGrandfathered: false
            });
        }

        // Import WooCommerce service dynamically
        const { getSubscription } = await import("../woocommerce");

        // Fetch subscription from WooCommerce
        let subscription;
        try {
            subscription = await getSubscription(user.wooCommerceSubscriptionId);
        } catch (e) {
            console.warn('Failed to fetch WooCommerce subscription:', e);
            subscription = null;
        }

        // If we couldn't get the subscription from WooCommerce (e.g. missing creds), fallback to local DB
        if (!subscription || !subscription.id) {
            return res.json({
                hasSubscription: false, // Couldn't verify with WooCommerce
                status: user.subscriptionStatus || 'inactive',
                subscription: null,
                isGrandfathered: false,
                message: "Could not verify WooCommerce status, falling back to local record"
            });
        }

        res.json({
            hasSubscription: true,
            status: subscription.status,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                nextPaymentDate: subscription.next_payment_date,
                billingPeriod: subscription.billing_period,
                billingInterval: subscription.billing_interval,
                total: subscription.total,
                currency: subscription.currency,
                startDate: subscription.start_date,
                endDate: subscription.end_date
            }
        });
    } catch (error: any) {
        console.error("Error fetching subscription:", error);
        res.status(500).json({ error: "Failed to fetch subscription status", message: error.message });
    }
});

// Pause subscription
router.post("/pause", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user!;

        if (!user.wooCommerceSubscriptionId) {
            return res.status(400).json({ error: "No subscription found" });
        }

        const { pauseSubscription } = await import("../woocommerce");
        const subscription = await pauseSubscription(user.wooCommerceSubscriptionId);

        // Update local status
        await storage.updateSubscriptionStatus(user.id, "on-hold", user.wooCommerceSubscriptionId);

        res.json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status
            }
        });
    } catch (error: any) {
        console.error("Error pausing subscription:", error);
        res.status(500).json({ error: "Failed to pause subscription", message: error.message });
    }
});

// Resume subscription
router.post("/resume", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user!;

        if (!user.wooCommerceSubscriptionId) {
            return res.status(400).json({ error: "No subscription found" });
        }

        const { resumeSubscription } = await import("../woocommerce");
        const subscription = await resumeSubscription(user.wooCommerceSubscriptionId);

        // Update local status
        await storage.updateSubscriptionStatus(user.id, "active", user.wooCommerceSubscriptionId);

        res.json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status
            }
        });
    } catch (error: any) {
        console.error("Error resuming subscription:", error);
        res.status(500).json({ error: "Failed to resume subscription", message: error.message });
    }
});

// Cancel subscription
router.post("/cancel", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user!;

        if (!user.wooCommerceSubscriptionId) {
            return res.status(400).json({ error: "No subscription found" });
        }

        const { cancelSubscription } = await import("../woocommerce");
        const subscription = await cancelSubscription(user.wooCommerceSubscriptionId);

        // Update local status
        await storage.updateSubscriptionStatus(user.id, "cancelled", user.wooCommerceSubscriptionId);

        res.json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status
            }
        });
    } catch (error: any) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ error: "Failed to cancel subscription", message: error.message });
    }
});

export default router;
