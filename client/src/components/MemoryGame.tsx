import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const cardSymbols = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🏵️', '🌿'];

interface MemoryGameProps {
  onGameComplete?: () => void;
}

export function MemoryGame({ onGameComplete }: MemoryGameProps) {
  const { t } = useLanguage();
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = [...cardSymbols, ...cardSymbols]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setHasCompleted(false);
  };

  // Call onGameComplete when all cards are matched
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length && !hasCompleted && onGameComplete) {
      setHasCompleted(true);
      onGameComplete();
    }
  }, [matched, cards.length, hasCompleted, onGameComplete]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setScore(score + 10);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">{t.games.memory_match}</h3>
        <div className="text-xl font-semibold">
          {t.games.score}: <span className="text-primary">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((symbol, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <Card
              key={index}
              className={`aspect-square cursor-pointer transition-all hover-elevate ${isFlipped ? 'bg-primary/10' : ''
                }`}
              onClick={() => handleCardClick(index)}
              data-testid={`card-${index}`}
            >
              <CardContent className="p-0 h-full flex items-center justify-center">
                {isFlipped ? (
                  <span className="text-4xl">{symbol}</span>
                ) : (
                  <div className="w-full h-full bg-secondary/50 rounded-md" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {matched.length === cards.length && (
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold text-primary">{t.games.congratulations}</p>
          <Button onClick={initGame} size="lg" data-testid="button-play-again">
            {t.games.play_again}
          </Button>
        </div>
      )}
    </div>
  );
}