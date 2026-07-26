import { supabase } from "@/integrations/supabase/client";

const BUCKET = "tool-assets";

// Downscale + compress an image in the browser before upload so we never
// store multi-MB originals (the main cause of slow image loading).
async function compressImage(file: File, maxDim: number, quality = 0.82): Promise<Blob> {
  // Skip non-raster files (e.g. svg) — nothing to compress.
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    // Only use the compressed version if it's actually smaller.
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  // Logos are small; covers can be wider.
  const maxDim = folder.includes("logo") ? 400 : 1600;
  const compressed = await compressImage(file, maxDim);
  const contentType = compressed instanceof File ? compressed.type : "image/webp";
  const ext = contentType === "image/webp" ? "webp" : (file.name.split(".").pop() || "png");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
