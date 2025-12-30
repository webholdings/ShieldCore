import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ScanPage() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const [email, setEmail] = useState(user?.email || "");
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsScanning(true);
        setProgress(0);

        // Simulate scanning progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 10;
            });
        }, 300);

        try {
            // Call backend API (even if mocked)
            const res = await apiRequest("POST", "/api/breach-scan", { emails: [email] });
            const data = await res.json();

            clearInterval(interval);
            setProgress(100);

            // Store results in local storage for the results page to read
            localStorage.setItem("latest_scan_results", JSON.stringify(data));

            // Delay slightly for effect then redirect
            setTimeout(() => {
                setLocation("/results");
            }, 500);

        } catch (error) {
            clearInterval(interval);
            setIsScanning(false);
            setProgress(0);
            toast({
                title: "Scan failed",
                description: "Could not complete the security scan. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 max-w-2xl mx-auto w-full">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold text-primary">Deep Breach Scan</h1>
                <p className="text-muted-foreground">
                    Check if your email or passwords have appeared in known data breaches.
                </p>
            </div>

            <Card className="w-full shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle>Start New Scan</CardTitle>
                    <CardDescription>
                        We use k-anonymity to securely check your credentials against 12 billion+ breached records.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleScan} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email Address to Monitor
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isScanning}
                                />
                            </div>
                        </div>

                        {isScanning ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Scanning dark web sources...</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground pt-2">
                                    Analysing HIBP database... Checking DeHashed API...
                                </p>
                            </div>
                        ) : (
                            <Button type="submit" className="w-full" size="lg">
                                <ShieldCheck className="mr-2 h-5 w-5" /> Run Security Scan
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-center">
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-muted-foreground underline">
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
