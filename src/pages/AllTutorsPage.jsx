import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X
} from "lucide-react";

import { tutorsById } from "../data/tutors";
import { fetchTutorDirectoryFromSupabase } from "../lib/tutorDirectory";
import { isSupabaseConfigured } from "../lib/supabase";

/**
 * Subject filter chips. Order matters — these appear left-to-right in
 * the filter strip. We derive the canonical subject token from each
 * tutor's `subject` field (everything before " · ").
 */
const SUBJECT_FILTERS = [
  { id: "all", label: "All Subjects" },
  { id: "Mathematics", label: "Maths" },
  { id: "Science", label: "Science" },
  { id: "Biology", label: "Biology" },
  { id: "Physics", label: "Physics" },
  { id: "ICT", label: "ICT" },
  { id: "English", label: "English" },
  { id: "History", label: "History" },
  { id: "Art", label: "Art" },
  { id: "Business", label: "Business" },
  { id: "Top-Rated", label: "Top-Rated" }
];

const PRICE_FILTERS = [
  { id: "any", label: "Any price" },
  { id: "lt3000", label: "Under LKR 3 000", max: 3000 },
  { id: "3000-4500", label: "LKR 3 000 – 4 500", min: 3000, max: 4500 },
  { id: "gt4500", label: "Over LKR 4 500", min: 4500 }
];

const RATING_FILTERS = [
  { id: "any", label: "Any rating", min: 0 },
  { id: "4.5+", label: "4.5+", min: 4.5 },
  { id: "4.8+", label: "4.8+", min: 4.8 },
  { id: "5", label: "5.0", min: 5 }
];

const SORT_OPTIONS = [
  { id: "rating", label: "Highest rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name (A → Z)" }
];

// Default rates filled in when a tutor record doesn't list `hourlyRate`.
const FALLBACK_RATE = 3500;

