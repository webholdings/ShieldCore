import { z } from "zod";

// User types
export interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
  language: string | null;
  chronotype?: "bear" | "wolf" | "lion" | "dolphin" | null;
  currentAudioSession: number | null;
  lastAudioPosition: number | null;
  subscriptionStatus: string | null;
  wooCommerceSubscriptionId: string | null;
  streakCount: number | null;
  totalPoints: number | null;
  recoveryUser: boolean | null;
  expressUpgradeEnabled: boolean | null;
  createdAt: Date | null;
  isSleepCustomer: boolean | null;
  detoxStartDate: Date | null;
  detoxCurrentDay: number | null;
  panicUsageCount: number | null;
  isDigitalDetoxCustomer: boolean | null;
}

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().nullable().optional(),
  language: z.string().default("en").optional(),
  chronotype: z.enum(["bear", "wolf", "lion", "dolphin"]).nullable().optional(),
  currentAudioSession: z.number().default(1).optional(),
  lastAudioPosition: z.number().default(0).optional(),
  subscriptionStatus: z.string().default("active").optional(),
  wooCommerceSubscriptionId: z.string().nullable().optional(),
  streakCount: z.number().default(0).optional(),
  totalPoints: z.number().default(0).optional(),
  recoveryUser: z.boolean().default(false).optional(),
  expressUpgradeEnabled: z.boolean().default(false).optional(),
  isSleepCustomer: z.boolean().default(false).optional(),
  detoxStartDate: z.string().or(z.date()).nullable().optional().transform(val => val ? new Date(val) : null),
  detoxCurrentDay: z.number().default(0).optional(),
  panicUsageCount: z.number().default(0).optional(),
  isDigitalDetoxCustomer: z.boolean().default(false).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Mood Entry types
export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  note: string | null;
  createdAt: Date | null;
}

export const insertMoodEntrySchema = z.object({
  userId: z.string(),
  mood: z.string(),
  note: z.string().nullable().optional(),
});

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

// Game Score types
export interface GameScore {
  id: string;
  userId: string;
  gameType: string;
  score: number;
  createdAt: Date | null;
}

export const insertGameScoreSchema = z.object({
  userId: z.string(),
  gameType: z.string(),
  score: z.number(),
});

export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  category?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  language: string;
  orderIndex: number;
  createdAt: Date | null;
}

export const insertCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
  language: z.string().default("en"),
  orderIndex: z.number(),
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;

// Lesson types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  audioUrl?: string;
  videoUrl?: string;
  language: string;
  orderIndex: number;
  createdAt: Date | null;
}

export const insertLessonSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  content: z.string(),
  audioUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  language: z.string().default("en"),
  orderIndex: z.number(),
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;

// User Lesson Progress types
export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: number;
  completedAt: Date | null;
}

export const insertUserLessonProgressSchema = z.object({
  userId: z.string(),
  lessonId: z.string(),
  completed: z.number().default(0).optional(),
  completedAt: z.date().nullable().optional(),
});

export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;

// IQ Question types
export interface IQQuestion {
  id: string;
  question: string;
  questionType?: string;
  options: string[] | string; // Can be array or JSON string
  correctAnswer: number | string;
  difficulty?: string | number;
  category?: string;
  language: string;
  createdAt: Date | null;
}

export const insertIQQuestionSchema = z.object({
  question: z.string(),
  questionType: z.string().optional(),
  options: z.union([z.array(z.string()), z.string()]),
  correctAnswer: z.union([z.number(), z.string()]),
  difficulty: z.union([z.string(), z.number()]).optional(),
  category: z.string().optional(),
  language: z.string().default("en"),
});

export type InsertIQQuestion = z.infer<typeof insertIQQuestionSchema>;

// IQ Test Session types
export interface IQTestSession {
  id: string;
  userId: string;
  score: number;
  completedAt: Date | null;
  totalQuestions: number;
  correctAnswers: number;
}

export const insertIQTestSessionSchema = z.object({
  userId: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
});

export type InsertIQTestSession = z.infer<typeof insertIQTestSessionSchema>;

// IQ Test Answer types
export interface IQTestAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: number;
  createdAt: Date | null;
}

export const insertIQTestAnswerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  userAnswer: z.string(),
  isCorrect: z.number(),
});

export type InsertIQTestAnswer = z.infer<typeof insertIQTestAnswerSchema>;

// Magic Link Token types
export interface MagicLinkToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date | null;
}

export const insertMagicLinkTokenSchema = z.object({
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
});

export type InsertMagicLinkToken = z.infer<typeof insertMagicLinkTokenSchema>;

// Daily Plan Progress types
export interface DailyPlanProgress {
  id: string;
  userId: string;
  date: string;
  thetaAudioCompleted?: number;
  breathingCompleted?: number;
  gameCompleted?: number;
  moodCompleted?: number;
  lastCompletionDate?: Date | null;
  createdAt: Date | null;
}

