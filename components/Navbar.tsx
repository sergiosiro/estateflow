"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "system" | "light" | "dark";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      const currentTheme = localStorage.getItem("theme") || "system";
      if (currentTheme === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeDropdownOpen(false);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const getThemeIcon = () => {
    if (!mounted) return "desktop_windows";
    if (theme === "dark") return "dark_mode";
    if (theme === "light") return "light_mode";
    return "desktop_windows";
  };

  return (
    <header className="bg-white/90 dark:bg-[#0d1816]/90 backdrop-blur-md shadow-xs sticky top-0 z-50 w-full transition-all duration-300 border-b border-nordic/10 dark:border-emerald-500/20">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-xl font-bold text-nordic dark:text-white flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <span className="material-symbols-outlined fill-icon text-mosque dark:text-emerald-400 text-2xl">
            real_estate_agent
          </span>
          EstateFlow
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/buscar?intent=buy"
            className="text-sm font-semibold text-nordic dark:text-white hover:text-mosque dark:hover:text-emerald-400 border-b-2 border-transparent hover:border-mosque dark:hover:border-emerald-400 pb-1 transition-all active:scale-95 duration-150"
          >
            Comprar
          </Link>
          <Link
            href="/buscar?intent=rent"
            className="text-sm font-medium text-nordic/70 dark:text-emerald-100/70 hover:text-nordic dark:hover:text-white hover:bg-hint-of-green/40 dark:hover:bg-emerald-900/30 px-3 py-2 rounded-lg transition-colors active:scale-95 duration-150"
          >
            Rentar
          </Link>
          <Link
            href="/buscar"
            className="text-sm font-medium text-nordic/70 dark:text-emerald-100/70 hover:text-nordic dark:hover:text-white hover:bg-hint-of-green/40 dark:hover:bg-emerald-900/30 px-3 py-2 rounded-lg transition-colors active:scale-95 duration-150"
          >
            Vender
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-xl text-nordic dark:text-emerald-100 hover:bg-hint-of-green/30 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1 border border-nordic/10 dark:border-emerald-500/20"
              aria-label="Seleccionar modo de color"
              title="Modo de pantalla"
            >
              <span className="material-symbols-outlined text-xl">
                {getThemeIcon()}
              </span>
              <span className="material-symbols-outlined text-xs">
                expand_more
              </span>
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#142421] rounded-xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 py-1 z-50 backdrop-blur-md">
                <button
                  onClick={() => applyTheme("system")}
                  className={`w-full px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors ${
                    theme === "system"
                      ? "text-mosque dark:text-emerald-400 bg-hint-of-green/20 dark:bg-emerald-900/40"
                      : "text-nordic/80 dark:text-emerald-100/80 hover:bg-hint-of-green/10 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    desktop_windows
                  </span>
                  Modo Sistema
                </button>
                <button
                  onClick={() => applyTheme("light")}
                  className={`w-full px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors ${
                    theme === "light"
                      ? "text-mosque dark:text-emerald-400 bg-hint-of-green/20 dark:bg-emerald-900/40"
                      : "text-nordic/80 dark:text-emerald-100/80 hover:bg-hint-of-green/10 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    light_mode
                  </span>
                  Modo Claro
                </button>
                <button
                  onClick={() => applyTheme("dark")}
                  className={`w-full px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors ${
                    theme === "dark"
                      ? "text-mosque dark:text-emerald-400 bg-hint-of-green/20 dark:bg-emerald-900/40"
                      : "text-nordic/80 dark:text-emerald-100/80 hover:bg-hint-of-green/10 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    dark_mode
                  </span>
                  Modo Oscuro
                </button>
              </div>
            )}
          </div>

          <a
            href="#"
            className="hidden md:inline-flex text-sm font-semibold text-nordic dark:text-emerald-100 hover:text-mosque dark:hover:text-emerald-400 transition-colors py-2 px-3"
          >
            Iniciar Sesión
          </a>
          <a
            href="#"
            className="bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-colors py-2 px-5 rounded-full text-xs md:text-sm font-semibold active:scale-95 duration-150 shadow-sm flex items-center gap-1"
          >
            Publicar
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-nordic dark:text-emerald-100 p-2 rounded-lg hover:bg-hint-of-green/30 dark:hover:bg-emerald-900/40 transition-colors"
            aria-label="Menú principal"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#142421] border-t border-nordic/10 dark:border-emerald-500/20 px-6 py-4 flex flex-col gap-3 shadow-lg">
          <Link
            href="/buscar?intent=buy"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-mosque dark:text-emerald-400 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            Comprar
          </Link>
          <Link
            href="/buscar?intent=rent"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-nordic dark:text-emerald-100 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            Rentar
          </Link>
          <Link
            href="/buscar"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-nordic dark:text-emerald-100 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            Vender
          </Link>
          <a
            href="#"
            className="text-base font-medium text-nordic dark:text-emerald-100 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            Iniciar Sesión
          </a>
        </div>
      )}
    </header>
  );
}

