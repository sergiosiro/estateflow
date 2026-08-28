"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: PaginationProps) {
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers array
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-nordic/10 dark:border-emerald-500/20">
      {/* Information text */}
      <p className="text-sm text-nordic/70 dark:text-emerald-100/70">
        {t.home.showingResults}{" "}
        <span className="font-semibold text-nordic dark:text-emerald-300">{startItem}</span> -{" "}
        <span className="font-semibold text-nordic dark:text-emerald-300">{endItem}</span> {t.home.ofLabel}{" "}
        <span className="font-semibold text-nordic dark:text-emerald-300">{totalCount}</span> {t.search.resultsCount}
      </p>

      {/* Pagination controls */}
      <nav className="flex items-center gap-1.5" aria-label="Paginación de propiedades">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={`/?page=${currentPage - 1}`}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-nordic dark:text-emerald-200 bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 hover:bg-mosque hover:text-white dark:hover:bg-emerald-600 transition-all shadow-xs"
            aria-label="Página anterior"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
            <span className="hidden sm:inline">{t.home.prevPage}</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-nordic/40 dark:text-emerald-900/50 bg-white/50 dark:bg-[#142421]/50 border border-nordic/5 dark:border-emerald-900/30 cursor-not-allowed">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
            <span className="hidden sm:inline">{t.home.prevPage}</span>
          </span>
        )}

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isActive = p === currentPage;

            if (isActive) {
              return (
                <span
                  key={p}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold text-white bg-mosque dark:bg-emerald-600 shadow-sm"
                  aria-current="page"
                >
                  {p}
                </span>
              );
            }

            return (
              <Link
                key={p}
                href={`/?page=${p}`}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold text-nordic/80 dark:text-emerald-200 bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 hover:bg-hint-of-green/40 dark:hover:bg-emerald-900/40 hover:text-mosque dark:hover:text-emerald-300 transition-all"
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={`/?page=${currentPage + 1}`}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-nordic dark:text-emerald-200 bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 hover:bg-mosque hover:text-white dark:hover:bg-emerald-600 transition-all shadow-xs"
            aria-label="Página siguiente"
          >
            <span className="hidden sm:inline">{t.home.nextPage}</span>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-nordic/40 dark:text-emerald-900/50 bg-white/50 dark:bg-[#142421]/50 border border-nordic/5 dark:border-emerald-900/30 cursor-not-allowed">
            <span className="hidden sm:inline">{t.home.nextPage}</span>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </span>
        )}
      </nav>
    </div>
  );
}

