import { db } from "./db";
import session from "express-session";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
export class DatabaseStorage {
    constructor() {
        // firestore-store is a CommonJS module, use require
        const FirestoreStore = require("firestore-store")(session);
        this.sessionStore = new FirestoreStore({
            database: db,
            collection: 'sessions'
        });
    }
    // Helper to generate IDs
    generateId() {
        return db.collection('_temp').doc().id;
    }
    // User methods
    async getUser(id) {
        const doc = await db.collection('users').doc(id).get();
        if (!doc.exists)
            return undefined;
        return { id: doc.id, ...doc.data() };
    }
    async getUserByUsername(username) {
        const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
        if (snapshot.empty)
            return undefined;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
    async getUserByEmail(email) {
        const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
        if (snapshot.empty)
            return undefined;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
    async createUser(insertUser) {
        const id = this.generateId();
        const user = {
            ...insertUser,
            id,
            createdAt: new Date(),
        };
        await db.collection('users').doc(id).set(user);
        return user;
    }
    async updateUserAudioProgress(userId, sessionNum, position) {
        await db.collection('users').doc(userId).update({
            currentAudioSession: sessionNum,
            lastAudioPosition: position
        });
        return (await this.getUser(userId));
    }
    async updateUserEmail(userId, email) {
        await db.collection('users').doc(userId).update({ email });
        return (await this.getUser(userId));
    }
    async updateUserPassword(userId, password) {
        await db.collection('users').doc(userId).update({ password });
        return (await this.getUser(userId));
    }
    async updateUserLanguage(userId, language) {
        await db.collection('users').doc(userId).update({ language });
        return (await this.getUser(userId));
    }
    async updateSubscriptionStatus(userId, status, subscriptionId) {
        const update = { subscriptionStatus: status };
        if (subscriptionId)
            update.wooCommerceSubscriptionId = subscriptionId;
        await db.collection('users').doc(userId).update(update);
        return (await this.getUser(userId));
    }
    async updateUserPointsAndStreak(userId, points, streak) {
        await db.collection('users').doc(userId).update({
            totalPoints: points,
            streakCount: streak
        });
        return (await this.getUser(userId));
    }
    // Mood Entry methods
    async createMoodEntry(entry) {
        const id = this.generateId();
        const moodEntry = {
            ...entry,
            id,
            createdAt: new Date(),
        };
        await db.collection('moodEntries').doc(id).set(moodEntry);
        return moodEntry;
    }
    async getMoodEntries(userId, limit = 30) {
        const snapshot = await db.collection('moodEntries')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async updateMoodEntry(id, mood, note) {
        await db.collection('moodEntries').doc(id).update({ mood, note });
        const doc = await db.collection('moodEntries').doc(id).get();
        return { id: doc.id, ...doc.data() };
    }
    async deleteMoodEntry(id) {
        await db.collection('moodEntries').doc(id).delete();
    }
    // Game Score methods
    async createGameScore(score) {
        const id = this.generateId();
        const gameScore = {
            ...score,
            id,
            createdAt: new Date(),
        };
        await db.collection('gameScores').doc(id).set(gameScore);
        return gameScore;
    }
    async getGameScores(userId, gameType) {
        let query = db.collection('gameScores').where('userId', '==', userId);
        if (gameType) {
            query = query.where('gameType', '==', gameType);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').limit(gameType ? 10 : 50).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    // Course methods
    async getCourses(language = 'en') {
        const snapshot = await db.collection('courses')
            .where('language', '==', language)
            .orderBy('orderIndex')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getCourse(id) {
        const doc = await db.collection('courses').doc(id).get();
        if (!doc.exists)
            return undefined;
        return { id: doc.id, ...doc.data() };
    }
    async getLessonsByCourse(courseId, language = 'en') {
        const snapshot = await db.collection('lessons')
            .where('courseId', '==', courseId)
            .where('language', '==', language)
            .orderBy('orderIndex')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getLesson(id) {
        const doc = await db.collection('lessons').doc(id).get();
        if (!doc.exists)
            return undefined;
        return { id: doc.id, ...doc.data() };
    }
    async getUserProgress(userId, courseId) {
        const snapshot = await db.collection('userLessonProgress')
            .where('userId', '==', userId)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async markLessonComplete(userId, lessonId) {
        const snapshot = await db.collection('userLessonProgress')
            .where('userId', '==', userId)
            .where('lessonId', '==', lessonId)
            .limit(1)
            .get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await doc.ref.update({ completed: 1, completedAt: new Date() });
            const updated = await doc.ref.get();
            return { id: updated.id, ...updated.data() };
        }
        const id = this.generateId();
        const progress = {
            id,
            userId,
            lessonId,
            completed: 1,
            completedAt: new Date(),
        };
        await db.collection('userLessonProgress').doc(id).set(progress);
        return progress;
    }
    // IQ Test methods
    async getRandomIQQuestions(count, language = 'en') {
        const snapshot = await db.collection('iqQuestions')
            .where('language', '==', language)
            .get();
        const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Shuffle and take count
        return questions.sort(() => Math.random() - 0.5).slice(0, count);
    }
    async getIQQuestion(id) {
        const doc = await db.collection('iqQuestions').doc(id).get();
        if (!doc.exists)
            return undefined;
        return { id: doc.id, ...doc.data() };
    }
    async createIQTestSession(sessionData) {
        const id = this.generateId();
        const session = {
            ...sessionData,
            id,
            startedAt: new Date(),
            completedAt: null,
        };
        await db.collection('iqTestSessions').doc(id).set(session);
        return session;
    }
    async createIQTestSessionWithId(session) {
        await db.collection('iqTestSessions').doc(session.id).set(session);
        return session;
    }
    async saveIQTestAnswer(answer) {
        const id = this.generateId();
        const iqAnswer = {
            ...answer,
            id,
            createdAt: new Date(),
        };
        await db.collection('iqTestAnswers').doc(id).set(iqAnswer);
        return iqAnswer;
    }
    async getIQTestSession(sessionId) {
        const doc = await db.collection('iqTestSessions').doc(sessionId).get();
        if (!doc.exists)
            return undefined;
        return { id: doc.id, ...doc.data() };
    }
    async getIQTestSessions(userId) {
        const snapshot = await db.collection('iqTestSessions')
            .where('userId', '==', userId)
            .orderBy('completedAt', 'desc')
            .limit(20)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getIQTestAnswers(sessionId) {
        const snapshot = await db.collection('iqTestAnswers')
            .where('sessionId', '==', sessionId)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    // Magic Link methods
    async createMagicLinkToken(userId) {
        const crypto = await import('crypto');
        const token = crypto.randomBytes(32).toString('base64url');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        const id = this.generateId();
        const magicLink = {
            id,
            userId,
            token,
            expiresAt,
            createdAt: new Date(),
        };
        await db.collection('magicLinkTokens').doc(id).set(magicLink);
        return magicLink;
    }
    async verifyMagicLinkToken(token) {
        const snapshot = await db.collection('magicLinkTokens')
            .where('token', '==', token)
            .limit(1)
            .get();
        if (snapshot.empty)
            return null;
        const doc = snapshot.docs[0];
        const magicLink = { id: doc.id, ...doc.data() };
        // Check if token is expired
        if (new Date() > magicLink.expiresAt)
            return null;
        // Check if token has already been used
        if (magicLink.usedAt)
            return null;
        // Mark token as used
        await doc.ref.update({ usedAt: new Date() });
        // Get and return the user
        const user = await this.getUser(magicLink.userId);
        return user || null;
    }
    async cleanupExpiredTokens() {
        const now = new Date();
        const snapshot = await db.collection('magicLinkTokens')
            .where('expiresAt', '<', now)
            .get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    }
    // Daily Plan methods
    async getDailyPlan(userId, date) {
        const snapshot = await db.collection('dailyPlanProgress')
            .where('userId', '==', userId)
            .where('date', '==', date)
            .limit(1)
            .get();
        if (snapshot.empty)
            return undefined;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
    async updateDailyPlanTask(userId, date, taskField, completed) {
        const existingPlan = await this.getDailyPlan(userId, date);
        if (existingPlan) {
            await db.collection('dailyPlanProgress').doc(existingPlan.id).update({
                [taskField]: completed
            });
            return (await this.getDailyPlan(userId, date));
        }
        else {
            const id = this.generateId();
            const plan = {
                id,
                userId,
                date,
                [taskField]: completed,
                createdAt: new Date(),
            };
            await db.collection('dailyPlanProgress').doc(id).set(plan);
            return plan;
        }
    }
    // Journal methods
    async createJournalEntry(entry) {
        const id = this.generateId();
        const journalEntry = {
            ...entry,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.collection('journalEntries').doc(id).set(journalEntry);
        return journalEntry;
    }
    async getJournalEntries(userId) {
        const snapshot = await db.collection('journalEntries')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getJournalEntry(id) {
        const doc = await db.collection('journalEntries').doc(id).get();
        if (!doc.exists)
            return undefined;
        return { id: doc.id, ...doc.data() };
    }
    async updateJournalEntry(id, updates) {
        await db.collection('journalEntries').doc(id).update({
            ...updates,
            updatedAt: new Date()
        });
        return (await this.getJournalEntry(id));
    }
    async deleteJournalEntry(id) {
        await db.collection('journalEntries').doc(id).delete();
    }
}
export const storage = new DatabaseStorage();
//# sourceMappingURL=storage.js.map