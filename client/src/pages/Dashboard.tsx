import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import {
  Headphones, Brain, BookOpen, Heart, TrendingUp,
  ChevronRight, Trophy, Clock, CheckCircle2,
  Smile, Wind, Frown, Zap, CloudRain, Lock, Play, Star, RotateCcw, Lightbulb
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatDateShort } from '@/lib/dateUtils';
import type { MoodEntry, GameScore, Course } from '@shared/schema';
import { DailyMantra } from '@/components/DailyMantra';
import { QuizWelcome } from '@/components/QuizWelcome';




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

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const { data: dailyPlan } = useQuery<DailyPlan>({
    queryKey: ['/api/daily-plan'],
    enabled: !!user,
  });

  const { data: moodEntries = [] } = useQuery<MoodEntry[]>({
    queryKey: ['/api/mood'],
    enabled: !!user,
  });

  // Determine active step based on completion
  useEffect(() => {
    if (dailyPlan) {
      if (!dailyPlan.moodCompleted) setActiveStep(1);
      else if (!dailyPlan.thetaAudioCompleted) setActiveStep(2);
      else if (!dailyPlan.breathingCompleted) setActiveStep(3);
      else if (!dailyPlan.gameCompleted) setActiveStep(4);
      else setActiveStep(5); // All completed
    }
  }, [dailyPlan]);

  const completeTaskMutation = useMutation({
    mutationFn: async ({ task, status }: { task: string, status?: 'completed' | 'skipped' }) => {
      const res = await apiRequest('POST', '/api/daily-plan/complete-task', { task, status });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] }); // Update points/streak

      if (data.pointsAwarded > 0) {
        toast({
          title: t.dashboard.points_earned,
          description: `+${data.pointsAwarded} ${t.dashboard.points}!`,
        });
      }

      // Move to next step if skipping
      handleNextStep();
    },
  });

  const resetDailyPlanMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/daily-plan/reset');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
      toast({
        title: t.dashboard.daily_plan_reset,
        description: t.dashboard.daily_plan_reset_desc,
      });
      setActiveStep(1);
    },
  });

  const handleSkipStep = (task: string) => {
    completeTaskMutation.mutate({ task, status: 'skipped' });
  };

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
      // Mark daily task as complete
      completeTaskMutation.mutate({ task: 'moodCompleted', status: 'completed' });

      toast({
        title: t.mood.save,
        description: `${t.mood[selectedMood!]} - ${formatDateShort(new Date())}`,
      });
      setSelectedMood(null);
    }
  });

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    saveMoodMutation.mutate({ mood, note: '' });
  };

  const latestMood = moodEntries[0];

  // Calculate progress percentage
  const completedTasks = [
    dailyPlan?.moodCompleted,
    dailyPlan?.thetaAudioCompleted,
    dailyPlan?.breathingCompleted,
    dailyPlan?.gameCompleted
  ].filter(Boolean).length;

  const progressPercentage = (completedTasks / 4) * 100;

  const getMotivationalMessage = () => {
    if (progressPercentage === 0) return t.dashboard.start_daily_plan;
    if (progressPercentage === 25) return t.dashboard.great_start;
    if (progressPercentage === 50) return t.dashboard.halfway_there;
    if (progressPercentage === 75) return t.dashboard.almost_done;
    return t.dashboard.perfect_day;
  };

  const handleStartPlan = () => {
    setLocation('/daily-plan');
  };

  const handleNextStep = () => {
    switch (activeStep) {
      case 1:
        // Mood is handled by selection
        setActiveStep(2);
        break;
      case 2:
        setLocation('/audio');
        break;
      case 3:
        setLocation('/breathing');
        break;
      case 4:
        setLocation('/games');
        break;
    }
  };

  const { data: quizInsights } = useQuery<any>({
    queryKey: ['/api/user/quiz-insights'],
    staleTime: 1000 * 60 * 60,
  });

  const showQuizWelcome = quizInsights?.hasQuizData && quizInsights?.insights?.improvementGoals?.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto p-4 max-w-5xl space-y-8">

        {/* Welcome Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t.dashboard.welcome}, {user?.username}
            </h1>
            <p className="text-muted-foreground mt-1">
              {formatDateShort(new Date())}
            </p>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              {user?.totalPoints || 0} {t.dashboard.points}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Zap className="w-4 h-4 mr-2 text-orange-500" />
              {(t.dashboard?.day_streak || "{days} day streak! 🔥").replace('{days}', String(user?.streakCount || 0))}
            </Badge>
          </div>
        </div>

        {/* HERO SECTION: Daily Plan - Gamified Duolingo-style */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-lg md:shadow-xl">
          <div className="relative p-5 md:p-8">

            {/* Achievement Crowns Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 md:gap-3">
                {[1, 2, 3, 4, 5, 6].map((day) => {
                  const isCompleted = day <= (user?.streakCount || 0);
                  const isCurrent = day === (user?.streakCount || 0) + 1;
                  return (
                    <div
                      key={day}
                      className={`relative w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-lg md:text-2xl transition-all ${isCompleted
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : isCurrent
                          ? 'bg-primary/20 text-primary border-2 border-primary animate-pulse'
                          : 'bg-muted text-muted-foreground/50'
                        }`}
                    >
                      {isCompleted ? (
                        <Trophy className="w-5 h-5 md:w-7 md:h-7 fill-primary-foreground text-primary-foreground" />
                      ) : (
                        <span>{day}</span>
                      )}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Unlock/Key Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 bg-background/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/10 shadow-sm">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary/20" />
              </div>
            </div>

            {/* Level and Lesson Progress */}
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {(t.dashboard?.day_streak || "{days} day streak! 🔥").replace('{days}', String(user?.streakCount || 0)).replace('🔥', '')}
                </div>
                <span className="text-2xl md:text-3xl">🔥</span>
              </div>
              <div className="text-base md:text-lg font-medium text-muted-foreground">
                {completedTasks}/4 {t.dashboard.completed_tasks}
              </div>
            </div>

            {/* Task Checkboxes - Gamified */}
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 md:p-5 mb-6 border border-primary/10 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { completed: dailyPlan?.moodCompleted, icon: Heart, label: t.mood.title },
                  { completed: dailyPlan?.thetaAudioCompleted, icon: Headphones, label: t.audio.title },
                  { completed: dailyPlan?.breathingCompleted, icon: Wind, label: t.breathing.title },
                  { completed: dailyPlan?.gameCompleted, icon: Brain, label: t.games.title },
                ].map((task, index) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-1.5 p-3 md:p-4 rounded-xl transition-all border ${task.completed
                        ? 'bg-green-100 border-green-200 shadow-sm scale-105'
                        : 'bg-background border-border hover:border-primary/30'
                        }`}
                    >
                      <div className="relative">
                        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${task.completed ? 'text-green-600 fill-green-600/20' : 'text-muted-foreground'}`} />
                        {task.completed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 fill-green-600 absolute -top-1 -right-1" />
                        )}
                      </div>
                      <span className={`text-xs md:text-sm font-medium text-center leading-tight ${task.completed ? 'text-green-700' : 'text-muted-foreground'}`}>
                        {task.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Message Box */}
            {progressPercentage < 100 && (
              <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm md:text-base font-medium text-foreground/80 leading-relaxed">
                  {getMotivationalMessage()}
                </p>
              </div>
            )}

            {/* Action Button - Prominent */}
            <div className="flex flex-col gap-3">
              {progressPercentage < 100 ? (
                <Button
                  size="lg"
                  onClick={handleStartPlan}
                  className="w-full text-lg md:text-xl font-bold py-6 md:py-8 shadow-lg hover:scale-[1.02] transition-all rounded-xl uppercase tracking-wide"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span>{progressPercentage === 0 ? t.common.start : t.dashboard.continue}</span>
                    <div className="flex items-center gap-1 bg-primary-foreground/20 px-2 py-1 rounded-lg">
                      <span className="text-base md:text-lg">+{10 * (4 - completedTasks)}</span>
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </div>
                  </div>
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-100/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-200">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Trophy className="w-8 h-8 text-yellow-600 fill-yellow-400" />
                      <span className="text-green-800 text-xl md:text-2xl font-bold">
                        {t.dashboard.session_complete}!
                      </span>
                    </div>
                    <p className="text-green-700 font-medium">
                      {t.dashboard.perfect_day}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => resetDailyPlanMutation.mutate()}
                    className="w-full border-2 font-bold py-6 rounded-xl hover:bg-muted/50"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    {t.dashboard.start_again}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Inspiration Section - tighter gap on mobile */}
        <div className={`grid gap-3 md:gap-6 ${showQuizWelcome ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          <DailyMantra />
          {showQuizWelcome && <QuizWelcome />}
        </div>




        {/* Secondary Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Theta Wave Audio - FIRST */}
          <Card className="glass-card border-0 hover:shadow-lg transition-all cursor-pointer group" onClick={() => setLocation('/audio?autoplay=true')}>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-heading flex items-center gap-3">
                <Headphones className="h-6 w-6 text-violet-500" />
                {t.dashboard.continue_listening}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.dashboard.current_session}</p>
                  <p className="text-2xl font-bold">{t.audio.session} {user?.currentAudioSession || 1}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <Play className="h-6 w-6 ml-1" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.dashboard.progress}</span>
                  <span className="font-medium">{Math.round(((user?.currentAudioSession || 1) / 13) * 100)}%</span>
                </div>
                <Progress value={((user?.currentAudioSession || 1) / 13) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Continue Course / Lesson - Random Lesson Logic */}
          <Card
            className="glass-card border-0 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-blue-50 to-white"
            onClick={async () => {
              try {
                const res = await fetch('/api/lessons/random', {
                  headers: { 'Authorization': `Bearer ${await (import('@/lib/firebase').then(m => m.auth.currentUser?.getIdToken()))}` }
                });
                if (res.ok) {
                  const data = await res.json();
                  setLocation(`/courses/${data.courseId}/lessons/${data.lessonId}`);
                } else {
                  // Fallback to courses list if random fails
                  setLocation('/courses');
                }
              } catch (e) {
                setLocation('/courses');
              }
            }}
          >
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-heading flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                {t.nav?.courses || "Courses"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t.audio.continue_learning}</p>
                  <p className="text-lg font-bold text-blue-900">{t.dashboard.daily_lesson}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md group-hover:scale-105 transition-transform">
                {t.courses.start_course}
              </Button>
            </CardContent>
          </Card>

          {/* IQ Test CTA - Prominent */}
          <Card className="glass-card border-0 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-amber-50 to-white" onClick={() => setLocation('/iq-test')}>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-heading flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600" />
                {t.nav?.iq_test || "IQ Test"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t.dashboard.challenge_yourself}</p>
                  <p className="text-lg font-bold text-amber-900">{t.dashboard.cognitive_assessment}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Brain className="h-6 w-6" />
                </div>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md group-hover:scale-105 transition-transform">
                {t.iq_test.start_test}
              </Button>
            </CardContent>
          </Card>
        </div>


        {/* Last Journal Entry with Mood - HIDDEN */}
        {/* <Card className="glass-card border-0 hover:shadow-lg transition-all cursor-pointer group" onClick={() => setLocation('/journal')}>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-heading flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
                {t.journal.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">Your journal with mood tracking</p>
                <Button variant="outline" size="sm">View Journal</Button>
              </div>
            </CardContent>
          </Card> */}
      </div >
    </div >

  );
}
