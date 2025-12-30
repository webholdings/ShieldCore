import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

            // Show prompt again after 7 days
            if (daysSinceDismissed < 7) {
                return;
            }
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show prompt after a delay to not interrupt initial experience
            setTimeout(() => setShowPrompt(true), 5000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
        setShowPrompt(false);
    };

    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
            <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Install CreativeWaves
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Install our app for a better experience with offline access and faster loading.
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleInstall}
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Install
                                </Button>
                                <Button
                                    onClick={handleDismiss}
                                    size="sm"
                                    variant="outline"
                                >
                                    Not now
                                </Button>
                            </div>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
