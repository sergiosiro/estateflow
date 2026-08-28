import { supabase } from "./supabase/client";
import { Property } from "@/types/property";
import { MOCK_PROPERTIES, slugify } from "@/data/mockProperties";

const fallbackGallery = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
];

export function mapSupabaseItemToProperty(item: any): Property {
  const numericPrice = Number(item.price) || 0;

  let tagTypeMapped: Property["tagType"] = "new";
  if (item.badge_variant === "open_house" || item.badge_variant === "open") {
    tagTypeMapped = "open";
  } else if (
    item.badge_variant === "pricedrop" ||
    item.badge_variant === "price_drop"
  ) {
    tagTypeMapped = "pricedrop";
  } else if (item.badge_variant === "featured") {
    tagTypeMapped = "featured";
  } else if (item.badge_variant === "new") {
    tagTypeMapped = "new";
  }

  const mainImageUrl = item.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

  let imageCollection: string[] = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    imageCollection = item.images;
  } else {
    imageCollection = [mainImageUrl, ...fallbackGallery];
  }

  const title = item.title || "Propiedad sin título";
  const propertySlug = item.slug || slugify(title);

  const titleTranslations: Record<string, string> = {};
  if (item.title_es || item.title_spanish) titleTranslations.es = item.title_es || item.title_spanish;
  if (item.title_en || item.title_english) titleTranslations.en = item.title_en || item.title_english;
  if (item.title_fr || item.title_french) titleTranslations.fr = item.title_fr || item.title_french;

  const descriptionTranslations: Record<string, string> = {};
  if (item.description_es || item.description_spanish) descriptionTranslations.es = item.description_es || item.description_spanish;
  if (item.description_en || item.description_english) descriptionTranslations.en = item.description_en || item.description_english;
  if (item.description_fr || item.description_french) descriptionTranslations.fr = item.description_fr || item.description_french;

  const tagTranslations: Record<string, string> = {};
  if (item.badge_text_es || item.tag_es) tagTranslations.es = item.badge_text_es || item.tag_es;
  if (item.badge_text_en || item.tag_en) tagTranslations.en = item.badge_text_en || item.tag_en;
  if (item.badge_text_fr || item.tag_fr) tagTranslations.fr = item.badge_text_fr || item.tag_fr;

  return {
    id: String(item.id),
    slug: propertySlug,
    title,
    titleTranslations: Object.keys(titleTranslations).length > 0 ? titleTranslations : undefined,
    price: numericPrice,
    formattedPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: item.currency || "USD",
      maximumFractionDigits: 0,
    }).format(numericPrice),
    address: item.location || `${item.city || ""}, ${item.state || ""}`.trim(),
    city: item.city || "",
    state: item.state || "",
    zipCode: item.zip_code || "",
    beds: Number(item.beds) || 0,
    baths: Number(item.baths) || 0,
    sqft: Number(item.sqft) || 0,
    tag: item.badge_text || "Destacado",
    tagTranslations: Object.keys(tagTranslations).length > 0 ? tagTranslations : undefined,
    tagType: tagTypeMapped,
    imageUrl: mainImageUrl,
    imageAlt: item.image_alt || title,
    images: imageCollection,
    description: item.description || undefined,
    descriptionTranslations: Object.keys(descriptionTranslations).length > 0 ? descriptionTranslations : undefined,
    isFavorite: Boolean(item.is_favorite),
  };
}

export interface GetPropertiesResult {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getProperties(
  page: number = 1,
  pageSize: number = 6
): Promise<GetPropertiesResult> {
  const pageNum = Math.max(1, page);
  const from = (pageNum - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching properties from Supabase:", error);
    return {
      properties: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: pageNum,
      pageSize,
    };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const properties: Property[] = (data || []).map(mapSupabaseItemToProperty);

  return {
    properties,
    totalCount,
    totalPages,
    currentPage: pageNum,
    pageSize,
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!slug) return null;

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return mapSupabaseItemToProperty(data);
    }
  } catch (err) {
    console.error(`Error fetching property by slug (${slug}):`, err);
  }

  // Fallback to MOCK_PROPERTIES
  const found = MOCK_PROPERTIES.find(
    (p) => p.slug === slug || p.id === slug
  );

  return found || null;
}

