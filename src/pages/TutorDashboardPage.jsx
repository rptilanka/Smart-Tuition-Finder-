import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  Crown,
  LogOut,
  Mail,
  MessageSquareText,
  Plus,
  Send,
  Settings,
  Star,
  UserRound,
  Users,
  Video,
  Wallet,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { canTutorCreateMeeting } from "../lib/liveAccess";
import {
  buildSecureJoinLink,
  createLiveMeeting,
  listTutorMeetings,
  listTutorSubscribers,
  updateMeetingStatus,
} from "../lib/liveMeetings";
import { getInbox, sendMessage, markMessagesRead } from "../lib/messages";
import { getTutorStats } from "../lib/tutorStats";
import { getTutorRatingStats } from "../lib/reviews";
import { supabaseStorageImageProps } from "../lib/storage";

const upcomingSessions = [
  {
    id: "s1",
    student: "Kavisha Fernando",
    subject: "Mathematics · A/L",
    when: "Tomorrow · 4:00 PM",
    duration: "60 min",
    mode: "Online",
  },
  {
    id: "s2",
    student: "Akila Perera",
    subject: "Physics · A/L",
    when: "Sat · 10:30 AM",
    duration: "90 min",
    mode: "In-person · Colombo",
  },
  {
    id: "s3",
    student: "Nethmi Wijesinghe",
    subject: "Chemistry · O/L",
    when: "Sun · 5:00 PM",
    duration: "60 min",
    mode: "Online",
  },
];

const activity = [
  { id: "a1", label: "New booking request from Dinuka Silva", time: "12m ago" },
  { id: "a2", label: "Review posted by Kavisha Fernando (★ 5)", time: "2h ago" },
  { id: "a3", label: "Profile viewed 14 times today", time: "today" },
];

