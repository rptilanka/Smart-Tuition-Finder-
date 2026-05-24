import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MessageSquare, Quote, Star, TrendingUp, Users } from "lucide-react";
import ShaderBackground from "../components/ShaderBackground";

const DEMO_REVIEWS = [
  { id: "d1",  rating: 5, body: "Mr. Perera explained every concept so clearly. My daughter went from failing maths to getting an A in her term exam. Absolutely worth it!",                        reviewerName: "Sanduni Jayawardena", avatar: "https://randomuser.me/api/portraits/women/44.jpg", createdAt: "2024-11-10", tutorId: null, tutorName: "Mr. Perera",         tutorSubject: "Mathematics"    },
  { id: "d2",  rating: 5, body: "I was struggling with A/L Chemistry for months. After just 4 sessions, I finally understood organic reactions. Best tutor on the platform.",                       reviewerName: "Ravindu Senanayake", avatar: "https://randomuser.me/api/portraits/men/43.jpg",   createdAt: "2024-12-02", tutorId: null, tutorName: "Ms. Fernando",      tutorSubject: "Chemistry"      },
  { id: "d3",  rating: 4, body: "Very patient and knows the subject well. My son improved a lot in English literature. Would have given 5 stars but sessions started a bit late sometimes.",        reviewerName: "Amara Osei",         avatar: "https://randomuser.me/api/portraits/women/39.jpg", createdAt: "2025-01-15", tutorId: null, tutorName: "Mr. Wickramasinghe", tutorSubject: "English"        },
  { id: "d4",  rating: 5, body: "Found this tutor through Smart Tuition Finder and it was the best decision. Physics made simple and fun. My confidence is completely different now.",               reviewerName: "Kasun Rathnayake",   avatar: "https://randomuser.me/api/portraits/men/54.jpg",   createdAt: "2025-01-28", tutorId: null, tutorName: "Ms. Dissanayake",  tutorSubject: "Physics"        },
  { id: "d5",  rating: 5, body: "Excellent teacher. She prepares proper notes for every class and follows the syllabus perfectly. My results improved from C to A within two terms.",                reviewerName: "Nethmi Gunasekara",  avatar: "https://randomuser.me/api/portraits/women/48.jpg", createdAt: "2025-02-05", tutorId: null, tutorName: "Ms. Karunaratne",  tutorSubject: "Biology"        },
  { id: "d6",  rating: 4, body: "Good tutor overall. Explains things step by step which really helped me with combined maths. Communication is quick and he adjusts the pace nicely.",              reviewerName: "Kwame Mensah",       avatar: "https://randomuser.me/api/portraits/men/9.jpg",    createdAt: "2025-02-18", tutorId: null, tutorName: "Mr. Alwis",         tutorSubject: "Combined Maths" },
  { id: "d7",  rating: 5, body: "My son was completely lost in ICT but after 6 weeks with this tutor he's now confident in every topic. Super clear explanations and very friendly.",               reviewerName: "Chamari Fonseka",    avatar: "https://randomuser.me/api/portraits/women/65.jpg", createdAt: "2025-03-01", tutorId: null, tutorName: "Mr. Samarasinghe", tutorSubject: "ICT"            },
  { id: "d8",  rating: 5, body: "I searched for weeks for a good Sinhala tutor for my daughter. Found the perfect match here in minutes. The platform is easy to use and the tutor is wonderful.", reviewerName: "Aisha Diallo",       avatar: "https://randomuser.me/api/portraits/women/90.jpg", createdAt: "2025-03-10", tutorId: null, tutorName: "Ms. Wijesinghe",  tutorSubject: "Sinhala"        },
  { id: "d9",  rating: 3, body: "Decent tutor and knows the subject. Lessons could be more structured but helped me pass my exam so I'm satisfied overall.",                                        reviewerName: "Dinesh Kumar",       avatar: "https://randomuser.me/api/portraits/men/68.jpg",   createdAt: "2025-03-20", tutorId: null, tutorName: "Mr. Rajapaksa",    tutorSubject: "Economics"      },
  { id: "d10", rating: 5, body: "Absolutely brilliant. My daughter improved her grades in three subjects. The tutor is incredibly dedicated and always available for extra questions.",               reviewerName: "Zara Owusu",         avatar: "https://randomuser.me/api/portraits/women/71.jpg", createdAt: "2025-04-02", tutorId: null, tutorName: "Ms. Abeywickrama", tutorSubject: "Science"        },
  { id: "d11", rating: 5, body: "Clear, structured, and patient. I struggled with accounting ratios for my O/L exam and within a month I could solve any problem. Highly recommended!",            reviewerName: "Sahan Liyanage",     avatar: "https://randomuser.me/api/portraits/men/32.jpg",   createdAt: "2025-04-14", tutorId: null, tutorName: "Mr. Jayasuriya",  tutorSubject: "Accounting"     },
  { id: "d12", rating: 4, body: "Good experience overall. My son's history marks improved significantly. The tutor connects historical events in a way that makes them easy to remember.",           reviewerName: "Kofi Asante",        avatar: "https://randomuser.me/api/portraits/men/83.jpg",   createdAt: "2025-04-25", tutorId: null, tutorName: "Ms. Pathirana",    tutorSubject: "History"        },
];

