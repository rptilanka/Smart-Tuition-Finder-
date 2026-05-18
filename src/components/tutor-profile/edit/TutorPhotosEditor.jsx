import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Link2,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  getTutorPhotos,
  uploadTutorPhoto,
  addTutorPhotoByUrl,
  deleteTutorPhoto,
  validatePhotoFile,
  validatePhotoUrl,
} from "../../../lib/tutorPhotos";

/* ─── Lightbox ───────────────────────────────────────────────────────────── */
function Lightbox({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx((i) => (i + 1) % photos.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [photos.length]);

  const photo = photos[idx];
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg hover:bg-white"
        >
          <X size={14} />
        </button>
        <img
          src={photo.url}
          alt={photo.caption || `Photo ${idx + 1}`}
          className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
          referrerPolicy="no-referrer"
        />
        {photo.caption && (
          <p className="mt-3 text-sm font-medium text-white/90">{photo.caption}</p>
        )}
        {photos.length > 1 && (
          <div className="mt-4 flex items-center gap-4">
            <button type="button" onClick={prev}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition">
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-semibold text-white/70">
              {idx + 1} / {photos.length}
            </span>
            <button type="button" onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main editor ────────────────────────────────────────────────────────── */
export default function TutorPhotosEditor({ userId, disabled }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("upload"); // "upload" | "url"

  // upload state
  const [uploading, setUploading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const fileInputRef = useRef(null);

  // url state
  const [photoUrl, setPhotoUrl] = useState("");
  const [urlCaption, setUrlCaption] = useState("");
  const [addingUrl, setAddingUrl] = useState(false);

  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getTutorPhotos(userId)
      .then(setPhotos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  /* ── file upload ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const err = validatePhotoFile(file);
    if (err) { setError(err); return; }
    setError("");
    setUploading(true);
    try {
      const photo = await uploadTutorPhoto({ tutorId: userId, file, caption: uploadCaption });
      setPhotos((prev) => [photo, ...prev]);
      setUploadCaption("");
    } catch (ex) {
      setError(ex?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* ── url add ── */
  const handleAddUrl = async (e) => {
    e.preventDefault();
    const err = validatePhotoUrl(photoUrl);
    if (err) { setError(err); return; }
    setError("");
    setAddingUrl(true);
    try {
      const photo = await addTutorPhotoByUrl({ tutorId: userId, url: photoUrl, caption: urlCaption });
      setPhotos((prev) => [photo, ...prev]);
      setPhotoUrl("");
      setUrlCaption("");
    } catch (ex) {
      setError(ex?.message || "Could not add photo.");
    } finally {
      setAddingUrl(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async (photo) => {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    setDeletingId(photo.id);
    try {
      await deleteTutorPhoto({ tutorId: userId, id: photo.id, path: photo.path });
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (ex) {
      setError(ex?.message || "Could not delete photo.");
    } finally {
      setDeletingId(null);
    }
  };

  const busy = uploading || addingUrl;

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
      {/* Header */}
      <header className="mb-5 flex items-center gap-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
          <Camera size={16} />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
            Photos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add gallery photos — upload a file or paste a web URL.
          </p>
        </div>
      </header>

      {/* Mode toggle */}
      <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-1 dark:bg-neutral-800">
        <button
          type="button"
          onClick={() => { setMode("upload"); setError(""); }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
            mode === "upload"
              ? "bg-white text-slate-950 shadow-sm dark:bg-neutral-700 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <UploadCloud size={13} /> Upload file
        </button>
        <button
          type="button"
          onClick={() => { setMode("url"); setError(""); }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
            mode === "url"
              ? "bg-white text-slate-950 shadow-sm dark:bg-neutral-700 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Link2 size={13} /> From web URL
        </button>
      </div>

      {/* Upload panel */}
      {mode === "upload" && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-neutral-950/60 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="upload-caption" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Caption (optional)
            </label>
            <input
              id="upload-caption"
              type="text"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="e.g. Teaching session at home studio"
              maxLength={120}
              disabled={disabled || busy}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:opacity-60 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:ring-white/10"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || busy}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {uploading ? "Uploading…" : "Choose file"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* URL panel */}
      {mode === "url" && (
        <form onSubmit={handleAddUrl} className="mb-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-neutral-950/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label htmlFor="photo-url" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Image URL <span className="font-normal text-slate-400">(https://…)</span>
              </label>
              <input
                id="photo-url"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                disabled={disabled || busy}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:opacity-60 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:ring-white/10"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label htmlFor="url-caption" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Caption (optional)
              </label>
              <input
                id="url-caption"
                type="text"
                value={urlCaption}
                onChange={(e) => setUrlCaption(e.target.value)}
                placeholder="e.g. Whiteboard class notes"
                maxLength={120}
                disabled={disabled || busy}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:opacity-60 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:ring-white/10"
              />
            </div>
            <button
              type="submit"
              disabled={disabled || busy || !photoUrl.trim()}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              {addingUrl ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {addingUrl ? "Adding…" : "Add photo"}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            Paste any public image link — Google Photos share links, Unsplash, Imgur, etc.
          </p>
        </form>
      )}

      {/* Error */}
      {error && (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <Loader2 size={14} className="animate-spin" /> Loading photos…
        </div>
      ) : photos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300/80 bg-slate-100/60 px-3 py-2 text-sm text-slate-500 dark:border-slate-600/80 dark:bg-neutral-800/40 dark:text-slate-300">
          No photos yet. Upload a file or add a URL above.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo, i) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-neutral-800">
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${i + 1}`}
                className="h-full w-full cursor-pointer object-cover transition duration-200 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onClick={() => setLightboxIdx(i)}
              />
              {photo.caption && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6">
                  <p className="truncate text-[10px] font-medium text-white">{photo.caption}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleDelete(photo)}
                disabled={deletingId === photo.id}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600 disabled:cursor-not-allowed"
              >
                {deletingId === photo.id
                  ? <Loader2 size={12} className="animate-spin" />
                  : <Trash2 size={12} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Photos are saved immediately · File upload: JPG, PNG, WEBP, GIF up to 8 MB
      </p>
    </section>
  );
}
