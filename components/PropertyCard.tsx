"use client";

import { useState } from "react";
import { Property } from "@/types/property";
import { togglePropertyFavorite } from "@/lib/properties";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    const nextFavoriteState = !isFavorite;
    // Optimistic UI update
    setIsFavorite(nextFavoriteState);
    setIsLoading(true);

    try {
      const { success } = await togglePropertyFavorite(
        property.id,
        nextFavoriteState
      );
      if (!success) {
        // Revert state if update failed in database
        setIsFavorite(!nextFavoriteState);
      }
    } catch (err) {
      console.error("Error updating favorite status:", err);
      setIsFavorite(!nextFavoriteState);
    } finally {
      setIsLoading(false);
    }
  };

  const getTagBadgeStyle = (tagType?: string) => {
    switch (tagType) {
      case "pricedrop":
        return "bg-mosque dark:bg-emerald-600 text-white";
      case "open":
        return "bg-hint-of-green dark:bg-emerald-900/80 text-nordic dark:text-emerald-100 font-semibold border border-nordic/10 dark:border-emerald-500/30";
      case "featured":
        return "bg-nordic dark:bg-emerald-950 text-white dark:text-emerald-200 border border-transparent dark:border-emerald-500/30";
      case "new":
      default:
        return "bg-white/90 dark:bg-[#142421]/90 text-nordic dark:text-emerald-100 font-semibold border border-nordic/10 dark:border-emerald-500/30 backdrop-blur-sm";
    }
  };

  return (
    <div className="bg-white dark:bg-[#142421] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/40 transition-all duration-300 group cursor-pointer border border-nordic/10 dark:border-emerald-500/20 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-nordic/5 dark:bg-emerald-950/20">
        <img
          src={property.imageUrl}
          alt={property.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Tag Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${getTagBadgeStyle(
            property.tagType
          )}`}
        >
          {property.tag}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-[#0d1816]/80 hover:bg-white dark:hover:bg-[#0d1816] text-nordic/70 dark:text-emerald-200 hover:text-red-500 dark:hover:text-red-400 transition-colors backdrop-blur-sm shadow-xs ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              isFavorite ? "fill-icon text-red-500 dark:text-red-400" : ""
            }`}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Price */}
        <div className="text-xl font-bold text-mosque dark:text-emerald-400 mb-1">
          {property.formattedPrice}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-nordic dark:text-white mb-1 truncate">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-nordic/70 dark:text-emerald-100/70 mb-4 flex items-center gap-1 truncate">
          <span className="material-symbols-outlined text-base text-mosque dark:text-emerald-400">
            location_on
          </span>
          {property.address}, {property.city}, {property.state}
        </p>

        {/* Feature Icons Footer */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-nordic/10 dark:border-emerald-500/20">
          <div className="flex items-center gap-1 text-nordic/80 dark:text-emerald-100/90 text-xs font-medium bg-clear-day dark:bg-[#0d1816]/70 px-2.5 py-1.5 rounded-lg border border-nordic/5 dark:border-emerald-500/20">
            <span className="material-symbols-outlined text-base text-nordic/60 dark:text-emerald-300/60">
              bed
            </span>
            {property.beds} Hab.
          </div>
          <div className="flex items-center gap-1 text-nordic/80 dark:text-emerald-100/90 text-xs font-medium bg-clear-day dark:bg-[#0d1816]/70 px-2.5 py-1.5 rounded-lg border border-nordic/5 dark:border-emerald-500/20">
            <span className="material-symbols-outlined text-base text-nordic/60 dark:text-emerald-300/60">
              bathtub
            </span>
            {property.baths} Baños
          </div>
          <div className="flex items-center gap-1 text-nordic/80 dark:text-emerald-100/90 text-xs font-medium bg-clear-day dark:bg-[#0d1816]/70 px-2.5 py-1.5 rounded-lg border border-nordic/5 dark:border-emerald-500/20">
            <span className="material-symbols-outlined text-base text-nordic/60 dark:text-emerald-300/60">
              square_foot
            </span>
            {property.sqft.toLocaleString()} sqft
          </div>
        </div>
      </div>
    </div>
  );
}

