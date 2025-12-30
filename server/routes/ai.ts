import { Router, Response } from "express";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";
import { extractImportantQuestions } from "../quizHelpers";

const router = Router();

// AI Assistant Chat endpoint
router.post("/chat", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { message, language } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const userId = req.user!.id;
        const userLanguage = language || req.user!.language || 'en';

        // Rate limiting
        const recentCount = await storage.getRecentChatCount(userId);
        if (recentCount >= 10) {
            return res.status(429).json({ error: "Rate limit exceeded. You can send 10 messages per hour." });
        }

        // Crisis check
        const crisisKeywords = ["suicide", "kill myself", "end it all", "hurt myself", "die", "selbstmord", "umbringen", "sterben", "suicidio", "tuer"];
        if (crisisKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            let crisisResponse = "";

            if (userLanguage === 'de') {
                crisisResponse = "Ich bin ein KI-Assistent und kann keine Krisenunterstützung bieten. Wenn Sie in Not sind, wenden Sie sich bitte sofort an eine Hotline.\n\nDeutschland: 0800 111 0 111 (TelefonSeelsorge)\nInternational: [Find A Helpline](https://findahelpline.com/)";
            } else if (userLanguage === 'fr') {
                crisisResponse = "Je suis un assistant IA et je ne peux pas fournir de soutien en cas de crise. Si vous êtes en détresse, veuillez contacter immédiatement une ligne d'assistance.\n\nFrance: 3114 (Suicide Écoute)\nInternational: [Find A Helpline](https://findahelpline.com/)";
            } else {
                crisisResponse = "I am an AI assistant and cannot provide crisis support. If you are in distress, please contact a helpline immediately.\n\nUSA: 988 (Suicide & Crisis Lifeline)\nUK: 111 (NHS) or 116 123 (Samaritans)\nInternational: [Find A Helpline](https://findahelpline.com/)";
            }

            // Count this as a message for rate limiting
            await storage.incrementChatCount(userId);
            return res.json({ response: crisisResponse });
        }

        // Admin Check - Temporary restriction
        if (req.user?.email !== 'ricdes@gmail.com') {
            return res.status(403).json({ error: "AI Assistant is currently under maintenance. Please try again later." });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("OPENROUTER_API_KEY is not configured");
            return res.status(500).json({ error: "AI service configuration missing. Please contact support." });
        }

        // Fetch quiz insights
        const quizResult = await storage.getQuizResultByUserId(userId);
        const quizInsights = extractImportantQuestions(quizResult);

        let systemPrompt = "You are a conservative, growth-oriented, mindfulness-focused AI assistant. You encourage personal responsibility, resilience, and traditional values of discipline and self-improvement. You are supportive but firm. You avoid woke ideology and focus on practical, evidence-based advice for mental wellness and cognitive improvement. You MUST respond in the following language: " + userLanguage + ".";

        if (quizInsights.age || quizInsights.cognitiveStruggles || quizInsights.improvementGoals) {
            systemPrompt += "\n\nUser Profile based on Quiz Results:";
            if (quizInsights.age) systemPrompt += "\n- Age Group: " + quizInsights.age;
            if (quizInsights.cognitiveStruggles) systemPrompt += "\n- Cognitive Struggles: " + quizInsights.cognitiveStruggles;
            if (quizInsights.improvementGoals) systemPrompt += "\n- Improvement Goals: " + quizInsights.improvementGoals.join(", ");
            systemPrompt += "\n\nUse this information to personalize your advice, but do not explicitly mention \"according to your quiz results\" unless relevant.";
        }

        // Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey,
                "HTTP-Referer": "https://creativewaves.app", // Optional, for including your app on openrouter.ai rankings.
                "X-Title": "CreativeWaves" // Optional. Shows in rankings on openrouter.ai.
            },
            body: JSON.stringify({
                model: "x-ai/grok-4.1-fast",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    { role: "user", content: message }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", errorText);
            return res.status(500).json({ error: "Failed to get response from AI" });
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Increment count for rate limiting
        await storage.incrementChatCount(userId);

        res.json({ response: aiResponse });
    } catch (error: any) {
        console.error("Chat error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
