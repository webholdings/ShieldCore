import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, History, ArrowRight, ArrowLeft, CheckCircle2, Brain, MessageCircle, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface ThoughtJournalEntry {
    id: string;
    createdAt: string;
    triggerText: string;
    emotionScore: number;
    automaticThought: string;
    aiReframeResponse?: string;
}

const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

export function ThoughtDiaryForm() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [step, setStep] = useState(1);
    const [trigger, setTrigger] = useState("");
    const [emotion, setEmotion] = useState([5]);
    const [thought, setThought] = useState("");
    const [reframeResult, setReframeResult] = useState<string | null>(null);

    const { data: history } = useQuery<ThoughtJournalEntry[]>({
        queryKey: ['/api/mental-health/journal'],
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const mockReframe = t.mental_health?.reframe_response || "Consider: Is this thought based on facts or feelings? What would you tell a friend in this situation?";
            setReframeResult(mockReframe);
            return apiRequest('POST', '/api/mental-health/journal', {
                triggerText: trigger,
                emotionScore: emotion[0],
                automaticThought: thought,
                aiReframeResponse: mockReframe
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/mental-health/journal'] });
            toast({
                title: t.mental_health?.diary_complete || "Check-in Complete!",
                description: t.mental_health?.diary_saved || "Your thought has been logged and reframed.",
            });
            setStep(4);
        },
        onError: () => {
            toast({
                title: t.mental_health?.error || "Error",
                description: t.mental_health?.diary_error || "Failed to save entry.",
                variant: "destructive"
            });
        }
    });

    const resetForm = () => {
        setStep(1);
        setTrigger("");
        setThought("");
        setEmotion([5]);
        setReframeResult(null);
    };

    const canProceed = () => {
        if (step === 1) return trigger.length >= 3;
        if (step === 2) return true;
        if (step === 3) return thought.length >= 5;
        return true;
    };

    const getEmotionLabel = (val: number) => {
        if (val <= 3) return { label: t.mental_health?.diary_mild || "Mild", color: "text-green-500" };
        if (val <= 6) return { label: t.mental_health?.diary_moderate || "Moderate", color: "text-amber-500" };
        return { label: t.mental_health?.diary_intense || "Intense", color: "text-red-500" };
    };

    const emotionInfo = getEmotionLabel(emotion[0]);

    return (
        <div className="space-y-8">
            <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800">
                                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <CardTitle>{t.mental_health?.tab_journal || "Thought Check-in"}</CardTitle>
                                <CardDescription className="mt-0.5">
                                    {step <= 3 ? `${t.mental_health?.diary_step_of || "Step"} ${step} ${t.mental_health?.of_label || "of"} 3` : (t.mental_health?.diary_complete || "Complete!")}
                                </CardDescription>
                            </div>
                        </div>
                        {step <= 3 && (
                            <div className="w-24">
                                <Progress value={(step / 3) * 100} className="h-2" />
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6 min-h-[300px] relative">
                    <AnimatePresence mode="wait">
                        {/* Step 1: What happened? */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2 mb-6">
                                    <MessageCircle className="h-10 w-10 mx-auto text-purple-500" />
                                    <h3 className="text-xl font-semibold">{t.mental_health?.diary_step_trigger || "What's on your mind?"}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t.mental_health?.diary_step_trigger_desc || "Briefly describe the situation or trigger."}
                                    </p>
                                </div>
                                <Input
                                    placeholder={t.mental_health?.trigger_placeholder || "e.g., Had a difficult conversation..."}
                                    value={trigger}
                                    onChange={(e) => setTrigger(e.target.value)}
                                    className="text-lg py-6"
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        {/* Step 2: How intense? */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2 mb-8">
                                    <div className={`text-5xl font-bold ${emotionInfo.color}`}>{emotion[0]}</div>
                                    <p className={`font-medium ${emotionInfo.color}`}>{emotionInfo.label}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {t.mental_health?.diary_step_emotion || "How intense is this feeling right now?"}
                                    </p>
                                </div>
                                <div className="px-4">
                                    <Slider
                                        value={emotion}
                                        onValueChange={setEmotion}
                                        min={1}
                                        max={10}
                                        step={1}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>{t.mental_health?.diary_calm || "Calm"}</span>
                                        <span>{t.mental_health?.diary_overwhelmed || "Overwhelmed"}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: The thought */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2 mb-6">
                                    <Lightbulb className="h-10 w-10 mx-auto text-amber-500" />
                                    <h3 className="text-xl font-semibold">{t.mental_health?.diary_step_thought || "What thought came up?"}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t.mental_health?.diary_step_thought_desc || "Write freely. There are no wrong answers."}
                                    </p>
                                </div>
                                <Textarea
                                    placeholder={t.mental_health?.thought_placeholder || "I was thinking that..."}
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                    className="min-h-[120px] text-base"
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        {/* Step 4: Success & Reframe */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6 text-center"
                            >
                                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                                <h3 className="text-2xl font-bold">{t.mental_health?.diary_complete || "Check-in Complete!"}</h3>

                                {reframeResult && (
                                    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="h-5 w-5 text-purple-500" />
                                            <span className="font-semibold text-purple-700 dark:text-purple-300">{t.mental_health?.diary_perspective || "A Different Perspective"}</span>
                                        </div>
                                        <p className="text-sm italic text-muted-foreground">{reframeResult}</p>
                                    </div>
                                )}

                                <Button onClick={resetForm} variant="outline" className="mt-4">
                                    {t.mental_health?.diary_another || "Start Another Check-in"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {step <= 3 && (
                        <div className="flex justify-between mt-8 pt-4 border-t">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(s => Math.max(1, s - 1))}
                                disabled={step === 1}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t.mental_health?.diary_back || "Back"}
                            </Button>
                            {step < 3 ? (
                                <Button
                                    onClick={() => setStep(s => s + 1)}
                                    disabled={!canProceed()}
                                >
                                    {t.mental_health?.diary_continue || "Continue"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => mutation.mutate()}
                                    disabled={!canProceed() || mutation.isPending}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                >
                                    {mutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    {t.mental_health?.reframe_btn || "Reframe Thought"}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* History */}
            {step === 1 && history && history.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <History className="h-5 w-5" />
                            {t.mental_health?.diary_recent || "Recent Check-ins"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {history.slice(0, 3).map((entry) => (
                            <div key={entry.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{format(new Date(entry.createdAt), 'PPP')}</span>
                                    <span className={getEmotionLabel(entry.emotionScore).color}>
                                        {entry.emotionScore}/10
                                    </span>
                                </div>
                                <p className="font-medium line-clamp-2">{entry.automaticThought}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
