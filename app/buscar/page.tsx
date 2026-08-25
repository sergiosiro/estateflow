import { Suspense } from "react";
import SearchScreen from "@/components/SearchScreen";
import { searchProperties } from "@/lib/properties";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const location = typeof params.location === "string" ? params.location : "";

  return {
    title: location
      ? `Propiedades en ${location} | EstateFlow Búsqueda`
      : "Buscar Propiedades | EstateFlow",
    description:
      "Explora y filtra miles de propiedades disponibles para compra y renta en EstateFlow.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const location = typeof params.location === "string" ? params.location : "";
  const intent = typeof params.intent === "string" ? params.intent : "";
  const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const minPrice = typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const beds = typeof params.beds === "string" ? Number(params.beds) : undefined;
  const baths = typeof params.baths === "string" ? Number(params.baths) : undefined;
  const propertyType = typeof params.propertyType === "string" ? params.propertyType : "all";

  const minSqft = typeof params.minSqft === "string" ? Number(params.minSqft) : undefined;
  const maxSqft = typeof params.maxSqft === "string" ? Number(params.maxSqft) : undefined;
  const minYear = typeof params.minYear === "string" ? Number(params.minYear) : undefined;
  const maxYear = typeof params.maxYear === "string" ? Number(params.maxYear) : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const amenities = typeof params.amenities === "string" ? params.amenities.split(",") : undefined;

  const initialProperties = await searchProperties({
    location,
    intent,
    maxPrice,
    minPrice,
    beds,
    baths,
    propertyType,
    minSqft,
    maxSqft,
    minYear,
    maxYear,
    status,
    amenities,
  });

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-clear-day dark:bg-[#0d1816] flex items-center justify-center text-nordic dark:text-white">
          <div className="flex items-center gap-3 font-semibold">
            <span className="material-symbols-outlined animate-spin text-2xl text-mosque dark:text-emerald-400">
              progress_activity
            </span>
            Cargando búsqueda de propiedades...
          </div>
        </div>
      }
    >
      <SearchScreen initialProperties={initialProperties} />
    </Suspense>
  );
}
