
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { checkEmailBreach } from "../lib/breach-scanners";
import { sendPushNotification } from "../lib/push-notifier";

const db = getFirestore();

// Runs every day at 2:00 AM
export const scheduledBreachScan = onSchedule("0 2 * * *", async (event) => {
    logger.info("Starting scheduled breach scan (2 AM)...", { timestamp: event.scheduleTime });

    try {
        // Fetch users with monitoring enabled (using new flag structure or root flag)
        // We try to support both for transition: root 'monitoringEnabled' or map 'monitoring.enabled'
        // Firestore query limitations mean we might need separate queries or just one.
        // Let's stick to the plan: `monitoring.enabled` (Map)

        // Note: If you just deploy this, migth need to ensure indexes exist or data structure matches.
        const usersSnapshot = await db.collection("shieldcore_users")
            .where("monitoring.enabled", "==", true)
            .get();

        if (usersSnapshot.empty) {
            logger.info("No users found with monitoring enabled.");
            return;
        }

        let usersScanned = 0;
        let alertsSent = 0;

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const email = userData.email;
            const fcmToken = userData.monitoring?.fcmToken;

            if (!email) continue;

            // Rate limiting: HIBP free tier is 1 req/1.5s approx.
            // We process serially with delay to be safe.
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const breaches = await checkEmailBreach(email);

                if (breaches.length > 0) {
                    const lastBreachCount = userData.lastBreachCount || 0;

                    if (breaches.length > lastBreachCount) {
                        logger.info(`New breaches found for ${email}: ${breaches.length} > ${lastBreachCount}`);

                        // Update user record
                        await doc.ref.update({
                            lastBreachCount: breaches.length,
                            lastScanDate: new Date().toISOString(),
                            // Optional: Store summary of recent breaches
                        });

                        // Send Push Notification
                        if (fcmToken) {
                            await sendPushNotification(fcmToken, breaches.length);
                            alertsSent++;
                        } else {
                            logger.info("No FCM token found for user, skipping push.");
                        }
                    } else {
                        await doc.ref.update({ lastScanDate: new Date().toISOString() });
                    }
                }
            } catch (err) {
                logger.error(`Failed to scan ${email}:`, err);
            }
            usersScanned++;
        }

        logger.info(`Scan complete. Users scanned: ${usersScanned}. Alerts sent: ${alertsSent}.`);

    } catch (error) {
        logger.error("Error during scheduled breach scan:", error);
    }
});
