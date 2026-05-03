import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  const initials =
    review.initials ??
    review.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/55 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(15,23,42,0.2)]"
          style={{
            background:
              review.accent ?? "linear-gradient(135deg,#0ea5e9,#6366f1)",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {review.name}
            </p>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Stars rating={review.rating} />
              {review.date ? (
                <span className="ml-2 text-slate-400 dark:text-slate-500">
                  · {review.date}
                </span>
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {review.comment}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function Stars({ rating }) {
  if (typeof rating !== "number") return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={12}
            className={
              filled ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
            }
            fill={filled ? "currentColor" : "none"}
            strokeWidth={2}
          />
        );
      })}
    </div>
  );
}
