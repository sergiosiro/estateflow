"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { MOCK_PROPERTIES } from "@/data/mockProperties";

export default function HomeScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-clear-day text-nordic">
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
              <h2 className="text-2xl md:text-3xl font-bold text-nordic mb-1">
                Propiedades Destacadas
              </h2>
              <p className="text-sm md:text-base text-nordic/70">
                Explora nuestra selección exclusiva de inmuebles premium.
              </p>
            </div>
            <a
              href="#"
              className="hidden md:flex items-center gap-1 text-mosque font-semibold text-sm hover:underline hover:gap-2 transition-all"
            >
              Ver todas{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </a>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-8 flex justify-center md:hidden">
            <a
              href="#"
              className="w-full text-center bg-white text-mosque border border-mosque/30 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-hint-of-green/20 transition-colors shadow-xs"
            >
              Ver todas las propiedades
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
