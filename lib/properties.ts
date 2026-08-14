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

  return {
    id: String(item.id),
    slug: propertySlug,
    title,
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
    tagType: tagTypeMapped,
    imageUrl: mainImageUrl,
    imageAlt: item.image_alt || title,
    images: imageCollection,
    description: item.description || undefined,
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


