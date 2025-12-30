
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { checkEmailBreach } from "../lib/breach-scanners";
import { sendBreachNotification } from "../lib/email-notifier";

const db = getFirestore();

export const scheduledBreachScan = onSchedule("every 24 hours", async (event) => {
    logger.info("Starting scheduled breach scan...", { timestamp: event.scheduleTime });

    try {
        // 1. Fetch all users who have enabled monitoring
        // Assuming we have a 'shieldcore_users' collection and a flag 'monitoringEnabled'
        // For MVP, we might scan all users or just those with emails.
        const usersSnapshot = await db.collection("shieldcore_users").where("monitoringEnabled", "==", true).get();

        if (usersSnapshot.empty) {
            logger.info("No users found with monitoring enabled.");
            return;
        }

        let usersScanned = 0;
        let breachesFound = 0;

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const email = userData.email;

            if (!email) continue;

            // Rate limiting: In a real app, we'd queue these or use a slower loop. 
            // For this free MVP with XposedOrNot, we'll strip simplistic throttling or add a small delay if needed.
            // XposedOrNot is roughly free/permissive but let's be nice.
            await new Promise(resolve => setTimeout(resolve, 500));

            const breaches = await checkEmailBreach(email);

            if (breaches.length > 0) {
                // Check if these breaches are new. 
                // We compare with the last known breach count or store breach IDs.
                // Simplified: If count > lastCount, notify.
                const lastBreachCount = userData.lastBreachCount || 0;

                if (breaches.length > lastBreachCount) {
                    logger.info(`New breaches found for ${email}: ${breaches.length} > ${lastBreachCount}`);

                    // Update user record
                    await doc.ref.update({
                        lastBreachCount: breaches.length,
                        lastScanDate: new Date().toISOString(),
                        breachHistory: breaches // Check size limits in Firestore! Only store latest or summary if huge.
                    });

                    // Send Notification
                    await sendBreachNotification(email, breaches.length);
                    breachesFound++;
                } else {
                    // Just update scan date
                    await doc.ref.update({ lastScanDate: new Date().toISOString() });
                }
            }
            usersScanned++;
        }

        logger.info(`Scan complete. Users scanned: ${usersScanned}. New alerts: ${breachesFound}.`);

    } catch (error) {
        logger.error("Error during scheduled breach scan:", error);
    }
});
