import {
  type User,
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type GameScore,
  type InsertGameScore,
  type Course,
  type Lesson,
  type UserLessonProgress,
  type InsertUserLessonProgress,
  type IQQuestion,
  type IQTestSession,
  type InsertIQTestSession,
  type IQTestAnswer,
  type InsertIQTestAnswer,
  type MagicLinkToken,
  type InsertMagicLinkToken,
  type DailyPlanProgress,
  type InsertDailyPlanProgress,
  type JournalEntry,
  type InsertJournalEntry,
  type Addiction,
  type InsertAddiction,
  type AddictionCheckin,
  type InsertAddictionCheckin,
  type QuizResult,
  type InsertQuizResult,
  type SleepEntry,
  type InsertSleepEntry,
  type SleepProgramProgress,
  type InsertSleepProgramProgress,
  type ThoughtJournalEntry,
  type InsertThoughtJournalEntry,
} from "@shared/schema";
import { db } from "./db";


export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAudioProgress(userId: string, session: number, position: number): Promise<User>;
  updateUserEmail(userId: string, email: string): Promise<User>;
  updateUserPassword(userId: string, password: string): Promise<User>;
  updateUserLanguage(userId: string, language: string): Promise<User>;
  updateUserChronotype(userId: string, chronotype: string): Promise<User>;
  updateSubscriptionStatus(userId: string, status: string, subscriptionId?: string): Promise<User>;
  updateUserPointsAndStreak(userId: string, points: number, streak: number): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<User>;
  updateUserStreak(userId: string, streak: number): Promise<User>;
  updateExpressUpgradeStatus(userId: string, enabled: boolean): Promise<User>;

  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  updateMoodEntry(id: string, mood: string, note: string): Promise<MoodEntry>;
  deleteMoodEntry(id: string): Promise<void>;

  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getGameScores(userId: string, gameType?: string): Promise<GameScore[]>;

  getCourses(language?: string): Promise<Course[]>;
  getCourse(id: string, language?: string): Promise<Course | undefined>;
  getLessonsByCourse(courseId: string, language?: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  getUserProgress(userId: string, courseId: string): Promise<UserLessonProgress[]>;
  markLessonComplete(userId: string, lessonId: string): Promise<UserLessonProgress>;

  getRandomIQQuestions(count: number, language?: string): Promise<IQQuestion[]>;
  getIQQuestion(id: string): Promise<IQQuestion | undefined>;
  createIQTestSession(session: InsertIQTestSession): Promise<IQTestSession>;
  createIQTestSessionWithId(session: IQTestSession): Promise<IQTestSession>;
  saveIQTestAnswer(answer: InsertIQTestAnswer): Promise<IQTestAnswer>;
  getIQTestSession(sessionId: string): Promise<IQTestSession | undefined>;
  getIQTestSessions(userId: string): Promise<IQTestSession[]>;
  getIQTestAnswers(sessionId: string): Promise<IQTestAnswer[]>;

  createMagicLinkToken(userId: string): Promise<MagicLinkToken>;
  verifyMagicLinkToken(token: string): Promise<User | null>;
  cleanupExpiredTokens(): Promise<void>;

  getDailyPlan(userId: string, date: string): Promise<DailyPlanProgress | undefined>;
  updateDailyPlanTask(userId: string, date: string, taskField: keyof Omit<DailyPlanProgress, 'id' | 'userId' | 'date' | 'createdAt'>, completed: number): Promise<DailyPlanProgress>;

  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry>;
  deleteJournalEntry(id: string): Promise<void>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;

  createAddiction(addiction: InsertAddiction): Promise<Addiction>;
  getUserAddictions(userId: string): Promise<Addiction[]>;
  updateAddiction(id: string, updates: Partial<InsertAddiction>): Promise<Addiction>;
  deleteAddiction(id: string): Promise<void>;
  getAddiction(id: string): Promise<Addiction | undefined>;

  logAddictionCheckin(checkin: InsertAddictionCheckin): Promise<AddictionCheckin>;
  getAddictionCheckins(addictionId: string): Promise<AddictionCheckin[]>;

  incrementChatCount(userId: string): Promise<void>;
  getRecentChatCount(userId: string): Promise<number>;

  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResultByEmail(email: string): Promise<QuizResult | undefined>;
  getQuizResultByUserId(userId: string): Promise<QuizResult | undefined>;
  linkQuizResultToUser(quizResultId: string, userId: string): Promise<void>;
  cleanupUnlinkedQuizResults(olderThanDays: number): Promise<number>;

  createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry>;
  getRecentSleepEntries(userId: string, limit?: number): Promise<SleepEntry[]>;
  getSleepProgramProgress(userId: string): Promise<SleepProgramProgress | undefined>;
  updateSleepProgramProgress(userId: string, completedDays: number[]): Promise<SleepProgramProgress>;

  // Mental Health
  updateUserDetoxStart(userId: string, startDate: Date): Promise<User>;
  updateUserPanicUsage(userId: string): Promise<User>;
  createThoughtJournalEntry(entry: InsertThoughtJournalEntry): Promise<ThoughtJournalEntry>;
  getThoughtJournalEntries(userId: string): Promise<ThoughtJournalEntry[]>;
}

