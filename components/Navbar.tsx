"use client";

import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-xs sticky top-0 z-50 w-full transition-all duration-300 border-b border-nordic/10">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <a
          href="#"
          className="text-xl font-bold text-nordic flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <span className="material-symbols-outlined fill-icon text-mosque text-2xl">
            real_estate_agent
          </span>
          EstateFlow
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-semibold text-nordic border-b-2 border-mosque pb-1 active:scale-95 duration-150"
          >
            Comprar
          </a>
          <a
            href="#"
            className="text-sm font-medium text-nordic/70 hover:text-nordic hover:bg-hint-of-green/40 px-3 py-2 rounded-lg transition-colors active:scale-95 duration-150"
          >
            Rentar
          </a>
          <a
            href="#"
            className="text-sm font-medium text-nordic/70 hover:text-nordic hover:bg-hint-of-green/40 px-3 py-2 rounded-lg transition-colors active:scale-95 duration-150"
          >
            Vender
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden md:inline-flex text-sm font-semibold text-nordic hover:text-mosque transition-colors py-2 px-4"
          >
            Iniciar Sesión
          </a>
          <a
            href="#"
            className="bg-mosque text-white hover:bg-mosque/90 transition-colors py-2 px-6 rounded-full text-sm font-semibold active:scale-95 duration-150 shadow-sm flex items-center gap-1"
          >
            Publicar Propiedad
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-nordic p-2 rounded-lg hover:bg-hint-of-green/30 transition-colors"
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
        <div className="md:hidden bg-white border-t border-nordic/10 px-6 py-4 flex flex-col gap-3 shadow-lg">
          <a
            href="#"
            className="text-base font-semibold text-mosque py-2 border-b border-nordic/5"
          >
            Comprar
          </a>
          <a
            href="#"
            className="text-base font-medium text-nordic py-2 border-b border-nordic/5"
          >
            Rentar
          </a>
          <a
            href="#"
            className="text-base font-medium text-nordic py-2 border-b border-nordic/5"
          >
            Vender
          </a>
          <a
            href="#"
            className="text-base font-medium text-nordic py-2 border-b border-nordic/5"
          >
            Iniciar Sesión
          </a>
        </div>
      )}
    </header>
  );
}
