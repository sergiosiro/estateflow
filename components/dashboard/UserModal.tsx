"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    email: string;
    password: string;
    fullName: string;
    role: "admin" | "user";
  }) => Promise<void>;
}

export default function UserModal({ isOpen, onClose, onSave }: UserModalProps) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg("Todos los campos son requeridos.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSave({
        fullName,
        email,
        password,
        role,
      });
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj?.message || "Error al crear el usuario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#142421] rounded-2xl border border-nordic/15 dark:border-emerald-500/30 max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-nordic/10 dark:border-emerald-500/20 bg-clear-day/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-mosque dark:text-emerald-400">
              person_add
            </span>
            <h3 className="text-lg font-bold text-nordic dark:text-white">
              {t.dashboard.addUser}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-nordic/50 dark:text-emerald-100/50 hover:text-nordic dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Jane Doe"
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@estateflow.com"
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
              Contraseña Inicial *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 hover:text-mosque transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1.5">
              Tipo de Usuario / Rol *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  role === "user"
                    ? "border-mosque dark:border-emerald-400 bg-hint-of-green/20 dark:bg-emerald-950/40 text-mosque dark:text-emerald-300 font-semibold"
                    : "border-nordic/15 dark:border-emerald-500/20 text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/10"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="material-symbols-outlined text-base">person</span>
                  <span>Usuario Común</span>
                </div>
                <p className="text-[11px] text-nordic/60 dark:text-emerald-100/60 font-normal leading-tight">
                  Consulta y mantiene sus propias propiedades.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  role === "admin"
                    ? "border-mosque dark:border-emerald-400 bg-hint-of-green/20 dark:bg-emerald-950/40 text-mosque dark:text-emerald-300 font-semibold"
                    : "border-nordic/15 dark:border-emerald-500/20 text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/10"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  <span>Administrador</span>
                </div>
                <p className="text-[11px] text-nordic/60 dark:text-emerald-100/60 font-normal leading-tight">
                  Acceso completo al módulo de administración.
                </p>
              </button>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-nordic/10 dark:border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              {t.dashboard.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-base">person_add</span>
              )}
              <span>{t.dashboard.addUser}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
