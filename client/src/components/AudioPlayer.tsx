import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function AudioPlayer() {
  const { t } = useLanguage();

  const audioSessions = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    title: `${t.audio.session} ${i + 1}`,
    url: `https://www.creativewaves.me/mp3files/${i + 1}.mp3`,
    duration: 420
  }));
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize from user's saved progress
  useEffect(() => {
    if (user?.currentAudioSession) {
      setCurrentTrack(user.currentAudioSession - 1);
      setCurrentTime(user.lastAudioPosition || 0);
    }
  }, [user]);

  // Handle autoplay from URL query param
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('autoplay') === 'true') {
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
          setIsPlaying(true);
          completeDailyTaskMutation.mutate();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { session: number; position: number }) => {
      if (!user) return;
      return await apiRequest('POST', '/api/audio/progress', {
        session: data.session,
        position: data.position
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    }
  });

  const completeDailyTaskMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/daily-plan/complete-task', { task: 'thetaAudio' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
    }
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        // Mark daily task as complete when user starts listening
        completeDailyTaskMutation.mutate();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    const newTrack = currentTrack > 0 ? currentTrack - 1 : audioSessions.length - 1;
    setCurrentTrack(newTrack);
    setCurrentTime(0);
    // Auto-play the previous track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        completeDailyTaskMutation.mutate();
      }
    }, 100);
    updateProgressMutation.mutate({ session: newTrack + 1, position: 0 });
  };

  const handleNext = () => {
    const newTrack = currentTrack < audioSessions.length - 1 ? currentTrack + 1 : 0;
    setCurrentTrack(newTrack);
    setCurrentTime(0);
    // Auto-play the next track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        completeDailyTaskMutation.mutate();
      }
    }, 100);
    updateProgressMutation.mutate({ session: newTrack + 1, position: 0 });
  };

  const handleContinueLearning = () => {
    if (user?.currentAudioSession) {
      const session = user.currentAudioSession - 1;
      setCurrentTrack(session);
      setCurrentTime(user.lastAudioPosition || 0);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = user.lastAudioPosition || 0;
          audioRef.current.play();
          setIsPlaying(true);
          // Mark daily task as complete when user starts listening
          completeDailyTaskMutation.mutate();
        }
      }, 100);
    }
  };

  // Auto-save progress every 5 seconds while playing
  useEffect(() => {
    if (!isPlaying || !user) return;

    const interval = setInterval(() => {
      updateProgressMutation.mutate({
        session: currentTrack + 1,
        position: Math.floor(currentTime)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, currentTrack, user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">{t.audio.title}</h2>
        <p className="text-lg md:text-xl text-muted-foreground">{t.audio.subtitle}</p>
      </div>

      {user && user.currentAudioSession && user.currentAudioSession > 1 && (
        <Card className="glass-card border-0 bg-primary/5">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-lg font-semibold">{t.audio.continue_journey}</p>
              <p className="text-sm text-muted-foreground">
                {t.audio.resume} {t.audio.session} {user.currentAudioSession}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleContinueLearning}
              className="gap-2 shadow-lg hover:shadow-xl transition-all"
              data-testid="button-continue-learning"
            >
              <PlayCircle className="h-5 w-5" />
              {t.audio.continue_learning}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card-lg border-0 shadow-xl">
        <CardContent className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
              {t.audio.session} {currentTrack + 1} / {audioSessions.length}
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
              {audioSessions[currentTrack].title}
            </h3>
          </div>

          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={audioSessions[currentTrack].duration}
              step={1}
              onValueChange={([value]) => setCurrentTime(value)}
              className="w-full"
              data-testid="slider-audio-progress"
            />
            <div className="flex justify-between text-sm text-muted-foreground font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audioSessions[currentTrack].duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              className="h-14 w-14 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              data-testid="button-audio-previous"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="default"
              onClick={togglePlay}
              className="h-20 w-20 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              data-testid="button-audio-play-pause"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="h-14 w-14 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              data-testid="button-audio-next"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center gap-4 max-w-xs mx-auto bg-white/30 p-3 rounded-full backdrop-blur-sm">
            <Volume2 className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={([value]) => setVolume(value)}
              className="flex-1 mr-2"
              data-testid="slider-audio-volume"
            />
          </div>

          <audio
            ref={audioRef}
            src={audioSessions[currentTrack].url}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={handleNext}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl md:text-2xl font-heading font-semibold">
            {t.audio.all_sessions}
          </h3>
          <div className="text-sm text-muted-foreground bg-white/30 px-3 py-1 rounded-full">
            {t.audio.duration} each
          </div>
        </div>

        <div className="grid gap-3">
          {audioSessions.map((session, index) => (
            <Button
              key={session.id}
              variant={currentTrack === index ? "secondary" : "ghost"}
              className={`justify-start h-auto py-4 px-6 text-left border-0 transition-all hover-elevate ${currentTrack === index
                ? 'glass-card bg-primary/10 hover:bg-primary/15'
                : 'glass-card bg-white/40 hover:bg-white/60'
                }`}
              onClick={() => {
                setCurrentTrack(index);
                setCurrentTime(0);
                // Auto-play when clicking a session
                setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current.play();
                    setIsPlaying(true);
                    completeDailyTaskMutation.mutate();
                  }
                }, 100);
              }}
              data-testid={`button-session-${session.id}`}
              data-active={currentTrack === index ? "true" : "false"}
            >
              <div className="flex items-center gap-4 w-full">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full font-bold text-lg flex-shrink-0 transition-colors ${currentTrack === index ? 'bg-primary text-primary-foreground shadow-md' : 'bg-white/50 text-muted-foreground'
                  }`}>
                  {session.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-lg font-medium truncate ${currentTrack === index ? 'text-foreground' : 'text-muted-foreground'}`}>{session.title}</div>
                  <div className={`text-sm font-medium truncate ${currentTrack === index ? 'text-primary' : 'text-muted-foreground'}`}>
                    {currentTrack === index ? t.audio.now_playing : t.audio.click_to_play}
                  </div>
                </div>
                {currentTrack === index && (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}