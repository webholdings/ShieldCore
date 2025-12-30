import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/use-auth';
import { Smile, Wind, Frown, Zap, CloudRain, Edit2, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { formatDateShort } from '@/lib/dateUtils';
import type { MoodEntry } from '@shared/schema';

type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'energized';

const moodConfig = {
  happy: { icon: Smile, color: 'text-chart-5', bgColor: 'bg-chart-5/10' },
  calm: { icon: Wind, color: 'text-chart-1', bgColor: 'bg-chart-1/10' },
  anxious: { icon: CloudRain, color: 'text-chart-3', bgColor: 'bg-chart-3/10' },
  sad: { icon: Frown, color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
  energized: { icon: Zap, color: 'text-chart-2', bgColor: 'bg-chart-2/10' }
};

export function MoodTracker() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);

  const { data: moodHistory = [] } = useQuery<MoodEntry[]>({
    queryKey: ['/api/mood'],
    enabled: !!user,
  });

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
      completeDailyTaskMutation.mutate();
      toast({
        title: t.mood.save,
        description: `${t.mood[selectedMood!]} - ${formatDateShort(new Date())}`,
      });
      setSelectedMood(null);
      setNote('');
    }
  });

  const completeDailyTaskMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/daily-plan/complete-task', { task: 'mood' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
    }
  });

  const updateMoodMutation = useMutation({
    mutationFn: async ({ id, mood, note }: { id: string; mood: string; note: string }) => {
      return await apiRequest('PATCH', `/api/mood/${id}`, { mood, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood'] });
      toast({
        title: 'Mood updated',
        description: 'Your mood entry has been updated successfully',
      });
      setEditingEntry(null);
      setSelectedMood(null);
      setNote('');
    }
  });

  const deleteMoodMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/mood/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood'] });
      toast({
        title: t.mood.deleted,
        description: t.mood.deleted || "Your mood entry has been removed",
      });
    }
  });

  const handleSave = () => {
    if (!selectedMood || !user) return;

    if (editingEntry) {
      updateMoodMutation.mutate({
        id: editingEntry.id,
        mood: selectedMood,
        note
      });
    } else {
      saveMoodMutation.mutate({ mood: selectedMood, note });
    }
  };

  const handleEdit = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setSelectedMood(entry.mood as Mood);
    setNote(entry.note || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setSelectedMood(null);
    setNote('');
  };

  const handleDelete = (id: string) => {
    if (confirm(t.mood.delete_confirm || 'Are you sure you want to delete this mood entry?')) {
      deleteMoodMutation.mutate(id);
    }
  };

  return (
    <div className="w-full space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">{t.mood.title}</h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">{t.mood.subtitle}</p>
      </div>

      {editingEntry && (
        <Card className="glass-card border-primary/50 shadow-lg animate-in fade-in slide-in-from-top-4">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Edit2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-lg">{t.mood.editing_entry} {formatDateShort(editingEntry.createdAt!)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="hover:bg-destructive/10 hover:text-destructive"
              data-testid="button-cancel-edit"
            >
              <X className="h-5 w-5 mr-2" />
              {t.common.cancel}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {(Object.keys(moodConfig) as Mood[]).map((mood) => {
          const config = moodConfig[mood];
          const Icon = config.icon;
          const isSelected = selectedMood === mood;

          return (
            <button
              key={mood}
              className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 ${isSelected
                ? 'bg-white/80 shadow-lg scale-105 ring-2 ring-primary'
                : 'bg-white/40 hover:bg-white/60 hover:scale-105 hover:shadow-md'
                }`}
              onClick={() => setSelectedMood(mood)}
              data-testid={`mood-${mood}`}
            >
              <div className={`p-5 rounded-full transition-colors duration-300 ${isSelected ? config.bgColor : 'bg-white/50 group-hover:bg-white/80'
                }`}>
                <Icon className={`h-10 w-10 transition-colors duration-300 ${isSelected ? config.color : 'text-muted-foreground group-hover:text-foreground'
                  }`} />
              </div>
              <span className={`text-lg font-medium transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                {t.mood[mood]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        <Textarea
          placeholder={t.mood.add_note}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[160px] text-lg p-6 rounded-2xl resize-none bg-white/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60"
          data-testid="textarea-mood-note"
        />
        <Button
          onClick={handleSave}
          disabled={!selectedMood || (editingEntry ? updateMoodMutation.isPending : saveMoodMutation.isPending)}
          variant="confirm"
          className="w-full h-16 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          data-testid="button-save-mood"
        >
          {editingEntry ? t.mood.update_entry : t.mood.save}
        </Button>
      </div>

      <div className="pt-8 border-t border-border/50">
        <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-primary rounded-full"></span>
          {t.mood.history}
        </h3>
        {moodHistory.length === 0 ? (
          <div className="text-center py-12 bg-white/20 rounded-2xl border border-white/20">
            <p className="text-xl text-muted-foreground">{t.mood.no_entries}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodHistory.slice(0, 10).map((entry) => {
              const config = moodConfig[entry.mood as Mood];
              const Icon = config?.icon || Smile;
              return (
                <div
                  key={entry.id}
                  className="group flex items-start gap-6 p-6 rounded-2xl bg-white/40 hover:bg-white/60 transition-all hover:shadow-md border border-white/20"
                  data-testid={`mood-history-${entry.id}`}
                >
                  <div className={`p-3 rounded-full ${config?.bgColor || 'bg-muted'} mt-1`}>
                    <Icon className={`h-6 w-6 ${config?.color || 'text-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-lg capitalize">{t.mood[entry.mood as Mood]}</span>
                      <span className="text-sm text-muted-foreground font-medium bg-white/30 px-3 py-1 rounded-full">
                        {formatDateShort(entry.createdAt!)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-base text-muted-foreground leading-relaxed">{entry.note}</p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(entry)}
                      className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                      data-testid={`button-edit-mood-${entry.id}`}
                    >
                      <Edit2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleteMoodMutation.isPending}
                      className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      data-testid={`button-delete-mood-${entry.id}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
