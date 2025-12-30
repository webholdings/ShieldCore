import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { wordAssociations, type WordPair } from '@shared/wordAssociations';

type Difficulty = 'easy' | 'medium' | 'hard';

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface WordGameProps {
  onGameComplete?: () => void;
}

export function WordGame({ onGameComplete }: WordGameProps) {
  const { t, language } = useLanguage();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [shuffledPairs, setShuffledPairs] = useState<WordPair[]>([]);
  const [currentPair, setCurrentPair] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Shuffle pairs when language or difficulty changes
  const reshufflePairs = (lang: string, diff: Difficulty) => {
    const langPairs = wordAssociations[lang] || wordAssociations['en'];
    const filteredPairs = langPairs.filter(pair => pair.difficulty === diff);
    setShuffledPairs(shuffleArray(filteredPairs));
    setCurrentPair(0);
    setScore(0);
    setShowResult(false);
  };

  // Initialize and reset game when language or difficulty changes
  useEffect(() => {
    reshufflePairs(language, difficulty);
  }, [language, difficulty]);

  const handleAnswer = (answer: boolean) => {
    if (shuffledPairs.length === 0) return;
    
    const correct = answer === shuffledPairs[currentPair].related;
    setIsCorrect(correct);
    if (correct) {
      if (score === 0 && onGameComplete) {
        onGameComplete();
      }
      setScore(score + 1);
    }
    
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      if (currentPair < shuffledPairs.length - 1) {
        setCurrentPair(currentPair + 1);
      } else {
        // Game completed - reshuffle with same difficulty
        reshufflePairs(language, difficulty);
      }
    }, 1000);
  };

  if (shuffledPairs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground">{t.games.loading_word_pairs}</p>
        </div>
      </div>
    );
  }

  const pair = shuffledPairs[currentPair];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-2xl font-semibold">{t.games.word_association}</h3>
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">
            {t.games.score}: <span className="text-primary">{score}</span>
          </div>
          <Badge variant="outline" className="text-base">
            {currentPair + 1} / {shuffledPairs.length}
          </Badge>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={difficulty === 'easy' ? 'default' : 'outline'}
          onClick={() => setDifficulty('easy')}
          className="min-w-24"
          data-testid="button-difficulty-easy"
        >
          {t.games.difficulty_easy}
        </Button>
        <Button
          variant={difficulty === 'medium' ? 'default' : 'outline'}
          onClick={() => setDifficulty('medium')}
          className="min-w-24"
          data-testid="button-difficulty-medium"
        >
          {t.games.difficulty_medium}
        </Button>
        <Button
          variant={difficulty === 'hard' ? 'default' : 'outline'}
          onClick={() => setDifficulty('hard')}
          className="min-w-24"
          data-testid="button-difficulty-hard"
        >
          {t.games.difficulty_hard}
        </Button>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">{t.games.are_words_related}</p>
            <div className="flex justify-center gap-8 items-center">
              <span className="text-3xl font-semibold">{pair.word1}</span>
              <span className="text-2xl text-muted-foreground">↔</span>
              <span className="text-3xl font-semibold">{pair.word2}</span>
            </div>
          </div>

          {showResult ? (
            <div className="text-center py-4">
              <p className={`text-2xl font-semibold ${
                isCorrect ? 'text-primary' : 'text-destructive'
              }`}>
                {isCorrect ? `✓ ${t.games.correct}` : `✗ ${t.games.incorrect}`}
              </p>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                className="flex-1 h-14"
                data-testid="button-word-yes"
              >
                {t.games.yes}
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                variant="secondary"
                className="flex-1 h-14"
                data-testid="button-word-no"
              >
                {t.games.no}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}