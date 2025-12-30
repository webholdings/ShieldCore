
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Brain, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@shared/schema';
import { UseMutationResult } from '@tanstack/react-query';
import { getChronotypes } from '@/lib/sleepUtils';

interface ChronotypeSelectorProps {
    user: User | undefined;
    selectedChronotype: string | null;
    updateChronotypeMutation: UseMutationResult<any, Error, string, unknown>;
}

export function ChronotypeSelector({ user, selectedChronotype, updateChronotypeMutation }: ChronotypeSelectorProps) {
    const { t } = useLanguage();
    const chronotypes = getChronotypes(t);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    {t.sleep?.chronotype_title || "Your Chronotype"}
                </CardTitle>
                <CardDescription>
                    {t.sleep?.chronotype_insight ? `${t.sleep.chronotype_insight} ${user?.chronotype ? chronotypes[user.chronotype as keyof typeof chronotypes]?.title : ''}` : "Select your chronotype to get personalized scheduling advice."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(['bear', 'wolf', 'lion', 'dolphin'] as const).map((type) => {
                        const chrono = chronotypes[type];
                        const isSelected = selectedChronotype === type;
                        return (
                            <div
                                key={type}
                                onClick={() => updateChronotypeMutation.mutate(type)}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${isSelected
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                                    : 'border-transparent bg-muted/30 hover:bg-muted hover:border-muted-foreground/30'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 text-purple-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{chrono.icon}</div>
                                <div className="font-bold text-lg mb-1">{chrono.title}</div>
                                <div className="text-xs text-muted-foreground leading-snug">{chrono.desc}</div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
