"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

type Theme = "system" | "light" | "dark";

export default function Navbar() {
  const { t } = useLanguage();
  const { user, profile, isAdmin, signOut, loading: authLoading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const themeRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

    // Click outside handler for dropdowns
    const handleClickOutside = (e: MouseEvent) => {
      if (
        themeRef.current &&
        !themeRef.current.contains(e.target as Node)
      ) {
        setThemeDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const getUserInitial = () => {
    if (!user) return "U";
    const name =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "U";
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return (
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Usuario"
    );
  };

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

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
            {t.nav.buy}
          </Link>
          <Link
            href="/buscar?intent=rent"
            className="text-sm font-medium text-nordic/70 dark:text-emerald-100/70 hover:text-nordic dark:hover:text-white hover:bg-hint-of-green/40 dark:hover:bg-emerald-900/30 px-3 py-2 rounded-lg transition-colors active:scale-95 duration-150"
          >
            {t.nav.rent}
          </Link>
          <Link
            href="/buscar"
            className="text-sm font-medium text-nordic/70 dark:text-emerald-100/70 hover:text-nordic dark:hover:text-white hover:bg-hint-of-green/40 dark:hover:bg-emerald-900/30 px-3 py-2 rounded-lg transition-colors active:scale-95 duration-150"
          >
            {t.nav.sell}
          </Link>

          {/* Logged in User Link: My Properties */}
          {user && (
            <Link
              href="/dashboard/propiedades"
              className="text-sm font-semibold text-mosque dark:text-emerald-400 hover:text-mosque/80 dark:hover:text-emerald-300 bg-hint-of-green/30 dark:bg-emerald-950/50 border border-mosque/20 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined text-lg">real_estate_agent</span>
              <span>{t.dashboard.myPropertiesTab}</span>
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Theme Switcher Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-xl text-nordic dark:text-emerald-100 hover:bg-hint-of-green/30 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1 border border-nordic/10 dark:border-emerald-500/20 text-sm"
              aria-label="Seleccionar modo de color"
              title="Modo de pantalla"
            >
              <span className="material-symbols-outlined text-lg">
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

          {/* User Section (Logged In vs Logged Out) */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-nordic/15 dark:border-emerald-500/30 hover:border-mosque/40 dark:hover:border-emerald-400 transition-all bg-white/80 dark:bg-[#142421]/80 shadow-2xs group cursor-pointer"
                aria-label="Menú de usuario"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-hint-of-green dark:bg-emerald-900/70 border border-mosque/20 dark:border-emerald-400/40 flex items-center justify-center text-mosque dark:text-emerald-300 font-bold text-xs">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={getUserDisplayName()}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getUserInitial()}</span>
                  )}
                </div>

                <span className="hidden lg:inline-block text-xs font-semibold text-nordic dark:text-emerald-100 max-w-[110px] truncate">
                  {getUserDisplayName()}
                </span>

                <span className="material-symbols-outlined text-xs text-nordic/60 dark:text-emerald-100/60 group-hover:text-mosque dark:group-hover:text-emerald-400 transition-colors">
                  expand_more
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#142421] rounded-2xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 py-2 z-50 backdrop-blur-md animate-fadeIn">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-nordic/10 dark:border-emerald-500/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-hint-of-green dark:bg-emerald-900/70 border border-mosque/20 dark:border-emerald-400/40 flex items-center justify-center text-mosque dark:text-emerald-300 font-bold text-sm flex-shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={getUserDisplayName()}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{getUserInitial()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-nordic dark:text-white truncate">
                          {getUserDisplayName()}
                        </p>
                        {isAdmin && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-hint-of-green dark:bg-emerald-900 text-mosque dark:text-emerald-300">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-nordic/60 dark:text-emerald-100/60 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {/* Dashboard: My Properties */}
                    <Link
                      href="/dashboard/propiedades"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-mosque dark:text-emerald-400 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        real_estate_agent
                      </span>
                      {t.dashboard.myPropertiesTab}
                    </Link>

                    {/* Admin: User Management */}
                    {isAdmin && (
                      <Link
                        href="/dashboard/usuarios"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-nordic/80 dark:text-emerald-100/80 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 hover:text-mosque dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">
                          manage_accounts
                        </span>
                        {t.dashboard.userManagementTab}
                      </Link>
                    )}

                    <Link
                      href="/buscar"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-nordic/80 dark:text-emerald-100/80 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 hover:text-mosque dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        bookmark
                      </span>
                      {t.auth.myFavorites}
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="border-t border-nordic/10 dark:border-emerald-500/20 pt-1 mt-1">
                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await signOut();
                      }}
                      className="w-full px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        logout
                      </span>
                      {t.auth.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm font-semibold text-nordic dark:text-emerald-100 hover:text-mosque dark:hover:text-emerald-400 transition-colors py-2 px-3 rounded-lg hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/20"
            >
              {t.nav.login}
            </Link>
          )}

          {/* Action CTA Button */}
          <Link
            href={user ? "/dashboard/propiedades" : "/login"}
            className="bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-colors py-2 px-4 md:px-5 rounded-full text-xs md:text-sm font-semibold active:scale-95 duration-150 shadow-sm flex items-center gap-1"
          >
            {t.nav.publish}
          </Link>

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
          {/* If user is logged in, show user info in mobile menu */}
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-nordic/10 dark:border-emerald-500/20">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-hint-of-green dark:bg-emerald-900/70 border border-mosque/20 dark:border-emerald-400/40 flex items-center justify-center text-mosque dark:text-emerald-300 font-bold text-sm">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={getUserDisplayName()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getUserInitial()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-nordic dark:text-white truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-nordic/60 dark:text-emerald-100/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <Link
            href="/buscar?intent=buy"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-mosque dark:text-emerald-400 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            {t.nav.buy}
          </Link>
          <Link
            href="/buscar?intent=rent"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-nordic dark:text-emerald-100 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            {t.nav.rent}
          </Link>
          <Link
            href="/buscar"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-nordic dark:text-emerald-100 py-2 border-b border-nordic/5 dark:border-emerald-500/10"
          >
            {t.nav.sell}
          </Link>

          {/* User Links in Mobile Menu */}
          {user && (
            <>
              <Link
                href="/dashboard/propiedades"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-mosque dark:text-emerald-400 py-2 border-b border-nordic/5 dark:border-emerald-500/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">real_estate_agent</span>
                <span>{t.dashboard.myPropertiesTab}</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/usuarios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-mosque dark:text-emerald-400 py-2 border-b border-nordic/5 dark:border-emerald-500/10 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">manage_accounts</span>
                  <span>{t.dashboard.userManagementTab}</span>
                </Link>
              )}
            </>
          )}

          {user ? (
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                await signOut();
              }}
              className="text-base font-medium text-red-600 dark:text-red-400 py-2 text-left flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              {t.auth.logout}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-nordic dark:text-emerald-100 py-2 border-b border-nordic/5 dark:border-emerald-500/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              {t.nav.login}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
