"use client";

import { useState } from "react";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Búsqueda iniciada:", { activeTab, location, maxPrice });
  };

  return (
    <section className="relative w-full min-h-[580px] flex items-center justify-center px-4 md:px-12 py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="bg-cover bg-center w-full h-full"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clear-day/90 via-clear-day/65 to-clear-day/95 dark:from-[#0d1816]/95 dark:via-[#0d1816]/80 dark:to-[#0d1816]/95 z-10 backdrop-blur-[2px] transition-colors duration-300" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto w-full text-center flex flex-col items-center gap-6">
        <h1 className="text-3xl md:text-5xl font-bold text-nordic dark:text-white max-w-3xl leading-tight tracking-tight drop-shadow-xs">
          Encuentra tu Próxima Propiedad Perfecta con EstateFlow
        </h1>

        <p className="text-base md:text-lg text-nordic/85 dark:text-emerald-100/90 max-w-2xl bg-white/70 dark:bg-[#142421]/80 backdrop-blur-md p-4 rounded-xl shadow-xs border border-hint-of-green dark:border-emerald-500/30 transition-colors duration-300">
          Descubre miles de residencias y propiedades exclusivas. Ya sea para comprar, rentar o invertir, tenemos el espacio ideal para ti.
        </p>

        {/* Search Bar Box */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl bg-white dark:bg-[#142421] rounded-2xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 overflow-hidden mt-4 transition-all duration-300 hover:-translate-y-0.5"
        >
          {/* Tabs */}
          <div className="flex border-b border-nordic/10 dark:border-emerald-500/20">
            <button
              type="button"
              onClick={() => setActiveTab("buy")}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "buy"
                  ? "text-mosque dark:text-emerald-400 border-b-2 border-mosque dark:border-emerald-400 bg-hint-of-green/20 dark:bg-emerald-900/40"
                  : "text-nordic/60 dark:text-emerald-100/60 hover:text-nordic dark:hover:text-white hover:bg-hint-of-green/10 dark:hover:bg-emerald-900/20"
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rent")}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "rent"
                  ? "text-mosque dark:text-emerald-400 border-b-2 border-mosque dark:border-emerald-400 bg-hint-of-green/20 dark:bg-emerald-900/40"
                  : "text-nordic/60 dark:text-emerald-100/60 hover:text-nordic dark:hover:text-white hover:bg-hint-of-green/10 dark:hover:bg-emerald-900/20"
              }`}
            >
              Rentar
            </button>
          </div>

          {/* Inputs Grid */}
          <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
            {/* Location Input */}
            <div className="flex-1 relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-nordic/50 dark:text-emerald-300/50 pointer-events-none">
                location_on
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ciudad, Vecindario o Código Postal"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-nordic/20 dark:border-emerald-500/30 focus:border-mosque dark:focus:border-emerald-400 focus:ring-2 focus:ring-mosque/20 dark:focus:ring-emerald-400/20 text-sm font-medium text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/40 transition-all outline-none bg-clear-day/30 dark:bg-[#0d1816]/60"
              />
            </div>

            {/* Max Price Dropdown */}
            <div className="flex-1 relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-nordic/50 dark:text-emerald-300/50 pointer-events-none">
                payments
              </span>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-nordic/20 dark:border-emerald-500/30 focus:border-mosque dark:focus:border-emerald-400 focus:ring-2 focus:ring-mosque/20 dark:focus:ring-emerald-400/20 text-sm font-medium text-nordic dark:text-white transition-all outline-none bg-clear-day/30 dark:bg-[#0d1816]/60 appearance-none"
              >
                <option value="" className="dark:bg-[#142421] dark:text-white">Precio Máximo</option>
                <option value="500000" className="dark:bg-[#142421] dark:text-white">$500,000 USD</option>
                <option value="1000000" className="dark:bg-[#142421] dark:text-white">$1,000,000 USD</option>
                <option value="2000000" className="dark:bg-[#142421] dark:text-white">$2,000,000+ USD</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto bg-mosque dark:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined text-xl">search</span>
              Buscar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

