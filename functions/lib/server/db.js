import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// Initialize Firebase Admin
if (getApps().length === 0) {
    // In Cloud Functions, this uses default credentials.
    // Locally, ensure GOOGLE_APPLICATION_CREDENTIALS is set or use a service account.
    initializeApp();
}
export const db = getFirestore();
//# sourceMappingURL=db.js.map