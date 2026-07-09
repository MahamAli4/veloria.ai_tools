import { supabase } from "@/integrations/supabase/client";

const BUCKET = "tool-assets";
// ~10 years — effectively permanent signed URL for a private bucket.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data?.signedUrl) throw error ?? new Error("Signed URL failed");
  return data.signedUrl;
}
