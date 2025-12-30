var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../server/quizHelpers.ts
var quizHelpers_exports = {};
__export(quizHelpers_exports, {
  extractImportantQuestions: () => extractImportantQuestions
});
function extractImportantQuestions(quizResult) {
  if (!quizResult || !quizResult.answers) {
    return {
      age: null,
      cognitiveStruggles: null,
      improvementGoals: null,
      rawAnswers: []
    };
  }
  const answers = quizResult.answers;
  const q1 = answers.find((a) => a.key === "q1" || a.id === "1");
  const q2 = answers.find((a) => a.key === "q2" || a.id === "2");
  const q16 = answers.find((a) => a.key === "q16" || a.id === "16");
  return {
    age: q1?.answer || null,
    cognitiveStruggles: q2?.answer || null,
    improvementGoals: Array.isArray(q16?.answer) ? q16.answer : q16?.answer ? [q16.answer] : null,
    rawAnswers: answers
  };
}
var init_quizHelpers = __esm({
  "../server/quizHelpers.ts"() {
    "use strict";
  }
});

// ../server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db
});
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
var db;
var init_db = __esm({
  "../server/db.ts"() {
    "use strict";
    if (getApps().length === 0) {
      const serviceAccountPath = join(process.cwd(), "service-account.json");
      const nodeEnv = (process.env.NODE_ENV || "").trim();
      const isDev = nodeEnv === "development";
      const hasServiceAccount = existsSync(serviceAccountPath);
      console.log(`[DB] Environment: ${process.env.NODE_ENV}, Service account exists: ${hasServiceAccount}`);
      if (isDev && hasServiceAccount) {
        console.log("[DB] Initializing Firebase Admin with service account file");
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
        initializeApp({
          credential: cert(serviceAccount)
        });
      } else {
        console.log("[DB] Initializing Firebase Admin with default credentials");
        initializeApp({
          serviceAccountId: "creativewavesapp2@appspot.gserviceaccount.com"
        });
      }
    }
    db = getFirestore();
  }
});

