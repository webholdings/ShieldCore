
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Moon, Brain, Lightbulb, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSleepProgramContent } from "@/data/sleepProgram";
import { SleepProgramProgress } from "@shared/schema";

interface SleepProgramCardProps {
    programProgress: SleepProgramProgress | undefined;
}

export function SleepProgramCard({ programProgress }: SleepProgramCardProps) {
    const { t } = useLanguage();
    const completedDays = programProgress?.completedDays || [];
    const currentDay = Math.min(completedDays.length + 1, 7);
    const dayContent = getSleepProgramContent(t);
    const today = dayContent[currentDay as keyof typeof dayContent] || dayContent[7];
    const isProgramComplete = completedDays.length >= 7;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Moon className="h-6 w-6 text-indigo-500" />
                    {t.sleep?.program_progress || "7-Day Sleep Reset"}
                </h2>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {completedDays.length}/7 {t.sleep?.days_complete || "days complete"}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 px-1">
                <Progress
                    value={(completedDays.length / 7) * 100}
                    className="h-2 rounded-full bg-indigo-100 dark:bg-indigo-950"
                />
            </div>

            <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl overflow-hidden relative group hover:border-indigo-400 transition-colors">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
                <div className="absolute top-0 right-0 p-4 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] w-full h-full pointer-events-none"></div>

                <CardContent className="pt-8 pb-8 px-6 md:px-10 relative z-10">
                    {isProgramComplete ? (
                        <div className="text-center py-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">{t.sleep?.congrats || "Congratulations!"}</h3>
                            <p className="text-muted-foreground">{t.sleep?.complete_msg || "You've completed the sleep reset program."}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {t.sleep?.today || "TODAY"}
                                        </span>
                                        <span className="text-sm text-muted-foreground font-medium">Day {currentDay}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                                        {today.title}
                                    </h3>
                                </div>
                                <Link href="/sleep-plan">
                                    <Button size="lg" className="w-full md:w-auto text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse-soft">
                                        <Brain className="mr-2 h-5 w-5" />
                                        {t.sleep?.start_task || "Start Task"}
                                    </Button>
                                </Link>
                            </div>

                            <div className="bg-muted/30 p-5 rounded-xl border border-muted-foreground/10">
                                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">{t.sleep?.focus || "Focus"}</h4>
                                <p className="text-lg font-medium leading-relaxed">{today.focus}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex gap-3">
                                    <div className="mt-1 bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full h-fit">
                                        <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <strong className="block text-amber-700 dark:text-amber-500 mb-1">{t.sleep?.protocol || "Protocol"}</strong>
                                        <span className="text-muted-foreground">{today.protocol}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1 bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full h-fit">
                                        <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <strong className="block text-blue-700 dark:text-blue-500 mb-1">{t.sleep?.exercise || "Exercise"}</strong>
                                        <span className="text-muted-foreground">{today.exercise}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
