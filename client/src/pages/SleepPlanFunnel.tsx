import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    CheckCircle2,
    Moon,
    Sun,
    Wind,
    Music,
    ChevronRight,
    Play,
    Pause,
    Square
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import type { SleepProgramProgress, User, SleepEntry } from "@shared/schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Chronotype data
const CHRONOTYPES = [
    {
        id: "bear",
        icon: "🐻",
        titleKey: "bear_title",
        descKey: "bear_desc",
        defaultTitle: "The Bear",
        defaultDesc: "You follow the sun. Best sleep: 11pm - 7am. Most productive: mid-morning."
    },
    {
        id: "wolf",
        icon: "🐺",
        titleKey: "wolf_title",
        descKey: "wolf_desc",
        defaultTitle: "The Wolf",
        defaultDesc: "Night owl. Best sleep: 12am - 8am+. Most productive: late afternoon/evening."
    },
    {
        id: "lion",
        icon: "🦁",
        titleKey: "lion_title",
        descKey: "lion_desc",
        defaultTitle: "The Lion",
        defaultDesc: "Early riser. Best sleep: 10pm - 6am. Most productive: early morning."
    },
    {
        id: "dolphin",
        icon: "🐬",
        titleKey: "dolphin_title",
        descKey: "dolphin_desc",
        defaultTitle: "The Dolphin",
        defaultDesc: "Light sleeper/Insomniac. Irregular schedule. Best Productive bursts."
    }
];

