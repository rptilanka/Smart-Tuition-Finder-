import { CalendarDays } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-white/10";

/** Maps to `tutor_accounts.availability_booking`. */
export default function TutorAvailabilityBookingEditor({
  value,
  onChange,
  disabled,
  maxLength = 4000
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
      <header className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
          <CalendarDays size={16} />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
            Availability & Booking
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Typical days and times, online vs in-person, and how students should book (WhatsApp,
            form, etc.).
          </p>
        </div>
      </header>
      <label className="block">
        <span className="sr-only">Availability and booking</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={8}
          maxLength={maxLength}
          placeholder="Example: Weekday evenings 5–8 PM, Saturday mornings. Online via Zoom or in-person in Colombo 7. To book, message me here or WhatsApp …"
          className={`${inputClass} resize-y leading-relaxed`}
        />
        <p className="mt-1 text-[11px] text-slate-400">
          {value.length}/{maxLength} characters
        </p>
      </label>
    </section>
  );
}
