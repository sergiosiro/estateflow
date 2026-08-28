"use client";

import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import AgentContactForm from "@/components/AgentContactForm";
import { Property } from "@/types/property";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLocalizedProperty } from "@/lib/i18n/translateProperty";

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const { language, t } = useLanguage();
  const item = getLocalizedProperty(property, language);

  // Calculate estimated monthly mortgage (~5% interest, 30 yrs, 20% down)
  const estimatedMortgage = Math.round((item.price * 0.8 * 0.005368) || 0);
  const formattedMortgage = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(estimatedMortgage);

  const images = item.images && item.images.length > 0
    ? item.images
    : [item.imageUrl];

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-12 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-nordic/60 dark:text-emerald-100/60 mb-6">
        <Link href="/" className="hover:text-mosque dark:hover:text-emerald-400 transition-colors">
          {t.nav.buy}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/buscar" className="hover:text-mosque dark:hover:text-emerald-400 transition-colors">
          {t.search.title}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="hover:text-mosque dark:hover:text-emerald-400 transition-colors">
          {item.state || item.city}
        </span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-nordic dark:text-white font-medium truncate max-w-[200px] md:max-w-none">
          {item.title}
        </span>
      </nav>

      {/* Property Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-nordic dark:text-white mb-2">
            {item.title}
          </h1>
          <p className="text-sm md:text-base text-nordic/70 dark:text-emerald-100/70 flex items-center gap-1">
            <span className="material-symbols-outlined text-lg text-mosque dark:text-emerald-400">
              location_on
            </span>
            {item.address}, {item.city}, {item.state} {item.zipCode || ""}
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-3xl md:text-4xl font-bold text-mosque dark:text-emerald-400">
            {item.formattedPrice}
          </div>
          <div className="text-xs md:text-sm text-nordic/60 dark:text-emerald-100/60 mt-1">
            {t.propertyDetail.estMortgage} {formattedMortgage}/{language === 'fr' ? 'mois' : language === 'es' ? 'mes' : 'mo'}
          </div>
        </div>
      </div>

      {/* Bento Grid Image Gallery */}
      <PropertyGallery images={images} title={item.title} />

      {/* Content Split Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Key Features, Description & Map */}
        <div className="lg:w-2/3 space-y-8">
          {/* Key Features Bar */}
          <div className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 flex flex-wrap gap-6 justify-between items-center shadow-xs">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-3xl">
                bed
              </span>
              <div>
                <div className="text-xl font-bold text-nordic dark:text-white">
                  {item.beds}
                </div>
                <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                  {t.card.beds}
                </div>
              </div>
            </div>

            <div className="w-px h-10 bg-nordic/10 dark:bg-emerald-500/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-3xl">
                bathtub
              </span>
              <div>
                <div className="text-xl font-bold text-nordic dark:text-white">
                  {item.baths}
                </div>
                <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                  {t.card.baths}
                </div>
              </div>
            </div>

            <div className="w-px h-10 bg-nordic/10 dark:bg-emerald-500/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-3xl">
                square_foot
              </span>
              <div>
                <div className="text-xl font-bold text-nordic dark:text-white">
                  {item.sqft.toLocaleString()}
                </div>
                <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                  {t.card.sqft}
                </div>
              </div>
            </div>

            <div className="w-px h-10 bg-nordic/10 dark:bg-emerald-500/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-3xl">
                landscape
              </span>
              <div>
                <div className="text-xl font-bold text-nordic dark:text-white">
                  1.2
                </div>
                <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                  {t.propertyDetail.lotSize}
                </div>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <section className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 shadow-xs">
            <h2 className="text-xl font-bold text-nordic dark:text-white mb-4">
              {t.propertyDetail.description}
            </h2>
            <div className="text-sm md:text-base leading-relaxed text-nordic/80 dark:text-emerald-100/80 space-y-4">
              <p>{item.description}</p>
            </div>
          </section>

          {/* Location Map Section */}
          <section className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 shadow-xs">
            <h2 className="text-xl font-bold text-nordic dark:text-white mb-4">
              {t.propertyDetail.location}
            </h2>
            <PropertyMap
              address={item.address}
              city={item.city}
              state={item.state}
            />
          </section>
        </div>

        {/* Right Column: Sticky Agent Contact Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm">
            <AgentContactForm
              propertyTitle={item.title}
              propertyAddress={item.address}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

