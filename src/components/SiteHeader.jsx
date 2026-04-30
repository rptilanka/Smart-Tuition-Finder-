import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Courses", href: "/#features" },
  { label: "Tutors", href: "/tutors", route: true },
  { label: "Reviews", href: "/#reviews" },
  { label: "Join", href: "/#join" }
];

/**
 * Modern course-platform style navigation header.
 *
 *  - Left:   logo + brand
 *  - Center: navigation pill (desktop only)
 *  - Right:  search + dark toggle + (Dashboard / Tutor Login) + Student Login
 *  - Mobile: slide-down glass drawer with everything
 *
 * When a tutor is signed in, the "Tutor Login" CTA is replaced with a
 * "Dashboard" link and a compact sign-out icon button.
 */
export default function SiteHeader({ isDark, onToggleDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  const handleSearch = () => {
    const el = document.getElementById("home");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const dashboardPath =
    user?.user_metadata?.role === "student"
      ? "/student-dashboard"
      : "/tutor-dashboard";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    setMobileOpen(false);
    navigate("/");
  };

  const initials =
    (profile?.name || user?.user_metadata?.name || user?.email || "T")
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "T";

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_8px_20px_rgba(124,58,237,0.45)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <GraduationCap size={20} />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              Smart Tuition Finder
            </p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-600/80 dark:text-purple-300/80 sm:block">
              Find · Learn · Grow
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/30 bg-white/55 px-1.5 py-1 text-[13px] font-semibold text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] backdrop-blur-md lg:flex dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-200">
          {navItems.map((item) =>
            item.route ? (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-full px-3 py-1.5 transition hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 transition hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300"
              >
                {item.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/55 text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:scale-105 hover:text-purple-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:text-purple-300 md:inline-flex"
          >
            <Search size={16} />
          </button>

          <button
            type="button"
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/55 text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:scale-105 hover:text-purple-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:text-purple-300 sm:inline-flex"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-1.5 md:flex">
              <motion.div
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-purple-500/70 bg-transparent px-4 py-2 text-[13px] font-semibold text-purple-600 transition-colors hover:border-purple-500 hover:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/15"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-[10px] font-extrabold text-white">
                    {initials}
                  </span>
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
              </motion.div>
              <motion.button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Sign out"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/55 text-slate-600 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
              >
                <LogOut size={14} />
              </motion.button>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="hidden md:inline-flex"
            >
              <Link
                to="/tutor-login"
                className="inline-flex items-center justify-center rounded-full border-2 border-purple-500/70 bg-transparent px-4 py-2 text-[13px] font-semibold text-purple-600 transition-colors hover:border-purple-500 hover:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/15"
              >
                Tutor Login
              </Link>
            </motion.div>
          )}

          <motion.div
            whileHover={{
              scale: 1.05,
              y: -1,
              boxShadow: "0 18px 34px rgba(168,85,247,0.45)"
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="hidden md:inline-flex"
          >
            <Link
              to="/students-login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(168,85,247,0.4)]"
            >
              Student Login
            </Link>
          </motion.div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/55 text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:scale-105 lg:hidden dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-slate-900/45 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              key="drawer"
              id="mobile-drawer"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="absolute inset-x-0 top-full z-40 border-b border-white/20 bg-white/85 backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-slate-950/85"
            >
              <div className="mx-auto max-w-6xl px-4 py-4">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      {item.route ? (
                        <Link
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-purple-500/10 hover:text-purple-600 dark:text-slate-200 dark:hover:text-purple-300"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-purple-500/10 hover:text-purple-600 dark:text-slate-200 dark:hover:text-purple-300"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
                  {isAuthenticated ? (
                    <Link
                      to={dashboardPath}
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-purple-500/70 px-4 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-500/10 dark:text-purple-300"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/tutor-login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border-2 border-purple-500/70 px-4 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-500/10 dark:text-purple-300"
                    >
                      Tutor Login
                    </Link>
                  )}
                  <Link
                    to="/students-login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(168,85,247,0.35)]"
                  >
                    Student Login
                  </Link>
                </div>

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-300/60 bg-rose-50/70 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 md:hidden"
                  >
                    <LogOut size={14} />
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                ) : null}

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/30 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Appearance
                  </span>
                  <button
                    type="button"
                    onClick={onToggleDark}
                    aria-label="Toggle dark mode"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/70 text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200"
                  >
                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
