import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, Trash2, UploadCloud } from "lucide-react";

import {
  removeAvatarByUrl,
  uploadAvatar,
  validateAvatarFile,
} from "../../lib/storage";
import { updateTutorProfile } from "../../lib/profile";

export default function AvatarUploader({
  userId,
  name,
  avatarUrl,
  onUpdated,
  fallbackEmail = "",
  fallbackDisplayName = "",
}) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(avatarUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewUrl(avatarUrl ?? null);
  }, [avatarUrl]);

  const initials = useMemo(() => initialsFor(name), [name]);

  const handlePick = () => fileInputRef.current?.click();

  const handleFile = async (event) => {
    setError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const previousPreview = previewUrl;
    setUploading(true);

    const previousAvatar = avatarUrl;
    const { data: upload, error: uploadError } = await uploadAvatar({
      userId,
      file,
    });

    if (uploadError) {
      setError(uploadError.message ?? "Upload failed.");
      setPreviewUrl(previousPreview);
      setUploading(false);
      return;
    }

    const { data: profile, error: dbError } = await updateTutorProfile(
      userId,
      { avatar_url: upload.publicUrl },
      { email: fallbackEmail, displayName: fallbackDisplayName },
    );

    setUploading(false);

    if (dbError) {
      setError(dbError.message ?? "Couldn't save the new photo.");
      setPreviewUrl(previousPreview);
      return;
    }

    setPreviewUrl(upload.publicUrl);
    onUpdated?.(profile);

    if (previousAvatar && previousAvatar !== upload.publicUrl) {
      removeAvatarByUrl(previousAvatar);
    }
  };

  const handleRemove = async () => {
    if (!avatarUrl) return;
    setError("");
    setRemoving(true);
    const previousAvatar = avatarUrl;

    const { data: profile, error: dbError } = await updateTutorProfile(
      userId,
      { avatar_url: null },
      { email: fallbackEmail, displayName: fallbackDisplayName },
    );

    setRemoving(false);

    if (dbError) {
      setError(dbError.message ?? "Couldn't remove the photo.");
      return;
    }

    setPreviewUrl(null);
    onUpdated?.(profile);
    removeAvatarByUrl(previousAvatar);
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-white/10"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={name ? `${name} avatar` : "Tutor avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-slate-950 dark:text-white">
              {initials}
            </span>
          )}

          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
              <Loader2 size={22} className="animate-spin text-white" />
            </div>
          ) : null}
        </motion.div>

        <button
          type="button"
          onClick={handlePick}
          disabled={uploading}
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10"
        >
          <Camera size={15} />
        </button>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 dark:text-slate-200">
          Profile photo
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Square JPG, PNG or WEBP, up to 5 MB. Shows on your tutor card and
          dashboard.
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <button
            type="button"
            onClick={handlePick}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {uploading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <UploadCloud size={13} />
            )}
            {uploading
              ? "Uploading..."
              : avatarUrl
                ? "Replace photo"
                : "Upload photo"}
          </button>

          {avatarUrl ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing || uploading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {removing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              Remove
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="mt-2 max-w-md rounded-lg border border-rose-200/60 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold leading-relaxed text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </p>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function initialsFor(name) {
  if (!name) return "T";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T"
  );
}
