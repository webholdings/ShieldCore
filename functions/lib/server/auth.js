import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { sendMagicLinkEmail } from "./email";
const scryptAsync = promisify(scrypt);
export async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64));
    return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64));
    return timingSafeEqual(hashedBuf, suppliedBuf);
}
export function setupAuth(app) {
    const sessionSettings = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    };
    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await storage.getUserByUsername(username);
            if (!user || !(await comparePasswords(password, user.password))) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        }
        catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });
    app.post("/api/register", async (req, res, next) => {
        try {
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }
            const user = await storage.createUser({
                ...req.body,
                password: await hashPassword(req.body.password),
            });
            req.login(user, (err) => {
                if (err)
                    return next(err);
                res.status(201).json(user);
            });
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
    app.post("/api/login", passport.authenticate("local"), (req, res) => {
        res.status(200).json(req.user);
    });
    // Simple email-based login (no magic link)
    app.post("/api/auth/login-email", async (req, res, next) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            const user = await storage.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({
                    error: "No account found with this email. Please purchase access first."
                });
            }
            // Check if subscription is active
            if (user.subscriptionStatus !== 'active') {
                return res.status(403).json({
                    error: "Your subscription is not active. Please renew your subscription."
                });
            }
            // Log the user in
            req.login(user, (err) => {
                if (err)
                    return next(err);
                res.status(200).json(user);
            });
        }
        catch (error) {
            console.error("Email login error:", error);
            res.status(500).json({ error: "Login failed" });
        }
    });
    // Firebase Sync Endpoint
    app.post("/api/auth/firebase-sync", async (req, res, next) => {
        try {
            const { email, uid, username, language } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            let user = await storage.getUserByEmail(email);
            if (!user) {
                // Enforce WooCommerce-only access
                return res.status(403).json({
                    error: "Access denied. You must have an active subscription to log in. Please purchase access via our website."
                });
            }
            // Log the user in to establish session
            req.login(user, (err) => {
                if (err)
                    return next(err);
                res.status(200).json(user);
            });
        }
        catch (error) {
            console.error("Firebase sync error:", error);
            res.status(500).json({ error: "Sync failed" });
        }
    });
    // Request magic link endpoint
    app.post("/api/auth/request-magic-link", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            const user = await storage.getUserByEmail(email);
            if (!user) {
                // For security, don't reveal if user exists or not
                return res.json({
                    success: true,
                    message: "If an account exists with this email, you will receive a login link shortly."
                });
            }
            // Create magic link token
            const magicLink = await storage.createMagicLinkToken(user.id);
            // Send magic link email in user's preferred language
            await sendMagicLinkEmail(email, magicLink, user.language || 'en');
            console.log(`Magic link sent to: ${email} in ${user.language || 'en'}`);
            res.json({
                success: true,
                message: "If an account exists with this email, you will receive a login link shortly."
            });
        }
        catch (error) {
            console.error("Magic link request error:", error);
            res.status(500).json({ error: "Failed to send login link" });
        }
    });
    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err)
                return next(err);
            res.sendStatus(200);
        });
    });
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        res.json(req.user);
    });
    // Magic link verification endpoint
    app.get("/api/auth/verify-magic-link", async (req, res, next) => {
        try {
            const { token } = req.query;
            if (!token || typeof token !== 'string') {
                return res.status(400).send("Invalid magic link");
            }
            const user = await storage.verifyMagicLinkToken(token);
            if (!user) {
                return res.status(401).send("Invalid or expired magic link");
            }
            // Log the user in
            req.login(user, (err) => {
                if (err)
                    return next(err);
                res.redirect("/dashboard");
            });
        }
        catch (error) {
            console.error("Magic link verification error:", error);
            res.status(500).send("Error verifying magic link");
        }
    });
    // Update user email
    app.patch("/api/user/email", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const updated = await storage.updateUserEmail(req.user.id, req.body.email);
            res.json(updated);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
    // Update user password
    app.patch("/api/user/password", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await storage.getUser(req.user.id);
            if (!user || !(await comparePasswords(currentPassword, user.password))) {
                return res.status(400).send("Current password is incorrect");
            }
            const hashedPassword = await hashPassword(newPassword);
            const updated = await storage.updateUserPassword(req.user.id, hashedPassword);
            res.json(updated);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
    // Update user language
    app.patch("/api/user/language", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        try {
            const { language } = req.body;
            const validLanguages = ['en', 'de', 'fr', 'pt'];
            if (!language || !validLanguages.includes(language)) {
                return res.status(400).send("Invalid language");
            }
            const updated = await storage.updateUserLanguage(req.user.id, language);
            res.json(updated);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
}
//# sourceMappingURL=auth.js.map