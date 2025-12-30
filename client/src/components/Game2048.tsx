import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Game2048Props {
    onGameComplete: (score: number) => void;
}

type Grid = number[][];

export function Game2048({ onGameComplete }: Game2048Props) {
    const { t } = useLanguage();
    const [grid, setGrid] = useState<Grid>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const initializeGame = useCallback(() => {
        const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        setGameWon(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const addRandomTile = (currentGrid: Grid) => {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (currentGrid[i][j] === 0) {
                    emptyCells.push({ r: i, c: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver || gameWon) return;

        let moved = false;
        const newGrid = grid.map(row => [...row]);
        let scoreToAdd = 0;

        const rotateGrid = (g: Grid) => g[0].map((_, i) => g.map(row => row[i]).reverse());
        const rotateGridCounter = (g: Grid) => g[0].map((_, i) => g.map(row => row[row.length - 1 - i]));

        // Normalize to 'left' movement logic
        if (direction === 'up') {
            // Rotate -90 deg
            const rotated = rotateGridCounter(newGrid);
            const { moved: m, grid: g, score: s } = slideLeft(rotated);
            if (m) {
                moved = true;
                // Rotate back +90 deg
                const final = rotateGrid(g);
                for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) newGrid[i][j] = final[i][j];
                scoreToAdd = s;
            }
        } else if (direction === 'right') {
            // Rotate 180
            const rotated = rotateGrid(rotateGrid(newGrid));
            const { moved: m, grid: g, score: s } = slideLeft(rotated);
            if (m) {
                moved = true;
                // Rotate back 180
                const final = rotateGrid(rotateGrid(g));
                for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) newGrid[i][j] = final[i][j];
                scoreToAdd = s;
            }
        } else if (direction === 'down') {
            // Rotate +90 deg
            const rotated = rotateGrid(newGrid);
            const { moved: m, grid: g, score: s } = slideLeft(rotated);
            if (m) {
                moved = true;
                // Rotate back -90 deg
                const final = rotateGridCounter(g);
                for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) newGrid[i][j] = final[i][j];
                scoreToAdd = s;
            }
        } else {
            // Left
            const { moved: m, grid: g, score: s } = slideLeft(newGrid);
            if (m) {
                moved = true;
                for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) newGrid[i][j] = g[i][j];
                scoreToAdd = s;
            }
        }

        if (moved) {
            addRandomTile(newGrid);
            setGrid(newGrid);
            setScore(prev => prev + scoreToAdd);

            if (checkWin(newGrid) && !gameWon) {
                setGameWon(true);
                onGameComplete(score + scoreToAdd);
            } else if (checkGameOver(newGrid)) {
                setGameOver(true);
                onGameComplete(score + scoreToAdd);
            }
        }
    }, [grid, gameOver, gameWon, onGameComplete, score]);

    const slideLeft = (currentGrid: Grid) => {
        let moved = false;
        let score = 0;

        for (let i = 0; i < 4; i++) {
            let row = currentGrid[i].filter(val => val !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row[j + 1] = 0;
                    moved = true;
                }
            }
            row = row.filter(val => val !== 0);
            while (row.length < 4) row.push(0);

            if (row.join(',') !== currentGrid[i].join(',')) {
                moved = true;
            }
            currentGrid[i] = row;
        }

        return { moved, grid: currentGrid, score };
    };

    const checkWin = (g: Grid) => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (g[i][j] === 2048) return true;
            }
        }
        return false;
    };

    const checkGameOver = (g: Grid) => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (g[i][j] === 0) return false;
                if (i < 3 && g[i][j] === g[i + 1][j]) return false;
                if (j < 3 && g[i][j] === g[i][j + 1]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                move(e.key.replace('Arrow', '').toLowerCase() as any);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    const getTileColor = (value: number) => {
        const colors: Record<number, string> = {
            2: 'bg-slate-100 text-slate-800',
            4: 'bg-slate-200 text-slate-800',
            8: 'bg-orange-100 text-orange-800',
            16: 'bg-orange-200 text-orange-800',
            32: 'bg-orange-300 text-orange-900',
            64: 'bg-orange-400 text-white',
            128: 'bg-orange-500 text-white',
            256: 'bg-orange-600 text-white',
            512: 'bg-yellow-400 text-white',
            1024: 'bg-yellow-500 text-white',
            2048: 'bg-yellow-600 text-white',
        };
        return colors[value] || 'bg-slate-800 text-white';
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">2048</h2>
                <p className="text-muted-foreground">
                    {t.games?.game_2048_desc || "Join the numbers and get to the 2048 tile!"}
                </p>
            </div>

            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-xl">{score}</span>
                </div>
                <Button variant="outline" size="sm" onClick={initializeGame}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t.games?.restart || "Restart"}
                </Button>
            </div>

            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                    <div className="relative bg-slate-300 rounded-lg p-2 aspect-square">
                        {/* Grid Background */}
                        <div className="grid grid-cols-4 gap-2 h-full w-full absolute inset-0 p-2">
                            {Array(16).fill(0).map((_, i) => (
                                <div key={i} className="bg-slate-200 rounded-md w-full h-full" />
                            ))}
                        </div>

                        {/* Tiles */}
                        <div className="grid grid-cols-4 gap-2 h-full w-full relative z-10">
                            {grid.map((row, i) => (
                                row.map((val, j) => (
                                    <div key={`${i}-${j}`} className="w-full h-full flex items-center justify-center">
                                        <AnimatePresence mode='popLayout'>
                                            {val !== 0 && (
                                                <motion.div
                                                    layoutId={`tile-${i}-${j}`}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    className={`w-full h-full flex items-center justify-center rounded-md font-bold text-2xl shadow-sm ${getTileColor(val)}`}
                                                >
                                                    {val}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            ))}
                        </div>

                        {/* Game Over / Win Overlay */}
                        {(gameOver || gameWon) && (
                            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                                <h3 className="text-3xl font-bold mb-4">
                                    {gameWon ? (t.games?.you_won || "You Won!") : (t.games?.game_over || "Game Over!")}
                                </h3>
                                <Button onClick={initializeGame} size="lg">
                                    {t.games?.play_again || "Play Again"}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
                <div />
                <Button variant="outline" size="icon" onClick={() => move('up')}>
                    <ArrowUp className="h-6 w-6" />
                </Button>
                <div />
                <Button variant="outline" size="icon" onClick={() => move('left')}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => move('down')}>
                    <ArrowDown className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => move('right')}>
                    <ArrowRight className="h-6 w-6" />
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground hidden md:block">
                {t.games?.use_arrow_keys || "Use arrow keys to move tiles"}
            </p>
        </div>
    );
}
