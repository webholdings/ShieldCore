import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Headphones, Heart, Wind, Brain, CheckCircle2, Smile, CloudRain, Frown, Zap, RotateCcw, Play, Pause } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { MemoryGame } from '@/components/MemoryGame';
import { PatternGame } from '@/components/PatternGame';
import { WordGame } from '@/components/WordGame';
import { NumberGame } from '@/components/NumberGame';
import { VisualSearchGame } from '@/components/VisualSearchGame';
import { ReactionGame } from '@/components/ReactionGame';
import { ColorMatchGame } from '@/components/ColorMatchGame';
import { Game2048 } from '@/components/Game2048';
import { Card, CardContent } from '@/components/ui/card';

type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'energized';

const moodConfig = {
    happy: { icon: Smile, color: 'text-chart-5', bgColor: 'bg-chart-5/10', emoji: '😊' },
    calm: { icon: Wind, color: 'text-chart-1', bgColor: 'bg-chart-1/10', emoji: '😌' },
    anxious: { icon: CloudRain, color: 'text-chart-3', bgColor: 'bg-chart-3/10', emoji: '😰' },
    sad: { icon: Frown, color: 'text-chart-4', bgColor: 'bg-chart-4/10', emoji: '😢' },
    energized: { icon: Zap, color: 'text-chart-2', bgColor: 'bg-chart-2/10', emoji: '⚡' }
};

interface DailyPlan {
    date: string;
    thetaAudioCompleted: number;
    breathingCompleted: number;
    gameCompleted: number;
    moodCompleted: number;
    pointsAwarded?: number;
    newStreak?: number;
}

