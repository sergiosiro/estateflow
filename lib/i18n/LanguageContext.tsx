"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LanguageOption, Translations } from "./types";
import { dictionaries, defaultLanguage, supportedLanguages } from "./locales";
import { getLanguageFromCookie, setLanguageCookie } from "./cookies";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = getLanguageFromCookie();
    setLanguageState(savedLang);
    setMounted(true);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    setLanguageCookie(newLang);
  };

  const t = dictionaries[language] || dictionaries[defaultLanguage];
  const currentLanguageOption =
    supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
