import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle chunk loading failures (happens after new deployments when cached HTML references old chunks)
window.addEventListener('error', (event) => {
    // Check if it's a chunk loading error
    if (
        event.message?.includes('Failed to fetch dynamically imported module') ||
        event.message?.includes('Loading chunk') ||
        event.message?.includes('Loading CSS chunk')
    ) {
        console.warn('Chunk loading failed, reloading page to get latest version...');
        // Clear the error and reload
        event.preventDefault();
        window.location.reload();
    }
});

// Also handle unhandled promise rejections (dynamic imports throw these)
window.addEventListener('unhandledrejection', (event) => {
    if (
        event.reason?.message?.includes('Failed to fetch dynamically imported module') ||
        event.reason?.message?.includes('Failed to load module script')
    ) {
        console.warn('Dynamic import failed, reloading page...');
        event.preventDefault();
        window.location.reload();
    }
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

createRoot(document.getElementById("root")!).render(<App />);
