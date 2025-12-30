import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
    id: number;
    textKey: string;
    fallback: string;
    options: { label: string; value: number }[];
}

export function DetoxQuiz() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Questions with translation keys
    const questions: QuizQuestion[] = [
        {
            id: 1,
            textKey: 'quiz_question_1',
            fallback: "Daily scroll time?",
            options: [
                { label: "< 1h", value: 1 },
                { label: "1-3h", value: 2 },
                { label: "3-5h", value: 3 },
                { label: "> 5h", value: 4 }
            ]
        },
        {
            id: 2,
            textKey: 'quiz_question_2',
            fallback: "Urge frequency?",
            options: [
                { label: t.mental_health?.quiz_rarely || "Rarely", value: 1 },
                { label: t.mental_health?.quiz_sometimes || "Sometimes", value: 2 },
                { label: t.mental_health?.quiz_often || "Often", value: 3 },
                { label: t.mental_health?.quiz_constant || "Constant", value: 4 }
            ]
        },
        {
            id: 3,
            textKey: 'quiz_question_3',
            fallback: "Focus impact?",
            options: [
                { label: t.mental_health?.quiz_none || "None", value: 1 },
                { label: t.mental_health?.quiz_mild || "Mild", value: 2 },
                { label: t.mental_health?.quiz_moderate || "Moderate", value: 3 },
                { label: t.mental_health?.quiz_severe || "Severe", value: 4 }
            ]
        },
        {
            id: 4,
            textKey: 'quiz_question_4',
            fallback: "Anxiety triggers?",
            options: [
                { label: t.mental_health?.quiz_news || "News", value: 1 },
                { label: t.mental_health?.quiz_comparison || "Social Comparison", value: 2 },
                { label: t.mental_health?.quiz_fomo || "FOMO", value: 3 },
                { label: t.mental_health?.quiz_work || "Work", value: 4 }
            ]
        },
        {
            id: 5,
            textKey: 'quiz_question_5',
            fallback: "Ready to disconnect?",
            options: [
                { label: t.mental_health?.quiz_not_sure || "Not sure", value: 1 },
                { label: t.mental_health?.quiz_maybe || "Maybe", value: 2 },
                { label: t.mental_health?.quiz_yes || "Yes", value: 3 },
                { label: t.mental_health?.quiz_absolutely || "Absolutely", value: 4 }
            ]
        }
    ];

    const handleAnswer = (value: number) => {
        setAnswers(prev => ({ ...prev, [step]: value }));
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
        } else {
            setIsSubmitted(true);
        }
    };

    const calculateScore = () => {
        const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
        return Math.min(Math.round((total / (questions.length * 4)) * 10), 10);
    };

    const startDetoxMutation = useMutation({
        mutationFn: async () => {
            return apiRequest('POST', '/api/user/start-detox', {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
            toast({
                title: t.mental_health?.detox_started || "Detox Started",
                description: t.mental_health?.detox_started_desc || "Your 7-day journey begins now.",
            });
        }
    });

    if (isSubmitted) {
        const score = calculateScore();
        return (
            <Card className="w-full max-w-lg mx-auto border-2 border-primary/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {t.mental_health?.quiz_your_score || "Your Detox Score"}: {score}/10
                    </CardTitle>
                    <CardDescription>
                        {t.mental_health?.detox_desc || "Break your scrolling addiction."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                        <div className="text-left">
                            <p className="font-semibold">{t.mental_health?.quiz_eligible || "You're ready to start!"}</p>
                            <p className="text-sm text-muted-foreground">
                                {t.mental_health?.quiz_reclaim || "Reclaim your time and focus."}
                            </p>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg"
                        onClick={() => startDetoxMutation.mutate()}
                        disabled={startDetoxMutation.isPending}
                    >
                        {startDetoxMutation.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.mental_health?.starting || "Starting..."}</>
                        ) : (
                            t.mental_health?.start_detox || "Start Free Detox"
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const currentQ = questions[step];
    const questionText = (t.mental_health as any)?.[currentQ.textKey] || currentQ.fallback;

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <CardTitle>{t.mental_health?.quiz_title || "Detox Readiness Quiz"}</CardTitle>
                    <span className="text-sm text-muted-foreground">{step + 1}/{questions.length}</span>
                </div>
                <Progress value={((step + 1) / questions.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-medium"
                >
                    {questionText}
                </motion.div>

                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => (
                        <motion.button
                            key={idx}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleAnswer(option.value)}
                            className={`
                                w-full p-4 rounded-lg border-2 text-left transition-all
                                flex items-center gap-3
                                ${answers[step] === option.value
                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }
                            `}
                        >
                            <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${answers[step] === option.value
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground'
                                }
                            `}>
                                {answers[step] === option.value && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="font-medium">{option.label}</span>
                        </motion.button>
                    ))}
                </div>

                <Button
                    className="w-full mt-4"
                    onClick={handleNext}
                    disabled={answers[step] === undefined}
                >
                    {step === questions.length - 1
                        ? (t.mental_health?.quiz_finish || "Finish")
                        : (t.mental_health?.quiz_next || "Next")
                    }
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}
