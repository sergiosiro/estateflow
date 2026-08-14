"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { Property } from "@/types/property";

interface HomeScreenProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function HomeScreen({
  properties,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Hero Banner with Search */}
        <HeroSection />

        {/* Featured Properties Section */}
        <section className="w-full px-4 md:px-12 py-12 max-w-7xl mx-auto my-4">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-nordic dark:text-white mb-1">
                Propiedades Destacadas
              </h2>
              <p className="text-sm md:text-base text-nordic/70 dark:text-emerald-100/70">
                Explora nuestra selección exclusiva de inmuebles premium.
              </p>
            </div>
            <div className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-hint-of-green/40 dark:bg-emerald-950/60 text-mosque dark:text-emerald-300 border border-mosque/20 dark:border-emerald-500/30">
              Página {currentPage} de {totalPages || 1}
            </div>
          </div>

          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-[#142421] rounded-2xl border border-nordic/10 dark:border-emerald-500/20 p-8">
              <span className="material-symbols-outlined text-5xl text-nordic/40 dark:text-emerald-500/40 mb-3">
                home_work
              </span>
              <h3 className="text-lg font-bold text-nordic dark:text-white mb-1">
                No se encontraron propiedades
              </h3>
              <p className="text-sm text-nordic/60 dark:text-emerald-100/60">
                No hay propiedades disponibles en esta página.
              </p>
            </div>
          )}

          {/* Server-Side Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
