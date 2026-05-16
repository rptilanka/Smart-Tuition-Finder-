import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Share2,
  Star,
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
  } catch {}
}

export default function BookingSidebar({
  tutor,
  onBook,
  onContact,
  isOwnProfile,
}) {
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
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setJustCopied(true);
    } catch {}
  };

  const nextSlots = flattenNextSlots(tutor.availability, 3);
  const hasRate = Number.isFinite(tutor.hourlyRate);
  const hasReviews = Number.isFinite(tutor.reviewsCount);
  const hasYears = Number.isFinite(tutor.yearsExperience);

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {isOwnProfile ? "Your profile" : "Book a session"}
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
              {hasRate
                ? `LKR ${tutor.hourlyRate.toLocaleString()}`
                : "Rate not set"}
              <span className="ml-1 text-xs font-semibold text-muted-foreground">
                {hasRate ? "/ hour" : ""}
              </span>
            </p>
          </div>

          {!isOwnProfile ? (
            <motion.button
              type="button"
              onClick={toggleBookmark}
              whileTap={{ scale: 0.92 }}
              aria-pressed={isBookmarked}
              aria-label={
                isBookmarked
                  ? "Remove bookmark"
                  : "Save this tutor to bookmarks"
              }
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isBookmarked
                  ? "border-amber-400/60 bg-amber-400/15 text-amber-500"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-amber-500 dark:border-white/10 dark:bg-neutral-800 dark:text-slate-300 dark:hover:border-white/20"
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
            </motion.button>
          ) : null}
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-3 text-[12px] font-semibold text-muted-foreground">
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
          {isOwnProfile ? (
            <>
              <Link
                to="/tutor-profile/edit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <Settings size={16} />
                Edit profile
              </Link>
              <Link
                to="/tutor-dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200/90 active:scale-[0.99] dark:bg-neutral-800 dark:text-slate-50 dark:hover:bg-slate-700"
              >
                <LayoutDashboard size={16} className="text-slate-600 dark:text-slate-300" />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <motion.button
                type="button"
                onClick={onBook}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <CalendarDays size={16} />
                Book a session
              </motion.button>

              <motion.button
                type="button"
                onClick={onContact}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200/90 active:scale-[0.99] dark:bg-neutral-800 dark:text-slate-50 dark:hover:bg-slate-700"
              >
                <MessageSquareText
                  size={16}
                  className="text-slate-600 dark:text-slate-300"
                />
                Contact tutor
              </motion.button>
            </>
          )}

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={share}
              whileTap={{ scale: 0.97 }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary/12 px-4 py-2.5 text-sm font-semibold text-primary shadow-none transition hover:bg-primary/20 active:scale-[0.99] dark:bg-primary/20 dark:text-teal-50 dark:hover:bg-primary/30"
            >
              <Share2 size={15} className="opacity-90" />
              {justCopied ? "Link copied" : "Share profile"}
            </motion.button>
          </div>
        </div>

        {nextSlots.length ? (
          <div className="relative z-10 mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Next available
            </p>
            <ul className="mt-2 space-y-1.5">
              {nextSlots.map((slot) => (
                <li
                  key={`${slot.day}-${slot.time}`}
                  className="flex items-center justify-between text-xs font-semibold text-foreground"
                >
                  <span>{slot.day}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
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
