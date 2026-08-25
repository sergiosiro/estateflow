"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import AdvancedFiltersModal, { AdvancedFiltersState } from "@/components/AdvancedFiltersModal";
import { Property } from "@/types/property";

const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-hint-of-green/20 dark:bg-[#142421] flex items-center justify-center text-nordic/60 dark:text-emerald-100/60 font-medium">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Cargando Mapa...
      </div>
    </div>
  ),
});

interface SearchScreenProps {
  initialProperties: Property[];
}

export default function SearchScreen({ initialProperties }: SearchScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States synced with URL search params
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [beds, setBeds] = useState(searchParams.get("beds") || "");
  const [baths, setBaths] = useState(searchParams.get("baths") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "all");

  // Advanced Filters State
  const [minSqft, setMinSqft] = useState(searchParams.get("minSqft") || "");
  const [maxSqft, setMaxSqft] = useState(searchParams.get("maxSqft") || "");
  const [minYear, setMinYear] = useState(searchParams.get("minYear") || "");
  const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [amenities, setAmenities] = useState<string[]>(
    searchParams.get("amenities") ? searchParams.get("amenities")!.split(",") : []
  );

  // Modal open state
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<"price" | "beds" | "type" | null>(null);

  // Active hover/selection state for Map
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Mobile Map View toggle state
  const [showMobileMap, setShowMobileMap] = useState(false);

  // Sync state changes with URL query parameters
  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/buscar?${params.toString()}`);
  };

  const handleApplyAdvancedFilters = (advState: AdvancedFiltersState) => {
    setMinSqft(advState.minSqft);
    setMaxSqft(advState.maxSqft);
    setMinYear(advState.minYear);
    setMaxYear(advState.maxYear);
    setStatus(advState.status);
    setAmenities(advState.amenities);

    applyFilters({
      minSqft: advState.minSqft,
      maxSqft: advState.maxSqft,
      minYear: advState.minYear,
      maxYear: advState.maxYear,
      status: advState.status,
      amenities: advState.amenities.join(","),
    });
  };

  const handleClearAdvancedFilters = () => {
    setMinSqft("");
    setMaxSqft("");
    setMinYear("");
    setMaxYear("");
    setStatus("all");
    setAmenities([]);

    applyFilters({
      minSqft: "",
      maxSqft: "",
      minYear: "",
      maxYear: "",
      status: "all",
      amenities: "",
    });
  };

  const hasAdvancedFilters = Boolean(
    minSqft || maxSqft || minYear || maxYear || (status && status !== "all") || amenities.length > 0
  );

  // Client-side filtering on initialProperties or current dataset
  const filteredProperties = initialProperties.filter((property) => {
    // Location search
    if (location.trim()) {
      const term = location.trim().toLowerCase();
      const matchText = `${property.title} ${property.address} ${property.city} ${property.state} ${property.zipCode || ""}`.toLowerCase();
      if (!matchText.includes(term)) return false;
    }

    // Min price
    if (minPrice && Number(minPrice) > 0) {
      if (property.price < Number(minPrice)) return false;
    }

    // Max price
    if (maxPrice && Number(maxPrice) > 0) {
      if (property.price > Number(maxPrice)) return false;
    }

    // Beds
    if (beds && Number(beds) > 0) {
      if (property.beds < Number(beds)) return false;
    }

    // Baths
    if (baths && Number(baths) > 0) {
      if (Number(property.baths) < Number(baths)) return false;
    }

    // Property Type
    if (propertyType && propertyType !== "all") {
      const typeTerm = propertyType.toLowerCase();
      const pTitle = property.title.toLowerCase();
      if (typeTerm === "house" || typeTerm === "casa") {
        if (!pTitle.includes("house") && !pTitle.includes("casa") && !pTitle.includes("residence") && !pTitle.includes("home") && !pTitle.includes("villa") && !pTitle.includes("chalet") && !pTitle.includes("manor")) return false;
      } else if (typeTerm === "apartment" || typeTerm === "departamento" || typeTerm === "condo") {
        if (!pTitle.includes("apartment") && !pTitle.includes("apt") && !pTitle.includes("penthouse") && !pTitle.includes("condo") && !pTitle.includes("loft") && !pTitle.includes("downtown")) return false;
      } else if (typeTerm === "villa") {
        if (!pTitle.includes("villa") && !pTitle.includes("estate")) return false;
      } else if (typeTerm === "penthouse") {
        if (!pTitle.includes("penthouse") && !pTitle.includes("loft")) return false;
      } else if (typeTerm === "townhouse") {
        if (!pTitle.includes("townhouse") && !pTitle.includes("craftsman")) return false;
      }
    }

    // Advanced Filters: Sqft
    if (minSqft && Number(minSqft) > 0) {
      if (property.sqft < Number(minSqft)) return false;
    }
    if (maxSqft && Number(maxSqft) > 0) {
      if (property.sqft > Number(maxSqft)) return false;
    }

    // Advanced Filters: Status
    if (status && status !== "all") {
      const st = status.toLowerCase();
      if (st === "new" && property.tagType !== "new" && !property.tag.toLowerCase().includes("new")) return false;
      if ((st === "open" || st === "open_house") && property.tagType !== "open" && !property.tag.toLowerCase().includes("open")) return false;
      if ((st === "pricedrop" || st === "price_drop") && property.tagType !== "pricedrop" && !property.tag.toLowerCase().includes("drop")) return false;
      if (st === "featured" && property.tagType !== "featured" && !property.tag.toLowerCase().includes("featured")) return false;
    }

    // Advanced Filters: Amenities
    if (amenities && amenities.length > 0) {
      const fullText = `${property.title} ${property.description || ""} ${property.tag}`.toLowerCase();
      for (const amenity of amenities) {
        const am = amenity.toLowerCase();
        if (am === "pool" || am === "piscina") {
          if (!fullText.includes("pool") && !fullText.includes("piscina") && !fullText.includes("beach") && !fullText.includes("lake")) return false;
        } else if (am === "garage" || am === "garaje") {
          if (!fullText.includes("garage") && !fullText.includes("parking") && !fullText.includes("drive")) return false;
        } else if (am === "garden" || am === "jardín") {
          if (!fullText.includes("garden") && !fullText.includes("lawn") && !fullText.includes("patio") && !fullText.includes("yard") && !fullText.includes("terrace")) return false;
        } else if (am === "gym" || am === "gimnasio") {
          if (!fullText.includes("gym") && !fullText.includes("fitness") && !fullText.includes("spa")) return false;
        } else {
          if (!fullText.includes(am)) return false;
        }
      }
    }

    return true;
  });

  const clearAllFilters = () => {
    setLocation("");
    setMaxPrice("");
    setMinPrice("");
    setBeds("");
    setBaths("");
    setPropertyType("all");
    setMinSqft("");
    setMaxSqft("");
    setMinYear("");
    setMaxYear("");
    setStatus("all");
    setAmenities([]);
    router.push("/buscar");
  };

  const getPriceLabel = () => {
    if (minPrice && maxPrice) return `$${(Number(minPrice)/1000)}k - $${(Number(maxPrice)/1000)}k`;
    if (maxPrice) return `Hasta $${(Number(maxPrice)/1000)}k`;
    if (minPrice) return `Desde $${(Number(minPrice)/1000)}k`;
    return "Precio";
  };

  const getBedsBathsLabel = () => {
    const parts = [];
    if (beds) parts.push(`${beds}+ Hab`);
    if (baths) parts.push(`${baths}+ Baños`);
    return parts.length > 0 ? parts.join(", ") : "Cuartos & Baños";
  };

  const getPropertyTypeLabel = () => {
    switch (propertyType) {
      case "house": return "Casas";
      case "apartment": return "Departamentos";
      case "villa": return "Villas";
      case "penthouse": return "Penthouses";
      case "townhouse": return "Townhouses";
      default: return "Tipo de Propiedad";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] transition-colors duration-300">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Content Area: Split View matching reference code.html */}
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative" style={{ height: "calc(100vh - 73px)" }}>
        {/* Left Column: Filter Bar & Property List */}
        <div className={`w-full md:w-1/2 lg:w-[55%] flex flex-col bg-clear-day dark:bg-[#0d1816] h-full ${showMobileMap ? "hidden md:flex" : "flex"}`}>
          
          {/* Sticky Filter Bar */}
          <div className="bg-white dark:bg-[#142421] border-b border-nordic/10 dark:border-emerald-500/20 p-4 px-4 md:px-8 shrink-0 z-30 shadow-xs transition-colors">
            <div className="flex flex-wrap gap-2.5 items-center">
              
              {/* Quick Text Search Bar */}
              <div className="flex items-center bg-clear-day/80 dark:bg-[#0d1816]/70 border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3 py-2 flex-grow min-w-[200px] max-w-xs focus-within:border-mosque dark:focus-within:border-emerald-400 transition-all">
                <span className="material-symbols-outlined text-nordic/50 dark:text-emerald-300/50 mr-2 text-[20px]">search</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyFilters({ location });
                  }}
                  onBlur={() => applyFilters({ location })}
                  placeholder="Ciudad, vecindario o zona..."
                  className="bg-transparent border-none focus:ring-0 p-0 text-xs md:text-sm font-medium w-full text-nordic dark:text-white placeholder:text-nordic/40 dark:placeholder:text-emerald-100/40 outline-none"
                />
                {location && (
                  <button onClick={() => { setLocation(""); applyFilters({ location: "" }); }} className="text-nordic/40 dark:text-emerald-300/40 hover:text-nordic text-xs">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              {/* Price Filter Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
                  className={`flex items-center border rounded-xl px-3 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                    maxPrice || minPrice
                      ? "bg-hint-of-green/40 dark:bg-emerald-900/40 border-mosque dark:border-emerald-400 text-mosque dark:text-emerald-300"
                      : "bg-white dark:bg-[#142421] border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-white hover:border-mosque"
                  }`}
                >
                  <span>{getPriceLabel()}</span>
                  <span className="material-symbols-outlined ml-1 text-[18px] text-nordic/50 dark:text-emerald-300/50">expand_more</span>
                </button>

                {openDropdown === "price" && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#142421] rounded-2xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-xs font-bold text-nordic dark:text-white mb-3">Rango de Precio</div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-nordic/60 dark:text-emerald-100/60 block mb-1">Precio Máximo</label>
                        <select
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            applyFilters({ maxPrice: e.target.value });
                            setOpenDropdown(null);
                          }}
                          className="w-full bg-clear-day dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-medium text-nordic dark:text-white outline-none"
                        >
                          <option value="">Cualquier precio</option>
                          <option value="500000">Hasta $500,000 USD</option>
                          <option value="1000000">Hasta $1,000,000 USD</option>
                          <option value="2000000">Hasta $2,000,000 USD</option>
                          <option value="3500000">Hasta $3,500,000 USD</option>
                          <option value="5000000">Hasta $5,000,000 USD</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-nordic/60 dark:text-emerald-100/60 block mb-1">Precio Mínimo</label>
                        <select
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            applyFilters({ minPrice: e.target.value });
                            setOpenDropdown(null);
                          }}
                          className="w-full bg-clear-day dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-medium text-nordic dark:text-white outline-none"
                        >
                          <option value="">Cualquier precio</option>
                          <option value="500000">Desde $500,000 USD</option>
                          <option value="1000000">Desde $1,000,000 USD</option>
                          <option value="2000000">Desde $2,000,000 USD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Beds & Baths Filter Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "beds" ? null : "beds")}
                  className={`flex items-center border rounded-xl px-3 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                    beds || baths
                      ? "bg-hint-of-green/40 dark:bg-emerald-900/40 border-mosque dark:border-emerald-400 text-mosque dark:text-emerald-300"
                      : "bg-white dark:bg-[#142421] border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-white hover:border-mosque"
                  }`}
                >
                  <span>{getBedsBathsLabel()}</span>
                  <span className="material-symbols-outlined ml-1 text-[18px] text-nordic/50 dark:text-emerald-300/50">expand_more</span>
                </button>

                {openDropdown === "beds" && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#142421] rounded-2xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-xs font-bold text-nordic dark:text-white mb-3">Habitaciones y Baños</div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[11px] font-semibold text-nordic/60 dark:text-emerald-100/60 block mb-1.5">Habitaciones Mínimas</label>
                        <div className="flex gap-1">
                          {["", "1", "2", "3", "4"].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setBeds(num);
                                applyFilters({ beds: num });
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                beds === num
                                  ? "bg-mosque text-white border-mosque"
                                  : "border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-white hover:bg-hint-of-green/20"
                              }`}
                            >
                              {num === "" ? "Todas" : `${num}+`}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-nordic/60 dark:text-emerald-100/60 block mb-1.5">Baños Mínimos</label>
                        <div className="flex gap-1">
                          {["", "1", "2", "3", "4"].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setBaths(num);
                                applyFilters({ baths: num });
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                baths === num
                                  ? "bg-mosque text-white border-mosque"
                                  : "border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-white hover:bg-hint-of-green/20"
                              }`}
                            >
                              {num === "" ? "Todos" : `${num}+`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Type Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
                  className={`flex items-center border rounded-xl px-3 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                    propertyType !== "all"
                      ? "bg-hint-of-green/40 dark:bg-emerald-900/40 border-mosque dark:border-emerald-400 text-mosque dark:text-emerald-300"
                      : "bg-white dark:bg-[#142421] border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-white hover:border-mosque"
                  }`}
                >
                  <span>{getPropertyTypeLabel()}</span>
                  <span className="material-symbols-outlined ml-1 text-[18px] text-nordic/50 dark:text-emerald-300/50">expand_more</span>
                </button>

                {openDropdown === "type" && (
                  <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-[#142421] rounded-2xl shadow-xl border border-nordic/10 dark:border-emerald-500/20 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {[
                      { key: "all", label: "Todos los tipos" },
                      { key: "house", label: "Casas / Residencias" },
                      { key: "apartment", label: "Departamentos" },
                      { key: "villa", label: "Villas" },
                      { key: "penthouse", label: "Penthouses" },
                      { key: "townhouse", label: "Townhouses" },
                    ].map((typeItem) => (
                      <button
                        key={typeItem.key}
                        type="button"
                        onClick={() => {
                          setPropertyType(typeItem.key);
                          applyFilters({ propertyType: typeItem.key });
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-4 py-2.5 text-xs text-left font-medium transition-colors ${
                          propertyType === typeItem.key
                            ? "bg-hint-of-green/30 dark:bg-emerald-900/40 text-mosque dark:text-emerald-400 font-bold"
                            : "text-nordic dark:text-emerald-100 hover:bg-hint-of-green/10"
                        }`}
                      >
                        {typeItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* More Filters Button (Triggers Advanced Filters Modal) */}
              <button
                type="button"
                onClick={() => setIsAdvancedModalOpen(true)}
                className={`ml-auto flex items-center gap-1.5 font-semibold text-xs md:text-sm px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  hasAdvancedFilters
                    ? "bg-hint-of-green/40 dark:bg-emerald-900/40 border-mosque dark:border-emerald-400 text-mosque dark:text-emerald-300"
                    : "bg-white dark:bg-[#142421] border-nordic/15 dark:border-emerald-500/30 text-nordic dark:text-white hover:border-mosque"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>More Filters</span>
                {hasAdvancedFilters && (
                  <span className="w-2 h-2 rounded-full bg-mosque dark:bg-emerald-400 ml-0.5 animate-pulse" />
                )}
              </button>
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between mt-3 text-xs text-nordic/70 dark:text-emerald-100/70">
              <p>
                Mostrando <span className="font-bold text-nordic dark:text-white">{filteredProperties.length}</span> propiedades
                {location ? ` en "${location}"` : ""}
              </p>

              {(location || maxPrice || minPrice || beds || baths || (propertyType && propertyType !== "all") || hasAdvancedFilters) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-mosque dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Limpiar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Property Cards Grid */}
          <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-clear-day dark:bg-[#0d1816]">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => setSelectedPropertyId(property.id)}
                    className="h-full"
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <span className="material-symbols-outlined text-5xl text-nordic/30 dark:text-emerald-500/30 mb-3">
                  search_off
                </span>
                <h3 className="text-lg font-bold text-nordic dark:text-white mb-1">
                  No se encontraron propiedades
                </h3>
                <p className="text-xs md:text-sm text-nordic/70 dark:text-emerald-100/70 max-w-sm mb-5">
                  Intenta ajustar los criterios de búsqueda o limpiar los filtros activos para ver más opciones.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-mosque dark:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:opacity-90 transition-opacity"
                >
                  Limpiar Todos los Filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map (Desktop split & Mobile toggle view) */}
        <div className={`w-full md:w-1/2 lg:w-[45%] h-full relative border-l border-nordic/10 dark:border-emerald-500/20 ${showMobileMap ? "block" : "hidden md:block"}`}>
          <SearchMap
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={(id) => setSelectedPropertyId(id)}
          />
        </div>

        {/* Mobile Floating View Toggle Button */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowMobileMap(!showMobileMap)}
            className="bg-nordic text-white dark:bg-emerald-600 px-5 py-2.5 rounded-full shadow-xl text-xs font-bold flex items-center gap-2 border border-white/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">
              {showMobileMap ? "format_list_bulleted" : "map"}
            </span>
            {showMobileMap ? "Ver Lista" : "Ver Mapa"}
          </button>
        </div>
      </main>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        initialFilters={{
          amenities,
          minSqft,
          maxSqft,
          minYear,
          maxYear,
          status,
        }}
        onApply={handleApplyAdvancedFilters}
        onClear={handleClearAdvancedFilters}
      />
    </div>
  );
}

