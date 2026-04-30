import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  MessageSquareText,
  Share2,
  Star
} from "lucide-react";

const STORAGE_KEY = "stf:bookmarks";

function loadBookmarks() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveBookmarks(set) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Sticky sidebar with:
 *  - Quick info (rate, rating, experience)
 *  - Next available slots (up to 3)
 *  - Book / Contact / Share buttons
 *  - Bookmark toggle persisted in localStorage
 */
export default function BookingSidebar({ tutor, onBook, onContact }) {
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks());
  const [justCopied, setJustCopied] = useState(false);

  const isBookmarked = bookmarks.has(tutor.id);

  useEffect(() => {
    if (!justCopied) return undefined;
    const t = setTimeout(() => setJustCopied(false), 1600);
    return () => clearTimeout(t);
  }, [justCopied]);

  const toggleBookmark = () => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(tutor.id)) next.delete(tutor.id);
      else next.add(tutor.id);
      saveBookmarks(next);
      return next;
    });
  };

  const share = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/tutor/${tutor.id}`
        : `/tutor/${tutor.id}`;
    const shareData = {
      title: `${tutor.name} · Smart Tuition Finder`,
      text: `Check out ${tutor.name} on Smart Tuition Finder`,
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setJustCopied(true);
    } catch {
      /* user dismissed share / clipboard unavailable */
    }
  };

  const nextSlots = flattenNextSlots(tutor.availability, 3);
  const hasRate = Number.isFinite(tutor.hourlyRate);
  const hasReviews = Number.isFinite(tutor.reviewsCount);
  const hasYears = Number.isFinite(tutor.yearsExperience);

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/60 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/55">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-14 h-40 w-40 rounded-full blur-3xl opacity-70"
          style={{
            background: tutor.accent ?? "linear-gradient(135deg,#14b8a6,#0ea5e9)"
          }}
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">
              Book a session
            </p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {hasRate ? `LKR ${tutor.hourlyRate.toLocaleString()}` : "Rate not set"}
              <span className="ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {hasRate ? "/ hour" : ""}
              </span>
            </p>
          </div>

          <motion.button
            type="button"
            onClick={toggleBookmark}
            whileTap={{ scale: 0.92 }}
            aria-pressed={isBookmarked}
            aria-label={
              isBookmarked ? "Remove bookmark" : "Save this tutor to bookmarks"
            }
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isBookmarked
                ? "border-amber-400/60 bg-amber-400/15 text-amber-500"
                : "border-white/30 bg-white/55 text-slate-600 hover:text-amber-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-300"
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </motion.button>
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-3 text-[12px] font-semibold text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 text-amber-500">
            <Star size={13} fill="currentColor" /> {tutor.rating?.toFixed(1)}
          </span>
          {hasReviews ? (
            <>
              <span>·</span>
              <span>{tutor.reviewsCount} reviews</span>
            </>
          ) : null}
          {hasYears ? (
            <>
              <span>·</span>
              <span>{tutor.yearsExperience}+ yrs</span>
            </>
          ) : null}
        </div>

        <div className="relative z-10 mt-5 space-y-2">
          <motion.button
            type="button"
            onClick={onBook}
            whileHover={{
              y: -1,
              boxShadow: "0 18px 36px rgba(13,148,136,0.45)"
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(13,148,136,0.35)]"
          >
            <CalendarDays size={16} />
            Book a session
          </motion.button>

          <motion.button
            type="button"
            onClick={onContact}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-teal-500/60 bg-transparent px-4 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/15"
          >
            <MessageSquareText size={16} />
            Contact tutor
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={share}
              whileTap={{ scale: 0.97 }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-200"
            >
              <Share2 size={13} />
              {justCopied ? "Link copied" : "Share profile"}
            </motion.button>
          </div>
        </div>

        {nextSlots.length ? (
          <div className="relative z-10 mt-5 border-t border-white/30 pt-4 dark:border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Next available
            </p>
            <ul className="mt-2 space-y-1.5">
              {nextSlots.map((slot) => (
                <li
                  key={`${slot.day}-${slot.time}`}
                  className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <span>{slot.day}</span>
                  <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-teal-600 dark:text-teal-300">
                    {slot.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function flattenNextSlots(availability, limit) {
  if (!Array.isArray(availability)) return [];
  const result = [];
  for (const entry of availability) {
    for (const time of entry.slots ?? []) {
      result.push({ day: entry.day, time });
      if (result.length >= limit) return result;
    }
  }
  return result;
}
