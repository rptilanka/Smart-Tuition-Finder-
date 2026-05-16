import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Heart,
  LogOut,
  Mail,
  MessageSquareText,
  Send,
  Settings,
  UserRound,
  Video,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  buildSecureJoinLink,
  listMeetingsForStudent,
  listStudentSubscribedTutors,
} from "../lib/liveMeetings";
import { getSavedTutors } from "../lib/savedTutors";
import { getInbox, sendMessage, markMessagesRead } from "../lib/messages";
import { getStudentStats } from "../lib/tutorStats";


export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user, profile, profileLoading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [liveMeetings, setLiveMeetings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [savedTutors, setSavedTutors] = useState([]);
  const [stats, setStats] = useState({ savedCount: 0, subscriptionCount: 0 });

  const displayName = useMemo(() => {
    if (profile?.name) return profile.name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Student";
  }, [profile?.name, user]);

  const initials = useMemo(() => {
    return displayName.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "S";
  }, [displayName]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    setSigningOut(false);
    if (!error) navigate("/students-login", { replace: true });
  };

  useEffect(() => {
    let mounted = true;
    async function loadLiveRows() {
      if (!user?.id || user.user_metadata?.role !== "student") return;
      setLiveLoading(true);
      try {
        const [subs, meetings, saved, st] = await Promise.all([
          listStudentSubscribedTutors(user.id),
          listMeetingsForStudent(user.id),
          getSavedTutors(user.id),
          getStudentStats(user.id),
        ]);
        if (!mounted) return;
        setSubscriptions(subs);
        setLiveMeetings(meetings);
        setSavedTutors(saved);
        setStats(st);
      } catch {
        if (!mounted) return;
        setSubscriptions([]);
        setLiveMeetings([]);
      } finally {
        if (mounted) setLiveLoading(false);
      }
    }
    loadLiveRows();
    return () => { mounted = false; };
  }, [user?.id, user?.user_metadata?.role]);

  if (user && user.user_metadata?.role !== "student") {
    return <Navigate to="/tutor-dashboard" replace />;
  }

  // Subscriptions that have an invite link stored by the notify server
  const invites = subscriptions.filter((s) => s.metadata?.join_link);

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl space-y-5">

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                {initials}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Student dashboard</p>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {profileLoading ? "Loading…" : `Welcome back, ${firstName(displayName)}`}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/student-profile" className="btn-secondary">
                <Settings size={13} /> Edit profile
              </Link>
              <Link to="/tutors" className="btn-secondary">
                <UserRound size={13} /> Find tutors
              </Link>
              <button type="button" onClick={handleSignOut} disabled={signingOut} className="btn-secondary">
                <LogOut size={13} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={CalendarDays} label="Live meetings" value={String(liveMeetings.length)} sub={liveLoading ? "Loading…" : "from subscribed tutors"} />
          <StatCard icon={Heart} label="Saved tutors" value={String(stats.savedCount)} sub="on your list" />
          <StatCard icon={Video} label="Active subscriptions" value={String(stats.subscriptionCount)} sub="tutor channels" />
        </div>

        {/* Tutor invites — shown only when the notify server has attached a join link */}
        {invites.length > 0 && (
          <div className="space-y-2">
            {invites.map((sub) => (
              <InviteBanner key={sub.tutor_id} sub={sub} />
            ))}
          </div>
        )}

        {/* Live class access */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Video size={15} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Live Classes</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-neutral-800 dark:text-slate-400">
              {subscriptions.length} tutor{subscriptions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="p-5">
            {liveLoading ? (
              <p className="text-xs text-slate-400">Loading…</p>
            ) : liveMeetings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-white/10">
                <Video size={22} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No live meetings yet</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {subscriptions.length === 0
                    ? "Subscribe to a tutor to join their live classes"
                    : "Your tutor hasn't started a meeting yet"}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-white/10">
                {liveMeetings.map((meeting) => (
                  <li key={meeting.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{meeting.title}</p>
                        {meeting.status === "live" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(meeting.starts_at).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to={buildSecureJoinLink(meeting)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      <Video size={12} /> Join
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          {/* Messages */}
          <StudentMessagesSection userId={user?.id} />

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Profile</h2>
              <ProfileRow icon={UserRound} label="Name" value={displayName} />
              <ProfileRow icon={Mail} label="Email" value={profile?.email ?? user?.email ?? "—"} />
              <ProfileRow icon={GraduationCap} label="Account" value="Student" />
              <AnimatePresence>
                {!profile && !profileLoading && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-3 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                    Profile not loaded — ensure <code>student_accounts</code> exists.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Saved tutors */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Heart size={11} /> Saved tutors
                </h2>
                <Link to="/tutors" className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-white">Browse</Link>
              </div>
              {savedTutors.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No saved tutors yet — tap the heart on any tutor profile to save them.
                </p>
              ) : (
                <ul className="space-y-1">
                  {savedTutors.slice(0, 5).map((s) => {
                    const displayName = s.name ?? `Tutor ${s.tutor_id.slice(0, 6)}`;
                    const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
                    const href = s.slug ? `/tutor/${s.slug}` : `/tutor/${s.tutor_id}`;
                    const subject = Array.isArray(s.subjects) && s.subjects.length > 0 ? s.subjects[0] : null;
                    return (
                      <li key={s.tutor_id}>
                        <Link to={href} className="flex items-center gap-2 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 px-1 py-1.5 -mx-1 transition">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-neutral-800 dark:text-slate-400">
                            {initials || "T"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{displayName}</p>
                            {subject && <p className="truncate text-[10px] text-slate-400">{subject}</p>}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                  {savedTutors.length > 5 && (
                    <li className="pt-1 text-[11px] text-slate-400">+{savedTutors.length - 5} more</li>
                  )}
                </ul>
              )}
            </div>


{/* Tips */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <BookOpen size={11} /> Tips
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Use filters on the tutor directory to match subject, level, and location. Favourite tutors you like so you can find them quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Invite banner ──────────────────────────────────────────────────────── */
function InviteBanner({ sub }) {
  const joinPath = sub.metadata?.join_link ?? "";
  const title = sub.metadata?.meeting_title ?? "Live Class";
  const status = sub.metadata?.meeting_status ?? "scheduled";
  const sentAt = sub.metadata?.invite_sent_at;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-neutral-800">
          <Video size={14} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Your tutor invited you to: {title}
            </p>
            {status === "live" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                Live now
              </span>
            )}
          </div>
          {sentAt && (
            <p className="text-[11px] text-slate-400">
              Invite received {new Date(sentAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <Link
        to={joinPath}
        className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        <Video size={12} /> Join class
      </Link>
    </div>
  );
}

/* ─── Student messages ───────────────────────────────────────────────────── */
function StudentMessagesSection({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
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
      const msg = await sendMessage({ fromUserId: userId, toUserId: active, fromRole: "student", body: reply.trim() });
      setThread((prev) => [...prev, msg]);
      setReply("");
    } catch { /* ignore */ }
    setSending(false);
  };

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <MessageSquareText size={15} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Messages</h2>
      </div>

      {loading ? (
        <p className="px-5 py-4 text-xs text-slate-400">Loading…</p>
      ) : conversations.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <MessageSquareText size={22} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400">No messages yet</p>
          <p className="mt-0.5 text-xs text-slate-400">Message a tutor from their profile page</p>
        </div>
      ) : (
        <div className="grid divide-x divide-slate-100 dark:divide-white/10 sm:grid-cols-[200px_1fr]">
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {conversations.map((conv) => {
              const last = conv.messages[0];
              const hasUnread = conv.messages.some(m => m.to_user_id === userId && !m.read_at);
              return (
                <li key={conv.otherId}>
                  <button type="button" onClick={() => setActive(conv.otherId)}
                    className={`w-full px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-neutral-800 ${active === conv.otherId ? "bg-slate-50 dark:bg-neutral-800" : ""}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        T
                      </div>
                      <div className="min-w-0">
                        <p className={`truncate text-xs ${hasUnread ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-600 dark:text-slate-300"}`}>
                          Tutor {conv.otherId.slice(0, 8)}…
                        </p>
                        <p className="truncate text-[10px] text-slate-400">{last?.body?.slice(0, 30)}</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col">
            {active ? (
              <>
                <ul className="max-h-64 min-h-[120px] flex-1 space-y-2 overflow-y-auto p-4">
                  {thread.map((msg) => {
                    const mine = msg.from_user_id === userId;
                    return (
                      <li key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${mine ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-800 dark:bg-neutral-800 dark:text-slate-200"}`}>
                          {msg.body}
                        </div>
                      </li>
                    );
                  })}
                  {thread.length === 0 && <li className="text-center text-xs text-slate-400">No messages yet</li>}
                </ul>
                <div className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-white/10">
                  <input value={reply} onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Reply…"
                    className="h-8 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:ring-1 focus:ring-slate-300 dark:border-white/10 dark:bg-neutral-800 dark:text-white" />
                  <button type="button" onClick={handleSend} disabled={sending || !reply.trim()}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white disabled:opacity-40 dark:bg-white dark:text-slate-900">
                    <Send size={12} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center py-10 text-xs text-slate-400">Select a conversation</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-white/10">
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function firstName(name) {
  if (!name) return "there";
  return name.split(" ")[0];
}

function initialsFor(name) {
  if (!name) return "T";
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}
