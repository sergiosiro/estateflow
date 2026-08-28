import { Language, LanguageOption, Translations } from "../types";
import { es } from "./es";
import { en } from "./en";
import { fr } from "./fr";

export const dictionaries: Record<Language, Translations> = {
  es,
  en,
  fr,
};

export const supportedLanguages: LanguageOption[] = [
  {
    code: "es",
    name: "Español",
    nativeName: "Español",
    flagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" class="w-5 h-3.5 rounded-xs shadow-xs object-cover"><rect width="750" height="500" fill="#c60b1e"/><rect width="750" height="250" y="125" fill="#ffc400"/></svg>`,
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 741 390" class="w-5 h-3.5 rounded-xs shadow-xs object-cover"><rect width="741" height="390" fill="#b22234"/><path d="M0 30h741M0 90h741M0 150h741M0 210h741M0 270h741M0 330h741" stroke="#fff" stroke-width="30"/><rect width="296.4" height="210" fill="#3c3b6e"/><g fill="#fff"><circle cx="24.7" cy="21" r="9"/><circle cx="74.1" cy="21" r="9"/><circle cx="123.5" cy="21" r="9"/><circle cx="172.9" cy="21" r="9"/><circle cx="222.3" cy="21" r="9"/><circle cx="271.7" cy="21" r="9"/><circle cx="49.4" cy="42" r="9"/><circle cx="98.8" cy="42" r="9"/><circle cx="148.2" cy="42" r="9"/><circle cx="197.6" cy="42" r="9"/><circle cx="247" cy="42" r="9"/></g></svg>`,
  },
  {
    code: "fr",
    name: "Français",
    nativeName: "Français",
    flagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="w-5 h-3.5 rounded-xs shadow-xs object-cover"><rect width="300" height="600" fill="#002395"/><rect width="300" height="600" x="300" fill="#fff"/><rect width="300" height="600" x="600" fill="#ed2939"/></svg>`,
  },
];

export const defaultLanguage: Language = "es";
