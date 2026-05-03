import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  PlayCircle,
  Settings,
  Star,
  Users,
} from "lucide-react";

import { getTutorProfile } from "../data/tutors";
import {
  demoVideoRowToCardShape,
  demoVideosFromDb,
  subjectsGradesFromDb,
} from "../lib/tutorProfileNormalize";
import { getTutorProfileByIdFromSupabase } from "../lib/tutorPublicProfile";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/tutor-profile/VideoCard";
import ReviewCard from "../components/tutor-profile/ReviewCard";
import BookingSidebar from "../components/tutor-profile/BookingSidebar";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function splitParagraphs(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/\n{2,}/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function extractWhatsappNumber(tutor) {
  const directFields = [
    tutor?.whatsapp_number,
    tutor?.whatsappNumber,
    tutor?.phone,
    tutor?.phone_number,
    tutor?.contact_number,
    tutor?.mobile,
  ];

  for (const value of directFields) {
    if (value == null) continue;
    const cleaned = String(value).replace(/\D/g, "");
    if (cleaned.length >= 9) return cleaned;
  }

  const text = String(tutor?.availability_booking ?? "");
  const found = text.match(/(?:\+?\d[\d\s-]{7,}\d)/);
  if (!found) return "";
  return found[0].replace(/\D/g, "");
}

function EmptySectionText({ text = "No details added yet." }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-300/80 bg-slate-100/60 px-3 py-2 text-sm text-slate-500 dark:border-slate-600/80 dark:bg-slate-800/40 dark:text-slate-300">
      {text}
    </p>
  );
}

function ProfileSection({ id, title, icon: Icon, actions, children }) {
  return (
    <motion.section
      id={id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="scroll-mt-24"
    >
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 md:p-7 dark:bg-slate-900 dark:ring-white/10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
              <Icon size={18} />
            </span>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-3xl">
              {title}
            </h2>
          </div>
          {actions}
        </div>
        <div>{children}</div>
      </div>
    </motion.section>
  );
}

function StarRow({ value, size = 14 }) {
  const rounded = Math.round((value ?? 0) * 2) / 2;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rounded);
        const half = !filled && i + 0.5 === rounded;
        return (
          <Star
            key={i}
            size={size}
            className={
              filled || half
                ? "text-slate-950 dark:text-white"
                : "text-slate-300 dark:text-slate-600"
            }
            fill={filled ? "currentColor" : "none"}
            strokeWidth={2}
          />
        );
      })}
    </div>
  );
}

