"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/types";

export default function LanguageSelector() {
  const { language, setLanguage, currentLanguageOption, supportedLanguages } =
    useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-nordic dark:text-emerald-100 hover:bg-hint-of-green/30 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5 border border-nordic/10 dark:border-emerald-500/20 active:scale-95 duration-150"
        aria-label="Seleccionar idioma"
        title="Cambiar idioma / Switch language"
      >
        <span
          className="flex items-center justify-center shrink-0"
          dangerouslySetInnerHTML={{ __html: currentLanguageOption.flagSvg }}
        />
        <span className="text-xs font-bold uppercase tracking-wider">
          {currentLanguageOption.code}
        </span>
        <span className="material-symbols-outlined text-xs transition-transform duration-200">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#142421] rounded-xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 py-1.5 z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-nordic/40 dark:text-emerald-300/40 uppercase tracking-widest border-b border-nordic/5 dark:border-emerald-500/10 mb-1">
            Idioma / Language
          </div>
          {supportedLanguages.map((option) => {
            const isSelected = language === option.code;
            return (
              <button
                key={option.code}
                onClick={() => handleSelect(option.code)}
                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  isSelected
                    ? "text-mosque dark:text-emerald-400 bg-hint-of-green/20 dark:bg-emerald-900/40 font-bold"
                    : "text-nordic/80 dark:text-emerald-100/80 hover:bg-hint-of-green/10 dark:hover:bg-emerald-900/20"
                }`}
              >
                <span
                  className="flex items-center justify-center shrink-0"
                  dangerouslySetInnerHTML={{ __html: option.flagSvg }}
                />
                <span className="flex-grow text-left">{option.nativeName}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-sm text-mosque dark:text-emerald-400">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
