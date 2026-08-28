"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-nordic dark:bg-[#08100e] text-white border-t border-nordic/20 dark:border-emerald-900/40 mt-auto transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-12 py-12 max-w-7xl mx-auto w-full">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-2 hover:opacity-85 transition-opacity">
            <span className="material-symbols-outlined fill-icon text-hint-of-green dark:text-emerald-400 text-2xl">
              real_estate_agent
            </span>
            EstateFlow
          </Link>
          <p className="text-sm text-white/70 dark:text-emerald-100/70 max-w-xs leading-relaxed">
            {t.footer.tagline}
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-hint-of-green dark:text-emerald-400">{t.footer.company}</h4>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.aboutUs}
          </a>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.contact}
          </a>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.careers}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-hint-of-green dark:text-emerald-400">{t.footer.resources}</h4>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.neighborhoodGuide}
          </a>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.marketReports}
          </a>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.mortgageCalc}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-hint-of-green dark:text-emerald-400">{t.footer.legal}</h4>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.privacy}
          </a>
          <a href="#" className="text-sm text-white/70 dark:text-emerald-100/70 hover:text-hint-of-green dark:hover:text-emerald-400 transition-colors">
            {t.footer.terms}
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 dark:border-emerald-900/30 px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto text-xs text-white/50 dark:text-emerald-100/50 text-center md:text-left">
          © {new Date().getFullYear()} {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}


