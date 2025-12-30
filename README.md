# CreativeWaves - Cognitive Wellness Platform

A multilingual Progressive Web App (PWA) designed for senior adults to enhance cognitive performance through therapeutic audio sessions, brain training games, mood tracking, and educational courses.

## 🌟 Features

### Wellness Activities
- **13 Guided Theta Audio Sessions** - Therapeutic audio experiences for relaxation and focus
- **6 Brain Training Games**
  - Memory Match
  - Pattern Sequence
  - Word Association (75-100 word pairs per language)
  - Number Sequence
  - Visual Search
  - Reaction Time
- **Mood Tracker** - Daily mood logging with emoji-based interface and full editing capabilities
- **Breathing Exercises** - Guided breathing sessions
- **Daily Plan System** - Track 4 wellness tasks that reset daily at midnight GMT

### Learning & Assessment
- **4 Life Improvement Courses**
  - Nutrition for Brain Health
  - Sleep for Cognitive Performance
  - Physical Exercise and Brain Health
  - Stress Management for Mental Clarity
  - 10 lessons each with markdown content and optional YouTube video embeds
- **Multilingual IQ Test** - 200 questions (50 per language) across 5 cognitive areas
  - Pattern Recognition
  - Logical Reasoning
  - Mathematical Skills
  - Verbal Reasoning
  - Spatial Reasoning

### Accessibility & Internationalization
- **Full multilingual support**: English, German, French, Portuguese
- **Senior-friendly design**: Large touch targets (min 48px), high contrast, Material Design 3
- **Responsive**: Mobile-first design with desktop optimization
- **Dark/Light mode** support

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Shadcn/ui** + **Radix UI** - Component library
- **Tailwind CSS** - Styling
- **React Hook Form** + **Zod** - Form validation

### Backend
- **Node.js** with Express
- **Firebase Firestore** - Cloud database
- **Firebase Admin SDK** - Server-side Firebase operations
- **Firebase Auth** - Authentication service
- **Brevo SMTP API** - Email service (welcome emails)

### Authentication
- **Passwordless Email Login** - Users log in with just their email if they have an active subscription
- **Google Sign-In** - Supported for admin accounts
- **Firebase Custom Tokens** - Secure session management
- No passwords or magic links required for end users
- **Subscription Required** - Active subscription status checked before allowing login

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Brevo account for email service
- WooCommerce store for subscription management (optional)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd creativewaves
npm install
```

### 2. Set up environment variables
Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database (required)
DATABASE_URL=postgresql://user:password@host:5432/database

# Session secret (required)
SESSION_SECRET=your-random-session-secret-here

# Email service (required for welcome emails)
BREVO_API_KEY=your-brevo-api-key

# WooCommerce webhook verification (optional)
WOOCOMMERCE_WEBHOOK_SECRET=your-webhook-secret

# App URL for email links (production)
APP_URL=https://app.creativewaves.me

# Production flag
NODE_ENV=production
```

### 3. Set up the database

#### Option A: Using Drizzle Push (Recommended)
```bash
npm run db:push
```

#### Option B: Manual SQL Migration
Run the SQL migration file:
```bash
psql $DATABASE_URL -f database-migration.sql
```

### 4. Seed static content
The app requires courses, lessons, and IQ questions. Seed them using:

```bash
# Seed all content (courses, lessons, IQ questions)
tsx server/seed-courses-multilingual.ts
tsx server/seed-iq-questions-multilingual.ts
```

Or use the API endpoint (production only):
```bash
curl -X POST https://your-app-url.com/api/admin/seed-database
```

### 5. Create admin users
Users are created via WooCommerce webhooks when someone subscribes. To manually create a user:

```sql
INSERT INTO users (username, password, email, language, subscription_status)
VALUES (
  'user@example.com',
  'no_password_needed',
  'user@example.com',
  'en',
  'active'
);
```

### 6. Run the application

**Development:**
```bash
npm run dev
```
App runs on http://localhost:5000

