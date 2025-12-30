import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Lock, CheckCircle2, Sparkles, Trophy, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const ConfettiPiece = ({ delay, x }: { delay: number; x: number }) => (
    <motion.div
        initial={{ y: 0, opacity: 1, scale: 1 }}
        animate={{ y: 300, opacity: 0, scale: 0.5, rotate: 360 }}
        transition={{ duration: 1.5, delay }}
        className="absolute w-3 h-3 rounded-full"
        style={{
            left: `${x}%`,
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'][Math.floor(Math.random() * 5)]
        }}
    />
);

const Confetti = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiPiece key={i} delay={i * 0.05} x={10 + (i * 4)} />
        ))}
    </div>
);

export function DetoxChallenge() {
    const { t } = useLanguage();
    const [showConfetti, setShowConfetti] = useState(false);
    const [completedToday, setCompletedToday] = useState(false);

    const { data: user } = useQuery<User>({
        queryKey: ['/api/user'],
    });

    if (!user?.detoxStartDate) return null;

    // Safely parse the date and handle invalid values
    const startDate = user.detoxStartDate ? new Date(user.detoxStartDate) : null;
    const isValidDate = startDate && !isNaN(startDate.getTime());

    const today = new Date();
    const daysSinceStart = isValidDate ? differenceInCalendarDays(today, startDate) : 0;
    const currentDay = Math.min(Math.max(1, daysSinceStart + 1), 7);
    const isLocked = currentDay > 3 && !user.isDigitalDetoxCustomer;

    const detoxContent: Record<number, { title: string; desc: string; icon: any }> = {
        1: { title: t.mental_health?.day_1_mission || "Phone Fasting", desc: t.mental_health?.day_1_desc || "No phone for the first hour after waking up.", icon: Zap },
        2: { title: t.mental_health?.day_2_mission || "Notification Purge", desc: t.mental_health?.day_2_desc || "Disable all non-essential app notifications.", icon: ShieldCheck },
        3: { title: t.mental_health?.day_3_mission || "Greyscale Mode", desc: t.mental_health?.day_3_desc || "Turn your phone screen black and white.", icon: ShieldCheck },
        4: { title: t.mental_health?.day_4_mission || "The Dopamine Reset", desc: t.mental_health?.day_4_desc || "Spend 24 hours fully offline.", icon: Trophy },
        5: { title: t.mental_health?.day_5_mission || "Mindful Re-entry", desc: t.mental_health?.day_5_desc || "Set app time limits before going back online.", icon: ShieldCheck },
        6: { title: t.mental_health?.day_6_mission || "Digital Sunday", desc: t.mental_health?.day_6_desc || "Establish a weekly tech-free day.", icon: ShieldCheck },
        7: { title: t.mental_health?.day_7_mission || "Mastery", desc: t.mental_health?.day_7_desc || "Congratulations! You've built new habits.", icon: Trophy },
    };

    const todayContent = detoxContent[currentDay] || detoxContent[1];
    const IconComponent = todayContent.icon;

    const handleComplete = () => {
        setShowConfetti(true);
        setCompletedToday(true);
        setTimeout(() => setShowConfetti(false), 2000);
    };

    const dayLabel = t.mental_health?.day_label || "Day";
    const progressLabel = t.mental_health?.progress_label || "Progress";

    return (
        <div className="space-y-6 relative">
            <AnimatePresence>
                {showConfetti && <Confetti />}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        {t.mental_health?.detox_title || "7-Day Detox"}
                    </h2>
                    <p className="text-muted-foreground">
                        {dayLabel} {currentDay} {t.mental_health?.of_label || "of"} 7 • {user.isDigitalDetoxCustomer ? (t.mental_health?.full_access || "Full Access") : (t.mental_health?.free_trial || "Free Trial")}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{progressLabel}</span>
                    <span className="font-medium">{Math.round((currentDay / 7) * 100)}%</span>
                </div>
                <Progress value={(currentDay / 7) * 100} className="h-3" />
            </div>

            {/* Day Cards */}
            <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                    const isCompleted = day < currentDay;
                    const isCurrent = day === currentDay;
                    const isLockedDay = day > 3 && !user.isDigitalDetoxCustomer;

                    return (
                        <motion.div
                            key={day}
                            whileHover={{ scale: isCurrent ? 1.05 : 1 }}
                            className={`
                                rounded-xl p-3 text-center border-2 transition-all cursor-default
                                ${isCurrent
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/10'
                                    : 'border-border'
                                }
                                ${isCompleted ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}
                                ${isLockedDay && !isCompleted ? 'bg-muted/50 opacity-60' : ''}
                            `}
                        >
                            <div className="text-xs text-muted-foreground mb-1">{dayLabel}</div>
                            <div className={`text-lg font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                                {day}
                            </div>
                            <div className="h-5 mt-1">
                                {isLockedDay && !isCompleted && <Lock className="h-4 w-4 mx-auto text-amber-500" />}
                                {isCompleted && <CheckCircle2 className="h-4 w-4 mx-auto text-green-500" />}
                                {isCurrent && !completedToday && <div className="h-2 w-2 rounded-full bg-emerald-500 mx-auto animate-pulse" />}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Today's Mission Card */}
            <Card className={`
                border-2 overflow-hidden
                ${isLocked
                    ? 'border-amber-300 dark:border-amber-700'
                    : completedToday
                        ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                        : 'border-emerald-200 dark:border-emerald-800'
                }
            `}>
                {!isLocked && (
                    <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                )}
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${isLocked ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                            {isLocked
                                ? <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                : <IconComponent className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            }
                        </div>
                        <div>
                            <CardTitle className="text-xl">
                                {isLocked ? (t.mental_health?.locked_day || "Day Locked") : todayContent.title}
                            </CardTitle>
                            {!isLocked && (
                                <CardDescription>{t.mental_health?.todays_mission || "Today's Mission"}</CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLocked ? (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                {t.mental_health?.unlock_desc || "Unlock the full 7-day program to continue your transformation."}
                            </p>
                            <Button className="w-full h-12 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                                <Sparkles className="mr-2 h-5 w-5" />
                                {t.mental_health?.unlock_full || "Unlock Full Detox"}
                            </Button>
                        </div>
                    ) : completedToday ? (
                        <div className="text-center py-4">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
                            <p className="text-lg font-medium text-green-700 dark:text-green-300">
                                {t.mental_health?.mission_accomplished || "Mission Accomplished!"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t.mental_health?.come_back_tomorrow || "Come back tomorrow for Day"} {currentDay + 1}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-lg leading-relaxed">{todayContent.desc}</p>
                            <Button
                                onClick={handleComplete}
                                className="w-full h-12 text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t.mental_health?.complete_mission || "Complete Today's Mission"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
