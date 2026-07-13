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

  const formData = new FormData();
  formData.append("file", compressed, file.name);
  formData.append("folder", folder);

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const headers: { [key: string]: string } = {};
  const token = localStorage.getItem("access_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api/upload/`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    let message = `Upload failed: ${res.status}`;
    try {
      const errObj = JSON.parse(errText);
      message = errObj.detail || errObj.error || message;
    } catch {}
    throw new Error(message);
  }

  const data = await res.json();
  return data.url;
}
