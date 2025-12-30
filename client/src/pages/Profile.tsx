import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiRequest } from '@/lib/queryClient';
import { User, LogOut, Mail, TrendingUp, Headphones, CreditCard, Activity } from 'lucide-react';
import type { MoodEntry } from '@shared/schema';
import { SubscriptionManager } from '@/components/SubscriptionManager';

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(user?.email || '');

  const { data: moodHistory = [] } = useQuery<MoodEntry[]>({
    queryKey: ['/api/mood'],
    enabled: !!user,
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (newEmail: string) => {
      return await apiRequest('PATCH', '/api/user/email', { email: newEmail });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: t.profile.toast_email_updated,
        description: t.profile.toast_email_updated_desc,
      });
    },
    onError: (error: Error) => {
      toast({
        title: t.profile.toast_update_failed,
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailMutation.mutate(email);
  };

  // Calculate mood insights
  const getMoodInsights = () => {
    if (moodHistory.length === 0) return null;

    const recentMoods = moodHistory.slice(0, 7);
    const moodCounts = recentMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      dominantMood: dominantMood[0],
      totalEntries: moodHistory.length,
      recentCount: recentMoods.length
    };
  };

  const insights = getMoodInsights();

  const getMoodMessage = (mood: string) => {
    const messages: Record<string, string> = {
      happy: t.profile.mood_message_happy,
      calm: t.profile.mood_message_calm,
      anxious: t.profile.mood_message_anxious,
      sad: t.profile.mood_message_sad,
      energized: t.profile.mood_message_energized
    };
    return messages[mood] || t.profile.mood_message_default;
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground drop-shadow-sm">{t.profile.title}</h1>
            <p className="text-lg text-muted-foreground font-light">{t.profile.subtitle}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="bg-white/50 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.profile.logout}
          </Button>
        </div>

        {/* Personalized Insights */}
        {insights && (
          <div className="glass-card-lg p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <TrendingUp className="h-64 w-64" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/5">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-semibold">{t.profile.wellness_insights}</h2>
              </div>

              <div className="space-y-6">
                <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
                  {getMoodMessage(insights.dominantMood)}
                </p>

                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-3 bg-white/40 px-4 py-3 rounded-xl border border-white/20">
                    <Headphones className="h-5 w-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.profile.audio_session_of || "Audio Session"}</span>
                      <span className="font-semibold">{user?.currentAudioSession || 1} <span className="text-muted-foreground font-normal">/ 10</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/40 px-4 py-3 rounded-xl border border-white/20">
                    <Activity className="h-5 w-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.profile.mood_entries_logged || "Mood Entries"}</span>
                      <span className="font-semibold">{insights.totalEntries}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 space-y-6 hover-elevate">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-heading font-semibold">{t.profile.audio_progress}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">{t.profile.current_session}</span>
                <span className="text-2xl font-bold text-primary">{user?.currentAudioSession || 1}<span className="text-lg text-muted-foreground font-normal">/10</span></span>
              </div>
              <div className="h-3 bg-muted/50 rounded-full overflow-hidden ring-1 ring-black/5">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${((user?.currentAudioSession || 1) / 10) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.profile.audio_progress_message || "Consistency is key to cognitive wellness. Keep up the great work!"}
              </p>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6 hover-elevate">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-heading font-semibold">{t.profile.account_info}</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/40 border border-white/20 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.profile.username}</p>
                <p className="font-semibold text-lg">{user?.username}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/20 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.profile.email}</p>
                <p className="font-semibold text-lg">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary mt-1">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-semibold">{t.profile.language_preference}</h3>
              <p className="text-muted-foreground">{t.profile.language_description}</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md ml-auto mr-auto md:ml-14 md:mr-0">
            <Label htmlFor="language" className="text-base">{t.profile.select_language}</Label>
            <select
              id="language"
              value={user?.language || 'en'}
              onChange={(e) => {
                const newLang = e.target.value;
                apiRequest('PATCH', '/api/user/language', { language: newLang }).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                  // Reload page to apply new language
                  window.location.reload();
                }).catch((error) => {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: 'destructive',
                  });
                });
              }}
              className="w-full h-12 px-4 rounded-lg bg-white/50 border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg outline-none transition-all"
            >
              <option value="en">English</option>
              <option value="de">Deutsch (German)</option>
              <option value="fr">Français (French)</option>
              <option value="pt">Português (Portuguese)</option>
            </select>
          </div>
        </div>

        {/* Update Email */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary mt-1">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-semibold">{t.profile.update_email}</h3>
              <p className="text-muted-foreground">{t.profile.update_email_description}</p>
            </div>
          </div>

          <form onSubmit={handleEmailUpdate} className="space-y-6 max-w-md ml-auto mr-auto md:ml-14 md:mr-0">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">{t.profile.new_email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-lg"
                data-testid="input-new-email"
              />
            </div>
            <Button
              type="submit"
              disabled={updateEmailMutation.isPending || email === user?.email}
              className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-all"
              data-testid="button-update-email"
            >
              {updateEmailMutation.isPending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {t.profile.update_email}
            </Button>
          </form>
        </div>

        {/* Subscription Management */}
        <SubscriptionManager />
      </div>
    </div>
  );
}