export default function TutorDashboardPage() {
  const navigate = useNavigate();
  const { user, profile, profileLoading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [liveCapability, setLiveCapability] = useState({ allowed: false, reason: "", loading: true });
  const [stats, setStats] = useState({ activeStudents: 0, sessionsThisWeek: 0 });
  const [ratingStats, setRatingStats] = useState({ average: null, count: 0 });

  const displayName = useMemo(() => {
    if (profile?.name) return profile.name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Tutor";
  }, [profile?.name, user]);

  const initials = useMemo(() => {
    return displayName.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "T";
  }, [displayName]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    setSigningOut(false);
    if (!error) navigate("/tutor-login", { replace: true });
  };

  useEffect(() => {
    let mounted = true;
    if (!user?.id) return;
    Promise.all([
      canTutorCreateMeeting(user.id),
      getTutorStats(user.id),
      profile?.id ? getTutorRatingStats(profile.id) : Promise.resolve({ average: null, count: 0 }),
    ]).then(([cap, st, rt]) => {
      if (!mounted) return;
      setLiveCapability({ allowed: cap.allowed, reason: cap.reason || "", loading: false });
      setStats(st);
      setRatingStats(rt);
    }).catch(() => {
      if (mounted) setLiveCapability({ allowed: false, reason: "", loading: false });
    });
    return () => { mounted = false; };
  }, [user?.id, profile?.id]);

  if (user?.user_metadata?.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl space-y-5">

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    {...supabaseStorageImageProps(profile.avatar_url)}
                  />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Tutor dashboard</p>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {profileLoading ? "Loading…" : `Welcome back, ${firstName(displayName)}`}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/tutor-profile/edit"
                className="btn-secondary"
              >
                <Settings size={13} /> Edit profile
              </Link>
              <Link
                to={profile?.id ? `/tutor/${profile.id}` : "/tutor-profile"}
                className="btn-secondary"
              >
                <UserRound size={13} /> Public profile
              </Link>
              <Link to="/tutor-pro" className="btn-secondary">
                <Crown size={13} /> Pro plan
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="btn-secondary"
              >
                <LogOut size={13} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="Active students" value={String(stats.activeStudents)} sub="paying subscribers" />
          <StatCard icon={CalendarDays} label="Sessions this week" value={String(stats.sessionsThisWeek)} sub="live meetings" />
          <StatCard icon={Star} label="Average rating" value={ratingStats.average != null ? ratingStats.average.toFixed(1) : "—"} sub={`${ratingStats.count} review${ratingStats.count !== 1 ? "s" : ""}`} />
        </div>

        {/* Live Classes */}
        <LiveClassesSection userId={user?.id} navigate={navigate} />

        {/* Paid Students */}
        <PaidStudentsSection userId={user?.id} />

        {/* Messages + Profile */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          <MessagesSection userId={user?.id} role="tutor" />

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Profile</h2>
              <ProfileRow icon={UserRound} label="Name" value={displayName} />
              <ProfileRow icon={Mail} label="Email" value={profile?.email ?? user?.email ?? "—"} />
              <ProfileRow icon={BookOpen} label="Role" value="Verified tutor" />
              <AnimatePresence>
                {!profile && !profileLoading ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-3 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                    Profile not found — run <code>supabase/schema.sql</code>.
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick links</h2>
              <Link to="/live/host" className="flex items-center gap-2 py-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <CalendarDays size={12} /> Manage meetings
              </Link>
              <Link to="/tutor-pro" className="flex items-center gap-2 py-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <Crown size={12} /> Upgrade to Pro
              </Link>
              <Link to={profile?.id ? `/tutor/${profile.id}` : "/tutor-profile"} className="flex items-center gap-2 py-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <UserRound size={12} /> View public profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}

/* ─── Profile row ────────────────────────────────────────────────────────── */
function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon size={11} /> {label}
      </span>
      <span className="max-w-[160px] truncate text-right text-xs font-medium text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

/* ─── Live classes ───────────────────────────────────────────────────────── */
function LiveClassesSection({ userId, navigate }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    listTutorMeetings(userId)
      .then(setMeetings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleNewMeeting = async () => {
    if (!userId) return;
    setCreating(true);
    setError("");
    try {
      const now = new Date();
      const end = new Date(now.getTime() + 60 * 60 * 1000);
      const created = await createLiveMeeting({
        tutorId: userId,
        title: "Live Class",
        startsAt: now.toISOString(),
        endsAt: end.toISOString(),
        waitingRoomEnabled: false,
      });
      await updateMeetingStatus({ meetingId: created.id, tutorId: userId, status: "live" });
      setMeetings((prev) => [{ ...created, status: "live" }, ...prev]);
      navigate(`/live/meeting/${created.id}`);
    } catch (e) {
      setError(e.message || "Could not create meeting. Run live_classes SQL in Supabase first.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (meeting) => {
    const link = `${window.location.origin}${buildSecureJoinLink(meeting)}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(meeting.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const joinLink = (meeting) =>
    `${window.location.origin}${buildSecureJoinLink(meeting)}`;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Video size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Live Classes</h2>
        </div>
        <button
          type="button"
          onClick={handleNewMeeting}
          disabled={creating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus size={13} />
          {creating ? "Creating…" : "New meeting"}
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-xs text-slate-400">Loading…</p>
        ) : meetings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-white/10">
            <Video size={22} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No meetings yet</p>
            <p className="mt-0.5 text-xs text-slate-400">Click "New meeting" to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {meetings.map((meeting) => {
              const link = joinLink(meeting);
              const isCopied = copiedId === meeting.id;
              return (
                <li key={meeting.id} className="py-4 first:pt-0 last:pb-0">
                  {/* Top row: title + status + actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                        <Video size={13} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {meeting.title}
                          </p>
                          <StatusBadge status={meeting.status} />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {new Date(meeting.starts_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.status !== "ended" && meeting.status !== "cancelled" && (
                        <Link
                          to={`/live/meeting/${meeting.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                          <Video size={11} /> Join room
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Share link row */}
                  <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-slate-800/50">
                    <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {link}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(meeting)}
                      className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {isCopied ? (
                        <><Check size={11} className="text-green-500" /> Copied</>
                      ) : (
                        <><Copy size={11} /> Copy</>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── Paid students ──────────────────────────────────────────────────────── */
function PaidStudentsSection({ userId }) {
  const [subscribers, setSubscribers] = useState([]);
  const [students, setStudents] = useState({});
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([listTutorSubscribers(userId), listTutorMeetings(userId)])
      .then(async ([subs, mtgs]) => {
        setSubscribers(subs);
        setMeetings(mtgs.filter((m) => m.status !== "ended" && m.status !== "cancelled"));
        if (subs.length) {
          const ids = subs.map((s) => s.student_id);
          const { data } = await import("../lib/supabase").then(({ supabase: sb }) =>
            sb.from("student_accounts").select("id, name, email").in("id", ids)
          );
          const map = {};
          (data ?? []).forEach((s) => { map[s.id] = s; });
          setStudents(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const latestMeeting = meetings[0] ?? null;

  const handleCopyForStudent = async (studentId) => {
    if (!latestMeeting) return;
    const link = `${window.location.origin}${buildSecureJoinLink(latestMeeting)}`;
    await navigator.clipboard.writeText(link);
    setCopiedKey(studentId);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const daysLeft = (endAt) =>
    Math.max(0, Math.ceil((new Date(endAt).getTime() - Date.now()) / 86400000));

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Wallet size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Paid Students</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {loading ? "…" : `${subscribers.length} active`}
        </span>
      </div>

      <div className="p-5">
        {loading ? (
          <p className="text-xs text-slate-400">Loading…</p>
        ) : subscribers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-white/10">
            <Wallet size={22} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No paid students yet</p>
            <p className="mt-0.5 text-xs text-slate-400">Students subscribe from your public profile page</p>
          </div>
        ) : (
          <>
            {!latestMeeting && (
              <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                Create a meeting above to get a shareable link for students.
              </p>
            )}
            <ul className="divide-y divide-slate-100 dark:divide-white/10">
              {subscribers.map((sub) => {
                const student = students[sub.student_id];
                const name = student?.name || student?.email || sub.student_id.slice(0, 8) + "…";
                const email = student?.email || "";
                const left = daysLeft(sub.end_at);
                return (
                  <li key={sub.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {name[0]?.toUpperCase() ?? "S"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{name}</p>
                        {email && <p className="text-xs text-slate-400">{email}</p>}
                        <p className="text-[11px] text-slate-400">
                          {left > 0 ? `${left}d left` : "Expiring today"} · until {new Date(sub.end_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyForStudent(sub.student_id)}
                      disabled={!latestMeeting}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      {copiedKey === sub.student_id ? (
                        <><Check size={11} className="text-green-500" /> Copied</>
                      ) : (
                        <><Copy size={11} /> Copy link</>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
        Live
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Scheduled
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800">
      {status}
    </span>
  );
}

/* ─── Messages section ───────────────────────────────────────────────────── */
function MessagesSection({ userId, role }) {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null); // otherId
  const [thread, setThread] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getInbox(userId).then(setConversations).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!active || !userId) return;
    import("../lib/messages").then(({ getConversation, markMessagesRead }) => {
      getConversation(userId, active).then(setThread);
      markMessagesRead(userId, active).catch(() => {});
    });
  }, [active, userId]);

  const handleSend = async () => {
    if (!reply.trim() || !active || !userId) return;
    setSending(true);
    try {
      const msg = await sendMessage({ fromUserId: userId, toUserId: active, fromRole: role, body: reply.trim() });
      setThread((prev) => [...prev, msg]);
      setReply("");
      setConversations((prev) => {
        const exists = prev.find((c) => c.otherId === active);
        if (exists) {
          return prev.map((c) => c.otherId === active ? { ...c, messages: [...c.messages, msg] } : c);
        }
        return [{ otherId: active, messages: [msg] }, ...prev];
      });
    } catch { /* ignore */ }
    setSending(false);
  };

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <MessageSquareText size={15} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Messages</h2>
        {conversations.filter(c => c.messages.some(m => m.to_user_id === userId && !m.read_at)).length > 0 && (
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
            {conversations.filter(c => c.messages.some(m => m.to_user_id === userId && !m.read_at)).length} new
          </span>
        )}
      </div>

      {loading ? (
        <p className="px-5 py-4 text-xs text-slate-400">Loading…</p>
      ) : conversations.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <MessageSquareText size={22} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400">No messages yet</p>
          <p className="mt-0.5 text-xs text-slate-400">Students will message you from your profile page</p>
        </div>
      ) : (
        <div className="grid divide-x divide-slate-100 dark:divide-white/10 sm:grid-cols-[200px_1fr]">
          {/* Conversation list */}
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {conversations.map((conv) => {
              const last = conv.messages[0];
              const hasUnread = conv.messages.some(m => m.to_user_id === userId && !m.read_at);
              return (
                <li key={conv.otherId}>
                  <button
                    type="button"
                    onClick={() => setActive(conv.otherId)}
                    className={`w-full px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${active === conv.otherId ? "bg-slate-50 dark:bg-slate-800" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {conv.otherId[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`truncate text-xs ${hasUnread ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-600 dark:text-slate-300"}`}>
                          {conv.otherId.slice(0, 12)}…
                        </p>
                        <p className="truncate text-[10px] text-slate-400">{last?.body?.slice(0, 30)}…</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Thread */}
          <div className="flex flex-col">
            {active ? (
              <>
                <ul className="max-h-64 min-h-[120px] flex-1 space-y-2 overflow-y-auto p-4">
                  {thread.map((msg) => {
                    const mine = msg.from_user_id === userId;
                    return (
                      <li key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${mine ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"}`}>
                          {msg.body}
                        </div>
                      </li>
                    );
                  })}
                  {thread.length === 0 && <li className="text-center text-xs text-slate-400">No messages yet</li>}
                </ul>
                <div className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-white/10">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Reply…"
                    className="h-8 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:ring-1 focus:ring-slate-300 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                  <button type="button" onClick={handleSend} disabled={sending || !reply.trim()}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white disabled:opacity-40 dark:bg-white dark:text-slate-900">
                    <Send size={12} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center py-10 text-xs text-slate-400">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function firstName(name) {
  if (!name) return "there";
  return name.split(" ")[0];
}

function initialsFor(name) {
  if (!name) return "U";
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}
