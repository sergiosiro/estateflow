"use client";

import { useState, useEffect } from "react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  const mainImage = images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
  const secondaryImages = images.slice(1, 5);
  const remainingCount = images.length > 5 ? images.length - 5 : 0;

  return (
    <>
      {/* Bento Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 mb-8 h-[360px] md:h-[540px] rounded-2xl overflow-hidden shadow-sm border border-nordic/10 dark:border-emerald-500/20 bg-nordic/5 dark:bg-emerald-950/20">
        {/* Main Photo (Spans 2 cols, 2 rows) */}
        <div
          onClick={() => setSelectedIndex(0)}
          className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden h-full"
        >
          <img
            src={mainImage}
            alt={`${title} - Foto principal`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        </div>

        {/* Secondary Photos */}
        {secondaryImages.map((imgUrl, index) => {
          const actualIndex = index + 1;
          const isLastVisible = index === 3 && remainingCount > 0;

          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(actualIndex)}
              className="hidden md:block relative group cursor-pointer overflow-hidden h-full"
            >
              <img
                src={imgUrl}
                alt={`${title} - Foto ${actualIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

              {/* Overlay for +N Photos if applicable */}
              {isLastVisible && (
                <div className="absolute inset-0 bg-nordic/60 dark:bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center transition-colors duration-300 group-hover:bg-nordic/70">
                  <span className="text-white text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">photo_library</span>
                    +{remainingCount + 1} Fotos
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex justify-between items-center text-white w-full max-w-7xl mx-auto">
            <div className="text-sm md:text-base font-medium">
              {title} <span className="opacity-60 ml-2">({selectedIndex + 1} de {images.length})</span>
            </div>
            <button
              onClick={() => setSelectedIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar galería"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Main Content Area (Image + Nav arrows) */}
          <div className="relative flex-grow flex items-center justify-center my-4 max-w-6xl mx-auto w-full">
            {/* Prev Button */}
            <button
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0
                )
              }
              className="absolute left-2 md:left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-colors z-10"
              aria-label="Foto anterior"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            {/* Current Large Image */}
            <div className="max-h-[70vh] max-w-full overflow-hidden flex items-center justify-center">
              <img
                src={images[selectedIndex]}
                alt={`${title} - Foto ${selectedIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0
                )
              }
              className="absolute right-2 md:right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-colors z-10"
              aria-label="Foto siguiente"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="w-full max-w-5xl mx-auto overflow-x-auto py-2 flex gap-3 justify-center items-center">
            {images.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  selectedIndex === i
                    ? "ring-2 ring-emerald-400 opacity-100 scale-105"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