export default function AllTutorsPage() {
  const [remoteTutors, setRemoteTutors] = useState([]);
  const [searchParams] = useSearchParams();
  const levelFromUrl = (searchParams.get("level") ?? "").trim().toLowerCase();

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let cancelled = false;
    fetchTutorDirectoryFromSupabase().then((rows) => {
      if (!cancelled) setRemoteTutors(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const allTutors = useMemo(() => {
    const demo = Object.values(tutorsById).map((t) => ({
      ...t,
      hourlyRate: t.hourlyRate ?? FALLBACK_RATE,
      reviewsCount: t.reviewsCount ?? 124,
      source: "demo"
    }));
    return [...remoteTutors, ...demo];
  }, [remoteTutors]);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [subject, setSubject] = useState("all");
  const [price, setPrice] = useState("any");
  const [rating, setRating] = useState("any");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const priceRange = PRICE_FILTERS.find((p) => p.id === price);
    const minRating =
      RATING_FILTERS.find((r) => r.id === rating)?.min ?? 0;

    let next = allTutors.filter((t) => {
      if (levelFromUrl) {
        const levelTokens = [
          t.subject ?? "",
          ...(Array.isArray(t.subjectsTaught)
            ? t.subjectsTaught.flatMap((item) => item?.grades ?? [])
            : [])
        ]
          .join(" ")
          .toLowerCase();
        if (!levelTokens.includes(levelFromUrl)) {
          return false;
        }
      }

      if (subject !== "all") {
        const tutorSubject = (t.subject ?? "").split(/[·•-]/)[0].trim();
        if (!tutorSubject.toLowerCase().includes(subject.toLowerCase())) {
          return false;
        }
      }
      if (priceRange && price !== "any") {
        const rate = t.hourlyRate;
        if (rate == null) return false;
        if (priceRange.min != null && rate < priceRange.min) return false;
        if (priceRange.max != null && rate >= priceRange.max) return false;
      }
      if (minRating > 0) {
        const r = t.rating;
        if (r == null || r < minRating) return false;
      }
      if (q) {
        const haystack =
          `${t.name} ${t.subject} ${t.location} ${t.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    next = [...next].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.hourlyRate ?? Infinity) - (b.hourlyRate ?? Infinity);
        case "price-desc":
          return (b.hourlyRate ?? -Infinity) - (a.hourlyRate ?? -Infinity);
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
        default:
          return (b.rating ?? -1) - (a.rating ?? -1);
      }
    });

    return next;
  }, [allTutors, levelFromUrl, query, subject, price, rating, sortBy]);

  const activeFilterCount =
    (subject !== "all" ? 1 : 0) +
    (price !== "any" ? 1 : 0) +
    (rating !== "any" ? 1 : 0);

  const resetFilters = () => {
    setSubject("all");
    setPrice("any");
    setRating("any");
    setSortBy("rating");
    setQuery("");
  };

  return (
    <div className="min-h-[calc(100vh-72px)] animate-fade-in bg-[#f5f5f7] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Hero ------------------------------------------------------- */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-4xl text-center"
        >
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Tutor directory
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.07em] text-slate-950 md:text-7xl dark:text-white">
            Find your next tutor.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
            Search by name, subject, or city, then refine the list with simple filters that stay out of the way.
          </p>
        </motion.section>

        {/* Search bar ------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto max-w-3xl"
        >
          <div className="flex items-center gap-2 rounded-[1.75rem] bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
              <Search size={16} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tutors by name, subject, or city…"
              className="min-w-0 flex-1 bg-transparent px-2 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={14} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="relative inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 md:hidden"
            >
              <SlidersHorizontal size={13} /> Filters
              {activeFilterCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-700 px-1 text-[10px] font-bold text-white dark:bg-slate-300 dark:text-slate-950">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </motion.div>

        {/* Filter strip ---------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className={`mt-5 ${showFilters ? "" : "hidden md:block"}`}
        >
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/70 px-5 py-3 dark:border-white/10 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Refine results
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-2.5 py-1 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-white/10">
                  {activeFilterCount} active
                </span>
                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full px-2.5 py-1 text-slate-700 transition hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
              {/* Subject chips ------------------------------------- */}
              <FilterGroup label="Subject">
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_FILTERS.map((opt) => {
                    const active = subject === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSubject(opt.id)}
                        className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                          active
                            ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </FilterGroup>

              {/* Price + rating + sort selects --------------------- */}
              <FilterGroup label="Price">
                <Pills options={PRICE_FILTERS} value={price} onChange={setPrice} />
              </FilterGroup>

              <FilterGroup label="Rating">
                <Pills options={RATING_FILTERS} value={rating} onChange={setRating} />
              </FilterGroup>

              <FilterGroup label="Sort">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-h-9 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-400 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </FilterGroup>
            </div>
          </div>
        </motion.div>

        {/* Results count --------------------------------------------- */}
        <div className="mt-8 mb-4 flex items-center justify-between gap-3 px-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span className="text-slate-900 dark:text-white">
              {filtered.length}
            </span>{" "}
            tutor{filtered.length === 1 ? "" : "s"} match
            {filtered.length === 1 ? "es" : ""} your filters
          </p>
        </div>

        {/* Grid ------------------------------------------------------ */}
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filtered.map((tutor, index) => (
                <TutorCard key={tutor.id} tutor={tutor} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}

function Pills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
              active
                ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function TutorCard({ tutor, index }) {
  const primarySubject = (tutor.subject ?? "").split(/[·•-]/)[0].trim();
  const subjectMeta = (tutor.subject ?? "").split(/[·•-]/).slice(1).join(" · ").trim();
  const city = (tutor.location ?? "").split(",")[0];
  const hasVerifiedBlueMark = Boolean(tutor.verifiedBlueMark || Number(tutor.verifiedMarks) > 0);
  const reviewsLabel =
    tutor.reviewsCount != null ? `${tutor.reviewsCount} reviews` : "New tutor";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.28) }}
    >
      <Link
        to={tutor.profileUrl ?? `/tutor/${tutor.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.1)] dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="inline-flex max-w-[65%] items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {primarySubject || "General"}
          </span>
          {tutor.isProfileBoosted ? (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-base font-semibold text-white dark:bg-white dark:text-slate-950">
            {tutor.avatar_url ? (
              <img
                src={tutor.avatar_url}
                alt={`${tutor.name} avatar`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              tutor.initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex max-w-full items-center gap-1 truncate text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
              {tutor.name}
              {hasVerifiedBlueMark ? (
                <BadgeCheck className="size-4 shrink-0 text-blue-600" />
              ) : null}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {hasVerifiedBlueMark ? (
                <p className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <BadgeCheck size={10} />
                  Verified
                </p>
              ) : null}
            </div>
            <p className="mt-1 inline-flex items-center gap-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
              <GraduationCap size={11} />
              {subjectMeta || primarySubject}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {tutor.description ?? ""}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
          <span className="inline-flex items-center justify-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Star size={11} fill="currentColor" />
            {tutor.rating != null ? tutor.rating.toFixed(1) : "—"}
          </span>
          <span className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {reviewsLabel}
          </span>
          {city ? (
            <span className="col-span-2 inline-flex items-center justify-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <MapPin size={11} />
              {city}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <div className="mb-4 border-t border-slate-100 dark:border-white/10" />
          <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-950 dark:text-white">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              from
            </span>{" "}
            {tutor.hourlyRate != null ? (
              <>
                LKR {tutor.hourlyRate.toLocaleString()}
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  /hr
                </span>
              </>
            ) : (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Rate on profile
              </span>
            )}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-white transition group-hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:group-hover:bg-slate-200">
            View profile <ArrowRight size={11} />
          </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-slate-900">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
        <Search size={20} />
      </span>
      <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
        No tutors match those filters
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Try widening the price range, lowering the rating threshold, or
        switching to a different subject.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Reset filters
      </button>
    </div>
  );
}
