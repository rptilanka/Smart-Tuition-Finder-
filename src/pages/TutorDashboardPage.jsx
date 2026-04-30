import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Crown,
  LogOut,
  Mail,
  MessageSquareText,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Users
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

// Mock session + activity data so the dashboard feels alive right after
// sign-up. Replace with Supabase queries once you build out sessions.
const upcomingSessions = [
  {
    id: "s1",
    student: "Kavisha Fernando",
    subject: "Mathematics · A/L",
    when: "Tomorrow · 4:00 PM",
    duration: "60 min",
    mode: "Online"
  },
  {
    id: "s2",
    student: "Akila Perera",
    subject: "Physics · A/L",
    when: "Sat · 10:30 AM",
    duration: "90 min",
    mode: "In-person · Colombo"
  },
  {
    id: "s3",
    student: "Nethmi Wijesinghe",
    subject: "Chemistry · O/L",
    when: "Sun · 5:00 PM",
    duration: "60 min",
    mode: "Online"
  }
];

const activity = [
  { id: "a1", label: "New booking request from Dinuka Silva", time: "12m ago" },
  { id: "a2", label: "Review posted by Kavisha Fernando (★ 5)", time: "2h ago" },
  { id: "a3", label: "Profile viewed 14 times today", time: "today" }
];

export default function TutorDashboardPage() {
  const navigate = useNavigate();
  const { user, profile, profileLoading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = useMemo(() => {
    if (profile?.name) return profile.name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Tutor";
  }, [profile?.name, user]);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T";
  }, [displayName]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    setSigningOut(false);
    if (!error) navigate("/tutor-login", { replace: true });
  };

  if (user?.user_metadata?.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
      {/* Welcome hero ------------------------------------------------- */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-[2.5rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-lg font-semibold text-white dark:bg-white dark:text-slate-950">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${displayName} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Tutor dashboard
              </p>
              <h1 className="mt-1 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-5xl dark:text-white">
                Welcome back, {firstName(displayName)}
                {profileLoading ? "…" : " 👋"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Here&apos;s what&apos;s happening across your sessions today.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/tutor-profile"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Settings size={14} /> Edit profile
            </Link>
            <Link
              to="/tutor-pro"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-950 to-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 dark:from-white dark:to-slate-200 dark:text-slate-950"
            >
              <Crown size={14} /> Pro plan
            </Link>
            <Link
              to="/tutor/featured"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <UserRound size={14} /> View public profile
            </Link>
            <motion.button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              whileHover={!signingOut ? { y: -1 } : undefined}
              whileTap={!signingOut ? { scale: 0.97 } : undefined}
              className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <LogOut size={14} />
              {signingOut ? "Signing out..." : "Sign out"}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Stats row --------------------------------------------------- */}
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={Users}
          iconClass=""
          label="Active students"
          value="24"
          delta="+3 this week"
        />
        <StatCard
          icon={CalendarDays}
          iconClass=""
          label="Sessions this week"
          value="12"
          delta="8 online · 4 in-person"
        />
        <StatCard
          icon={Star}
          iconClass=""
          label="Average rating"
          value="4.9"
          delta="218 reviews"
        />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Pro growth
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
              Boost your tutor profile and get more qualified leads
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Unlock profile boost, priority badge, analytics, and booking automation.
            </p>
          </div>
          <Link
            to="/tutor-pro"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Crown size={14} /> View Pro plan
          </Link>
        </div>
      </motion.section>

      {/* Main grid --------------------------------------------------- */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
        >
          <header className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
                <CalendarDays size={16} />
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
                Upcoming sessions
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              Manage schedule
            </button>
          </header>

          <ul className="divide-y divide-slate-200/60 dark:divide-white/10">
            {upcomingSessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                    {initialsFor(s.student)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.student}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {s.subject}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {s.when}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {s.duration} · {s.mode}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        <aside className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
          >
            <header className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
                <Sparkles size={14} />
              </span>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-100">
                Profile at a glance
              </h2>
            </header>

            <ProfileRow
              icon={UserRound}
              label="Name"
              value={displayName}
            />
            <ProfileRow
              icon={Mail}
              label="Email"
              value={profile?.email ?? user?.email ?? "—"}
            />
            <ProfileRow
              icon={BookOpen}
              label="Role"
              value="Verified tutor"
            />

            <AnimatePresence>
              {!profile && !profileLoading ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 rounded-lg bg-amber-50 p-2 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
                >
                  Profile row not found yet — run{" "}
                  <code>supabase/schema.sql</code> so the trigger can populate it.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
          >
            <header className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
                <TrendingUp size={14} />
              </span>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-100">
                Recent activity
              </h2>
            </header>
            <ul className="space-y-2">
              {activity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-2.5 text-xs dark:bg-slate-800"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {a.label}
                  </span>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {a.time}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
            >
              <MessageSquareText size={14} /> Message students
            </button>
          </motion.section>
        </aside>
      </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {delta}
      </p>
    </motion.article>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-xs">
      <span className="inline-flex items-center gap-2 font-semibold text-slate-500 dark:text-slate-400">
        <Icon size={12} />
        {label}
      </span>
      <span className="truncate text-right font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function firstName(name) {
  if (!name) return "there";
  return name.split(" ")[0];
}

function initialsFor(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
