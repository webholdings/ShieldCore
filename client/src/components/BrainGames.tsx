import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Lightbulb, MessageSquare, Hash, Eye, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { MemoryGame } from './MemoryGame';
import { PatternGame } from './PatternGame';
import { WordGame } from './WordGame';
import { NumberGame } from './NumberGame';
import { VisualSearchGame } from './VisualSearchGame';
import { ReactionGame } from './ReactionGame';
import { ColorMatchGame } from './ColorMatchGame';
import { Game2048 } from './Game2048';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

type GameType = 'memory' | 'pattern' | 'word' | 'number' | 'visual' | 'reaction' | 'color' | '2048' | 'sudoku' | null;

interface GameMetadata {
  id: GameType;
  titleKey: string;
  descKey: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  testId: string;
}

export function BrainGames() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const games: GameMetadata[] = [
    {
      id: 'memory',
      titleKey: 'memory_match',
      descKey: 'memory_desc',
      icon: Brain,
      colorClass: 'text-chart-1',
      bgClass: 'bg-chart-1/10',
      testId: 'card-game-memory'
    },
    {
      id: 'pattern',
      titleKey: 'pattern_sequence',
      descKey: 'pattern_desc',
      icon: Lightbulb,
      colorClass: 'text-chart-2',
      bgClass: 'bg-chart-2/10',
      testId: 'card-game-pattern'
    },
    {
      id: 'word',
      titleKey: 'word_association',
      descKey: 'word_desc',
      icon: MessageSquare,
      colorClass: 'text-chart-3',
      bgClass: 'bg-chart-3/10',
      testId: 'card-game-word'
    },
    {
      id: 'number',
      titleKey: 'number_sequence',
      descKey: 'number_desc',
      icon: Hash,
      colorClass: 'text-chart-4',
      bgClass: 'bg-chart-4/10',
      testId: 'card-game-number'
    },
    {
      id: 'visual',
      titleKey: 'visual_search',
      descKey: 'visual_desc',
      icon: Eye,
      colorClass: 'text-chart-5',
      bgClass: 'bg-chart-5/10',
      testId: 'card-game-visual'
    },
    {
      id: 'reaction',
      titleKey: 'reaction_time',
      descKey: 'reaction_desc',
      icon: Zap,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
      testId: 'card-game-reaction'
    },
    {
      id: 'color',
      titleKey: 'color_match',
      descKey: 'color_match_desc',
      icon: Eye, // Reusing Eye or could import Palette if available
      colorClass: 'text-pink-500',
      bgClass: 'bg-pink-100',
      testId: 'card-game-color'
    },
    {
      id: 'sudoku',
      titleKey: 'sudoku',
      descKey: 'sudoku_desc',
      icon: Hash,
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-100',
      testId: 'card-game-sudoku'
    },
    {
      id: '2048',
      titleKey: 'game_2048',
      descKey: 'game_2048_desc',
      icon: Hash,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-100',
      testId: 'card-game-2048'
    }
  ];

  const totalPages = Math.ceil(games.length / itemsPerPage);
  const currentGames = games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Scroll to top when a game is opened
  useEffect(() => {
    if (activeGame) {
      // Find the main scrolling container and scroll it to top
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Fallback to window scroll if main element not found
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeGame]);

  const completeDailyTaskMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/daily-plan/complete-task', { task: 'game' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-plan'] });
    }
  });

  const handleGameComplete = () => {
    // Mark daily task as complete when any game is finished
    completeDailyTaskMutation.mutate();
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (activeGame) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => setActiveGame(null)}
          data-testid="button-back-to-games"
        >
          ← {t.games.back_to_games}
        </Button>

        <Card className="glass-card-lg border-0">
          <CardContent className="p-8">
            {activeGame === 'memory' && <MemoryGame onGameComplete={handleGameComplete} />}
            {activeGame === 'pattern' && <PatternGame onGameComplete={handleGameComplete} />}
            {activeGame === 'word' && <WordGame onGameComplete={handleGameComplete} />}
            {activeGame === 'number' && <NumberGame onGameComplete={handleGameComplete} />}
            {activeGame === 'visual' && <VisualSearchGame onGameComplete={handleGameComplete} />}
            {activeGame === 'reaction' && <ReactionGame onGameComplete={handleGameComplete} />}
            {activeGame === 'color' && <ColorMatchGame onGameComplete={handleGameComplete} />}
            {activeGame === '2048' && <Game2048 onGameComplete={handleGameComplete} />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">{t.games.title}</h2>
        <p className="text-lg md:text-xl text-muted-foreground">{t.games.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {currentGames.map((game) => {
          const Icon = game.icon;
          return (
            <Card
              key={game.id}
              className="glass-card border-0 hover-elevate cursor-pointer transition-all bg-white/40 hover:bg-white/60"
              onClick={() => {
                if (game.id === 'sudoku') {
                  setLocation('/games/sudoku');
                } else {
                  setActiveGame(game.id);
                }
              }}
              data-testid={game.testId}
            >
              <CardContent className="p-8 space-y-4">
                <div className={`p-4 rounded-full ${game.bgClass} w-fit mx-auto`}>
                  <Icon className={`h-10 w-10 ${game.colorClass}`} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{(t.games as any)[game.titleKey]}</h3>
                  <p className="text-muted-foreground">{(t.games as any)[game.descKey]}</p>
                </div>
                <Button className="w-full h-12 shadow-md" data-testid={`button-play-${game.id}`}>
                  {t.games.play_game}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {t.common?.page || "Page"} {currentPage} {t.common?.of_total || "of"} {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    </div >
  );
}