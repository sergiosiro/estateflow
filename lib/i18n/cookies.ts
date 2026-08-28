import { Language } from "./types";
import { defaultLanguage, supportedLanguages } from "./locales";

export const COOKIE_NAME = "estateflow_lang";
export const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

export function getLanguageFromCookie(): Language {
  if (typeof document === "undefined") return defaultLanguage;

  const match = document.cookie.match(
    new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)")
  );
  const lang = match ? decodeURIComponent(match[1]) : null;

  if (lang && supportedLanguages.some((l) => l.code === lang)) {
    return lang as Language;
  }

  return defaultLanguage;
}

export function setLanguageCookie(lang: Language): void {
  if (typeof document === "undefined") return;

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    lang
  )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}
