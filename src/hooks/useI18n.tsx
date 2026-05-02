import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fr } from '../locales/fr';
import { ar } from '../locales/ar';
import type { Translations } from '../locales/fr';

export type Language = 'fr' | 'ar';

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  isRTL: boolean;
}

const translations: Record<Language, Translations> = { fr, ar };

const I18nContext = createContext<I18nContextType>({
  lang: 'fr',
  t: fr,
  setLang: () => {},
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('grh-lang') as Language;
    return saved === 'ar' ? 'ar' : 'fr';
  });

  const isRTL = lang === 'ar';

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('grh-lang', newLang);
  };

  // Apply RTL/LTR to the document
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Optional: add a class for RTL-specific CSS
    document.documentElement.classList.toggle('rtl', isRTL);
  }, [lang, isRTL]);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
