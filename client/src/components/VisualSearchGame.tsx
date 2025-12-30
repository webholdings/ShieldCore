import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const symbols = ['○', '△', '□', '◇', '☆'];
const colors = ['text-chart-1', 'text-chart-2', 'text-chart-3', 'text-chart-4', 'text-chart-5'];

interface VisualSearchGameProps {
  onGameComplete?: () => void;
}

export function VisualSearchGame({ onGameComplete }: VisualSearchGameProps) {
  const { t } = useLanguage();
  const [grid, setGrid] = useState<{ symbol: string; color: string }[]>([]);
  const [target, setTarget] = useState({ symbol: '', color: '' });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    generateNewRound();
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
  };

  const generateNewRound = () => {
    const targetSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    setTarget({ symbol: targetSymbol, color: targetColor });

    const newGrid = Array.from({ length: 20 }, (_, i) => {
      if (i === Math.floor(Math.random() * 20)) {
        return { symbol: targetSymbol, color: targetColor };
      }
      return {
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
    setGrid(newGrid);
  };

  const handleClick = (index: number) => {
    if (!gameStarted) return;
    
    const item = grid[index];
    if (item.symbol === target.symbol && item.color === target.color) {
      if (score === 0 && onGameComplete) {
        onGameComplete();
      }
      setScore(score + 1);
      generateNewRound();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">{t.games.visual_search}</h3>
        <div className="flex gap-4 items-center">
          <div className="text-lg font-semibold">{t.games.time}: {timeLeft}s</div>
          <div className="text-lg font-semibold">
            {t.games.score}: <span className="text-primary">{score}</span>
          </div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center space-y-4 py-12">
          <p className="text-muted-foreground text-lg">{t.games.find_matching_symbol}</p>
          <Button onClick={startGame} size="lg" data-testid="button-start-visual">
            {t.games.start}
          </Button>
        </div>
      ) : (
        <>
          <Card className="p-6 bg-primary/5">
            <p className="text-center text-sm text-muted-foreground mb-2">{t.games.find_this}</p>
            <div className="text-center">
              <span className={`text-6xl ${target.color}`}>{target.symbol}</span>
            </div>
          </Card>

          <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
            {grid.map((item, index) => (
              <Card
                key={index}
                className="aspect-square cursor-pointer hover-elevate flex items-center justify-center"
                onClick={() => handleClick(index)}
                data-testid={`visual-item-${index}`}
              >
                <span className={`text-4xl ${item.color}`}>{item.symbol}</span>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}