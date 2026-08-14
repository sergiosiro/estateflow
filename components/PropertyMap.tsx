"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  address: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

export default function PropertyMap({
  address,
  city,
  state,
  lat = 34.0736,
  lng = -118.4004,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isSubscribed = true;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Add CartoDB Voyager clean tile layer matching Nordic theme
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom Nordic / Mosque styled pin marker
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            background-color: #006655;
            color: white;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <span class="material-symbols-outlined" style="font-size: 22px;">location_on</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(
        `<div style="font-family: inherit; padding: 4px;">
          <strong style="color: #19322F; font-size: 14px;">${address}</strong><br/>
          <span style="color: #666; font-size: 12px;">${city}, ${state}</span>
        </div>`
      );

      mapInstanceRef.current = map;
    });

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, address, city, state]);

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-sm border border-nordic/10 dark:border-emerald-500/20">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#142421]/90 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-2 z-10 border border-nordic/10 dark:border-emerald-500/20">
        <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-lg">
          map
        </span>
        <span className="text-xs font-semibold text-nordic dark:text-white">
          {city}, {state}
        </span>
      </div>
    </div>
  );
}
