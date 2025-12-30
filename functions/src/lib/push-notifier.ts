
import * as admin from 'firebase-admin';
import * as logger from "firebase-functions/logger";

// Ensure admin is initialized (it might be in index.ts, but safe to check/init here if strictly needed, 
// though usually best practice is to pass the app instance or rely on global init).
// We'll assume global admin init in index.ts or top of triggers.

export async function sendPushNotification(fcmToken: string, breachCount: number) {
    if (!fcmToken) return;

    const payload = {
        notification: {
            title: '⚠️ Security Alert: New Breach Detected',
            body: `Your email was found in ${breachCount} new data breach(es). Check ShieldCore now.`
        },
        data: {
            url: '/results',
            type: 'breach_alert'
        },
        token: fcmToken
    };

    try {
        await admin.messaging().send(payload);
        logger.info(`Push notification sent to token ending in ...${fcmToken.slice(-5)}`);
    } catch (error) {
        logger.error("Error sending push notification:", error);
        // Handle invalid tokens (e.g. remove from DB)
    }
}
