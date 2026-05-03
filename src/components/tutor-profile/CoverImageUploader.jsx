import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";

import {
  removeAvatarByUrl,
  uploadAvatar,
  validateAvatarFile
} from "../../lib/storage";
import { updateTutorProfile } from "../../lib/profile";

export default function CoverImageUploader({
  userId,
  name,
  coverImageUrl,
  onUpdated,
  fallbackEmail = "",
  fallbackDisplayName = ""
}) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(coverImageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewUrl(coverImageUrl ?? null);
  }, [coverImageUrl]);

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

    const localUrl = URL.createObjectURL(file);
    const previousPreview = previewUrl;
    const previousCover = coverImageUrl;
    setPreviewUrl(localUrl);
    setUploading(true);

    const { data: upload, error: uploadError } = await uploadAvatar({ userId, file });
    if (uploadError) {
      setError(uploadError.message ?? "Upload failed.");
      setPreviewUrl(previousPreview);
      setUploading(false);
      URL.revokeObjectURL(localUrl);
      return;
    }

    const { data: profile, error: dbError } = await updateTutorProfile(
      userId,
      { cover_image: upload.publicUrl },
      { email: fallbackEmail, displayName: fallbackDisplayName }
    );

    URL.revokeObjectURL(localUrl);
    setUploading(false);

    if (dbError) {
      setError(dbError.message ?? "Couldn't save the new cover image.");
      setPreviewUrl(previousPreview);
      return;
    }

    setPreviewUrl(upload.publicUrl);
    onUpdated?.(profile);
    if (previousCover && previousCover !== upload.publicUrl) {
      removeAvatarByUrl(previousCover);
    }
  };

  const handleRemove = async () => {
    if (!coverImageUrl) return;
    setError("");
    setRemoving(true);
    const previousCover = coverImageUrl;

    const { data: profile, error: dbError } = await updateTutorProfile(
      userId,
      { cover_image: null },
      { email: fallbackEmail, displayName: fallbackDisplayName }
    );

    setRemoving(false);
    if (dbError) {
      setError(dbError.message ?? "Couldn't remove the cover image.");
      return;
    }

    setPreviewUrl(null);
    onUpdated?.(profile);
    removeAvatarByUrl(previousCover);
  };

  return (
    <div className="rounded-[2rem] bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mb-3 flex items-center gap-2">
        <ImageIcon size={16} className="text-slate-600 dark:text-slate-300" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 dark:text-slate-200">
          Cover image
        </h3>
      </div>

      <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={name ? `${name} cover` : "Tutor cover"}
            className="h-40 w-full object-cover sm:h-48"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-600 sm:h-48 dark:bg-slate-800 dark:text-slate-300">
            No cover image
          </div>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePick}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
          {uploading ? "Uploading..." : coverImageUrl ? "Replace cover" : "Upload cover"}
        </button>
        {coverImageUrl ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing || uploading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {removing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Remove
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 max-w-md rounded-lg border border-rose-200/60 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold leading-relaxed text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      ) : null}

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
