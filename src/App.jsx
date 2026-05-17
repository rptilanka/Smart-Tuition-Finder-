import { useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  BadgeCheck,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FlaskConical,
  GraduationCap,
  Languages,
  Landmark,
  MapPin,
  MessageSquareText,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import GeminiChatbot from "./components/GeminiChatbot";
import ShaderBackground from "./components/ShaderBackground";
import FAQ from "./components/faq.jsx";
import Footer from "./components/footer";
import Navbar from "./components/navbar.jsx";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import { useLanguage } from "./context/LanguageContext";
import TutorProfilePage from "./pages/TutorProfilePage";
import TutorLoginPage from "./pages/TutorLoginPage";
import TutorDashboardPage from "./pages/TutorDashboardPage";
import TutorLiveHostPage from "./pages/TutorLiveHostPage";
import TutorLiveMeetingPage from "./pages/TutorLiveMeetingPage";
import TutorOwnProfilePage from "./pages/TutorOwnProfilePage";
import TutorProfileEditPage from "./pages/TutorProfileEditPage";
import TutorProPlanPage from "./pages/TutorProPlanPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import StudentLiveJoinPage from "./pages/StudentLiveJoinPage";
import StudentProfileEditPage from "./pages/StudentProfileEditPage";
import JoinMeetingPage from "./pages/JoinMeetingPage";
import AllTutorsPage from "./pages/AllTutorsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import { useAuth } from "./context/AuthContext";
import { fetchTutorDirectoryFromSupabase } from "./lib/tutorDirectory";
import { isSupabaseConfigured } from "./lib/supabase";
import { supabaseStorageImageProps } from "./lib/storage";

function getStartedPath(user) {
  if (!user) return "/signup";
  if (user.user_metadata?.role === "student") return "/student-dashboard";
  return "/tutor-dashboard";
}

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const testimonials = [
  {
    name: "Nethmi · Student",
    message:
      "I found the right A/L tutor in less than two days. The filtering experience is excellent.",
    rating: 5,
  },
  {
    name: "Mr. Silva · Parent",
    message:
      "Clear profiles and transparent details made tutor selection much easier for our family.",
    rating: 5,
  },
  {
    name: "Kavisha · Student",
    message:
      "The interface feels modern and smooth. Communication with tutors is super quick.",
    rating: 4,
  },
];

const subjectIcons = {
  maths: Calculator,
  science: FlaskConical,
  history: Landmark,
  art: Palette,
  english: Languages,
  physics: Atom,
};

function isVerifiedTutor(tutor) {
  return Boolean(tutor?.verifiedBlueMark || Number(tutor?.verifiedMarks) > 0);
}

function formatTutorRating(rating) {
  return typeof rating === "number" ? rating.toFixed(1) : "N/A";
}

function formatTutorLocation(location) {
  if (typeof location !== "string" || !location.trim()) return "Location TBD";
  return location.split(",")[0].trim();
}

const highlightIcons = [ShieldCheck, MapPin, MessageSquareText];
const platformStepIcons = [Sparkles, CheckCircle2, Clock3];

function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      return;
    }

    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, [isDark]);

  return { isDark, setIsDark };
}