// ../server/storage.ts
import { createRequire } from "module";
var require2, DatabaseStorage, storage;
var init_storage = __esm({
  "../server/storage.ts"() {
    "use strict";
    init_db();
    require2 = createRequire(import.meta.url);
    DatabaseStorage = class {
      constructor() {
      }
      // Helper to generate IDs
      generateId() {
        return db.collection("_temp").doc().id;
      }
      // User methods
      async getUser(id) {
        const doc = await db.collection("users").doc(id).get();
        if (!doc.exists) return void 0;
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : null
        };
      }
      async getUserByUsername(username) {
        const snapshot = await db.collection("users").where("username", "==", username).limit(1).get();
        if (snapshot.empty) return void 0;
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : null
        };
      }
      async getUserByEmail(email) {
        const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();
        if (snapshot.empty) return void 0;
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : null
        };
      }
      async createUser(insertUser) {
        const id = this.generateId();
        const user = {
          ...insertUser,
          id,
          createdAt: /* @__PURE__ */ new Date(),
          totalPoints: insertUser.totalPoints ?? 0,
          streakCount: insertUser.streakCount ?? 0,
          currentAudioSession: insertUser.currentAudioSession ?? 1,
          lastAudioPosition: insertUser.lastAudioPosition ?? 0,
          subscriptionStatus: insertUser.subscriptionStatus ?? "active",
          wooCommerceSubscriptionId: insertUser.wooCommerceSubscriptionId ?? null,
          expressUpgradeEnabled: insertUser.expressUpgradeEnabled ?? false
        };
        await db.collection("users").doc(id).set(user);
        return user;
      }
      async updateUserAudioProgress(userId, sessionNum, position) {
        await db.collection("users").doc(userId).update({
          currentAudioSession: sessionNum,
          lastAudioPosition: position
        });
        return await this.getUser(userId);
      }
      async updateUserEmail(userId, email) {
        await db.collection("users").doc(userId).update({ email });
        return await this.getUser(userId);
      }
      async updateUserPassword(userId, password) {
        await db.collection("users").doc(userId).update({ password });
        return await this.getUser(userId);
      }
      async updateUserLanguage(userId, language) {
        await db.collection("users").doc(userId).update({ language });
        return await this.getUser(userId);
      }
      async updateSubscriptionStatus(userId, status, subscriptionId) {
        const update = { subscriptionStatus: status };
        if (subscriptionId) update.wooCommerceSubscriptionId = subscriptionId;
        await db.collection("users").doc(userId).update(update);
        return await this.getUser(userId);
      }
      async updateUserPointsAndStreak(userId, points, streak) {
        await db.collection("users").doc(userId).update({
          totalPoints: points,
          streakCount: streak
        });
        return await this.getUser(userId);
      }
      async updateUserPoints(userId, points) {
        await db.collection("users").doc(userId).update({ totalPoints: points });
        return await this.getUser(userId);
      }
      async updateUserStreak(userId, streak) {
        await db.collection("users").doc(userId).update({ streakCount: streak });
        return await this.getUser(userId);
      }
      async updateExpressUpgradeStatus(userId, enabled) {
        await db.collection("users").doc(userId).update({ expressUpgradeEnabled: enabled });
        return await this.getUser(userId);
      }
      // Mood Entry methods
      async createMoodEntry(entry) {
        const id = this.generateId();
        const moodEntry = {
          ...entry,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("moodEntries").doc(id).set(moodEntry);
        return moodEntry;
      }
      async getMoodEntries(userId, limit = 30) {
        const snapshot = await db.collection("moodEntries").where("userId", "==", userId).orderBy("createdAt", "desc").limit(limit).get();
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
          };
        });
      }
      async updateMoodEntry(id, mood, note) {
        await db.collection("moodEntries").doc(id).update({ mood, note });
        const doc = await db.collection("moodEntries").doc(id).get();
        return { id: doc.id, ...doc.data() };
      }
      async deleteMoodEntry(id) {
        await db.collection("moodEntries").doc(id).delete();
      }
      // Game Score methods
      async createGameScore(score) {
        const id = this.generateId();
        const gameScore = {
          ...score,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("gameScores").doc(id).set(gameScore);
        return gameScore;
      }
      async getGameScores(userId, gameType) {
        let query = db.collection("gameScores").where("userId", "==", userId);
        if (gameType) {
          query = query.where("gameType", "==", gameType);
        }
        const snapshot = await query.orderBy("createdAt", "desc").limit(gameType ? 10 : 50).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      // Course methods
      async getCourses(language = "en") {
        console.log(`Getting courses for language: ${language}`);
        let snapshot = await db.collection("courses").where("language", "==", language).get();
        console.log(`Found ${snapshot.size} courses for language ${language}`);
        if (snapshot.empty) {
          console.log("No courses found, falling back to all courses");
          snapshot = await db.collection("courses").get();
          console.log(`Found ${snapshot.size} courses in fallback`);
        }
        let courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        courses.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        return courses;
      }
      async getCourse(id, language = "en") {
        console.log(`Getting course ${id} for language: ${language}`);
        const languageSpecificId = `${id}_${language}`;
        let doc = await db.collection("courses").doc(languageSpecificId).get();
        if (!doc.exists) {
          console.log(`Course ${languageSpecificId} not found, trying base ID ${id}`);
          doc = await db.collection("courses").doc(id).get();
        }
        if (!doc.exists) {
          console.log(`Course ${id} not found in any language`);
          return void 0;
        }
        console.log(`Found course: ${doc.id}`);
        return { id: doc.id, ...doc.data() };
      }
      async getLessonsByCourse(courseId, language = "en") {
        const snapshot = await db.collection("lessons").where("courseId", "==", courseId).where("language", "==", language).get();
        let lessons = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        lessons.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        return lessons;
      }
      async getLesson(id) {
        const doc = await db.collection("lessons").doc(id).get();
        if (!doc.exists) return void 0;
        return { id: doc.id, ...doc.data() };
      }
      async getUserProgress(userId, courseId) {
        const snapshot = await db.collection("userLessonProgress").where("userId", "==", userId).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      async markLessonComplete(userId, lessonId) {
        const snapshot = await db.collection("userLessonProgress").where("userId", "==", userId).where("lessonId", "==", lessonId).limit(1).get();
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          await doc.ref.update({ completed: 1, completedAt: /* @__PURE__ */ new Date() });
          const updated = await doc.ref.get();
          return { id: updated.id, ...updated.data() };
        }
        const id = this.generateId();
        const progress = {
          id,
          userId,
          lessonId,
          completed: 1,
          completedAt: /* @__PURE__ */ new Date()
        };
        await db.collection("userLessonProgress").doc(id).set(progress);
        return progress;
      }
      // IQ Test methods
      async getRandomIQQuestions(count, language = "en") {
        const snapshot = await db.collection("iqQuestions").where("language", "==", language).get();
        const questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return questions.sort(() => Math.random() - 0.5).slice(0, count);
      }
      async getIQQuestion(id) {
        const doc = await db.collection("iqQuestions").doc(id).get();
        if (!doc.exists) return void 0;
        return { id: doc.id, ...doc.data() };
      }
      async createIQTestSession(sessionData) {
        const id = this.generateId();
        const session = {
          ...sessionData,
          id,
          startedAt: /* @__PURE__ */ new Date(),
          completedAt: null
        };
        await db.collection("iqTestSessions").doc(id).set(session);
        return session;
      }
      async createIQTestSessionWithId(session) {
        await db.collection("iqTestSessions").doc(session.id).set(session);
        return session;
      }
      async saveIQTestAnswer(answer) {
        const id = this.generateId();
        const iqAnswer = {
          ...answer,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("iqTestAnswers").doc(id).set(iqAnswer);
        return iqAnswer;
      }
      async getIQTestSession(sessionId) {
        const doc = await db.collection("iqTestSessions").doc(sessionId).get();
        if (!doc.exists) return void 0;
        return { id: doc.id, ...doc.data() };
      }
      async getIQTestSessions(userId) {
        const snapshot = await db.collection("iqTestSessions").where("userId", "==", userId).orderBy("completedAt", "desc").limit(20).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      async getIQTestAnswers(sessionId) {
        const snapshot = await db.collection("iqTestAnswers").where("sessionId", "==", sessionId).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      // Magic Link methods
      async createMagicLinkToken(userId) {
        const crypto2 = await import("crypto");
        const token = crypto2.randomBytes(32).toString("base64url");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
        const id = this.generateId();
        const magicLink = {
          id,
          userId,
          token,
          expiresAt,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("magicLinkTokens").doc(id).set(magicLink);
        return magicLink;
      }
      async verifyMagicLinkToken(token) {
        const snapshot = await db.collection("magicLinkTokens").where("token", "==", token).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        const magicLink = { id: doc.id, ...doc.data() };
        if (/* @__PURE__ */ new Date() > magicLink.expiresAt) return null;
        if (magicLink.usedAt) return null;
        await doc.ref.update({ usedAt: /* @__PURE__ */ new Date() });
        const user = await this.getUser(magicLink.userId);
        return user || null;
      }
      async cleanupExpiredTokens() {
        const now = /* @__PURE__ */ new Date();
        const snapshot = await db.collection("magicLinkTokens").where("expiresAt", "<", now).get();
        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
      // Daily Plan methods
      async getDailyPlan(userId, date) {
        const snapshot = await db.collection("dailyPlanProgress").where("userId", "==", userId).where("date", "==", date).limit(1).get();
        if (snapshot.empty) return void 0;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      async updateDailyPlanTask(userId, date, taskField, completed) {
        const existingPlan = await this.getDailyPlan(userId, date);
        if (existingPlan) {
          await db.collection("dailyPlanProgress").doc(existingPlan.id).update({
            [taskField]: completed
          });
          return await this.getDailyPlan(userId, date);
        } else {
          const id = this.generateId();
          const plan = {
            id,
            userId,
            date,
            moodCompleted: 0,
            thetaAudioCompleted: 0,
            breathingCompleted: 0,
            gameCompleted: 0,
            [taskField]: completed,
            createdAt: /* @__PURE__ */ new Date()
          };
          await db.collection("dailyPlanProgress").doc(id).set(plan);
          return plan;
        }
      }
      // Journal methods
      async createJournalEntry(entry) {
        const id = this.generateId();
        const journalEntry = {
          ...entry,
          id,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        await db.collection("journalEntries").doc(id).set(journalEntry);
        return journalEntry;
      }
      async getJournalEntries(userId) {
        const snapshot = await db.collection("journalEntries").where("userId", "==", userId).orderBy("createdAt", "desc").get();
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : void 0
          };
        });
      }
      async getJournalEntry(id) {
        const doc = await db.collection("journalEntries").doc(id).get();
        if (!doc.exists) return void 0;
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : void 0
        };
      }
      async updateJournalEntry(id, updates) {
        await db.collection("journalEntries").doc(id).update({
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        });
        return await this.getJournalEntry(id);
      }
      async deleteJournalEntry(id) {
        await db.collection("journalEntries").doc(id).delete();
      }
      // Addiction methods
      async createAddiction(addiction) {
        const id = this.generateId();
        const newAddiction = {
          ...addiction,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("addictions").doc(id).set(newAddiction);
        return newAddiction;
      }
      async getUserAddictions(userId) {
        const snapshot = await db.collection("addictions").where("userId", "==", userId).orderBy("createdAt", "desc").get();
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          const toDate = (val) => {
            if (!val) return null;
            if (typeof val.toDate === "function") return val.toDate();
            return new Date(val);
          };
          return {
            id: doc.id,
            ...data,
            createdAt: toDate(data.createdAt) || /* @__PURE__ */ new Date(),
            quitDate: toDate(data.quitDate) || /* @__PURE__ */ new Date(),
            lastRelapseDate: toDate(data.lastRelapseDate)
          };
        });
      }
      async getAddiction(id) {
        const doc = await db.collection("addictions").doc(id).get();
        if (!doc.exists) return void 0;
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          quitDate: data.quitDate?.toDate ? data.quitDate.toDate() : new Date(data.quitDate),
          lastRelapseDate: data.lastRelapseDate?.toDate ? data.lastRelapseDate.toDate() : data.lastRelapseDate ? new Date(data.lastRelapseDate) : null,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        };
      }
      async updateAddiction(id, updates) {
        await db.collection("addictions").doc(id).update(updates);
        return await this.getAddiction(id);
      }
      async deleteAddiction(id) {
        await db.collection("addictions").doc(id).delete();
      }
      async logAddictionCheckin(checkin) {
        const id = this.generateId();
        const newCheckin = {
          ...checkin,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("addictionCheckins").doc(id).set(newCheckin);
        return newCheckin;
      }
      async getAddictionCheckins(addictionId) {
        const snapshot = await db.collection("addictionCheckins").where("addictionId", "==", addictionId).orderBy("date", "desc").limit(365).get();
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
          };
        });
      }
      // Chat rate limiting (no message logging)
      async incrementChatCount(userId) {
        await db.collection("chatCounts").add({
          userId,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      async getRecentChatCount(userId) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
        const snapshot = await db.collection("chatCounts").where("userId", "==", userId).where("createdAt", ">=", oneHourAgo).get();
        return snapshot.size;
      }
      // Quiz Result methods
      async createQuizResult(result) {
        const id = this.generateId();
        const quizResult = {
          ...result,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("quizResults").doc(id).set(quizResult);
        return quizResult;
      }
      async getQuizResultByEmail(email) {
        const snapshot = await db.collection("quizResults").where("email", "==", email).get();
        if (snapshot.empty) return void 0;
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
          };
        });
        docs.sort((a, b) => {
          const dateA = a.createdAt ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt ? b.createdAt.getTime() : 0;
          return dateB - dateA;
        });
        return docs[0];
      }
      async linkQuizResultToUser(quizResultId, userId) {
        await db.collection("quizResults").doc(quizResultId).update({ userId });
      }
      async getQuizResultByUserId(userId) {
        const snapshot = await db.collection("quizResults").where("userId", "==", userId).get();
        if (snapshot.empty) return void 0;
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
          };
        });
        docs.sort((a, b) => {
          const dateA = a.createdAt ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt ? b.createdAt.getTime() : 0;
          return dateB - dateA;
        });
        return docs[0];
      }
      async cleanupUnlinkedQuizResults(olderThanDays) {
        const cutoffDate = /* @__PURE__ */ new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        const snapshot = await db.collection("quizResults").where("userId", "==", null).get();
        const toDelete = snapshot.docs.filter((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          return createdAt < cutoffDate;
        });
        if (toDelete.length === 0) {
          return 0;
        }
        const batchSize = 500;
        let deletedCount = 0;
        for (let i = 0; i < toDelete.length; i += batchSize) {
          const batch = db.batch();
          const batchDocs = toDelete.slice(i, i + batchSize);
          batchDocs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          deletedCount += batchDocs.length;
        }
        return deletedCount;
      }
      // Sleep methods
      async createSleepEntry(entry) {
        const id = this.generateId();
        const sleepEntry = {
          ...entry,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        await db.collection("sleepEntries").doc(id).set(sleepEntry);
        return sleepEntry;
      }
      async getRecentSleepEntries(userId, limit = 7) {
        const snapshot = await db.collection("sleepEntries").where("userId", "==", userId).orderBy("date", "desc").limit(limit).get();
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
          };
        });
      }
      async getSleepProgramProgress(userId) {
        const snapshot = await db.collection("sleepProgramProgress").where("userId", "==", userId).limit(1).get();
        if (snapshot.empty) return void 0;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      async updateSleepProgramProgress(userId, completedDays) {
        const existing = await this.getSleepProgramProgress(userId);
        if (existing) {
          await db.collection("sleepProgramProgress").doc(existing.id).update({
            completedDays,
            updatedAt: /* @__PURE__ */ new Date()
          });
          return { ...existing, completedDays, updatedAt: /* @__PURE__ */ new Date() };
        } else {
          const id = this.generateId();
          const progress = {
            id,
            userId,
            completedDays,
            updatedAt: /* @__PURE__ */ new Date()
          };
          await db.collection("sleepProgramProgress").doc(id).set(progress);
          return progress;
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// ../server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  hashPassword: () => hashPassword,
  setupAuth: () => setupAuth,
  verifyToken: () => verifyToken
});
import { getAuth } from "firebase-admin/auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized: No email in token" });
    }
    let user = await storage.getUserByEmail(email);
    if (!user) {
      console.log(`[AUTH] User ${email} authenticated via Firebase but not found in DB. Creating...`);
      let username = email.split("@")[0];
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        const suffix = Math.floor(1e3 + Math.random() * 9e3);
        username = `${username}${suffix}`;
      }
      try {
        user = await storage.createUser({
          username,
          password: "firebase-managed",
          // Placeholder, auth handled by Firebase
          email,
          language: "en"
          // Default language
        });
        console.log(`[AUTH] Created new user: ${user.id} (${user.email})`);
      } catch (createError) {
        console.error("[AUTH] Failed to auto-create user:", createError);
        return res.status(500).json({ error: "Failed to create user record" });
      }
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
function setupAuth(app2) {
  app2.get("/api/user", verifyToken, (req, res) => {
    res.json(req.user);
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const { username, password, email, language } = req.body;
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }
      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      if (decodedToken.email !== email) {
        return res.status(403).json({ error: "Forbidden: Email mismatch" });
      }
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const user = await storage.createUser({
        username,
        password: "firebase-managed",
        // Placeholder
        email,
        language
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.patch("/api/user/email", verifyToken, async (req, res) => {
    try {
      const updated = await storage.updateUserEmail(req.user.id, req.body.email);
      res.json(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.patch("/api/user/password", verifyToken, async (req, res) => {
    res.status(400).json({ error: "Password management is handled by Firebase" });
  });
  app2.patch("/api/user/language", verifyToken, async (req, res) => {
    try {
      const { language } = req.body;
      const validLanguages = ["en", "de", "fr", "pt"];
      if (!language || !validLanguages.includes(language)) {
        return res.status(400).send("Invalid language");
      }
      const updated = await storage.updateUserLanguage(req.user.id, language);
      res.json(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.post("/api/simple-login", async (req, res) => {
    try {
      const { email: rawEmail } = req.body;
      if (!rawEmail) return res.status(400).json({ error: "Email is required" });
      const email = rawEmail.toLowerCase().trim();
      console.log(`[Simple Login] Attempting login for: ${email}`);
      const googleOnlyAccounts = ["ricdes@gmail.com"];
      if (googleOnlyAccounts.includes(email)) {
        console.log(`[Simple Login] Account ${email} requires Google Sign-In`);
        return res.status(403).json({
          error: "Google Sign-In required",
          message: "This account requires Google Sign-In. Please use the Google button to log in."
        });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log(`[Simple Login] User not found in DB: ${email}`);
        return res.status(404).json({ error: "Account not found" });
      }
      if (user.subscriptionStatus !== "active") {
        console.log(`[Simple Login] User ${email} has inactive subscription: ${user.subscriptionStatus}`);
        return res.status(403).json({
          error: "Subscription inactive",
          message: "Your subscription is not active. Please renew to continue."
        });
      }
      console.log(`[Simple Login] User found with active subscription: ${email} (ID: ${user.id})`);
      let firebaseUid;
      try {
        const firebaseUser = await getAuth().getUserByEmail(email);
        firebaseUid = firebaseUser.uid;
        console.log(`[Simple Login] Found existing Firebase Auth user: ${firebaseUid}`);
      } catch (e) {
        if (e.code === "auth/user-not-found") {
          console.log(`[Simple Login] Creating Firebase Auth user for: ${email}`);
          try {
            const newFirebaseUser = await getAuth().createUser({
              email,
              emailVerified: true
              // Skip email verification for existing DB users
            });
            firebaseUid = newFirebaseUser.uid;
            console.log(`[Simple Login] Created Firebase Auth user: ${firebaseUid}`);
          } catch (createError) {
            console.error(`[Simple Login] Failed to create Firebase Auth user:`, createError);
            return res.status(500).json({ error: "Failed to create authentication record" });
          }
        } else {
          console.error(`[Simple Login] Firebase Auth error:`, e);
          return res.status(500).json({ error: "Authentication service error" });
        }
      }
      const customToken = await getAuth().createCustomToken(firebaseUid);
      console.log(`[Simple Login] Generated custom token for: ${email}`);
      res.json({ token: customToken });
    } catch (error) {
      console.error("[Simple Login] Error:", error);
      res.status(500).json({
        error: error.message,
        code: error.code,
        details: error.toString()
      });
    }
  });
}
var scryptAsync;
var init_auth = __esm({
  "../server/auth.ts"() {
    "use strict";
    init_storage();
    scryptAsync = promisify(scrypt);
  }
});

// ../server/seed-firestore.ts
var seed_firestore_exports = {};
__export(seed_firestore_exports, {
  seedFirestore: () => seedFirestore
});
import { initializeApp as initializeApp2, getApps as getApps2, cert as cert2 } from "firebase-admin/app";
import { getFirestore as getFirestore2 } from "firebase-admin/firestore";
import { readFileSync as readFileSync2, readdirSync } from "fs";
import { resolve, join as join2, dirname } from "path";
import { fileURLToPath } from "url";
function loadJSON(path) {
  return JSON.parse(readFileSync2(resolve(__dirname, path), "utf-8"));
}
async function seedFirestore() {
  console.log("Starting Firestore seeding...\\n");
  console.log("\u{1F5D1}\uFE0F  Deleting old courses and lessons...");
  const coursesSnapshot = await db2.collection("courses").get();
  const lessonsSnapshot = await db2.collection("lessons").get();
  const deleteBatch = db2.batch();
  coursesSnapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
  lessonsSnapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
  await deleteBatch.commit();
  console.log(`   Deleted ${coursesSnapshot.size} courses and ${lessonsSnapshot.size} lessons
`);
  console.log("\u{1F4DA} Loading new course content...");
  const courses = loadJSON("content/courses.json");
  const contentEn = loadJSON("content/translations/en/content.json");
  const lessonMetadata = {};
  const contentDir = resolve(__dirname, "content/lessons");
  for (const courseId of ["cognitive_fitness", "mindfulness_meditation", "addiction_recovery", "emotional_intelligence", "productivity_focus"]) {
    const lessonDir = join2(contentDir, courseId);
    const lessonFiles = readdirSync(lessonDir).filter((f) => f.endsWith(".json"));
    for (const file of lessonFiles) {
      const lessonData = JSON.parse(readFileSync2(join2(lessonDir, file), "utf-8"));
      lessonMetadata[lessonData.id] = lessonData;
    }
  }
  console.log(`   Loaded ${Object.keys(lessonMetadata).length} lessons
`);
  console.log("Creating courses...");
  const languages = ["en", "de", "fr", "pt"];
  const courseBatch = db2.batch();
  for (const course of courses) {
    for (const lang of languages) {
      const courseId = lang === "en" ? course.id : `${course.id}_${lang}`;
      const courseRef = db2.collection("courses").doc(courseId);
      const courseData = {
        ...course,
        id: courseId,
        language: lang,
        title: getCourseTitleForLang(course.id, lang),
        description: getCourseDescriptionForLang(course.id, lang),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      courseBatch.set(courseRef, courseData);
    }
    console.log(`  \u2713 Created course: ${course.id} (4 languages)`);
  }
  await courseBatch.commit();
  console.log(`\\n\u2705 Created ${courses.length * 4} course documents
`);
  console.log("Creating lessons...");
  const lessonBatch = db2.batch();
  let lessonCount = 0;
  for (const [lessonId, metadata] of Object.entries(lessonMetadata)) {
    for (const lang of languages) {
      const localizedLessonId = lang === "en" ? lessonId : `${lessonId}_${lang}`;
      const courseId = lang === "en" ? metadata.courseId : `${metadata.courseId}_${lang}`;
      const lessonRef = db2.collection("lessons").doc(localizedLessonId);
      const lessonData = {
        id: localizedLessonId,
        courseId,
        orderIndex: metadata.orderIndex,
        estimatedMinutes: metadata.estimatedMinutes,
        language: lang,
        title: getLessonTitleForLang(lessonId, lang),
        content: getLessonContentForLang(lessonId, lang),
        youtubeVideos: metadata.youtubeVideos || [],
        audioUrl: "",
        createdAt: /* @__PURE__ */ new Date()
      };
      lessonBatch.set(lessonRef, lessonData);
      lessonCount++;
    }
  }
  await lessonBatch.commit();
  console.log(`\\n\u2705 Created ${lessonCount} lesson documents
`);
  console.log("Creating IQ questions...");
  await seedIQQuestions();
  console.log("\\n\u2705 Firestore seeding completed successfully!");
}
function getCourseTitleForLang(courseId, lang) {
  const contentPath = `content/translations/${lang}/content.json`;
  try {
    const content = loadJSON(contentPath);
    return content.courses[courseId]?.title || courseId;
  } catch {
    const enContent = loadJSON("content/translations/en/content.json");
    return enContent.courses[courseId]?.title || courseId;
  }
}
function getCourseDescriptionForLang(courseId, lang) {
  const contentPath = `content/translations/${lang}/content.json`;
  try {
    const content = loadJSON(contentPath);
    return content.courses[courseId]?.description || "";
  } catch {
    const enContent = loadJSON("content/translations/en/content.json");
    return enContent.courses[courseId]?.description || "";
  }
}
function getLessonTitleForLang(lessonId, lang) {
  const contentPath = `content/translations/${lang}/content.json`;
  try {
    const content = loadJSON(contentPath);
    return content.lessons[lessonId]?.title || lessonId;
  } catch {
    const enContent = loadJSON("content/translations/en/content.json");
    return enContent.lessons[lessonId]?.title || lessonId;
  }
}
function getLessonContentForLang(lessonId, lang) {
  const contentPath = `content/translations/${lang}/content.json`;
  try {
    const content = loadJSON(contentPath);
    return content.lessons[lessonId]?.content || "Content coming soon...";
  } catch {
    const enContent = loadJSON("content/translations/en/content.json");
    return enContent.lessons[lessonId]?.content || "Content coming soon...";
  }
}
async function seedIQQuestions() {
  const allQuestions = loadJSON("content/iq-questions-all.json");
  const existingQuestions = await db2.collection("iqQuestions").get();
  if (!existingQuestions.empty) {
    const deleteBatch = db2.batch();
    existingQuestions.docs.forEach((doc) => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log(`  Deleted ${existingQuestions.size} existing IQ questions`);
  }
  const batch = db2.batch();
  let questionCount = 0;
  for (const question of allQuestions) {
    const questionRef = db2.collection("iqQuestions").doc(question.id);
    const optionsString = Array.isArray(question.options) ? JSON.stringify(question.options) : question.options;
    const questionData = {
      ...question,
      options: optionsString,
      // Overwrite with stringified version
      createdAt: /* @__PURE__ */ new Date()
    };
    batch.set(questionRef, questionData);
    questionCount++;
  }
  await batch.commit();
  console.log(`  \u2713 Created ${questionCount} IQ questions from comprehensive dataset`);
}
var __filename, __dirname, db2;
var init_seed_firestore = __esm({
  "../server/seed-firestore.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
    if (getApps2().length === 0) {
      try {
        const serviceAccountPath = resolve(__dirname, "../service-account.json");
        try {
          const serviceAccount = JSON.parse(readFileSync2(serviceAccountPath, "utf-8"));
          initializeApp2({
            credential: cert2(serviceAccount)
          });
          console.log("\u2713 Firebase Admin initialized with service account");
        } catch (fileError) {
          initializeApp2();
          console.log("\u2713 Firebase Admin initialized with default credentials");
        }
      } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        process.exit(1);
      }
    }
    db2 = getFirestore2();
    seedFirestore().then(() => process.exit(0)).catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
  }
});

// ../server/woocommerce.ts
var woocommerce_exports = {};
__export(woocommerce_exports, {
  cancelSubscription: () => cancelSubscription,
  getCustomerSubscriptions: () => getCustomerSubscriptions,
  getSubscription: () => getSubscription,
  pauseSubscription: () => pauseSubscription,
  resumeSubscription: () => resumeSubscription,
  updateSubscription: () => updateSubscription
});
async function wooCommerceRequest(endpoint, method = "GET", body) {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn("WooCommerce API credentials not configured - skipping API call");
    return {};
  }
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3${endpoint}`;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : void 0
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WooCommerce API error: ${response.status} - ${error}`);
  }
  return response.json();
}
async function getSubscription(subscriptionId) {
  return wooCommerceRequest(`/subscriptions/${subscriptionId}`);
}
async function updateSubscription(subscriptionId, status) {
  return wooCommerceRequest(
    `/subscriptions/${subscriptionId}`,
    "PUT",
    { status }
  );
}
async function getCustomerSubscriptions(email) {
  const customers = await wooCommerceRequest(`/customers?email=${encodeURIComponent(email)}`);
  if (!customers || customers.length === 0) {
    return [];
  }
  const customerId = customers[0].id;
  return wooCommerceRequest(`/subscriptions?customer=${customerId}`);
}
async function pauseSubscription(subscriptionId) {
  return updateSubscription(subscriptionId, "on-hold");
}
async function resumeSubscription(subscriptionId) {
  return updateSubscription(subscriptionId, "active");
}
async function cancelSubscription(subscriptionId) {
  return updateSubscription(subscriptionId, "cancelled");
}
var WOOCOMMERCE_URL, CONSUMER_KEY, CONSUMER_SECRET;
var init_woocommerce = __esm({
  "../server/woocommerce.ts"() {
    "use strict";
    WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://buy.creativewaves.me";
    CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
    CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  }
});

// ../node_modules/@google/generative-ai/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  BlockReason: () => BlockReason,
  ChatSession: () => ChatSession,
  DynamicRetrievalMode: () => DynamicRetrievalMode,
  ExecutableCodeLanguage: () => ExecutableCodeLanguage,
  FinishReason: () => FinishReason,
  FunctionCallingMode: () => FunctionCallingMode,
  GenerativeModel: () => GenerativeModel,
  GoogleGenerativeAI: () => GoogleGenerativeAI,
  GoogleGenerativeAIAbortError: () => GoogleGenerativeAIAbortError,
  GoogleGenerativeAIError: () => GoogleGenerativeAIError,
  GoogleGenerativeAIFetchError: () => GoogleGenerativeAIFetchError,
  GoogleGenerativeAIRequestInputError: () => GoogleGenerativeAIRequestInputError,
  GoogleGenerativeAIResponseError: () => GoogleGenerativeAIResponseError,
  HarmBlockThreshold: () => HarmBlockThreshold,
  HarmCategory: () => HarmCategory,
  HarmProbability: () => HarmProbability,
  Outcome: () => Outcome,
  POSSIBLE_ROLES: () => POSSIBLE_ROLES,
  SchemaType: () => SchemaType,
  TaskType: () => TaskType
});
function getClientHeaders(requestOptions) {
  const clientHeaders = [];
  if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
    clientHeaders.push(requestOptions.apiClient);
  }
  clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
  return clientHeaders.join(" ");
}
async function getHeaders(url) {
  var _a;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
  headers.append("x-goog-api-key", url.apiKey);
  let customHeaders = (_a = url.requestOptions) === null || _a === void 0 ? void 0 : _a.customHeaders;
  if (customHeaders) {
    if (!(customHeaders instanceof Headers)) {
      try {
        customHeaders = new Headers(customHeaders);
      } catch (e) {
        throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
      }
    }
    for (const [headerName, headerValue] of customHeaders.entries()) {
      if (headerName === "x-goog-api-key") {
        throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
      } else if (headerName === "x-goog-api-client") {
        throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
      }
      headers.append(headerName, headerValue);
    }
  }
  return headers;
}
async function constructModelRequest(model, task, apiKey, stream, body, requestOptions) {
  const url = new RequestUrl(model, task, apiKey, stream, requestOptions);
  return {
    url: url.toString(),
    fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: await getHeaders(url), body })
  };
}
async function makeModelRequest(model, task, apiKey, stream, body, requestOptions = {}, fetchFn = fetch) {
  const { url, fetchOptions } = await constructModelRequest(model, task, apiKey, stream, body, requestOptions);
  return makeRequest(url, fetchOptions, fetchFn);
}
async function makeRequest(url, fetchOptions, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(url, fetchOptions);
  } catch (e) {
    handleResponseError(e, url);
  }
  if (!response.ok) {
    await handleResponseNotOk(response, url);
  }
  return response;
}
function handleResponseError(e, url) {
  let err = e;
  if (err.name === "AbortError") {
    err = new GoogleGenerativeAIAbortError(`Request aborted when fetching ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  } else if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
    err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  }
  throw err;
}
async function handleResponseNotOk(response, url) {
  let message = "";
  let errorDetails;
  try {
    const json = await response.json();
    message = json.error.message;
    if (json.error.details) {
      message += ` ${JSON.stringify(json.error.details)}`;
      errorDetails = json.error.details;
    }
  } catch (e) {
  }
  throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
}
function buildFetchOptions(requestOptions) {
  const fetchOptions = {};
  if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== void 0 || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
    const controller = new AbortController();
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
      setTimeout(() => controller.abort(), requestOptions.timeout);
    }
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
      requestOptions.signal.addEventListener("abort", () => {
        controller.abort();
      });
    }
    fetchOptions.signal = controller.signal;
  }
  return fetchOptions;
}
function addHelpers(response) {
  response.text = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getText(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return "";
  };
  response.functionCall = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      console.warn(`response.functionCall() is deprecated. Use response.functionCalls() instead.`);
      return getFunctionCalls(response)[0];
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  response.functionCalls = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getFunctionCalls(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  return response;
}
function getText(response) {
  var _a, _b, _c, _d;
  const textStrings = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.text) {
        textStrings.push(part.text);
      }
      if (part.executableCode) {
        textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
      }
      if (part.codeExecutionResult) {
        textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
      }
    }
  }
  if (textStrings.length > 0) {
    return textStrings.join("");
  } else {
    return "";
  }
}
function getFunctionCalls(response) {
  var _a, _b, _c, _d;
  const functionCalls = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }
  }
  if (functionCalls.length > 0) {
    return functionCalls;
  } else {
    return void 0;
  }
}
function hadBadFinishReason(candidate) {
  return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
  var _a, _b, _c;
  let message = "";
  if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
    message += "Response was blocked";
    if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
      message += ` due to ${response.promptFeedback.blockReason}`;
    }
    if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
      message += `: ${response.promptFeedback.blockReasonMessage}`;
    }
  } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
    const firstCandidate = response.candidates[0];
    if (hadBadFinishReason(firstCandidate)) {
      message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
      if (firstCandidate.finishMessage) {
        message += `: ${firstCandidate.finishMessage}`;
      }
    }
  }
  return message;
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function processStream(response) {
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  const responseStream = getResponseStream(inputStream);
  const [stream1, stream2] = responseStream.tee();
  return {
    stream: generateResponseSequence(stream1),
    response: getResponsePromise(stream2)
  };
}
async function getResponsePromise(stream) {
  const allResponses = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return addHelpers(aggregateResponses(allResponses));
    }
    allResponses.push(value);
  }
}
function generateResponseSequence(stream) {
  return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
    const reader = stream.getReader();
    while (true) {
      const { value, done } = yield __await(reader.read());
      if (done) {
        break;
      }
      yield yield __await(addHelpers(value));
    }
  });
}
function getResponseStream(inputStream) {
  const reader = inputStream.getReader();
  const stream = new ReadableStream({
    start(controller) {
      let currentText = "";
      return pump();
      function pump() {
        return reader.read().then(({ value, done }) => {
          if (done) {
            if (currentText.trim()) {
              controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
              return;
            }
            controller.close();
            return;
          }
          currentText += value;
          let match = currentText.match(responseLineRE);
          let parsedResponse;
          while (match) {
            try {
              parsedResponse = JSON.parse(match[1]);
            } catch (e) {
              controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
              return;
            }
            controller.enqueue(parsedResponse);
            currentText = currentText.substring(match[0].length);
            match = currentText.match(responseLineRE);
          }
          return pump();
        }).catch((e) => {
          let err = e;
          err.stack = e.stack;
          if (err.name === "AbortError") {
            err = new GoogleGenerativeAIAbortError("Request aborted when reading from the stream");
          } else {
            err = new GoogleGenerativeAIError("Error reading from the stream");
          }
          throw err;
        });
      }
    }
  });
  return stream;
}
function aggregateResponses(responses) {
  const lastResponse = responses[responses.length - 1];
  const aggregatedResponse = {
    promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
  };
  for (const response of responses) {
    if (response.candidates) {
      let candidateIndex = 0;
      for (const candidate of response.candidates) {
        if (!aggregatedResponse.candidates) {
          aggregatedResponse.candidates = [];
        }
        if (!aggregatedResponse.candidates[candidateIndex]) {
          aggregatedResponse.candidates[candidateIndex] = {
            index: candidateIndex
          };
        }
        aggregatedResponse.candidates[candidateIndex].citationMetadata = candidate.citationMetadata;
        aggregatedResponse.candidates[candidateIndex].groundingMetadata = candidate.groundingMetadata;
        aggregatedResponse.candidates[candidateIndex].finishReason = candidate.finishReason;
        aggregatedResponse.candidates[candidateIndex].finishMessage = candidate.finishMessage;
        aggregatedResponse.candidates[candidateIndex].safetyRatings = candidate.safetyRatings;
        if (candidate.content && candidate.content.parts) {
          if (!aggregatedResponse.candidates[candidateIndex].content) {
            aggregatedResponse.candidates[candidateIndex].content = {
              role: candidate.content.role || "user",
              parts: []
            };
          }
          const newPart = {};
          for (const part of candidate.content.parts) {
            if (part.text) {
              newPart.text = part.text;
            }
            if (part.functionCall) {
              newPart.functionCall = part.functionCall;
            }
            if (part.executableCode) {
              newPart.executableCode = part.executableCode;
            }
            if (part.codeExecutionResult) {
              newPart.codeExecutionResult = part.codeExecutionResult;
            }
            if (Object.keys(newPart).length === 0) {
              newPart.text = "";
            }
            aggregatedResponse.candidates[candidateIndex].content.parts.push(newPart);
          }
        }
      }
      candidateIndex++;
    }
    if (response.usageMetadata) {
      aggregatedResponse.usageMetadata = response.usageMetadata;
    }
  }
  return aggregatedResponse;
}
async function generateContentStream(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.STREAM_GENERATE_CONTENT,
    apiKey,
    /* stream */
    true,
    JSON.stringify(params),
    requestOptions
  );
  return processStream(response);
}
async function generateContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.GENERATE_CONTENT,
    apiKey,
    /* stream */
    false,
    JSON.stringify(params),
    requestOptions
  );
  const responseJson = await response.json();
  const enhancedResponse = addHelpers(responseJson);
  return {
    response: enhancedResponse
  };
}
function formatSystemInstruction(input) {
  if (input == null) {
    return void 0;
  } else if (typeof input === "string") {
    return { role: "system", parts: [{ text: input }] };
  } else if (input.text) {
    return { role: "system", parts: [input] };
  } else if (input.parts) {
    if (!input.role) {
      return { role: "system", parts: input.parts };
    } else {
      return input;
    }
  }
}
function formatNewContent(request) {
  let newParts = [];
  if (typeof request === "string") {
    newParts = [{ text: request }];
  } else {
    for (const partOrString of request) {
      if (typeof partOrString === "string") {
        newParts.push({ text: partOrString });
      } else {
        newParts.push(partOrString);
      }
    }
  }
  return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
function assignRoleToPartsAndValidateSendMessageRequest(parts) {
  const userContent = { role: "user", parts: [] };
  const functionContent = { role: "function", parts: [] };
  let hasUserContent = false;
  let hasFunctionContent = false;
  for (const part of parts) {
    if ("functionResponse" in part) {
      functionContent.parts.push(part);
      hasFunctionContent = true;
    } else {
      userContent.parts.push(part);
      hasUserContent = true;
    }
  }
  if (hasUserContent && hasFunctionContent) {
    throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  }
  if (!hasUserContent && !hasFunctionContent) {
    throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
  }
  if (hasUserContent) {
    return userContent;
  }
  return functionContent;
}
function formatCountTokensInput(params, modelParams) {
  var _a;
  let formattedGenerateContentRequest = {
    model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
    generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
    safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
    tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
    toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
    systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
    cachedContent: (_a = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a === void 0 ? void 0 : _a.name,
    contents: []
  };
  const containsGenerateContentRequest = params.generateContentRequest != null;
  if (params.contents) {
    if (containsGenerateContentRequest) {
      throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    }
    formattedGenerateContentRequest.contents = params.contents;
  } else if (containsGenerateContentRequest) {
    formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
  } else {
    const content = formatNewContent(params);
    formattedGenerateContentRequest.contents = [content];
  }
  return { generateContentRequest: formattedGenerateContentRequest };
}
function formatGenerateContentInput(params) {
  let formattedRequest;
  if (params.contents) {
    formattedRequest = params;
  } else {
    const content = formatNewContent(params);
    formattedRequest = { contents: [content] };
  }
  if (params.systemInstruction) {
    formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
  }
  return formattedRequest;
}
function formatEmbedContentInput(params) {
  if (typeof params === "string" || Array.isArray(params)) {
    const content = formatNewContent(params);
    return { content };
  }
  return params;
}
function validateChatHistory(history) {
  let prevContent = false;
  for (const currContent of history) {
    const { role, parts } = currContent;
    if (!prevContent && role !== "user") {
      throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
    }
    if (!POSSIBLE_ROLES.includes(role)) {
      throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
    }
    if (!Array.isArray(parts)) {
      throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
    }
    if (parts.length === 0) {
      throw new GoogleGenerativeAIError("Each Content should have at least one part");
    }
    const countFields = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0,
      fileData: 0,
      executableCode: 0,
      codeExecutionResult: 0
    };
    for (const part of parts) {
      for (const key of VALID_PART_FIELDS) {
        if (key in part) {
          countFields[key] += 1;
        }
      }
    }
    const validParts = VALID_PARTS_PER_ROLE[role];
    for (const key of VALID_PART_FIELDS) {
      if (!validParts.includes(key) && countFields[key] > 0) {
        throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
      }
    }
    prevContent = true;
  }
}
function isValidResponse(response) {
  var _a;
  if (response.candidates === void 0 || response.candidates.length === 0) {
    return false;
  }
  const content = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content;
  if (content === void 0) {
    return false;
  }
  if (content.parts === void 0 || content.parts.length === 0) {
    return false;
  }
  for (const part of content.parts) {
    if (part === void 0 || Object.keys(part).length === 0) {
      return false;
    }
    if (part.text !== void 0 && part.text === "") {
      return false;
    }
  }
  return true;
}
async function countTokens(apiKey, model, params, singleRequestOptions) {
  const response = await makeModelRequest(model, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
  return response.json();
}
async function embedContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(model, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
  return response.json();
}
async function batchEmbedContents(apiKey, model, params, requestOptions) {
  const requestsWithModel = params.requests.map((request) => {
    return Object.assign(Object.assign({}, request), { model });
  });
  const response = await makeModelRequest(model, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({ requests: requestsWithModel }), requestOptions);
  return response.json();
}
var SchemaType, ExecutableCodeLanguage, Outcome, POSSIBLE_ROLES, HarmCategory, HarmBlockThreshold, HarmProbability, BlockReason, FinishReason, TaskType, FunctionCallingMode, DynamicRetrievalMode, GoogleGenerativeAIError, GoogleGenerativeAIResponseError, GoogleGenerativeAIFetchError, GoogleGenerativeAIRequestInputError, GoogleGenerativeAIAbortError, DEFAULT_BASE_URL, DEFAULT_API_VERSION, PACKAGE_VERSION, PACKAGE_LOG_HEADER, Task, RequestUrl, badFinishReasons, responseLineRE, VALID_PART_FIELDS, VALID_PARTS_PER_ROLE, SILENT_ERROR, ChatSession, GenerativeModel, GoogleGenerativeAI;
var init_dist = __esm({
  "../node_modules/@google/generative-ai/dist/index.mjs"() {
    (function(SchemaType2) {
      SchemaType2["STRING"] = "string";
      SchemaType2["NUMBER"] = "number";
      SchemaType2["INTEGER"] = "integer";
      SchemaType2["BOOLEAN"] = "boolean";
      SchemaType2["ARRAY"] = "array";
      SchemaType2["OBJECT"] = "object";
    })(SchemaType || (SchemaType = {}));
    (function(ExecutableCodeLanguage2) {
      ExecutableCodeLanguage2["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
      ExecutableCodeLanguage2["PYTHON"] = "python";
    })(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
    (function(Outcome2) {
      Outcome2["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
      Outcome2["OUTCOME_OK"] = "outcome_ok";
      Outcome2["OUTCOME_FAILED"] = "outcome_failed";
      Outcome2["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
    })(Outcome || (Outcome = {}));
    POSSIBLE_ROLES = ["user", "model", "function", "system"];
    (function(HarmCategory2) {
      HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
      HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
      HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
      HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
      HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
      HarmCategory2["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
    })(HarmCategory || (HarmCategory = {}));
    (function(HarmBlockThreshold2) {
      HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
      HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
      HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
      HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
      HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
    })(HarmBlockThreshold || (HarmBlockThreshold = {}));
    (function(HarmProbability2) {
      HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
      HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
      HarmProbability2["LOW"] = "LOW";
      HarmProbability2["MEDIUM"] = "MEDIUM";
      HarmProbability2["HIGH"] = "HIGH";
    })(HarmProbability || (HarmProbability = {}));
    (function(BlockReason2) {
      BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
      BlockReason2["SAFETY"] = "SAFETY";
      BlockReason2["OTHER"] = "OTHER";
    })(BlockReason || (BlockReason = {}));
    (function(FinishReason2) {
      FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
      FinishReason2["STOP"] = "STOP";
      FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
      FinishReason2["SAFETY"] = "SAFETY";
      FinishReason2["RECITATION"] = "RECITATION";
      FinishReason2["LANGUAGE"] = "LANGUAGE";
      FinishReason2["BLOCKLIST"] = "BLOCKLIST";
      FinishReason2["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
      FinishReason2["SPII"] = "SPII";
      FinishReason2["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
      FinishReason2["OTHER"] = "OTHER";
    })(FinishReason || (FinishReason = {}));
    (function(TaskType2) {
      TaskType2["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
      TaskType2["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
      TaskType2["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
      TaskType2["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
      TaskType2["CLASSIFICATION"] = "CLASSIFICATION";
      TaskType2["CLUSTERING"] = "CLUSTERING";
    })(TaskType || (TaskType = {}));
    (function(FunctionCallingMode2) {
      FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
      FunctionCallingMode2["AUTO"] = "AUTO";
      FunctionCallingMode2["ANY"] = "ANY";
      FunctionCallingMode2["NONE"] = "NONE";
    })(FunctionCallingMode || (FunctionCallingMode = {}));
    (function(DynamicRetrievalMode2) {
      DynamicRetrievalMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
      DynamicRetrievalMode2["MODE_DYNAMIC"] = "MODE_DYNAMIC";
    })(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
    GoogleGenerativeAIError = class extends Error {
      constructor(message) {
        super(`[GoogleGenerativeAI Error]: ${message}`);
      }
    };
    GoogleGenerativeAIResponseError = class extends GoogleGenerativeAIError {
      constructor(message, response) {
        super(message);
        this.response = response;
      }
    };
    GoogleGenerativeAIFetchError = class extends GoogleGenerativeAIError {
      constructor(message, status, statusText, errorDetails) {
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.errorDetails = errorDetails;
      }
    };
    GoogleGenerativeAIRequestInputError = class extends GoogleGenerativeAIError {
    };
    GoogleGenerativeAIAbortError = class extends GoogleGenerativeAIError {
    };
    DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
    DEFAULT_API_VERSION = "v1beta";
    PACKAGE_VERSION = "0.24.1";
    PACKAGE_LOG_HEADER = "genai-js";
    (function(Task2) {
      Task2["GENERATE_CONTENT"] = "generateContent";
      Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
      Task2["COUNT_TOKENS"] = "countTokens";
      Task2["EMBED_CONTENT"] = "embedContent";
      Task2["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
    })(Task || (Task = {}));
    RequestUrl = class {
      constructor(model, task, apiKey, stream, requestOptions) {
        this.model = model;
        this.task = task;
        this.apiKey = apiKey;
        this.stream = stream;
        this.requestOptions = requestOptions;
      }
      toString() {
        var _a, _b;
        const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
        const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
        let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
        if (this.stream) {
          url += "?alt=sse";
        }
        return url;
      }
    };
    badFinishReasons = [
      FinishReason.RECITATION,
      FinishReason.SAFETY,
      FinishReason.LANGUAGE
    ];
    responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
    VALID_PART_FIELDS = [
      "text",
      "inlineData",
      "functionCall",
      "functionResponse",
      "executableCode",
      "codeExecutionResult"
    ];
    VALID_PARTS_PER_ROLE = {
      user: ["text", "inlineData"],
      function: ["functionResponse"],
      model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
      // System instructions shouldn't be in history anyway.
      system: ["text"]
    };
    SILENT_ERROR = "SILENT_ERROR";
    ChatSession = class {
      constructor(apiKey, model, params, _requestOptions = {}) {
        this.model = model;
        this.params = params;
        this._requestOptions = _requestOptions;
        this._history = [];
        this._sendPromise = Promise.resolve();
        this._apiKey = apiKey;
        if (params === null || params === void 0 ? void 0 : params.history) {
          validateChatHistory(params.history);
          this._history = params.history;
        }
      }
      /**
       * Gets the chat history so far. Blocked prompts are not added to history.
       * Blocked candidates are not added to history, nor are the prompts that
       * generated them.
       */
      async getHistory() {
        await this._sendPromise;
        return this._history;
      }
      /**
       * Sends a chat message and receives a non-streaming
       * {@link GenerateContentResult}.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async sendMessage(request, requestOptions = {}) {
        var _a, _b, _c, _d, _e, _f;
        await this._sendPromise;
        const newContent = formatNewContent(request);
        const generateContentRequest = {
          safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
          generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
          tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
          toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
          systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
          cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
          contents: [...this._history, newContent]
        };
        const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        let finalResult;
        this._sendPromise = this._sendPromise.then(() => generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result) => {
          var _a2;
          if (isValidResponse(result.response)) {
            this._history.push(newContent);
            const responseContent = Object.assign({
              parts: [],
              // Response seems to come back without a role set.
              role: "model"
            }, (_a2 = result.response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content);
            this._history.push(responseContent);
          } else {
            const blockErrorMessage = formatBlockErrorMessage(result.response);
            if (blockErrorMessage) {
              console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
            }
          }
          finalResult = result;
        }).catch((e) => {
          this._sendPromise = Promise.resolve();
          throw e;
        });
        await this._sendPromise;
        return finalResult;
      }
      /**
       * Sends a chat message and receives the response as a
       * {@link GenerateContentStreamResult} containing an iterable stream
       * and a response promise.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async sendMessageStream(request, requestOptions = {}) {
        var _a, _b, _c, _d, _e, _f;
        await this._sendPromise;
        const newContent = formatNewContent(request);
        const generateContentRequest = {
          safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
          generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
          tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
          toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
          systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
          cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
          contents: [...this._history, newContent]
        };
        const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
        this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
          throw new Error(SILENT_ERROR);
        }).then((streamResult) => streamResult.response).then((response) => {
          if (isValidResponse(response)) {
            this._history.push(newContent);
            const responseContent = Object.assign({}, response.candidates[0].content);
            if (!responseContent.role) {
              responseContent.role = "model";
            }
            this._history.push(responseContent);
          } else {
            const blockErrorMessage = formatBlockErrorMessage(response);
            if (blockErrorMessage) {
              console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
            }
          }
        }).catch((e) => {
          if (e.message !== SILENT_ERROR) {
            console.error(e);
          }
        });
        return streamPromise;
      }
    };
    GenerativeModel = class {
      constructor(apiKey, modelParams, _requestOptions = {}) {
        this.apiKey = apiKey;
        this._requestOptions = _requestOptions;
        if (modelParams.model.includes("/")) {
          this.model = modelParams.model;
        } else {
          this.model = `models/${modelParams.model}`;
        }
        this.generationConfig = modelParams.generationConfig || {};
        this.safetySettings = modelParams.safetySettings || [];
        this.tools = modelParams.tools;
        this.toolConfig = modelParams.toolConfig;
        this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
        this.cachedContent = modelParams.cachedContent;
      }
      /**
       * Makes a single non-streaming call to the model
       * and returns an object containing a single {@link GenerateContentResponse}.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async generateContent(request, requestOptions = {}) {
        var _a;
        const formattedParams = formatGenerateContentInput(request);
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
      }
      /**
       * Makes a single streaming call to the model and returns an object
       * containing an iterable stream that iterates over all chunks in the
       * streaming response as well as a promise that returns the final
       * aggregated response.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async generateContentStream(request, requestOptions = {}) {
        var _a;
        const formattedParams = formatGenerateContentInput(request);
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
      }
      /**
       * Gets a new {@link ChatSession} instance which can be used for
       * multi-turn chats.
       */
      startChat(startChatParams) {
        var _a;
        return new ChatSession(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, startChatParams), this._requestOptions);
      }
      /**
       * Counts the tokens in the provided request.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async countTokens(request, requestOptions = {}) {
        const formattedParams = formatCountTokensInput(request, {
          model: this.model,
          generationConfig: this.generationConfig,
          safetySettings: this.safetySettings,
          tools: this.tools,
          toolConfig: this.toolConfig,
          systemInstruction: this.systemInstruction,
          cachedContent: this.cachedContent
        });
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
      }
      /**
       * Embeds the provided content.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async embedContent(request, requestOptions = {}) {
        const formattedParams = formatEmbedContentInput(request);
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
      }
      /**
       * Embeds an array of {@link EmbedContentRequest}s.
       *
       * Fields set in the optional {@link SingleRequestOptions} parameter will
       * take precedence over the {@link RequestOptions} values provided to
       * {@link GoogleGenerativeAI.getGenerativeModel }.
       */
      async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
      }
    };
    GoogleGenerativeAI = class {
      constructor(apiKey) {
        this.apiKey = apiKey;
      }
      /**
       * Gets a {@link GenerativeModel} instance for the provided model name.
       */
      getGenerativeModel(modelParams, requestOptions) {
        if (!modelParams.model) {
          throw new GoogleGenerativeAIError(`Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
        }
        return new GenerativeModel(this.apiKey, modelParams, requestOptions);
      }
      /**
       * Creates a {@link GenerativeModel} instance from provided content cache.
       */
      getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
        if (!cachedContent.name) {
          throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
        }
        if (!cachedContent.model) {
          throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
        }
        const disallowedDuplicates = ["model", "systemInstruction"];
        for (const key of disallowedDuplicates) {
          if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
            if (key === "model") {
              const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
              const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
              if (modelParamsComp === cachedContentComp) {
                continue;
              }
            }
            throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
          }
        }
        const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), { model: cachedContent.model, tools: cachedContent.tools, toolConfig: cachedContent.toolConfig, systemInstruction: cachedContent.systemInstruction, cachedContent });
        return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
      }
    };
  }
});

