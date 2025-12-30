import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

type TimerState = 'idle' | 'focus' | 'break';

export function FocusTimer() {
    const { t } = useLanguage();
    const [state, setState] = useState<TimerState>('idle');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const FOCUS_DURATION = 25 * 60;
    const BREAK_DURATION = 5 * 60;

    useEffect(() => {
        if (state === 'idle') return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (state === 'focus') {
                        setState('break');
                        return BREAK_DURATION;
                    } else {
                        setState('idle');
                        return FOCUS_DURATION;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setState('focus');
        setTimeLeft(FOCUS_DURATION);
        if (audioRef.current && !isMuted) {
            audioRef.current.volume = 0.2;
            audioRef.current.play().catch(() => { });
        }
    };

    const handlePause = () => {
        setState('idle');
        audioRef.current?.pause();
    };

    const handleReset = () => {
        setState('idle');
        setTimeLeft(FOCUS_DURATION);
        audioRef.current?.pause();
    };

    const progress = state === 'focus'
        ? ((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100
        : state === 'break'
            ? ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100
            : 0;

    return (
        <Card className="overflow-hidden">
            <audio
                ref={audioRef}
                src="https://www.creativewaves.me/mp3files/sleep/2.mp3"
                loop
            />
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${state === 'break' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                            {state === 'break'
                                ? <Coffee className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                : <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            }
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                {t.mental_health?.focus_timer || "Focus Timer"}
                            </CardTitle>
                            <CardDescription>
                                {state === 'break'
                                    ? (t.mental_health?.take_break || "Break Time")
                                    : state === 'focus'
                                        ? (t.mental_health?.focus_session || "Stay Focused")
                                        : (t.mental_health?.pomodoro || "Pomodoro Technique")
                                }
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Timer Display */}
                <div className="relative flex items-center justify-center py-8">
                    <svg className="absolute w-48 h-48" viewBox="0 0 100 100">
                        <circle
                            className="text-muted stroke-current"
                            strokeWidth="4"
                            fill="none"
                            cx="50"
                            cy="50"
                            r="45"
                        />
                        <motion.circle
                            className={`stroke-current ${state === 'break' ? 'text-amber-500' : 'text-blue-500'}`}
                            strokeWidth="4"
                            fill="none"
                            cx="50"
                            cy="50"
                            r="45"
                            strokeLinecap="round"
                            strokeDasharray={283}
                            strokeDashoffset={283 - (283 * progress / 100)}
                            transform="rotate(-90 50 50)"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * progress / 100) }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <div className="text-center z-10">
                        <div className={`text-5xl font-mono font-bold ${state === 'break' ? 'text-amber-600' : state === 'focus' ? 'text-blue-600' : 'text-foreground'}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {state === 'focus'
                                ? (t.mental_health?.focus_session || "Focus Session")
                                : state === 'break'
                                    ? (t.mental_health?.take_break || "Take a Break")
                                    : (t.mental_health?.timer_ready || "Ready?")
                            }
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                    {state === 'idle' ? (
                        <Button
                            onClick={handleStart}
                            className="w-32 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            {t.mental_health?.start_focus || "Start"}
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handlePause}>
                                <Pause className="mr-2 h-4 w-4" />
                                {t.mental_health?.pause || "Pause"}
                            </Button>
                            <Button variant="ghost" onClick={handleReset}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                {t.mental_health?.reset || "Reset"}
                            </Button>
                        </>
                    )}
                </div>

                {/* Tips */}
                {state === 'idle' && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>{t.mental_health?.timer_tip || "25 min focus • 5 min break • Repeat"}</p>
                    </div>
                )}
                {state === 'break' && (
                    <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            {t.mental_health?.break_time || "Time for a break! Stretch, hydrate, or listen to theta waves."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