function ProfileHero({ tutor, onBook, onContact, isOwnProfile }) {
  const hasVerifiedBlueMark = Boolean(
    tutor.verifiedBlueMark || Number(tutor.verifiedMarks) > 0,
  );
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10">
      <div className="overflow-hidden rounded-[2.75rem] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
        {}
        <div
          className="relative h-32 w-full overflow-hidden sm:h-36 md:h-40 lg:h-44"
          style={
            !tutor.coverImage && tutor.accent
              ? { background: tutor.accent }
              : undefined
          }
        >
          {tutor.coverImage ? (
            <img
              src={tutor.coverImage}
              alt={`${tutor.name} cover`}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div
              className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
              aria-hidden
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent dark:from-black/40"
            aria-hidden
          />
        </div>

        {}
        <div className="relative px-6 pb-8 pt-0 sm:px-8 sm:pb-10 md:px-12 md:pb-12">
          <div className="-mt-10 flex w-full flex-row items-start gap-4 sm:-mt-11 sm:gap-5 md:-mt-14 md:grid md:w-full md:grid-cols-[auto_1fr] md:items-start md:gap-x-10 lg:gap-x-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative z-10 shrink-0"
            >
              <div className="flex h-[7.25rem] w-[7.25rem] shrink-0 items-center justify-center overflow-hidden rounded-[2rem] bg-slate-950 text-3xl font-semibold text-white shadow-xl ring-4 ring-white md:h-36 md:w-36 md:text-5xl dark:bg-white dark:text-slate-950 dark:ring-slate-900">
                {tutor.avatar_url ? (
                  <img
                    src={tutor.avatar_url}
                    alt={`${tutor.name} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  tutor.initials
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="min-w-0 flex-1 text-left md:min-h-0 md:pt-1 lg:pt-2"
            >
              {tutor.subject ? (
                <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {tutor.subject}
                </p>
              ) : null}
              <p
                className={`flex flex-wrap items-center gap-2 text-3xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-4xl dark:text-white ${
                  tutor.subject ? "mt-2" : "mt-0"
                }`}
              >
                <span>{tutor.name}</span>
                {hasVerifiedBlueMark ? (
                  <CheckCircle2 className="size-5 shrink-0 text-blue-600" />
                ) : null}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {hasVerifiedBlueMark ? (
                  <p className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    <CheckCircle2 className="size-3.5" />
                    Verified
                  </p>
                ) : null}
                {tutor.isProfileBoosted ? (
                  <p className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Profile Boost
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <StarRow value={tutor.rating} size={14} />
                  <span className="text-slate-950 dark:text-white">
                    {tutor.rating?.toFixed(1)}
                  </span>
                  {Number.isFinite(tutor.reviewsCount) ? (
                    <span>({tutor.reviewsCount} reviews)</span>
                  ) : null}
                </span>
                {tutor.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} />
                    {tutor.location}
                  </span>
                ) : null}
                {Number.isFinite(tutor.yearsExperience) ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={14} />
                    {tutor.yearsExperience}+ years experience
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {tutor.subjectsTaught?.map((entry) => (
                  <span
                    key={entry.subject}
                    className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {entry.subject}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex w-full flex-wrap gap-2 md:max-w-none">
                {isOwnProfile ? (
                  <>
                    <Link
                      to="/tutor-profile/edit"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <Settings size={15} />
                      Edit profile
                    </Link>
                    <Link
                      to={`/tutor/${tutor.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    >
                      Open public URL
                    </Link>
                    <Link
                      to="/tutor-dashboard"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <motion.button
                      type="button"
                      onClick={onBook}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <CalendarDays size={15} />
                      Book Session
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={onContact}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    >
                      <MessageSquareText size={15} />
                      Contact Tutor
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Toast({ message }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-white/20 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.45)] backdrop-blur-md"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AvailabilityGrid({ availability, onBook }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {availability.map((entry) => {
          const hasSlots = entry.slots.length > 0;
          return (
            <div
              key={entry.day}
              className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {entry.day.slice(0, 3)}
              </p>
              <div className="mt-2 space-y-1">
                {hasSlots ? (
                  entry.slots.map((slot) => {
                    const key = `${entry.day}-${slot}`;
                    const isSelected = selected === key;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelected(key)}
                        className={`w-full rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                          isSelected
                            ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })
                ) : (
                  <span className="inline-flex rounded-lg bg-slate-200/50 px-2 py-1 text-[11px] font-semibold text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={() => onBook?.(selected)}
        disabled={!selected}
        whileHover={selected ? { y: -1 } : undefined}
        whileTap={selected ? { scale: 0.98 } : undefined}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 md:w-auto md:px-8"
      >
        <CalendarDays size={16} />
        {selected
          ? `Book Now · ${selected.replace("-", " · ")}`
          : "Select a slot to book"}
      </motion.button>
    </div>
  );
}

function TutorNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
        404 · Tutor not found
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        We couldn&rsquo;t find that tutor.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
        The tutor you&rsquo;re looking for may have moved or is no longer active
        on Smart Tuition Finder. Try browsing the featured tutors on the
        homepage.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
      >
        <ArrowLeft size={14} /> Back to homepage
      </Link>
    </div>
  );
}

export default function TutorProfilePage({ tutorId: tutorIdProp } = {}) {
  const { id: routeId } = useParams();
  const { profile: authProfile } = useAuth();
  const id = tutorIdProp ?? routeId;
  const staticTutor = id ? getTutorProfile(id) : null;
  const isOwnProfile = Boolean(
    authProfile?.id && id && String(authProfile.id) === String(id),
  );
  const [remoteTutor, setRemoteTutor] = useState(null);
  const [loadingRemoteTutor, setLoadingRemoteTutor] = useState(false);
  const [toast, setToast] = useState("");
  const tutor = staticTutor ?? remoteTutor;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setRemoteTutor(null);
      setLoadingRemoteTutor(false);
      return () => {
        mounted = false;
      };
    }
    if (staticTutor) {
      setRemoteTutor(null);
      setLoadingRemoteTutor(false);
      return () => {
        mounted = false;
      };
    }
    setLoadingRemoteTutor(true);
    getTutorProfileByIdFromSupabase(id)
      .then((row) => {
        if (!mounted) return;
        setRemoteTutor(row);
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingRemoteTutor(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, staticTutor]);

  if (!id) {
    return <TutorNotFound />;
  }

  if (loadingRemoteTutor && !tutor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading tutor profile...
        </p>
      </div>
    );
  }

  if (!tutor) {
    return <TutorNotFound />;
  }

  const bioParagraphs = splitParagraphs(tutor.bio);
  const qualificationsText =
    typeof tutor.qualifications_experience === "string"
      ? tutor.qualifications_experience.trim()
      : "";
  const subjectsTaught =
    subjectsGradesFromDb(tutor.subjects_grades).length > 0
      ? subjectsGradesFromDb(tutor.subjects_grades)
      : (tutor.subjectsTaught ?? []);
  const demoVideos =
    demoVideosFromDb(tutor.demo_videos).length > 0
      ? demoVideosFromDb(tutor.demo_videos)
          .map((v) => demoVideoRowToCardShape(v))
          .filter(Boolean)
      : (tutor.demoVideos ?? []);
  const availabilityText =
    typeof tutor.availability_booking === "string"
      ? tutor.availability_booking.trim()
      : "";
  const availabilityGrid = Array.isArray(tutor.availability)
    ? tutor.availability
    : [];

  const scrollToAvailability = () => {
    document
      .getElementById("availability")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBook = (slotLabel) => {
    setToast(
      slotLabel
        ? `Session booked for ${slotLabel.replace("-", " · ")} 🎉`
        : "Please select a slot below to continue.",
    );
    if (!slotLabel) scrollToAvailability();
  };

  const handleContact = () => {
    const whatsappNumber = extractWhatsappNumber(tutor);
    if (!whatsappNumber) {
      setToast("WhatsApp number is not available for this tutor.");
      return;
    }
    const intro = encodeURIComponent(
      `Hi ${tutor.name}, I found your profile on Smart Tuition Finder.`,
    );
    window.open(
      `https://wa.me/${whatsappNumber}?text=${intro}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-20 dark:bg-slate-950">
      <ProfileHero
        tutor={tutor}
        onBook={scrollToAvailability}
        onContact={handleContact}
        isOwnProfile={isOwnProfile}
      />

      <div className="mx-auto mt-8 max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <ProfileSection id="about" title="About the tutor" icon={Users}>
              {bioParagraphs.length > 0 ? (
                <div className="space-y-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                  {bioParagraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <EmptySectionText text="This tutor has not added an About section yet." />
              )}
            </ProfileSection>

            <ProfileSection
              id="qualifications"
              title="Qualifications & Experience"
              icon={Award}
            >
              {qualificationsText ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {qualificationsText}
                </div>
              ) : (
                <EmptySectionText text="No qualifications or experience details added yet." />
              )}
            </ProfileSection>

            <ProfileSection
              id="subjects"
              title="Subjects & Grades"
              icon={BookOpen}
            >
              {subjectsTaught.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {subjectsTaught.map((entry) => (
                    <div
                      key={entry.subject}
                      className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"
                    >
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {entry.subject || "Subject"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(entry.grades ?? []).map((g) => (
                          <span
                            key={g}
                            className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySectionText text="No subjects or grade levels added yet." />
              )}
            </ProfileSection>

            <ProfileSection
              id="videos"
              title="Demo videos"
              icon={PlayCircle}
              actions={
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {demoVideos.length} videos
                </span>
              }
            >
              {demoVideos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {demoVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <EmptySectionText text="No demo videos added yet." />
              )}
            </ProfileSection>

            <ProfileSection
              id="reviews"
              title="Student reviews"
              icon={Star}
              actions={
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <StarRow value={tutor.rating} />
                  <span>{tutor.rating?.toFixed(1)}</span>
                  {Number.isFinite(tutor.reviewsCount) ? (
                    <span className="text-slate-500 dark:text-slate-400">
                      · {tutor.reviewsCount} reviews
                    </span>
                  ) : null}
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {tutor.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection
              id="availability"
              title="Availability & Booking"
              icon={CalendarDays}
            >
              {availabilityText ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {availabilityText}
                </div>
              ) : availabilityGrid.length > 0 ? (
                <AvailabilityGrid
                  availability={availabilityGrid}
                  onBook={handleBook}
                />
              ) : (
                <EmptySectionText text="Availability details have not been added yet." />
              )}
            </ProfileSection>
          </div>

          <aside>
            <BookingSidebar
              tutor={tutor}
              onBook={scrollToAvailability}
              onContact={handleContact}
              isOwnProfile={isOwnProfile}
            />
          </aside>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
