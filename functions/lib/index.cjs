"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  api: () => api,
  cleanupQuizResults: () => cleanupQuizResults
});
module.exports = __toCommonJS(index_exports);
var import_config = require("dotenv/config");
var import_https = require("firebase-functions/v2/https");
var import_express10 = __toESM(require("express"), 1);

// ../server/routes.ts
var import_http = require("http");

// ../server/db.ts
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
var import_fs = require("fs");
var import_path = require("path");
if ((0, import_app.getApps)().length === 0) {
  try {
    const serviceAccountPath = (0, import_path.join)(process.cwd(), "service-account.json");
    const nodeEnv = (process.env.NODE_ENV || "").trim();
    const isDev = nodeEnv === "development" || !nodeEnv;
    const hasServiceAccount = (0, import_fs.existsSync)(serviceAccountPath);
    console.log(`[DB] Environment: ${nodeEnv || "development (implicit)"}`);
    console.log(`[DB] Checking for service account at: ${serviceAccountPath}`);
    console.log(`[DB] Service account exists: ${hasServiceAccount}`);
    if (isDev && hasServiceAccount) {
      console.log("[DB] Initializing Firebase Admin with service account file");
      const serviceAccount = JSON.parse((0, import_fs.readFileSync)(serviceAccountPath, "utf-8"));
      (0, import_app.initializeApp)({
        credential: (0, import_app.cert)(serviceAccount)
      });
      console.log("[DB] Firebase Admin initialized successfully (Local/File)");
    } else {
      console.log("[DB] Initializing Firebase Admin with default credentials");
      if (isDev) {
        console.warn("\x1B[33m%s\x1B[0m", "[DB] WARNING: Running in development mode without service-account.json.");
        console.warn("\x1B[33m%s\x1B[0m", "[DB] Attempts to verify ID tokens may fail if your environment is not authenticated.");
        console.warn("\x1B[33m%s\x1B[0m", '[DB] Please ensure you have run "gcloud auth application-default login" or place service-account.json in the root.');
      }
      const isCloudEnv = !!(process.env.K_SERVICE || process.env.FUNCTION_NAME);
      if (isCloudEnv) {
        try {
          (0, import_app.initializeApp)({
            credential: (0, import_app.applicationDefault)(),
            serviceAccountId: "creativewavesapp2@appspot.gserviceaccount.com"
          });
          console.log("[DB] Firebase Admin initialized successfully (Cloud Environment)");
        } catch (err) {
          console.error("[DB] Failed to initialize with applicationDefault:", err);
          (0, import_app.initializeApp)({
            serviceAccountId: "creativewavesapp2@appspot.gserviceaccount.com"
          });
        }
      } else {
        console.log("[DB] Local environment detected (no service-account.json). Skipping applicationDefault() to prevent hangs.");
        (0, import_app.initializeApp)({
          serviceAccountId: "creativewavesapp2@appspot.gserviceaccount.com",
          projectId: "creativewavesapp2"
        });
      }
    }
    try {
      const app2 = (0, import_app.getApps)()[0];
      console.log(`[DB] Admin App Name: ${app2.name}`);
    } catch (e) {
      console.log("[DB] Could not inspect app details");
    }
  } catch (error) {
    console.error("[DB] CRITICAL ERROR initializing Firebase Admin:", error);
  }
}
var db = (0, import_firestore.getFirestore)();

