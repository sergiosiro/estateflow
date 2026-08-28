import { getPropertyBySlug } from "@/lib/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import Link from "next/link";

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

  return (
    <div className="min-h-screen flex flex-col bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] transition-colors duration-300">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <PropertyDetailClient property={property} />

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

