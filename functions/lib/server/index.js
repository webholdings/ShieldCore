import "dotenv/config";
import express from "express";
import { fileURLToPath } from 'url';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { log } from "./log";
const app = express();
// For webhook endpoints, capture raw body for signature verification
app.use('/api/webhook/*', express.raw({ type: 'application/json' }), (req, res, next) => {
    // Store raw body for signature verification
    req.rawBody = req.body;
    // Log webhook details for debugging
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Path:', req.path);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw body length:', req.body ? req.body.length : 'no body');
    console.log('Raw body preview:', req.body ? req.body.toString('utf8').substring(0, 200) : 'empty');
    // Parse the raw buffer to JSON for route handlers
    try {
        req.body = JSON.parse(req.body.toString('utf8'));
        console.log('Parsed body:', JSON.stringify(req.body, null, 2).substring(0, 500));
    }
    catch (e) {
        console.error('JSON parsing failed:', e);
        console.error('Raw body that failed:', req.body ? req.body.toString('utf8') : 'empty');
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
});
// For all other routes, use standard JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
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
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
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
    }
    else {
        serveStatic(app);
    }
    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    // Only start the server if this file is run directly
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
        server.listen({
            port,
            host: "0.0.0.0",
            reusePort: true,
        }, () => {
            log(`serving on port ${port}`);
        });
    }
})();
export { app };
//# sourceMappingURL=index.js.map