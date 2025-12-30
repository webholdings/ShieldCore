import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldCheck, BookOpen, Clock, Brain, Wind } from 'lucide-react';
import { PanicMode } from '@/components/mental/PanicMode';
import { DetoxChallenge } from '@/components/mental/DetoxChallenge';
import { ThoughtDiaryForm } from '@/components/mental/ThoughtDiaryForm';
import { DetoxQuiz } from '@/components/mental/DetoxQuiz';
import { FocusTimer } from '@/components/mental/FocusTimer';
import { MentalHealthFooter } from '@/components/mental/MentalHealthFooter';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';

export default function MentalHealthDashboard() {
    const { t, language } = useLanguage();
    const [location] = useLocation();
    const [activeTab, setActiveTab] = useState("detox"); // Default to detox - more neutral landing
    const [showPanicOverlay, setShowPanicOverlay] = useState(false);

    const { data: user } = useQuery<User>({
        queryKey: ['/api/user'],
    });

    // Sync tab with URL query param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && ['panic', 'detox', 'journal'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Panic Overlay - Rendered conditionally */}
            {showPanicOverlay && (
                <PanicMode onExit={() => setShowPanicOverlay(false)} />
            )}

            <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
                {/* Mood Check-in Header */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6 md:p-8 border border-purple-100 dark:border-purple-800/30">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                                {new Date().toLocaleDateString(language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'pt' ? 'pt-PT' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                                {t.mental_health?.mood_greeting || "How are you feeling?"}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {t.mental_health?.mood_subtitle || "Choose a tool that matches your current state."}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={() => setShowPanicOverlay(true)}
                                variant="outline"
                                className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            >
                                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                                {t.mental_health?.mood_anxious || "Anxious"}
                            </Button>
                            <Button
                                onClick={() => handleTabChange('detox')}
                                variant="outline"
                                className="border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20"
                            >
                                <ShieldCheck className="mr-2 h-4 w-4 text-amber-500" />
                                {t.mental_health?.mood_distracted || "Distracted"}
                            </Button>
                            <Button
                                onClick={() => handleTabChange('journal')}
                                variant="outline"
                                className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                            >
                                <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
                                {t.mental_health?.mood_overwhelmed || "Overwhelmed"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="panic" className="gap-2">
                            <Wind className="h-4 w-4" />
                            {t.mental_health?.tab_panic || "Calm Down"}
                        </TabsTrigger>
                        <TabsTrigger value="detox" className="gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            {t.mental_health?.tab_detox || "Detox"}
                        </TabsTrigger>
                        <TabsTrigger value="journal" className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            {t.mental_health?.tab_journal || "Journal"}
                        </TabsTrigger>
                    </TabsList>

                    {/* Breathing/Calm Tab - Redesigned to be less "panic-inducing" */}
                    <TabsContent value="panic" className="space-y-6">
                        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10">
                            <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
                                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <Wind className="h-12 w-12" />
                                </div>
                                <div className="space-y-2 max-w-md">
                                    <h2 className="text-2xl font-bold">{t.mental_health?.panic_button || "Breathing Exercise"}</h2>
                                    <p className="text-muted-foreground">
                                        {t.mental_health?.panic_description || "Need to calm down? Try our guided breathing exercise with calming sounds."}
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={() => setShowPanicOverlay(true)}
                                    className="w-full max-w-sm h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    {t.mental_health?.panic_activate || "Start Breathing"}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        {t.mental_health?.quick_tools || "Quick Tools"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-2">
                                    <Button variant="outline" className="justify-start w-full">
                                        {t.mental_health?.breathing_standalone || "4-7-8 Breathing"}
                                    </Button>
                                    <Button variant="outline" className="justify-start w-full">
                                        {t.mental_health?.theta_calm || "Theta Waves (Calm)"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Detox Tab */}
                    <TabsContent value="detox" className="space-y-6">
                        {user?.detoxStartDate ? (
                            <div className="space-y-8">
                                <DetoxChallenge />
                                <FocusTimer />
                            </div>
                        ) : (
                            <DetoxQuiz />
                        )}
                    </TabsContent>

                    {/* Journal Tab */}
                    <TabsContent value="journal" className="space-y-6">
                        <ThoughtDiaryForm />
                    </TabsContent>
                </Tabs>

                <MentalHealthFooter />
            </div>
        </div>
    );
}