// src/index.ts
import "dotenv/config";
import { onRequest } from "firebase-functions/v2/https";
import express from "express";

// ../server/routes.ts
init_quizHelpers();
init_storage();
init_auth();
import { createServer } from "http";

// ../shared/schema.ts
import { z } from "zod";
var insertUserSchema = z.object({
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
  recoveryUser: z.boolean().default(false).optional(),
  expressUpgradeEnabled: z.boolean().default(false).optional()
});
var insertMoodEntrySchema = z.object({
  userId: z.string(),
  mood: z.string(),
  note: z.string().nullable().optional()
});
var insertGameScoreSchema = z.object({
  userId: z.string(),
  gameType: z.string(),
  score: z.number()
});
var insertCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
  language: z.string().default("en"),
  orderIndex: z.number()
});
var insertLessonSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  content: z.string(),
  audioUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  language: z.string().default("en"),
  orderIndex: z.number()
});
var insertUserLessonProgressSchema = z.object({
  userId: z.string(),
  lessonId: z.string(),
  completed: z.number().default(0).optional(),
  completedAt: z.date().nullable().optional()
});
var insertIQQuestionSchema = z.object({
  question: z.string(),
  questionType: z.string().optional(),
  options: z.union([z.array(z.string()), z.string()]),
  correctAnswer: z.union([z.number(), z.string()]),
  difficulty: z.union([z.string(), z.number()]).optional(),
  category: z.string().optional(),
  language: z.string().default("en")
});
var insertIQTestSessionSchema = z.object({
  userId: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number()
});
var insertIQTestAnswerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  userAnswer: z.string(),
  isCorrect: z.number()
});
var insertMagicLinkTokenSchema = z.object({
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date()
});
var insertDailyPlanProgressSchema = z.object({
  userId: z.string(),
  date: z.string(),
  thetaAudioCompleted: z.number().default(0).optional(),
  breathingCompleted: z.number().default(0).optional(),
  gameCompleted: z.number().default(0).optional(),
  moodCompleted: z.number().default(0).optional(),
  lastCompletionDate: z.date().nullable().optional()
});
var journalEntrySchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().default(false),
  createdAt: z.date().optional(),
  // Firestore timestamps are handled differently, but for schema validation Date is fine
  updatedAt: z.date().optional()
});
var insertAddictionSchema = z.object({
  userId: z.string(),
  type: z.string(),
  name: z.string(),
  quitDate: z.string().or(z.date()).transform((val) => new Date(val)),
  lastRelapseDate: z.string().or(z.date()).nullable().optional().transform((val) => val ? new Date(val) : null),
  dailyGoal: z.string().optional()
});
var insertAddictionCheckinSchema = z.object({
  addictionId: z.string(),
  date: z.string(),
  status: z.enum(["clean", "relapsed", "struggling"]),
  notes: z.string().optional()
});
var insertQuizResultSchema = z.object({
  email: z.string().email(),
  answers: z.array(z.any()),
  metadata: z.any().optional(),
  userId: z.string().nullable().optional()
});
var insertSleepEntrySchema = z.object({
  userId: z.string(),
  date: z.string(),
  bedtime: z.string(),
  sleepOnsetMinutes: z.number(),
  awakeningsCount: z.number(),
  finalWakeTime: z.string(),
  totalSleepHours: z.number(),
  sleepQuality: z.number().min(1).max(5),
  caffeineAlcohol: z.string().optional(),
  sleepEfficiency: z.number()
});
var insertSleepProgramProgressSchema = z.object({
  userId: z.string(),
  completedDays: z.array(z.number())
});

