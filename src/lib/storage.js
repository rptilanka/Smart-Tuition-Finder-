import { supabase } from "./supabase";

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

export const COVER_IMAGES_BUCKET =
  env.VITE_SUPABASE_COVER_PHOTO_BUCKET ||
  env.NEXT_PUBLIC_SUPABASE_COVER_PHOTO_BUCKET ||
  env.VITE_SUPABASE_COVER_BUCKET ||
  env.NEXT_PUBLIC_SUPABASE_COVER_BUCKET ||
  DEMO_VIDEOS_BUCKET;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_VIDEO_MIME = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
];

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

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

export async function uploadAvatar({ userId, file }) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };

  const validationError = validateAvatarFile(file);
  if (validationError) return { data: null, error: new Error(validationError) };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return { data: null, error: friendlyStorageError(uploadError) };
  }

  const { data: pub } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(path);

  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;

  return { data: { path, publicUrl }, error: null };
}

export async function uploadCoverImage({ userId, file }) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };
  if (!userId) return { data: null, error: new Error("Not signed in.") };

  const validationError = validateAvatarFile(file);
  if (validationError) return { data: null, error: new Error(validationError) };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/covers/cover-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(COVER_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      data: null,
      error: friendlyStorageError(uploadError, COVER_IMAGES_BUCKET),
    };
  }

  const { data: pub } = supabase.storage
    .from(COVER_IMAGES_BUCKET)
    .getPublicUrl(path);

  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;
  return { data: { path, publicUrl }, error: null };
}

export async function uploadDemoVideo({ userId, file }) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };
  if (!userId) return { data: null, error: new Error("Not signed in.") };

  const validationError = validateDemoVideoFile(file);
  if (validationError) return { data: null, error: new Error(validationError) };

  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const path = `${userId}/demo-videos/demo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(DEMO_VIDEOS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      data: null,
      error: friendlyStorageError(uploadError, DEMO_VIDEOS_BUCKET),
    };
  }

  const { data: pub } = supabase.storage
    .from(DEMO_VIDEOS_BUCKET)
    .getPublicUrl(path);

  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;
  return { data: { path, publicUrl }, error: null };
}

function friendlyStorageError(error, bucket = AVATARS_BUCKET) {
  const msg = error?.message ?? String(error);
  if (/bucket not found/i.test(msg) || /Bucket .* not found/i.test(msg)) {
    return new Error(
      `The "${bucket}" storage bucket is missing. In Supabase open Storage → New bucket → name "${bucket}" → make it Public, then restart the dev server.`,
    );
  }
  if (/row-level security/i.test(msg) || /violates.*policy/i.test(msg)) {
    return new Error(
      `Upload blocked by Row Level Security on the "${bucket}" bucket. Open Supabase → SQL Editor and apply the storage policies for "${bucket}".`,
    );
  }
  if (/payload too large|exceeds the maximum/i.test(msg)) {
    return new Error(
      "That image is too large for your Supabase storage limits.",
    );
  }
  return error;
}

async function removeObjectByPublicUrl(url, bucket) {
  if (!supabase || !url) return;
  try {
    const marker = `/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const pathWithQuery = url.slice(idx + marker.length);
    const path = pathWithQuery.split("?")[0];
    await supabase.storage.from(bucket).remove([path]);
  } catch {}
}

/**
 * Props for <img> when loading Supabase Storage public object URLs.
 * Without this, some browsers send a cross-origin Referer and the image
 * request can fail (403) on strict storage/CDN setups.
 */
export function supabaseStorageImageProps(url) {
  if (!url || typeof url !== "string") return {};
  if (!/\/storage\/v1\/object\//i.test(url)) return {};
  return { referrerPolicy: "no-referrer" };
}

export async function removeAvatarByUrl(url) {
  return removeObjectByPublicUrl(url, AVATARS_BUCKET);
}

export async function removeCoverImageByUrl(url) {
  if (!url) return;
  await removeObjectByPublicUrl(url, COVER_IMAGES_BUCKET);
  await removeObjectByPublicUrl(url, AVATARS_BUCKET);
}
