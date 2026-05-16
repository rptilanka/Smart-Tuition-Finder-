import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { updateStudentProfile } from "../lib/studentProfile";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import SaveStatusBadge from "../components/tutor-profile/SaveStatusBadge";

const PROFILE_AUTOSAVE_DELAY = 700;

export default function StudentProfileEditPage() {
  const { user, profile, profileLoading, refreshProfile, isConfigured } =
    useAuth();

  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const savedTimerRef = useRef(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setBio(profile.bio ?? "");
  }, [profile?.id, profile?.updated_at]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const persist = useDebouncedCallback(async (patch) => {
    if (!user?.id) return;
    setStatus("saving");
    setErrorMessage("");
    const { error } = await updateStudentProfile(user.id, patch);
    if (error) {
      setStatus("error");
      setErrorMessage(error.message ?? "Couldn't save your profile.");
      return;
    }
    setStatus("saved");
    refreshProfile();
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setStatus("idle"), 1600);
  }, PROFILE_AUTOSAVE_DELAY);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    persist({ name: value.trim() });
  };

  const handleBioChange = (event) => {
    const value = event.target.value;
    setBio(value);
    persist({ bio: value });
  };

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50/80 p-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <h1 className="text-lg font-bold">Supabase isn't configured</h1>
          <p className="mt-2 text-sm">
            Add your Supabase URL and key to <code>.env.local</code> and restart
            the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (user?.user_metadata?.role !== "student") {
    return <Navigate to="/tutor-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <Link
            to="/student-dashboard"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200/70 transition hover:text-slate-950 dark:bg-neutral-900 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white"
          >
            <ArrowLeft size={12} /> Back to dashboard
          </Link>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[2.5rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10"
        >
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Your student profile
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-5xl dark:text-white">
              Keep your profile up to date
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your name and bio help tutors recognise you. Changes save
              automatically.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10"
        >
          <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
                  Profile basics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Name and a short bio tutors see when you contact them.
                </p>
              </div>
            </div>
            <SaveStatusBadge status={status} errorMessage={errorMessage} />
          </header>

          {profileLoading && !profile ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading your profile…
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
              <aside className="rounded-[2rem] bg-slate-50 p-5 dark:bg-neutral-950">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-neutral-950 text-2xl font-semibold text-white dark:bg-white dark:text-slate-950">
                  {initialsFor(name || user?.email)}
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                  {name || "Student"}
                </h3>
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {user?.email ?? "No email"}
                </p>
                <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {bio ||
                    "Add a short bio so tutors understand your learning goals before they reply."}
                </p>
              </aside>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Display name" icon={UserRound}>
                  <input
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Nethmi Wijesinghe"
                    maxLength={80}
                    className={inputClass}
                  />
                </Field>

                <Field label="Email" icon={Mail}>
                  <input
                    value={user?.email ?? ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-slate-100/60 text-slate-500 dark:bg-neutral-800/50 dark:text-slate-400`}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Bio" icon={ShieldCheck}>
                    <textarea
                      value={bio}
                      onChange={handleBioChange}
                      rows={7}
                      maxLength={600}
                      placeholder="A few lines about your level, goals, and what you're looking for in a tutor."
                      className={`${inputClass} resize-y leading-relaxed`}
                    />

                    <p className="mt-1 text-[11px] text-slate-400">
                      {bio.length}/600 characters
                    </p>
                  </Field>
                </div>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {Icon ? <Icon size={11} /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-white/10";

function initialsFor(value) {
  if (!value) return "S";
  return (
    value
      .split(/[ @._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S"
  );
}
