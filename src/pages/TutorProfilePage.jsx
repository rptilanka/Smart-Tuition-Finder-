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
  Facebook,
  Instagram,
  MapPin,
  MessageSquareText,
  PlayCircle,
  Star,
  Twitter,
  Users,
} from "lucide-react";

import { getTutorProfile } from "../data/tutors";
import {
  demoVideoRowToCardShape,
  demoVideosFromDb,
  normalizeSocialHref,
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

function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
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

  const profileUrl =
    typeof window !== "undefined"
      ? new URL(`/tutor/${tutor.id}`, window.location.origin).href
      : "";
  const shareText = `Check out ${tutor.name} on Smart Tuition Finder`;
  const fallbackFacebookHref = profileUrl
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
    : "";
  const fallbackTwitterHref = profileUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`
    : "";
  const fallbackInstagramHref =
    import.meta.env.VITE_SOCIAL_INSTAGRAM_URL ?? "https://www.instagram.com/";
  const fallbackWhatsappHref = profileUrl
    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`
    : "";

  const fbCustom = normalizeSocialHref(tutor.social_facebook_url);
  const twCustom = normalizeSocialHref(tutor.social_twitter_url);
  const igCustom = normalizeSocialHref(tutor.social_instagram_url);
  const waCustom = normalizeSocialHref(tutor.social_whatsapp_url);

  const facebookHref =
    fbCustom || (isOwnProfile ? fallbackFacebookHref : "") || "";
  const twitterHref =
    twCustom || (isOwnProfile ? fallbackTwitterHref : "") || "";
  const instagramHref =
    igCustom || (isOwnProfile ? fallbackInstagramHref : "") || "";
  const whatsappHref =
    waCustom || (isOwnProfile ? fallbackWhatsappHref : "") || "";

  const showSocialRow =
    isOwnProfile ||
    Boolean(fbCustom || twCustom || igCustom || waCustom);

  const socialLinkBase =
    "inline-flex shrink-0 rounded-sm p-0.5 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

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
        <div className="relative px-6 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6 md:px-12 md:pb-12 md:pt-8 lg:pt-10">
          <div className="-mt-9 flex w-full flex-row items-start gap-4 sm:-mt-10 sm:gap-5 md:-mt-12 md:grid md:w-full md:grid-cols-[auto_1fr] md:items-start md:gap-x-10 lg:-mt-14 lg:gap-x-12">
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
              className="flex min-h-0 min-w-0 flex-1 flex-col pt-4 text-left sm:pt-5 md:min-h-[min(16rem,28vh)] md:pt-7 lg:min-h-[min(17rem,30vh)] lg:pt-9"
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

              {showSocialRow ? (
                <div className="mt-auto flex w-full flex-wrap items-end justify-end gap-5 pt-10 md:gap-6 md:pt-14 lg:pt-16">
                  {twitterHref ? (
                    <a
                      href={twitterHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${socialLinkBase} text-[#1D9BF0]`}
                      aria-label="X (Twitter)"
                    >
                      <Twitter className="size-7" strokeWidth={1.5} />
                    </a>
                  ) : null}
                  {instagramHref ? (
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${socialLinkBase} text-[#E4405F]`}
                      aria-label="Instagram"
                    >
                      <Instagram className="size-7" strokeWidth={1.5} />
                    </a>
                  ) : null}
                  {facebookHref ? (
                    <a
                      href={facebookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${socialLinkBase} text-[#1877F2]`}
                      aria-label="Facebook"
                    >
                      <Facebook className="size-7" strokeWidth={1.5} />
                    </a>
                  ) : null}
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${socialLinkBase} text-[#25D366]`}
                      aria-label="WhatsApp"
                    >
                      <WhatsAppIcon className="size-7" />
                    </a>
                  ) : null}
                </div>
              ) : null}
              {!isOwnProfile ? (
                <div className="mt-5 flex w-full flex-wrap gap-2 md:max-w-none">
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
                </div>
              ) : null}
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
