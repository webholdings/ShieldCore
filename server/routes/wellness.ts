import { Router, Response } from "express";
import { z } from "zod";
import { insertMoodEntrySchema, insertAddictionSchema, insertAddictionCheckinSchema } from "@shared/schema";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";

const router = Router();

// Mood entry endpoints (authenticated)
router.post("/mood", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log("Received mood entry request:", req.body);
        console.log("User ID:", req.user!.id);

        const validated = insertMoodEntrySchema.parse({
            ...req.body,
            userId: req.user!.id
        });

        console.log("Validated mood entry:", validated);

        const entry = await storage.createMoodEntry(validated);
        console.log("Created mood entry:", entry);

        res.json(entry);
    } catch (error: any) {
        console.error("Error creating mood entry:", error);
        if (error instanceof z.ZodError) {
            console.error("Validation error:", JSON.stringify(error.errors, null, 2));
        }
        res.status(400).json({ error: error.message });
    }
});

router.get("/mood", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const entries = await storage.getMoodEntries(req.user!.id);
        res.json(entries);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/mood/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { mood, note } = req.body;
        const entry = await storage.updateMoodEntry(req.params.id, mood, note);
        res.json(entry);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/mood/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        await storage.deleteMoodEntry(req.params.id);
        res.sendStatus(200);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Daily plan endpoints (authenticated)
router.post("/daily-plan/complete-task", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { task, status, date } = req.body;
        const validTasks = ['thetaAudioCompleted', 'breathingCompleted', 'gameCompleted', 'moodCompleted'];

        if (!task || !validTasks.includes(task)) {
            return res.status(400).json({ error: "Invalid task" });
        }

        // Default to 1 (completed) if status not provided, allow 2 for skipped
        const completionStatus = status === 'skipped' ? 2 : 1;

        // Use provided date or fallback to UTC
        const planDate = date || new Date().toISOString().split('T')[0];

        // Fetch current plan BEFORE updating to check if it was already complete
        const previousPlan = await storage.getDailyPlan(req.user!.id, planDate);

        let plan = await storage.updateDailyPlanTask(req.user!.id, planDate, task, completionStatus);

        // Check if all tasks are completed
        const allCompleted =
            plan.moodCompleted &&
            plan.thetaAudioCompleted &&
            plan.breathingCompleted &&
            plan.gameCompleted;

        let pointsAwarded = 0;
        let newStreak = undefined;

        if (allCompleted) {
            // Check if this was the FIRST time completing all tasks today
            const previouslyIncomplete = !previousPlan ||
                !previousPlan.moodCompleted ||
                !previousPlan.thetaAudioCompleted ||
                !previousPlan.breathingCompleted ||
                !previousPlan.gameCompleted;

            // Only award points if this completion made it go from incomplete to complete
            if (previouslyIncomplete) {
                const POINTS_FOR_DAILY_PLAN = 50;
                pointsAwarded = POINTS_FOR_DAILY_PLAN;

                const currentPoints = req.user!.totalPoints || 0;
                await storage.updateUserPoints(req.user!.id, currentPoints + POINTS_FOR_DAILY_PLAN);

                const user = await storage.getUser(req.user!.id);
                if (user) {
                    const currentStreak = user.streakCount || 0;
                    newStreak = currentStreak + 1;
                    await storage.updateUserStreak(user.id, newStreak);
                }
            }
        }

        res.json({ ...plan, pointsAwarded, newStreak });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/daily-plan/reset", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // Reset all tasks to 0
        await storage.updateDailyPlanTask(req.user!.id, today, 'moodCompleted', 0);
        await storage.updateDailyPlanTask(req.user!.id, today, 'thetaAudioCompleted', 0);
        await storage.updateDailyPlanTask(req.user!.id, today, 'breathingCompleted', 0);
        const plan = await storage.updateDailyPlanTask(req.user!.id, today, 'gameCompleted', 0);

        res.json(plan);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/daily-plan", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { date } = req.query;
        const planDate = (date as string) || new Date().toISOString().split('T')[0];
        const plan = await storage.getDailyPlan(req.user!.id, planDate);

        // Return existing plan or default empty plan
        res.json(plan || {
            date: planDate,
            thetaAudioCompleted: 0,
            breathingCompleted: 0,
            gameCompleted: 0,
            moodCompleted: 0
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Journal endpoints (authenticated) - DISABLED
router.post("/journal", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
});

router.get("/journal", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
});

router.patch("/journal/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
});

router.delete("/journal/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
});

router.get("/journal/:id", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
});


// Addiction Recovery endpoints (authenticated)
router.post("/addictions", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const validated = insertAddictionSchema.parse({
            ...req.body,
            userId: req.user!.id
        });
        const addiction = await storage.createAddiction(validated);
        res.json(addiction);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/addictions", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const addictions = await storage.getUserAddictions(req.user!.id);
        res.json(addictions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/addictions/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const addiction = await storage.getAddiction(req.params.id);
        if (!addiction) return res.sendStatus(404);
        if (addiction.userId !== req.user!.id) return res.sendStatus(403);
        res.json(addiction);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/addictions/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const addiction = await storage.getAddiction(req.params.id);
        if (!addiction) return res.sendStatus(404);
        if (addiction.userId !== req.user!.id) return res.sendStatus(403);

        const updated = await storage.updateAddiction(req.params.id, req.body);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/addictions/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const addiction = await storage.getAddiction(req.params.id);
        if (!addiction) return res.sendStatus(404);
        if (addiction.userId !== req.user!.id) return res.sendStatus(403);

        await storage.deleteAddiction(req.params.id);
        res.sendStatus(200); // Or 204
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/addictions/:id/checkin", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const addiction = await storage.getAddiction(req.params.id);
        if (!addiction) return res.sendStatus(404);
        if (addiction.userId !== req.user!.id) return res.sendStatus(403);

        const validated = insertAddictionCheckinSchema.parse({
            ...req.body,
            addictionId: req.params.id
        });

        const checkin = await storage.logAddictionCheckin(validated);

        // If checkin status is 'relapsed', update the lastRelapseDate
        if (validated.status === 'relapsed') {
            await storage.updateAddiction(req.params.id, {
                lastRelapseDate: new Date()
            });
        }

        res.json(checkin);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/addictions/:id/checkins", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const addiction = await storage.getAddiction(req.params.id);
        if (!addiction) return res.sendStatus(404);
        if (addiction.userId !== req.user!.id) return res.sendStatus(403);

        const checkins = await storage.getAddictionCheckins(req.params.id);
        res.json(checkins);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
