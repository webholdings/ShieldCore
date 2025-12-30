import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReactionGameProps {
  onGameComplete?: () => void;
}

export function ReactionGame({ onGameComplete }: ReactionGameProps) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'clicked'>('idle');
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    setGameState('waiting');
    const delay = 2000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('idle');
      return;
    }

    if (gameState === 'ready') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      if (attempts.length === 0 && onGameComplete) {
        onGameComplete();
      }
      setAttempts([...attempts, time]);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      setGameState('clicked');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const avgTime = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">{t.games.reaction_time}</h3>
        {bestTime && (
          <div className="text-lg font-semibold">
            {t.games.best}: <span className="text-primary">{bestTime}ms</span>
          </div>
        )}
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 space-y-6">
          {gameState === 'idle' && (
            <div className="text-center space-y-4 py-8">
              <p className="text-muted-foreground">{t.games.click_violet_screen}</p>
              <Button onClick={startGame} size="lg" data-testid="button-start-reaction">
                {t.games.start}
              </Button>
              {attempts.length > 0 && (
                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="text-sm text-muted-foreground">{t.games.average}: {avgTime}ms</div>
                  <div className="text-sm text-muted-foreground">{t.games.attempts}: {attempts.length}</div>
                </div>
              )}
            </div>
          )}

          {gameState === 'waiting' && (
            <div
              className="h-64 bg-destructive/20 rounded-md flex items-center justify-center cursor-pointer"
              onClick={handleClick}
              data-testid="reaction-waiting"
            >
              <p className="text-xl font-semibold">{t.games.wait_for_violet}</p>
            </div>
          )}

          {gameState === 'ready' && (
            <div
              className="h-64 bg-chart-2 rounded-md flex items-center justify-center cursor-pointer"
              onClick={handleClick}
              data-testid="reaction-ready"
            >
              <p className="text-2xl font-bold text-background">{t.games.click_now}</p>
            </div>
          )}

          {gameState === 'clicked' && (
            <div className="text-center space-y-4 py-8">
              <p className="text-4xl font-bold text-primary">{reactionTime}ms</p>
              <p className="text-muted-foreground">
                {reactionTime < 200 ? t.games.feedback_incredible :
                 reactionTime < 300 ? t.games.feedback_great :
                 reactionTime < 400 ? t.games.feedback_good : t.games.feedback_keep_practicing}
              </p>
              <Button onClick={startGame} size="lg" data-testid="button-try-again">
                {t.games.try_again}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}