// ../server/routes.ts
import crypto from "crypto";

// ../server/i18n.ts
var emailTranslations = {
  en: {
    // Magic Link Email
    magicLink: {
      subject: "Sign in to CreativeWaves",
      title: "CreativeWaves",
      subtitle: "Your Daily Cognitive Wellness Journey",
      greeting: "Welcome back!",
      instruction: "Click the button below to sign in to your account. This link is valid for <strong>15 minutes</strong>.",
      buttonText: "Sign In",
      orCopy: "Or copy and paste this link into your browser:",
      whatsNext: "What's next?",
      whatsNextIntro: "After logging in, you'll have access to:",
      feature1: "13 guided audio sessions for relaxation and focus",
      feature2: "Brain training games to keep your mind sharp",
      feature3: "Mood tracking to monitor your emotional wellness",
      feature4: "Life improvement courses with comprehensive lessons",
      feature5: "IQ testing to challenge yourself",
      needHelp: "Need help?",
      contactUs: "Contact us at",
      disclaimer: "This is an automated message. If you didn't request this login link, you can safely ignore this email."
    },
    // Welcome Email
    welcome: {
      subject: "\u{1F389} Welcome to CreativeWaves - Your Account is Ready!",
      title: "\u{1F389} Welcome to CreativeWaves!",
      subtitle: "Your cognitive wellness journey begins now",
      greeting: "Thank you for signing up!",
      instruction: "Your account has been created successfully. Click the button below to access your account and start your wellness journey.",
      buttonText: "Access Your Account",
      validFor: "This login link is valid for <strong>15 minutes</strong>. After logging in once, you'll stay logged in for 30 days on this device.",
      subscriptionTitle: "What's included in your subscription:",
      feature1: "<strong>13 Guided Audio Sessions</strong> - Therapeutic sessions for relaxation, focus, and mental clarity (7 minutes each)",
      feature2: "<strong>Brain Training Games</strong> - Memory, pattern recognition, word games, and more to keep your mind sharp",
      feature3: "<strong>Mood Tracking</strong> - Monitor your emotional wellness with our intuitive mood tracker",
      feature4: "<strong>Life Improvement Courses</strong> - Comprehensive lessons on mindfulness, sleep, nutrition, and social connections",
      feature5: "<strong>IQ Testing</strong> - Challenge yourself with our 50-question IQ test covering logic, math, patterns, and verbal reasoning",
      multilingualTitle: "Multilingual Support:",
      multilingualText: "CreativeWaves is available in English, German, French, and Portuguese. You can change your language preference in your account settings.",
      needAssistance: "Need assistance?",
      supportText: "Our support team is here to help Monday-Friday, 9 AM - 5 PM EST at",
      disclaimer: "This is an automated welcome message from CreativeWaves.<br>You're receiving this because you subscribed at",
      buyLink: "app2.creativewaves.me",
      emailLabel: "Your email"
    }
  },
  de: {
    // Magic Link Email
    magicLink: {
      subject: "Bei CreativeWaves anmelden",
      title: "CreativeWaves",
      subtitle: "Ihre t\xE4gliche Reise zum kognitiven Wohlbefinden",
      greeting: "Willkommen zur\xFCck!",
      instruction: "Klicken Sie auf die Schaltfl\xE4che unten, um sich anzumelden. Dieser Link ist <strong>15 Minuten</strong> g\xFCltig.",
      buttonText: "Anmelden",
      orCopy: "Oder kopieren Sie diesen Link und f\xFCgen Sie ihn in Ihren Browser ein:",
      whatsNext: "Was kommt als N\xE4chstes?",
      whatsNextIntro: "Nach der Anmeldung haben Sie Zugriff auf:",
      feature1: "13 gef\xFChrte Audiositzungen f\xFCr Entspannung und Konzentration",
      feature2: "Gehirntrainingsspiele, um Ihren Geist scharf zu halten",
      feature3: "Stimmungsverfolgung zur \xDCberwachung Ihres emotionalen Wohlbefindens",
      feature4: "Kurse zur Lebensverbesserung mit umfassenden Lektionen",
      feature5: "IQ-Tests, um sich selbst herauszufordern",
      needHelp: "Brauchen Sie Hilfe?",
      contactUs: "Kontaktieren Sie uns unter",
      disclaimer: "Dies ist eine automatische Nachricht. Wenn Sie diesen Login-Link nicht angefordert haben, k\xF6nnen Sie diese E-Mail ignorieren."
    },
    // Welcome Email
    welcome: {
      subject: "\u{1F389} Willkommen bei CreativeWaves - Ihr Konto ist bereit!",
      title: "\u{1F389} Willkommen bei CreativeWaves!",
      subtitle: "Ihre kognitive Wellness-Reise beginnt jetzt",
      greeting: "Vielen Dank f\xFCr Ihre Buchung!",
      instruction: "Ihr Konto ist jetzt aktiv! Geben Sie einfach Ihre E-Mail-Adresse ein, um auf Ihre kognitive Wellness-Reise zuzugreifen.",
      buttonText: "Auf Ihr Konto zugreifen",
      validFor: "Dieser Login-Link ist <strong>15 Minuten</strong> g\xFCltig. Nach der ersten Anmeldung bleiben Sie 30 Tage lang auf diesem Ger\xE4t angemeldet.",
      subscriptionTitle: "Was in Ihrem Paket enthalten ist:",
      feature1: "<strong>13 gef\xFChrte Audiositzungen</strong> - Therapeutische Sitzungen f\xFCr Entspannung, Konzentration und geistige Klarheit (jeweils 7 Minuten)",
      feature2: "<strong>Gehirntrainingsspiele</strong> - Ged\xE4chtnis, Mustererkennung, Wortspiele und mehr, um Ihren Geist scharf zu halten",
      feature3: "<strong>Stimmungsverfolgung</strong> - \xDCberwachen Sie Ihr emotionales Wohlbefinden mit unserem intuitiven Stimmungs-Tracker",
      feature4: "<strong>Kurse zur Lebensverbesserung</strong> - Umfassende Lektionen zu Achtsamkeit, Schlaf, Ern\xE4hrung und sozialen Verbindungen",
      feature5: "<strong>IQ-Tests</strong> - Fordern Sie sich selbst mit unserem 50-Fragen-IQ-Test heraus, der Logik, Mathematik, Muster und verbales Denken abdeckt",
      multilingualTitle: "Mehrsprachige Unterst\xFCtzung:",
      multilingualText: "CreativeWaves ist in Englisch, Deutsch, Franz\xF6sisch und Portugiesisch verf\xFCgbar. Sie k\xF6nnen Ihre Spracheinstellung in Ihren Kontoeinstellungen \xE4ndern.",
      needAssistance: "Brauchen Sie Unterst\xFCtzung?",
      supportText: "Unser Support-Team hilft Ihnen gerne von Montag bis Freitag, 9-17 Uhr EST unter",
      disclaimer: "Dies ist eine automatische Willkommensnachricht von CreativeWaves.<br>Sie erhalten diese Nachricht, weil Sie sich unter abonniert haben",
      buyLink: "app2.creativewaves.me",
      emailLabel: "Ihre E-Mail"
    }
  },
  fr: {
    // Magic Link Email
    magicLink: {
      subject: "Connexion \xE0 CreativeWaves",
      title: "CreativeWaves",
      subtitle: "Votre parcours quotidien de bien-\xEAtre cognitif",
      greeting: "Bon retour !",
      instruction: "Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien est valable <strong>15 minutes</strong>.",
      buttonText: "Se connecter",
      orCopy: "Ou copiez et collez ce lien dans votre navigateur :",
      whatsNext: "Et apr\xE8s ?",
      whatsNextIntro: "Apr\xE8s vous \xEAtre connect\xE9, vous aurez acc\xE8s \xE0 :",
      feature1: "13 s\xE9ances audio guid\xE9es pour la relaxation et la concentration",
      feature2: "Jeux d'entra\xEEnement c\xE9r\xE9bral pour garder votre esprit vif",
      feature3: "Suivi de l'humeur pour surveiller votre bien-\xEAtre \xE9motionnel",
      feature4: "Cours d'am\xE9lioration de la vie avec des le\xE7ons compl\xE8tes",
      feature5: "Tests de QI pour vous mettre au d\xE9fi",
      needHelp: "Besoin d'aide ?",
      contactUs: "Contactez-nous \xE0",
      disclaimer: "Ceci est un message automatique. Si vous n'avez pas demand\xE9 ce lien de connexion, vous pouvez ignorer cet e-mail en toute s\xE9curit\xE9."
    },
    // Welcome Email
    welcome: {
      subject: "\u{1F389} Bienvenue sur CreativeWaves - Votre compte est pr\xEAt !",
      title: "\u{1F389} Bienvenue sur CreativeWaves !",
      subtitle: "Votre parcours de bien-\xEAtre cognitif commence maintenant",
      greeting: "Merci de vous \xEAtre abonn\xE9 !",
      instruction: "Votre compte a \xE9t\xE9 cr\xE9\xE9 avec succ\xE8s. Cliquez sur le bouton ci-dessous pour acc\xE9der \xE0 votre compte et commencer votre parcours de bien-\xEAtre.",
      buttonText: "Acc\xE9der \xE0 votre compte",
      validFor: "Ce lien de connexion est valable <strong>15 minutes</strong>. Apr\xE8s votre premi\xE8re connexion, vous resterez connect\xE9 pendant 30 jours sur cet appareil.",
      subscriptionTitle: "Ce qui est inclus dans votre abonnement :",
      feature1: "<strong>13 s\xE9ances audio guid\xE9es</strong> - S\xE9ances th\xE9rapeutiques pour la relaxation, la concentration et la clart\xE9 mentale (7 minutes chacune)",
      feature2: "<strong>Jeux d'entra\xEEnement c\xE9r\xE9bral</strong> - M\xE9moire, reconnaissance de motifs, jeux de mots et plus encore pour garder votre esprit vif",
      feature3: "<strong>Suivi de l'humeur</strong> - Surveillez votre bien-\xEAtre \xE9motionnel avec notre tracker d'humeur intuitif",
      feature4: "<strong>Cours d'am\xE9lioration de la vie</strong> - Le\xE7ons compl\xE8tes sur la pleine conscience, le sommeil, la nutrition et les connexions sociales",
      feature5: "<strong>Tests de QI</strong> - Mettez-vous au d\xE9fi avec notre test de QI de 50 questions couvrant la logique, les math\xE9matiques, les motifs et le raisonnement verbal",
      multilingualTitle: "Support multilingue :",
      multilingualText: "CreativeWaves est disponible en anglais, allemand, fran\xE7ais et portugais. Vous pouvez modifier votre pr\xE9f\xE9rence de langue dans les param\xE8tres de votre compte.",
      needAssistance: "Besoin d'assistance ?",
      supportText: "Notre \xE9quipe d'assistance est l\xE0 pour vous aider du lundi au vendredi, de 9h \xE0 17h EST \xE0",
      disclaimer: "Ceci est un message de bienvenue automatique de CreativeWaves.<br>Vous recevez ceci parce que vous vous \xEAtes abonn\xE9 sur",
      buyLink: "app2.creativewaves.me",
      emailLabel: "Votre e-mail"
    }
  },
  pt: {
    // Magic Link Email
    magicLink: {
      subject: "Entrar no CreativeWaves",
      title: "CreativeWaves",
      subtitle: "Sua jornada di\xE1ria de bem-estar cognitivo",
      greeting: "Bem-vindo de volta!",
      instruction: "Clique no bot\xE3o abaixo para entrar. Este link \xE9 v\xE1lido por <strong>15 minutos</strong>.",
      buttonText: "Entrar",
      orCopy: "Ou copie e cole este link no seu navegador:",
      whatsNext: "O que vem a seguir?",
      whatsNextIntro: "Ap\xF3s fazer login, voc\xEA ter\xE1 acesso a:",
      feature1: "13 sess\xF5es de \xE1udio guiadas para relaxamento e foco",
      feature2: "Jogos de treinamento cerebral para manter sua mente afiada",
      feature3: "Rastreamento de humor para monitorar seu bem-estar emocional",
      feature4: "Cursos de melhoria de vida com li\xE7\xF5es abrangentes",
      feature5: "Testes de QI para desafiar a si mesmo",
      needHelp: "Precisa de ajuda?",
      contactUs: "Entre em contato conosco em",
      disclaimer: "Esta \xE9 uma mensagem automatizada. Se voc\xEA n\xE3o solicitou este link de login, pode ignorar este e-mail com seguran\xE7a."
    },
    // Welcome Email
    welcome: {
      subject: "\u{1F389} Bem-vindo ao CreativeWaves - Sua conta est\xE1 pronta!",
      title: "\u{1F389} Bem-vindo ao CreativeWaves!",
      subtitle: "Sua jornada de bem-estar cognitivo come\xE7a agora",
      greeting: "Obrigado por assinar!",
      instruction: "Sua conta foi criada com sucesso. Clique no bot\xE3o abaixo para acessar sua conta e iniciar sua jornada de bem-estar.",
      buttonText: "Acessar sua conta",
      validFor: "Este link de login \xE9 v\xE1lido por <strong>15 minutos</strong>. Ap\xF3s fazer login uma vez, voc\xEA permanecer\xE1 conectado por 30 dias neste dispositivo.",
      subscriptionTitle: "O que est\xE1 inclu\xEDdo na sua assinatura:",
      feature1: "<strong>13 sess\xF5es de \xE1udio guiadas</strong> - Sess\xF5es terap\xEAuticas para relaxamento, foco e clareza mental (7 minutos cada)",
      feature2: "<strong>Jogos de treinamento cerebral</strong> - Mem\xF3ria, reconhecimento de padr\xF5es, jogos de palavras e muito mais para manter sua mente afiada",
      feature3: "<strong>Rastreamento de humor</strong> - Monitore seu bem-estar emocional com nosso rastreador de humor intuitivo",
      feature4: "<strong>Cursos de melhoria de vida</strong> - Li\xE7\xF5es abrangentes sobre aten\xE7\xE3o plena, sono, nutri\xE7\xE3o e conex\xF5es sociais",
      feature5: "<strong>Testes de QI</strong> - Desafie-se com nosso teste de QI de 50 perguntas cobrindo l\xF3gica, matem\xE1tica, padr\xF5es e racioc\xEDnio verbal",
      multilingualTitle: "Suporte multil\xEDngue:",
      multilingualText: "CreativeWaves est\xE1 dispon\xEDvel em ingl\xEAs, alem\xE3o, franc\xEAs e portugu\xEAs. Voc\xEA pode alterar sua prefer\xEAncia de idioma nas configura\xE7\xF5es da conta.",
      needAssistance: "Precisa de assist\xEAncia?",
      supportText: "Nossa equipe de suporte est\xE1 aqui para ajudar de segunda a sexta-feira, das 9h \xE0s 17h EST em",
      disclaimer: "Esta \xE9 uma mensagem de boas-vindas automatizada do CreativeWaves.<br>Voc\xEA est\xE1 recebendo isso porque assinou em",
      buyLink: "app2.creativewaves.me",
      emailLabel: "Seu e-mail"
    }
  }
};