// Mini Breathing Component
const MiniBreathing = ({ onComplete, t }: { onComplete: () => void; t: any }) => {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready');
    const [timeLeft, setTimeLeft] = useState(3);
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prev: number) => {
                    if (prev <= 1) {
                        // Switch phase
                        if (phase === 'ready') {
                            setPhase('inhale');
                            return 4;
                        } else if (phase === 'inhale') {
                            setPhase('hold');
                            return 7;
                        } else if (phase === 'hold') {
                            setPhase('exhale');
                            return 8;
                        } else if (phase === 'exhale') {
                            setCycles((c: number) => {
                                const newC = c + 1;
                                if (newC >= 2) { // Complete after 2 cycles for demo
                                    setIsActive(false);
                                    onComplete();
                                }
                                return newC;
                            });
                            setPhase('inhale');
                            return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, phase, onComplete]);

    const handleStart = () => {
        setIsActive(true);
        setPhase('ready');
        setTimeLeft(3);
    };

    const getPhaseText = () => {
        if (phase === 'ready') return t.sleep?.breathing_ready || "Ready?";
        if (phase === 'inhale') return t.sleep?.breathing_inhale || "Inhale";
        if (phase === 'hold') return t.sleep?.breathing_hold || "Hold";
        if (phase === 'exhale') return t.sleep?.breathing_exhale || "Exhale";
        return "";
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${phase === 'inhale' ? 'scale-110 border-blue-500 bg-blue-100 dark:bg-blue-900/40' :
                phase === 'hold' ? 'scale-110 border-purple-500 bg-purple-100 dark:bg-purple-900/40' :
                    phase === 'exhale' ? 'scale-100 border-green-500 bg-green-100 dark:bg-green-900/40' :
                        'border-gray-300'
                }`}>
                <div className="text-center">
                    <div className="text-2xl font-bold capitalize mb-1">
                        {getPhaseText()}
                    </div>
                    {isActive && <div className="text-4xl font-mono">{timeLeft}</div>}
                </div>
            </div>
            {!isActive && cycles === 0 && (
                <Button onClick={handleStart} className="mt-6 rounded-full px-8" size="lg">
                    {t.sleep?.start_breathing || "Start Breathing"}
                </Button>
            )}
            {!isActive && cycles > 0 && (
                <div className="mt-6 text-green-600 font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6" /> {t.sleep?.well_done || "Well done!"}
                </div>
            )}
        </div>
    );
};

export default function SleepPlanFunnel() {
    const [, setLocation] = useLocation();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const [step, setStep] = useState(0);
    const [selectedChronotype, setSelectedChronotype] = useState<string | null>(null);

    // Determine time of day
    const hour = new Date().getHours();
    const isMorning = hour >= 5 && hour < 12;
    const isEvening = hour >= 18 || hour < 5;
    const greeting = isMorning
        ? (t.common?.good_morning || "Good Morning")
        : isEvening
            ? (t.common?.good_evening || "Good Evening")
            : (t.common?.hello || "Hello");

    // Fetch Data
    const { data: user, isLoading: userLoading } = useQuery<User>({ queryKey: ["/api/user"] });
    const { data: progress, isLoading: progressLoading } = useQuery<SleepProgramProgress>({ queryKey: ["/api/sleep-progress"] });
    const { data: sleepEntries = [] } = useQuery<SleepEntry[]>({ queryKey: ['/api/sleep-entries'] });

    // Check if sleep is logged for today (using local date)
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    const isSleepLogged = sleepEntries.some((e: SleepEntry) => e.date === todayStr); // Assuming date stored as YYYY-MM-DD

    const completedDays = progress?.completedDays || [];
    const currentDay = Math.min(completedDays.length + 1, 7);
    const dayContent = getDayContent(currentDay, t);

    // Initial Chronotype Check
    useEffect(() => {
        if (user?.chronotype) setSelectedChronotype(user.chronotype);
    }, [user]);

    const updateChronotypeMutation = useMutation({
        mutationFn: async (type: string) => apiRequest("PATCH", "/api/user/chronotype", { chronotype: type }),
        onSuccess: (_data: any, type: string) => {
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        },
    });

    if (userLoading || progressLoading) {
        return <div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    // --- Dynamic Steps Construction ---
    const steps = [];

    // Step 0: Welcome / Context
    steps.push({
        id: "intro",
        render: () => (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg ${isMorning ? 'bg-orange-100 text-orange-500' : 'bg-indigo-100 text-indigo-500'}`}>
                    {isMorning ? <Sun className="w-10 h-10" /> : <Moon className="w-10 h-10" />}
                </div>
                <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{greeting}</span>
                    <h1 className="text-3xl font-bold">{t.sleep?.day_word || "Day"} {currentDay}: {dayContent.title}</h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {isMorning
                        ? (t.sleep?.morning_prompt || "Let's review your plan for the day and set you up for success.")
                        : (t.sleep?.evening_prompt || "Time to wind down? Let's prepare your mind and body for rest.")
                    }
                </p>

                {/* Status Card */}
                {!isSleepLogged && isMorning && (
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 flex items-center gap-4 text-left max-w-md mx-auto">
                        <div className="bg-white dark:bg-black/20 p-2 rounded-full"><Moon className="h-5 w-5 text-orange-500" /></div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-orange-800 dark:text-orange-200">{t.sleep?.log_reminder || "You haven't logged last night's sleep."}</p>
                            <Link href="/sleep?tab=log" className="text-xs underline text-orange-600 dark:text-orange-400 hover:text-orange-800">{t.sleep?.log_now || "Log now"}</Link>
                        </div>
                    </div>
                )}

                <Button size="lg" className="mt-8 px-10 py-6 text-lg rounded-full shadow-lg" onClick={nextStep}>
                    {t.common?.start || "Begin Session"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        )
    });

    // Step 1: Chronotype (Required on Day 1 if missing)
    if (currentDay === 1 && !user?.chronotype) {
        steps.push({
            id: "chronotype",
            render: () => (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">{t.sleep?.chronotype_question || "What is your sleep animal?"}</h2>
                        <p className="text-muted-foreground">{t.sleep?.chronotype_question_sub || "Knowing your chronotype helps us tailor your schedule."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CHRONOTYPES.map((type) => (
                            <Card
                                key={type.id}
                                className={`cursor-pointer transition-all hover:scale-105 ${selectedChronotype === type.id ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                                onClick={() => setSelectedChronotype(type.id)}
                            >
                                <CardContent className="p-4 flex flex-col items-center text-center h-full">
                                    <span className="text-4xl mb-3">{type.icon}</span>
                                    <h3 className="font-bold text-lg mb-1">{t.sleep?.[type.titleKey as keyof typeof t.sleep] || type.defaultTitle}</h3>
                                    <p className="text-xs text-muted-foreground">{t.sleep?.[type.descKey as keyof typeof t.sleep] || type.defaultDesc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button size="lg" disabled={!selectedChronotype} onClick={() => { if (selectedChronotype) { updateChronotypeMutation.mutate(selectedChronotype); nextStep(); } }} className="px-8">
                            {t.common?.continue || "Continue"}
                        </Button>
                    </div>
                </div>
            )
        });
    }

    // Step 2: The Lesson (Always relevant)
    steps.push({
        id: "lesson",
        render: () => (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                    <Brain className="h-5 w-5" />
                    <span className="font-bold uppercase tracking-wider text-sm">{t.sleep?.todays_lesson || "Today's Insight"}</span>
                </div>
                <h2 className="text-3xl font-bold">{dayContent.science_title || t.sleep?.science || "The Science"}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                    {dayContent.science}
                </p>
                <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800">
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-white dark:bg-black/20 p-2 rounded-lg mt-1"><CheckCircle2 className="h-5 w-5 text-indigo-600" /></div>
                        <div>
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">{t.sleep?.key_takeaway || "Key Takeaway"}</h3>
                            <p className="text-indigo-800 dark:text-indigo-300 text-sm">{dayContent.focus}</p>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-center pt-6">
                    <Button size="lg" onClick={nextStep} className="px-8 py-6 rounded-full w-full md:w-auto">
                        {t.common?.next || "Next Step"} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    });

    // Step 3: Interactive Tool (Context Aware)
    // If it's Day 4 (Relaxation) or generic Evening -> Show Relaxation Tool
    if (currentDay === 4 || isEvening) {
        steps.push({
            id: "tool",
            render: () => (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto text-center">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Wind className="h-6 w-6 text-blue-500" />
                        {t.sleep?.evening_winddown || "Evening Wind-down"}
                    </h2>
                    <p className="text-muted-foreground">
                        {currentDay === 4
                            ? (t.sleep?.day4_exercise_prompt || "Let's practice the 4-7-8 breathing technique together.")
                            : (t.sleep?.relax_prompt || "Take a moment to center yourself before bed.")}
                    </p>

                    {/* Embedded Mini Breathing */}
                    <MiniBreathing onComplete={() => setTimeout(nextStep, 1000)} t={t} />

                    <Button variant="ghost" onClick={nextStep} className="text-muted-foreground hover:text-foreground">
                        {t.common?.skip || "Skip for now"}
                    </Button>
                </div>
            )
        });
    }

    // Step 4: Outro
    steps.push({
        id: "outro",
        render: () => (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-lg mx-auto">
                <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{t.sleep?.task_complete || "Session Complete!"}</h1>
                    <p className="text-xl text-muted-foreground">
                        {isMorning
                            ? (t.sleep?.morning_outro || "Have a productive day. Remember your sleep protocol tonight.")
                            : (t.sleep?.evening_outro || "Sleep well. Don't forget to keep your bedroom cool and dark.")
                        }
                    </p>
                </div>

                <Card className="text-left bg-muted/30 border-none">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center"><Moon className="h-6 w-6 text-indigo-600" /></div>
                        <div>
                            <div className="font-bold text-sm">{t.sleep?.tonights_protocol || "Tonight's Protocol"}</div>
                            <div className="text-sm text-muted-foreground">{dayContent.protocol}</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                    <Link href="/sleep">
                        <Button size="lg" className="w-full py-6 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                            {t.sleep?.return_dashboard || "Return to Dashboard"}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    });

    // Navigation
    const nextStep = () => {
        if (step < steps.length - 1) setStep(s => s + 1);
    };

    const currentStepData = steps[step];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className={`absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-20 ${isMorning ? 'bg-orange-500' : 'bg-indigo-500'}`} />
                <div className={`absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-20 ${isMorning ? 'bg-yellow-500' : 'bg-purple-500'}`} />
            </div>

            <div className="w-full max-w-4xl relative z-10">
                {/* Header Nav */}
                <div className="mb-12 flex items-center justify-between">
                    <Link href="/sleep">
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                            <ArrowLeft className="h-4 w-4" /> {t.common?.back || "Back"}
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? (isMorning ? 'w-8 bg-orange-500' : 'w-8 bg-indigo-500') : 'w-2 bg-muted'}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full"
                    >
                        {currentStepData.render()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// Data Helper
function getDayContent(day: number, t: any) {
    const dayContent: Record<number, any> = {
        1: {
            title: t.sleep?.day1_title || "Sleep Assessment",
            focus: t.sleep?.day1_focus || "Establish your baseline by logging tonight's sleep honestly.",
            science_title: t.sleep?.day1_science_title || "Understanding Your Rhythm",
            science: t.sleep?.day1_science || "To fix your sleep, we first need to understand it. Your body has an internal clock (circadian rhythm) and a sleep drive (homeostasis). We need to measure how these are working for you.",
            protocol: t.sleep?.day1_protocol || "Go to bed only when sleepy. Set a fixed wake time and stick to it.",
        },
        2: {
            title: t.sleep?.day2_title || "Sleep Restriction",
            focus: t.sleep?.day2_focus || "Quality over quantity. We compress your sleep window.",
            science_title: t.sleep?.day2_science_title || "The Power of Compression",
            science: t.sleep?.day2_science || "Paradoxically, spending too much time in bed causes insomnia. By matching your time in bed to your actual sleep time, we increase 'Sleep Pressure', making it easier to fall asleep.",
            protocol: t.sleep?.day2_protocol || "Set a fixed wake time. Only go to bed when truly sleepy. No naps.",
        },
        3: {
            title: t.sleep?.day3_title || "Stimulus Control",
            focus: t.sleep?.day3_focus || "Strengthen the bed-sleep connection.",
            science_title: t.sleep?.day3_science_title || "Retraining Your Brain",
            science: t.sleep?.day3_science || "Your brain has learned to associate the bed with being awake/worrying. We need to break this association through 'Stimulus Control' so the bed becomes a strong trigger for sleep.",
            protocol: t.sleep?.day3_protocol || "Use bed only for sleep. If awake > 20 min, get up.",
        },
        4: {
            title: t.sleep?.day4_title || "Relaxation Training",
            focus: t.sleep?.day4_focus || "De-arousal techniques for body and mind.",
            science_title: t.sleep?.day4_science_title || "Manual Override",
            science: t.sleep?.day4_science || "Physiological arousal (high heart rate, muscle tension) prevents sleep onset. Active relaxation techniques can manually lower this arousal state.",
            protocol: t.sleep?.day4_protocol || "Practice the 4-7-8 breathing technique before bed.",
        },
        5: {
            title: t.sleep?.day5_title || "Cognitive Restructuring",
            focus: t.sleep?.day5_focus || "Challenging sleep anxiety.",
            science_title: t.sleep?.day5_science_title || "Thinking About Sleep",
            science: t.sleep?.day5_science || "Thoughts like 'If I don't sleep I'll fail tomorrow' create performance anxiety, which destroys sleep. We use CBT to reframe these catastrophizing thoughts.",
            protocol: t.sleep?.day5_protocol || "Convert 'I must sleep' to 'Rest is good enough'.",
        },
        6: {
            title: t.sleep?.day6_title || "Sleep Hygiene",
            focus: t.sleep?.day6_focus || "Optimizing your environment.",
            science_title: t.sleep?.day6_science_title || "Setting the Stage",
            science: t.sleep?.day6_science || "Light, temperature, and noise are powerful biological cues. Darkness triggers melatonin; cooling triggers sleep onset.",
            protocol: t.sleep?.day6_protocol || "Keep bedroom cool (16-19°C), dark, and quiet. No caffeine after 2pm.",
        },
        7: {
            title: t.sleep?.day7_title || "Maintenance",
            focus: t.sleep?.day7_focus || "Sustainable habits for life.",
            science_title: t.sleep?.day7_science_title || "The New Normal",
            science: t.sleep?.day7_science || "Great sleep is a habit, not a destination. Maintain your fixed wake time and wind-down routine to prevent relapse.",
            protocol: t.sleep?.day7_protocol || "Continue logging to track efficiency.",
        }
    };
    return dayContent[day] || dayContent[7];
}
