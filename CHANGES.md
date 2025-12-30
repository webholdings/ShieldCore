# ShieldCore - Changes Summary

## Frontend
- **Rebranding**: Updated Tailwind colors, logo references, and app titles for "ShieldCore".
- **Security Dashboard**: New main landing page (`/dashboard`) showcasing security score, alerts, and quick actions.
- **Scan Page**: New page (`/scan`) to initiate breach checks.
- **Results Page**: New page (`/results`) displaying scan findings (safe/compromised counts, timeline).
- **Security Checkup**: New quiz (`/security-checkup`) to calculate security behavior score.
- **Navigation**: Cleaned up sidebar to hide legacy "CreativeWaves" modules.

## Backend (Server)
- **Breach Scan API**: Added `POST /api/breach-scan` mock endpoint in `server/routes.ts`.
- **Auth**: Updated `auth.ts` to support new user properties (`detoxStartDate` fix).

## Backend (Cloud Functions)
- **Continuous Monitoring**: 
  - `functions/src/triggers/scheduled-scan.ts`: Daily Cron job to scan emails.
  - `functions/src/lib/breach-scanners.ts`: Integration with free XposedOrNot API.
  - `functions/src/lib/email-notifier.ts`: Email notification system using Brevo.
- **Index**: Wired up new scheduled function.

## Verification
1. **Manual**: Login -> Dashboard -> Scan -> Results.
2. **Automated**: Cron job runs daily at midnight.