**Production:**
```bash
npm run build
npm start
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with subscription status
- `mood_entries` - Mood tracking data
- `game_scores` - Brain game performance
- `courses` - Educational course metadata (multilingual)
- `lessons` - Course lesson content (multilingual)
- `user_lesson_progress` - Lesson completion tracking
- `iq_questions` - IQ test question pool (multilingual)
- `iq_test_sessions` - Completed IQ tests
- `iq_test_answers` - Individual test answers
- `daily_plan_progress` - Daily task completion tracking

### Multilingual Content
Courses, lessons, and IQ questions include a `language` field (`en`, `de`, `fr`, `pt`) for filtering content by user preference.

## 🔗 External Integrations

### WooCommerce Webhooks
The app receives webhook notifications from WooCommerce:
- **Subscription Created** → Creates user account, activates subscription, sends welcome email
- **Subscription Cancelled** → Deactivates user subscription

Webhook endpoints:
- `POST /api/webhook/subscription-created`
- `POST /api/webhook/subscription-cancelled`

Both use HMAC-SHA256 signature verification for security.

### Audio Hosting
External audio files hosted at: `https://creativewaves.me/audiofiles/`

### Payment Management
Users manage subscriptions at: `https://buy.creativewaves.me/my-account/`

## 📝 API Endpoints

### Authentication
- `POST /api/simple-login` - Email-only login (checks DB and subscription status, creates Firebase custom token)
- `GET /api/user` - Get current user (requires Firebase auth token)
- Admin users use Google Sign-In

### Content
- `GET /api/courses` - List courses (filtered by language)
- `GET /api/courses/:id` - Get course with lessons
- `GET /api/iq-test/questions` - Get randomized IQ test questions
- `POST /api/iq-test/submit` - Submit IQ test

### User Data
- `GET /api/mood` - Get mood entries
- `POST /api/mood` - Create mood entry
- `PATCH /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry
- `GET /api/game-scores` - Get game scores
- `POST /api/game-scores` - Submit game score
- `GET /api/daily-plan` - Get daily progress
- `POST /api/daily-plan/complete-task` - Mark task complete

### Admin (Production only)
- `POST /api/admin/seed-database` - Seed courses, lessons, IQ questions
- `POST /api/admin/clear-and-reseed` - Clear and reseed database
- `POST /api/admin/create-user` - Manually create user

## 🎨 Design System

### Colors
Material Design 3 with custom HSL palette:
- Primary: Purple gradient (`#667eea` to `#764ba2`)
- Charts: 5-color palette for data visualization
- Semantic colors: Success, warning, destructive states

### Typography
- Font: Inter (system fallback)
- Heading scale: 3xl to 4xl for titles
- Body: lg to xl for senior readability

### Accessibility
- Min 48px touch targets
- High contrast ratios
- Keyboard navigation support
- Screen reader friendly

## 🌍 Internationalization

Translation files in `client/src/lib/i18n.ts` and `server/i18n.ts`:
- UI strings
- Email templates
- Game content
- Error messages

All 4 languages (EN/DE/FR/PT) fully supported across:
- Authentication flow
- Dashboard & navigation
- Brain games
- Courses & lessons
- IQ test
- Email communications

## 📱 Progressive Web App

The app can be installed as a PWA on mobile devices for a native-like experience.

## 🚢 Deployment

### Replit (Current)
App is deployed on Replit with automatic deployments.

### Other Platforms
1. Set environment variables
2. Run database migrations
3. Seed static content
4. Build and start: `npm run build && npm start`

## 🔒 Security

- HMAC-SHA256 webhook signature verification
- Session-based authentication with httpOnly cookies
- Secure session storage with PostgreSQL
- Environment variable secrets management
- Production-only admin endpoints

## 📦 Project Structure

```
.
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── contexts/      # React contexts (Language, Theme, Auth)
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities, i18n, query client
├── server/                # Backend Express app
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   ├── storage.ts        # Database operations
│   ├── email.ts          # Email service
│   └── seed-*.ts         # Database seeding scripts
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle schema + Zod validation
└── database-migration.sql # Database setup SQL
```

## 🤝 Contributing

This is a private project. Contact the repository owner for contribution guidelines.

## 📄 License

MIT

## 🆘 Support

For issues or questions:
- Email: support@creativewaves.me
- Manage subscription: https://buy.creativewaves.me/my-account/

---

**Built with ❤️ for cognitive wellness**
