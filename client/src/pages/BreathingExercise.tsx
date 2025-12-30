import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Play, Pause, Square, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

type BreathingPhase = 'prepare' | 'inhale' | 'hold' | 'exhale' | 'complete';

export default function BreathingExercise() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('prepare');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [timer, setTimer] = useState(0);
  const [hasCompletedTask, setHasCompletedTask] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const completeDailyTaskMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/daily-plan/complete-task', { task: 'breathing' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
    }
  });

  // 4-7-8 breathing technique: 4 seconds inhale, 7 seconds hold, 8 seconds exhale
  const PHASE_DURATIONS = {
    prepare: 3,
    inhale: 4,
    hold: 7,
    exhale: 8,
    complete: 3
  };

  const phaseSequence: BreathingPhase[] = ['inhale', 'hold', 'exhale'];

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 0.1;
          const currentPhaseDuration = PHASE_DURATIONS[phase];

          if (newTime >= currentPhaseDuration) {
            // Move to next phase
            if (phase === 'prepare') {
              setPhase('inhale');
            } else if (phase === 'exhale') {
              // Complete a cycle
              setCyclesCompleted((prev) => prev + 1);
              setPhase('inhale');
            } else {
              const currentIndex = phaseSequence.indexOf(phase);
              setPhase(phaseSequence[currentIndex + 1]);
            }
            return 0;
          }
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, phase]);

  // Mark daily task as complete when user completes first breathing cycle
  useEffect(() => {
    if (cyclesCompleted >= 1 && !hasCompletedTask) {
      setHasCompletedTask(true);
      completeDailyTaskMutation.mutate();
    }
  }, [cyclesCompleted, hasCompletedTask]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setPhase('prepare');
    setTimer(0);
    setCyclesCompleted(0);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase('complete');
    setTimer(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'prepare':
        return t.breathing.prepare;
      case 'inhale':
        return t.breathing.inhale;
      case 'hold':
        return t.breathing.hold;
      case 'exhale':
        return t.breathing.exhale;
      case 'complete':
        return t.breathing.complete;
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'prepare':
        return t.breathing.ready;
      case 'inhale':
        return t.breathing.breathe_in_instruction;
      case 'hold':
        return t.breathing.hold_instruction;
      case 'exhale':
        return t.breathing.breathe_out_instruction;
      case 'complete':
        return t.breathing.well_done;
    }
  };

  const getCircleScale = () => {
    const progress = timer / PHASE_DURATIONS[phase];
    if (phase === 'inhale') {
      return 1 + progress * 0.8; // Scale from 1 to 1.8
    } else if (phase === 'exhale') {
      return 1.8 - progress * 0.8; // Scale from 1.8 to 1
    } else if (phase === 'hold') {
      return 1.8; // Stay at max
    }
    return 1;
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-500/20 border-blue-500';
      case 'hold':
        return 'bg-purple-500/20 border-purple-500';
      case 'exhale':
        return 'bg-green-500/20 border-green-500';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/10 ring-4 ring-primary/5 shadow-xl backdrop-blur-sm">
              <Wind className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground drop-shadow-sm">{t.breathing.title}</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">{t.breathing.subtitle}</p>
        </div>

        {/* Main breathing visualizer */}
        <div className="glass-card-lg p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            {/* Animated breathing circle */}
            <div className="relative flex items-center justify-center h-64 w-64 md:h-80 md:w-80">
              <div
                className={`absolute rounded-full border-4 ease-in-out shadow-2xl ${getCircleColor()}`}
                style={{
                  width: `${240 * getCircleScale()}px`,
                  height: `${240 * getCircleScale()}px`,
                  transition: phase === 'inhale' ? 'all 4s ease-in-out' :
                    phase === 'hold' ? 'all 7s ease-in-out' :
                      phase === 'exhale' ? 'all 8s ease-in-out' :
                        'all 1s ease-in-out'
                }}
                data-testid="breathing-circle"
              />
              <div className="absolute text-center z-10">
                <div className="text-2xl md:text-3xl font-heading font-bold mb-2 drop-shadow-sm" data-testid="text-phase">
                  {getPhaseText()}
                </div>
                {isActive && (
                  <div className="text-6xl md:text-7xl font-mono tabular-nums font-bold text-primary drop-shadow-md" data-testid="text-timer">
                    {Math.ceil(PHASE_DURATIONS[phase] - timer)}
                  </div>
                )}
              </div>
            </div>

            {/* Instruction text */}
            <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl font-light leading-relaxed" data-testid="text-instruction">
              {getPhaseInstruction()}
            </p>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                  data-testid="button-start"
                >
                  <Play className="h-6 w-6 mr-2" />
                  {t.breathing.start}
                </Button>
              ) : (
                <>
                  {!isPaused ? (
                    <Button
                      onClick={handlePause}
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 text-lg shadow-md hover:shadow-lg transition-all"
                      data-testid="button-pause"
                    >
                      <Pause className="h-6 w-6 mr-2" />
                      {t.breathing.pause}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleResume}
                      size="lg"
                      className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                      data-testid="button-resume"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      {t.breathing.resume}
                    </Button>
                  )}
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    size="lg"
                    className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                    data-testid="button-stop"
                  >
                    <Square className="h-6 w-6 mr-2" />
                    {t.breathing.stop}
                  </Button>
                </>
              )}
            </div>

            {/* Cycles counter */}
            {cyclesCompleted > 0 && (
              <div className="flex items-center gap-3 text-xl md:text-2xl bg-green-50/50 px-6 py-4 rounded-xl border border-green-200/50" data-testid="text-cycles">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <span className="font-semibold">{t.breathing.cycles_completed}: {cyclesCompleted}</span>
              </div>
            )}
          </div>
        </div>

        {/* Information cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 space-y-6 hover-elevate">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Wind className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-heading font-semibold">{t.breathing.how_it_works}</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.breathing.how_description}
            </p>
            <div className="p-5 bg-primary/10 rounded-xl border border-primary/20 backdrop-blur-sm">
              <p className="text-base font-medium text-foreground">
                💡 {t.breathing.tip}
              </p>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6 hover-elevate">
            <h2 className="text-2xl font-heading font-semibold">{t.breathing.benefits_title}</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-base">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{t.breathing.benefit_1}</span>
              </li>
              <li className="flex items-start gap-3 text-base">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{t.breathing.benefit_2}</span>
              </li>
              <li className="flex items-start gap-3 text-base">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{t.breathing.benefit_3}</span>
              </li>
              <li className="flex items-start gap-3 text-base">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{t.breathing.benefit_4}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
