import { Router, Response } from "express";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";
import { insertThoughtJournalEntrySchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Get Journal Entries
router.get("/journal", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const entries = await storage.getThoughtJournalEntries(req.user!.id);
        res.json(entries);
    } catch (error: any) {
        console.error("Error fetching journal entries:", error);
        res.status(500).json({ error: error.message });
    }
});

// Create Journal Entry
router.post("/journal", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const entryData = insertThoughtJournalEntrySchema.parse({
            ...req.body,
            userId: req.user!.id
        });

        const entry = await storage.createThoughtJournalEntry(entryData);
        res.status(201).json(entry);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error("Error creating journal entry:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
