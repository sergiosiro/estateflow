"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const isPropertiesActive = pathname === "/dashboard/propiedades" || pathname === "/dashboard";
  const isUsersActive = pathname === "/dashboard/usuarios";

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
      <h2 className="text-2xl md:text-3xl font-bold text-nordic dark:text-white mb-3">
        {t.dashboard.title}
      </h2>
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {/* Tab 1: My Properties */}
        <Link
          href="/dashboard/propiedades"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap text-left border-l-4 ${
            isPropertiesActive
              ? "bg-white dark:bg-[#142421] text-mosque dark:text-emerald-400 font-semibold shadow-xs border-mosque dark:border-emerald-400"
              : "text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 dark:hover:bg-emerald-950/30 hover:text-nordic dark:hover:text-white border-transparent"
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              isPropertiesActive ? "fill-icon text-mosque dark:text-emerald-400" : ""
            }`}
          >
            real_estate_agent
          </span>
          <span>{t.dashboard.myPropertiesTab}</span>
        </Link>

        {/* Tab 2: User Management (Visible or marked with admin role) */}
        <Link
          href="/dashboard/usuarios"
          className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap text-left border-l-4 ${
            isUsersActive
              ? "bg-white dark:bg-[#142421] text-mosque dark:text-emerald-400 font-semibold shadow-xs border-mosque dark:border-emerald-400"
              : "text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 dark:hover:bg-emerald-950/30 hover:text-nordic dark:hover:text-white border-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`material-symbols-outlined text-xl ${
                isUsersActive ? "fill-icon text-mosque dark:text-emerald-400" : ""
              }`}
            >
              manage_accounts
            </span>
            <span>{t.dashboard.userManagementTab}</span>
          </div>
          {isAdmin && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-hint-of-green dark:bg-emerald-900/60 text-mosque dark:text-emerald-300 border border-mosque/20">
              Admin
            </span>
          )}
        </Link>
      </nav>
    </aside>
  );
}
