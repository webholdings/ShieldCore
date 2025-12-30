import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, RotateCcw, Check, X, Timer, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorMatchGameProps {
    onGameComplete: (score: number) => void;
}

type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

const COLORS: { [key in ColorType]: string } = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
};

const BG_COLORS: { [key in ColorType]: string } = {
    red: 'bg-red-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
};

export function ColorMatchGame({ onGameComplete }: ColorMatchGameProps) {
    const { t } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentWord, setCurrentWord] = useState<ColorType>('red');
    const [currentColor, setCurrentColor] = useState<ColorType>('red');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    const generateRound = useCallback(() => {
        const colors = Object.keys(COLORS) as ColorType[];
        const randomWord = colors[Math.floor(Math.random() * colors.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // 50% chance of matching to make it tricky
        if (Math.random() > 0.5) {
            setCurrentColor(randomWord);
        } else {
            setCurrentColor(randomColor);
        }
        setCurrentWord(randomWord);
    }, []);

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(30);
        setGameOver(false);
        generateRound();
    };

    const handleAnswer = (match: boolean) => {
        if (!isPlaying) return;

        const isMatch = currentWord === currentColor;
        const isCorrect = match === isMatch;

        if (isCorrect) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setScore(prev => Math.max(0, prev - 5));
            setFeedback('wrong');
        }

        setTimeout(() => setFeedback(null), 500);
        generateRound();
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            setGameOver(true);
            onGameComplete(score);
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft, onGameComplete, score]);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{t.games?.color_match || "Color Match"}</h2>
                <p className="text-muted-foreground">
                    {t.games?.color_match_desc || "Does the meaning of the word match the color of the text?"}
                </p>
            </div>

            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-xl">{score}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-500" />
                    <span className={`font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : ''}`}>
                        {timeLeft}s
                    </span>
                </div>
            </div>

            <Card className="min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 flex items-center justify-center z-10 ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}
                        >
                            {feedback === 'correct' ? (
                                <Check className="h-24 w-24 text-green-500" />
                            ) : (
                                <X className="h-24 w-24 text-red-500" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <CardContent className="p-8 w-full flex flex-col items-center gap-8">
                    {!isPlaying && !gameOver ? (
                        <div className="text-center space-y-6">
                            <div className="p-6 bg-primary/5 rounded-full mx-auto w-fit">
                                <Play className="h-12 w-12 text-primary" />
                            </div>
                            <Button size="lg" onClick={startGame} className="w-full max-w-xs">
                                {t.games?.start_game || "Start Game"}
                            </Button>
                        </div>
                    ) : gameOver ? (
                        <div className="text-center space-y-6">
                            <h3 className="text-2xl font-bold">{t.games?.game_over || "Game Over!"}</h3>
                            <p className="text-xl">
                                {t.games?.final_score || "Final Score"}: <span className="font-bold text-primary">{score}</span>
                            </p>
                            <Button size="lg" onClick={startGame} className="gap-2">
                                <RotateCcw className="h-4 w-4" />
                                {t.games?.play_again || "Play Again"}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                key={`${currentWord}-${currentColor}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <h1 className={`text-6xl font-black tracking-wider ${COLORS[currentColor]}`}>
                                    {(t.colors && (t.colors as any)[currentWord]) || currentWord.toUpperCase()}
                                </h1>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-8">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-20 text-xl border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                                    onClick={() => handleAnswer(false)}
                                >
                                    <X className="mr-2 h-6 w-6" />
                                    {t.common?.no || "No"}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-20 text-xl border-green-200 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors"
                                    onClick={() => handleAnswer(true)}
                                >
                                    <Check className="mr-2 h-6 w-6" />
                                    {t.common?.yes || "Yes"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
