import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, KeyRound, Square, Video, X } from "lucide-react";

import LiveRoom from "../components/live/LiveRoom";
import { useAuth } from "../context/AuthContext";
import {
  buildSecureJoinLink,
  getMeetingById,
  setMeetingPasscode,
  updateMeetingStatus,
} from "../lib/liveMeetings";

export default function TutorLiveMeetingPage() {
  const { meetingId } = useParams();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [passcodeDraft, setPasscodeDraft] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const isTutor = user?.user_metadata?.role !== "student";

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!meetingId) return;
      setLoading(true);
      try {
        const row = await getMeetingById(meetingId);
        if (mounted) setMeeting(row);
      } catch (e) {
        if (mounted) setError(e.message || "Could not load meeting.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [meetingId]);

  if (!isTutor) return <Navigate to="/student-dashboard" replace />;

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#1c1c1c]">
        <p className="text-sm text-slate-400">Loading room…</p>
      </div>
    );
  }

  if (!meeting || meeting.tutor_id !== user?.id) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#1c1c1c] px-6">
        <div className="rounded-xl glass-btn border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {error || "Meeting not found or you are not the host."}
        </div>
      </div>
    );
  }

  const joinLink = `${window.location.origin}${buildSecureJoinLink(meeting)}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(joinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStart = async () => {
    const updated = await updateMeetingStatus({ meetingId: meeting.id, tutorId: user.id, status: "live" });
    setMeeting(updated);
  };

  const handleEnd = async () => {
    const updated = await updateMeetingStatus({ meetingId: meeting.id, tutorId: user.id, status: "ended" });
    setMeeting(updated);
  };

  const handleSavePasscode = async () => {
    const updated = await setMeetingPasscode({ meetingId: meeting.id, tutorId: user.id, passcode: passcodeDraft });
    setMeeting(updated);
    setPasscodeDraft("");
    setShowPasscode(false);
  };

  const isEnded = meeting.status === "ended" || meeting.status === "cancelled";

  return (
    <div className="relative flex flex-1 min-h-0 flex-col bg-[#1c1c1c] overflow-hidden">

      {/* ── Minimal top strip ── */}
      <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-2 bg-[#1c1c1c]/90 backdrop-blur z-10">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link to="/tutor-dashboard"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{meeting.title}</span>
              <StatusBadge status={meeting.status} />
            </div>
            <p className="text-[10px] text-slate-500">{new Date(meeting.starts_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-lg glass-btn border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
          >
            {copiedLink ? <><Check size={11} className="text-green-400" /> Copied</> : <><Copy size={11} /> Copy invite</>}
          </button>
          <button type="button" onClick={() => setShowPasscode((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg glass-btn border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
          >
            <KeyRound size={11} /> Passcode
          </button>
          {!isEnded && meeting.status !== "live" && (
            <button type="button" onClick={handleStart}
              className="inline-flex items-center gap-1.5 rounded-lg glass-btn bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
            >
              <Video size={11} /> Go live
            </button>
          )}
        </div>
      </div>

      {/* Passcode panel */}
      {showPasscode && (
        <div className="shrink-0 border-y border-white/10 bg-[#2a2a2a] px-4 py-2">
          <div className="flex items-center gap-2">
            <KeyRound size={13} className="shrink-0 text-slate-400" />
            <input
              value={passcodeDraft}
              onChange={(e) => setPasscodeDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePasscode()}
              placeholder="Set passcode (leave empty to remove)"
              className="h-7 flex-1 rounded-lg glass-btn border border-white/10 bg-white/5 px-3 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-white/20"
            />
            <button type="button" onClick={handleSavePasscode}
              className="rounded-lg glass-btn bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-200"
            >Save</button>
            <button type="button" onClick={() => setShowPasscode(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            ><X size={13} /></button>
          </div>
        </div>
      )}

      {/* ── Room ── */}
      {isEnded ? (
        <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] px-12 py-10 text-center">
            <p className="text-base font-semibold text-white">Meeting ended</p>
            <p className="mt-1 text-xs text-slate-400">This session has finished.</p>
            <Link to="/tutor-dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-lg glass-btn bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
            >
              <ArrowLeft size={14} /> Back to dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 px-4 pb-6">
          <div className="mx-auto w-full max-w-[1900px] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <LiveRoom
              meetingId={meeting.id}
              currentUser={user}
              role="tutor"
              meetingTitle={meeting.title}
              meeting={meeting}
              onMeetingUpdated={setMeeting}
              onEnd={handleEnd}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "live") return (
    <span className="inline-flex items-center gap-1 rounded-full glass-btn bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
    </span>
  );
  if (status === "scheduled") return (
    <span className="rounded-full glass-btn bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-400">Scheduled</span>
  );
  if (status === "ended") return (
    <span className="rounded-full glass-btn bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Ended</span>
  );
  return null;
}
