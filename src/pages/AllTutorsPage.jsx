import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";

import {
  TutorDirectoryFilterToolbar,
  TutorDirectoryFiltersSidebar,
} from "../components/tutors/TutorDirectoryFilters";
import { fetchTutorDirectoryFromSupabase } from "../lib/tutorDirectory";
import { isSupabaseConfigured } from "../lib/supabase";
import { supabaseStorageImageProps } from "../lib/storage";
import { cn } from "../lib/utils";

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
  { id: "Top-Rated", label: "Top-Rated" },
];

const PRICE_FILTERS = [
  { id: "any", label: "Any price" },
  { id: "lt3000", label: "Under LKR 3 000", max: 3000 },
  { id: "3000-4500", label: "LKR 3 000 – 4 500", min: 3000, max: 4500 },
  { id: "gt4500", label: "Over LKR 4 500", min: 4500 },
];

const RATING_FILTERS = [
  { id: "any", label: "Any rating", min: 0 },
  { id: "4.5+", label: "4.5+", min: 4.5 },
  { id: "4.8+", label: "4.8+", min: 4.8 },
  { id: "5", label: "5.0", min: 5 },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Highest rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name (A → Z)" },
];

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

  const allTutors = useMemo(() => remoteTutors, [remoteTutors]);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [subject, setSubject] = useState("all");
  const [price, setPrice] = useState("any");
  const [rating, setRating] = useState("any");
  const [sortBy, setSortBy] = useState("rating");
  const [filtersSidebarOpen, setFiltersSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const priceRange = PRICE_FILTERS.find((p) => p.id === price);
    const minRating = RATING_FILTERS.find((r) => r.id === rating)?.min ?? 0;

    let next = allTutors.filter((t) => {
      if (levelFromUrl) {
        const levelTokens = [
          t.subject ?? "",
          ...(Array.isArray(t.subjectsTaught)
            ? t.subjectsTaught.flatMap((item) => item?.grades ?? [])
            : []),
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

  const filterToolbarProps = {
    subject,
    setSubject,
    subjectOptions: SUBJECT_FILTERS,
    price,
    setPrice,
    priceOptions: PRICE_FILTERS,
    rating,
    setRating,
    ratingOptions: RATING_FILTERS,
    sortBy,
    setSortBy,
    sortOptions: SORT_OPTIONS,
    activeFilterCount,
    onResetFilters: resetFilters,
  };

  return (
    <div className="min-h-[calc(100vh-72px)] animate-fade-in bg-[#f5f5f7] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 max-w-4xl text-center md:mb-8"
        >
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Tutor directory
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.07em] text-slate-950 md:text-7xl dark:text-white">
            Find your next tutor.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
            Search by name, subject, or city, then refine the list with simple
            filters that stay out of the way.
          </p>
        </motion.section>

        {}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="w-full"
        >
          <div className="flex w-full items-center gap-2 rounded-[1.75rem] bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
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
            <TutorDirectoryFilterToolbar
              activeFilterCount={activeFilterCount}
              sidebarOpen={filtersSidebarOpen}
              onToggleSidebar={() => setFiltersSidebarOpen((open) => !open)}
            />
          </div>
        </motion.div>

        <div
          className={cn(
            "mt-6 grid w-full items-start gap-6 lg:gap-8",
            filtersSidebarOpen &&
              "divide-y divide-slate-200/90 dark:divide-white/10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:divide-x lg:divide-y-0",
          )}
        >
          {filtersSidebarOpen ? (
            <aside className="min-h-0 w-full max-w-full overflow-y-auto overscroll-contain py-1 pr-3 sm:pr-4 lg:max-h-none lg:overflow-visible lg:pr-5">
              <TutorDirectoryFiltersSidebar {...filterToolbarProps} />
            </aside>
          ) : null}

          <section
            className={cn("min-w-0 py-1", filtersSidebarOpen && "lg:pl-5")}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="text-slate-900 dark:text-white">
                  {filtered.length}
                </span>{" "}
                tutor{filtered.length === 1 ? "" : "s"} match
                {filtered.length === 1 ? "es" : ""} your filters
              </p>
            </div>

            {filtered.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <div className="grid w-full min-w-0 gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))]">
                {filtered.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function TutorCard({ tutor }) {
  const primarySubject = (tutor.subject ?? "").split(/[·•-]/)[0].trim();
  const subjectMeta = (tutor.subject ?? "")
    .split(/[·•-]/)
    .slice(1)
    .join(" · ")
    .trim();
  const city = (tutor.location ?? "").split(",")[0];
  const hasVerifiedBlueMark = Boolean(
    tutor.verifiedBlueMark || Number(tutor.verifiedMarks) > 0,
  );
  const reviewsLabel =
    tutor.reviewsCount != null ? `${tutor.reviewsCount} reviews` : "New tutor";

  return (
    <Link
      to={tutor.profileUrl ?? `/tutor/${tutor.id}`}
      className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm outline-none transition-[border-color,box-shadow] hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-950/20 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/20 dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-slate-950"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="inline-flex min-w-0 max-w-full items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
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
              {...supabaseStorageImageProps(tutor.avatar_url)}
            />
          ) : (
            tutor.initials
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-[-0.02em] text-slate-950 break-words [overflow-wrap:anywhere] dark:text-white">
              {tutor.name}
            </p>
            {hasVerifiedBlueMark ? (
              <BadgeCheck
                className="mt-0.5 size-4 shrink-0 text-blue-600"
                aria-hidden
              />
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {hasVerifiedBlueMark ? (
              <p className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                <BadgeCheck size={10} />
                Verified
              </p>
            ) : null}
          </div>
          <p className="flex items-start gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <GraduationCap className="mt-0.5 shrink-0" size={11} aria-hidden />
            <span className="min-w-0 break-words leading-snug">
              {subjectMeta || primarySubject}
            </span>
          </p>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {tutor.description ?? ""}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs font-semibold">
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

      <div className="mt-auto pt-5">
        <div className="mb-5 border-t border-slate-100 dark:border-white/10" />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              From
            </p>
            {tutor.hourlyRate != null ? (
              <p className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  LKR
                </span>
                <span className="text-lg font-bold tabular-nums leading-none text-slate-950 dark:text-white">
                  {tutor.hourlyRate.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  /hr
                </span>
              </p>
            ) : (
              <p className="mt-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                Rate on profile
              </p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-slate-950 px-3 py-2 text-[11px] font-semibold leading-none text-white dark:bg-white dark:text-slate-950">
            View profile
            <ArrowRight className="size-3 shrink-0" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
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
