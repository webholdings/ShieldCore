import "dotenv/config";
import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import { registerRoutes } from "../../server/routes";
import "../../server/auth"; // Ensure auth is set up

// Create Express app
const app = express();

// CORS middleware for webhooks - MUST be before body parsing
// CORS middleware for webhooks - MUST be before body parsing
app.use(['/api/webhook/*', '/webhook/*'], (req, res, next) => {
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

// Middleware setup (from server/index.ts)
// Middleware setup (from server/index.ts)
app.use(['/api/webhook/*', '/webhook/*'], express.raw({ type: 'application/json' }), (req, res, next) => {
    // Store raw body for potential signature verification
    (req as any).rawBody = req.body;

    // If body is already parsed (Firebase Functions auto-parsing), skip
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        next();
        return;
    }

    // Parse Buffer to JSON
    if (Buffer.isBuffer(req.body)) {
        try {
            req.body = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON' });
        }
    }

    next();
});

// Use express.json() for all routes EXCEPT webhooks (which are handled above)
app.use((req, res, next) => {
    if (req.path.startsWith('/api/webhook/') || req.path.startsWith('/webhook/')) {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(express.urlencoded({ extended: false }));

// Initialize routes
let routesInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function ensureRoutesInitialized() {
    if (routesInitialized) return;

    if (initializationPromise) {
        await initializationPromise;
        return;
    }

    initializationPromise = (async () => {
        // Type assertion to handle Express type differences between packages
        await registerRoutes(app as any);

        app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
export const api = onRequest({
    region: "us-central1",
    invoker: "public",
    secrets: ["OPENROUTER_API_KEY"]
}, async (req, res) => {
    console.log(`[API] Request received: ${req.method} ${req.url}`);
    console.log(`[API] Path: ${req.path}`);

    try {
        await ensureRoutesInitialized();
    } catch (error) {
        console.error('[API] Failed to initialize routes:', error);
        res.status(500).json({ error: 'Internal Server Error', details: 'Route initialization failed' });
        return;
    }

    app(req, res);
});

// Add a simple ping route for diagnostics (handle both /api/ping and /ping)
app.get(['/api/ping', '/ping'], (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        debug: {
            url: req.url,
            originalUrl: req.originalUrl,
            path: req.path,
            baseUrl: req.baseUrl,
            method: req.method
        }
    });
});

// Add a simple ping route for diagnostics
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// Export scheduled cleanup function
export { cleanupQuizResults } from "./cleanupQuizResults";

// Export scheduled breach scan function
export { scheduledBreachScan } from "./triggers/scheduled-scan";
