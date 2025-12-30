import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { SleepEntry, SleepProgramProgress, User, InsertSleepEntry } from '@shared/schema';
import {
    Moon, Zap,
    BookOpen, Calendar,
    LineChart, Music, Wind, CloudRain, Calculator
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Link, useLocation } from 'wouter';
import { calculateBedtimes, calculateEfficiency, getChronotypes } from '@/lib/sleepUtils';
import { SleepProgramCard } from '@/components/sleep/SleepProgramCard';
import { SleepDiaryForm } from '@/components/sleep/SleepDiaryForm';
import { SleepInsights } from '@/components/sleep/SleepInsights';
import { ChronotypeSelector } from '@/components/sleep/ChronotypeSelector';

export default function SleepDashboard() {
    const [location] = useLocation();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab) {
            if (tab === 'program') {
                setActiveTab('overview');
            } else if (['overview', 'log', 'insights', 'tools'].includes(tab)) {
                setActiveTab(tab);
            }
        }
    }, [location]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    const { t } = useLanguage();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [cycleWakeTime, setCycleWakeTime] = useState('07:00');
    const [calculatedBedtimes, setCalculatedBedtimes] = useState<string[]>([]);
    const [selectedChronotype, setSelectedChronotype] = useState<string | null>(null);

    // Fetch user for chronotype
    const { data: user } = useQuery<User>({
        queryKey: ['/api/user'],
    });

    useEffect(() => {
        if (user?.chronotype) {
            setSelectedChronotype(user.chronotype);
        }
    }, [user]);

    // Fetch recent sleep entries
    const { data: sleepEntries = [], isLoading: entriesLoading } = useQuery<SleepEntry[]>({
        queryKey: ['/api/sleep-entries'],
    });

    // Fetch program progress
    const { data: programProgress } = useQuery<SleepProgramProgress>({
        queryKey: ['/api/sleep-progress'],
    });

    // Get efficiency for "tonight" simulation - passed to child but calculated there if needed, 
    // or calculate based on defaults for initial view
    // For simplicity, we calculate a default here or use 0
    const currentEfficiency = 0; // The form handles its own calculation state for now

    // Get average efficiency from recent entries
    const avgEfficiency = sleepEntries.length > 0
        ? Math.round(sleepEntries.reduce((sum: number, e: SleepEntry) => sum + (e.sleepEfficiency * 100), 0) / sleepEntries.length)
        : 0;

    const saveSleepMutation = useMutation({
        mutationFn: async (entry: Omit<InsertSleepEntry, 'userId'>) => {
            return apiRequest('POST', '/api/sleep-entries', entry);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/sleep-entries'] });
            queryClient.invalidateQueries({ queryKey: ['/api/sleep-progress'] });
            toast({
                title: t.sleep?.saved_title || "Sleep logged!",
                description: t.sleep?.saved_desc || "Your sleep diary entry has been saved.",
            });
        },
        onError: () => {
            toast({
                title: t.sleep?.error_title || "Error",
                description: t.sleep?.error_desc || "Failed to save sleep entry.",
                variant: "destructive",
            });
        },
    });

    const markDayMutation = useMutation({
        mutationFn: async (day: number) => {
            const currentDays = programProgress?.completedDays || [];
            const newDays = currentDays.includes(day)
                ? currentDays
                : [...currentDays, day].sort((a, b) => a - b);
            return apiRequest('PUT', '/api/sleep-progress', { completedDays: newDays });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/sleep-progress'] });
        },
    });

    const updateChronotypeMutation = useMutation({
        mutationFn: async (type: string) => {
            return apiRequest('PATCH', '/api/user/chronotype', { chronotype: type });
        },
        onSuccess: (_data: any, type: string) => {
            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
            setSelectedChronotype(type);
            toast({
                title: t.sleep?.chronotype_updated || "Chronotype Updated",
                description: `${t.sleep?.chronotype_set_as || "You are now set as a"} ${getChronotypes(t)[type as keyof ReturnType<typeof getChronotypes>].title}`,
            });
        },
    });

    const handleCalculateCycles = () => {
        const times = calculateBedtimes(cycleWakeTime);
        setCalculatedBedtimes(times);
    };

    if (entriesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Moon className="h-8 w-8 animate-pulse text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Moon className="h-8 w-8 text-indigo-500" />
                    {t.sleep?.title || "Schlaf-Reset Program"}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    {t.sleep?.subtitle || "7-day program to improve your sleep quality"}
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto h-auto p-1 bg-muted/50 backdrop-blur-sm">
                    <TabsTrigger value="overview" className="py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <BookOpen className="h-4 w-4" />
                        {t.sleep?.program_progress || "Overview"}
                    </TabsTrigger>
                    <TabsTrigger value="log" className="py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <Calendar className="h-4 w-4" />
                        {t.sleep?.diary_title || "Sleep Diary"}
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <LineChart className="h-4 w-4" />
                        {t.sleep?.efficiency_title || "Insights"}
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="py-3 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <Zap className="h-4 w-4" />
                        {t.sleep?.tools_title || "Tools"}
                    </TabsTrigger>
                </TabsList>

                {/* --- Overview Tab (Summary) --- */}
                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SleepProgramCard programProgress={programProgress} />
                </TabsContent>

                {/* --- Tools Tab --- */}
                <TabsContent value="tools" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Tools (Theta, Breathing, Sounds) */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Theta Audio */}
                            <Link href="/audio">
                                <Card className="hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer h-full border-l-4 border-l-purple-500">
                                    <CardContent className="p-6">
                                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                                            <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{t.sleep?.theta_waves || "Theta Waves"}</h3>
                                        <p className="text-sm text-muted-foreground">{t.sleep?.theta_desc || "Deep relaxation audio"}</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Breathing */}
                            <Link href="/breathing">
                                <Card className="hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer h-full border-l-4 border-l-teal-500">
                                    <CardContent className="p-6">
                                        <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                                            <Wind className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{t.sleep?.breathing || "Breathing"}</h3>
                                        <p className="text-sm text-muted-foreground">{t.sleep?.breathing_desc || "4-7-8 technique"}</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Sleep Sounds */}
                            <Link href="/sleep-sounds">
                                <Card className="hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer h-full border-l-4 border-l-blue-500">
                                    <CardContent className="p-6">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                                            <CloudRain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{t.sleep?.sleep_sounds_title || "Sleep Sounds"}</h3>
                                        <p className="text-sm text-muted-foreground">{t.sleep?.sleep_sounds_short_desc || "Ambient noise & nature"}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>

                    {/* Sleep Cycle Calculator */}
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-black/20 border-none shadow-sm mb-8">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                                <Calculator className="h-4 w-4" />
                                {t.sleep?.cycle_calculator_title || "Sleep Cycle Calculator"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full space-y-2">
                                    <Label className="text-xs">{t.sleep?.wake_up_at || "I want to wake up at:"}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="time"
                                            value={cycleWakeTime}
                                            onChange={(e) => setCycleWakeTime(e.target.value)}
                                            className="bg-white/80 dark:bg-black/20"
                                        />
                                        <Button onClick={handleCalculateCycles} variant="secondary" size="sm">
                                            {t.sleep?.calculate || "Calculate"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {calculatedBedtimes.length > 0 && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex gap-4">
                                        {calculatedBedtimes.map((time, i) => (
                                            <div key={time} className="">
                                                <span className="text-lg font-bold text-foreground block">
                                                    {time}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {i === 0 ? "9h (6 cyc)" : "7.5h (5 cyc)"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Sleep Diary Tab --- */}
                <TabsContent value="log" className="space-y-6">
                    <SleepDiaryForm
                        saveSleepMutation={saveSleepMutation}
                        markDayMutation={markDayMutation}
                        sleepEntries={sleepEntries}
                    />
                </TabsContent>

                {/* --- Insights Tab --- */}
                <TabsContent value="insights" className="space-y-6">
                    <SleepInsights
                        currentEfficiency={Math.round(calculateEfficiency('22:30', '06:00', 15, 10))} // Passing default for visualization
                        avgEfficiency={avgEfficiency}
                        sleepEntries={sleepEntries}
                    />

                    <ChronotypeSelector
                        user={user}
                        selectedChronotype={selectedChronotype}
                        updateChronotypeMutation={updateChronotypeMutation}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
