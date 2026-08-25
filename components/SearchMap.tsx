"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Property } from "@/types/property";

interface SearchMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string) => void;
}

export default function SearchMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
}: SearchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Coordinates helper based on property id or index to give realistic positions around key cities
  const getCoordinates = (property: Property, index: number) => {
    const cityUpper = (property.city || "").toUpperCase();
    let baseLat = 47.6062; // Default Seattle
    let baseLng = -122.3321;

    if (cityUpper.includes("PALO ALTO") || cityUpper.includes("SILICON")) {
      baseLat = 37.4419;
      baseLng = -122.143;
    } else if (cityUpper.includes("SEATTLE")) {
      baseLat = 47.6062;
      baseLng = -122.3321;
    } else if (cityUpper.includes("LAKE TAHOE")) {
      baseLat = 39.0968;
      baseLng = -120.0324;
    } else if (cityUpper.includes("AUSTIN")) {
      baseLat = 30.2672;
      baseLng = -97.7431;
    } else if (cityUpper.includes("MALIBU") || cityUpper.includes("LOS ANGELES")) {
      baseLat = 34.0259;
      baseLng = -118.7798;
    } else if (cityUpper.includes("BOSTON")) {
      baseLat = 42.3601;
      baseLng = -71.0589;
    } else if (cityUpper.includes("MIAMI")) {
      baseLat = 25.7617;
      baseLng = -80.1918;
    } else if (cityUpper.includes("NEW YORK")) {
      baseLat = 40.7128;
      baseLng = -74.006;
    }

    // Offset based on index to scatter markers nicely
    const latOffset = ((index % 5) - 2) * 0.015 + ((index * 7) % 11) * 0.002;
    const lngOffset = (((index + 2) % 5) - 2) * 0.018 + ((index * 13) % 9) * 0.002;

    return [baseLat + latOffset, baseLng + lngOffset] as [number, number];
  };

  const formatShortPrice = (price: number) => {
    if (price >= 1000000) {
      const millions = price / 1000000;
      return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `$${Math.round(price / 1000)}K`;
    }
    return `$${price}`;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isSubscribed = true;

    import("leaflet").then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial center
      const initialCenter: [number, number] = properties.length > 0
        ? getCoordinates(properties[0], 0)
        : [47.6062, -122.3321];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      markersRef.current.clear();

      const bounds = L.latLngBounds([]);

      properties.forEach((property, index) => {
        const coords = getCoordinates(property, index);
        bounds.extend(coords);

        const isSelected = property.id === selectedPropertyId;
        const shortPrice = formatShortPrice(property.price);

        const customIcon = L.divIcon({
          className: "custom-price-marker",
          html: `
            <div style="
              background-color: ${isSelected ? "#19322F" : "#006655"};
              color: white;
              padding: 4px 10px;
              border-radius: 20px;
              font-weight: 700;
              font-size: 13px;
              font-family: inherit;
              box-shadow: 0 4px 14px rgba(0,0,0,0.25);
              border: 2px solid white;
              white-space: nowrap;
              cursor: pointer;
              transition: transform 0.2s ease, background-color 0.2s ease;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span class="material-symbols-outlined" style="font-size: 14px;">home</span>
              ${shortPrice}
            </div>
          `,
          iconSize: [60, 30],
          iconAnchor: [30, 15],
          popupAnchor: [0, -15],
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; width: 220px; padding: 4px;">
            <img src="${property.imageUrl}" alt="${property.imageAlt}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <div style="font-weight: 700; color: #006655; font-size: 15px; margin-bottom: 2px;">${property.formattedPrice}</div>
            <div style="font-weight: 600; color: #19322F; font-size: 13px; line-height: 1.2; margin-bottom: 4px;">${property.title}</div>
            <div style="color: #666; font-size: 11px; margin-bottom: 8px;">${property.address}, ${property.city}</div>
            <a href="/propiedad/${property.slug}" style="display: block; width: 100%; text-align: center; background-color: #006655; color: white; padding: 6px 0; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">Ver propiedad</a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          if (onSelectProperty) onSelectProperty(property.id);
        });

        markersRef.current.set(property.id, marker);
      });

      if (properties.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    });

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties]);

  useEffect(() => {
    if (!selectedPropertyId || !mapInstanceRef.current) return;
    const marker = markersRef.current.get(selectedPropertyId);
    if (marker) {
      marker.openPopup();
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
    }
  }, [selectedPropertyId]);

  return (
    <div className="relative w-full h-full bg-clear-day dark:bg-[#0d1816]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
