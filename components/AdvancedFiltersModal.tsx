"use client";

import { useState, useEffect } from "react";

export interface AdvancedFiltersState {
  amenities: string[];
  minSqft: string;
  maxSqft: string;
  minYear: string;
  maxYear: string;
  status: string;
}

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: AdvancedFiltersState;
  onApply: (filters: AdvancedFiltersState) => void;
  onClear: () => void;
}

const AVAILABLE_AMENITIES = [
  { id: "pool", label: "Pool / Piscina", icon: "pool" },
  { id: "garage", label: "Garage / Garaje", icon: "garage" },
  { id: "garden", label: "Garden / Jardín", icon: "yard" },
  { id: "gym", label: "Gym / Gimnasio", icon: "fitness_center" },
  { id: "balcony", label: "Balcony / Balcón", icon: "balcony" },
  { id: "ac", label: "Air Conditioning", icon: "ac_unit" },
  { id: "elevator", label: "Elevator / Ascensor", icon: "elevator" },
];

const PROPERTY_STATUSES = [
  { id: "all", label: "Todos" },
  { id: "new", label: "New / Nuevo" },
  { id: "open", label: "Open House" },
  { id: "pricedrop", label: "Price Drop / Oferta" },
  { id: "featured", label: "Featured / Destacado" },
];

export default function AdvancedFiltersModal({
  isOpen,
  onClose,
  initialFilters,
  onApply,
  onClear,
}: AdvancedFiltersModalProps) {
  const [amenities, setAmenities] = useState<string[]>(initialFilters.amenities || []);
  const [minSqft, setMinSqft] = useState(initialFilters.minSqft || "");
  const [maxSqft, setMaxSqft] = useState(initialFilters.maxSqft || "");
  const [minYear, setMinYear] = useState(initialFilters.minYear || "");
  const [maxYear, setMaxYear] = useState(initialFilters.maxYear || "");
  const [status, setStatus] = useState(initialFilters.status || "all");

  useEffect(() => {
    setAmenities(initialFilters.amenities || []);
    setMinSqft(initialFilters.minSqft || "");
    setMaxSqft(initialFilters.maxSqft || "");
    setMinYear(initialFilters.minYear || "");
    setMaxYear(initialFilters.maxYear || "");
    setStatus(initialFilters.status || "all");
  }, [initialFilters, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (id: string) => {
    if (amenities.includes(id)) {
      setAmenities(amenities.filter((item) => item !== id));
    } else {
      setAmenities([...amenities, id]);
    }
  };

  const handleApply = () => {
    onApply({
      amenities,
      minSqft,
      maxSqft,
      minYear,
      maxYear,
      status,
    });
    onClose();
  };

  const handleClear = () => {
    setAmenities([]);
    setMinSqft("");
    setMaxSqft("");
    setMinYear("");
    setMaxYear("");
    setStatus("all");
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nordic/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white dark:bg-[#142421] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-nordic/10 dark:border-emerald-500/20">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-nordic/10 dark:border-emerald-500/20 bg-clear-day/40 dark:bg-[#0d1816]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-2xl">
              tune
            </span>
            <h2 className="text-xl font-bold text-nordic dark:text-white">
              Advanced Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-nordic/60 dark:text-emerald-100/60 hover:text-nordic dark:hover:text-white hover:bg-nordic/5 dark:hover:bg-emerald-900/30 p-2 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-8">
          
          {/* Section: Amenities */}
          <section>
            <h3 className="text-xs font-bold tracking-wider text-nordic/70 dark:text-emerald-300 uppercase mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">checklist</span>
              Amenities / Comodidades
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_AMENITIES.map((item) => {
                const isSelected = amenities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAmenity(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs md:text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-mosque dark:bg-emerald-600 text-white border-mosque dark:border-emerald-500 shadow-sm"
                        : "bg-clear-day/30 dark:bg-[#0d1816]/50 border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-emerald-100 hover:border-mosque dark:hover:border-emerald-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section: Square Feet */}
          <section>
            <h3 className="text-xs font-bold tracking-wider text-nordic/70 dark:text-emerald-300 uppercase mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">square_foot</span>
              Square Feet / Superficie ($m^2$)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-nordic/70 dark:text-emerald-100/70">
                  Mínimo (sqft)
                </label>
                <input
                  type="number"
                  value={minSqft}
                  onChange={(e) => setMinSqft(e.target.value)}
                  placeholder="0"
                  className="bg-clear-day/40 dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm font-medium text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/40 focus:border-mosque focus:ring-1 focus:ring-mosque outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-nordic/70 dark:text-emerald-100/70">
                  Máximo (sqft)
                </label>
                <input
                  type="number"
                  value={maxSqft}
                  onChange={(e) => setMaxSqft(e.target.value)}
                  placeholder="Sin límite"
                  className="bg-clear-day/40 dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm font-medium text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/40 focus:border-mosque focus:ring-1 focus:ring-mosque outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section: Year Built */}
          <section>
            <h3 className="text-xs font-bold tracking-wider text-nordic/70 dark:text-emerald-300 uppercase mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              Year Built / Año de Construcción
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-nordic/70 dark:text-emerald-100/70">
                  Año Mínimo
                </label>
                <input
                  type="number"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  placeholder="1900"
                  className="bg-clear-day/40 dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm font-medium text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/40 focus:border-mosque focus:ring-1 focus:ring-mosque outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-nordic/70 dark:text-emerald-100/70">
                  Año Máximo
                </label>
                <input
                  type="number"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  placeholder="2026"
                  className="bg-clear-day/40 dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm font-medium text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/40 focus:border-mosque focus:ring-1 focus:ring-mosque outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section: Property Status */}
          <section>
            <h3 className="text-xs font-bold tracking-wider text-nordic/70 dark:text-emerald-300 uppercase mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">sell</span>
              Property Status / Estado
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {PROPERTY_STATUSES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id)}
                  className={`px-4 py-2 border rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                    status === st.id
                      ? "bg-mosque dark:bg-emerald-600 text-white border-mosque dark:border-emerald-500 shadow-sm"
                      : "bg-clear-day/30 dark:bg-[#0d1816]/50 border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-emerald-100 hover:border-mosque dark:hover:border-emerald-400"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-nordic/10 dark:border-emerald-500/20 bg-clear-day/40 dark:bg-[#0d1816]/40 flex justify-between items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-nordic/70 dark:text-emerald-200 font-semibold text-xs md:text-sm hover:text-mosque dark:hover:text-emerald-400 hover:bg-hint-of-green/20 px-4 py-2.5 rounded-xl transition-colors"
          >
            Clear All / Limpiar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-mosque dark:bg-emerald-600 text-white font-bold text-xs md:text-sm px-8 py-2.5 rounded-xl hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-95 duration-150"
          >
            Show Results / Ver Resultados
          </button>
        </div>
      </div>
    </div>
  );
}
