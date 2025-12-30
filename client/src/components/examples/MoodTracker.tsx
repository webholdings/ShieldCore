import { MoodTracker } from '../MoodTracker';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function MoodTrackerExample() {
  return (
    <LanguageProvider>
      <div className="p-8">
        <MoodTracker />
      </div>
    </LanguageProvider>
  );
}