export const insertDailyPlanProgressSchema = z.object({
  userId: z.string(),
  date: z.string(),
  thetaAudioCompleted: z.number().default(0).optional(),
  breathingCompleted: z.number().default(0).optional(),
  gameCompleted: z.number().default(0).optional(),
  moodCompleted: z.number().default(0).optional(),
  lastCompletionDate: z.date().nullable().optional(),
});

export type InsertDailyPlanProgress = z.infer<typeof insertDailyPlanProgressSchema>;

// Journal Entry types
// import { z } from "zod"; // z is already imported at the top

export const journalEntrySchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().default(false),
  createdAt: z.date().optional(), // Firestore timestamps are handled differently, but for schema validation Date is fine
  updatedAt: z.date().optional()
});

export type JournalEntry = z.infer<typeof journalEntrySchema> & { id: string };
export type InsertJournalEntry = z.infer<typeof journalEntrySchema>;

// Addiction types
export interface Addiction {
  id: string;
  userId: string;
  type: string; // 'alcohol', 'smoking', 'social_media', 'custom'
  name: string;
  quitDate: Date;
  lastRelapseDate: Date | null;
  dailyGoal?: string;
  createdAt: Date | null;
}

export const insertAddictionSchema = z.object({
  userId: z.string(),
  type: z.string(),
  name: z.string(),
  quitDate: z.string().or(z.date()).transform(val => new Date(val)),
  lastRelapseDate: z.string().or(z.date()).nullable().optional().transform(val => val ? new Date(val) : null),
  dailyGoal: z.string().optional(),
});

export type InsertAddiction = z.infer<typeof insertAddictionSchema>;

// Addiction Check-in types
export interface AddictionCheckin {
  id: string;
  addictionId: string;
  date: string; // YYYY-MM-DD
  status: string; // 'clean', 'relapsed', 'struggling'
  notes?: string;
  createdAt: Date | null;
}

export const insertAddictionCheckinSchema = z.object({
  addictionId: z.string(),
  date: z.string(),
  status: z.enum(['clean', 'relapsed', 'struggling']),
  notes: z.string().optional(),
});

export type InsertAddictionCheckin = z.infer<typeof insertAddictionCheckinSchema>;

// Legacy exports for compatibility (not used with Firestore)
export const users = null;
export const moodEntries = null;
export const journalEntries = null;
export const gameScores = null;
export const courses = null;
export const lessons = null;
export const userLessonProgress = null;
export const iqQuestions = null;
export const iqTestSessions = null;
export const iqTestAnswers = null;
export const magicLinkTokens = null;
export const dailyPlanProgress = null;
export const addictions = null;
export const addictionCheckins = null;

// Quiz Result types
export interface QuizResult {
  id: string;
  email: string;
  answers: any[]; // JSON array of answers
  metadata?: any; // JSON object for metadata
  userId?: string | null;
  createdAt: Date | null;
}

export const insertQuizResultSchema = z.object({
  email: z.string().email(),
  answers: z.array(z.any()),
  metadata: z.any().optional(),
  userId: z.string().nullable().optional(),
});

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

export const quizResults = null;

// Sleep Entry types
export interface SleepEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:mm
  sleepOnsetMinutes: number;
  awakeningsCount: number;
  finalWakeTime: string; // HH:mm
  totalSleepHours: number;
  sleepQuality: number; // 1-5
  caffeineAlcohol: string; // text/notes
  sleepEfficiency: number; // 0-1
  createdAt: Date | null;
}

export const insertSleepEntrySchema = z.object({
  userId: z.string(),
  date: z.string(),
  bedtime: z.string(),
  sleepOnsetMinutes: z.number(),
  awakeningsCount: z.number(),
  finalWakeTime: z.string(),
  totalSleepHours: z.number(),
  sleepQuality: z.number().min(1).max(5),
  caffeineAlcohol: z.string().optional(),
  sleepEfficiency: z.number(),
});

export type InsertSleepEntry = z.infer<typeof insertSleepEntrySchema>;

// Sleep Program Progress types
export interface SleepProgramProgress {
  id: string;
  userId: string;
  completedDays: number[]; // Array of completed day numbers (1-7)
  updatedAt: Date | null;
}

export const insertSleepProgramProgressSchema = z.object({
  userId: z.string(),
  completedDays: z.array(z.number()),
});

export type InsertSleepProgramProgress = z.infer<typeof insertSleepProgramProgressSchema>;

export const sleepEntries = null;
export const sleepProgramProgress = null;

// Thought Journal types
export interface ThoughtJournalEntry {
  id: string;
  userId: string;
  triggerText: string;
  emotionScore: number;
  emotionLabel?: string;
  automaticThought: string;
  aiReframeResponse: string;
  createdAt: Date | null;
}

export const insertThoughtJournalEntrySchema = z.object({
  userId: z.string(),
  triggerText: z.string(),
  emotionScore: z.number(),
  emotionLabel: z.string().optional(),
  automaticThought: z.string(),
  aiReframeResponse: z.string(),
});

export type InsertThoughtJournalEntry = z.infer<typeof insertThoughtJournalEntrySchema>;

export const thoughtJournalEntries = null;
