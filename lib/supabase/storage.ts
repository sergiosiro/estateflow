import { supabase } from "./client";

export const PROPERTIES_BUCKET = "properties";

/**
 * Sanitizes a filename to prevent invalid characters in Supabase storage paths
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Uploads a single property image file to the Supabase 'properties' storage bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadPropertyImage(
  file: File,
  folder: string = "listings"
): Promise<{ url: string; path: string; error?: string }> {
  try {
    const rawExt = file.name.split(".").pop() || "jpg";
    const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const baseName = sanitizeFileName(
      file.name.substring(0, file.name.lastIndexOf(".")) || "image"
    );
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `${folder}/${uniqueId}_${baseName}.${cleanExt}`;

    const { data, error } = await supabase.storage
      .from(PROPERTIES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || `image/${cleanExt}`,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return { url: "", path: "", error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from(PROPERTIES_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicData.publicUrl,
      path: data.path,
    };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Unexpected error in uploadPropertyImage:", err);
    return {
      url: "",
      path: "",
      error: errorObj?.message || "Error al subir la imagen al servidor",
    };
  }
}

/**
 * Uploads multiple property image files to Supabase Storage.
 * Reports progress through an optional callback.
 */
export async function uploadMultiplePropertyImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const res = await uploadPropertyImage(file);
    if (res.error || !res.url) {
      errors.push(`Error al subir ${file.name}: ${res.error || "Fallo desconocido"}`);
    } else {
      urls.push(res.url);
    }
    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  return { urls, errors };
}
