---
description: WooCommerce Subscription Integration
---

# WooCommerce Subscription Integration

This workflow describes the integration of WooCommerce subscriptions into the CreativeWaves app.

## Overview

The integration allows users to:
- View their subscription status in the app (Profile page)
- Pause, Resume, and Cancel their subscription directly from the app
- Handle "Grandfathered" users (active status but no WooCommerce subscription ID)

## Components

### Backend
- **Service**: `server/woocommerce.ts` - Handles communication with WooCommerce REST API.
- **Routes**: `server/routes.ts`
  - `GET /api/subscription/status`
  - `POST /api/subscription/pause`
  - `POST /api/subscription/resume`
  - `POST /api/subscription/cancel`
  - Webhooks: `/api/webhook/subscription-created`, `/api/webhook/subscription-cancelled`
- **Storage**: `server/storage.ts` - Updated `User` schema to include `wooCommerceSubscriptionId`.

### Frontend
- **Component**: `client/src/components/SubscriptionManager.tsx` - UI for managing subscriptions.
- **Page**: `client/src/pages/Profile.tsx` - Integrated the manager component.
- **Admin**: `client/src/pages/AdminUserManagement.tsx` - Added fields to manually set subscription details for new users.

## Configuration

Environment variables required in `.env` (and Firebase Functions config):
```bash
WOOCOMMERCE_URL=https://buy.creativewaves.me
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
```

## Testing

A test script is available at `scripts/test-subscriptions.ts`.
Run it with:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
WOOCOMMERCE_URL=https://buy.creativewaves.me \
WOOCOMMERCE_CONSUMER_KEY=... \
WOOCOMMERCE_CONSUMER_SECRET=... \
npx tsx scripts/test-subscriptions.ts
```

## Translations

Translations for subscription management have been added to `client/src/lib/i18n.ts` for:
- English (en)
- German (de)
- French (fr)
- Portuguese (pt)
