import { supabase, TUTOR_PROFILES_TABLE } from "./supabase";
import { DEMO_VIDEOS_BUCKET } from "./storage";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isColumnMissingError(error) {
  const msg = error?.message ?? String(error ?? "");
  return (
    /column.*does not exist/i.test(msg) ||
    /could not find.*column/i.test(msg) ||
    /schema cache/i.test(msg) ||
    /42703/.test(String(error?.code ?? ""))
  );
}

const SETUP_MSG =
  "The profile_photos column is missing. Run supabase/add_profile_photos_column.sql in your Supabase SQL Editor, then reload the page.";

/* ── helpers to read / write the JSONB array ─────────────────────────────── */

async function fetchPhotosArray(tutorId) {
  const { data, error } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .select("profile_photos")
    .eq("id", tutorId)
    .maybeSingle();

  if (error) {
    if (isColumnMissingError(error)) return [];
    throw error;
  }
  const arr = data?.profile_photos;
  return Array.isArray(arr) ? arr : [];
}

async function savePhotosArray(tutorId, photos) {
  const { error } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .update({ profile_photos: photos })
    .eq("id", tutorId);

  if (error) {
    if (isColumnMissingError(error)) throw new Error(SETUP_MSG);
    throw error;
  }
}

/* ── public API ──────────────────────────────────────────────────────────── */

export function validatePhotoFile(file) {
  if (!file) return "Please choose an image to upload.";
  if (!ALLOWED_MIME.includes(file.type)) return "Use a JPG, PNG, WEBP or GIF image.";
  if (file.size > MAX_BYTES) return "Image must be smaller than 8 MB.";
  return null;
}

export function validatePhotoUrl(url) {
  if (!url || !url.trim()) return "Please enter an image URL.";
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:")
      return "URL must start with http:// or https://";
  } catch {
    return "Enter a valid URL (e.g. https://example.com/photo.jpg).";
  }
  return null;
}

export async function getTutorPhotos(tutorId) {
  if (!supabase || !tutorId) return [];
  return fetchPhotosArray(tutorId);
}

export async function uploadTutorPhoto({ tutorId, file, caption = "" }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (!tutorId) throw new Error("Not signed in.");

  const err = validatePhotoFile(file);
  if (err) throw new Error(err);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${tutorId}/photos/photo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(DEMO_VIDEOS_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

  if (uploadError) {
    const msg = uploadError?.message ?? String(uploadError);
    if (/bucket not found/i.test(msg))
      throw new Error(`Storage bucket "${DEMO_VIDEOS_BUCKET}" not found. Create it in Supabase → Storage and make it Public.`);
    throw uploadError;
  }

  const { data: pub } = supabase.storage.from(DEMO_VIDEOS_BUCKET).getPublicUrl(path);
  const url = `${pub.publicUrl}?v=${Date.now()}`;

  const photo = { id: newId(), url, path, caption: caption.trim() || null, created_at: new Date().toISOString() };

  const existing = await fetchPhotosArray(tutorId);
  await savePhotosArray(tutorId, [photo, ...existing]);

  return photo;
}

export async function addTutorPhotoByUrl({ tutorId, url, caption = "" }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (!tutorId) throw new Error("Not signed in.");

  const err = validatePhotoUrl(url);
  if (err) throw new Error(err);

  const photo = { id: newId(), url: url.trim(), path: "", caption: caption.trim() || null, created_at: new Date().toISOString() };

  const existing = await fetchPhotosArray(tutorId);
  await savePhotosArray(tutorId, [photo, ...existing]);

  return photo;
}

export async function deleteTutorPhoto({ tutorId, id, path }) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const existing = await fetchPhotosArray(tutorId);
  await savePhotosArray(tutorId, existing.filter((p) => p.id !== id));

  if (path) {
    await supabase.storage.from(DEMO_VIDEOS_BUCKET).remove([path]).catch(() => {});
  }
}
