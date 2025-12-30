import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import { registerRoutes } from "../../server/routes";
import "../../server/auth"; // Ensure auth is set up
// Create Express app
const app = express();
// Middleware setup (from server/index.ts)
app.use('/api/webhook/*', express.raw({ type: 'application/json' }), (req, res, next) => {
    req.rawBody = req.body;
    try {
        req.body = JSON.parse(req.body.toString('utf8'));
    }
    catch (e) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Initialize routes
let routesInitialized = false;
let initializationPromise = null;
async function ensureRoutesInitialized() {
    if (routesInitialized)
        return;
    if (initializationPromise) {
        await initializationPromise;
        return;
    }
    initializationPromise = (async () => {
        // Type assertion to handle Express type differences between packages
        await registerRoutes(app);
        app.use((err, _req, res, _next) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";
            res.status(status).json({ message });
            console.error('Error:', err);
        });
        routesInitialized = true;
        console.log('Routes initialized for Firebase Functions');
    })();
    await initializationPromise;
}
// Export the Express app as a Firebase Cloud Function
// Wrap in a handler that ensures routes are initialized
export const api = onRequest(async (req, res) => {
    await ensureRoutesInitialized();
    app(req, res);
});
//# sourceMappingURL=index.js.map