import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Link2, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  removeCoverImageByUrl,
  supabaseStorageImageProps,
  uploadCoverImage,
  validateAvatarFile,
} from "../../lib/storage";
import { updateTutorProfile } from "../../lib/profile";

export default function CoverImageUploader({
  userId,
  name,
  coverImageUrl,
  onUpdated,
  fallbackEmail = "",
  fallbackDisplayName = "",
}) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(coverImageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [urlDraft, setUrlDraft] = useState("");

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

    const previousPreview = previewUrl;
    const previousCover = coverImageUrl;
    setUploading(true);

    const { data: upload, error: uploadError } = await uploadCoverImage({
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
      { cover_image: upload.publicUrl },
      { email: fallbackEmail, displayName: fallbackDisplayName },
    );

    setUploading(false);

    if (dbError) {
      setError(dbError.message ?? "Couldn't save the new cover image.");
      setPreviewUrl(previousPreview);
      return;
    }

    setPreviewUrl(upload.publicUrl);
    onUpdated?.(profile);
    if (previousCover && previousCover !== upload.publicUrl) {
      removeCoverImageByUrl(previousCover);
    }
  };

  const applyImageUrl = async () => {
    setError("");
    const raw = urlDraft.trim();
    if (!raw) {
      setError("Enter an image URL, or use file upload above.");
      return;
    }
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      setError("That doesn’t look like a valid URL.");
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setError("Use an http or https image URL.");
      return;
    }

    const previousPreview = previewUrl;
    const previousCover = coverImageUrl;
    setPreviewUrl(raw);
    setSavingUrl(true);

    const { data: profile, error: dbError } = await updateTutorProfile(
      userId,
      { cover_image: raw },
      { email: fallbackEmail, displayName: fallbackDisplayName },
    );

    setSavingUrl(false);
    if (dbError) {
      setError(dbError.message ?? "Couldn't save the cover image URL.");
      setPreviewUrl(previousPreview);
      return;
    }

    onUpdated?.(profile);
    setUrlDraft("");
    if (previousCover && previousCover !== raw) {
      removeCoverImageByUrl(previousCover);
    }
  };

  const effectiveCoverUrl = coverImageUrl
    ? coverImageUrl
    : previewUrl && /^https?:\/\//i.test(previewUrl)
      ? previewUrl
      : null;

  const handleRemove = async () => {
    if (!effectiveCoverUrl) return;
    setError("");
    setRemoving(true);
    const previousCover = effectiveCoverUrl;

    const { data: profile, error: dbError } = await updateTutorProfile(
      userId,
      { cover_image: null },
      { email: fallbackEmail, displayName: fallbackDisplayName },
    );

    setRemoving(false);
    if (dbError) {
      setError(dbError.message ?? "Couldn't remove the cover image.");
      return;
    }

    setPreviewUrl(null);
    onUpdated?.(profile);
    removeCoverImageByUrl(previousCover);
  };

  return (
    <div className="rounded-[2rem] bg-slate-50 p-4 dark:bg-neutral-950">
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
            {...supabaseStorageImageProps(previewUrl)}
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-600 sm:h-48 dark:bg-neutral-800 dark:text-slate-300">
            No cover image
          </div>
        )}
        {uploading || savingUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/40 backdrop-blur-sm">
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePick}
          disabled={uploading || savingUrl}
          className="inline-flex items-center gap-2 rounded-full glass-btn bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        >
          {uploading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <UploadCloud size={13} />
          )}
          {uploading
            ? "Uploading..."
            : effectiveCoverUrl
              ? "Replace cover"
              : "Upload cover"}
        </button>
        {effectiveCoverUrl ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing || uploading || savingUrl}
            className="inline-flex items-center gap-2 rounded-full glass-btn border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-neutral-950 dark:text-slate-200 dark:hover:bg-neutral-800"
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

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Link2
            size={14}
            className="shrink-0 text-slate-400 dark:text-slate-500"
            aria-hidden
          />

          <Input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="Or paste cover image URL (https://…)"
            disabled={uploading || savingUrl || removing}
            className="h-9 text-xs"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={uploading || savingUrl || removing}
          onClick={applyImageUrl}
          className="inline-flex shrink-0 gap-1.5 rounded-full text-xs font-semibold"
        >
          {savingUrl ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Use URL"
          )}
        </Button>
      </div>

      {error ? (
        <p className="mt-2 max-w-md rounded-lg glass-btn border border-rose-200/60 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold leading-relaxed text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
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
