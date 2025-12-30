
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Moon, Sun, Clock, Zap, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SleepEntry, InsertSleepEntry } from '@shared/schema';
import { UseMutationResult } from '@tanstack/react-query';
import { formatTime } from '@/lib/sleepUtils';
import { calculateEfficiency } from '@/lib/sleepUtils';

interface SleepDiaryFormProps {
    saveSleepMutation: UseMutationResult<any, Error, Omit<InsertSleepEntry, 'userId'>, unknown>;
    markDayMutation: UseMutationResult<any, Error, number, unknown>;
    sleepEntries: SleepEntry[];
}

export function SleepDiaryForm({ saveSleepMutation, markDayMutation, sleepEntries }: SleepDiaryFormProps) {
    const { t } = useLanguage();
    const [bedtime, setBedtime] = useState('22:30');
    const [wakeTime, setWakeTime] = useState('06:00');
    const [sleepOnsetMinutes, setSleepOnsetMinutes] = useState(15);
    const [awakeningsCount, setAwakeningsCount] = useState(1);
    const [sleepQuality, setSleepQuality] = useState(3);
    const [caffeineNotes, setCaffeineNotes] = useState('');

    const currentEfficiency = calculateEfficiency(
        bedtime,
        wakeTime,
        sleepOnsetMinutes,
        awakeningsCount * 10
    );

    const handleSaveSleep = () => {
        const now = new Date();
        const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

        const [bedH, bedM] = bedtime.split(':').map(Number);
        const [wakeH, wakeM] = wakeTime.split(':').map(Number);
        let timeInBed = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
        if (timeInBed < 0) timeInBed += 24 * 60;
        const totalSleepHours = (timeInBed - sleepOnsetMinutes - awakeningsCount * 10) / 60;

        saveSleepMutation.mutate({
            date: today,
            bedtime,
            sleepOnsetMinutes,
            awakeningsCount,
            finalWakeTime: wakeTime,
            totalSleepHours: Math.max(0, totalSleepHours),
            sleepQuality,
            caffeineAlcohol: caffeineNotes,
            sleepEfficiency: currentEfficiency / 100,
        });

        const dayNumber = Math.min(sleepEntries.length + 1, 7);
        markDayMutation.mutate(dayNumber);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Moon className="h-5 w-5 text-indigo-500" />
                            {t.sleep?.diary_title || "Sleep Diary"}
                        </CardTitle>
                        <CardDescription>
                            {t.sleep?.daily_task_desc || "Log your sleep quality"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="bedtime" className="flex items-center gap-2 mb-2">
                                    <Moon className="h-4 w-4 text-indigo-500" />
                                    {t.sleep?.bedtime || "Bedtime"}
                                </Label>
                                <Input
                                    id="bedtime"
                                    type="time"
                                    value={bedtime}
                                    onChange={(e) => setBedtime(e.target.value)}
                                    className="text-lg py-6"
                                />
                            </div>
                            <div>
                                <Label htmlFor="waketime" className="flex items-center gap-2 mb-2">
                                    <Sun className="h-4 w-4 text-orange-500" />
                                    {t.sleep?.wake_time || "Wake Time"}
                                </Label>
                                <Input
                                    id="waketime"
                                    type="time"
                                    value={wakeTime}
                                    onChange={(e) => setWakeTime(e.target.value)}
                                    className="text-lg py-6"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="onset" className="flex items-center gap-2 mb-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    {t.sleep?.time_to_sleep || "Time to fall asleep (min)"}
                                </Label>
                                <Input
                                    id="onset"
                                    type="number"
                                    min={0}
                                    max={180}
                                    value={sleepOnsetMinutes}
                                    onChange={(e) => setSleepOnsetMinutes(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="awakenings" className="flex items-center gap-2 mb-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    {t.sleep?.awakenings || "Night awakenings"}
                                </Label>
                                <Input
                                    id="awakenings"
                                    type="number"
                                    min={0}
                                    max={20}
                                    value={awakeningsCount}
                                    onChange={(e) => setAwakeningsCount(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="flex items-center gap-2 mb-3">
                                {t.sleep?.quality || "Sleep Quality"}: <span className="text-indigo-600 font-bold">{sleepQuality}/5</span>
                            </Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((q) => (
                                    <Button
                                        key={q}
                                        variant={sleepQuality === q ? "default" : "outline"}
                                        size="lg"
                                        onClick={() => setSleepQuality(q)}
                                        className={`flex-1 transition-all ${sleepQuality === q ? 'scale-105 shadow-md' : ''}`}
                                    >
                                        {q}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="notes" className="mb-2 block">
                                {t.sleep?.notes || "Caffeine/Alcohol notes (optional)"}
                            </Label>
                            <Input
                                id="notes"
                                placeholder={t.sleep?.notes_placeholder || "e.g., Coffee at 3pm, wine at dinner"}
                                value={caffeineNotes}
                                onChange={(e) => setCaffeineNotes(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleSaveSleep}
                            disabled={saveSleepMutation.isPending}
                            className="w-full text-lg py-6"
                        >
                            {saveSleepMutation.isPending
                                ? (t.sleep?.saving || "Saving...")
                                : (t.sleep?.save_entry || "Log Sleep")}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Entries - Sidebar */}
            <div>
                <Card className="h-full border-none bg-muted/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-md">
                            <Calendar className="h-4 w-4" />
                            {t.sleep?.recent_entries || "Recent Entries"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sleepEntries.length > 0 ? (
                            <div className="space-y-3">
                                {sleepEntries.slice(0, 7).map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="flex items-center justify-between p-3 bg-background rounded-lg shadow-sm border"
                                    >
                                        <div>
                                            <span className="font-medium text-sm block">{entry.date}</span>
                                            <span className="text-xs text-muted-foreground">{formatTime(entry.bedtime)} - {formatTime(entry.finalWakeTime)}</span>
                                        </div>
                                        <div className={`font-bold ${entry.sleepEfficiency >= 0.85 ? 'text-green-500' :
                                            entry.sleepEfficiency >= 0.75 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                            {Math.round(entry.sleepEfficiency * 100)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                {t.sleep?.no_history || "No written entries yet."}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
