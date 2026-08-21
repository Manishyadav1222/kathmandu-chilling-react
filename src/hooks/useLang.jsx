import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../data/content';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('kc-lang') || 'en');

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'en' ? 'ne' : 'en';
      localStorage.setItem('kc-lang', next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const t = useCallback((key) => translations[lang][key] ?? key, [lang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
