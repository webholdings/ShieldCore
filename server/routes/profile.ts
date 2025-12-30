import { Router, Response } from "express";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";

const router = Router();

// Quiz insights endpoint (authenticated)
router.get("/quiz-insights", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const quizResult = await storage.getQuizResultByUserId(req.user!.id);

        if (!quizResult) {
            return res.json({
                hasQuizData: false,
                insights: {
                    age: null,
                    cognitiveStruggles: null,
                    improvementGoals: null,
                    rawAnswers: []
                }
            });
        }

        const { extractImportantQuestions } = await import("../quizHelpers");
        const insights = extractImportantQuestions(quizResult);

        res.json({
            hasQuizData: true,
            insights
        });
    } catch (error: any) {
        console.error("Error fetching quiz insights:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update user language preference
router.patch("/language", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { language } = req.body;
        const validLanguages = ['en', 'de', 'fr', 'pt'];

        if (!language || !validLanguages.includes(language)) {
            return res.status(400).json({ error: "Invalid language selection" });
        }

        const updatedUser = await storage.updateUserLanguage(req.user!.id, language);
        res.json(updatedUser);
    } catch (error: any) {
        console.error("Error updating user language:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update user chronotype
router.patch("/chronotype", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { chronotype } = req.body;
        const validChronotypes = ['bear', 'wolf', 'lion', 'dolphin'];

        if (!chronotype || !validChronotypes.includes(chronotype)) {
            return res.status(400).json({ error: "Invalid chronotype selection" });
        }

        const updatedUser = await storage.updateUserChronotype(req.user!.id, chronotype);
        res.json(updatedUser);
    } catch (error: any) {
        console.error("Error updating user chronotype:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start Detox
router.post("/start-detox", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const updatedUser = await storage.updateUserDetoxStart(req.user!.id, new Date());
        res.json(updatedUser);
    } catch (error: any) {
        console.error("Error starting detox:", error);
        res.status(500).json({ error: error.message });
    }
});

// Track Panic Button Usage
router.post("/panic-usage", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const updatedUser = await storage.updateUserPanicUsage(req.user!.id);
        res.json(updatedUser);
    } catch (error: any) {
        console.error("Error tracking panic usage:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
