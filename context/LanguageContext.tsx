'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import translations, { Lang, TranslationKey } from '@/lib/translations';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ES',
  setLang: () => {},
  t: (key) => translations.ES[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ES');
  const t = (key: TranslationKey): string => translations[lang][key];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
