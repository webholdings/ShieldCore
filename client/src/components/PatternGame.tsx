import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const colors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4'];

interface PatternGameProps {
  onGameComplete?: () => void;
}

export function PatternGame({ onGameComplete }: PatternGameProps) {
  const { t } = useLanguage();
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    const newPattern = [Math.floor(Math.random() * 4)];
    setPattern(newPattern);
    setUserPattern([]);
    setScore(0);
    setGameStarted(true);
    playPattern(newPattern);
  };

  const playPattern = async (currentPattern: number[]) => {
    setIsPlaying(true);
    for (const index of currentPattern) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveIndex(index);
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveIndex(null);
    }
    setIsPlaying(false);
  };

  const handleColorClick = (index: number) => {
    if (isPlaying) return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);

    if (pattern[newUserPattern.length - 1] !== index) {
      console.log('Game Over! Score:', score);
      setGameStarted(false);
      return;
    }

    if (newUserPattern.length === pattern.length) {
      const newPattern = [...pattern, Math.floor(Math.random() * 4)];
      setPattern(newPattern);
      setUserPattern([]);
      if (score === 0 && onGameComplete) {
        onGameComplete();
      }
      setScore(score + 1);
      setTimeout(() => playPattern(newPattern), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">{t.games.pattern_sequence}</h3>
        <div className="text-xl font-semibold">
          {t.games.score}: <span className="text-primary">{score}</span>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center space-y-4 py-12">
          <p className="text-muted-foreground text-lg">{t.games.pattern_desc}</p>
          <Button onClick={startGame} size="lg" data-testid="button-start-pattern">
            {t.games.start}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {colors.map((color, index) => (
            <Card
              key={index}
              className={`aspect-square cursor-pointer transition-all hover-elevate ${color} ${
                activeIndex === index ? 'ring-4 ring-primary scale-95' : ''
              }`}
              onClick={() => handleColorClick(index)}
              data-testid={`pattern-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}