function Counter({ value, suffix, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-90px" });
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView || done) {
      return;
    }

    const duration = 1300;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
        setDone(true);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, done, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-semibold tracking-[-0.05em] text-slate-950 md:text-6xl dark:text-white">
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

function TestimonialSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      3600,
    );
    return () => clearInterval(timer);
  }, []);

  const item = testimonials[index];

  return (
    <section id="reviews" className="mx-auto mt-24 max-w-5xl px-6 scroll-mt-24">
      <div className="glass-card rounded-[2.5rem] p-8 text-center md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-5 flex justify-center gap-1 text-slate-400">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="mx-auto max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-4xl dark:text-white">
              "{item.message}"
            </p>
            <p className="mt-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {item.name}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function JoinUsModal({ isOpen, onClose, animationData, successAnimationData }) {
  const { signUp, isConfigured } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("Student");
    setShowPassword(false);
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrors({});
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const esc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  const close = () => {
    onClose();
    setTimeout(reset, 200);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    if (!isConfigured) {
      setErrors({
        ...nextErrors,
        form: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and restart the dev server.",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp({
      name: fullName.trim(),
      email: email.trim(),
      password,
      role: role === "Student" ? "student" : "tutor",
    });
    setIsSubmitting(false);

    if (error) {
      const message =
        error?.message ?? "Could not create your account. Please try again.";
      let friendly = message;
      if (/already registered|already exists/i.test(message))
        friendly = "That email is already registered. Try signing in instead.";
      setErrors({ ...nextErrors, form: friendly });
      return;
    }

    setIsSuccess(true);
    setTimeout(close, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.95 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="glass relative w-full max-w-md rounded-3xl p-6"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/70 p-1.5 text-slate-700 transition hover:scale-105 dark:bg-neutral-800/80 dark:text-slate-200"
            >
              <X size={16} />
            </button>

            <div className="mb-4 flex justify-center">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-1 dark:bg-neutral-800/70">
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">
                    👋
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
              {t.joinUs}
            </h3>
            <p className="mb-5 mt-1 text-center text-sm text-slate-600 dark:text-slate-300">
              {t.createAccountPrompt}
            </p>

            {!isSuccess ? (
              <form onSubmit={onSubmit} className="space-y-3" noValidate>
                {errors.form ? (
                  <p className="rounded-xl glass-btn border border-rose-300/60 bg-rose-50/90 px-3 py-2 text-xs font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                    {errors.form}
                  </p>
                ) : null}
                <div>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder={t.fullName}
                    className="filter-input"
                  />

                  {errors.fullName ? (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.fullName}
                    </p>
                  ) : null}
                </div>

                <div>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t.emailAddress}
                    className="filter-input"
                  />

                  {errors.email ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                  ) : null}
                </div>

                <div>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="filter-input pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.password}
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t.iAmJoiningAs}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[t.student, t.tutor].map((item) => {
                      const active = role === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setRole(item)}
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            active
                              ? "border-slate-950 bg-neutral-950 text-white dark:border-white dark:bg-neutral-800 dark:text-white"
                              : "border-slate-300/70 bg-white/60 text-slate-700 dark:border-slate-600 dark:bg-neutral-800/60 dark:text-slate-200"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl glass-btn bg-neutral-950 px-4 py-3 font-semibold text-white disabled:opacity-75 dark:bg-neutral-800 dark:text-white"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      {t.signingUp}
                    </>
                  ) : (
                    t.signUpBtn
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8"
              >
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-1 dark:bg-neutral-800/70">
                  {successAnimationData ? (
                    <Lottie
                      animationData={successAnimationData}
                      loop={false}
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      ✅
                    </div>
                  )}
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {t.registrationSuccessful}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {t.welcomeToStf}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PopularSubjects() {
  const { t } = useLanguage();
  const subjects = [
    { id: "maths", label: t.subjectMaths, icon: subjectIcons.maths, blurb: t.subjectMathsBlurb },
    { id: "science", label: t.subjectScience, icon: subjectIcons.science, blurb: t.subjectScienceBlurb },
    { id: "history", label: t.subjectHistory, icon: subjectIcons.history, blurb: t.subjectHistoryBlurb },
    { id: "art", label: t.subjectArt, icon: subjectIcons.art, blurb: t.subjectArtBlurb },
    { id: "english", label: t.subjectEnglish, icon: subjectIcons.english, blurb: t.subjectEnglishBlurb },
    { id: "physics", label: t.subjectPhysics, icon: subjectIcons.physics, blurb: t.subjectPhysicsBlurb },
  ];

  return (
    <section
      id="subjects"
      className="mx-auto mt-28 max-w-6xl px-6 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-12 max-w-3xl text-center"
      >
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {t.exploreSubjectsTag}
        </p>
        <h3 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
          {t.popularSubjectsHeadline}
        </h3>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
          {t.popularSubjectsDesc}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject, index) => {
          const Icon = subject.icon;
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group flex items-center gap-5 glass-card rounded-[2rem] p-6 transition hover:-translate-y-1"
            >
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 transition-transform duration-300 group-hover:scale-105 dark:bg-neutral-800 dark:text-white">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                  {subject.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {subject.blurb}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedTutors({ tutors }) {
  const { t } = useLanguage();

  if (!tutors.length) {
    return (
      <section
        id="tutors"
        className="mx-auto mt-28 max-w-6xl px-6 scroll-mt-24"
      >
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t.featuredTutorsTag}
          </p>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            {t.noFeaturedTutors}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="tutors" className="mx-auto mt-28 max-w-6xl px-6 scroll-mt-24">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t.featuredTutorsTag}
          </p>
          <h3 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
            {t.featuredTutorsHeadline}
          </h3>
        </div>
        <Link
          to="/tutors"
          className="inline-flex w-fit items-center gap-2 rounded-full glass-btn bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        >
          {t.viewAllTutors}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tutors.map((tutor) => {
          const hasVerifiedBlueMark = Boolean(
            tutor.verifiedBlueMark || Number(tutor.verifiedMarks) > 0,
          );
          return (
            <Link
              key={tutor.id}
              to={`/tutor/${tutor.id}`}
              data-tutor-id={tutor.id}
              data-tutor-magnetic
              className="glass-card group relative block overflow-hidden rounded-[2rem] p-6 transition duration-300"
            >
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 text-sm font-semibold text-white dark:bg-neutral-800 dark:text-white">
                  {tutor.avatar_url ? (
                    <img
                      src={tutor.avatar_url}
                      alt={`${tutor.name} avatar`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      {...supabaseStorageImageProps(tutor.avatar_url)}
                    />
                  ) : (
                    tutor.initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="inline-flex max-w-full items-center gap-1 truncate text-base font-semibold text-slate-950 dark:text-white">
                    {tutor.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {hasVerifiedBlueMark ? (
                      <p className="inline-flex items-center gap-1 rounded-full glass-btn bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        <BadgeCheck size={10} />
                        Verified
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-1 inline-flex items-center gap-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <GraduationCap size={11} />
                    {tutor.subject}
                  </p>
                </div>
              </div>
              <p className="relative z-10 mt-5 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {tutor.description}
              </p>
              <div className="relative z-10 mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Star size={12} fill="currentColor" />
                  {formatTutorRating(tutor.rating)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" />
                  {formatTutorLocation(tutor.location)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [heroAnimation, setHeroAnimation] = useState(null);
  const [successAnimation, setSuccessAnimation] = useState(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const heroStats = [
    { value: "170+", label: t.verifiedTutors },
    { value: "56K", label: t.studentInquiries },
    { value: "4.9/5", label: t.avgRating },
  ];
  const learningLevels = [t.levelSchool, t.levelAL, t.levelUniversity, t.levelProfessional];
  const platformSteps = [
    { title: t.step1Title, description: t.step1Desc, icon: platformStepIcons[0] },
    { title: t.step2Title, description: t.step2Desc, icon: platformStepIcons[1] },
    { title: t.step3Title, description: t.step3Desc, icon: platformStepIcons[2] },
  ];
  const highlights = [
    { title: t.highlight1Title, description: t.highlight1Desc, icon: highlightIcons[0] },
    { title: t.highlight2Title, description: t.highlight2Desc, icon: highlightIcons[1] },
    { title: t.highlight3Title, description: t.highlight3Desc, icon: highlightIcons[2] },
  ];

  useEffect(() => {
    fetch("https://assets10.lottiefiles.com/packages/lf20_touohxv0.json")
      .then((res) => res.json())
      .then((data) => setHeroAnimation(data))
      .catch(() => setHeroAnimation(null));

    fetch(
      "https://lottie.host/8f6ef5f4-a4ab-44f2-ad6c-b8570e610b43/0W9F4ehT60.json",
    )
      .then((res) => res.json())
      .then((data) => setSuccessAnimation(data))
      .catch(() => setSuccessAnimation(null));
  }, []);

  return (
    <div className="relative isolate animate-fade-in overflow-hidden bg-slate-50 dark:bg-neutral-950">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-slate-200 dark:bg-white/10"
      />

      <section
        id="home"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 scroll-mt-24 md:grid-cols-[1.02fr_0.98fr] md:py-24"
      >
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="text-center md:text-left"
        >
          <motion.div
            variants={heroItem}
            className="mx-auto inline-flex items-center gap-2 rounded-full glass-btn border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 shadow-sm md:mx-0 dark:border-white/10 dark:bg-neutral-900 dark:text-slate-300"
          >
            <Sparkles className="h-4 w-4" />
            {t.heroTag}
          </motion.div>

          <motion.h2
            variants={heroItem}
            className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white"
          >
            {t.heroHeadline}
          </motion.h2>

          <motion.p
            variants={heroItem}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:mx-0 md:text-xl dark:text-slate-300"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mx-auto mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row md:mx-0"
          >
            <Button
              asChild
              className="h-12 rounded-full glass-btn bg-neutral-950 px-7 text-base text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 sm:w-auto"
              size="lg"
            >
              <Link
                to={getStartedPath(user)}
                className="inline-flex items-center gap-2"
              >
                {t.getStarted} <ArrowUpRight />
              </Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-full glass-btn border-slate-200 bg-white px-7 text-base hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-800 sm:w-auto"
              size="lg"
              variant="outline"
            >
              <a href="#features">{t.seeHowItWorks}</a>
            </Button>
          </motion.div>

          <motion.div
            variants={heroItem}
            className="mt-10 grid grid-cols-3 gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-neutral-900"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl px-2 py-3 text-center md:text-left"
              >
                <p className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.58, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -left-6 top-10 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md md:block dark:border-white/10 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-neutral-800 dark:text-white">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-950 dark:text-white">
                  Verified match
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Maths · Colombo
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-neutral-900">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 text-slate-950 dark:border-white/10 dark:bg-neutral-950 dark:text-white">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Live matches
                  </p>
                  <h3 className="mt-1 text-2xl font-black">Tutor shortlist</h3>
                </div>
                <span className="rounded-full glass-btn border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-neutral-900 dark:text-slate-300">
                  12 nearby
                </span>
              </div>

              <div className="space-y-3">
                {[].map((tutor, index) => {
                  return (
                    <div
                      key={tutor.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-neutral-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-black text-white dark:bg-neutral-800 dark:text-white">
                          {tutor.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {tutor.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {tutor.subject}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full glass-btn border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-neutral-950 dark:text-slate-300">
                          <Star size={12} fill="currentColor" />
                          {formatTutorRating(tutor.rating)}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                        <div
                          className="h-full rounded-full bg-neutral-950 dark:bg-neutral-700"
                          style={{ width: `${86 - index * 9}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-neutral-900">
                  <BookOpen className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  <p className="mt-3 text-lg font-black">24</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    subjects covered
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-neutral-900">
                  <Users className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  <p className="mt-3 text-lg font-black">8 min</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    avg. shortlist time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="glass-card rounded-[1.75rem] p-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
            {t.builtForEveryStage}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center md:grid-cols-4">
            {learningLevels.map((item) => (
              <Link
                key={item}
                to={`/tutors?level=${encodeURIComponent(item)}`}
                className="glass-card rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 dark:text-white/90"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PopularSubjects />

      <FeaturedTutors tutors={[]} />

      <TestimonialSlider />

      <section
        id="features"
        className="mx-auto mt-16 max-w-6xl px-4 pb-16 scroll-mt-24"
      >
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {t.howItWorksTag}
          </p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl dark:text-white">
            {t.howItWorksHeadline}
          </h3>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {platformSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-45px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-neutral-800 dark:text-white">
                  <Icon size={20} />
                </div>
                <h4 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Counter value={25} suffix="+" label={t.yearsExperience} />
          <Counter value={56} suffix="K" label={t.studentsEnrolled} />
          <Counter value={170} suffix="+" label={t.experiencedTeachers} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-45px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900"
              >
                <span className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 dark:border-white/10 dark:bg-neutral-800 dark:text-white">
                  <Icon size={18} />
                </span>
                <h4 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="join" className="mx-auto max-w-6xl px-4 pb-12 scroll-mt-24">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {t.joinPlatformTag}
          </p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {t.joinPlatformHeadline}
          </h3>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            {t.joinPlatformDesc}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-neutral-950">
              <h4 className="text-xl font-black text-slate-950 dark:text-white">
                {t.forStudents}
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t.studentFindDesc}
              </p>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="mt-5 rounded-full glass-btn bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                {t.studentSignUp}
              </button>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <h4 className="text-xl font-black text-slate-950 dark:text-white">
                {t.forTutors}
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t.tutorCreateDesc}
              </p>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="mt-5 rounded-full glass-btn border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
              >
                {t.tutorSignUp}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-neutral-950 p-8 text-center text-white shadow-md md:p-10 dark:border-white/10">
          <h3 className="text-3xl font-black tracking-tight md:text-4xl">
            {t.ctaHeadline}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            {t.ctaDesc}
          </p>
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsJoinOpen(true)}
            className="mt-6 rounded-full glass-btn bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_16px_40px_rgba(255,255,255,0.16)]"
          >
            {t.joinSmartTuition}
          </motion.button>
        </div>
      </section>

      <FAQ />

      <JoinUsModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        animationData={heroAnimation}
        successAnimationData={successAnimation}
      />
    </div>
  );
}

function AppleHomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [heroAnimation, setHeroAnimation] = useState(null);
  const [successAnimation, setSuccessAnimation] = useState(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [featuredTutors, setFeaturedTutors] = useState([]);

  const heroStats = [
    { value: "170+", label: t.verifiedTutors },
    { value: "56K", label: t.studentInquiries },
    { value: "4.9/5", label: t.avgRating },
  ];
  const learningLevels = [t.levelSchool, t.levelAL, t.levelUniversity, t.levelProfessional];
  const platformSteps = [
    { title: t.step1Title, description: t.step1Desc, icon: platformStepIcons[0] },
    { title: t.step2Title, description: t.step2Desc, icon: platformStepIcons[1] },
    { title: t.step3Title, description: t.step3Desc, icon: platformStepIcons[2] },
  ];

  useEffect(() => {
    fetch("https://assets10.lottiefiles.com/packages/lf20_touohxv0.json")
      .then((res) => res.json())
      .then((data) => setHeroAnimation(data))
      .catch(() => setHeroAnimation(null));

    fetch(
      "https://lottie.host/8f6ef5f4-a4ab-44f2-ad6c-b8570e610b43/0W9F4ehT60.json",
    )
      .then((res) => res.json())
      .then((data) => setSuccessAnimation(data))
      .catch(() => setSuccessAnimation(null));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let cancelled = false;

    fetchTutorDirectoryFromSupabase().then((rows) => {
      if (cancelled) return;
      const verifiedRecent = rows.filter(isVerifiedTutor).slice(0, 4);
      const next = verifiedRecent.length ? verifiedRecent : rows.slice(0, 4);
      setFeaturedTutors(next);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-aurora relative -mt-[5.5rem] overflow-hidden bg-[#f5f5f7] dark:bg-neutral-950">
      <section
        id="home"
        className="relative overflow-hidden scroll-mt-24"
      >
        {/* Purple plasma shader background — hero only */}
        <div className="absolute inset-0 h-full w-full">
          <ShaderBackground />
        </div>
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f5f5f7] to-transparent dark:from-[#111111]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-[9rem] text-center md:pb-32 md:pt-[11rem]">
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="mx-auto flex max-w-5xl flex-col items-center"
        >
          <motion.h1
            variants={heroItem}
            className="mt-7 max-w-5xl text-6xl font-semibold leading-[1.02] text-slate-950 dark:text-white sm:text-7xl md:text-8xl lg:text-9xl whitespace-normal break-words"
          >
            {t.heroHeadline2}
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mx-auto mt-7 max-w-3xl text-xl font-medium leading-8 tracking-[-0.02em] text-slate-600 dark:text-slate-300 md:text-2xl md:leading-9"
          >
            {t.heroSubtitle2}
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-9 flex w-full max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row"
          >
            <Button
              asChild
              className="h-12 rounded-full glass-btn bg-neutral-950 px-7 text-base font-semibold text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              size="lg"
            >
              <Link
                to={getStartedPath(user)}
                className="inline-flex items-center gap-2"
              >
                {t.getStarted} <ArrowUpRight />
              </Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-full glass-btn border border-slate-200 bg-white/70 px-7 text-base font-semibold text-slate-800 shadow-none backdrop-blur-sm hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              size="lg"
              variant="outline"
            >
              <a href="#features">{t.learnMore}</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.58, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-6xl"
        >
          <div className="glass-frame rounded-[2.75rem] p-3">
            <div className="glass-frame overflow-hidden rounded-[2.25rem]">
              <div className="flex items-center gap-2 bg-transparent px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <div className="mx-auto hidden w-80 rounded-full glass-btn bg-slate-100 px-4 py-1.5 text-center text-xs font-medium text-slate-500 md:block dark:bg-neutral-800 dark:text-slate-400">
                  smarttuitionfinder.app
                </div>
              </div>

              <div className="grid gap-6 p-5 text-left md:grid-cols-[0.85fr_1.15fr] md:p-8">
                <aside className="glass-card rounded-[2rem] p-5">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {t.searchLabel}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                    {t.matchByHeadline}
                  </h2>

                  <div className="mt-6 space-y-3">
                    {[
                      `${t.subjectLabel}: ${t.subjectMaths}`,
                      `${t.areaLabel}: Colombo`,
                      `${t.levelLabel}: ${t.levelAL}`,
                    ].map((item) => (
                      <div
                        key={item}
                        className="glass-btn flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <span>{item}</span>
                        <CheckCircle2 size={16} />
                      </div>
                    ))}
                  </div>

                  <div className="glass-card mt-6 rounded-3xl p-5 text-slate-950 dark:text-white">
                    <p className="text-sm font-medium opacity-70">
                      {t.recommendedMatch}
                    </p>
                    <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                      96%
                    </p>
                  </div>
                </aside>

                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {t.tutorShortlist}
                        </p>
                        <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                          {t.cleanProfilesHeadline}
                        </h2>
                    </div>
                    <span className="hidden rounded-full glass-btn px-4 py-2 text-sm font-semibold text-slate-600 md:inline-flex dark:text-slate-300">
                      {t.nearbyCount.replace("{count}", "12")}
                    </span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    {featuredTutors.slice(0, 3).map((tutor) => {
                      return (
                        <div
                          key={tutor.id}
                          className="glass-card rounded-[2rem] p-5"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl glass-btn text-sm font-semibold text-slate-800 dark:text-white">
                            {tutor.avatar_url ? (
                              <img
                                src={tutor.avatar_url}
                                alt={`${tutor.name} avatar`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                {...supabaseStorageImageProps(tutor.avatar_url)}
                              />
                            ) : (
                              tutor.initials
                            )}
                          </div>
                          <p className="mt-5 truncate text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                            {tutor.name}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                            {tutor.subject}
                          </p>
                          <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Star size={13} fill="currentColor" />
                              {formatTutorRating(tutor.rating)}
                            </span>
                            <span>{formatTutorLocation(tutor.location)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {heroStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="glass-card rounded-[1.75rem] p-5"
                      >
                        <p className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>{/* end relative z-10 content wrapper */}
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {learningLevels.map((item) => (
            <Link
              key={item}
              to={`/tutors?level=${encodeURIComponent(item)}`}
              className="glass-card rounded-[2rem] p-6 text-center transition"
            >
              <p className="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white/90">
                {item}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="mx-auto mt-28 max-w-6xl px-6 scroll-mt-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t.designedForFocusTag}
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
            {t.designedForFocusHeadline}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {platformSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-45px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass-card rounded-[2.25rem] p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-y border-slate-200 py-12 md:grid-cols-3 dark:border-white/10">
          <Counter value={25} suffix="+" label={t.yearsExperience} />
          <Counter value={56} suffix="K" label={t.studentsEnrolled} />
          <Counter value={170} suffix="+" label={t.experiencedTeachers} />
        </div>
      </section>

      <PopularSubjects />

      <FeaturedTutors tutors={featuredTutors} />

      <TestimonialSlider />

      <section
        id="join"
        className="mx-auto mt-28 max-w-6xl px-6 pb-16 scroll-mt-24"
      >
        <div className="overflow-hidden rounded-[2.75rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t.forStudents}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-5xl dark:text-white">
                {t.studentFindTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-500 dark:text-slate-400">
                {t.studentFindLongDesc}
              </p>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="mt-8 rounded-full glass-btn bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                {t.studentSignUp}
              </button>
            </div>
            <div className="border-t border-slate-200 bg-[#fbfbfd] p-8 md:border-l md:border-t-0 md:p-12 dark:border-white/10 dark:bg-neutral-950">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t.forTutors}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-5xl dark:text-white">
                {t.tutorPresentTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-500 dark:text-slate-400">
                {t.tutorPresentDesc}
              </p>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="mt-8 rounded-full glass-btn border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
              >
                {t.tutorSignUp}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[2.75rem] bg-neutral-950 px-8 py-16 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:px-12">
          <h2 className="text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
            {t.ctaHeadline2}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t.ctaDesc2}
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsJoinOpen(true)}
            className="mt-8 rounded-full glass-btn bg-white px-7 py-3 text-sm font-semibold text-slate-950"
          >
            {t.joinSmartTuition}
          </motion.button>
        </div>
      </section>

      <FAQ />

      <JoinUsModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        animationData={heroAnimation}
        successAnimationData={successAnimation}
      />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isUuid = (value) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(value || "").trim(),
    );

  useEffect(() => {
    const hash = location.hash || "";
    if (!hash.startsWith("#join")) return;

    const queryIndex = hash.indexOf("?");
    if (queryIndex === -1) {
      navigate("/join", { replace: true });
      return;
    }

    const params = new URLSearchParams(hash.slice(queryIndex + 1));
    const meetingId = (params.get("meetingId") || params.get("meeting") || "").trim();
    if (!meetingId) return;

    const token = (params.get("token") || "").trim();
    if (!isUuid(meetingId)) {
      const qs = new URLSearchParams();
      qs.set("meetingId", meetingId);
      if (token) qs.set("token", token);
      navigate(`/join?${qs.toString()}`, { replace: true });
      return;
    }

    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    navigate(`/live/join/${meetingId}${tokenQuery}`, { replace: true });
  }, [location.hash, navigate]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground transition-colors">
      <Navbar />
      <LanguageSwitcher />

      <main className="flex w-full min-h-0 flex-1 flex-col pt-[5.5rem]">
        <Routes>
          <Route path="/" element={<AppleHomePage />} />
          <Route path="/join" element={<JoinMeetingPage />} />
          <Route path="/tutors" element={<AllTutorsPage />} />
          <Route path="/tutor/:id" element={<TutorProfilePage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/tutor-login" element={<TutorLoginPage />} />
            <Route path="/students-login" element={<StudentLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/tutor-register"
              element={<Navigate to="/signup?role=tutor" replace />}
            />

            <Route
              path="/students-register"
              element={<Navigate to="/signup?role=student" replace />}
            />
          </Route>

          <Route
            path="/student-login"
            element={<Navigate to="/students-login" replace />}
          />
          <Route
            path="/student-register"
            element={<Navigate to="/signup?role=student" replace />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/tutor-dashboard" element={<TutorDashboardPage />} />
            <Route
              path="/tutor-profile/edit"
              element={<TutorProfileEditPage />}
            />
            <Route path="/tutor-profile" element={<TutorOwnProfilePage />} />
            <Route path="/tutor-pro" element={<TutorProPlanPage />} />
            <Route path="/live/host" element={<TutorLiveHostPage />} />
            <Route path="/live/meeting/:meetingId" element={<TutorLiveMeetingPage />} />
            <Route path="/payment/success" element={<PaymentStatusPage />} />
            <Route path="/payment/failed" element={<PaymentStatusPage />} />
          </Route>

          <Route element={<ProtectedRoute redirectTo="/students-login" />}>
            <Route
              path="/student-dashboard"
              element={<StudentDashboardPage />}
            />
            <Route
              path="/student-profile"
              element={<StudentProfileEditPage />}
            />
            <Route
              path="/live/join/:meetingId"
              element={<StudentLiveJoinPage />}
            />
          </Route>

          <Route
            path="/students-dashboard"
            element={<Navigate to="/student-dashboard" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <GeminiChatbot />
    </div>
  );
}