// Firestore initialized in db.ts

export class DatabaseStorage implements IStorage {
  constructor() {
    // Firestore initialized in db.ts
  }

  // Helper to generate IDs
  private generateId(): string {
    return db.collection('_temp').doc().id;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null)
    } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null)
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : null)
    } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      totalPoints: insertUser.totalPoints ?? 0,
      streakCount: insertUser.streakCount ?? 0,
      currentAudioSession: insertUser.currentAudioSession ?? 1,
      lastAudioPosition: insertUser.lastAudioPosition ?? 0,
      subscriptionStatus: insertUser.subscriptionStatus ?? "active",
      wooCommerceSubscriptionId: insertUser.wooCommerceSubscriptionId ?? null,
      expressUpgradeEnabled: insertUser.expressUpgradeEnabled ?? false,
      isSleepCustomer: insertUser.isSleepCustomer ?? false,
      chronotype: insertUser.chronotype ?? null,
    } as User;
    await db.collection('users').doc(id).set(user);
    return user;
  }

  async updateUserAudioProgress(userId: string, sessionNum: number, position: number): Promise<User> {
    await db.collection('users').doc(userId).update({
      currentAudioSession: sessionNum,
      lastAudioPosition: position
    });
    return (await this.getUser(userId))!;
  }

  async updateUserEmail(userId: string, email: string): Promise<User> {
    await db.collection('users').doc(userId).update({ email });
    return (await this.getUser(userId))!;
  }

  async updateUserPassword(userId: string, password: string): Promise<User> {
    await db.collection('users').doc(userId).update({ password });
    return (await this.getUser(userId))!;
  }

  async updateUserLanguage(userId: string, language: string): Promise<User> {
    await db.collection('users').doc(userId).update({ language });
    return (await this.getUser(userId))!;
  }

  async updateUserChronotype(userId: string, chronotype: string): Promise<User> {
    await db.collection('users').doc(userId).update({ chronotype });
    return (await this.getUser(userId))!;
  }

  async updateSubscriptionStatus(userId: string, status: string, subscriptionId?: string): Promise<User> {
    const update: any = { subscriptionStatus: status };
    if (subscriptionId) update.wooCommerceSubscriptionId = subscriptionId;
    await db.collection('users').doc(userId).update(update);
    return (await this.getUser(userId))!;
  }

  async updateUserPointsAndStreak(userId: string, points: number, streak: number): Promise<User> {
    await db.collection('users').doc(userId).update({
      totalPoints: points,
      streakCount: streak
    });
    return (await this.getUser(userId))!;
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    await db.collection('users').doc(userId).update({ totalPoints: points });
    return (await this.getUser(userId))!;
  }

  async updateUserStreak(userId: string, streak: number): Promise<User> {
    await db.collection('users').doc(userId).update({ streakCount: streak });
    return (await this.getUser(userId))!;
  }

  async updateExpressUpgradeStatus(userId: string, enabled: boolean): Promise<User> {
    await db.collection('users').doc(userId).update({ expressUpgradeEnabled: enabled });
    return (await this.getUser(userId))!;
  }

  // Mood Entry methods
  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.generateId();
    const moodEntry: MoodEntry = {
      ...entry,
      id,
      createdAt: new Date(),
    } as MoodEntry;
    await db.collection('moodEntries').doc(id).set(moodEntry);
    return moodEntry;
  }

  async getMoodEntries(userId: string, limit: number = 30): Promise<MoodEntry[]> {
    const snapshot = await db.collection('moodEntries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as MoodEntry;
    });
  }

  async updateMoodEntry(id: string, mood: string, note: string): Promise<MoodEntry> {
    await db.collection('moodEntries').doc(id).update({ mood, note });
    const doc = await db.collection('moodEntries').doc(id).get();
    return { id: doc.id, ...doc.data() } as MoodEntry;
  }

  async deleteMoodEntry(id: string): Promise<void> {
    await db.collection('moodEntries').doc(id).delete();
  }

  // Game Score methods
  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const id = this.generateId();
    const gameScore: GameScore = {
      ...score,
      id,
      createdAt: new Date(),
    } as GameScore;
    await db.collection('gameScores').doc(id).set(gameScore);
    return gameScore;
  }

  async getGameScores(userId: string, gameType?: string): Promise<GameScore[]> {
    let query = db.collection('gameScores').where('userId', '==', userId);
    if (gameType) {
      query = query.where('gameType', '==', gameType);
    }
    const snapshot = await query.orderBy('createdAt', 'desc').limit(gameType ? 10 : 50).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameScore));
  }

  // Course methods
  async getCourses(language: string = 'en'): Promise<Course[]> {
    console.log(`Getting courses for language: ${language}`);
    // First try to get courses in the user's language
    let snapshot = await db.collection('courses')
      .where('language', '==', language)
      .get();

    console.log(`Found ${snapshot.size} courses for language ${language}`);

    // If no courses found in user's language, get all courses (fallback to English)
    if (snapshot.empty) {
      console.log('No courses found, falling back to all courses');
      snapshot = await db.collection('courses').get();
      console.log(`Found ${snapshot.size} courses in fallback`);
    }

    let courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

    // Sort by orderIndex in memory
    courses.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    return courses;
  }

  async getCourse(id: string, language: string = 'en'): Promise<Course | undefined> {
    console.log(`Getting course ${id} for language: ${language}`);
    // Try to get course in user's language by constructing the document ID
    const languageSpecificId = `${id}_${language}`;
    let doc = await db.collection('courses').doc(languageSpecificId).get();

    // If not found, try the base ID (might be a legacy English-only course)
    if (!doc.exists) {
      console.log(`Course ${languageSpecificId} not found, trying base ID ${id}`);
      doc = await db.collection('courses').doc(id).get();
    }

    if (!doc.exists) {
      console.log(`Course ${id} not found in any language`);
      return undefined;
    }

    console.log(`Found course: ${doc.id}`);
    return { id: doc.id, ...doc.data() } as Course;
  }

  async getLessonsByCourse(courseId: string, language: string = 'en'): Promise<Lesson[]> {
    const snapshot = await db.collection('lessons')
      .where('courseId', '==', courseId)
      .where('language', '==', language)
      .get();

    let lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));

    // Sort by orderIndex in memory
    lessons.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    return lessons;
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const doc = await db.collection('lessons').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Lesson;
  }

  async getUserProgress(userId: string, courseId: string): Promise<UserLessonProgress[]> {
    const snapshot = await db.collection('userLessonProgress')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserLessonProgress));
  }

  async markLessonComplete(userId: string, lessonId: string): Promise<UserLessonProgress> {
    const snapshot = await db.collection('userLessonProgress')
      .where('userId', '==', userId)
      .where('lessonId', '==', lessonId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({ completed: 1, completedAt: new Date() });
      const updated = await doc.ref.get();
      return { id: updated.id, ...updated.data() } as UserLessonProgress;
    }

    const id = this.generateId();
    const progress: UserLessonProgress = {
      id,
      userId,
      lessonId,
      completed: 1,
      completedAt: new Date(),
    } as UserLessonProgress;
    await db.collection('userLessonProgress').doc(id).set(progress);
    return progress;
  }

  // IQ Test methods
  async getRandomIQQuestions(count: number, language: string = 'en'): Promise<IQQuestion[]> {
    const snapshot = await db.collection('iqQuestions')
      .where('language', '==', language)
      .get();
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IQQuestion));
    // Shuffle and take count
    return questions.sort(() => Math.random() - 0.5).slice(0, count);
  }

  async getIQQuestion(id: string): Promise<IQQuestion | undefined> {
    const doc = await db.collection('iqQuestions').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as IQQuestion;
  }

  async createIQTestSession(sessionData: InsertIQTestSession): Promise<IQTestSession> {
    const id = this.generateId();
    const session: IQTestSession = {
      ...sessionData,
      id,
      startedAt: new Date(),
      completedAt: null,
    } as IQTestSession;
    await db.collection('iqTestSessions').doc(id).set(session);
    return session;
  }

  async createIQTestSessionWithId(session: IQTestSession): Promise<IQTestSession> {
    await db.collection('iqTestSessions').doc(session.id).set(session);
    return session;
  }

  async saveIQTestAnswer(answer: InsertIQTestAnswer): Promise<IQTestAnswer> {
    const id = this.generateId();
    const iqAnswer: IQTestAnswer = {
      ...answer,
      id,
      createdAt: new Date(),
    } as IQTestAnswer;
    await db.collection('iqTestAnswers').doc(id).set(iqAnswer);
    return iqAnswer;
  }

  async getIQTestSession(sessionId: string): Promise<IQTestSession | undefined> {
    const doc = await db.collection('iqTestSessions').doc(sessionId).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as IQTestSession;
  }

  async getIQTestSessions(userId: string): Promise<IQTestSession[]> {
    const snapshot = await db.collection('iqTestSessions')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .limit(20)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IQTestSession));
  }

  async getIQTestAnswers(sessionId: string): Promise<IQTestAnswer[]> {
    const snapshot = await db.collection('iqTestAnswers')
      .where('sessionId', '==', sessionId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IQTestAnswer));
  }

  // Magic Link methods
  async createMagicLinkToken(userId: string): Promise<MagicLinkToken> {
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const id = this.generateId();
    const magicLink: MagicLinkToken = {
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    } as MagicLinkToken;

    await db.collection('magicLinkTokens').doc(id).set(magicLink);
    return magicLink;
  }

  async verifyMagicLinkToken(token: string): Promise<User | null> {
    const snapshot = await db.collection('magicLinkTokens')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const magicLink = { id: doc.id, ...doc.data() } as MagicLinkToken;

    // Check if token is expired
    if (new Date() > magicLink.expiresAt) return null;

    // Check if token has already been used
    if (magicLink.usedAt) return null;

    // Mark token as used
    await doc.ref.update({ usedAt: new Date() });

    // Get and return the user
    const user = await this.getUser(magicLink.userId);
    return user || null;
  }

  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    const snapshot = await db.collection('magicLinkTokens')
      .where('expiresAt', '<', now)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // Daily Plan methods
  async getDailyPlan(userId: string, date: string): Promise<DailyPlanProgress | undefined> {
    const snapshot = await db.collection('dailyPlanProgress')
      .where('userId', '==', userId)
      .where('date', '==', date)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as DailyPlanProgress;
  }

  async updateDailyPlanTask(
    userId: string,
    date: string,
    taskField: keyof Omit<DailyPlanProgress, 'id' | 'userId' | 'date' | 'createdAt'>,
    completed: number
  ): Promise<DailyPlanProgress> {
    const existingPlan = await this.getDailyPlan(userId, date);

    if (existingPlan) {
      await db.collection('dailyPlanProgress').doc(existingPlan.id).update({
        [taskField]: completed
      });
      return (await this.getDailyPlan(userId, date))!;
    } else {
      const id = this.generateId();
      const plan: DailyPlanProgress = {
        id,
        userId,
        date,
        moodCompleted: 0,
        thetaAudioCompleted: 0,
        breathingCompleted: 0,
        gameCompleted: 0,
        [taskField]: completed,
        createdAt: new Date(),
      } as DailyPlanProgress;
      await db.collection('dailyPlanProgress').doc(id).set(plan);
      return plan;
    }
  }

  // Journal methods
  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.generateId();
    const journalEntry: JournalEntry = {
      ...entry,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as JournalEntry;
    await db.collection('journalEntries').doc(id).set(journalEntry);

    // Return with Date objects (already set above, but good to be explicit if we were fetching)
    return journalEntry;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    const snapshot = await db.collection('journalEntries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : undefined)
      } as JournalEntry;
    });
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    const doc = await db.collection('journalEntries').doc(id).get();
    if (!doc.exists) return undefined;
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : undefined)
    } as JournalEntry;
  }

  async updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry> {
    await db.collection('journalEntries').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    return (await this.getJournalEntry(id))!;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await db.collection('journalEntries').doc(id).delete();
  }

  // Addiction methods
  async createAddiction(addiction: InsertAddiction): Promise<Addiction> {
    const id = this.generateId();
    const newAddiction: Addiction = {
      ...addiction,
      id,
      createdAt: new Date(),
    } as Addiction;
    await db.collection('addictions').doc(id).set(newAddiction);
    return newAddiction;
  }

  async getUserAddictions(userId: string): Promise<Addiction[]> {
    const snapshot = await db.collection('addictions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // Helper to safely convert Firestore timestamps or strings to Date
      const toDate = (val: any) => {
        if (!val) return null;
        if (typeof val.toDate === 'function') return val.toDate();
        return new Date(val);
      };

      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt) || new Date(),
        quitDate: toDate(data.quitDate) || new Date(),
        lastRelapseDate: toDate(data.lastRelapseDate),
      } as Addiction;
    });
  }

  async getAddiction(id: string): Promise<Addiction | undefined> {
    const doc = await db.collection('addictions').doc(id).get();
    if (!doc.exists) return undefined;
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      quitDate: data.quitDate?.toDate ? data.quitDate.toDate() : new Date(data.quitDate),
      lastRelapseDate: data.lastRelapseDate?.toDate ? data.lastRelapseDate.toDate() : (data.lastRelapseDate ? new Date(data.lastRelapseDate) : null),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
    } as Addiction;
  }

  async updateAddiction(id: string, updates: Partial<InsertAddiction>): Promise<Addiction> {
    await db.collection('addictions').doc(id).update(updates);
    return (await this.getAddiction(id))!;
  }

  async deleteAddiction(id: string): Promise<void> {
    await db.collection('addictions').doc(id).delete();
  }



  async logAddictionCheckin(checkin: InsertAddictionCheckin): Promise<AddictionCheckin> {
    const id = this.generateId();
    const newCheckin: AddictionCheckin = {
      ...checkin,
      id,
      createdAt: new Date(),
    } as AddictionCheckin;
    await db.collection('addictionCheckins').doc(id).set(newCheckin);
    return newCheckin;
  }

  async getAddictionCheckins(addictionId: string): Promise<AddictionCheckin[]> {
    const snapshot = await db.collection('addictionCheckins')
      .where('addictionId', '==', addictionId)
      .orderBy('date', 'desc')
      .limit(365) // Get last year of checkins
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as AddictionCheckin;
    });
  }

  // Chat rate limiting (no message logging)
  async incrementChatCount(userId: string): Promise<void> {
    await db.collection('chatCounts').add({
      userId,
      createdAt: new Date()
    });
  }

  async getRecentChatCount(userId: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const snapshot = await db.collection('chatCounts')
      .where('userId', '==', userId)
      .where('createdAt', '>=', oneHourAgo)
      .get();
    return snapshot.size;
  }

  // Quiz Result methods
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = this.generateId();
    const quizResult: QuizResult = {
      ...result,
      id,
      createdAt: new Date(),
    } as QuizResult;
    await db.collection('quizResults').doc(id).set(quizResult);
    return quizResult;
  }

  async getQuizResultByEmail(email: string): Promise<QuizResult | undefined> {
    const snapshot = await db.collection('quizResults')
      .where('email', '==', email)
      .get();

    if (snapshot.empty) return undefined;

    // Sort in memory to avoid composite index requirement
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as QuizResult;
    });

    // Sort descending by createdAt
    docs.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });

    return docs[0];
  }

  async linkQuizResultToUser(quizResultId: string, userId: string): Promise<void> {
    await db.collection('quizResults').doc(quizResultId).update({ userId });
  }

  async getQuizResultByUserId(userId: string): Promise<QuizResult | undefined> {
    const snapshot = await db.collection('quizResults')
      .where('userId', '==', userId)
      .get();

    if (snapshot.empty) return undefined;

    // Sort in memory to get most recent
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as QuizResult;
    });

    // Sort descending by createdAt
    docs.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });

    return docs[0];
  }

  // Mental Health
  async updateUserDetoxStart(userId: string, startDate: Date): Promise<User> {
    await db.collection('users').doc(userId).update({
      detoxStartDate: startDate,
      detoxCurrentDay: 1,
      isDigitalDetoxCustomer: true
    });
    return (await this.getUser(userId))!;
  }

  async updateUserPanicUsage(userId: string): Promise<User> {
    const user = await this.getUser(userId);
    const count = (user?.panicUsageCount || 0) + 1;
    await db.collection('users').doc(userId).update({ panicUsageCount: count });
    return (await this.getUser(userId))!;
  }

  async createThoughtJournalEntry(entry: InsertThoughtJournalEntry): Promise<ThoughtJournalEntry> {
    const id = this.generateId();
    const newEntry: ThoughtJournalEntry = {
      ...entry,
      id,
      createdAt: new Date(),
    } as ThoughtJournalEntry;
    await db.collection('thoughtJournal').doc(id).set(newEntry);
    return newEntry;
  }

  async getThoughtJournalEntries(userId: string): Promise<ThoughtJournalEntry[]> {
    const snapshot = await db.collection('thoughtJournal')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as ThoughtJournalEntry;
    });
  }

  async cleanupUnlinkedQuizResults(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const snapshot = await db.collection('quizResults')
      .where('userId', '==', null)
      .get();

    // Filter in memory for date check to avoid composite index
    const toDelete = snapshot.docs.filter(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      return createdAt < cutoffDate;
    });

    if (toDelete.length === 0) {
      return 0;
    }

    // Delete in batches (Firestore batch limit is 500)
    const batchSize = 500;
    let deletedCount = 0;

    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = toDelete.slice(i, i + batchSize);

      batchDocs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      deletedCount += batchDocs.length;
    }

    return deletedCount;
  }

  // Sleep methods
  async createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry> {
    const id = this.generateId();
    const sleepEntry: SleepEntry = {
      ...entry,
      id,
      createdAt: new Date(),
    } as SleepEntry;
    await db.collection('sleepEntries').doc(id).set(sleepEntry);
    return sleepEntry;
  }

  async getRecentSleepEntries(userId: string, limit: number = 7): Promise<SleepEntry[]> {
    // Note: To avoid requiring a composite index (userId + date) which might not exist,
    // we fetch entries by userId and sort in memory. Since a user won't have massive
    // amounts of sleep entries, this is acceptable for now.
    const snapshot = await db.collection('sleepEntries')
      .where('userId', '==', userId)
      .get();

    const entries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as SleepEntry;
    });

    // Sort by date descending (newest first)
    entries.sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

    return entries.slice(0, limit);
  }

  async getSleepProgramProgress(userId: string): Promise<SleepProgramProgress | undefined> {
    const snapshot = await db.collection('sleepProgramProgress')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as SleepProgramProgress;
  }

  async updateSleepProgramProgress(userId: string, completedDays: number[]): Promise<SleepProgramProgress> {
    const existing = await this.getSleepProgramProgress(userId);

    if (existing) {
      await db.collection('sleepProgramProgress').doc(existing.id).update({
        completedDays,
        updatedAt: new Date()
      });
      return { ...existing, completedDays, updatedAt: new Date() };
    } else {
      const id = this.generateId();
      const progress: SleepProgramProgress = {
        id,
        userId,
        completedDays,
        updatedAt: new Date()
      };
      await db.collection('sleepProgramProgress').doc(id).set(progress);
      return progress;
    }
  }
}

export const storage = new DatabaseStorage();
