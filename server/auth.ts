import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { getAuth } from "firebase-admin/auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

declare global {
  namespace Express {
    interface User extends SelectUser { }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Middleware to verify Firebase ID Token
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[AUTH] No token provided in Authorization header:', authHeader);
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log(`[AUTH] Verifying token (length: ${idToken.length})`);

  try {
    // Verify the token with Firebase Admin
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;
    const uid = decodedToken.uid;

    console.log(`[AUTH] Token verified. UID: ${uid}, Email: ${email}`);

    if (!email) {
      console.log('[AUTH] Token verified but no email found in token.');
      return res.status(401).json({ error: 'Unauthorized: No email in token' });
    }

    // Check if user exists in our DB
    let user = await storage.getUserByEmail(email);

    if (!user) {
      // JIT Provisioning: Create user if they exist in Firebase but not in our DB
      console.log(`[AUTH] User ${email} authenticated via Firebase but not found in DB. Creating...`);

      let username = email.split('@')[0];

      // Ensure username is unique
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        // Append random suffix if username taken
        const suffix = Math.floor(1000 + Math.random() * 9000);
        username = `${username}${suffix}`;
      }

      try {
        user = await storage.createUser({
          username,
          password: "firebase-managed", // Placeholder, auth handled by Firebase
          email,
          detoxStartDate: null,
          language: "en" // Default language
        });
        console.log(`[AUTH] Created new user: ${user.id} (${user.email})`);
      } catch (createError) {
        console.error('[AUTH] Failed to auto-create user:', createError);
        return res.status(500).json({ error: 'Failed to create user record' });
      }
    } else {
      console.log(`[AUTH] User found in DB: ${user.id} (${user.email})`);
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error: any) {
    console.error('[AUTH] Token verification failed:', error);
    console.error('[AUTH] Error code:', error.code);
    console.error('[AUTH] Error message:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token', details: error.message });
  }
}

export function setupAuth(app: Express) {
  // Initialization is handled in db.ts

  // Protected Routes - Apply verifyToken middleware

  app.get("/api/user", verifyToken, (req, res) => {
    res.json((req as any).user);
  });

  // Registration Endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { username, password, email, language } = req.body;

      // We expect the client to have already created the user in Firebase Auth
      // and passed the token in the header (if we used verifyToken here).
      // BUT, the client calls this *after* creating the user in Firebase.
      // So we should verify the token here too to ensure the request comes from the authenticated user.

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);

      if (decodedToken.email !== email) {
        return res.status(403).json({ error: 'Forbidden: Email mismatch' });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Create user in our DB
      // Note: We don't need to hash password anymore since Firebase handles auth,
      // but our schema might require it. We can store a dummy or the Firebase UID.
      // Let's store the Firebase UID as the password or a specific field if we had one.
      // For now, we'll just store a placeholder since we don't use it for auth.

      const user = await storage.createUser({
        username,
        password: "firebase-managed", // Placeholder
        email,
        language,
        detoxStartDate: null
      });

      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Update user email
  app.patch("/api/user/email", verifyToken, async (req, res) => {
    try {
      const updated = await storage.updateUserEmail((req as any).user!.id, req.body.email);
      res.json(updated);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Update user password - DEPRECATED/HANDLED BY FIREBASE
  // We can keep it if we want to update local state, but Firebase handles this.
  // Let's remove it or make it a no-op for now to avoid confusion.
  app.patch("/api/user/password", verifyToken, async (req, res) => {
    res.status(400).json({ error: "Password management is handled by Firebase" });
  });



  // Simple Login Endpoint (Passwordless, Linkless - for elderly users)
  // This allows login with just an email if the account exists AND has an active subscription.
  // No passwords or magic links needed - designed for accessibility.
  app.post("/api/simple-login", async (req, res) => {
    try {
      const { email: rawEmail } = req.body;
      if (!rawEmail) return res.status(400).json({ error: "Email is required" });

      const email = rawEmail.toLowerCase().trim();
      console.log(`[Simple Login] Attempting login for: ${email}`);

      // Block accounts that require Google Sign-In
      const googleOnlyAccounts = ['ricdes@gmail.com'];
      if (googleOnlyAccounts.includes(email)) {
        console.log(`[Simple Login] Account ${email} requires Google Sign-In`);
        return res.status(403).json({
          error: "Google Sign-In required",
          message: "This account requires Google Sign-In. Please use the Google button to log in."
        });
      }

      // 1. Check if user exists in our DB
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log(`[Simple Login] User not found in DB: ${email}`);
        return res.status(404).json({ error: "Account not found" });
      }

      // 2. Check subscription status - only allow login if subscription is active
      if (user.subscriptionStatus !== 'active') {
        console.log(`[Simple Login] User ${email} has inactive subscription: ${user.subscriptionStatus}`);
        return res.status(403).json({
          error: "Subscription inactive",
          message: "Your subscription is not active. Please renew to continue."
        });
      }

      console.log(`[Simple Login] User found with active subscription: ${email} (ID: ${user.id})`);

      // 3. Get or create Firebase Auth user
      let firebaseUid: string;
      try {
        const firebaseUser = await getAuth().getUserByEmail(email);
        firebaseUid = firebaseUser.uid;
        console.log(`[Simple Login] Found existing Firebase Auth user: ${firebaseUid}`);
      } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
          // User exists in our DB but not in Firebase Auth - create them
          console.log(`[Simple Login] Creating Firebase Auth user for: ${email}`);
          try {
            const newFirebaseUser = await getAuth().createUser({
              email,
              emailVerified: true, // Skip email verification for existing DB users
            });
            firebaseUid = newFirebaseUser.uid;
            console.log(`[Simple Login] Created Firebase Auth user: ${firebaseUid}`);
          } catch (createError: any) {
            console.error(`[Simple Login] Failed to create Firebase Auth user:`, createError);
            return res.status(500).json({ error: "Failed to create authentication record" });
          }
        } else {
          console.error(`[Simple Login] Firebase Auth error:`, e);
          return res.status(500).json({ error: "Authentication service error" });
        }
      }

      // 4. Generate Custom Token
      const customToken = await getAuth().createCustomToken(firebaseUid);
      console.log(`[Simple Login] Generated custom token for: ${email}`);

      res.json({ token: customToken });
    } catch (error: any) {
      console.error("[Simple Login] Error:", error);
      // Return full error details for debugging IAM issues
      res.status(500).json({
        error: error.message,
        code: error.code,
        details: error.toString()
      });
    }
  });
}
