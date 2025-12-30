import { Router, Response } from "express";
import crypto from "crypto";
import { insertGameScoreSchema } from "@shared/schema";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";

const router = Router();

// Game score endpoints (authenticated)
router.post("/game/score", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const validated = insertGameScoreSchema.parse({
            ...req.body,
            userId: req.user!.id
        });
        const score = await storage.createGameScore(validated);
        res.json(score);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/game/scores", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { gameType } = req.query;
        const scores = await storage.getGameScores(req.user!.id, gameType as string);
        res.json(scores);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// IQ Test endpoints
router.get("/iq-test/questions", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const count = parseInt(req.query.count as string) || 20;
        const userLanguage = req.user?.language || 'en';
        const questions = await storage.getRandomIQQuestions(count, userLanguage);
        res.json(questions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/iq-test/submit", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
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
            if (!question) continue;

            const isCorrect = answer.userAnswer === question.correctAnswer ? 1 : 0;
            if (isCorrect) correctAnswers++;

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
            userId: req.user!.id,
            totalQuestions,
            correctAnswers,
            score,
            completedAt: new Date()
        });

        for (const answerData of answerResults) {
            await storage.saveIQTestAnswer(answerData);
        }

        res.json(session);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/iq-test/history", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sessions = await storage.getIQTestSessions(req.user!.id);
        res.json(sessions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/iq-test/session/:sessionId", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const session = await storage.getIQTestSession(req.params.sessionId);
        if (!session || session.userId !== req.user!.id) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json(session);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/iq-test/answers/:sessionId", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const answers = await storage.getIQTestAnswers(req.params.sessionId);
        res.json(answers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Alias for consistency
router.get("/iq-test/session/:id/answers", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const answers = await storage.getIQTestAnswers(req.params.id);
        res.json(answers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
