import { useEffect, useRef, useState } from "react";
import { Loader2, PlayCircle, Plus, Trash2, UploadCloud } from "lucide-react";
import VideoCard from "../VideoCard";
import { demoVideoRowToCardShape } from "../../../lib/tutorProfileNormalize";
import { uploadDemoVideo } from "../../../lib/storage";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-white/10";

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function dbRowsToLocal(rows) {
  if (!rows?.length) {
    return [
      {
        id: newId(),
        title: "",
        description: "",
        video_url: "",
        source: "youtube",
      },
    ];
  }
  return rows.map((r) => ({
    id: r.id || newId(),
    title: r.title ?? "",
    description: r.description ?? "",
    video_url: r.video_url ?? r.videoUrl ?? "",
    source: r.source === "upload" ? "upload" : "youtube",
  }));
}

function localToPayload(local) {
  return local
    .map((r) => ({
      id: r.id,
      title: r.title.trim(),
      description: r.description.trim(),
      video_url: r.video_url.trim(),
      source: r.source === "upload" ? "upload" : "youtube",
    }))
    .filter((r) => r.title || r.video_url);
}

export default function TutorDemoVideosEditor({
  rowsModel,
  onPayloadChange,
  disabled,
  resetKey,
  userId,
}) {
  const [local, setLocal] = useState(() => dbRowsToLocal(rowsModel));
  const [error, setError] = useState("");
  const [uploadingRowId, setUploadingRowId] = useState("");
  const fileInputRef = useRef(null);
  const [pendingRowId, setPendingRowId] = useState("");

  useEffect(() => {
    setLocal(dbRowsToLocal(rowsModel));
  }, [resetKey]);

  const emit = (next) => {
    setError("");
    setLocal(next);
    onPayloadChange(localToPayload(next));
  };

  const patchRow = (id, field, value) => {
    emit(local.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    emit([
      ...local,
      {
        id: newId(),
        title: "",
        description: "",
        video_url: "",
        source: "youtube",
      },
    ]);
  };

  const removeRow = (id) => {
    const next = local.filter((r) => r.id !== id);
    emit(
      next.length
        ? next
        : [
            {
              id: newId(),
              title: "",
              description: "",
              video_url: "",
              source: "youtube",
            },
          ],
    );
  };

  const handlePickVideo = (rowId) => {
    setPendingRowId(rowId);
    fileInputRef.current?.click();
  };

  const handleVideoSelected = async (event) => {
    const rowId = pendingRowId;
    setPendingRowId("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !rowId) return;
    if (!userId) {
      setError("Please sign in again before uploading demo videos.");
      return;
    }

    setUploadingRowId(rowId);
    const { data, error: uploadError } = await uploadDemoVideo({
      userId,
      file,
    });
    setUploadingRowId("");

    if (uploadError) {
      setError(uploadError.message ?? "Demo video upload failed.");
      return;
    }

    emit(
      local.map((r) =>
        r.id === rowId
          ? { ...r, source: "upload", video_url: data.publicUrl }
          : r,
      ),
    );
  };

  const previewRows = localToPayload(local)
    .map((r) => demoVideoRowToCardShape(r))
    .filter(Boolean);

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
            <PlayCircle size={16} />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
              Demo videos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add a YouTube link or upload directly to the platform. Up to 8
              clips.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addRow}
          disabled={disabled || local.length >= 8}
          className="inline-flex items-center gap-1.5 rounded-full glass-btn bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        >
          <Plus size={14} /> Add video
        </button>
      </header>

      <ul className="space-y-3">
        {local.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800"
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={disabled || local.length < 2}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200/80 text-rose-600 transition hover:bg-rose-50 disabled:opacity-40 dark:border-rose-500/30 dark:text-rose-300"
                aria-label="Remove video"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Source
                <select
                  value={row.source === "upload" ? "upload" : "youtube"}
                  onChange={(e) => patchRow(row.id, "source", e.target.value)}
                  disabled={disabled || uploadingRowId === row.id}
                  className={`${inputClass} mt-1`}
                >
                  <option value="youtube">YouTube link</option>
                  <option value="upload">Upload video</option>
                </select>
              </label>
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Title
                <input
                  value={row.title}
                  onChange={(e) => patchRow(row.id, "title", e.target.value)}
                  disabled={disabled}
                  placeholder="Lesson preview title"
                  maxLength={140}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {row.source === "upload" ? "Uploaded file" : "Video URL"}
                {row.source === "upload" ? (
                  <div className="mt-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => handlePickVideo(row.id)}
                      disabled={disabled || uploadingRowId === row.id}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl glass-btn bg-neutral-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                    >
                      {uploadingRowId === row.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <UploadCloud size={13} />
                      )}
                      {uploadingRowId === row.id
                        ? "Uploading..."
                        : "Upload video file"}
                    </button>
                    <p className="truncate rounded-lg glass-btn bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600 dark:bg-neutral-900 dark:text-slate-300">
                      {row.video_url || "No file uploaded yet"}
                    </p>
                  </div>
                ) : (
                  <input
                    value={row.video_url}
                    onChange={(e) =>
                      patchRow(row.id, "video_url", e.target.value)
                    }
                    disabled={disabled}
                    placeholder="https://www.youtube.com/watch?v=…"
                    className={`${inputClass} mt-1 font-mono text-[13px]`}
                  />
                )}
              </label>
              <label className="md:col-span-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Short description (optional)
                <textarea
                  value={row.description}
                  onChange={(e) =>
                    patchRow(row.id, "description", e.target.value)
                  }
                  disabled={disabled}
                  rows={2}
                  maxLength={400}
                  className={`${inputClass} mt-1 resize-y leading-relaxed`}
                />
              </label>
            </div>
          </li>
        ))}
      </ul>

      {previewRows.length > 0 ? (
        <div className="mt-6 border-t border-slate-200/70 pt-5 dark:border-slate-600/60">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Preview (how students may see it)
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {previewRows.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-lg glass-btn border border-rose-200/70 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      ) : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
        className="hidden"
        onChange={handleVideoSelected}
      />
    </section>
  );
}
