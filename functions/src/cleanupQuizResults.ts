import { onSchedule } from "firebase-functions/v2/scheduler";
import { storage } from "../../server/storage";
import { log } from "../../server/log";

/**
 * Scheduled function to clean up unlinked quiz results older than 7 days
 * Runs daily at 02:00 UTC
 */
export const cleanupQuizResults = onSchedule({
    schedule: "0 2 * * *", // Daily at 2 AM UTC
    timeZone: "UTC",
    region: "us-central1",
}, async (event) => {
    try {
        log(`[Quiz Cleanup] Starting cleanup of unlinked quiz results older than 7 days`);

        const deletedCount = await storage.cleanupUnlinkedQuizResults(7);

        log(`[Quiz Cleanup] Completed. Deleted ${deletedCount} unlinked quiz results`);
    } catch (error: any) {
        console.error("[Quiz Cleanup] Error during cleanup:", error);
        throw error;
    }
});
