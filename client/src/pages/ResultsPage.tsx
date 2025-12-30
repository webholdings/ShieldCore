import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ShieldAlert, ShieldCheck, ArrowRight, Lock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type Breach = {
    domain: string;
    date: string;
    description: string;
    dataClasses: string[];
};

type ScanResult = {
    score: number;
    breaches: Breach[];
    safeCount: number;
};

export default function ResultsPage() {
    const [results, setResults] = useState<ScanResult | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("latest_scan_results");
        if (data) {
            setResults(JSON.parse(data));
        }
    }, []);

    if (!results) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-muted-foreground">No scan results found. <Link href="/scan" className="underline">Run a scan first.</Link></p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Scan Results</h1>
                    <p className="text-muted-foreground">Analysis complete for your profile.</p>
                </div>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Summary Cards */}
                <Card className="md:col-span-1 border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-red-500 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" /> Compromised
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{results.breaches.length}</div>
                        <p className="text-sm text-muted-foreground">Sites where your data was found</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-green-500 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" /> Secure
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{results.safeCount}</div>
                        <p className="text-sm text-muted-foreground">Monitored accounts appearing safe</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-blue-500 flex items-center gap-2">
                            <Lock className="h-5 w-5" /> Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{results.score}/100</div>
                        <p className="text-sm text-muted-foreground">Overall security rating</p>
                    </CardContent>
                </Card>
            </div>

            {/* Breach Timeline */}
            <h2 className="text-xl font-bold mt-8">Breach Timeline</h2>
            {results.breaches.length > 0 ? (
                <div className="space-y-4">
                    {results.breaches.map((breach, idx) => (
                        <Card key={idx} className="border-red-100 dark:border-red-900/20 shadow-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{breach.domain}</CardTitle>
                                    <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{breach.date}</span>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {breach.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {breach.dataClasses.map((cls, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full font-medium">
                                            {cls}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <Button size="sm" variant="default" className="bg-red-600 hover:bg-red-700">Change Password</Button>
                                    <Button size="sm" variant="outline" className="text-muted-foreground">Ignore</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-300">Clean Record</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                        Great job! No breaches were found for your accounts in our database.
                    </AlertDescription>
                </Alert>
            )}

            {/* Recommendations */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Recommendations</h2>
                <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg dark:bg-blue-900/30 dark:text-blue-300">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">Enable Two-Factor Authentication</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                You have 3 accounts that support 2FA but might not have it enabled. This stops 99% of attacks.
                            </p>
                            <Button variant="ghost" className="px-0 mt-2 h-auto underline">View Guide <ExternalLink className="ml-1 h-3 w-3" /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
