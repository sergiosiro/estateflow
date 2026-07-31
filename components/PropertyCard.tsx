"use client";

import { useState } from "react";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);

  const getTagBadgeStyle = (tagType?: string) => {
    switch (tagType) {
      case "pricedrop":
        return "bg-mosque text-white";
      case "open":
        return "bg-hint-of-green text-nordic font-semibold border border-nordic/10";
      case "featured":
        return "bg-nordic text-white";
      case "new":
      default:
        return "bg-white/90 text-nordic font-semibold border border-nordic/10 backdrop-blur-sm";
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-nordic/10 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-nordic/5">
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
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-nordic/70 hover:text-red-500 transition-colors backdrop-blur-sm shadow-xs"
          aria-label="Guardar en favoritos"
        >
          <span
            className={`material-symbols-outlined text-xl ${
              isFavorite ? "fill-icon text-red-500" : ""
            }`}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Price */}
        <div className="text-xl font-bold text-mosque mb-1">
          {property.formattedPrice}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-nordic mb-1 truncate">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-nordic/70 mb-4 flex items-center gap-1 truncate">
          <span className="material-symbols-outlined text-base text-mosque">
            location_on
          </span>
          {property.address}, {property.city}, {property.state}
        </p>

        {/* Feature Icons Footer */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-nordic/10">
          <div className="flex items-center gap-1 text-nordic/80 text-xs font-medium bg-clear-day px-2.5 py-1.5 rounded-lg border border-nordic/5">
            <span className="material-symbols-outlined text-base text-nordic/60">
              bed
            </span>
            {property.beds} Hab.
          </div>
          <div className="flex items-center gap-1 text-nordic/80 text-xs font-medium bg-clear-day px-2.5 py-1.5 rounded-lg border border-nordic/5">
            <span className="material-symbols-outlined text-base text-nordic/60">
              bathtub
            </span>
            {property.baths} Baños
          </div>
          <div className="flex items-center gap-1 text-nordic/80 text-xs font-medium bg-clear-day px-2.5 py-1.5 rounded-lg border border-nordic/5">
            <span className="material-symbols-outlined text-base text-nordic/60">
              square_foot
            </span>
            {property.sqft.toLocaleString()} sqft
          </div>
        </div>
      </div>
    </div>
  );
}
