import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";

import LiveRoom from "../components/live/LiveRoom";
import { useAuth } from "../context/AuthContext";
import { getMeetingById } from "../lib/liveMeetings";

export default function StudentLiveJoinPage() {
  const { meetingId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isStudent = user?.user_metadata?.role === "student";
  const [passcode, setPasscode] = useState("");
  const joinToken = useMemo(() => searchParams.get("token") || "", [searchParams]);

  useEffect(() => {
    let mounted = true;
    async function loadMeeting() {
      if (!meetingId) return;
      setLoading(true);
      try {
        const row = await getMeetingById(meetingId);
        if (mounted) setMeeting(row);
      } catch (loadError) {
        if (mounted) setError(loadError.message || "Failed to load meeting.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMeeting();
    return () => {
      mounted = false;
    };
  }, [meetingId]);

  if (!isStudent) return <Navigate to="/tutor-dashboard" replace />;

  return (
    <section className="min-h-screen bg-[#f5f5f7] dark:bg-neutral-950 px-6 py-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl space-y-4">
        <Link
          to="/student-dashboard"
          className="inline-flex items-center gap-1 rounded-full glass-btn border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-neutral-900 dark:text-slate-200"
        >
          <ArrowLeft size={13} />
          Back to dashboard
        </Link>

        {loading ? (
          <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:text-slate-300 dark:ring-white/10">
            Loading meeting...
          </div>
        ) : !meeting ? (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {error || "Meeting not found."}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <KeyRound size={14} />
                Meeting passcode (if required)
              </label>
              <input
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="Enter passcode"
                className="mt-2 h-10 w-full rounded-xl glass-btn border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-neutral-950 dark:text-white"
              />
            </div>
            <LiveRoom
              meetingId={meeting.id}
              currentUser={user}
              role="student"
              meetingTitle={meeting.title}
              passcode={passcode}
              joinToken={joinToken}
              meeting={meeting}
            />
          </div>
        )}
      </div>
    </section>
  );
}
