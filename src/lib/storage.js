import { supabase } from "./supabase";

// Bucket name is configurable via env so the project can point at whatever
// bucket the developer created in their Supabase dashboard. Defaults to
// "avatars" which matches the bucket created by `supabase/schema.sql`.
const env = import.meta.env ?? {};
export const AVATARS_BUCKET =
  env.VITE_SUPABASE_AVATARS_BUCKET ||
  env.NEXT_PUBLIC_SUPABASE_AVATARS_BUCKET ||
  "avatars";
export const DEMO_VIDEOS_BUCKET =
  env.VITE_SUPABASE_DEMO_VIDEOS_BUCKET ||
  env.NEXT_PUBLIC_SUPABASE_DEMO_VIDEOS_BUCKET ||
  env.VITE_SUPABASE_AVATARS_BUCKET ||
  env.NEXT_PUBLIC_SUPABASE_AVATARS_BUCKET ||
  "smart";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_VIDEO_MIME = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v"
];
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Validate a File before upload. Returns a string error or null.
 */
export function validateAvatarFile(file) {
  if (!file) return "Please choose an image to upload.";
  if (!ALLOWED_MIME.includes(file.type))
    return "Use a JPG, PNG, WEBP or GIF image.";
  if (file.size > MAX_BYTES) return "Image must be smaller than 5 MB.";
  return null;
}

export function validateDemoVideoFile(file) {
  if (!file) return "Please choose a video file to upload.";
  if (!ALLOWED_VIDEO_MIME.includes(file.type))
    return "Use MP4, WEBM, MOV or M4V video format.";
  if (file.size > MAX_VIDEO_BYTES) return "Video must be smaller than 100 MB.";
  return null;
}

/**
 * Upload an avatar to the `avatars` bucket under `<userId>/<timestamp>.<ext>`.
 *
 * Returns `{ data: { path, publicUrl }, error }`. The caller is expected to
 * persist `publicUrl` onto the tutor's profile row.
 */
export async function uploadAvatar({ userId, file }) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };

  const validationError = validateAvatarFile(file);
  if (validationError)
    return { data: null, error: new Error(validationError) };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    return { data: null, error: friendlyStorageError(uploadError) };
  }

  const { data: pub } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(path);

  // Append a cache-buster so the browser doesn't show a stale image when
  // the user re-uploads under the same path.
  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;

  return { data: { path, publicUrl }, error: null };
}

/**
 * Upload a tutor demo video to Supabase storage.
 * Returns `{ data: { path, publicUrl }, error }`.
 */
export async function uploadDemoVideo({ userId, file }) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };
  if (!userId)
    return { data: null, error: new Error("Not signed in.") };

  const validationError = validateDemoVideoFile(file);
  if (validationError)
    return { data: null, error: new Error(validationError) };

  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const path = `${userId}/demo-videos/demo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(DEMO_VIDEOS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    return { data: null, error: friendlyStorageError(uploadError, DEMO_VIDEOS_BUCKET) };
  }

  const { data: pub } = supabase.storage
    .from(DEMO_VIDEOS_BUCKET)
    .getPublicUrl(path);

  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;
  return { data: { path, publicUrl }, error: null };
}

/**
 * Translate raw Supabase storage errors into something the UI can show
 * directly. The most common cause we hit during setup is the `avatars`
 * bucket not existing yet, which produces a vague "Bucket not found".
 */
function friendlyStorageError(error, bucket = AVATARS_BUCKET) {
  const msg = error?.message ?? String(error);
  if (/bucket not found/i.test(msg) || /Bucket .* not found/i.test(msg)) {
    return new Error(
      `The "${bucket}" storage bucket is missing. In Supabase open Storage → New bucket → name "${bucket}" → make it Public, then restart the dev server.`
    );
  }
  if (/row-level security/i.test(msg) || /violates.*policy/i.test(msg)) {
    return new Error(
      `Upload blocked by Row Level Security on the "${bucket}" bucket. Open Supabase → SQL Editor and apply the storage policies for "${bucket}".`
    );
  }
  if (/payload too large|exceeds the maximum/i.test(msg)) {
    return new Error("That image is too large for your Supabase storage limits.");
  }
  return error;
}

/**
 * Best-effort cleanup of a previous avatar object. Failures are ignored
 * because RLS will deny when the path doesn't belong to the current user
 * and we don't want to block the new upload on a cleanup error.
 */
export async function removeAvatarByUrl(url) {
  if (!supabase || !url) return;
  try {
    const marker = `/object/public/${AVATARS_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const pathWithQuery = url.slice(idx + marker.length);
    const path = pathWithQuery.split("?")[0];
    await supabase.storage.from(AVATARS_BUCKET).remove([path]);
  } catch {
    /* ignore */
  }
}
