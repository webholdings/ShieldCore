import { Router, Response } from "express";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";

const router = Router();

// GET /api/sleep-entries
router.get("/sleep-entries", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const entries = await storage.getRecentSleepEntries(req.user!.id, 7);
        res.json(entries);
    } catch (error: any) {
        console.error("Error fetching sleep entries:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/sleep-entries
router.post("/sleep-entries", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const entry = await storage.createSleepEntry({
            userId: req.user!.id,
            ...req.body
        });
        res.json(entry);
    } catch (error: any) {
        console.error("Error creating sleep entry:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sleep-progress
router.get("/sleep-progress", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const progress = await storage.getSleepProgramProgress(req.user!.id);
        res.json(progress || { completedDays: [] });
    } catch (error: any) {
        console.error("Error fetching sleep progress:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/sleep-progress
router.put("/sleep-progress", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { completedDays } = req.body;
        const progress = await storage.updateSleepProgramProgress(req.user!.id, completedDays);
        res.json(progress);
    } catch (error: any) {
        console.error("Error updating sleep progress:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/sleep-coach
router.post("/sleep-coach", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        if (!GOOGLE_API_KEY) {
            // Return heuristic advice if API key not available
            return res.json({
                advice: "Based on your sleep patterns, try to maintain a consistent bedtime and avoid screens 1 hour before bed.",
                source: "heuristic"
            });
        }

        // Get user's recent sleep entries
        const entries = await storage.getRecentSleepEntries(req.user!.id, 7);
        const userLanguage = req.user!.language || 'en';
        const { question } = req.body; // Optional specific question from user

        // Prepare sleep data summary for context
        let sleepSummary = "No sleep data available yet.";
        if (entries.length > 0) {
            const avgEfficiency = entries.reduce((sum, e) => sum + e.sleepEfficiency, 0) / entries.length;
            const avgSleepHours = entries.reduce((sum, e) => sum + e.totalSleepHours, 0) / entries.length;
            const avgQuality = entries.reduce((sum, e) => sum + e.sleepQuality, 0) / entries.length;

            sleepSummary = `User's sleep data for the past ${entries.length} days:
- Average sleep efficiency: ${(avgEfficiency * 100).toFixed(1)}%
- Average sleep duration: ${avgSleepHours.toFixed(1)} hours
- Average sleep quality (1-5): ${avgQuality.toFixed(1)}
- Most recent bedtime: ${entries[0].bedtime}
- Most recent wake time: ${entries[0].finalWakeTime}
- Average time to fall asleep: ${(entries.reduce((sum, e) => sum + e.sleepOnsetMinutes, 0) / entries.length).toFixed(0)} minutes
- Average awakenings per night: ${(entries.reduce((sum, e) => sum + e.awakeningsCount, 0) / entries.length).toFixed(1)}`;
        }

        // Language instructions
        const languageMap: Record<string, string> = {
            'en': 'English',
            'de': 'German',
            'fr': 'French',
            'pt': 'Portuguese'
        };
        const targetLanguage = languageMap[userLanguage] || 'English';

        // Build prompt
        const prompt = `You are a warm, supportive Sleep Coach AI for adults aged 45-70 who want to improve their sleep quality using cognitive behavioral therapy for insomnia (CBT-I) techniques.

SLEEP DATA:
${sleepSummary}

${question ? `USER'S QUESTION: ${question}` : ''}

INSTRUCTIONS:
1. Respond in ${targetLanguage}
2. Be warm, encouraging, and supportive - like a knowledgeable friend
3. Keep response concise (2-3 paragraphs max)
4. Provide specific, actionable advice based on their data
5. Reference evidence-based sleep hygiene and CBT-I techniques
6. If sleep efficiency is below 85%, suggest sleep restriction therapy
7. Avoid medical diagnoses - recommend consulting a doctor for persistent issues
8. End with one clear action step they can take tonight

${question ? 'Answer their specific question while incorporating relevant sleep advice.' : 'Provide personalized advice based on their sleep patterns.'}`;

        // Call Gemini API
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const advice = response.text().trim();

        res.json({ advice, source: "gemini" });
    } catch (error: any) {
        console.error("Sleep coach error:", error);
        // Fallback to heuristic advice
        res.json({
            advice: "I'm having trouble connecting right now. In the meantime, try these tips: maintain a consistent sleep schedule, create a relaxing bedtime routine, and keep your bedroom cool and dark.",
            source: "fallback"
        });
    }
});

export default router;
