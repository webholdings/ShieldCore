import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

// Initialize Firebase Admin
if (getApps().length === 0) {
  try {
    // Use process.cwd() for reliable path resolution
    const serviceAccountPath = join(process.cwd(), 'service-account.json');
    const nodeEnv = (process.env.NODE_ENV || '').trim();
    const isDev = nodeEnv === 'development' || !nodeEnv;
    const hasServiceAccount = existsSync(serviceAccountPath);

    console.log(`[DB] Environment: ${nodeEnv || 'development (implicit)'}`);
    console.log(`[DB] Checking for service account at: ${serviceAccountPath}`);
    console.log(`[DB] Service account exists: ${hasServiceAccount}`);

    if (isDev && hasServiceAccount) {
      // Local development: use service account file
      console.log('[DB] Initializing Firebase Admin with service account file');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('[DB] Firebase Admin initialized successfully (Local/File)');
    } else {
      // Production / Cloud Functions: use default credentials
      console.log('[DB] Initializing Firebase Admin with default credentials');

      // Warn if in development but missing service account
      if (isDev) {
        console.warn('\x1b[33m%s\x1b[0m', '[DB] WARNING: Running in development mode without service-account.json.');
        console.warn('\x1b[33m%s\x1b[0m', '[DB] Attempts to verify ID tokens may fail if your environment is not authenticated.');
        console.warn('\x1b[33m%s\x1b[0m', '[DB] Please ensure you have run "gcloud auth application-default login" or place service-account.json in the root.');
      }

      // Check if we are in Cloud Functions environment
      const isCloudEnv = !!(process.env.K_SERVICE || process.env.FUNCTION_NAME);

      // Attempt initialization
      // usage of applicationDefault() locally can hang if no credentials are found,
      // breaking the Firebase CLI deployment "discovery" phase.
      // So we only use it if we are confirmed in Cloud environment or if we want to force it.
      if (isCloudEnv) {
        try {
          initializeApp({
            credential: applicationDefault(),
            projectId: process.env.GCLOUD_PROJECT || 'coreshield-cae1b',
          });
          console.log('[DB] Firebase Admin initialized successfully (Cloud Environment)');
        } catch (err: any) {
          console.error('[DB] Failed to initialize with applicationDefault:', err);
          initializeApp({
            projectId: process.env.GCLOUD_PROJECT || 'coreshield-cae1b',
          });
        }
      } else {
        // Local environment without service account file - do NOT use applicationDefault() to avoid hangs
        // Just initialize with projectId so the app structure loads (for deployment discovery)
        console.log('[DB] Local environment detected (no service-account.json). Skipping applicationDefault() to prevent hangs.');
        initializeApp({
          serviceAccountId: 'firebase-adminsdk-fbsvc@coreshield-cae1b.iam.gserviceaccount.com',
          projectId: 'coreshield-cae1b'
        });
      }
    }

    try {
      const app = getApps()[0];
      // Note: verifying project ID is tricky without making a call, but we can check options if available
      console.log(`[DB] Admin App Name: ${app.name}`);
      // We generally can't see the project ID easily from the app instance without making a call or trusting the creds/options
    } catch (e) {
      console.log('[DB] Could not inspect app details');
    }
  } catch (error: any) {
    console.error('[DB] CRITICAL ERROR initializing Firebase Admin:', error);
    // We do NOT rethrow here to prevent immediate crash, but subsequent DB calls will fail.
    // This allows the server to at least start and log the error.
  }
}

export const db = getFirestore();