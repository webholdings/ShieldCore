import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Check, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import confetti from 'canvas-confetti';

// Simple Sudoku generator and solver
// For brevity, using a pre-filled valid board and masking it
// In a real app, use a proper Sudoku generation algorithm

const INITIAL_BOARD = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

export default function Sudoku() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [board, setBoard] = useState<number[][]>(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [mistakes, setMistakes] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const handleNumberClick = (num: number) => {
        if (!selectedCell || isComplete) return;
        const [row, col] = selectedCell;

        // If cell is already filled (from initial board), don't change
        if (INITIAL_BOARD[row][col] !== 0) return;

        const newBoard = [...board];
        newBoard[row][col] = num;
        setBoard(newBoard);

        // Check if correct
        if (num !== SOLUTION[row][col]) {
            setMistakes(prev => prev + 1);
            toast({
                variant: "destructive",
                title: t.games.incorrect,
                description: t.games.incorrect, // Or a more specific message if available
                duration: 1000
            });
        } else {
            // Check for win
            checkWin(newBoard);
        }
    };

    const checkWin = (currentBoard: number[][]) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j] !== SOLUTION[i][j]) return;
            }
        }
        setIsComplete(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Save score
        apiRequest('POST', '/api/games/score', {
            gameType: 'sudoku',
            score: 100 - (mistakes * 5) // Deduct points for mistakes
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
            toast({
                title: t.games.sudoku + " " + t.games.completed,
                description: t.games.congratulations,
            });
        });
    };

    const resetGame = () => {
        setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
        setMistakes(0);
        setIsComplete(false);
        setSelectedCell(null);
    };

    return (
        <div className="min-h-screen bg-background p-4 flex flex-col items-center">
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/games">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">{t.games.sudoku}</h1>
                    <Button variant="ghost" size="icon" onClick={resetGame}>
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>

                <Card className="glass-card border-0">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-9 gap-0.5 bg-muted border-2 border-muted rounded-lg overflow-hidden">
                            {board.map((row, rowIndex) => (
                                row.map((cell, colIndex) => {
                                    const isInitial = INITIAL_BOARD[rowIndex][colIndex] !== 0;
                                    const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                                    const isError = cell !== 0 && cell !== SOLUTION[rowIndex][colIndex];

                                    // Border logic for 3x3 grids
                                    const borderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-r-muted-foreground/20' : '';
                                    const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-b-muted-foreground/20' : '';

                                    return (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`
                        aspect-square flex items-center justify-center text-lg font-medium cursor-pointer transition-colors
                        ${isInitial ? 'bg-muted/30 text-foreground' : 'bg-background text-primary'}
                        ${isSelected ? 'bg-primary/20' : ''}
                        ${isError ? 'text-destructive bg-destructive/10' : ''}
                        ${borderRight} ${borderBottom}
                      `}
                                            onClick={() => setSelectedCell([rowIndex, colIndex])}
                                        >
                                            {cell !== 0 ? cell : ''}
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center text-sm text-muted-foreground px-2">
                    <span>{t.games.mistakes}: {mistakes}/3</span>
                    <span>{t.games.difficulty_medium}</span>
                </div>

                <div className="grid grid-cols-9 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Button
                            key={num}
                            variant="outline"
                            className="h-12 p-0 text-lg font-semibold"
                            onClick={() => handleNumberClick(num)}
                            disabled={isComplete || mistakes >= 3}
                        >
                            {num}
                        </Button>
                    ))}
                </div>

                {isComplete && (
                    <Card className="bg-green-500/10 border-green-500/20">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <Trophy className="h-12 w-12 text-green-500 mb-2" />
                            <h3 className="text-xl font-bold text-green-700 dark:text-green-400">{t.games.puzzle_solved}</h3>
                            <p className="text-muted-foreground mb-4">{t.games.mastered_sudoku}</p>
                            <Link href="/games">
                                <Button className="w-full">{t.games.back_to_games}</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