export async function togglePropertyFavorite(
  id: string,
  isFavorite: boolean
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("properties")
    .update({ is_favorite: isFavorite })
    .eq("id", id);

  if (error) {
    console.error(`Error updating favorite for property ${id}:`, error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export interface PropertySearchFilters {
  location?: string;
  intent?: "buy" | "rent" | string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  minSqft?: number;
  maxSqft?: number;
  minYear?: number;
  maxYear?: number;
  status?: string;
  amenities?: string[];
}

export async function searchProperties(
  filters: PropertySearchFilters = {}
): Promise<Property[]> {
  try {
    let query = supabase.from("properties").select("*");

    if (filters.maxPrice && filters.maxPrice > 0) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters.minPrice && filters.minPrice > 0) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.beds && filters.beds > 0) {
      query = query.gte("beds", filters.beds);
    }
    if (filters.baths && filters.baths > 0) {
      query = query.gte("baths", filters.baths);
    }
    if (filters.minSqft && filters.minSqft > 0) {
      query = query.gte("sqft", filters.minSqft);
    }
    if (filters.maxSqft && filters.maxSqft > 0) {
      query = query.lte("sqft", filters.maxSqft);
    }
    if (filters.location && filters.location.trim() !== "") {
      const loc = filters.location.trim();
      query = query.or(
        `title.ilike.%${loc}%,city.ilike.%${loc}%,location.ilike.%${loc}%,state.ilike.%${loc}%`
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    let supabaseResults: Property[] = [];
    if (!error && data && data.length > 0) {
      supabaseResults = data.map(mapSupabaseItemToProperty);
    }

    let source = supabaseResults.length > 0 ? supabaseResults : MOCK_PROPERTIES;

    return source.filter((p) => {
      if (filters.location && filters.location.trim() !== "" && supabaseResults.length === 0) {
        const term = filters.location.trim().toLowerCase();
        const text = `${p.title} ${p.address} ${p.city} ${p.state} ${p.zipCode || ""}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.beds && p.beds < filters.beds) return false;
      if (filters.baths && Number(p.baths) < filters.baths) return false;
      if (filters.minSqft && p.sqft < filters.minSqft) return false;
      if (filters.maxSqft && p.sqft > filters.maxSqft) return false;

      if (filters.propertyType && filters.propertyType !== "all" && filters.propertyType !== "") {
        const typeTerm = filters.propertyType.toLowerCase();
        const pTitle = p.title.toLowerCase();
        if (typeTerm === "house" || typeTerm === "casa") {
          if (!pTitle.includes("house") && !pTitle.includes("casa") && !pTitle.includes("residence") && !pTitle.includes("home") && !pTitle.includes("villa") && !pTitle.includes("chalet") && !pTitle.includes("manor")) return false;
        } else if (typeTerm === "apartment" || typeTerm === "departamento" || typeTerm === "condo") {
          if (!pTitle.includes("apartment") && !pTitle.includes("apt") && !pTitle.includes("penthouse") && !pTitle.includes("condo") && !pTitle.includes("loft") && !pTitle.includes("downtown")) return false;
        } else if (typeTerm === "villa") {
          if (!pTitle.includes("villa") && !pTitle.includes("estate")) return false;
        } else if (typeTerm === "penthouse") {
          if (!pTitle.includes("penthouse") && !pTitle.includes("loft")) return false;
        } else if (typeTerm === "townhouse") {
          if (!pTitle.includes("townhouse") && !pTitle.includes("craftsman")) return false;
        } else {
          if (!pTitle.includes(typeTerm)) return false;
        }
      }

      if (filters.status && filters.status !== "all" && filters.status !== "") {
        const st = filters.status.toLowerCase();
        if (st === "new") {
          if (p.tagType !== "new" && !p.tag.toLowerCase().includes("new")) return false;
        } else if (st === "open" || st === "open_house") {
          if (p.tagType !== "open" && !p.tag.toLowerCase().includes("open")) return false;
        } else if (st === "pricedrop" || st === "price_drop") {
          if (p.tagType !== "pricedrop" && !p.tag.toLowerCase().includes("drop")) return false;
        } else if (st === "featured") {
          if (p.tagType !== "featured" && !p.tag.toLowerCase().includes("featured")) return false;
        }
      }

      if (filters.amenities && filters.amenities.length > 0) {
        const fullText = `${p.title} ${p.description || ""} ${p.tag}`.toLowerCase();
        for (const amenity of filters.amenities) {
          const am = amenity.toLowerCase();
          if (am === "pool" || am === "piscina") {
            if (!fullText.includes("pool") && !fullText.includes("piscina") && !fullText.includes("beach") && !fullText.includes("lake")) return false;
          } else if (am === "garage" || am === "garaje") {
            if (!fullText.includes("garage") && !fullText.includes("parking") && !fullText.includes("drive")) return false;
          } else if (am === "garden" || am === "jardín") {
            if (!fullText.includes("garden") && !fullText.includes("lawn") && !fullText.includes("patio") && !fullText.includes("yard") && !fullText.includes("terrace")) return false;
          } else if (am === "gym" || am === "gimnasio") {
            if (!fullText.includes("gym") && !fullText.includes("fitness") && !fullText.includes("spa")) return false;
          } else {
            if (!fullText.includes(am)) return false;
          }
        }
      }

      return true;
    });
  } catch (err) {
    console.error("Error in searchProperties:", err);
    return MOCK_PROPERTIES.filter((p) => {
      if (filters.location && filters.location.trim() !== "") {
        const term = filters.location.trim().toLowerCase();
        const text = `${p.title} ${p.address} ${p.city} ${p.state} ${p.zipCode || ""}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.beds && p.beds < filters.beds) return false;
      if (filters.baths && Number(p.baths) < filters.baths) return false;
      if (filters.minSqft && p.sqft < filters.minSqft) return false;
      if (filters.maxSqft && p.sqft > filters.maxSqft) return false;
      return true;
    });
  }
}