// List of available games for random selection
const AVAILABLE_GAMES = [
    'memory', 'pattern', 'word', 'number', 'visual', 'reaction', 'color', '2048'
];

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export default function DailyPlanFunnel() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [isPlayingGame, setIsPlayingGame] = useState(false);
    const [todaysGame, setTodaysGame] = useState<string | null>(null);

    // Audio player state
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioCompleted, setAudioCompleted] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Breathing exercise state
    const [isBreathingActive, setIsBreathingActive] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'prepare' | 'inhale' | 'hold' | 'exhale'>('prepare');
    const [breathingTimer, setBreathingTimer] = useState(0);
    const [breathingCycles, setBreathingCycles] = useState(0);

    const todayDate = getLocalDateString();

    const { data: dailyPlan, isLoading } = useQuery<DailyPlan>({
        queryKey: ['/api/daily-plan', { date: todayDate }],
        queryFn: () => apiRequest('GET', `/api/daily-plan?date=${todayDate}`).then(res => res.json()),
        enabled: !!user,
    });

    // Determine random game for the day based on date
    useEffect(() => {
        const today = new Date().toDateString();
        // Simple hash function to pick a game based on date string
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = today.charCodeAt(i) + ((hash << 5) - hash);
        }
        const gameIndex = Math.abs(hash) % AVAILABLE_GAMES.length;
        setTodaysGame(AVAILABLE_GAMES[gameIndex]);
    }, []);

    // Determine current step based on completion
    useEffect(() => {
        if (dailyPlan) {
            if (!dailyPlan.moodCompleted) setCurrentStep(1);
            else if (!dailyPlan.thetaAudioCompleted) setCurrentStep(2);
            else if (!dailyPlan.breathingCompleted) setCurrentStep(3);
            else if (!dailyPlan.gameCompleted) setCurrentStep(4);
            else setCurrentStep(5); // All completed
        }
    }, [dailyPlan]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const completeTaskMutation = useMutation({
        mutationFn: async ({ task, status }: { task: string, status?: 'completed' | 'skipped' }) => {
            const res = await apiRequest('POST', '/api/daily-plan/complete-task', {
                task,
                status,
                date: getLocalDateString()
            });
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
            queryClient.invalidateQueries({ queryKey: ['/api/user'] });

            if (data.pointsAwarded > 0) {
                toast({
                    title: t.dashboard.points_earned,
                    description: `+${data.pointsAwarded} ${t.dashboard.points}!`,
                });
            }

            if (data.newStreak) {
                toast({
                    title: t.dashboard.streak_updated,
                    description: (t.dashboard?.streak_updated_desc || "{days} day streak! 🔥").replace('{days}', String(data.newStreak)),
                });
            }
        },
    });

    const saveMoodMutation = useMutation({
        mutationFn: async (data: { mood: string; note: string }) => {
            if (!user) return;
            return await apiRequest('POST', '/api/mood', {
                mood: data.mood,
                note: data.note
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/mood'] });
            completeTaskMutation.mutate({ task: 'moodCompleted', status: 'completed' });
            toast({
                title: t.mood.save,
                description: `${t.mood[selectedMood!]} - ${new Date().toLocaleDateString()}`,
            });
            setSelectedMood(null);
        }
    });

    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood);
        saveMoodMutation.mutate({ mood, note: '' });
    };

    // Breathing timer logic
    useEffect(() => {
        if (!isBreathingActive) return;

        const interval = setInterval(() => {
            setBreathingTimer(prev => {
                const newTime = prev + 0.1;
                const phaseDuration = 4; // 4 seconds for each phase

                if (newTime >= phaseDuration) {
                    // Move to next phase
                    if (breathingPhase === 'prepare') {
                        setBreathingPhase('inhale');
                    } else if (breathingPhase === 'inhale') {
                        setBreathingPhase('hold');
                    } else if (breathingPhase === 'hold') {
                        setBreathingPhase('exhale');
                    } else if (breathingPhase === 'exhale') {
                        setBreathingCycles(prev => prev + 1);
                        setBreathingPhase('inhale'); // Start new cycle
                    }
                    return 0;
                }
                return newTime;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isBreathingActive, breathingPhase]);

    const handleSkipStep = (task: string) => {
        // Stop audio if skipping theta audio step
        if (task === 'thetaAudioCompleted' && audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlayingAudio(false);
            setAudioCompleted(false);
            setAudioProgress(0);
        }
        completeTaskMutation.mutate({ task, status: 'skipped' });
    };

    const handleExit = () => {
        // Stop and cleanup audio if it's playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlayingAudio(false);
        }
        setLocation('/dashboard');
    };

    const handleRestart = async () => {
        // Stop and cleanup audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlayingAudio(false);
        }

        // Reset local state
        setCurrentStep(1);
        setIsPlayingGame(false);
        setAudioCompleted(false);
        setAudioProgress(0);

        // Call API to reset daily plan (we'll implement this endpoint or just reset progress fields)
        // For now, we can just manually reset the progress by calling completeTask with 0 for all fields?
        // Or better, add a reset endpoint. Let's assume we add one or just rely on the user re-doing it visually.
        // But to "restart it again even once finished" implies we want to clear the "completed" state.
        // Let's call a reset endpoint.
        try {
            await apiRequest('POST', '/api/daily-plan/reset', {});
            queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
            toast({
                title: t.dashboard.daily_plan_reset,
                description: t.dashboard.daily_plan_reset_desc,
            });
        } catch (error) {
            console.error("Failed to reset plan", error);
        }
    };

    const handleGameComplete = () => {
        setIsPlayingGame(false);
        completeTaskMutation.mutate({ task: 'gameCompleted', status: 'completed' });
    };

    const progressPercentage = ((currentStep - 1) / 4) * 100;

    // Step 5: Completion
    if (currentStep === 5) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-2xl w-full text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-primary/10 p-8 relative">
                            <CheckCircle2 className="w-24 h-24 text-primary" />
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-bounce">
                                +50
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">{t.dashboard.all_tasks_completed}</h1>
                        <p className="text-xl text-muted-foreground">{t.dashboard.perfect_day}</p>
                        {dailyPlan?.newStreak && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold">
                                <Zap className="w-5 h-5 fill-current" />
                                {(t.dashboard?.day_streak || "{days} day streak! 🔥").replace('{days}', String(dailyPlan.newStreak))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row justify-center">
                        <Button size="lg" onClick={handleExit} className="text-lg px-8 py-6">
                            {t.dashboard.back_to_dashboard}
                        </Button>
                        <Button variant="outline" size="lg" onClick={handleRestart} className="text-lg px-8 py-6">
                            <RotateCcw className="mr-2 h-5 w-5" />
                            {t.dashboard.start_again}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (isPlayingGame && todaysGame) {
        return (
            <div className="min-h-screen bg-background p-4 flex flex-col">
                <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
                    <Button variant="ghost" className="w-fit mb-4" onClick={() => setIsPlayingGame(false)}>
                        ← {t.common.back} to Plan
                    </Button>
                    <Card className="flex-1 border-0 shadow-none bg-transparent">
                        <CardContent className="p-0 h-full">
                            {todaysGame === 'memory' && <MemoryGame onGameComplete={handleGameComplete} />}
                            {todaysGame === 'pattern' && <PatternGame onGameComplete={handleGameComplete} />}
                            {todaysGame === 'word' && <WordGame onGameComplete={handleGameComplete} />}
                            {todaysGame === 'number' && <NumberGame onGameComplete={handleGameComplete} />}
                            {todaysGame === 'visual' && <VisualSearchGame onGameComplete={handleGameComplete} />}
                            {todaysGame === 'reaction' && <ReactionGame onGameComplete={handleGameComplete} />}
                            {todaysGame === 'color' && <ColorMatchGame onGameComplete={handleGameComplete} />}
                            {todaysGame === '2048' && <Game2048 onGameComplete={handleGameComplete} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">{t.dashboard.your_plan_today}</h1>
                        <Button variant="ghost" size="icon" onClick={handleExit}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{t.dashboard.step} {currentStep} {t.common.of} 4</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Step 1: Mood */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-rose-500/10 p-6">
                                        <Heart className="w-16 h-16 text-rose-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold">{t.dashboard.log_your_mood}</h2>
                                <p className="text-xl text-muted-foreground">{t.dashboard.how_feeling}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {(Object.keys(moodConfig) as Mood[]).map((mood) => {
                                    const config = moodConfig[mood];
                                    const Icon = config.icon;
                                    return (
                                        <button
                                            key={mood}
                                            onClick={() => handleMoodSelect(mood)}
                                            disabled={saveMoodMutation.isPending}
                                            className={`
                        p-6 rounded-xl border-2 transition-all duration-200
                        flex flex-col items-center gap-3
                        hover:scale-105 hover:shadow-lg
                        ${selectedMood === mood
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                    : 'border-transparent bg-card hover:bg-accent'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                                        >
                                            <div className={`p-3 rounded-full ${config.bgColor}`}>
                                                <Icon className={`w-8 h-8 ${config.color}`} />
                                            </div>
                                            <span className="font-medium capitalize">{t.mood[mood]}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSkipStep('moodCompleted')}
                                    disabled={completeTaskMutation.isPending}
                                >
                                    {t.common.skip}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Theta Audio */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-violet-500/10 p-6">
                                        <Headphones className="w-16 h-16 text-violet-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold">{t.dashboard.listen_theta_audio}</h2>
                                <p className="text-xl text-muted-foreground">{(t.dashboard?.session_info || "Session {session}").replace('{session}', String(user?.currentAudioSession || 1))}</p>
                            </div>

                            <div className="glass-card p-8 rounded-2xl space-y-6 border-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50">
                                <div className="text-center space-y-2">
                                    <p className="text-lg font-semibold">{(t.dashboard?.daily_theta_session || "Daily Theta Session {session}").replace('{session}', String(user?.currentAudioSession || 1))}</p>
                                    <p className="text-sm text-muted-foreground">{t.dashboard.session_duration}</p>
                                </div>

                                {/* Audio Player Controls */}
                                <div className="space-y-4">
                                    {/* Play/Pause Button */}
                                    <div className="flex justify-center">
                                        {!audioCompleted ? (
                                            <Button
                                                size="icon"
                                                className="h-16 w-16 rounded-full shadow-lg text-foreground"
                                                onClick={() => {
                                                    if (!audioRef.current) {
                                                        // Initialize audio
                                                        const audio = new Audio(`https://www.creativewaves.me/mp3files/${user?.currentAudioSession || 1}.mp3`);
                                                        audioRef.current = audio;

                                                        audio.addEventListener('loadedmetadata', () => {
                                                            setAudioDuration(audio.duration);
                                                        });

                                                        audio.addEventListener('timeupdate', () => {
                                                            setAudioProgress(audio.currentTime);
                                                        });

                                                        audio.addEventListener('ended', () => {
                                                            setAudioCompleted(true);
                                                            setIsPlayingAudio(false);
                                                        });

                                                        audio.play();
                                                        setIsPlayingAudio(true);
                                                    } else {
                                                        // Toggle play/pause
                                                        if (isPlayingAudio) {
                                                            audioRef.current.pause();
                                                            setIsPlayingAudio(false);
                                                        } else {
                                                            audioRef.current.play();
                                                            setIsPlayingAudio(true);
                                                        }
                                                    }
                                                }}
                                            >
                                                {isPlayingAudio ? (
                                                    <Pause className="h-8 w-8" />
                                                ) : (
                                                    <Play className="h-8 w-8 ml-1" />
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="text-center">
                                                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                                                <p className="text-sm text-green-600 font-semibold mt-2">Session Complete!</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    {!audioCompleted && audioRef.current && (
                                        <div className="space-y-2">
                                            <Progress
                                                value={(audioProgress / audioDuration) * 100}
                                                className="h-2"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{Math.floor(audioProgress / 60)}:{String(Math.floor(audioProgress % 60)).padStart(2, '0')}</span>
                                                <span>{Math.floor(audioDuration / 60)}:{String(Math.floor(audioDuration % 60)).padStart(2, '0')}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Continue Button (only shown after completion) */}
                                    {audioCompleted && (
                                        <Button
                                            size="lg"
                                            className="w-full text-foreground"
                                            onClick={() => completeTaskMutation.mutate({ task: 'thetaAudioCompleted', status: 'completed' })}
                                        >
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            Continue to Next Step
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => handleSkipStep('thetaAudioCompleted')}
                                    disabled={completeTaskMutation.isPending}
                                    className="flex-1"
                                >
                                    {t.common.skip}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Breathing */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-cyan-500/10 p-6">
                                        <Wind className="w-16 h-16 text-cyan-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold">{t.dashboard.do_breathing_exercise}</h2>
                                <p className="text-xl text-muted-foreground">{t.breathing.complete_cycles}</p>
                            </div>

                            <div className="glass-card p-8 rounded-2xl space-y-6 border-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50">
                                {/* Breathing Circle Animation */}
                                <div className="relative flex items-center justify-center h-80 w-full">
                                    <div
                                        className={`absolute rounded-full border-4 transition-all duration-1000 ease-in-out shadow-2xl ${breathingPhase === 'inhale' ? 'border-blue-500 bg-blue-500/20' :
                                            breathingPhase === 'hold' ? 'border-purple-500 bg-purple-500/20' :
                                                breathingPhase === 'exhale' ? 'border-green-500 bg-green-500/20' :
                                                    'border-gray-300 bg-gray-300/20'
                                            }`}
                                        style={{
                                            width: isBreathingActive ? (
                                                breathingPhase === 'inhale' ? `${180 + (breathingTimer / 4) * 100}px` :
                                                    breathingPhase === 'hold' ? '280px' :
                                                        breathingPhase === 'exhale' ? `${280 - (breathingTimer / 4) * 100}px` :
                                                            '180px'
                                            ) : '180px',
                                            height: isBreathingActive ? (
                                                breathingPhase === 'inhale' ? `${180 + (breathingTimer / 4) * 100}px` :
                                                    breathingPhase === 'hold' ? '280px' :
                                                        breathingPhase === 'exhale' ? `${280 - (breathingTimer / 4) * 100}px` :
                                                            '180px'
                                            ) : '180px',
                                        }}
                                    />
                                    <div className="absolute text-center z-10">
                                        <div className="text-3xl font-bold mb-2">
                                            {breathingPhase === 'prepare' && t.breathing.prepare}
                                            {breathingPhase === 'inhale' && `🌬️ ${t.breathing.inhale}`}
                                            {breathingPhase === 'hold' && `⏸️ ${t.breathing.hold}`}
                                            {breathingPhase === 'exhale' && `💨 ${t.breathing.exhale}`}
                                        </div>
                                        {isBreathingActive && (
                                            <div className="text-6xl font-bold text-primary">
                                                {Math.ceil(4 - breathingTimer)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cycles Counter */}
                                {breathingCycles > 0 && (
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <span className="text-lg font-semibold text-green-700">
                                                {(t.breathing?.cycles_progress || "{completed} / {total} cycles completed").replace('{completed}', String(breathingCycles)).replace('{total}', '3')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="space-y-4">
                                    {!isBreathingActive ? (
                                        <Button
                                            size="lg"
                                            className="w-full text-foreground"
                                            onClick={() => {
                                                setIsBreathingActive(true);
                                                setBreathingPhase('prepare');
                                                setBreathingTimer(0);
                                                setBreathingCycles(0);
                                            }}
                                        >
                                            <Play className="mr-2 h-5 w-5" />
                                            {t.breathing.start_breathing}
                                        </Button>
                                    ) : breathingCycles >= 3 ? (
                                        <Button
                                            size="lg"
                                            className="w-full text-foreground"
                                            onClick={() => completeTaskMutation.mutate({ task: 'breathingCompleted', status: 'completed' })}
                                        >
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            {t.breathing.exercise_complete_continue}
                                        </Button>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            {t.breathing.continue_breathing}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => handleSkipStep('breathingCompleted')}
                                    disabled={completeTaskMutation.isPending}
                                    className="flex-1"
                                >
                                    {t.common.skip}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Brain Game */}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-amber-500/10 p-6">
                                        <Brain className="w-16 h-16 text-amber-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold">{t.dashboard.play_brain_game}</h2>
                                <p className="text-xl text-muted-foreground">{t.dashboard.challenge_mind}</p>
                            </div>

                            <div className="glass-card p-8 rounded-2xl space-y-4 border-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
                                <div className="text-center space-y-2">
                                    <p className="text-lg font-semibold capitalize">{(t.dashboard as any)[todaysGame + '_game'] || todaysGame + ' Game'}</p>
                                    <p className="text-sm text-muted-foreground">{t.dashboard.daily_challenge}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    size="lg"
                                    className="flex-1 text-foreground"
                                    onClick={() => setIsPlayingGame(true)}
                                >
                                    {t.dashboard.play_now}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => handleSkipStep('gameCompleted')}
                                    disabled={completeTaskMutation.isPending}
                                >
                                    {t.common.skip}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
