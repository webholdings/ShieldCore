import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

// Import sub-routers
import contentRouter from "./routes/content";
import gamesRouter from "./routes/games";
import sleepRouter from "./routes/sleep";
import wellnessRouter from "./routes/wellness";
import usersRouter from "./routes/users"; // Admin users
import profileRouter from "./routes/profile"; // Current user
import webhooksRouter from "./routes/webhooks";
import subscriptionRouter from "./routes/subscription";
import aiRouter from "./routes/ai";
import mentalHealthRouter from "./routes/mental-health";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Mount routers
  // Note: Most routers assume being mounted at /api, but some have absolute paths defined inside.
  // We mounted them strategically.

  app.use("/api", contentRouter);        // /courses, /lessons
  app.use("/api", gamesRouter);          // /game/score, /iq-test
  app.use("/api", sleepRouter);          // /sleep-entries, /sleep-progress
  app.use("/api", wellnessRouter);       // /mood, /daily-plan, /addictions
  app.use("/api", usersRouter);          // /admin/users
  app.use("/api/user", profileRouter);   // /quiz-insights (mapped to /user/quiz-insights)
  app.use("/api/subscription", subscriptionRouter); // /status, /pause...
  app.use("/api", aiRouter);             // /chat
  app.use("/api/mental-health", mentalHealthRouter); // /journal

  // ShieldCore: Mock Breach Scan API
  app.post("/api/breach-scan", async (req, res) => {
    // Simulate delay
    await new Promise(r => setTimeout(r, 1000));

    // Mock response
    res.json({
      score: 45,
      safeCount: 12,
      breaches: [
        {
          domain: "adobe.com",
          date: "2013-10-04",
          description: "In October 2013, 153 million Adobe accounts were breached. The data included user IDs, names, encrypted passwords and plain text password hints.",
          dataClasses: ["Email addresses", "Password hints", "Passwords", "Usernames"]
        },
        {
          domain: "linkedin.com",
          date: "2012-05-15",
          description: "In 2012, LinkedIn was hacked and 6.5 million password hashes were posted to a Russian hacker forum.",
          dataClasses: ["Email addresses", "Passwords"]
        },
        {
          domain: "canva.com",
          date: "2019-05-24",
          description: "In May 2019, Canva suffered a data breach that impacted 137 million subscribers. The exposed data included email addresses, names, cities and bcrypt hashed passwords.",
          dataClasses: ["Email addresses", "Names", "Passwords", "Usernames", "Locations"]
        }
      ]
    });
  });

  // Webhooks - mount at both locations to support existing external configs
  app.use("/api/webhook", webhooksRouter);
  app.use("/webhook", webhooksRouter);

  // Catch-all 404 for API routes
  // This must be the LAST route registered
  app.all("/api/*", (req, res) => {
    console.warn(`[API 404] Unmatched route: ${req.method} ${req.path}`);
    res.status(404).json({
      error: "Endpoint not found",
      method: req.method,
      path: req.path,
      hint: "Check that the route is registered and the HTTP method is correct."
    });
  });

  console.log("[Routes] All routes registered successfully.");

  const httpServer = createServer(app);

  return httpServer;
}
