# CreativeWaves - Cognitive Wellness Platform

## Overview
CreativeWaves is a cognitive wellness platform designed for senior adults, offering therapeutic audio sessions, brain training games, and mood tracking. It focuses on accessibility with large touch targets, high contrast, and multilingual support (English, German, French, Portuguese), adhering to Material Design 3 principles for a calming and therapeutic user experience. The platform aims to improve cognitive health and emotional well-being through engaging and accessible digital tools. User acquisition is managed through WooCommerce subscriptions, providing a streamlined and secure onboarding process.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: React with TypeScript, Vite, Shadcn/ui (Radix UI), Tailwind CSS, Wouter, TanStack Query, React Hook Form with Zod.
- **Design System**: Material Design 3 adapted for seniors, custom HSL color palette (light/dark modes), large touch targets (min 48px), high contrast ratios, Inter font, custom CSS variables for theming.
- **Component Structure**: Modular, reusable components; Context-based providers for Language, Theme, User; isolated game components; centralized audio player; emoji-based mood tracker.
- **Navigation**: Shadcn/ui sidebar with grouped navigation (Wellness, Learning, Brain Training, Account sections) for organizing 8+ application pages. Uses wouter Link components for SPA navigation without page reloads. Active state detection handles nested routes (e.g., /courses remains active on /courses/:id). Fully multilingual with translations for all sidebar sections across 4 languages.

### Backend Architecture
- **Server Framework**: Express.js with TypeScript on Node.js (ESM), custom error handling, request/response logging.
- **API Design**: RESTful endpoints (`/api`), webhook support for external payment systems (`/api/webhook`), server-side validation/scoring for IQ tests.
- **Data Layer**: Drizzle ORM for type-safe database operations, schema-first approach with shared client/server types, Zod validation, Neon serverless driver for connection pooling.
- **Authentication**: Passwordless magic link authentication with 15-minute expiration, one-time use tokens, and 30-day session cookie persistence. All emails (welcome, magic link) are internationalized. Magic link URLs automatically adapt to environment using APP_URL environment variable (custom domain override), REPLIT_DOMAINS (deployed apps), REPLIT_DEV_DOMAIN (development), or localhost fallback. Set APP_URL=https://app2.creativewaves.me in production to use custom domain in magic links.

### Database Schema
- **Tables**: `users` (auth, preferences, audio progress), `moodEntries` (mood tracking), `gameScores` (game performance), `iqQuestions` (multilingual IQ test pool with language column), `iqTestSessions` (completed tests), `iqTestAnswers` (individual answers), `courses` (multilingual course data), `lessons` (multilingual lesson content with optional videoUrl for YouTube embeds), `userLessonProgress` (lesson completion tracking).
- **Design Decisions**: PostgreSQL with Neon serverless for scalability, UUID primary keys, timestamp-based tracking, soft schema for flexibility.
- **Multilingual Schema**: Courses, lessons, and IQ questions tables include language column ("en", "de", "fr", "pt") for content filtering based on user preferences.
- **Content Richness**: Lessons support markdown formatting and optional YouTube video URLs for enhanced educational experience.

### Key Features
- **Internationalization**: Full support for English, German, French, Portuguese across all core user-facing strings, including authentication/login screen, emails, IQ test, audio player, courses, dashboard, profile, and support pages. All user-facing content is fully translated.
- **IQ Test**: Fully multilingual with 200 total questions (50 per language) across 5 cognitive areas (Pattern Recognition, Logical Reasoning, Mathematical Skills, Verbal Reasoning, Spatial Reasoning). Questions are automatically filtered by user's language preference. Randomized 20-question sessions with server-side scoring and history tracking.
- **Course Content**: Educational content for 4 life improvement courses (Nutrition for Brain Health, Sleep for Cognitive Performance, Physical Exercise and Brain Health, Stress Management for Mental Clarity) with 10 lessons each. **Content Status**: English has full 850-1000 word lessons with markdown formatting (Overview, Key Takeaways, Action Steps) and optional YouTube video embeds for first 5 lessons of each course. **German, French, and Portuguese**: Full translations completed for Nutrition course lessons 1-5 (2,000-3,500 characters each with markdown formatting). Remaining lessons (6-10 across all courses, and Sleep/Exercise/Stress courses) have brief descriptions (~150 chars). Content is filtered server-side based on user's language preference. Senior-friendly language and lesson completion tracking included.
- **Brain Training Games**: 6 cognitive games including Word Association (75-100 word pairs per language with Easy/Medium/Hard difficulty levels, automatic reshuffling after completion), Memory Match, Pattern Sequence, Number Sequence, Visual Search, and Reaction Time. Games adapt to user's language preference with multilingual content.
- **Dashboard**: Optimized for mobile with full-width sections (no Card wrappers on mobile), large buttons, interactive mood selector, and quick action icons with meaningful colors. Desktop maintains Card-based visual separation.
- **Magic Link Authentication**: Passwordless login via /auth/magic-link route that verifies tokens and establishes secure sessions with proper error handling. Login page is fully internationalized with buy access link to https://buy.creativewaves.me.

## Database Management

### Development vs Production Databases
- **Separate Databases**: Development and production use completely separate PostgreSQL databases
- **Schema Sync**: When publishing, database schema changes (tables, columns) are automatically synced to production
- **Data NOT Synced**: Database content (users, courses, lessons, IQ questions) is NOT copied between environments

### Production Database Seeding
Static content (courses, lessons, IQ questions) must be manually seeded in production:

**Method 1: API Endpoint (Recommended)**
```bash
curl -X POST https://creative-waves-ricardoreplit2.replit.app/api/admin/seed-database
```
- Only works in production or when `ALLOW_DATABASE_SEEDING=true` environment variable is set
- Idempotent: safe to run multiple times, skips existing content
- Seeds: 16 courses (4 languages), 160 lessons (4 languages), 200 multilingual IQ questions (50 per language)

**Method 2: Run Seed Scripts Directly**
```bash
tsx server/seed-courses-multilingual.ts       # Seeds courses and lessons
tsx server/seed-iq-questions-multilingual.ts  # Seeds multilingual IQ questions
```

### What Gets Seeded
- **16 Courses**: 4 life improvement courses × 4 languages (en, de, fr, pt)
- **160 Lessons**: 40 lesson translations × 4 languages
- **200 IQ Questions**: 50 questions per language (en, de, fr, pt) across 5 cognitive areas (pattern, logic, math, verbal, spatial)

## External Dependencies

- **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`). Separate development and production databases with automatic schema synchronization on publish.
- **Audio Hosting**: External audio files hosted at `creativewaves.me/audiofiles/`.
- **Email Service**: Brevo SMTP API (for sending internationalized welcome and magic link emails).
- **UI Component Library**: Radix UI (primitives), Shadcn/ui (components).
- **Payment Integration**: WooCommerce at buy.creativewaves.me for subscription management. Webhooks handle subscription creation and cancellation with HMAC-SHA256 signature verification. Users can manage subscriptions via external link at https://buy.creativewaves.me/my-account/.
- **Development Tools**: Replit-specific plugins, runtime error overlay, development banner, code cartographer.