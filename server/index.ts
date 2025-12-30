import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { fileURLToPath } from 'url';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { log } from "./log";

const app = express();
app.use(compression());

// CORS middleware for webhooks - MUST be before body parsing
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(['/api/webhook/*', '/webhook/*'], (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'https://creativewavesquizfunnel.web.app',
    'https://quiz.creativewaves.me',
    'https://app2.creativewaves.me',
    'http://localhost:5173',
    'http://localhost:5001'
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,x-wc-webhook-signature');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// For webhook endpoints, capture raw body for signature verification
app.use(['/api/webhook/*', '/webhook/*'], express.raw({ type: 'application/json' }), (req: Request, res: Response, next: NextFunction) => {
  // Store raw body for signature verification
  // If platform (like Firebase) already provided rawBody, use it.
  if (!(req as any).rawBody && Buffer.isBuffer(req.body)) {
    (req as any).rawBody = req.body;
  }

  // Log webhook details for debugging
  console.log('=== WEBHOOK RECEIVED ===');
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  const rawBody = (req as any).rawBody;
  console.log('Raw body type:', rawBody ? (Buffer.isBuffer(rawBody) ? 'Buffer' : typeof rawBody) : 'undefined');
  console.log('Raw body length:', rawBody ? rawBody.length : 'N/A');
  console.log('Req body type:', req.body ? (Buffer.isBuffer(req.body) ? 'Buffer' : typeof req.body) : 'undefined');

  // Parse the raw buffer to JSON for route handlers, ONLY if it's a buffer
  // If it's already an object (pre-parsed by platform), leave it alone
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString('utf8'));
      console.log('Parsed body from buffer:', JSON.stringify(req.body, null, 2).substring(0, 500));
    } catch (e) {
      console.error('JSON parsing failed:', e);
      console.error('Raw body that failed:', req.body ? req.body.toString('utf8') : 'empty');
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  } else {
    console.log('Body already parsed or empty:', JSON.stringify(req.body, null, 2)?.substring(0, 500));
  }
  next();
});

// For all other routes, use standard JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add security headers to allow Google Sign-In popups
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log("Starting server initialization...");
    const server = await registerRoutes(app);
    console.log("Routes registered successfully.");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5001', 10);

    // Only start the server if this file is run directly
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      server.listen({
        port,
        host: "0.0.0.0",
        reusePort: process.platform !== 'win32', // Only enable on Linux (Firebase)
      }, () => {
        log(`serving on port ${port}`);
      });
    }
  } catch (err: any) {
    console.error("CRITICAL SERVER STARTUP ERROR:", err);
    process.exit(1);
  }
})();

export { app };
