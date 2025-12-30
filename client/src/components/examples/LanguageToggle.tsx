import { LanguageToggle } from '../LanguageToggle';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function LanguageToggleExample() {
  return (
    <LanguageProvider>
      <div className="p-8 flex justify-center">
        <LanguageToggle />
      </div>
    </LanguageProvider>
  );
}