// ../server/storage.ts
var DatabaseStorage = class {
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
      expressUpgradeEnabled: insertUser.expressUpgradeEnabled ?? false,
      isSleepCustomer: insertUser.isSleepCustomer ?? false,
      chronotype: insertUser.chronotype ?? null
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
  async updateUserChronotype(userId, chronotype) {
    await db.collection("users").doc(userId).update({ chronotype });
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
    const crypto4 = await import("crypto");
    const token = crypto4.randomBytes(32).toString("base64url");
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
var storage = new DatabaseStorage();

// ../server/auth.ts
var import_auth = require("firebase-admin/auth");
var import_crypto = require("crypto");
var import_util = require("util");
var scryptAsync = (0, import_util.promisify)(import_crypto.scrypt);
async function hashPassword(password) {
  const salt = (0, import_crypto.randomBytes)(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[AUTH] No token provided in Authorization header:", authHeader);
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const idToken = authHeader.split("Bearer ")[1];
  console.log(`[AUTH] Verifying token (length: ${idToken.length})`);
  try {
    const decodedToken = await (0, import_auth.getAuth)().verifyIdToken(idToken);
    const email = decodedToken.email;
    const uid = decodedToken.uid;
    console.log(`[AUTH] Token verified. UID: ${uid}, Email: ${email}`);
    if (!email) {
      console.log("[AUTH] Token verified but no email found in token.");
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
    } else {
      console.log(`[AUTH] User found in DB: ${user.id} (${user.email})`);
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    console.error("[AUTH] Error code:", error.code);
    console.error("[AUTH] Error message:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token", details: error.message });
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
      const decodedToken = await (0, import_auth.getAuth)().verifyIdToken(idToken);
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
        const firebaseUser = await (0, import_auth.getAuth)().getUserByEmail(email);
        firebaseUid = firebaseUser.uid;
        console.log(`[Simple Login] Found existing Firebase Auth user: ${firebaseUid}`);
      } catch (e) {
        if (e.code === "auth/user-not-found") {
          console.log(`[Simple Login] Creating Firebase Auth user for: ${email}`);
          try {
            const newFirebaseUser = await (0, import_auth.getAuth)().createUser({
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
      const customToken = await (0, import_auth.getAuth)().createCustomToken(firebaseUid);
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

// ../server/routes/content.ts
var import_express = require("express");

// ../server/middleware/index.ts
var import_crypto2 = __toESM(require("crypto"), 1);
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
  const computedSignature = import_crypto2.default.createHmac("sha256", webhookSecret).update(rawBody).digest("base64");
  try {
    const signatureBuffer = Buffer.from(signature, "base64");
    const computedBuffer = Buffer.from(computedSignature, "base64");
    if (signatureBuffer.length !== computedBuffer.length) {
      console.error("Invalid webhook signature (length mismatch)");
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
    if (!import_crypto2.default.timingSafeEqual(signatureBuffer, computedBuffer)) {
      console.error("Invalid webhook signature");
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    return res.status(401).json({ error: "Invalid webhook signature" });
  }
  next();
}

// ../server/routes/content.ts
var router = (0, import_express.Router)();
router.post("/seed-courses", async (req, res) => {
  try {
    console.log("Manual seed request received...");
    try {
      const { seedFirestore } = await import("../seed-firestore");
      await seedFirestore();
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
router.get("/seed-courses", async (req, res) => {
  try {
    console.log("Manual seed request received (GET)...");
    try {
      const { seedFirestore } = await import("../seed-firestore");
      await seedFirestore();
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
router.get("/courses", verifyToken, async (req, res) => {
  try {
    const userLanguage = req.user.language || "en";
    const courses = await storage.getCourses(userLanguage);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/courses/:id", verifyToken, async (req, res) => {
  try {
    const userLanguage = req.user.language || "en";
    const course = await storage.getCourse(req.params.id, userLanguage);
    if (!course) return res.sendStatus(404);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/courses/:courseId/lessons", verifyToken, async (req, res) => {
  try {
    const userLanguage = req.user.language || "en";
    const lessons = await storage.getLessonsByCourse(req.params.courseId, userLanguage);
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/courses/:courseId/progress", verifyToken, async (req, res) => {
  try {
    const progress = await storage.getUserProgress(req.user.id, req.params.courseId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/lessons/random", verifyToken, async (req, res) => {
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
router.get("/lessons/:id", verifyToken, async (req, res) => {
  try {
    const lesson = await storage.getLesson(req.params.id);
    if (!lesson) return res.sendStatus(404);
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/lessons/:id/complete", verifyToken, async (req, res) => {
  try {
    const progress = await storage.markLessonComplete(req.user.id, req.params.id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/audio/progress", verifyToken, async (req, res) => {
  try {
    const { session, position } = req.body;
    const user = await storage.updateUserAudioProgress(req.user.id, session, position);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var content_default = router;

// ../server/routes/games.ts
var import_express2 = require("express");
var import_crypto3 = __toESM(require("crypto"), 1);

// ../shared/schema.ts
var import_zod = require("zod");
var insertUserSchema = import_zod.z.object({
  username: import_zod.z.string(),
  password: import_zod.z.string(),
  email: import_zod.z.string().nullable().optional(),
  language: import_zod.z.string().default("en").optional(),
  chronotype: import_zod.z.enum(["bear", "wolf", "lion", "dolphin"]).nullable().optional(),
  currentAudioSession: import_zod.z.number().default(1).optional(),
  lastAudioPosition: import_zod.z.number().default(0).optional(),
  subscriptionStatus: import_zod.z.string().default("active").optional(),
  wooCommerceSubscriptionId: import_zod.z.string().nullable().optional(),
  streakCount: import_zod.z.number().default(0).optional(),
  totalPoints: import_zod.z.number().default(0).optional(),
  recoveryUser: import_zod.z.boolean().default(false).optional(),
  expressUpgradeEnabled: import_zod.z.boolean().default(false).optional(),
  isSleepCustomer: import_zod.z.boolean().default(false).optional()
});
var insertMoodEntrySchema = import_zod.z.object({
  userId: import_zod.z.string(),
  mood: import_zod.z.string(),
  note: import_zod.z.string().nullable().optional()
});
var insertGameScoreSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  gameType: import_zod.z.string(),
  score: import_zod.z.number()
});
var insertCourseSchema = import_zod.z.object({
  title: import_zod.z.string(),
  description: import_zod.z.string(),
  category: import_zod.z.string().optional(),
  icon: import_zod.z.string().optional(),
  color: import_zod.z.string().optional(),
  imageUrl: import_zod.z.string().optional(),
  language: import_zod.z.string().default("en"),
  orderIndex: import_zod.z.number()
});
var insertLessonSchema = import_zod.z.object({
  courseId: import_zod.z.string(),
  title: import_zod.z.string(),
  content: import_zod.z.string(),
  audioUrl: import_zod.z.string().optional(),
  videoUrl: import_zod.z.string().optional(),
  language: import_zod.z.string().default("en"),
  orderIndex: import_zod.z.number()
});
var insertUserLessonProgressSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  lessonId: import_zod.z.string(),
  completed: import_zod.z.number().default(0).optional(),
  completedAt: import_zod.z.date().nullable().optional()
});
var insertIQQuestionSchema = import_zod.z.object({
  question: import_zod.z.string(),
  questionType: import_zod.z.string().optional(),
  options: import_zod.z.union([import_zod.z.array(import_zod.z.string()), import_zod.z.string()]),
  correctAnswer: import_zod.z.union([import_zod.z.number(), import_zod.z.string()]),
  difficulty: import_zod.z.union([import_zod.z.string(), import_zod.z.number()]).optional(),
  category: import_zod.z.string().optional(),
  language: import_zod.z.string().default("en")
});
var insertIQTestSessionSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  score: import_zod.z.number(),
  totalQuestions: import_zod.z.number(),
  correctAnswers: import_zod.z.number()
});
var insertIQTestAnswerSchema = import_zod.z.object({
  sessionId: import_zod.z.string(),
  questionId: import_zod.z.string(),
  userAnswer: import_zod.z.string(),
  isCorrect: import_zod.z.number()
});
var insertMagicLinkTokenSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  token: import_zod.z.string(),
  expiresAt: import_zod.z.date()
});
var insertDailyPlanProgressSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  date: import_zod.z.string(),
  thetaAudioCompleted: import_zod.z.number().default(0).optional(),
  breathingCompleted: import_zod.z.number().default(0).optional(),
  gameCompleted: import_zod.z.number().default(0).optional(),
  moodCompleted: import_zod.z.number().default(0).optional(),
  lastCompletionDate: import_zod.z.date().nullable().optional()
});
var journalEntrySchema = import_zod.z.object({
  userId: import_zod.z.string(),
  title: import_zod.z.string().min(1, "Title is required"),
  content: import_zod.z.string().min(1, "Content is required"),
  mood: import_zod.z.string().optional(),
  tags: import_zod.z.array(import_zod.z.string()).optional(),
  isFavorite: import_zod.z.boolean().default(false),
  createdAt: import_zod.z.date().optional(),
  // Firestore timestamps are handled differently, but for schema validation Date is fine
  updatedAt: import_zod.z.date().optional()
});
var insertAddictionSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  type: import_zod.z.string(),
  name: import_zod.z.string(),
  quitDate: import_zod.z.string().or(import_zod.z.date()).transform((val) => new Date(val)),
  lastRelapseDate: import_zod.z.string().or(import_zod.z.date()).nullable().optional().transform((val) => val ? new Date(val) : null),
  dailyGoal: import_zod.z.string().optional()
});
var insertAddictionCheckinSchema = import_zod.z.object({
  addictionId: import_zod.z.string(),
  date: import_zod.z.string(),
  status: import_zod.z.enum(["clean", "relapsed", "struggling"]),
  notes: import_zod.z.string().optional()
});
var insertQuizResultSchema = import_zod.z.object({
  email: import_zod.z.string().email(),
  answers: import_zod.z.array(import_zod.z.any()),
  metadata: import_zod.z.any().optional(),
  userId: import_zod.z.string().nullable().optional()
});
var insertSleepEntrySchema = import_zod.z.object({
  userId: import_zod.z.string(),
  date: import_zod.z.string(),
  bedtime: import_zod.z.string(),
  sleepOnsetMinutes: import_zod.z.number(),
  awakeningsCount: import_zod.z.number(),
  finalWakeTime: import_zod.z.string(),
  totalSleepHours: import_zod.z.number(),
  sleepQuality: import_zod.z.number().min(1).max(5),
  caffeineAlcohol: import_zod.z.string().optional(),
  sleepEfficiency: import_zod.z.number()
});
var insertSleepProgramProgressSchema = import_zod.z.object({
  userId: import_zod.z.string(),
  completedDays: import_zod.z.array(import_zod.z.number())
});

// ../server/routes/games.ts
var router2 = (0, import_express2.Router)();
router2.post("/game/score", verifyToken, async (req, res) => {
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
router2.get("/game/scores", verifyToken, async (req, res) => {
  try {
    const { gameType } = req.query;
    const scores = await storage.getGameScores(req.user.id, gameType);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/iq-test/questions", verifyToken, async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 20;
    const userLanguage = req.user?.language || "en";
    const questions = await storage.getRandomIQQuestions(count, userLanguage);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.post("/iq-test/submit", verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }
    const totalQuestions = answers.length;
    let correctAnswers = 0;
    const sessionId = import_crypto3.default.randomUUID();
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
router2.get("/iq-test/history", verifyToken, async (req, res) => {
  try {
    const sessions = await storage.getIQTestSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/iq-test/session/:sessionId", verifyToken, async (req, res) => {
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
router2.get("/iq-test/answers/:sessionId", verifyToken, async (req, res) => {
  try {
    const answers = await storage.getIQTestAnswers(req.params.sessionId);
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/iq-test/session/:id/answers", verifyToken, async (req, res) => {
  try {
    const answers = await storage.getIQTestAnswers(req.params.id);
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var games_default = router2;

// ../server/routes/sleep.ts
var import_express3 = require("express");
var router3 = (0, import_express3.Router)();
router3.get("/sleep-entries", verifyToken, async (req, res) => {
  try {
    const entries = await storage.getRecentSleepEntries(req.user.id, 7);
    res.json(entries);
  } catch (error) {
    console.error("Error fetching sleep entries:", error);
    res.status(500).json({ error: error.message });
  }
});
router3.post("/sleep-entries", verifyToken, async (req, res) => {
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
router3.get("/sleep-progress", verifyToken, async (req, res) => {
  try {
    const progress = await storage.getSleepProgramProgress(req.user.id);
    res.json(progress || { completedDays: [] });
  } catch (error) {
    console.error("Error fetching sleep progress:", error);
    res.status(500).json({ error: error.message });
  }
});
router3.put("/sleep-progress", verifyToken, async (req, res) => {
  try {
    const { completedDays } = req.body;
    const progress = await storage.updateSleepProgramProgress(req.user.id, completedDays);
    res.json(progress);
  } catch (error) {
    console.error("Error updating sleep progress:", error);
    res.status(500).json({ error: error.message });
  }
});
router3.post("/sleep-coach", verifyToken, async (req, res) => {
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
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
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
var sleep_default = router3;

// ../server/routes/wellness.ts
var import_express4 = require("express");
var import_zod2 = require("zod");
var router4 = (0, import_express4.Router)();
router4.post("/mood", verifyToken, async (req, res) => {
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
    if (error instanceof import_zod2.z.ZodError) {
      console.error("Validation error:", JSON.stringify(error.errors, null, 2));
    }
    res.status(400).json({ error: error.message });
  }
});
router4.get("/mood", verifyToken, async (req, res) => {
  try {
    const entries = await storage.getMoodEntries(req.user.id);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router4.patch("/mood/:id", verifyToken, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const entry = await storage.updateMoodEntry(req.params.id, mood, note);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router4.delete("/mood/:id", verifyToken, async (req, res) => {
  try {
    await storage.deleteMoodEntry(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router4.post("/daily-plan/complete-task", verifyToken, async (req, res) => {
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
router4.post("/daily-plan/reset", verifyToken, async (req, res) => {
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
router4.get("/daily-plan", verifyToken, async (req, res) => {
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
router4.post("/journal", verifyToken, async (req, res) => {
  res.status(403).json({ error: "Journal functionality is currently disabled" });
});
router4.get("/journal", verifyToken, async (req, res) => {
  res.status(403).json({ error: "Journal functionality is currently disabled" });
});
router4.patch("/journal/:id", verifyToken, async (req, res) => {
  res.status(403).json({ error: "Journal functionality is currently disabled" });
});
router4.delete("/journal/:id", verifyToken, async (req, res) => {
  res.status(403).json({ error: "Journal functionality is currently disabled" });
});
router4.get("/journal/:id", verifyToken, async (req, res) => {
  res.status(403).json({ error: "Journal functionality is currently disabled" });
});
router4.post("/addictions", verifyToken, async (req, res) => {
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
router4.get("/addictions", verifyToken, async (req, res) => {
  try {
    const addictions = await storage.getUserAddictions(req.user.id);
    res.json(addictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router4.get("/addictions/:id", verifyToken, async (req, res) => {
  try {
    const addiction = await storage.getAddiction(req.params.id);
    if (!addiction) return res.sendStatus(404);
    if (addiction.userId !== req.user.id) return res.sendStatus(403);
    res.json(addiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router4.patch("/addictions/:id", verifyToken, async (req, res) => {
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
router4.delete("/addictions/:id", verifyToken, async (req, res) => {
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
router4.post("/addictions/:id/checkin", verifyToken, async (req, res) => {
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
router4.get("/addictions/:id/checkins", verifyToken, async (req, res) => {
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
var wellness_default = router4;

// ../server/routes/users.ts
var import_express5 = require("express");
var import_auth3 = require("firebase-admin/auth");

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
    },
    // Sleep Welcome Email
    sleepWelcome: {
      subject: "\u{1F389} Welcome to SleepWaves - Your Journey to Better Sleep!",
      title: "\u{1F389} Welcome to SleepWaves!",
      subtitle: "Restorative sleep is just a night away",
      greeting: "Thank you for joining SleepWaves!",
      instruction: "Your account is ready. Click the button below to start improving your sleep quality tonight.",
      buttonText: "Start Sleeping Better",
      validFor: "This login link is valid for <strong>15 minutes</strong>. After logging in once, you'll stay logged in for 30 days on this device.",
      subscriptionTitle: "What's included in your SleepWaves plan:",
      feature1: "<strong>Sleep Cycle Calculator</strong> - Determine the perfect bedtime to wake up feeling refreshed",
      feature2: "<strong>Soothing Sleep Sounds</strong> - Rain, White Noise, Ocean waves, and more to help you drift off",
      feature3: "<strong>Guided Sleep Meditations</strong> - Expert-led sessions to relax your mind and body before bed",
      feature4: "<strong>Chronotype Analysis</strong> - Understand your natural sleep rhythms (Bear, Wolf, Lion, Dolphin)",
      feature5: "<strong>Sleep Tracking</strong> - Monitor your sleep efficiency and habits to track improvements",
      multilingualTitle: "Multilingual Support:",
      multilingualText: "SleepWaves is available in English, German, French, and Portuguese. You can change your language preference in your account settings.",
      needAssistance: "Need assistance?",
      supportText: "Our support team is here to help Monday-Friday, 9 AM - 5 PM EST at",
      disclaimer: "This is an automated welcome message from SleepWaves.<br>You're receiving this because you subscribed at",
      buyLink: "creativewaves.me",
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
    },
    // Sleep Welcome Email
    sleepWelcome: {
      subject: "\u{1F389} Willkommen bei SleepWaves - Ihre Reise zu besserem Schlaf!",
      title: "\u{1F389} Willkommen bei SleepWaves!",
      subtitle: "Erholsamer Schlaf ist nur eine Nacht entfernt",
      greeting: "Danke, dass Sie sich SleepWaves angeschlossen haben!",
      instruction: "Ihr Konto ist bereit. Klicken Sie unten, um noch heute Abend Ihre Schlafqualit\xE4t zu verbessern.",
      buttonText: "Besser schlafen",
      validFor: "Dieser Login-Link ist <strong>15 Minuten</strong> g\xFCltig. Nach der ersten Anmeldung bleiben Sie 30 Tage lang auf diesem Ger\xE4t angemeldet.",
      subscriptionTitle: "Was in Ihrem SleepWaves-Plan enthalten ist:",
      feature1: "<strong>Schlafzyklus-Rechner</strong> - Bestimmen Sie die perfekte Schlafenszeit, um erfrischt aufzuwachen",
      feature2: "<strong>Beruhigende Schlafger\xE4usche</strong> - Regen, Wei\xDFes Rauschen, Meereswellen und mehr zum Einschlafen",
      feature3: "<strong>Gef\xFChrte Schlafmeditationen</strong> - Expertengeleitete Sitzungen zur Entspannung von Geist und K\xF6rper",
      feature4: "<strong>Chronotyp-Analyse</strong> - Verstehen Sie Ihren nat\xFCrlichen Schlafrhythmus (B\xE4r, Wolf, L\xF6we, Delfin)",
      feature5: "<strong>Schlaf-Tracking</strong> - \xDCberwachen Sie Ihre Schlafeffizienz und Gewohnheiten",
      multilingualTitle: "Mehrsprachige Unterst\xFCtzung:",
      multilingualText: "SleepWaves ist in Englisch, Deutsch, Franz\xF6sisch und Portugiesisch verf\xFCgbar.",
      needAssistance: "Brauchen Sie Unterst\xFCtzung?",
      supportText: "Unser Support-Team hilft Ihnen gerne von Montag bis Freitag, 9-17 Uhr EST unter",
      disclaimer: "Dies ist eine automatische Willkommensnachricht von SleepWaves.",
      buyLink: "creativewaves.me",
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
    },
    // Sleep Welcome Email
    sleepWelcome: {
      subject: "\u{1F389} Bienvenue sur SleepWaves - Votre voyage vers un meilleur sommeil !",
      title: "\u{1F389} Bienvenue sur SleepWaves !",
      subtitle: "Un sommeil r\xE9parateur est \xE0 port\xE9e de main",
      greeting: "Merci de rejoindre SleepWaves !",
      instruction: "Votre compte est pr\xEAt. Cliquez ci-dessous pour commencer \xE0 am\xE9liorer la qualit\xE9 de votre sommeil d\xE8s ce soir.",
      buttonText: "Mieux dormir",
      validFor: "Ce lien de connexion est valable <strong>15 minutes</strong>. Apr\xE8s votre premi\xE8re connexion, vous resterez connect\xE9 pendant 30 jours sur cet appareil.",
      subscriptionTitle: "Ce qui est inclus dans votre plan SleepWaves :",
      feature1: "<strong>Calculateur de cycles de sommeil</strong> - D\xE9terminez l'heure de coucher id\xE9ale pour vous r\xE9veiller frais et dispos",
      feature2: "<strong>Sons apaisants</strong> - Pluie, Bruit blanc, Vagues de l'oc\xE9an et plus pour vous aider \xE0 vous endormir",
      feature3: "<strong>M\xE9ditations guid\xE9es</strong> - S\xE9ances dirig\xE9es par des experts pour d\xE9tendre votre corps et votre esprit",
      feature4: "<strong>Analyse du chronotype</strong> - Comprenez vos rythmes de sommeil naturels (Ours, Loup, Lion, Dauphin)",
      feature5: "<strong>Suivi du sommeil</strong> - Surveillez l'efficacit\xE9 et les habitudes de votre sommeil",
      multilingualTitle: "Support multilingue :",
      multilingualText: "SleepWaves est disponible en anglais, allemand, fran\xE7ais et portugais.",
      needAssistance: "Besoin d'assistance ?",
      supportText: "Notre \xE9quipe d'assistance est l\xE0 pour vous aider du lundi au vendredi, de 9h \xE0 17h EST \xE0",
      disclaimer: "Ceci est un message de bienvenue automatique de SleepWaves.",
      buyLink: "creativewaves.me",
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
      feature1: "<strong>13 sess\xF5es de \xE1udio guiadas</strong> - Sess\xF5es terap\xEAuticas para relaxamento, foco e clareza mental (7 minutes cada)",
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
    },
    // Sleep Welcome Email
    sleepWelcome: {
      subject: "\u{1F389} Bem-vindo ao SleepWaves - Sua jornada para um sono melhor!",
      title: "\u{1F389} Bem-vindo ao SleepWaves!",
      subtitle: "Sono restaurador a apenas uma noite de dist\xE2ncia",
      greeting: "Obrigado por se juntar ao SleepWaves!",
      instruction: "Sua conta est\xE1 pronta. Clique abaixo para come\xE7ar a melhorar a qualidade do seu sono hoje \xE0 noite.",
      buttonText: "Dormir Melhor",
      validFor: "Este link de login \xE9 v\xE1lido por <strong>15 minutos</strong>. Ap\xF3s fazer login uma vez, voc\xEA permanecer\xE1 conectado por 30 dias neste dispositivo.",
      subscriptionTitle: "O que est\xE1 inclu\xEDdo no seu plano SleepWaves:",
      feature1: "<strong>Calculadora de Ciclo de Sono</strong> - Determine a hora de dormir perfeita para acordar revigorado",
      feature2: "<strong>Sons Relaxantes</strong> - Chuva, Ru\xEDdo Branco, Ondas do Oceano e muito mais para ajudar voc\xEA a pegar no sono",
      feature3: "<strong>Medita\xE7\xF5es Guiadas</strong> - Sess\xF5es lideradas por especialistas para relaxar mente e corpo",
      feature4: "<strong>An\xE1lise de Cronotipo</strong> - Entenda seus ritmos naturais de sono (Urso, Lobo, Le\xE3o, Golfinho)",
      feature5: "<strong>Rastreamento de Sono</strong> - Monitore sua efici\xEAncia e h\xE1bitos de sono",
      multilingualTitle: "Suporte multil\xEDngue:",
      multilingualText: "SleepWaves est\xE1 dispon\xEDvel em ingl\xEAs, alem\xE3o, franc\xEAs e portugu\xEAs.",
      needAssistance: "Precisa de assist\xEAncia?",
      supportText: "Nossa equipe de suporte est\xE1 aqui para ajudar de segunda a sexta-feira, das 9h \xE0s 17h EST em",
      disclaimer: "Esta \xE9 uma mensagem de boas-vindas automatizada do SleepWaves.",
      buyLink: "creativewaves.me",
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
  let baseUrl = "https://app2.creativewaves.me";
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
async function sendSleepWelcomeEmail(email, language = "en") {
  const validLang = ["en", "de", "fr", "pt"].includes(language) ? language : "en";
  const t = emailTranslations[validLang].sleepWelcome;
  let baseUrl = "https://app2.creativewaves.me";
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
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #1a237e 0%, #311b92 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">SleepWaves</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${t.subtitle}</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 22px; text-align: center;">${t.greeting}</h2>
            
            <p style="font-size: 16px; color: #4a5568; text-align: center; margin-bottom: 30px;">
              ${t.instruction}
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" 
                 style="background: linear-gradient(135deg, #1a237e 0%, #311b92 100%); 
                        color: white; 
                        padding: 16px 48px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(49, 27, 146, 0.4);
                        transition: transform 0.2s;">
                ${t.buttonText}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #718096; margin-top: 30px; text-align: center;">
              <strong>${t.emailLabel || "Email"}:</strong> ${email}
            </p>
            
            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 30px;">
              <h3 style="color: #2d3748; margin-bottom: 20px; text-align: center; font-size: 18px;">${t.subscriptionTitle}</h3>
              <ul style="font-size: 15px; color: #4a5568; line-height: 1.8; list-style-type: none; padding: 0;">
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">\u2713</span> ${t.feature1}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">\u2713</span> ${t.feature2}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">\u2713</span> ${t.feature3}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">\u2713</span> ${t.feature4}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">\u2713</span> ${t.feature5}
                </li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f7fafc; border-radius: 8px;">
               <p style="margin: 0; font-size: 14px; color: #718096; text-align: center;">
                 <strong>${t.multilingualTitle}</strong><br>
                 ${t.multilingualText}
               </p>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
               <p style="font-size: 13px; color: #a0aec0; text-align: center; margin: 0;">
                 ${t.disclaimer}
               </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #a0aec0; margin: 0;">
              &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} SleepWaves. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  await sendEmail({
    to: email,
    subject: t.subject,
    html
  });
}

// ../server/routes/users.ts
var router5 = (0, import_express5.Router)();
router5.post("/admin/users", verifyToken, async (req, res) => {
  try {
    if (req.user?.email !== "ricdes@gmail.com") {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    const { email, username, language, subscriptionStatus, wooCommerceSubscriptionId, isSleepCustomer } = req.body;
    if (!email || !username) {
      return res.status(400).json({ error: "Email and username are required" });
    }
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const newUser = await storage.createUser({
      email: email.toLowerCase().trim(),
      username,
      password: "admin-created",
      // Placeholder
      language: language || "en",
      subscriptionStatus: subscriptionStatus || "active",
      wooCommerceSubscriptionId: wooCommerceSubscriptionId || null,
      isSleepCustomer: isSleepCustomer || false
    });
    try {
      await (0, import_auth3.getAuth)().createUser({
        email: email.toLowerCase().trim(),
        emailVerified: true,
        disabled: false
      });
      console.log(`[Admin] Created Firebase Auth user: ${email}`);
    } catch (authError) {
      console.error(`[Admin] Error creating Firebase Auth user:`, authError);
    }
    try {
      if (isSleepCustomer) {
        await sendSleepWelcomeEmail(newUser.email, newUser.language);
      } else {
        await sendWelcomeEmail(newUser.email, newUser.language);
      }
      console.log(`[Admin] Sent welcome email to ${newUser.email}`);
    } catch (emailError) {
      console.error(`[Admin] Failed to send welcome email:`, emailError);
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.get("/admin/users", verifyToken, async (req, res) => {
  try {
    console.log("[Admin] GET /api/admin/users - Request from:", req.user?.email);
    if (req.user?.email !== "ricdes@gmail.com") {
      console.log("[Admin] Access denied - not admin email");
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    console.log("[Admin] Fetching users from Firestore...");
    const snapshot = await db.collection("users").orderBy("createdAt", "asc").limit(100).get();
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
        isSleepCustomer: data.isSleepCustomer,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      };
    });
    res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.put("/admin/users/:id", verifyToken, async (req, res) => {
  try {
    if (req.user?.email !== "ricdes@gmail.com") {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    const { id } = req.params;
    const { email, username, language, subscriptionStatus, wooCommerceSubscriptionId, recoveryUser, expressUpgradeEnabled, isSleepCustomer } = req.body;
    const userRef = db.collection("users").doc(id);
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
    if (isSleepCustomer !== void 0) updateData.isSleepCustomer = isSleepCustomer;
    await userRef.update(updateData);
    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.delete("/admin/users/:id", verifyToken, async (req, res) => {
  try {
    if (req.user?.email !== "ricdes@gmail.com") {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    const { id } = req.params;
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = userDoc.data();
    try {
      if (userData?.email) {
        const firebaseUser = await (0, import_auth3.getAuth)().getUserByEmail(userData.email);
        await (0, import_auth3.getAuth)().deleteUser(firebaseUser.uid);
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
var users_default = router5;

// ../server/routes/profile.ts
var import_express6 = require("express");
var router6 = (0, import_express6.Router)();
router6.get("/quiz-insights", verifyToken, async (req, res) => {
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
router6.patch("/language", verifyToken, async (req, res) => {
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
router6.patch("/chronotype", verifyToken, async (req, res) => {
  try {
    const { chronotype } = req.body;
    const validChronotypes = ["bear", "wolf", "lion", "dolphin"];
    if (!chronotype || !validChronotypes.includes(chronotype)) {
      return res.status(400).json({ error: "Invalid chronotype selection" });
    }
    const updatedUser = await storage.updateUserChronotype(req.user.id, chronotype);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user chronotype:", error);
    res.status(500).json({ error: error.message });
  }
});
var profile_default = router6;

// ../server/routes/webhooks.ts
var import_express7 = require("express");
var import_crypto4 = __toESM(require("crypto"), 1);
var import_zod3 = require("zod");
var router7 = (0, import_express7.Router)();
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
router7.post("/quiz", async (req, res) => {
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
    if (error instanceof import_zod3.z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
router7.post("/create-user", async (req, res) => {
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
router7.post("/express-upgrade", async (req, res) => {
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
router7.post("/subscription-created", verifyWebhookSignature, async (req, res) => {
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
      const dummyPassword = import_crypto4.default.randomBytes(32).toString("hex");
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
router7.post("/subscription-cancelled", verifyWebhookSignature, async (req, res) => {
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
var webhooks_default = router7;

// ../server/routes/subscription.ts
var import_express8 = require("express");
var router8 = (0, import_express8.Router)();
router8.get("/status", verifyToken, async (req, res) => {
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
router8.post("/pause", verifyToken, async (req, res) => {
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
router8.post("/resume", verifyToken, async (req, res) => {
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
router8.post("/cancel", verifyToken, async (req, res) => {
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
var subscription_default = router8;

// ../server/routes/ai.ts
var import_express9 = require("express");
init_quizHelpers();
var router9 = (0, import_express9.Router)();
router9.post("/chat", verifyToken, async (req, res) => {
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
var ai_default = router9;

// ../server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.use("/api", content_default);
  app2.use("/api", games_default);
  app2.use("/api", sleep_default);
  app2.use("/api", wellness_default);
  app2.use("/api", users_default);
  app2.use("/api/user", profile_default);
  app2.use("/api/subscription", subscription_default);
  app2.use("/api", ai_default);
  app2.use("/api/webhook", webhooks_default);
  app2.use("/webhook", webhooks_default);
  app2.all("/api/*", (req, res) => {
    console.warn(`[API 404] Unmatched route: ${req.method} ${req.path}`);
    res.status(404).json({
      error: "Endpoint not found",
      method: req.method,
      path: req.path,
      hint: "Check that the route is registered and the HTTP method is correct."
    });
  });
  console.log("[Routes] All routes registered successfully.");
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// src/cleanupQuizResults.ts
var import_scheduler = require("firebase-functions/v2/scheduler");

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
var cleanupQuizResults = (0, import_scheduler.onSchedule)({
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
var app = (0, import_express10.default)();
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
app.use(["/api/webhook/*", "/webhook/*"], import_express10.default.raw({ type: "application/json" }), (req, res, next) => {
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
    import_express10.default.json()(req, res, next);
  }
});
app.use(import_express10.default.urlencoded({ extended: false }));
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
var api = (0, import_https.onRequest)({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  api,
  cleanupQuizResults
});
