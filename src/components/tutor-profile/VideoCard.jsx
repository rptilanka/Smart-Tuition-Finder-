import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

/**
 * Reusable tutor demo video card.
 * - Shows a thumbnail with duration pill and play overlay.
 * - Hover effect: subtle scale + brighten + animated play button.
 * - Click opens an embedded YouTube iframe in a lightbox modal.
 */
export default function VideoCard({ video }) {
  const [open, setOpen] = useState(false);
  const embedUrl = toEmbedUrl(video.videoUrl);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="group relative block w-full overflow-hidden rounded-2xl border border-white/25 bg-white/55 text-left shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-teal-500/60 dark:border-white/10 dark:bg-slate-900/50"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05] group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />

          {video.duration ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
              {video.duration}
            </span>
          ) : null}

          <motion.span
            aria-hidden
            initial={false}
            animate={{}}
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.35)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
          >
            <Play size={22} fill="currentColor" />
          </motion.span>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-0 ring-teal-400/0 transition group-hover:ring-2 group-hover:ring-teal-400/60"
          />
        </div>

        <div className="p-4">
          <p className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">
            {video.title}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
            {video.description}
          </p>
        </div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close video"
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/80"
              >
                <X size={16} />
              </button>
              <div className="aspect-video w-full bg-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <video
                    src={video.videoUrl}
                    controls
                    autoPlay
                    className="h-full w-full"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-white">{video.title}</p>
                <p className="mt-1 text-xs text-slate-300">{video.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    return null;
  } catch {
    return null;
  }
}
