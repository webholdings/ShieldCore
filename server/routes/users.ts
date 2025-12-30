import { Router, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { db } from "../db";
import { AuthenticatedRequest, verifyToken } from "../middleware";
import { storage } from "../storage";
import { sendWelcomeEmail, sendSleepWelcomeEmail } from "../email";

const router = Router();

// ============================================
// ADMIN CRUD ENDPOINTS FOR USER MANAGEMENT
// ============================================

// POST /api/admin/users - Create new user (admin only)
router.post("/admin/users", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Admin Check
        if (req.user?.email !== 'ricdes@gmail.com') {
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }

        const { email, username, language, subscriptionStatus, wooCommerceSubscriptionId, isSleepCustomer } = req.body;

        if (!email || !username) {
            return res.status(400).json({ error: "Email and username are required" });
        }

        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const newUser = await storage.createUser({
            email: email.toLowerCase().trim(),
            username,
            password: "admin-created", // Placeholder
            language: language || "en",
            subscriptionStatus: subscriptionStatus || "active",
            wooCommerceSubscriptionId: wooCommerceSubscriptionId || null,
            isSleepCustomer: isSleepCustomer || false,
            detoxStartDate: null,
        });

        // Create Firebase Auth user
        try {
            await getAuth().createUser({
                email: email.toLowerCase().trim(),
                emailVerified: true,
                disabled: false,
            });
            console.log(`[Admin] Created Firebase Auth user: ${email}`);
        } catch (authError: any) {
            console.error(`[Admin] Error creating Firebase Auth user:`, authError);
            // Continue even if Firebase creation fails (might already exist)
        }

        // Send Welcome Email
        try {
            if (isSleepCustomer) {
                await sendSleepWelcomeEmail(newUser.email!, newUser.language!);
            } else {
                await sendWelcomeEmail(newUser.email!, newUser.language!);
            }
            console.log(`[Admin] Sent welcome email to ${newUser.email}`);
        } catch (emailError) {
            console.error(`[Admin] Failed to send welcome email:`, emailError);
        }

        res.status(201).json(newUser);
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/users - List all users (admin only)
router.get("/admin/users", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log("[Admin] GET /api/admin/users - Request from:", req.user?.email);

        // Admin Check
        if (req.user?.email !== 'ricdes@gmail.com') {
            console.log("[Admin] Access denied - not admin email");
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }

        console.log("[Admin] Fetching users from Firestore...");

        // Get all users from Firestore
        const snapshot = await db.collection('users').orderBy('createdAt', 'desc').limit(100).get();

        console.log(`[Admin] Found ${snapshot.size} users`);

        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                username: data.username,
                language: data.language,
                subscriptionStatus: data.subscriptionStatus,
                wooCommerceSubscriptionId: data.wooCommerceSubscriptionId,
                streakCount: data.streakCount,
                totalPoints: data.totalPoints,
                recoveryUser: data.recoveryUser,
                expressUpgradeEnabled: data.expressUpgradeEnabled,
                isSleepCustomer: data.isSleepCustomer,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
            };
        });

        res.json(users);
    } catch (error: any) {
        console.error("Error listing users:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/users/:id - Update user (admin only)
router.put("/admin/users/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Admin Check
        if (req.user?.email !== 'ricdes@gmail.com') {
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }

        const { id } = req.params;
        const { email, username, language, subscriptionStatus, wooCommerceSubscriptionId, recoveryUser, expressUpgradeEnabled, isSleepCustomer } = req.body;

        const userRef = db.collection('users').doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const updateData: any = {};
        if (email !== undefined) updateData.email = email.toLowerCase().trim();
        if (username !== undefined) updateData.username = username;
        if (language !== undefined) updateData.language = language;
        if (subscriptionStatus !== undefined) updateData.subscriptionStatus = subscriptionStatus;
        if (wooCommerceSubscriptionId !== undefined) updateData.wooCommerceSubscriptionId = wooCommerceSubscriptionId || null;
        if (recoveryUser !== undefined) updateData.recoveryUser = recoveryUser;
        if (expressUpgradeEnabled !== undefined) updateData.expressUpgradeEnabled = expressUpgradeEnabled;
        if (isSleepCustomer !== undefined) updateData.isSleepCustomer = isSleepCustomer;

        await userRef.update(updateData);

        res.json({ success: true, message: "User updated successfully" });
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/admin/users/:id - Delete user (admin only)
router.delete("/admin/users/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Admin Check
        if (req.user?.email !== 'ricdes@gmail.com') {
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }

        const { id } = req.params;
        const userRef = db.collection('users').doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.data();

        // Also delete from Firebase Auth if exists
        try {
            if (userData?.email) {
                const firebaseUser = await getAuth().getUserByEmail(userData.email);
                await getAuth().deleteUser(firebaseUser.uid);
                console.log(`[Admin] Deleted Firebase Auth user: ${userData.email}`);
            }
        } catch (authError: any) {
            if (authError.code !== 'auth/user-not-found') {
                console.error(`[Admin] Error deleting Firebase Auth user:`, authError);
            }
        }

        // Delete from Firestore
        await userRef.delete();

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
