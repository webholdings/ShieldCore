
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Shield, Loader2 } from "lucide-react";
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import { apiRequest } from "@/lib/queryClient";

export function MonitoringToggle() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    // In a real app, fetch initial state from backend

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true);
        try {
            if (checked) {
                // Request Notification Permission
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    throw new Error("Notification permission denied");
                }

                // Get FCM Token
                let token = "";
                if (messaging) {
                    try {
                        token = await getToken(messaging, {
                            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // Add this to env if using web push certificates
                        });
                    } catch (e) {
                        console.error("FCM Token Error", e);
                        // Continue without token if testing locally or on unsupported browser, 
                        // but warn user
                    }
                }

                // Call Backend
                await apiRequest("POST", "/api/monitor-emails", { enabled: true, fcmToken: token });

                toast({
                    title: "Monitoring Active",
                    description: "You will be notified of any new breaches.",
                });
                setIsEnabled(true);
            } else {
                // Disable
                await apiRequest("POST", "/api/monitor-emails", { enabled: false });
                toast({
                    title: "Monitoring Disabled",
                    description: "Daily scans paused.",
                });
                setIsEnabled(false);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update settings",
                variant: "destructive"
            });
            // Revert switch
            setIsEnabled(!checked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/20">
            <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                    <Shield className={`h-4 w-4 ${isEnabled ? "text-green-600" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">Daily Monitoring</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                    {isEnabled ? "Active: Scanning daily at 2AM" : "Enable to scan automatically"}
                </p>
            </div>
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
                <Switch
                    checked={isEnabled}
                    onCheckedChange={handleToggle}
                />
            )}
        </div>
    );
}
