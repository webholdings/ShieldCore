import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Play, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

export default function SecurityDashboard() {
    const { user } = useAuth();
    // TODO: Fetch real score from backend/local storage
    const [score, setScore] = useState<number | null>(null);
    const [alerts, setAlerts] = useState([
        { id: 1, title: "email@example.com in 2024 Breach", type: "critical" },
        { id: 2, title: "Weak password detected on site.net", type: "warning" },
    ]);

    // Simulate fetching score
    useEffect(() => {
        const savedScore = localStorage.getItem("shieldcore_score");
        if (savedScore) {
            setScore(parseInt(savedScore));
        }
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary">Security Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Overview of your digital security posture.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Score Card */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-1 border-primary/20 bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Security Score</CardTitle>
                        <CardDescription>Real-time threat assessment</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        {score !== null ? (
                            <div className="text-center space-y-4">
                                <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                                    {score}
                                </div>
                                <Progress value={score} className="w-[80%]" />
                                <p className="text-sm text-muted-foreground">
                                    Last updated: Just now
                                </p>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <Shield className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
                                <p className="text-muted-foreground">No score calculated yet.</p>
                                <Link href="/security-checkup">
                                    <Button className="w-full">
                                        <Play className="mr-2 h-4 w-4" /> Start Checkup
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Alerts Feed */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Active Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.length > 0 ? (
                            <ul className="space-y-4">
                                {alerts.map((alert) => (
                                    <li key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        {alert.type === "critical" ? (
                                            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{alert.title}</p>
                                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs underline">
                                                View Details
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                <p>No active alerts</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/scan">
                            <Button variant="outline" className="w-full justify-between h-auto py-4">
                                <span className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-primary" />
                                    Run Breach Scan
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/security-checkup">
                            <Button variant="outline" className="w-full justify-between h-auto py-4">
                                <span className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Update Checkup
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div className="pt-2 border-t mt-2">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 font-medium">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    Continuous Monitoring
                                </span>
                                {/* In a real app, this would be a Switch component wired to backend */}
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">ACTIVE</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                We automatically scan your email daily for new breaches.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
