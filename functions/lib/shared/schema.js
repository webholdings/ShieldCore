import { z } from "zod";
export const insertUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().nullable().optional(),
    language: z.string().default("en").optional(),
    currentAudioSession: z.number().default(1).optional(),
    lastAudioPosition: z.number().default(0).optional(),
    subscriptionStatus: z.string().default("active").optional(),
    wooCommerceSubscriptionId: z.string().nullable().optional(),
    streakCount: z.number().default(0).optional(),
    totalPoints: z.number().default(0).optional(),
});
export const insertMoodEntrySchema = z.object({
    userId: z.string(),
    mood: z.string(),
    note: z.string().nullable().optional(),
});
export const insertGameScoreSchema = z.object({
    userId: z.string(),
    gameType: z.string(),
    score: z.number(),
});
export const insertCourseSchema = z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    language: z.string().default("en"),
    orderIndex: z.number(),
});
export const insertLessonSchema = z.object({
    courseId: z.string(),
    title: z.string(),
    content: z.string(),
    audioUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    language: z.string().default("en"),
    orderIndex: z.number(),
});
export const insertUserLessonProgressSchema = z.object({
    userId: z.string(),
    lessonId: z.string(),
    completed: z.number().default(0).optional(),
    completedAt: z.date().nullable().optional(),
});
export const insertIQQuestionSchema = z.object({
    question: z.string(),
    questionType: z.string().optional(),
    options: z.union([z.array(z.string()), z.string()]),
    correctAnswer: z.union([z.number(), z.string()]),
    difficulty: z.union([z.string(), z.number()]).optional(),
    category: z.string().optional(),
    language: z.string().default("en"),
});
export const insertIQTestSessionSchema = z.object({
    userId: z.string(),
    score: z.number(),
    totalQuestions: z.number(),
    correctAnswers: z.number(),
});
export const insertIQTestAnswerSchema = z.object({
    sessionId: z.string(),
    questionId: z.string(),
    userAnswer: z.string(),
    isCorrect: z.number(),
});
export const insertMagicLinkTokenSchema = z.object({
    userId: z.string(),
    token: z.string(),
    expiresAt: z.date(),
});
export const insertDailyPlanProgressSchema = z.object({
    userId: z.string(),
    date: z.string(),
    thetaAudioCompleted: z.number().default(0).optional(),
    breathingCompleted: z.number().default(0).optional(),
    gameCompleted: z.number().default(0).optional(),
    moodCompleted: z.number().default(0).optional(),
    lastCompletionDate: z.date().nullable().optional(),
});
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
//# sourceMappingURL=schema.js.map