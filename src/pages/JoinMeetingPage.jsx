import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinMeetingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isUuid = (value) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(value || "").trim(),
    );

  const extractInviteDetails = (text) => {
    const raw = String(text || "").trim();
    if (!raw) return null;

    // Case 1: direct UUID
    if (isUuid(raw)) return { meetingId: raw, token: "" };

    // Case 2: hash-like string ("/#join?...")
    const hashIndex = raw.indexOf("#join");
    if (hashIndex !== -1) {
      const hashPart = raw.slice(hashIndex + 1); // remove leading '#'
      const queryIndex = hashPart.indexOf("?");
      if (queryIndex !== -1) {
        const params = new URLSearchParams(hashPart.slice(queryIndex + 1));
        const meetingId = (params.get("meetingId") || params.get("meeting") || "").trim();
        const token = (params.get("token") || "").trim();
        if (meetingId) return { meetingId, token };
      }
    }

    // Case 3: full URL like http://.../#join?meetingId=...&token=...
    try {
      const url = new URL(raw);
      const hash = url.hash || "";
      if (hash.startsWith("#join")) {
        const queryIndex = hash.indexOf("?");
        if (queryIndex !== -1) {
          const params = new URLSearchParams(hash.slice(queryIndex + 1));
          const meetingId = (params.get("meetingId") || params.get("meeting") || "").trim();
          const token = (params.get("token") || "").trim();
          if (meetingId) return { meetingId, token };
        }
      }
    } catch {
      // ignore
    }

    // Case 4: query string only
    if (raw.includes("meetingId=") || raw.includes("token=")) {
      try {
        const params = new URLSearchParams(raw.startsWith("?") ? raw.slice(1) : raw);
        const meetingId = (params.get("meetingId") || params.get("meeting") || "").trim();
        const token = (params.get("token") || "").trim();
        if (meetingId) return { meetingId, token };
      } catch {
        // ignore
      }
    }

    return null;
  };

  const initialMeetingId = useMemo(
    () => (searchParams.get("meetingId") || searchParams.get("meeting") || "").trim(),
    [searchParams],
  );
  const initialToken = useMemo(
    () => (searchParams.get("token") || "").trim(),
    [searchParams],
  );

  const [meetingId, setMeetingId] = useState("");
  const [token, setToken] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMeetingId(initialMeetingId);
    setToken(initialToken);
  }, [initialMeetingId, initialToken]);

  const handleJoin = () => {
    setFormError("");
    const id = String(meetingId || "").trim();
    if (!id) {
      setFormError("Please enter a meeting ID or paste an invite link.");
      return;
    }
    if (!isUuid(id)) {
      setFormError("Meeting ID must be a valid UUID.");
      return;
    }
    const tk = String(token || "").trim();
    const tokenQuery = tk ? `?token=${encodeURIComponent(tk)}` : "";
    navigate(`/live/join/${id}${tokenQuery}`);
  };

  return (
    <section className="min-h-screen bg-[#f5f5f7] px-6 py-10 dark:bg-neutral-950">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 rounded-full glass-btn border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-neutral-900 dark:text-slate-200"
        >
          <ArrowLeft size={13} />
          Back to home
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            Join a meeting
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Paste the meeting details from your invite link.
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="join-meeting-id" className="inline-flex items-center gap-2">
                <Link2 size={14} />
                Invite link or Meeting ID
              </Label>
              <Input
                id="join-meeting-id"
                value={meetingId}
                onChange={(e) => {
                  const next = e.target.value;
                  setMeetingId(next);
                  const extracted = extractInviteDetails(next);
                  if (extracted?.meetingId) setMeetingId(extracted.meetingId);
                  if (extracted?.token) setToken(extracted.token);
                  if (formError) setFormError("");
                }}
                placeholder="Paste invite link (http://.../#join?meetingId=...&token=...) or UUID"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="join-meeting-token" className="inline-flex items-center gap-2">
                <KeyRound size={14} />
                Token (optional)
              </Label>
              <Input
                id="join-meeting-token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token if provided"
              />
            </div>

            <div className="pt-2">
              <Button type="button" className="w-full" onClick={handleJoin}>
                Join meeting
              </Button>
            </div>

            {formError ? (
              <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                {formError}
              </p>
            ) : null}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              If you are not logged in as a student, you will be asked to log in first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
