import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

/**
 * Shared visual shell for the login + register pages.
 * Renders a clean Apple-like auth shell with a marketing side panel
 * and a form slot that pages fill with their own content.
 */
export default function AuthLayout({ title, subtitle, children, aside }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f5f5f7] px-6 py-12 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2.75rem] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10 md:grid-cols-[1.05fr_1fr]"
      >
        <aside className="hidden bg-[#fbfbfd] p-10 md:block dark:bg-slate-950">
          <div className="flex h-full flex-col">
            <div className="mt-auto">
              <img src="https://assets.lummi.ai/assets/Qma6gVoeYt2hGHzTKM2muQsQEw17L3Tz2pfr1bMg1jA1cU" alt="Smart Tuition Finder" className="w-full object-cover rounded-2xl mb-5" />
              {aside ?? (
                <>
                  <h3 className="max-w-sm text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 dark:text-white">
                    Teach what you love.
                    <br />
                    Grow your student base.
                  </h3>
                  <p className="mt-5 max-w-sm text-base leading-7 text-slate-500 dark:text-slate-400">
                    Join hundreds of Sri Lankan tutors already using Smart
                    Tuition Finder to fill their calendars and get discovered
                    by motivated students.
                  </p>

                  <ul className="mt-8 space-y-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {[
                      "Verified profile with demo videos",
                      "Smart matching with nearby students",
                      "Built-in session scheduling"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-white/10">
                          <CheckCircle2 size={13} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </aside>

        <div className="p-7 sm:p-8 md:p-10">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 dark:text-white md:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  );
}
