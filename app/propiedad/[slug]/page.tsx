import { getPropertyBySlug } from "@/lib/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import AgentContactForm from "@/components/AgentContactForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Propiedad No Encontrada | EstateFlow",
    };
  }

  return {
    title: `${property.title} en ${property.city}, ${property.state} - ${property.formattedPrice} | EstateFlow`,
    description: `Propiedad de ${property.beds} hab., ${property.baths} baños y ${property.sqft} sqft en ${property.address}, ${property.city}, ${property.state}.`,
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0]">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <span className="material-symbols-outlined text-6xl text-nordic/30 dark:text-emerald-500/30 mb-4">
            home_work
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-nordic dark:text-white mb-2">
            Propiedad No Encontrada
          </h1>
          <p className="text-nordic/70 dark:text-emerald-100/70 mb-6 max-w-md">
            La propiedad que estás buscando no existe o ha sido despublicada.
          </p>
          <Link
            href="/"
            className="bg-mosque dark:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Volver a las Propiedades
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate estimated monthly mortgage (~5% interest, 30 yrs, 20% down)
  const estimatedMortgage = Math.round((property.price * 0.8 * 0.005368) || 0);
  const formattedMortgage = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(estimatedMortgage);

  const images = property.images && property.images.length > 0
    ? property.images
    : [property.imageUrl];

  return (
    <div className="min-h-screen flex flex-col bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] transition-colors duration-300">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-12 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-nordic/60 dark:text-emerald-100/60 mb-6">
          <Link href="/" className="hover:text-mosque dark:hover:text-emerald-400 transition-colors">
            Inicio
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/" className="hover:text-mosque dark:hover:text-emerald-400 transition-colors">
            Comprar
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="hover:text-mosque dark:hover:text-emerald-400 transition-colors">
            {property.state || property.city}
          </span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-nordic dark:text-white font-medium truncate max-w-[200px] md:max-w-none">
            {property.title}
          </span>
        </nav>

        {/* Property Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-nordic dark:text-white mb-2">
              {property.title}
            </h1>
            <p className="text-sm md:text-base text-nordic/70 dark:text-emerald-100/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-lg text-mosque dark:text-emerald-400">
                location_on
              </span>
              {property.address}, {property.city}, {property.state} {property.zipCode || ""}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-3xl md:text-4xl font-bold text-mosque dark:text-emerald-400">
              {property.formattedPrice}
            </div>
            <div className="text-xs md:text-sm text-nordic/60 dark:text-emerald-100/60 mt-1">
              Est. Cuota Hipotecaria: {formattedMortgage}/mes
            </div>
          </div>
        </div>

        {/* Bento Grid Image Gallery */}
        <PropertyGallery images={images} title={property.title} />

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
                    {property.beds}
                  </div>
                  <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                    Habitaciones
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
                    {property.baths}
                  </div>
                  <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                    Baños
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
                    {property.sqft.toLocaleString()}
                  </div>
                  <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                    Sqft Totales
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
                    Hectáreas / Terreno
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <section className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 shadow-xs">
              <h2 className="text-xl font-bold text-nordic dark:text-white mb-4">
                Acerca de esta propiedad
              </h2>
              <div className="text-sm md:text-base leading-relaxed text-nordic/80 dark:text-emerald-100/80 space-y-4">
                <p>
                  {property.description ||
                    `Ubicada en una de las zonas más exclusivas de ${property.city}, esta impresionante residencia representa el pináculo de la arquitectura moderna. La propiedad ofrece una experiencia de vida inigualable con acabados de primera calidad y vistas panorámicas.`}
                </p>
                <p>
                  El nivel principal cuenta con un concepto abierto amplio con grandes ventanales de piso a techo que integran armónicamente los espacios interiores con la terraza exterior. La cocina de diseñador incluye mesadas de mármol y equipamiento de última generación.
                </p>
                <p>
                  La suite principal funciona como un santuario privado, ocupando un ala completa con vestidor a medida, baño tipo spa y balcón privado con vistas despejadas.
                </p>
              </div>
            </section>

            {/* Location Map Section */}
            <section className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 shadow-xs">
              <h2 className="text-xl font-bold text-nordic dark:text-white mb-4">
                Ubicación
              </h2>
              <PropertyMap
                address={property.address}
                city={property.city}
                state={property.state}
              />
            </section>
          </div>

          {/* Right Column: Sticky Agent Contact Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm">
              <AgentContactForm
                propertyTitle={property.title}
                propertyAddress={property.address}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
