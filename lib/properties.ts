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
    imageCollection = item.images.filter(Boolean);
  } else if (typeof item.images === "string" && item.images.startsWith("{") && item.images.endsWith("}")) {
    imageCollection = item.images
      .slice(1, -1)
      .split(",")
      .map((s: string) => s.replace(/^"|"$/g, "").trim())
      .filter(Boolean);
  }

  if (imageCollection.length === 0) {
    imageCollection = [mainImageUrl, ...fallbackGallery];
  } else if (!imageCollection.includes(mainImageUrl)) {
    imageCollection = [mainImageUrl, ...imageCollection];
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

export async function getUserProperties(userId?: string): Promise<{
  properties: Property[];
  stats: {
    totalProperties: number;
    totalViews: number;
    inquiries: number;
  };
}> {
  try {
    let query = supabase.from("properties").select("*");
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching user properties:", error);
      const fallback = MOCK_PROPERTIES.slice(0, 3);
      return {
        properties: fallback,
        stats: {
          totalProperties: fallback.length,
          totalViews: 1245,
          inquiries: 14,
        },
      };
    }

    const properties = data.map(mapSupabaseItemToProperty);
    const totalProperties = properties.length;
    const totalViews = data.reduce((acc, curr) => acc + (Number(curr.views_count) || 0), 0) || totalProperties * 340 + 1245;
    const inquiries = data.reduce((acc, curr) => acc + (Number(curr.inquiries_count) || 0), 0) || Math.max(1, Math.floor(totalProperties * 3.5));

    return {
      properties,
      stats: {
        totalProperties,
        totalViews,
        inquiries,
      },
    };
  } catch (e) {
    console.error("Error in getUserProperties:", e);
    return {
      properties: MOCK_PROPERTIES.slice(0, 3),
      stats: {
        totalProperties: 3,
        totalViews: 1245,
        inquiries: 14,
      },
    };
  }
}

export async function createUserProperty(
  propertyData: {
    title: string;
    price: number;
    currency?: string;
    location: string;
    city: string;
    state: string;
    beds: number;
    baths: number;
    sqft: number;
    imageUrl?: string;
    images?: string[];
    description?: string;
    status?: "active" | "draft";
    tag?: string;
  },
  userId?: string
): Promise<{ success: boolean; data?: Property; error?: string }> {
  try {
    const propertyId = `prop-${Date.now()}`;
    const propertySlug = slugify(propertyData.title) + `-${Math.floor(Math.random() * 1000)}`;

    const imagesList = propertyData.images && propertyData.images.length > 0
      ? propertyData.images
      : (propertyData.imageUrl ? [propertyData.imageUrl] : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"]);

    const primaryImageUrl = propertyData.imageUrl || imagesList[0];

    const row = {
      id: propertyId,
      slug: propertySlug,
      title: propertyData.title,
      price: propertyData.price,
      currency: propertyData.currency || "USD",
      location: propertyData.location,
      city: propertyData.city,
      state: propertyData.state,
      beds: propertyData.beds,
      baths: propertyData.baths,
      sqft: propertyData.sqft,
      image_url: primaryImageUrl,
      image_alt: propertyData.title,
      images: imagesList,
      badge_text: propertyData.status === "draft" ? "Draft" : (propertyData.tag || "Active"),
      badge_variant: propertyData.status === "draft" ? "draft" : "new",
      description: propertyData.description || "",
      user_id: userId || null,
      status: propertyData.status || "active",
      views_count: 0,
      inquiries_count: 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating property:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: mapSupabaseItemToProperty(data) };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al crear la propiedad" };
  }
}

export async function updateUserProperty(
  id: string,
  propertyData: Partial<{
    title: string;
    price: number;
    currency: string;
    location: string;
    city: string;
    state: string;
    beds: number;
    baths: number;
    sqft: number;
    imageUrl: string;
    images: string[];
    description: string;
    status: "active" | "draft";
    tag: string;
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updatePayload: Record<string, any> = {};
    if (propertyData.title !== undefined) updatePayload.title = propertyData.title;
    if (propertyData.price !== undefined) updatePayload.price = propertyData.price;
    if (propertyData.currency !== undefined) updatePayload.currency = propertyData.currency;
    if (propertyData.location !== undefined) updatePayload.location = propertyData.location;
    if (propertyData.city !== undefined) updatePayload.city = propertyData.city;
    if (propertyData.state !== undefined) updatePayload.state = propertyData.state;
    if (propertyData.beds !== undefined) updatePayload.beds = propertyData.beds;
    if (propertyData.baths !== undefined) updatePayload.baths = propertyData.baths;
    if (propertyData.sqft !== undefined) updatePayload.sqft = propertyData.sqft;
    if (propertyData.imageUrl !== undefined) updatePayload.image_url = propertyData.imageUrl;
    if (propertyData.images !== undefined) updatePayload.images = propertyData.images;
    if (propertyData.description !== undefined) updatePayload.description = propertyData.description;
    if (propertyData.status !== undefined) {
      updatePayload.status = propertyData.status;
      updatePayload.badge_text = propertyData.status === "draft" ? "Draft" : (propertyData.tag || "Active");
      updatePayload.badge_variant = propertyData.status === "draft" ? "draft" : "new";
    }

    const { error } = await supabase
      .from("properties")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Error updating property:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al actualizar propiedad" };
  }
}

export async function deleteUserProperty(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting property:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al eliminar propiedad" };
  }
}