// ../server/email.ts
async function sendEmail(options) {
  const brevoApiKey = process.env.BREVO_API_KEY || "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";
  if (!brevoApiKey) {
    console.error("BREVO_API_KEY is not configured");
    throw new Error("Email service not configured");
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "CreativeWaves",
          email: "support@creativewaves.me"
        },
        to: [
          {
            email: options.to
          }
        ],
        subject: options.subject,
        htmlContent: options.html
      })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo API error:", error);
      throw new Error("Failed to send email");
    }
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
async function sendWelcomeEmail(email, language = "en") {
  const validLang = ["en", "de", "fr", "pt"].includes(language) ? language : "en";
  const t = emailTranslations[validLang].welcome;
  let baseUrl = "http://localhost:5000";
  if (process.env.APP_URL) {
    baseUrl = process.env.APP_URL;
  } else if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(",");
    baseUrl = `https://${domains[0].trim()}`;
  } else if (process.env.REPLIT_DEV_DOMAIN) {
    baseUrl = `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  const loginUrl = `${baseUrl}/auth`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${t.title}</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0;">${t.subtitle}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">${t.greeting}</h2>
        
        <p style="font-size: 16px;">${t.instruction}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 40px; 
                    text-decoration: none; 
                    border-radius: 50px; 
                    font-size: 18px; 
                    font-weight: bold; 
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            ${t.buttonText}
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
          <strong>${t.emailLabel || "Email"}:</strong> ${email}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <h3 style="color: #333; margin-bottom: 15px;">${t.subscriptionTitle}</h3>
          <ul style="font-size: 14px; color: #666; line-height: 1.8;">
            <li>${t.feature1}</li>
            <li>${t.feature2}</li>
            <li>${t.feature3}</li>
            <li>${t.feature4}</li>
            <li>${t.feature5}</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #fff; border-left: 4px solid #667eea; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>${t.multilingualTitle}</strong> ${t.multilingualText}
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #fff; border-left: 4px solid #764ba2; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>${t.needAssistance}</strong> ${t.supportText} <a href="mailto:support@creativewaves.me" style="color: #667eea;">support@creativewaves.me</a>
          </p>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
          ${t.disclaimer} <a href="https://${t.buyLink}" style="color: #667eea;">${t.buyLink}</a>
        </p>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: email,
    subject: t.subject,
    html
  });
}

// ../server/routes.ts
import { z as z2 } from "zod";
import { getAuth as getAuth2 } from "firebase-admin/auth";
function verifyWebhookSignature(req, res, next) {
  const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("WOOCOMMERCE_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }
  const signature = req.headers["x-wc-webhook-signature"];
  if (!signature) {
    console.error("Webhook signature missing");
    return res.status(401).json({ error: "Webhook signature missing" });
  }
  const rawBody = req.rawBody;
  if (!rawBody) {
    console.error("Raw body not available for signature verification");
    return res.status(500).json({ error: "Webhook verification error" });
  }
  const computedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("base64");
  try {
    const signatureBuffer = Buffer.from(signature, "base64");
    const computedBuffer = Buffer.from(computedSignature, "base64");
    if (signatureBuffer.length !== computedBuffer.length) {
      console.error("Invalid webhook signature (length mismatch)");
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
    if (!crypto.timingSafeEqual(signatureBuffer, computedBuffer)) {
      console.error("Invalid webhook signature");
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    return res.status(401).json({ error: "Invalid webhook signature" });
  }
  next();
}
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.post("/api/seed-courses", async (req, res) => {
    try {
      console.log("Manual seed request received...");
      try {
        const { seedFirestore: seedFirestore2 } = await Promise.resolve().then(() => (init_seed_firestore(), seed_firestore_exports));
        await seedFirestore2();
        res.json({ success: true, message: "Database seeded successfully" });
      } catch (importError) {
        res.status(503).json({
          error: "Seed functionality not available",
          message: "Use 'npm run seed:firestore' locally instead"
        });
      }
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ error: "Failed to seed database", message: error.message });
    }
  });
  app2.get("/api/seed-courses", async (req, res) => {
    try {
      console.log("Manual seed request received (GET)...");
      try {
        const { seedFirestore: seedFirestore2 } = await Promise.resolve().then(() => (init_seed_firestore(), seed_firestore_exports));
        await seedFirestore2();
        res.json({ success: true, message: "Database seeded successfully" });
      } catch (importError) {
        res.status(503).json({
          error: "Seed functionality not available",
          message: "Use 'npm run seed:firestore' locally instead"
        });
      }
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ error: "Failed to seed database", message: error.message });
    }
  });
  app2.post("/api/admin/users", verifyToken, async (req, res) => {
    try {
      if (req.user?.email !== "ricdes@gmail.com") {
        return res.status(403).json({ error: "Forbidden: Admin access only" });
      }
      const { email: rawEmail, username, language, subscriptionStatus, wooCommerceSubscriptionId } = req.body;
      if (!rawEmail) {
        return res.status(400).json({ error: "Email is required" });
      }
      const email = rawEmail.toLowerCase().trim();
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists", user: existingUser });
      }
      let firebaseUid;
      try {
        const existingFirebaseUser = await getAuth2().getUserByEmail(email);
        firebaseUid = existingFirebaseUser.uid;
        console.log(`[Admin] Firebase Auth user already exists: ${email}`);
      } catch (e) {
        if (e.code === "auth/user-not-found") {
          const newFirebaseUser = await getAuth2().createUser({
            email,
            emailVerified: true
            // Skip email verification for admin-created users
          });
          firebaseUid = newFirebaseUser.uid;
          console.log(`[Admin] Created Firebase Auth user: ${email} (${firebaseUid})`);
        } else {
          throw e;
        }
      }
      const newUser = await storage.createUser({
        email,
        username: username || email.split("@")[0],
        password: "firebase-managed",
        // Dummy password since we use Firebase Auth
        language: language || "en",
        totalPoints: 0,
        streakCount: 0,
        currentAudioSession: 1,
        subscriptionStatus: subscriptionStatus || "active",
        wooCommerceSubscriptionId: wooCommerceSubscriptionId || null
      });
      const quizResult = await storage.getQuizResultByEmail(email);
      if (quizResult && !quizResult.userId) {
        await storage.linkQuizResultToUser(quizResult.id, newUser.id);
        console.log("Linked quiz result " + quizResult.id + " to user " + newUser.id);
      }
      let emailSent = false;
      let emailError = null;
      try {
        await sendWelcomeEmail(email, language || "en");
        console.log(`[Admin] Welcome email sent to ${email}`);
        emailSent = true;
      } catch (e) {
        console.error(`[Admin] Failed to send welcome email to ${email}:`, e);
        emailError = e.message || "Unknown error";
      }
      res.json({
        emailSent,
        emailError,
        success: true,
        message: "User created successfully in both Firestore and Firebase Auth",
        user: newUser,
        firebaseUid
      });
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ error: "Failed to create user", message: error.message });
    }
  });
  app2.post("/api/reset-daily-plan", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      await storage.updateDailyPlanTask(user.id, today, "moodCompleted", 0);
      await storage.updateDailyPlanTask(user.id, today, "thetaAudioCompleted", 0);
      await storage.updateDailyPlanTask(user.id, today, "breathingCompleted", 0);
      await storage.updateDailyPlanTask(user.id, today, "gameCompleted", 0);
      res.json({ success: true, message: "Daily plan reset for " + email });
    } catch (error) {
      console.error("Reset error:", error);
      res.status(500).json({ error: "Failed to reset daily plan", message: error.message });
    }
  });
  app2.post("/api/admin/seed-database", verifyToken, async (req, res) => {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const allowSeeding = process.env.ALLOW_DATABASE_SEEDING === "true";
      if (!isProduction && !allowSeeding) {
        return res.status(403).json({
          error: "Database seeding is only allowed in production or when ALLOW_DATABASE_SEEDING is set"
        });
      }
      res.json({
        success: true,
        message: "Please run 'npm run seed:firestore' to seed the database"
      });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({
        error: "Failed to seed database",
        message: error.message
      });
    }
  });
  app2.post("/api/admin/clear-and-reseed", verifyToken, async (req, res) => {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const allowSeeding = process.env.ALLOW_DATABASE_SEEDING === "true";
      if (!isProduction && !allowSeeding) {
        return res.status(403).json({
          error: "Database operations are only allowed in production or when ALLOW_DATABASE_SEEDING is set"
        });
      }
      console.log("\u{1F5D1}\uFE0F  Clearing existing static content...");
      const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const collections = ["lessons", "courses", "iqQuestions"];
      for (const collectionName of collections) {
        const snapshot = await db3.collection(collectionName).get();
        const batch = db3.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        console.log("   Deleted " + collectionName);
      }
      console.log("\u2705 Cleared existing data");
      console.log("\u{1F331} Starting fresh seeding...");
      res.json({
        success: true,
        message: "Database cleared. Run 'npm run seed:firestore' to re-seed",
        cleared: {
          courses: true,
          lessons: true,
          iqQuestions: true
        }
      });
    } catch (error) {
      console.error("Clear and reseed error:", error);
      res.status(500).json({
        error: "Failed to clear and reseed database",
        message: error.message
      });
    }
  });
  app2.post("/api/admin/create-user", verifyToken, async (req, res) => {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const allowSeeding = process.env.ALLOW_DATABASE_SEEDING === "true";
      if (!isProduction && !allowSeeding) {
        return res.status(403).json({
          error: "User creation is only allowed in production or when ALLOW_DATABASE_SEEDING is set"
        });
      }
      const { email: rawEmail, language = "en" } = req.body;
      const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      let user = await storage.getUserByEmail(email);
      if (user) {
        return res.json({
          success: true,
          message: "User already exists",
          userId: user.id,
          email: user.email,
          alreadyExists: true
        });
      }
      const generatedUsername = email.split("@")[0];
      const dummyPassword = crypto.randomBytes(32).toString("hex");
      user = await storage.createUser({
        username: generatedUsername,
        password: await hashPassword(dummyPassword),
        email,
        language
      });
      console.log("Admin created user: " + email + " with language: " + language);
      const quizResult = await storage.getQuizResultByEmail(email);
      if (quizResult && !quizResult.userId) {
        await storage.linkQuizResultToUser(quizResult.id, user.id);
        console.log("Linked quiz result " + quizResult.id + " to user " + user.id);
      }
      let emailSent = false;
      let emailError = null;
      try {
        await sendWelcomeEmail(email, user.language || "en");
        console.log(`[Admin] Welcome email sent to ${email}`);
        emailSent = true;
      } catch (e) {
        console.error(`[Admin] Failed to send welcome email to ${email}:`, e);
        emailError = e.message || "Unknown error";
      }
      res.json({
        emailSent,
        emailError,
        success: true,
        message: "User created successfully",
        userId: user.id,
        email: user.email,
        language: user.language,
        alreadyExists: false
      });
    } catch (error) {
      console.error("Admin user creation error:", error);
      res.status(500).json({
        error: "Failed to create user",
        message: error.message
      });
    }
  });
  app2.post(["/api/webhook/quiz", "/webhook/quiz"], async (req, res) => {
    try {
      console.log("Received quiz webhook:", JSON.stringify(req.body, null, 2));
      const validated = insertQuizResultSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validated.email);
      if (existingUser) {
        validated.userId = existingUser.id;
      }
      const result = await storage.createQuizResult(validated);
      console.log("Stored quiz result for " + validated.email + ", linked to user: " + (validated.userId || "pending"));
      res.json({ success: true, id: result.id });
    } catch (error) {
      console.error("Quiz webhook error:", error);
      if (error instanceof z2.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });
  app2.post(["/api/webhook/create-user", "/webhook/create-user"], async (req, res) => {
    try {
      const { email, username } = req.body;
      const tempPassword = Math.random().toString(36).slice(-8);
      const user = await storage.createUser({
        username: username || email,
        password: await hashPassword(tempPassword),
        email,
        language: "en"
      });
      const quizResult = await storage.getQuizResultByEmail(email);
      if (quizResult && !quizResult.userId) {
        await storage.linkQuizResultToUser(quizResult.id, user.id);
        console.log("Linked quiz result " + quizResult.id + " to user " + user.id);
      }
      res.json({ success: true, userId: user.id });
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post(["/api/webhook/express-upgrade", "/webhook/express-upgrade"], async (req, res) => {
    try {
      console.log("Express Upgrade webhook received:", JSON.stringify(req.body, null, 2));
      const { email, product_id, order_id } = req.body;
      const validProductIds = [81, 1098, 1094, 1102];
      if (!email) {
        console.error("Express Upgrade webhook missing email");
        return res.status(400).json({ error: "Email is required" });
      }
      if (!validProductIds.includes(Number(product_id))) {
        console.error("Invalid product_id:", product_id);
        return res.status(400).json({ error: "Invalid product_id" });
      }
      const user = await storage.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        console.error("Express Upgrade: User not found for email:", email);
        return res.status(404).json({ error: "User not found" });
      }
      await storage.updateExpressUpgradeStatus(user.id, true);
      console.log("Express Upgrade enabled for user:", email, "Order ID:", order_id);
      res.json({
        success: true,
        userId: user.id,
        message: "Express Upgrade enabled",
        order_id
      });
    } catch (error) {
      console.error("Express Upgrade webhook error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/seed-users", verifyToken, async (req, res) => {
    try {
      const emails = ["ricdes@gmail.com", "ricardo@leadprime.net"];
      const results = [];
      for (const email of emails) {
        console.log("Seeding user: " + email);
        let user = await storage.getUserByEmail(email);
        if (user) {
          await storage.updateSubscriptionStatus(user.id, "active", "manual-test");
          results.push({ email, status: "updated", userId: user.id });
          continue;
        }
        const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
        const generatedUsername = email.split("@")[0];
        user = await storage.createUser({
          username: generatedUsername,
          email,
          password: await hashPassword2("temp123"),
          language: "en"
        });
        await storage.updateSubscriptionStatus(user.id, "active", "manual-test");
        results.push({ email, status: "created", userId: user.id });
      }
      res.json({ success: true, results });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  function getLanguageFromCountry(countryCode) {
    if (!countryCode) return "en";
    const country = countryCode.toUpperCase();
    switch (country) {
      case "DE":
      // Germany
      case "AT":
      // Austria
      case "CH":
        return "de";
      case "FR":
      // France
      case "BE":
      // Belgium (also speaks French)
      case "LU":
        return "fr";
      case "PT":
      // Portugal
      case "BR":
        return "pt";
      default:
        return "en";
    }
  }
  app2.post(["/api/webhook/subscription-created", "/webhook/subscription-created"], verifyWebhookSignature, async (req, res) => {
    try {
      const { id: subscriptionId, billing } = req.body;
      const email = billing?.email;
      const firstName = billing?.first_name;
      const lastName = billing?.last_name;
      const billingCountry = billing?.country;
      if (!email) {
        console.error("Webhook missing email. Body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ error: "Email is required" });
      }
      const userLanguage = getLanguageFromCountry(billingCountry);
      console.log("New subscription from " + (billingCountry || "unknown country") + ", using language: " + userLanguage);
      let user = await storage.getUserByEmail(email);
      let isNewUser = false;
      if (!user) {
        const generatedUsername = email.split("@")[0];
        const dummyPassword = crypto.randomBytes(32).toString("hex");
        user = await storage.createUser({
          username: generatedUsername,
          password: await hashPassword(dummyPassword),
          email,
          language: userLanguage
        });
        isNewUser = true;
        console.log("New user created: " + email + " with language: " + userLanguage);
      }
      await storage.updateSubscriptionStatus(
        user.id,
        "active",
        subscriptionId?.toString()
      );
      if (isNewUser) {
        try {
          await sendWelcomeEmail(email, userLanguage);
          console.log("Welcome email sent to: " + email + " in " + userLanguage);
        } catch (emailError) {
          console.error("Failed to send welcome email to " + email + ": ", emailError);
        }
      }
      const quizResult = await storage.getQuizResultByEmail(email);
      if (quizResult && !quizResult.userId) {
        await storage.linkQuizResultToUser(quizResult.id, user.id);
        console.log("Linked quiz result " + quizResult.id + " to user " + user.id);
      }
      res.json({
        success: true,
        userId: user.id,
        message: "Subscription activated",
        language: userLanguage
      });
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post(["/api/webhook/subscription-cancelled", "/webhook/subscription-cancelled"], verifyWebhookSignature, async (req, res) => {
    try {
      const { id: subscriptionId, billing } = req.body;
      const email = billing?.email;
      if (!email) {
        console.error("Webhook missing email. Body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ error: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await storage.updateSubscriptionStatus(
        user.id,
        "cancelled",
        subscriptionId?.toString()
      );
      console.log("Subscription cancelled for user: " + email);
      res.json({
        success: true,
        userId: user.id,
        message: "Subscription cancelled"
      });
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/subscription/status", verifyToken, async (req, res) => {
    try {
      const user = req.user;
      if (!user.wooCommerceSubscriptionId) {
        if (user.subscriptionStatus === "active") {
          return res.json({
            hasSubscription: false,
            // No WooCommerce subscription
            status: "active",
            subscription: null,
            isGrandfathered: true
          });
        }
        return res.json({
          hasSubscription: false,
          status: null,
          subscription: null,
          isGrandfathered: false
        });
      }
      const { getSubscription: getSubscription2 } = await Promise.resolve().then(() => (init_woocommerce(), woocommerce_exports));
      let subscription;
      try {
        subscription = await getSubscription2(user.wooCommerceSubscriptionId);
      } catch (e) {
        console.warn("Failed to fetch WooCommerce subscription:", e);
        subscription = null;
      }
      if (!subscription || !subscription.id) {
        return res.json({
          hasSubscription: false,
          // Couldn't verify with WooCommerce
          status: user.subscriptionStatus || "inactive",
          subscription: null,
          isGrandfathered: false,
          message: "Could not verify WooCommerce status, falling back to local record"
        });
      }
      res.json({
        hasSubscription: true,
        status: subscription.status,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          nextPaymentDate: subscription.next_payment_date,
          billingPeriod: subscription.billing_period,
          billingInterval: subscription.billing_interval,
          total: subscription.total,
          currency: subscription.currency,
          startDate: subscription.start_date,
          endDate: subscription.end_date
        }
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription status", message: error.message });
    }
  });
  app2.post("/api/subscription/pause", verifyToken, async (req, res) => {
    try {
      const user = req.user;
      if (!user.wooCommerceSubscriptionId) {
        return res.status(400).json({ error: "No subscription found" });
      }
      const { pauseSubscription: pauseSubscription2 } = await Promise.resolve().then(() => (init_woocommerce(), woocommerce_exports));
      const subscription = await pauseSubscription2(user.wooCommerceSubscriptionId);
      await storage.updateSubscriptionStatus(user.id, "on-hold", user.wooCommerceSubscriptionId);
      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status
        }
      });
    } catch (error) {
      console.error("Error pausing subscription:", error);
      res.status(500).json({ error: "Failed to pause subscription", message: error.message });
    }
  });
  app2.post("/api/subscription/resume", verifyToken, async (req, res) => {
    try {
      const user = req.user;
      if (!user.wooCommerceSubscriptionId) {
        return res.status(400).json({ error: "No subscription found" });
      }
      const { resumeSubscription: resumeSubscription2 } = await Promise.resolve().then(() => (init_woocommerce(), woocommerce_exports));
      const subscription = await resumeSubscription2(user.wooCommerceSubscriptionId);
      await storage.updateSubscriptionStatus(user.id, "active", user.wooCommerceSubscriptionId);
      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status
        }
      });
    } catch (error) {
      console.error("Error resuming subscription:", error);
      res.status(500).json({ error: "Failed to resume subscription", message: error.message });
    }
  });
  app2.post("/api/subscription/cancel", verifyToken, async (req, res) => {
    try {
      const user = req.user;
      if (!user.wooCommerceSubscriptionId) {
        return res.status(400).json({ error: "No subscription found" });
      }
      const { cancelSubscription: cancelSubscription2 } = await Promise.resolve().then(() => (init_woocommerce(), woocommerce_exports));
      const subscription = await cancelSubscription2(user.wooCommerceSubscriptionId);
      await storage.updateSubscriptionStatus(user.id, "cancelled", user.wooCommerceSubscriptionId);
      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status
        }
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription", message: error.message });
    }
  });
  app2.post("/api/audio/progress", verifyToken, async (req, res) => {
    try {
      const { session, position } = req.body;
      const user = await storage.updateUserAudioProgress(req.user.id, session, position);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/mood", verifyToken, async (req, res) => {
    try {
      console.log("Received mood entry request:", req.body);
      console.log("User ID:", req.user.id);
      const validated = insertMoodEntrySchema.parse({
        ...req.body,
        userId: req.user.id
      });
      console.log("Validated mood entry:", validated);
      const entry = await storage.createMoodEntry(validated);
      console.log("Created mood entry:", entry);
      res.json(entry);
    } catch (error) {
      console.error("Error creating mood entry:", error);
      if (error instanceof z2.ZodError) {
        console.error("Validation error:", JSON.stringify(error.errors, null, 2));
      }
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/mood", verifyToken, async (req, res) => {
    try {
      const entries = await storage.getMoodEntries(req.user.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/mood/:id", verifyToken, async (req, res) => {
    try {
      const { mood, note } = req.body;
      const entry = await storage.updateMoodEntry(req.params.id, mood, note);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/mood/:id", verifyToken, async (req, res) => {
    try {
      await storage.deleteMoodEntry(req.params.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/daily-plan/complete-task", verifyToken, async (req, res) => {
    try {
      const { task, status, date } = req.body;
      const validTasks = ["thetaAudioCompleted", "breathingCompleted", "gameCompleted", "moodCompleted"];
      if (!task || !validTasks.includes(task)) {
        return res.status(400).json({ error: "Invalid task" });
      }
      const completionStatus = status === "skipped" ? 2 : 1;
      const planDate = date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const previousPlan = await storage.getDailyPlan(req.user.id, planDate);
      let plan = await storage.updateDailyPlanTask(req.user.id, planDate, task, completionStatus);
      const allCompleted = plan.moodCompleted && plan.thetaAudioCompleted && plan.breathingCompleted && plan.gameCompleted;
      let pointsAwarded = 0;
      let newStreak = void 0;
      if (allCompleted) {
        const previouslyIncomplete = !previousPlan || !previousPlan.moodCompleted || !previousPlan.thetaAudioCompleted || !previousPlan.breathingCompleted || !previousPlan.gameCompleted;
        if (previouslyIncomplete) {
          const POINTS_FOR_DAILY_PLAN = 50;
          pointsAwarded = POINTS_FOR_DAILY_PLAN;
          const currentPoints = req.user.totalPoints || 0;
          await storage.updateUserPoints(req.user.id, currentPoints + POINTS_FOR_DAILY_PLAN);
          const user = await storage.getUser(req.user.id);
          if (user) {
            const currentStreak = user.streakCount || 0;
            newStreak = currentStreak + 1;
            await storage.updateUserStreak(user.id, newStreak);
          }
        }
      }
      res.json({ ...plan, pointsAwarded, newStreak });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/daily-plan/reset", verifyToken, async (req, res) => {
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      await storage.updateDailyPlanTask(req.user.id, today, "moodCompleted", 0);
      await storage.updateDailyPlanTask(req.user.id, today, "thetaAudioCompleted", 0);
      await storage.updateDailyPlanTask(req.user.id, today, "breathingCompleted", 0);
      const plan = await storage.updateDailyPlanTask(req.user.id, today, "gameCompleted", 0);
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/daily-plan", verifyToken, async (req, res) => {
    try {
      const { date } = req.query;
      const planDate = date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const plan = await storage.getDailyPlan(req.user.id, planDate);
      res.json(plan || {
        date: planDate,
        thetaAudioCompleted: 0,
        breathingCompleted: 0,
        gameCompleted: 0,
        moodCompleted: 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/journal", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.get("/api/journal", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.patch("/api/journal/:id", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.delete("/api/journal/:id", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.post("/api/game/score", verifyToken, async (req, res) => {
    try {
      const validated = insertGameScoreSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const score = await storage.createGameScore(validated);
      res.json(score);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/game/scores", verifyToken, async (req, res) => {
    try {
      const { gameType } = req.query;
      const scores = await storage.getGameScores(req.user.id, gameType);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/courses", verifyToken, async (req, res) => {
    try {
      const userLanguage = req.user.language || "en";
      const courses = await storage.getCourses(userLanguage);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/courses/:id", verifyToken, async (req, res) => {
    try {
      const userLanguage = req.user.language || "en";
      const course = await storage.getCourse(req.params.id, userLanguage);
      if (!course) return res.sendStatus(404);
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/courses/:courseId/lessons", verifyToken, async (req, res) => {
    try {
      const userLanguage = req.user.language || "en";
      const lessons = await storage.getLessonsByCourse(req.params.courseId, userLanguage);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/courses/:courseId/progress", verifyToken, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user.id, req.params.courseId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/lessons/random", verifyToken, async (req, res) => {
    try {
      const userLanguage = req.user.language || "en";
      const courses = await storage.getCourses(userLanguage);
      if (courses.length === 0) {
        return res.status(404).json({ error: "No courses found" });
      }
      const randomCourse = courses[Math.floor(Math.random() * courses.length)];
      const lessons = await storage.getLessonsByCourse(randomCourse.id, userLanguage);
      if (lessons.length === 0) {
        const anotherCourse = courses[Math.floor(Math.random() * courses.length)];
        const moreLessons = await storage.getLessonsByCourse(anotherCourse.id, userLanguage);
        if (moreLessons.length === 0) {
          return res.status(404).json({ error: "No lessons found" });
        }
        const randomLesson2 = moreLessons[Math.floor(Math.random() * moreLessons.length)];
        return res.json({ courseId: anotherCourse.id, lessonId: randomLesson2.id });
      }
      const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
      res.json({ courseId: randomCourse.id, lessonId: randomLesson.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/lessons/:id", verifyToken, async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) return res.sendStatus(404);
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/lessons/:id/complete", verifyToken, async (req, res) => {
    try {
      const progress = await storage.markLessonComplete(req.user.id, req.params.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/chat", verifyToken, async (req, res) => {
    try {
      const { message, language } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });
      const userId = req.user.id;
      const userLanguage = language || req.user.language || "en";
      const recentCount = await storage.getRecentChatCount(userId);
      if (recentCount >= 10) {
        return res.status(429).json({ error: "Rate limit exceeded. You can send 10 messages per hour." });
      }
      const crisisKeywords = ["suicide", "kill myself", "end it all", "hurt myself", "die", "selbstmord", "umbringen", "sterben", "suicidio", "tuer"];
      if (crisisKeywords.some((keyword) => message.toLowerCase().includes(keyword))) {
        let crisisResponse = "";
        if (userLanguage === "de") {
          crisisResponse = "Ich bin ein KI-Assistent und kann keine Krisenunterst\xFCtzung bieten. Wenn Sie in Not sind, wenden Sie sich bitte sofort an eine Hotline.\n\nDeutschland: 0800 111 0 111 (TelefonSeelsorge)\nInternational: [Find A Helpline](https://findahelpline.com/)";
        } else if (userLanguage === "fr") {
          crisisResponse = "Je suis un assistant IA et je ne peux pas fournir de soutien en cas de crise. Si vous \xEAtes en d\xE9tresse, veuillez contacter imm\xE9diatement une ligne d'assistance.\n\nFrance: 3114 (Suicide \xC9coute)\nInternational: [Find A Helpline](https://findahelpline.com/)";
        } else {
          crisisResponse = "I am an AI assistant and cannot provide crisis support. If you are in distress, please contact a helpline immediately.\n\nUSA: 988 (Suicide & Crisis Lifeline)\nUK: 111 (NHS) or 116 123 (Samaritans)\nInternational: [Find A Helpline](https://findahelpline.com/)";
        }
        await storage.incrementChatCount(userId);
        return res.json({ response: crisisResponse });
      }
      if (req.user?.email !== "ricdes@gmail.com") {
        return res.status(403).json({ error: "AI Assistant is currently under maintenance. Please try again later." });
      }
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.error("OPENROUTER_API_KEY is not configured");
        return res.status(500).json({ error: "AI service configuration missing. Please contact support." });
      }
      const quizResult = await storage.getQuizResultByUserId(userId);
      const quizInsights = extractImportantQuestions(quizResult);
      let systemPrompt = "You are a conservative, growth-oriented, mindfulness-focused AI assistant. You encourage personal responsibility, resilience, and traditional values of discipline and self-improvement. You are supportive but firm. You avoid woke ideology and focus on practical, evidence-based advice for mental wellness and cognitive improvement. You MUST respond in the following language: " + userLanguage + ".";
      if (quizInsights.age || quizInsights.cognitiveStruggles || quizInsights.improvementGoals) {
        systemPrompt += "\n\nUser Profile based on Quiz Results:";
        if (quizInsights.age) systemPrompt += "\n- Age Group: " + quizInsights.age;
        if (quizInsights.cognitiveStruggles) systemPrompt += "\n- Cognitive Struggles: " + quizInsights.cognitiveStruggles;
        if (quizInsights.improvementGoals) systemPrompt += "\n- Improvement Goals: " + quizInsights.improvementGoals.join(", ");
        systemPrompt += '\n\nUse this information to personalize your advice, but do not explicitly mention "according to your quiz results" unless relevant.';
      }
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
          "HTTP-Referer": "https://creativewaves.app",
          // Optional, for including your app on openrouter.ai rankings.
          "X-Title": "CreativeWaves"
          // Optional. Shows in rankings on openrouter.ai.
        },
        body: JSON.stringify({
          model: "x-ai/grok-4.1-fast",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            { role: "user", content: message }
          ],
          stream: false
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error:", errorText);
        return res.status(500).json({ error: "Failed to get response from AI" });
      }
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      await storage.incrementChatCount(userId);
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/iq-test/questions", verifyToken, async (req, res) => {
    try {
      const count = parseInt(req.query.count) || 20;
      const userLanguage = req.user?.language || "en";
      const questions = await storage.getRandomIQQuestions(count, userLanguage);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/iq-test/submit", verifyToken, async (req, res) => {
    try {
      const { answers } = req.body;
      if (!Array.isArray(answers)) {
        return res.status(400).json({ error: "Answers must be an array" });
      }
      const totalQuestions = answers.length;
      let correctAnswers = 0;
      const sessionId = crypto.randomUUID();
      const answerResults = [];
      for (const answer of answers) {
        const question = await storage.getIQQuestion(answer.questionId);
        if (!question) continue;
        const isCorrect = answer.userAnswer === question.correctAnswer ? 1 : 0;
        if (isCorrect) correctAnswers++;
        answerResults.push({
          sessionId,
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          isCorrect
        });
      }
      const percentage = correctAnswers / totalQuestions * 100;
      const baseScore = 100;
      const scoreRange = 60;
      const score = Math.round(baseScore + percentage / 100 * scoreRange);
      const session = await storage.createIQTestSessionWithId({
        id: sessionId,
        userId: req.user.id,
        totalQuestions,
        correctAnswers,
        score,
        completedAt: /* @__PURE__ */ new Date()
      });
      for (const answerData of answerResults) {
        await storage.saveIQTestAnswer(answerData);
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/addictions", verifyToken, async (req, res) => {
    try {
      const validated = insertAddictionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const addiction = await storage.createAddiction(validated);
      res.json(addiction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/addictions", verifyToken, async (req, res) => {
    try {
      const addictions = await storage.getUserAddictions(req.user.id);
      res.json(addictions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/addictions/:id", verifyToken, async (req, res) => {
    try {
      const addiction = await storage.getAddiction(req.params.id);
      if (!addiction) return res.sendStatus(404);
      if (addiction.userId !== req.user.id) return res.sendStatus(403);
      res.json(addiction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/addictions/:id", verifyToken, async (req, res) => {
    try {
      const addiction = await storage.getAddiction(req.params.id);
      if (!addiction) return res.sendStatus(404);
      if (addiction.userId !== req.user.id) return res.sendStatus(403);
      const updated = await storage.updateAddiction(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/addictions/:id", verifyToken, async (req, res) => {
    try {
      const addiction = await storage.getAddiction(req.params.id);
      if (!addiction) return res.sendStatus(404);
      if (addiction.userId !== req.user.id) return res.sendStatus(403);
      await storage.deleteAddiction(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/addictions/:id", verifyToken, async (req, res) => {
    try {
      const addiction = await storage.getAddiction(req.params.id);
      if (!addiction) return res.sendStatus(404);
      if (addiction.userId !== req.user.id) return res.sendStatus(403);
      await storage.deleteAddiction(req.params.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/addictions/:id/checkin", verifyToken, async (req, res) => {
    try {
      const addiction = await storage.getAddiction(req.params.id);
      if (!addiction) return res.sendStatus(404);
      if (addiction.userId !== req.user.id) return res.sendStatus(403);
      const validated = insertAddictionCheckinSchema.parse({
        ...req.body,
        addictionId: req.params.id
      });
      const checkin = await storage.logAddictionCheckin(validated);
      if (validated.status === "relapsed") {
        await storage.updateAddiction(req.params.id, {
          lastRelapseDate: /* @__PURE__ */ new Date()
        });
      }
      res.json(checkin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/addictions/:id/checkins", verifyToken, async (req, res) => {
    try {
      const addiction = await storage.getAddiction(req.params.id);
      if (!addiction) return res.sendStatus(404);
      if (addiction.userId !== req.user.id) return res.sendStatus(403);
      const checkins = await storage.getAddictionCheckins(req.params.id);
      res.json(checkins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/iq-test/history", verifyToken, async (req, res) => {
    try {
      const sessions = await storage.getIQTestSessions(req.user.id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/iq-test/session/:sessionId", verifyToken, async (req, res) => {
    try {
      const session = await storage.getIQTestSession(req.params.sessionId);
      if (!session || session.userId !== req.user.id) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/iq-test/answers/:sessionId", verifyToken, async (req, res) => {
    try {
      const answers = await storage.getIQTestAnswers(req.params.sessionId);
      res.json(answers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/iq-test/session/:id/answers", verifyToken, async (req, res) => {
    try {
      const answers = await storage.getIQTestAnswers(req.params.id);
      res.json(answers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/journal", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.post("/api/journal", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.patch("/api/journal/:id", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.get("/api/journal/:id", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.delete("/api/journal/:id", verifyToken, async (req, res) => {
    res.status(403).json({ error: "Journal functionality is currently disabled" });
  });
  app2.get("/api/user/quiz-insights", verifyToken, async (req, res) => {
    try {
      const quizResult = await storage.getQuizResultByUserId(req.user.id);
      if (!quizResult) {
        return res.json({
          hasQuizData: false,
          insights: {
            age: null,
            cognitiveStruggles: null,
            improvementGoals: null,
            rawAnswers: []
          }
        });
      }
      const { extractImportantQuestions: extractImportantQuestions2 } = await Promise.resolve().then(() => (init_quizHelpers(), quizHelpers_exports));
      const insights = extractImportantQuestions2(quizResult);
      res.json({
        hasQuizData: true,
        insights
      });
    } catch (error) {
      console.error("Error fetching quiz insights:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/user/language", verifyToken, async (req, res) => {
    try {
      const { language } = req.body;
      const validLanguages = ["en", "de", "fr", "pt"];
      if (!language || !validLanguages.includes(language)) {
        return res.status(400).json({ error: "Invalid language selection" });
      }
      const updatedUser = await storage.updateUserLanguage(req.user.id, language);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user language:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/sleep-entries", verifyToken, async (req, res) => {
    try {
      const entries = await storage.getRecentSleepEntries(req.user.id, 7);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching sleep entries:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/sleep-entries", verifyToken, async (req, res) => {
    try {
      const entry = await storage.createSleepEntry({
        userId: req.user.id,
        ...req.body
      });
      res.json(entry);
    } catch (error) {
      console.error("Error creating sleep entry:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/sleep-progress", verifyToken, async (req, res) => {
    try {
      const progress = await storage.getSleepProgramProgress(req.user.id);
      res.json(progress || { completedDays: [] });
    } catch (error) {
      console.error("Error fetching sleep progress:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/sleep-progress", verifyToken, async (req, res) => {
    try {
      const { completedDays } = req.body;
      const progress = await storage.updateSleepProgramProgress(req.user.id, completedDays);
      res.json(progress);
    } catch (error) {
      console.error("Error updating sleep progress:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/users", verifyToken, async (req, res) => {
    try {
      console.log("[Admin] GET /api/admin/users - Request from:", req.user?.email);
      if (req.user?.email !== "ricdes@gmail.com") {
        console.log("[Admin] Access denied - not admin email");
        return res.status(403).json({ error: "Forbidden: Admin access only" });
      }
      console.log("[Admin] Fetching users from Firestore...");
      const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const snapshot = await db3.collection("users").limit(100).get();
      console.log(`[Admin] Found ${snapshot.size} users`);
      const users = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          username: data.username,
          language: data.language,
          subscriptionStatus: data.subscriptionStatus,
          wooCommerceSubscriptionId: data.wooCommerceSubscriptionId,
          streakCount: data.streakCount,
          totalPoints: data.totalPoints,
          recoveryUser: data.recoveryUser,
          expressUpgradeEnabled: data.expressUpgradeEnabled,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
        };
      });
      res.json(users);
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/admin/users/:id", verifyToken, async (req, res) => {
    try {
      if (req.user?.email !== "ricdes@gmail.com") {
        return res.status(403).json({ error: "Forbidden: Admin access only" });
      }
      const { id } = req.params;
      const { email, username, language, subscriptionStatus, wooCommerceSubscriptionId, recoveryUser, expressUpgradeEnabled } = req.body;
      const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const userRef = db3.collection("users").doc(id);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      const updateData = {};
      if (email !== void 0) updateData.email = email.toLowerCase().trim();
      if (username !== void 0) updateData.username = username;
      if (language !== void 0) updateData.language = language;
      if (subscriptionStatus !== void 0) updateData.subscriptionStatus = subscriptionStatus;
      if (wooCommerceSubscriptionId !== void 0) updateData.wooCommerceSubscriptionId = wooCommerceSubscriptionId || null;
      if (recoveryUser !== void 0) updateData.recoveryUser = recoveryUser;
      if (expressUpgradeEnabled !== void 0) updateData.expressUpgradeEnabled = expressUpgradeEnabled;
      await userRef.update(updateData);
      res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/admin/users/:id", verifyToken, async (req, res) => {
    try {
      if (req.user?.email !== "ricdes@gmail.com") {
        return res.status(403).json({ error: "Forbidden: Admin access only" });
      }
      const { id } = req.params;
      const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const userRef = db3.collection("users").doc(id);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      const userData = userDoc.data();
      try {
        if (userData?.email) {
          const firebaseUser = await getAuth2().getUserByEmail(userData.email);
          await getAuth2().deleteUser(firebaseUser.uid);
          console.log(`[Admin] Deleted Firebase Auth user: ${userData.email}`);
        }
      } catch (authError) {
        if (authError.code !== "auth/user-not-found") {
          console.error(`[Admin] Error deleting Firebase Auth user:`, authError);
        }
      }
      await userRef.delete();
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/sleep-coach", verifyToken, async (req, res) => {
    try {
      const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
      if (!GOOGLE_API_KEY) {
        return res.json({
          advice: "Based on your sleep patterns, try to maintain a consistent bedtime and avoid screens 1 hour before bed.",
          source: "heuristic"
        });
      }
      const entries = await storage.getRecentSleepEntries(req.user.id, 7);
      const userLanguage = req.user.language || "en";
      const { question } = req.body;
      let sleepSummary = "No sleep data available yet.";
      if (entries.length > 0) {
        const avgEfficiency = entries.reduce((sum, e) => sum + e.sleepEfficiency, 0) / entries.length;
        const avgSleepHours = entries.reduce((sum, e) => sum + e.totalSleepHours, 0) / entries.length;
        const avgQuality = entries.reduce((sum, e) => sum + e.sleepQuality, 0) / entries.length;
        sleepSummary = `User's sleep data for the past ${entries.length} days:
- Average sleep efficiency: ${(avgEfficiency * 100).toFixed(1)}%
- Average sleep duration: ${avgSleepHours.toFixed(1)} hours
- Average sleep quality (1-5): ${avgQuality.toFixed(1)}
- Most recent bedtime: ${entries[0].bedtime}
- Most recent wake time: ${entries[0].finalWakeTime}
- Average time to fall asleep: ${(entries.reduce((sum, e) => sum + e.sleepOnsetMinutes, 0) / entries.length).toFixed(0)} minutes
- Average awakenings per night: ${(entries.reduce((sum, e) => sum + e.awakeningsCount, 0) / entries.length).toFixed(1)}`;
      }
      const languageMap = {
        "en": "English",
        "de": "German",
        "fr": "French",
        "pt": "Portuguese"
      };
      const targetLanguage = languageMap[userLanguage] || "English";
      const prompt = `You are a warm, supportive Sleep Coach AI for adults aged 45-70 who want to improve their sleep quality using cognitive behavioral therapy for insomnia (CBT-I) techniques.

SLEEP DATA:
${sleepSummary}

${question ? `USER'S QUESTION: ${question}` : ""}

INSTRUCTIONS:
1. Respond in ${targetLanguage}
2. Be warm, encouraging, and supportive - like a knowledgeable friend
3. Keep response concise (2-3 paragraphs max)
4. Provide specific, actionable advice based on their data
5. Reference evidence-based sleep hygiene and CBT-I techniques
6. If sleep efficiency is below 85%, suggest sleep restriction therapy
7. Avoid medical diagnoses - recommend consulting a doctor for persistent issues
8. End with one clear action step they can take tonight

${question ? "Answer their specific question while incorporating relevant sleep advice." : "Provide personalized advice based on their sleep patterns."}`;
      const { GoogleGenerativeAI: GoogleGenerativeAI2 } = await Promise.resolve().then(() => (init_dist(), dist_exports));
      const genAI = new GoogleGenerativeAI2(GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const advice = response.text().trim();
      res.json({ advice, source: "gemini" });
    } catch (error) {
      console.error("Sleep coach error:", error);
      res.json({
        advice: "I'm having trouble connecting right now. In the meantime, try these tips: maintain a consistent sleep schedule, create a relaxing bedtime routine, and keep your bedroom cool and dark.",
        source: "fallback"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// src/index.ts
init_auth();

// src/cleanupQuizResults.ts
init_storage();
import { onSchedule } from "firebase-functions/v2/scheduler";

// ../server/log.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// src/cleanupQuizResults.ts
var cleanupQuizResults = onSchedule({
  schedule: "0 2 * * *",
  // Daily at 2 AM UTC
  timeZone: "UTC",
  region: "us-central1"
}, async (event) => {
  try {
    log(`[Quiz Cleanup] Starting cleanup of unlinked quiz results older than 7 days`);
    const deletedCount = await storage.cleanupUnlinkedQuizResults(7);
    log(`[Quiz Cleanup] Completed. Deleted ${deletedCount} unlinked quiz results`);
  } catch (error) {
    console.error("[Quiz Cleanup] Error during cleanup:", error);
    throw error;
  }
});

// src/index.ts
var app = express();
app.use(["/api/webhook/*", "/webhook/*"], (req, res, next) => {
  const allowedOrigins = [
    "https://creativewavesquizfunnel.web.app",
    "https://quiz.creativewaves.me",
    "https://app2.creativewaves.me",
    "http://localhost:5173",
    "http://localhost:5001"
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization,x-wc-webhook-signature");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(["/api/webhook/*", "/webhook/*"], express.raw({ type: "application/json" }), (req, res, next) => {
  req.rawBody = req.body;
  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    next();
    return;
  }
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  next();
});
app.use((req, res, next) => {
  if (req.path.startsWith("/api/webhook/") || req.path.startsWith("/webhook/")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: false }));
var routesInitialized = false;
var initializationPromise = null;
async function ensureRoutesInitialized() {
  if (routesInitialized) return;
  if (initializationPromise) {
    await initializationPromise;
    return;
  }
  initializationPromise = (async () => {
    await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("Error:", err);
    });
    routesInitialized = true;
    console.log("Routes initialized for Firebase Functions");
  })();
  await initializationPromise;
}
var api = onRequest({
  region: "us-central1",
  invoker: "public",
  secrets: ["OPENROUTER_API_KEY"]
}, async (req, res) => {
  console.log(`[API] Request received: ${req.method} ${req.url}`);
  console.log(`[API] Path: ${req.path}`);
  try {
    await ensureRoutesInitialized();
  } catch (error) {
    console.error("[API] Failed to initialize routes:", error);
    res.status(500).json({ error: "Internal Server Error", details: "Route initialization failed" });
    return;
  }
  app(req, res);
});
app.get(["/api/ping", "/ping"], (req, res) => {
  res.json({
    message: "pong",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    debug: {
      url: req.url,
      originalUrl: req.originalUrl,
      path: req.path,
      baseUrl: req.baseUrl,
      method: req.method
    }
  });
});
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
export {
  api,
  cleanupQuizResults
};
/*! Bundled license information:

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
