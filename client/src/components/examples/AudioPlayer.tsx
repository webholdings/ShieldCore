import { AudioPlayer } from '../AudioPlayer';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function AudioPlayerExample() {
  return (
    <LanguageProvider>
      <div className="p-8">
        <AudioPlayer />
      </div>
    </LanguageProvider>
  );
}