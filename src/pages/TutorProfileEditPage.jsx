import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock3,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  Sparkles,
  Wallet,
  UserRound
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { updateTutorProfile } from "../lib/profile";
import {
  demoVideosFromDb,
  normalizeDemoVideos,
  subjectsGradesFromDb
} from "../lib/tutorProfileNormalize";
import AvatarUploader from "../components/tutor-profile/AvatarUploader";
import SaveStatusBadge from "../components/tutor-profile/SaveStatusBadge";
import TutorQualificationsEditor from "../components/tutor-profile/edit/TutorQualificationsEditor";
import TutorSubjectsGradesEditor from "../components/tutor-profile/edit/TutorSubjectsGradesEditor";
import TutorDemoVideosEditor from "../components/tutor-profile/edit/TutorDemoVideosEditor";
import TutorAvailabilityBookingEditor from "../components/tutor-profile/edit/TutorAvailabilityBookingEditor";

export default function TutorProfileEditPage() {
  const { user, profile, profileLoading, refreshProfile, isConfigured } =
    useAuth();

  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [qualificationsExperience, setQualificationsExperience] = useState(
    profile?.qualifications_experience ?? ""
  );
  const [availabilityBooking, setAvailabilityBooking] = useState(
    profile?.availability_booking ?? ""
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    profile?.whatsapp_number ?? ""
  );
  const [profileSubject, setProfileSubject] = useState(
    profile?.profile_subject ?? ""
  );
  const [profileLocation, setProfileLocation] = useState(
    profile?.profile_location ?? ""
  );
  const [yearsExperience, setYearsExperience] = useState(
    profile?.years_experience == null ? "" : String(profile.years_experience)
  );
  const [hourlyRate, setHourlyRate] = useState(
    profile?.hourly_rate == null ? "" : String(profile.hourly_rate)
  );
  const [reviewsCount, setReviewsCount] = useState(
    profile?.reviews_count == null ? "" : String(profile.reviews_count)
  );
  const [subjectsModel, setSubjectsModel] = useState(() =>
    subjectsGradesFromDb(profile?.subjects_grades)
  );
  const [demoVideoRows, setDemoVideoRows] = useState(() =>
    demoVideosFromDb(profile?.demo_videos)
  );

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const savedTimerRef = useRef(null);

  const profileResetKey = profile
    ? `${profile.id}-${profile.updated_at ?? ""}`
    : "";

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setBio(profile.bio ?? "");
      setQualificationsExperience(profile.qualifications_experience ?? "");
      setAvailabilityBooking(profile.availability_booking ?? "");
      setWhatsappNumber(profile.whatsapp_number ?? "");
      setProfileSubject(profile.profile_subject ?? "");
      setProfileLocation(profile.profile_location ?? "");
      setYearsExperience(
        profile.years_experience == null ? "" : String(profile.years_experience)
      );
      setHourlyRate(profile.hourly_rate == null ? "" : String(profile.hourly_rate));
      setReviewsCount(
        profile.reviews_count == null ? "" : String(profile.reviews_count)
      );
      setSubjectsModel(subjectsGradesFromDb(profile.subjects_grades));
      setDemoVideoRows(demoVideosFromDb(profile.demo_videos));
      return;
    }
    if (!user?.id) return;
    const fromAuth =
      (user.user_metadata?.name ?? "").trim() ||
      (user.email ?? "").split("@")[0] ||
      "";
    setName(fromAuth);
    setBio("");
    setQualificationsExperience("");
    setAvailabilityBooking("");
    setWhatsappNumber("");
    setProfileSubject("");
    setProfileLocation("");
    setYearsExperience("");
    setHourlyRate("");
    setReviewsCount("");
    setSubjectsModel([]);
    setDemoVideoRows([]);
  }, [profile, user?.id, user?.email, user?.user_metadata?.name]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const markDraftChanged = useCallback(() => {
    if (status !== "idle") setStatus("idle");
    if (errorMessage) setErrorMessage("");
  }, [status, errorMessage]);

  const runSave = useCallback(async () => {
    if (!user?.id) return;
    const patch = {
      name: name.trim(),
      bio,
      qualifications_experience: qualificationsExperience,
      subjects_grades: subjectsModel,
      demo_videos: normalizeDemoVideos(demoVideoRows),
      availability_booking: availabilityBooking,
      whatsapp_number: whatsappNumber,
      profile_subject: profileSubject,
      profile_location: profileLocation,
      years_experience: yearsExperience === "" ? null : Number(yearsExperience),
      hourly_rate: hourlyRate === "" ? null : Number(hourlyRate),
      reviews_count: reviewsCount === "" ? null : Number(reviewsCount)
    };

    setStatus("saving");
    setErrorMessage("");
    const { error } = await updateTutorProfile(user.id, patch, {
      email: user?.email ?? undefined,
      displayName: user?.user_metadata?.name ?? undefined
    });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message ?? "Couldn't save your profile.");
      return;
    }
    setStatus("saved");
    refreshProfile();
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setStatus("idle"), 1600);
  }, [
    user?.id,
    user?.email,
    user?.user_metadata?.name,
    name,
    bio,
    qualificationsExperience,
    subjectsModel,
    demoVideoRows,
    availabilityBooking,
    whatsappNumber,
    profileSubject,
    profileLocation,
    yearsExperience,
    hourlyRate,
    reviewsCount,
    refreshProfile
  ]);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    markDraftChanged();
  };

  const handleBioChange = (event) => {
    const value = event.target.value;
    setBio(value);
    markDraftChanged();
  };

  const handleQualificationsChange = (value) => {
    setQualificationsExperience(value);
    markDraftChanged();
  };

  const handleSubjectsModelChange = (model) => {
    setSubjectsModel(model);
    markDraftChanged();
  };

  const handleDemoVideosPayloadChange = (payload) => {
    setDemoVideoRows(payload);
    markDraftChanged();
  };

  const handleAvailabilityChange = (value) => {
    setAvailabilityBooking(value);
    markDraftChanged();
  };
  const handleSubjectChange = (event) => {
    const value = event.target.value;
    setProfileSubject(value);
    markDraftChanged();
  };
  const handleWhatsappNumberChange = (event) => {
    const value = event.target.value;
    setWhatsappNumber(value);
    markDraftChanged();
  };
  const handleLocationChange = (event) => {
    const value = event.target.value;
    setProfileLocation(value);
    markDraftChanged();
  };
  const handleYearsChange = (event) => {
    const value = event.target.value;
    setYearsExperience(value);
    markDraftChanged();
  };
  const handleRateChange = (event) => {
    const value = event.target.value;
    setHourlyRate(value);
    markDraftChanged();
  };
  const handleReviewsChange = (event) => {
    const value = event.target.value;
    setReviewsCount(value);
    markDraftChanged();
  };

  const handleAvatarUpdated = () => {
    refreshProfile();
  };

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50/80 p-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <h1 className="text-lg font-bold">Supabase isn't configured</h1>
          <p className="mt-2 text-sm">
            Add your Supabase URL and key to <code>.env.local</code> and
            restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (user?.user_metadata?.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }

  const disabled = profileLoading && !profile;
  const saveDisabled = disabled || status === "saving";

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <Link
          to="/tutor-dashboard"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200/70 transition hover:text-slate-950 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white"
        >
          <ArrowLeft size={12} /> Back to dashboard
        </Link>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2.5rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
      >
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Your tutor profile
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-5xl dark:text-white">
            Make your profile shine
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Complete each section below, then click Save to update your Supabase
            tutor profile.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
      >
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
              <Sparkles size={16} />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
                Profile basics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Photo, display name, and email.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SaveStatusBadge status={status} errorMessage={errorMessage} />
            <button
              type="button"
              onClick={runSave}
              disabled={saveDisabled}
              className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {status === "saving" ? "Saving..." : "Save"}
            </button>
          </div>
        </header>

        {profileLoading && !profile ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading your profile…
          </p>
        ) : (
          <div className="space-y-6">
            <AvatarUploader
              userId={user?.id}
              name={name || profile?.name}
              avatarUrl={profile?.avatar_url ?? null}
              onUpdated={handleAvatarUpdated}
              fallbackEmail={user?.email ?? ""}
              fallbackDisplayName={
                (user?.user_metadata?.name ?? "").trim() || name || ""
              }
            />

            <div className="rounded-[2rem] bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Public preview
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white dark:bg-white dark:text-slate-950">
                  {initialsFor(name || user?.email)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                    {name || "Tutor name"}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                    {profileSubject || "Subject title"} {profileLocation ? `· ${profileLocation}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PreviewStat label="Experience" value={yearsExperience ? `${yearsExperience}+ yrs` : "Not set"} />
                <PreviewStat label="Rate" value={hourlyRate ? `LKR ${Number(hourlyRate).toLocaleString()}` : "Not set"} />
                <PreviewStat label="Reviews" value={reviewsCount || "Not set"} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Display name" icon={UserRound}>
                <input
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Priya Wickramasinghe"
                  maxLength={80}
                  className={inputClass}
                />
              </Field>

              <Field label="Email" icon={Mail}>
                <input
                  value={user?.email ?? ""}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-slate-100/60 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400`}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Public subject/title" icon={Landmark}>
                <input
                  value={profileSubject}
                  onChange={handleSubjectChange}
                  placeholder="e.g. Mathematics · A/L"
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
              <Field label="Public location" icon={MapPin}>
                <input
                  value={profileLocation}
                  onChange={handleLocationChange}
                  placeholder="e.g. Colombo, Sri Lanka"
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
              <Field label="WhatsApp number" icon={Phone}>
                <input
                  value={whatsappNumber}
                  onChange={handleWhatsappNumberChange}
                  placeholder="e.g. +94771234567"
                  maxLength={32}
                  className={inputClass}
                />
              </Field>
              <Field label="Years experience" icon={Clock3}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={yearsExperience}
                  onChange={handleYearsChange}
                  placeholder="e.g. 8"
                  className={inputClass}
                />
              </Field>
              <Field label="Hourly rate (LKR)" icon={Wallet}>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={hourlyRate}
                  onChange={handleRateChange}
                  placeholder="e.g. 4500"
                  className={inputClass}
                />
              </Field>
              <Field label="Reviews count" icon={Star}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={reviewsCount}
                  onChange={handleReviewsChange}
                  placeholder="e.g. 24"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mt-6 space-y-6"
      >
        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
          <header className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
              <ShieldCheck size={16} />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
                About the tutor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Introduce yourself, your teaching style, and what students can expect.
              </p>
            </div>
          </header>
          <label className="block">
            <span className="sr-only">About you</span>
            <textarea
              value={bio}
              onChange={handleBioChange}
              disabled={disabled}
              rows={6}
              maxLength={2000}
              placeholder="Tell students about your teaching style, experience and what makes your sessions effective."
              className={`${inputClass} resize-y leading-relaxed`}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              {bio.length}/2000 characters
            </p>
          </label>
        </section>

        <TutorQualificationsEditor
          value={qualificationsExperience}
          onChange={handleQualificationsChange}
          disabled={disabled}
        />

        <TutorSubjectsGradesEditor
          rowsModel={subjectsModel}
          resetKey={profileResetKey}
          onModelChange={handleSubjectsModelChange}
          disabled={disabled}
        />

        <TutorDemoVideosEditor
          rowsModel={demoVideoRows}
          resetKey={profileResetKey}
          onPayloadChange={handleDemoVideosPayloadChange}
          disabled={disabled}
          userId={user?.id}
        />

        <TutorAvailabilityBookingEditor
          value={availabilityBooking}
          onChange={handleAvailabilityChange}
          disabled={disabled}
        />
      </motion.div>
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

function PreviewStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-white/10";

function initialsFor(value) {
  if (!value) return "T";
  return (
    value
      .split(/[ @._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "T"
  );
}