const ACCENTS = [
  "linear-gradient(135deg,#14b8a6,#0ea5e9)",
  "linear-gradient(135deg,#22c55e,#14b8a6)",
  "linear-gradient(135deg,#f97316,#f43f5e)",
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#d97706,#b45309)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
];

function accentFor(str) {
  if (!str) return ACCENTS[0];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return ACCENTS[Math.abs(h) % ACCENTS.length];
}

function initials(name) {
  if (!name) return "?";
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">{stars}</span>
      <Star size={12} className="shrink-0 text-amber-400" fill="currentColor" />
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span className="w-8 text-right text-xs font-medium text-slate-400 dark:text-slate-500">{count}</span>
    </div>
  );
}

function ReviewCard({ review, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className="glass-card group flex flex-col rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1"
    >
      {/* Quote icon */}
      <Quote size={20} className="mb-4 shrink-0 text-slate-300 dark:text-slate-600" />

      {/* Review body */}
      <p className="flex-1 text-base leading-7 text-slate-700 dark:text-slate-200">
        {review.body || "Great tutor!"}
      </p>

      {/* Stars + date */}
      <div className="mt-5 flex items-center justify-between">
        <StarRow rating={review.rating} />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-slate-100 dark:bg-white/10" />

      {/* Reviewer + tutor */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold text-white"
            style={{ background: accentFor(review.reviewerName) }}
          >
            {review.avatar
              ? <img src={review.avatar} alt={review.reviewerName} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              : initials(review.reviewerName)
            }
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {review.reviewerName}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Student</p>
          </div>
        </div>

        {review.tutorId && (
          <Link
            to={`/tutor/${review.tutorId}`}
            className="flex items-center gap-1.5 rounded-xl glass-btn px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {review.tutorName}
            <ArrowUpRight size={11} />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

function StatsSection({ reviews }) {
  const total = reviews.length;
  const avg =
    total > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
      : "—";

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const fiveStarPct = total > 0 ? Math.round((dist[0].count / total) * 100) : 0;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="grid gap-5 md:grid-cols-3">
        {/* Average */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="glass-card col-span-1 flex flex-col items-center justify-center rounded-[2.25rem] p-10 text-center"
        >
          <p className="text-7xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">
            {avg}
          </p>
          <StarRow rating={parseFloat(avg)} size={18} />
          <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            Average rating
          </p>
        </motion.div>

        {/* Rating bars */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.07 }}
          className="glass-card rounded-[2.25rem] p-8"
        >
          <p className="mb-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Rating breakdown
          </p>
          <div className="space-y-3">
            {dist.map((d) => (
              <RatingBar key={d.stars} stars={d.stars} count={d.count} total={total} />
            ))}
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="glass-card flex flex-col justify-between gap-4 rounded-[2.25rem] p-8"
        >
          {[
            { icon: MessageSquare, label: "Total reviews", value: total },
            { icon: TrendingUp, label: "5-star reviews", value: `${fiveStarPct}%` },
            { icon: Users, label: "Tutors reviewed", value: new Set(reviews.map((r) => r.tutorId)).size },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-white">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {value}
                </p>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const FILTERS = [0, 5, 4, 3, 2, 1];

export default function ReviewsPage() {
  const [filter, setFilter] = useState(0);

  const filtered = useMemo(
    () => (filter === 0 ? DEMO_REVIEWS : DEMO_REVIEWS.filter((r) => Math.round(r.rating) === filter)),
    [filter],
  );

  return (
    <div className="relative -mt-[5.5rem] overflow-hidden bg-[#f5f5f7] dark:bg-neutral-950">
      {/* Hero */}
      <section className="relative min-h-[520px] overflow-hidden md:min-h-[600px]">
        <ShaderBackground />
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#f5f5f7] to-transparent dark:from-neutral-950" />

        <div className="relative z-20 mx-auto max-w-4xl px-6 pb-28 pt-[9rem] text-center md:pb-36 md:pt-[12rem]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
          

            <h1 className="mt-7 text-6xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-7xl md:text-8xl">
              Real stories.
              <br className="hidden sm:block" />
              Real results.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-xl font-medium leading-8 tracking-[-0.02em] text-slate-600 dark:text-slate-300">
              See what students and parents say about their tutors on Smart
              Tuition Finder.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection reviews={DEMO_REVIEWS} />

      {/* Filter tabs */}
      <section className="mx-auto mt-14 max-w-6xl px-6">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                  : "glass-btn text-slate-600 dark:text-slate-300"
              }`}
            >
              {f === 0 ? (
                "All reviews"
              ) : (
                <>
                  {f}
                  <Star size={12} className="text-amber-400" fill="currentColor" />
                  only
                </>
              )}
            </button>
          ))}
          {filtered.length > 0 && (
            <span className="ml-auto text-sm font-medium text-slate-400 dark:text-slate-500">
              {filtered.length} review{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* Review grid */}
      <section className="mx-auto mt-8 max-w-6xl px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-200 bg-white py-24 text-center dark:border-white/10 dark:bg-neutral-900">
            <Star size={32} className="text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No reviews yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Be the first — find a tutor and leave a review.
            </p>
            <Link
              to="/tutors"
              className="mt-2 inline-flex items-center gap-2 rounded-full glass-btn bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white"
            >
              Browse tutors <ArrowUpRight size={14} />
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  delay={(i % 3) * 0.06}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}
