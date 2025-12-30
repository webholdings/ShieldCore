import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en' as const, name: 'English', shortName: 'EN', flag: '🇬🇧' },
  { code: 'de' as const, name: 'Deutsch', shortName: 'DE', flag: '🇩🇪' },
  { code: 'fr' as const, name: 'Français', shortName: 'FR', flag: '🇫🇷' },
  { code: 'pt' as const, name: 'Português', shortName: 'PT', flag: '🇧🇷' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-1 md:gap-2 min-w-0 md:min-w-[100px]"
          data-testid="button-language-toggle"
        >
          <span className="text-lg">{currentLang?.flag}</span>
          <span className="hidden md:inline font-medium">{currentLang?.name}</span>
          <span className="md:hidden font-medium">{currentLang?.shortName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            data-testid={`language-option-${lang.code}`}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-xl">{lang.flag}</span>
            <span className={language === lang.code ? 'font-semibold' : ''}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}