import { BrainGames } from '../BrainGames';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function BrainGamesExample() {
  return (
    <LanguageProvider>
      <div className="p-8">
        <BrainGames />
      </div>
    </LanguageProvider>
  );
}