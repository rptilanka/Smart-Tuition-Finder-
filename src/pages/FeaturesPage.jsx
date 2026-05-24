import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Filter,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ShaderBackground from "../components/ShaderBackground";

function getStartedPath(user) {
  if (!user) return "/signup";
  if (user.user_metadata?.role === "student") return "/student-dashboard";
  return "/tutor-dashboard";
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

function SectionLabel({ children }) {
  return (
    <p className="text-sm font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">
      {children}
    </p>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0, accent }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      custom={delay}
      variants={fadeUp}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card group rounded-[2.25rem] p-8 transition duration-300 hover:-translate-y-1"
    >
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accent ?? "bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white"}`}
      >
        <Icon size={20} />
      </span>
      <h3 className="mt-8 text-xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </motion.article>
  );
}

function StatBand() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { value: "170+", label: "Verified tutors" },
    { value: "56K", label: "Student inquiries" },
    { value: "4.9/5", label: "Average rating" },
    { value: "24", label: "Subjects covered" },
  ];

  return (
    <div
      ref={ref}
      className="border-y border-slate-200 py-14 dark:border-white/10"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="text-center"
          >
            <p className="text-4xl font-semibold tracking-[-0.055em] text-slate-950 dark:text-white md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BentoGrid() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        custom={0}
        variants={fadeUp}
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mb-14 max-w-3xl text-center"
      >
        <SectionLabel>Platform highlights</SectionLabel>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
          Everything in one place.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
          Smart Tuition Finder gives students and tutors a clean, focused
          workspace — no clutter, no confusion.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {/* Large card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          custom={0}
          variants={fadeUp}
          viewport={{ once: true, margin: "-50px" }}
          className="glass-card md:col-span-2 rounded-[2.25rem] p-10"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
            <Search size={20} />
          </span>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            Intelligent tutor discovery
          </h3>
          <p className="mt-3 max-w-lg text-base leading-7 text-slate-500 dark:text-slate-400">
            Filter by subject, district, grade level, and budget. Our smart
            ranking surfaces the most relevant tutors first — not just the most
            popular ones.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Subject", "Location", "Level"].map((tag) => (
              <div
                key={tag}
                className="glass-btn flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <span>{tag}</span>
                <CheckCircle2 size={15} className="text-slate-400" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tall card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          custom={0.06}
          variants={fadeUp}
          viewport={{ once: true, margin: "-50px" }}
          className="glass-card rounded-[2.25rem] p-10 flex flex-col justify-between"
        >
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
              <BadgeCheck size={20} />
            </span>
            <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              Verified blue mark
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
              Pro tutors earn a verified badge that builds student trust and
              boosts their profile ranking automatically.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 rounded-2xl glass-btn px-4 py-3">
            <BadgeCheck size={16} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Verified Pro
            </span>
          </div>
        </motion.div>

        {/* Bottom row */}
        <motion.div
          initial="hidden"
          whileInView="show"
          custom={0.1}
          variants={fadeUp}
          viewport={{ once: true, margin: "-50px" }}
          className="glass-card rounded-[2.25rem] p-10"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
            <Video size={20} />
          </span>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            Live classes
          </h3>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
            Tutors can host live video sessions with raise-hand, chat, and
            Q&amp;A panels built in.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          custom={0.14}
          variants={fadeUp}
          viewport={{ once: true, margin: "-50px" }}
          className="glass-card rounded-[2.25rem] p-10"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
            <LayoutDashboard size={20} />
          </span>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            SaaS-style dashboards
          </h3>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
            Separate dashboards for students and tutors. Clean, focused, and
            built for daily use.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          custom={0.18}
          variants={fadeUp}
          viewport={{ once: true, margin: "-50px" }}
          className="glass-card rounded-[2.25rem] p-10"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
            <Brain size={20} />
          </span>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            AI assistant
          </h3>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
            A built-in AI chatbot answers questions about tutors, subjects, and
            the platform — anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CoreFeatures() {
  const features = [
    {
      icon: Filter,
      title: "Smart filtering",
      description:
        "Narrow down hundreds of tutors by subject, district, grade, language, and price — all in real time.",
    },
    {
      icon: ShieldCheck,
      title: "Trust & verification",
      description:
        "Every tutor profile is reviewed. Pro tutors earn verified badges that are prominently shown to students.",
    },
    {
      icon: MapPin,
      title: "Location-aware",
      description:
        "Find tutors in your district or city. Location filters make sure suggestions are practical, not just theoretical.",
    },
    {
      icon: MessageSquareText,
      title: "Direct contact",
      description:
        "Students can reach tutors directly through contact details on every profile — no hidden barriers.",
    },
    {
      icon: Star,
      title: "Ratings & reviews",
      description:
        "Student reviews and star ratings appear on every tutor card so you can compare at a glance.",
    },
    {
      icon: Users,
      title: "Multi-role accounts",
      description:
        "Separate flows for students, parents, and tutors. Each role gets a tailored experience from sign-up.",
    },
    {
      icon: Video,
      title: "Integrated live classes",
      description:
        "Tutors host live sessions — students join with a secure link. Chat, polls, raise-hand all included.",
    },
    {
      icon: Zap,
      title: "Instant profile pages",
      description:
        "Tutors build rich profiles with photos, videos, availability calendars, and qualification records.",
    },
    {
      icon: Clock3,
      title: "Availability calendar",
      description:
        "Tutors set open time slots. Students see real availability before reaching out.",
    },
  ];

  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        custom={0}
        variants={fadeUp}
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mb-14 max-w-3xl text-center"
      >
        <SectionLabel>Core features</SectionLabel>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
          Built for real learning.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
          Every feature was designed to remove friction between students and
          great tutors.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard
            key={f.title}
            icon={f.icon}
            title={f.title}
            description={f.description}
            delay={Math.floor(i / 3) * 0.04 + (i % 3) * 0.06}
          />
        ))}
      </div>
    </section>
  );
}

function ForStudentsVsTutors() {
  const studentFeatures = [
    "Filter tutors by subject, grade & area",
    "Compare ratings and reviews side-by-side",
    "View tutor availability before contacting",
    "Join live sessions with a single click",
    "AI assistant to guide your search",
    "Save favourite tutors to your dashboard",
  ];

  const tutorFeatures = [
    "Rich profile with photos, videos & bio",
    "Set your availability calendar",
    "Receive direct student inquiries",
    "Host live video classes with built-in tools",
    "Verified blue mark for Pro accounts",
    "Analytics on profile views and leads",
  ];

  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        custom={0}
        variants={fadeUp}
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mb-14 max-w-3xl text-center"
      >
        <SectionLabel>Who it's for</SectionLabel>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
          Your role, your features.
        </h2>
      </motion.div>

      <div className="overflow-hidden rounded-[2.75rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
        <div className="grid md:grid-cols-2">
          {/* Students */}
          <motion.div
            initial="hidden"
            whileInView="show"
            custom={0}
            variants={fadeUp}
            viewport={{ once: true, margin: "-50px" }}
            className="p-10 md:p-14"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
              <GraduationCap size={20} />
            </span>
            <h3 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-4xl">
              For students
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
              Find the right tutor in minutes, not days. No cold calls, no
              guesswork.
            </p>
            <ul className="mt-8 space-y-3">
              {studentFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/signup?role=student"
              className="mt-10 inline-flex items-center gap-2 rounded-full glass-btn bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              Get started as student <ArrowUpRight size={15} />
            </Link>
          </motion.div>

          {/* Tutors */}
          <motion.div
            initial="hidden"
            whileInView="show"
            custom={0.08}
            variants={fadeUp}
            viewport={{ once: true, margin: "-50px" }}
            className="border-t border-slate-200 bg-[#fbfbfd] p-10 md:border-l md:border-t-0 md:p-14 dark:border-white/10 dark:bg-neutral-950"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white">
              <BookOpen size={20} />
            </span>
            <h3 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-4xl">
              For tutors
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
              Build a professional presence and get discovered by students who
              need exactly what you teach.
            </p>
            <ul className="mt-8 space-y-3">
              {tutorFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/signup?role=tutor"
              className="mt-10 inline-flex items-center gap-2 rounded-full glass-btn border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            >
              Get started as tutor <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LiveClassSection() {
  const liveFeatures = [
    { icon: Video, label: "HD video conferencing" },
    { icon: Mic, label: "Raise hand requests" },
    { icon: MessageSquareText, label: "Live chat panel" },
    { icon: Users, label: "Multi-participant grid" },
    { icon: ShieldCheck, label: "Secure join links" },
    { icon: Sparkles, label: "Polls & Q&A" },
  ];

  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">
      <div className="overflow-hidden rounded-[2.75rem] bg-neutral-950 px-10 py-16 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:px-14">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <motion.div
              initial="hidden"
              whileInView="show"
              custom={0}
              variants={fadeUp}
              viewport={{ once: true, margin: "-50px" }}
            >
              <SectionLabel>Live sessions</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
                Teaching, upgraded.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Host and join live video classes without leaving the platform.
                Built-in tools keep sessions focused and interactive.
              </p>
              <Link
                to="/signup?role=tutor"
                className="mt-8 inline-flex items-center gap-2 rounded-full glass-btn bg-white px-6 py-3 text-sm font-semibold text-slate-950"
              >
                Start hosting <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {liveFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial="hidden"
                  whileInView="show"
                  custom={i * 0.06}
                  variants={fadeUp}
                  viewport={{ once: true, margin: "-40px" }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
                >
                  <Icon size={16} className="shrink-0 text-slate-300" />
                  <span className="text-sm font-semibold text-slate-200">
                    {f.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection({ user }) {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-6 pb-24">
      <motion.div
        initial="hidden"
        whileInView="show"
        custom={0}
        variants={fadeUp}
        viewport={{ once: true, margin: "-60px" }}
        className="rounded-[2.75rem] bg-white px-10 py-20 text-center shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 md:px-14 dark:bg-neutral-900 dark:ring-white/10"
      >
        <span className="inline-flex items-center gap-2 rounded-full glass-btn border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 dark:border-white/10 dark:bg-neutral-800 dark:text-slate-300">
          <Sparkles size={14} />
          Ready to start?
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl dark:text-white">
          Your perfect tutor is already here.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
          Join thousands of students and tutors who use Smart Tuition Finder
          every day to make learning work.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={getStartedPath(user)}
            className="inline-flex items-center gap-2 rounded-full glass-btn bg-neutral-950 px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          >
            Get started free <ArrowUpRight size={15} />
          </Link>
          <Link
            to="/tutors"
            className="inline-flex items-center gap-2 rounded-full glass-btn border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            Browse tutors
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function FeaturesPage() {
  const { user } = useAuth();

  return (
    <div className="relative -mt-[5.5rem] overflow-hidden bg-[#f5f5f7] dark:bg-neutral-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          <ShaderBackground />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f5f5f7] to-transparent dark:from-[#111111]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-[9rem] text-center md:pb-36 md:pt-[12rem]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
            className="flex flex-col items-center"
          >
  
      

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-6xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-7xl md:text-8xl"
            >
              Features that
              <br className="hidden sm:block" /> actually help.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-2xl text-xl font-medium leading-8 tracking-[-0.02em] text-slate-600 dark:text-slate-300"
            >
              Smart Tuition Finder is built around one idea: getting the right
              student and the right tutor together — fast and without friction.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link
                to={getStartedPath(user)}
                className="inline-flex items-center gap-2 rounded-full glass-btn bg-neutral-950 px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                Get started <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/tutors"
                className="inline-flex items-center gap-2 rounded-full glass-btn border border-white/40 bg-white/60 px-7 py-3 text-sm font-semibold text-slate-800 backdrop-blur-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                Browse tutors
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <StatBand />

      <BentoGrid />

      <CoreFeatures />

      <LiveClassSection />

      <ForStudentsVsTutors />

      <CtaSection user={user} />
    </div>
  );
}
