import { supabase } from "./supabase/client";
import { Property } from "@/types/property";

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

  const properties: Property[] = (data || []).map((item) => {
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

    return {
      id: String(item.id),
      title: item.title || "Propiedad sin título",
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
      imageUrl: item.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      imageAlt: item.image_alt || item.title || "Foto de la propiedad",
      isFavorite: Boolean(item.is_favorite),
    };
  });

  return {
    properties,
    totalCount,
    totalPages,
    currentPage: pageNum,
    pageSize,
  };
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

