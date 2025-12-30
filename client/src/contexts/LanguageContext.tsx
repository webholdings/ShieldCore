import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { translations, type Language } from '@/lib/i18n';
import type { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';

  const supportedLanguages: Language[] = ['en', 'de', 'fr', 'pt'];

  // Check navigator.languages first (ordered preferences)
  if (navigator.languages && navigator.languages.length > 0) {
    for (const lang of navigator.languages) {
      const code = lang.split('-')[0].toLowerCase();
      if (supportedLanguages.includes(code as Language)) {
        return code as Language;
      }
    }
  }

  // Fallback to navigator.language
  const browserLang = navigator.language.toLowerCase();

  // Explicitly handle Portuguese variants to default to PT-BR (which is 'pt' in our app)
  if (browserLang === 'pt-pt' || browserLang === 'pt-br') {
    return 'pt';
  }

  const code = browserLang.split('-')[0];
  return supportedLanguages.includes(code as Language)
    ? (code as Language)
    : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const hasManuallySet = useRef(false);
  const queryClient = useQueryClient();

  const supportedLanguages: Language[] = ['en', 'de', 'fr', 'pt'];

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    // Validate saved language is actually supported
    if (saved && supportedLanguages.includes(saved as Language)) {
      hasManuallySet.current = true;
      return saved as Language;
    }
    // Clear invalid language from localStorage
    if (saved) {
      localStorage.removeItem('language');
    }
    return getBrowserLanguage();
  });

  const { data: user } = useQuery<User | undefined>({
    queryKey: ['/api/user'],
  });

  const updateLanguageMutation = useMutation({
    mutationFn: async (lang: Language) => {
      return await apiRequest('PATCH', '/api/user/language', { language: lang });
    },
    onSuccess: () => {
      // Invalidate user query and all course/lesson queries to refetch with new language
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    },
  });

  useEffect(() => {
    if (!hasManuallySet.current && user?.language && user.language !== language) {
      const supportedLanguages: Language[] = ['en', 'de', 'fr', 'pt'];
      if (supportedLanguages.includes(user.language as Language)) {
        setLanguageState(user.language as Language);
      }
    }
  }, [user?.language, language]);

  useEffect(() => {
    // Only update the DOM attribute, don't auto-save to localStorage
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    hasManuallySet.current = true;
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update language in database if user is logged in
    if (user) {
      updateLanguageMutation.mutate(lang);
    }
  };

  // Deep merge translations with English fallback
  // This ensures that even if a key is missing in the selected language, it exists (as English)
  const t = (() => {
    const selected = translations[language];
    const english = translations.en;

    // If selected language is English or undefined, return English
    if (!selected || language === 'en') return english;

    // Create a proxy or merged object
    // We'll use a simple deep merge here for the first level of keys
    // This is safer than a full recursive merge for performance, and covers our main use cases (t.section.key)
    const merged: any = { ...english };

    for (const key in selected) {
      const k = key as keyof typeof selected;
      // We need to cast to any to allow spreading of potentially non-object types (though our runtime check handles it)
      const selectedValue = selected[k] as any;
      const englishValue = english[k] as any;

      if (typeof selectedValue === 'object' && selectedValue !== null && !Array.isArray(selectedValue)) {
        // Deep merge for objects (sections like 'footer', 'auth', etc)
        // Ensure both are objects before spreading to avoid runtime errors
        if (typeof englishValue === 'object' && englishValue !== null) {
          merged[k] = { ...englishValue, ...selectedValue };
        } else {
          merged[k] = selectedValue;
        }
      } else {
        // Direct assignment for primitives
        merged[k] = selectedValue;
      }
    }

    return merged;
  })();

  const value = {
    language,
    setLanguage,
    t: t as any
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}