import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface NumberGameProps {
  onGameComplete?: () => void;
}

export function NumberGame({ onGameComplete }: NumberGameProps) {
  const { t } = useLanguage();
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSequence, setShowSequence] = useState(false);

  const startGame = () => {
    const newSequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
    setSequence(newSequence);
    setUserInput('');
    setShowSequence(true);
    setGameStarted(true);
    
    setTimeout(() => setShowSequence(false), 3000);
  };

  const checkAnswer = () => {
    const answer = userInput.split('').map(Number);
    if (JSON.stringify(answer) === JSON.stringify(sequence)) {
      if (score === 0 && onGameComplete) {
        onGameComplete();
      }
      setScore(score + 1);
      startGame();
    } else {
      setGameStarted(false);
      setScore(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">{t.games.number_sequence}</h3>
        <div className="text-xl font-semibold">
          {t.games.score}: <span className="text-primary">{score}</span>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center space-y-4 py-12">
          <p className="text-muted-foreground text-lg">{t.games.memorize_sequence_desc}</p>
          <Button onClick={startGame} size="lg" data-testid="button-start-number">
            {t.games.start}
          </Button>
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 space-y-6">
            {showSequence ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">{t.games.memorize_this_sequence}</p>
                <p className="text-5xl font-bold tracking-widest">
                  {sequence.join(' ')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">{t.games.enter_sequence}</p>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center text-3xl font-bold p-4 rounded-md border-2 border-primary/20 bg-background focus:outline-none focus:border-primary"
                  maxLength={sequence.length}
                  placeholder="?"
                  data-testid="input-number-sequence"
                  autoFocus
                />
                <Button 
                  onClick={checkAnswer}
                  variant="confirm"
                  className="w-full h-12"
                  disabled={userInput.length !== sequence.length}
                  data-testid="button-submit-sequence"
                >
                  {t.games.submit}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}