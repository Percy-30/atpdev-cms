"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SUPPORTED_LANGUAGES, 
  LanguageOption, 
  TranslationKey, 
  TRANSLATIONS 
} from '@/lib/translations';

interface LanguageContextType {
  lang: string;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  translateDynamic: (text: string) => Promise<string>;
  currentOption: LanguageOption;
  supportedLanguages: LanguageOption[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DYNAMIC_CACHE_KEY = 'sorteos_translation_cache_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<string>('es');
  const [dynamicCache, setDynamicCache] = useState<Record<string, string>>({});

  // Initialize from localStorage or browser preferences
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('sorteos_lang');
      if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
        setLang(savedLang);
      } else if (typeof navigator !== 'undefined' && navigator.language) {
        const browserCode = navigator.language.split('-')[0].toLowerCase();
        if (SUPPORTED_LANGUAGES.some(l => l.code === browserCode)) {
          setLang(browserCode);
        }
      }

      // Load dynamic cache from localStorage
      const cached = localStorage.getItem(DYNAMIC_CACHE_KEY);
      if (cached) {
        setDynamicCache(JSON.parse(cached));
      }
    } catch (err) {
      console.warn('Could not load language settings from localStorage', err);
    }
  }, []);

  // Update HTML tag attributes whenever language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      const isArabic = lang === 'ar';
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    }
  }, [lang]);

  const handleSetLanguage = useCallback((code: string) => {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === code)) return;
    setLang(code);
    try {
      localStorage.setItem('sorteos_lang', code);
      // Set cookie for SSR compatibility
      document.cookie = `sorteos_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (err) {
      console.warn('Could not save language to storage', err);
    }
  }, []);

  const currentOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  }, [lang]);

  // Synchronous dictionary lookup
  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const langDict = TRANSLATIONS[lang];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const defaultDict = TRANSLATIONS.es;
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key];
    }
    return fallback || key;
  }, [lang]);

  // Dynamic automatic translation with caching
  const translateDynamic = useCallback(async (text: string): Promise<string> => {
    if (!text || lang === 'es') return text;

    const cacheKey = `${lang}:::${text}`;
    if (dynamicCache[cacheKey]) {
      return dynamicCache[cacheKey];
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: lang }),
      });

      if (!res.ok) return text;
      const data = await res.json();
      const translated = data.translated || text;

      setDynamicCache(prev => {
        const next = { ...prev, [cacheKey]: translated };
        try {
          localStorage.setItem(DYNAMIC_CACHE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      return translated;
    } catch {
      return text;
    }
  }, [lang, dynamicCache]);

  const value = useMemo(() => ({
    lang,
    setLanguage: handleSetLanguage,
    t,
    translateDynamic,
    currentOption,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRTL: currentOption.direction === 'rtl',
  }), [lang, handleSetLanguage, t, translateDynamic, currentOption]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
