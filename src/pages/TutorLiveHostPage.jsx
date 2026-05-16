import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Link2, Video } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { canTutorCreateMeeting } from "../lib/liveAccess";
import { dispatchLiveRemindersNow } from "../lib/liveReminders";
import {
  buildSecureJoinLink,
  createLiveMeeting,
  listTutorMeetings,
} from "../lib/liveMeetings";

function defaultStart() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
}

function defaultEnd() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 90);
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
}

export default function TutorLiveHostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [reason, setReason] = useState("");
  const [title, setTitle] = useState("Weekly Live Class");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState(defaultStart());
  const [endsAt, setEndsAt] = useState(defaultEnd());
  const [passcode, setPasscode] = useState("");
  const [waitingRoomEnabled, setWaitingRoomEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dispatchingReminders, setDispatchingReminders] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");

  const isTutor = useMemo(() => user?.user_metadata?.role !== "student", [user]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user?.id) return;
      setChecking(true);
      try {
        const capability = await canTutorCreateMeeting(user.id);
        if (!mounted) return;
        setAllowed(capability.allowed);
        setReason(capability.reason || "");
        if (capability.allowed) {
          const rows = await listTutorMeetings(user.id);
          if (mounted) setMeetings(rows);
        }
      } catch (capabilityError) {
        if (mounted) setError(capabilityError.message || "Failed to load live hosting access.");
      } finally {
        if (mounted) setChecking(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  if (!isTutor) return <Navigate to="/student-dashboard" replace />;

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const created = await createLiveMeeting({
        tutorId: user.id,
        title,
        description,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        passcode,
        waitingRoomEnabled,
      });
      navigate(`/live/meeting/${created.id}`);
    } catch (createError) {
      setError(createError.message || "Failed to create meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f5f7] px-6 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/tutor-dashboard"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowLeft size={13} />
          Back to dashboard
        </Link>

        <div className="mt-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            Host live classes
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Create and run live lessons directly in Smart Tuition Finder.
          </p>
        </div>

        {checking ? (
          <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10">
            Checking your Pro access...
          </div>
        ) : !allowed ? (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {reason || "Tutor Pro is required to host live classes."}{" "}
            <Link to="/tutor-pro" className="underline">
              Upgrade now
            </Link>
            .
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <form
              onSubmit={handleCreate}
              className="space-y-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Create meeting
              </h2>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Meeting passcode (optional)
                <input
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  placeholder="e.g. 123456"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={waitingRoomEnabled}
                  onChange={(event) => setWaitingRoomEnabled(event.target.checked)}
                />
                Enable waiting room
              </label>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Starts at
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(event) => setStartsAt(event.target.value)}
                    required
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Ends at
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(event) => setEndsAt(event.target.value)}
                    required
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </label>
              </div>
              {error ? (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70 dark:bg-white dark:text-slate-950"
              >
                <Video size={14} />
                {submitting ? "Creating..." : "Create & start meeting"}
              </button>
              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <Clock3 size={12} />
                Times are saved in your current timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone}).
              </p>
            </form>

            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Your meetings
              </h2>
              <button
                type="button"
                onClick={async () => {
                  setDispatchingReminders(true);
                  try {
                    const result = await dispatchLiveRemindersNow();
                    setError(`Reminder dispatch completed: ${result.sent ?? 0} sent.`);
                  } catch (dispatchError) {
                    setError(dispatchError.message || "Reminder dispatch failed.");
                  } finally {
                    setDispatchingReminders(false);
                  }
                }}
                className="mt-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {dispatchingReminders ? "Dispatching reminders..." : "Dispatch reminders now"}
              </button>
              <ul className="mt-3 space-y-2">
                {meetings.length ? (
                  meetings.map((meeting) => (
                    <li
                      key={meeting.id}
                      className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(meeting.starts_at).toLocaleString()} -{" "}
                        {new Date(meeting.ends_at).toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <Link
                          to={`/live/meeting/${meeting.id}`}
                          className="text-xs font-semibold text-blue-600 underline"
                        >
                          Open live room
                        </Link>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Link2 size={11} />
                        Student link: {buildSecureJoinLink(meeting)}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500 dark:text-slate-400">
                    No meetings yet.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
