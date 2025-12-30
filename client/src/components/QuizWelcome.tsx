import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizInsights {
    hasQuizData: boolean;
    insights: {
        age: string | null;
        cognitiveStruggles: string | null;
        improvementGoals: string[] | null;
        rawAnswers: any[];
    };
}

export function QuizWelcome() {
    const { t } = useLanguage();

    const { data } = useQuery<QuizInsights>({
        queryKey: ['/api/user/quiz-insights'],
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
        retry: false
    });

    if (!data?.hasQuizData || !data.insights.improvementGoals?.length) {
        return null;
    }

    const goals = data.insights.improvementGoals;
    const primaryGoal = goals[0];

    // Simple logic to pick a message based on goals
    // In a real app, this could be more sophisticated or AI-generated
    const getMessage = () => {
        const goalLower = primaryGoal.toLowerCase();

        if (goalLower.includes('memory')) {
            return t.quiz_welcome.memory;
        }
        if (goalLower.includes('focus') || goalLower.includes('concentration')) {
            return t.quiz_welcome.focus;
        }
        if (goalLower.includes('sleep') || goalLower.includes('rest')) {
            return t.quiz_welcome.sleep;
        }
        if (goalLower.includes('anxiety') || goalLower.includes('stress')) {
            return t.quiz_welcome.anxiety;
        }
        return (t.quiz_welcome?.default || "Let's work on your goal of {goal} today.").replace('{goal}', primaryGoal);
    };

    return (
        <Card className="glass-card border-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 h-full">
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-4 h-full justify-center">
                <div className="rounded-full bg-background/50 p-2 md:p-3 shadow-sm">
                    <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-widest mb-1 md:mb-2">
                        {t.quiz_welcome.title}
                    </h3>
                    <p className="text-base md:text-2xl font-heading font-medium italic text-foreground">
                        "{getMessage()}"
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
