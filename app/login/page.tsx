"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import Footer from "@/components/Footer";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPasswordForEmail, signOut } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Theme dropdown handling for login header
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as "system" | "light" | "dark") || "system";
    setTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: "system" | "light" | "dark") => {
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

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsGoogleLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error.message || t.auth.googleLoginError);
        setIsGoogleLoading(false);
      }
    } catch (_err: unknown) {
      setErrorMessage(t.auth.googleLoginError);
      setIsGoogleLoading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(t.auth.loginError);
        } else {
          router.push("/");
        }
      } else if (mode === "signup") {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(t.auth.signUpSuccess);
        }
      } else if (mode === "forgot") {
        const { error } = await resetPasswordForEmail(email);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(t.auth.resetEmailSent);
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMessage(errorObj?.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] transition-colors duration-300">
      {/* Top Header */}
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

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <LanguageSelector />

            {/* Theme switcher */}
            <div className="relative">
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

            <Link
              href="/"
              className="text-sm font-semibold text-nordic/75 dark:text-emerald-100/75 hover:text-mosque dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ml-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="hidden sm:inline">{t.auth.backToHome}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area with Split Layout */}
      <main className="flex-grow flex w-full">
        {/* Left Side: Login / Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-clear-day dark:bg-[#0d1816]">
          <div className="w-full max-w-[440px] bg-white/95 dark:bg-[#142421]/95 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-[0_12px_40px_-12px_rgba(0,102,85,0.12)] border border-nordic/10 dark:border-emerald-500/20 relative z-10 transition-all">
            
            {/* If user is already logged in */}
            {user ? (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-hint-of-green dark:bg-emerald-900/60 border-2 border-mosque dark:border-emerald-400 mx-auto flex items-center justify-center text-mosque dark:text-emerald-300 text-2xl font-bold overflow-hidden shadow-md">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata.avatar_url || user.user_metadata.picture}
                      alt={user.user_metadata?.full_name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(user.user_metadata?.full_name || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-nordic dark:text-white">
                    {t.auth.welcomeBack},{" "}
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </h2>
                  <p className="text-xs text-nordic/60 dark:text-emerald-100/60 mt-1">
                    {user.email}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/"
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-mosque dark:bg-emerald-600 hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-all text-center shadow-md active:scale-95 duration-150"
                  >
                    {t.auth.backToHome}
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-nordic dark:text-emerald-200 bg-hint-of-green/30 dark:bg-emerald-900/30 hover:bg-hint-of-green/60 dark:hover:bg-emerald-900/60 transition-colors border border-nordic/10 dark:border-emerald-500/20"
                  >
                    {t.auth.logout}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Form Header */}
                <div className="mb-6 text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-nordic dark:text-white tracking-tight mb-2">
                    {mode === "login"
                      ? t.auth.welcomeBack
                      : mode === "signup"
                      ? t.auth.signUpButton
                      : t.auth.forgotPassword}
                  </h1>
                  <p className="text-sm text-nordic/70 dark:text-emerald-100/70">
                    {mode === "login"
                      ? t.auth.welcomeSubtitle
                      : mode === "signup"
                      ? "Crea tu cuenta para guardar propiedades y recibir asesoría personalizada."
                      : "Ingresa tu correo para recibir un enlace de recuperación."}
                  </p>
                </div>

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn">
                    <span className="material-symbols-outlined text-base text-red-600 dark:text-red-400 mt-0.5">
                      error
                    </span>
                    <span className="flex-1 font-medium">{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-fadeIn">
                    <span className="material-symbols-outlined text-base text-emerald-600 dark:text-emerald-400 mt-0.5">
                      check_circle
                    </span>
                    <span className="flex-1 font-medium">{successMessage}</span>
                  </div>
                )}

                {/* Google Login Button */}
                {mode !== "forgot" && (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading || isSubmitting}
                      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl py-3 px-4 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 hover:border-mosque/40 transition-all duration-200 mb-5 shadow-xs group cursor-pointer active:scale-[0.99] disabled:opacity-60"
                    >
                      {isGoogleLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-mosque/30 border-t-mosque dark:border-emerald-400/30 dark:border-t-emerald-400 animate-spin" />
                      ) : (
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      )}
                      <span className="text-sm font-semibold text-nordic dark:text-white group-hover:text-mosque dark:group-hover:text-emerald-400 transition-colors">
                        {t.auth.loginWithGoogle}
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-5">
                      <div className="flex-grow border-t border-nordic/10 dark:border-emerald-500/20"></div>
                      <span className="px-3 text-xs uppercase font-semibold tracking-wider text-nordic/50 dark:text-emerald-100/50">
                        {t.auth.orContinueWith}
                      </span>
                      <div className="flex-grow border-t border-nordic/10 dark:border-emerald-500/20"></div>
                    </div>
                  </>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label
                        className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1.5"
                        htmlFor="fullName"
                      >
                        {t.auth.fullNameLabel}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 text-[20px] pointer-events-none">
                          person
                        </span>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t.auth.fullNamePlaceholder}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/30 focus:border-mosque dark:focus:border-emerald-400 focus:ring-2 focus:ring-mosque/10 dark:focus:ring-emerald-400/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1.5"
                      htmlFor="email"
                    >
                      {t.auth.emailLabel}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 text-[20px] pointer-events-none">
                        mail
                      </span>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.auth.emailPlaceholder}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/30 focus:border-mosque dark:focus:border-emerald-400 focus:ring-2 focus:ring-mosque/10 dark:focus:ring-emerald-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  {mode !== "forgot" && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label
                          className="block text-xs font-semibold text-nordic dark:text-emerald-100"
                          htmlFor="password"
                        >
                          {t.auth.passwordLabel}
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => {
                              setErrorMessage(null);
                              setSuccessMessage(null);
                              setMode("forgot");
                            }}
                            className="text-xs font-semibold text-mosque dark:text-emerald-400 hover:underline transition-colors"
                          >
                            {t.auth.forgotPassword}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 text-[20px] pointer-events-none">
                          lock
                        </span>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.auth.passwordPlaceholder}
                          required
                          minLength={6}
                          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/30 focus:border-mosque dark:focus:border-emerald-400 focus:ring-2 focus:ring-mosque/10 dark:focus:ring-emerald-400/20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 hover:text-mosque dark:hover:text-emerald-300 transition-colors p-1"
                          aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember Me */}
                  {mode === "login" && (
                    <div className="flex items-center pt-1 pb-2">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-nordic/20 text-mosque focus:ring-mosque dark:focus:ring-emerald-400 bg-white dark:bg-[#0d1816] cursor-pointer accent-[#006655]"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-xs text-nordic/70 dark:text-emerald-100/70 cursor-pointer select-none"
                      >
                        {t.auth.rememberMe}
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-mosque hover:bg-mosque/90 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        <span>{t.auth.signingIn}</span>
                      </>
                    ) : (
                      <span>
                        {mode === "login"
                          ? t.auth.signInButton
                          : mode === "signup"
                          ? t.auth.signUpButton
                          : "Enviar enlace de recuperación"}
                      </span>
                    )}
                  </button>
                </form>

                {/* Switch Mode Footer */}
                <div className="mt-6 text-center text-xs text-nordic/70 dark:text-emerald-100/70">
                  {mode === "login" ? (
                    <p>
                      {t.auth.noAccount}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setSuccessMessage(null);
                          setMode("signup");
                        }}
                        className="font-semibold text-mosque dark:text-emerald-400 hover:underline transition-colors ml-1"
                      >
                        {t.auth.signUp}
                      </button>
                    </p>
                  ) : mode === "signup" ? (
                    <p>
                      {t.auth.alreadyHaveAccount}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setSuccessMessage(null);
                          setMode("login");
                        }}
                        className="font-semibold text-mosque dark:text-emerald-400 hover:underline transition-colors ml-1"
                      >
                        {t.nav.login}
                      </button>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setSuccessMessage(null);
                        setMode("login");
                      }}
                      className="font-semibold text-mosque dark:text-emerald-400 hover:underline transition-colors"
                    >
                      ← Volver a Iniciar Sesión
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Decorative Image & Branding Card */}
        <div className="hidden lg:block lg:w-1/2 relative bg-surface-container overflow-hidden min-h-[640px]">
          {/* Architectural Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85')",
            }}
          />

          {/* Gradient Overlay in EstateFlow Nordic / Mosque palette */}
          <div className="absolute inset-0 bg-gradient-to-br from-nordic/50 via-nordic/20 to-mosque/40 backdrop-blur-[1px]" />

          {/* Floating Glassmorphism Hero Card */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end items-start p-12 xl:p-16">
            <div className="bg-white/85 dark:bg-[#142421]/90 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-emerald-500/20 shadow-2xl max-w-md animate-fadeIn">
              <div className="w-12 h-12 rounded-xl bg-hint-of-green/60 dark:bg-emerald-900/60 flex items-center justify-center mb-4 text-mosque dark:text-emerald-300">
                <span className="material-symbols-outlined text-3xl">
                  architecture
                </span>
              </div>
              <h2 className="text-2xl font-bold text-nordic dark:text-white mb-2.5 tracking-tight">
                {t.auth.elevateTitle}
              </h2>
              <p className="text-sm text-nordic/80 dark:text-emerald-100/80 leading-relaxed">
                {t.auth.elevateSubtitle}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
