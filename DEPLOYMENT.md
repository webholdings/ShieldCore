# ShieldCore Deployment & Migration Guide

## 1. Environment Variables
Setup the following secrets in your Firebase project and GitHub Actions:

### Firebase Functions Config
Run these commands to set up the environment for Cloud Functions:

```bash
# Brevo (Sendinblue) API Key for emails
firebase functions:config:set shieldcore.brevo_key="YOUR_BREVO_API_KEY"

# Optional: If you upgrade to HIBP Enterprise
firebase functions:config:set shieldcore.hibp_key="YOUR_HIBP_KEY"
```

### GitHub Secrets
Ensure these are set in your GitHub repository secrets for the deployment workflow:
- `FIREBASE_SERVICE_ACCOUNT_CORESHIELD_CAE1B`
- `FIREBASE_TOKEN`

## 2. Deploying Backend
To deploy the new Cloud Functions (including the scheduled breach scanner):

```bash
# Install dependencies
cd functions
npm install

# Deploy Functions
cd ..
firebase deploy --only functions
```

## 3. Database Migration
The new features use the following Firestore collections:
- `shieldcore_users` (Updated user profiles)
- `breach_history` (Stores historic scan results)

No manual data migration is needed for the MVP, as new data will be cultivated by the `scheduledBreachScan` function.

## 4. Verification
1. **Trigger Scan**: You can manually trigger the scheduled function for testing:
   ```bash
   firebase functions:shell
   > scheduledBreachScan()
   ```
2. **Check Logs**: View logs in Firebase Console > Functions > Logs to verify "Scan complete".
