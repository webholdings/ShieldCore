
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SleepEntry } from '@shared/schema';
import { getCoachAdvice } from '@/lib/sleepUtils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface SleepInsightsProps {
    currentEfficiency: number;
    avgEfficiency: number;
    sleepEntries: SleepEntry[];
}

export function SleepInsights({ currentEfficiency, avgEfficiency, sleepEntries }: SleepInsightsProps) {
    const { t } = useLanguage();

    // Prepare data for chart
    // We take the last 7 entries and reverse them so they are chronological if the API returns newest first
    const chartData = [...sleepEntries]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7)
        .map(entry => ({
            date: new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' }),
            efficiency: Math.round(entry.sleepEfficiency * 100),
            quality: entry.sleepQuality
        }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sleep Efficiency Score */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            {t.sleep?.efficiency_title || "Sleep Efficiency"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-4">
                            <div className="text-6xl font-bold text-green-600 dark:text-green-400">
                                {currentEfficiency}%
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 font-medium">
                                {t.sleep?.current_night || "Tonight's estimate"}
                            </p>
                            {sleepEntries.length > 0 && (
                                <div className="mt-4 px-4 py-2 bg-white/60 dark:bg-black/20 rounded-lg inline-flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{t.sleep?.average || "7-day average"}:</span>
                                    <strong className="text-2xl text-green-700 dark:text-green-400">{avgEfficiency}%</strong>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 p-3 bg-white/40 dark:bg-background/40 rounded-lg text-xs text-center text-muted-foreground">
                            {t.sleep?.efficiency_explain || "Goal: 85%+ (time asleep ÷ time in bed)"}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Coach */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-amber-500" />
                            {t.sleep?.coach_title || "Sleep Coach"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-sm md:text-base leading-relaxed text-amber-900 dark:text-amber-100">
                                    {getCoachAdvice(avgEfficiency || currentEfficiency, sleepEntries, t)}
                                </p>
                                <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
                                    <p className="text-xs text-amber-700 dark:text-amber-400 uppercase font-bold tracking-wide mb-1">
                                        {t.sleep?.coach_tip || "Coach Tip"}
                                    </p>
                                    <p className="text-sm italic">
                                        {t.sleep?.coach_improve || "Establish a relaxing pre-sleep routine to signal to your body it's time to rest."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trends Chart */}
            {chartData.length > 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Efficiency Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#16a34a", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
