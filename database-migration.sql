-- CreativeWaves Database Migration
-- PostgreSQL Schema for Cognitive Wellness Platform
-- Run this file to set up the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  language TEXT DEFAULT 'en',
  current_audio_session INTEGER DEFAULT 1,
  last_audio_position INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'active',
  woocommerce_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game scores table
CREATE TABLE IF NOT EXISTS game_scores (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table (multilingual)
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table (multilingual)
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP
);

-- IQ questions table (multilingual)
CREATE TABLE IF NOT EXISTS iq_questions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- IQ test sessions table
CREATE TABLE IF NOT EXISTS iq_test_sessions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- IQ test answers table
CREATE TABLE IF NOT EXISTS iq_test_answers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR NOT NULL REFERENCES iq_test_sessions(id) ON DELETE CASCADE,
  question_id VARCHAR NOT NULL REFERENCES iq_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Magic link tokens table (legacy - can be removed if not using magic links)
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily plan progress table
CREATE TABLE IF NOT EXISTS daily_plan_progress (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  theta_audio_completed INTEGER NOT NULL DEFAULT 0,
  breathing_completed INTEGER NOT NULL DEFAULT 0,
  game_completed INTEGER NOT NULL DEFAULT 0,
  mood_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Session store table (for express-session with connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_type ON game_scores(game_type);
CREATE INDEX IF NOT EXISTS idx_courses_language ON courses(language);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_language ON lessons(language);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_iq_questions_language ON iq_questions(language);
CREATE INDEX IF NOT EXISTS idx_iq_test_sessions_user_id ON iq_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plan_progress_user_date ON daily_plan_progress(user_id, date);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'CreativeWaves database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run seed scripts to populate courses, lessons, and IQ questions';
  RAISE NOTICE '2. Create admin users via SQL INSERT or WooCommerce webhooks';
  RAISE NOTICE '3. Configure environment variables (see .env.example)';
END $$;
