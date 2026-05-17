import {
  LIVE_MEETING_AUDIT_LOGS_TABLE,
  LIVE_MEETING_CHAT_MESSAGES_TABLE,
  LIVE_MEETING_PARTICIPANTS_TABLE,
  LIVE_MEETING_POLL_VOTES_TABLE,
  LIVE_MEETING_POLLS_TABLE,
  LIVE_MEETING_QUESTIONS_TABLE,
  LIVE_MEETING_REACTIONS_TABLE,
  LIVE_MEETING_REMINDERS_TABLE,
  LIVE_MEETING_WAITING_ROOM_TABLE,
  LIVE_MEETINGS_TABLE,
  TUTOR_STUDENT_SUBSCRIPTIONS_TABLE,
  supabase,
} from "./supabase";
import { canUserJoinMeeting } from "./liveAccess";
import { getLiveProviderConfig } from "./liveProviderAdapter";

function randomToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now()}${Math.random().toString(16).slice(2)}`;
}

async function hashPasscode(value) {
  const passcode = String(value || "").trim();
  if (!passcode) return "";
  if (!globalThis.crypto?.subtle) return passcode;
  const input = new TextEncoder().encode(passcode);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function addAuditLog(meetingId, actorId, actionType, payload = {}) {
  if (!supabase || !meetingId || !actionType) return;
  await supabase.from(LIVE_MEETING_AUDIT_LOGS_TABLE).insert({
    meeting_id: meetingId,
    actor_id: actorId ?? null,
    action_type: actionType,
    payload,
  });
}

export async function createLiveMeeting({
  tutorId,
  title,
  description = "",
  startsAt,
  endsAt,
  passcode = "",
  waitingRoomEnabled = true,
  providerName,
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const passcodeHash = await hashPasscode(passcode);
  const provider = providerName || getLiveProviderConfig().provider || "mesh";
  const secureJoinToken = randomToken();
  const payload = {
    tutor_id: tutorId,
    title: String(title || "").trim() || "Live class",
    description: String(description || "").trim(),
    starts_at: startsAt,
    ends_at: endsAt,
    status: "scheduled",
    waiting_room_enabled: Boolean(waitingRoomEnabled),
    is_locked: false,
    passcode_hash: passcodeHash || null,
    secure_join_token: secureJoinToken,
    provider_name: provider,
    provider_room_id: randomToken(),
  };
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;

  const start = new Date(startsAt);
  const reminderTimes = [60, 10].map((minutes) => {
    const at = new Date(start.getTime() - minutes * 60 * 1000);
    return at.toISOString();
  });
  await Promise.all(
    reminderTimes.map((reminderAt) =>
      supabase.from(LIVE_MEETING_REMINDERS_TABLE).insert({
        meeting_id: data.id,
        user_id: tutorId,
        reminder_at: reminderAt,
        channel: "email",
      }),
    ),
  );
  await addAuditLog(data.id, tutorId, "meeting_created", {
    waiting_room_enabled: Boolean(waitingRoomEnabled),
    provider,
  });
  return data;
}

export async function listTutorMeetings(tutorId) {
  if (!supabase || !tutorId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .select("*")
    .eq("tutor_id", tutorId)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listTutorSubscribers(tutorId) {
  if (!supabase || !tutorId) return [];
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from(TUTOR_STUDENT_SUBSCRIPTIONS_TABLE)
    .select("id, student_id, status, start_at, end_at")
    .eq("tutor_id", tutorId)
    .eq("status", "active")
    .lte("start_at", nowIso)
    .gt("end_at", nowIso)
    .order("end_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listStudentSubscribedTutors(studentId) {
  if (!supabase || !studentId) return [];
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from(TUTOR_STUDENT_SUBSCRIPTIONS_TABLE)
    .select("tutor_id, status, start_at, end_at, metadata")
    .eq("student_id", studentId)
    .eq("status", "active")
    .lte("start_at", nowIso)
    .gt("end_at", nowIso);
  if (error) throw error;
  return data ?? [];
}

export async function listMeetingsForStudent(studentId) {
  if (!supabase || !studentId) return [];
  const subscriptions = await listStudentSubscribedTutors(studentId);
  const tutorIds = subscriptions.map((s) => s.tutor_id).filter(Boolean);
  if (!tutorIds.length) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .select("*")
    .in("tutor_id", tutorIds)
    .in("status", ["scheduled", "live"])
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getMeetingById(meetingId) {
  if (!supabase || !meetingId) return null;
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .select("*")
    .eq("id", meetingId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getMeetingForJoin({ meetingId, joinToken = "" }) {
  if (!supabase || !meetingId) return null;

  const argsA = {
    // Keep join token first to match PostgREST schema-cache lookup ordering
    p_join_token: joinToken || "",
    p_meeting_id: meetingId,
  };
  const { data, error } = await supabase.rpc("get_meeting_for_join", argsA).maybeSingle();
  if (error) {
    const msg = String(error.message || "");
    if (
      msg.includes("get_meeting_for_join") &&
      (msg.includes("schema cache") || msg.includes("Could not find the function"))
    ) {
      throw new Error(
        "Join API is not installed in Supabase yet. Run supabase/live_join_rpc.sql in Supabase SQL Editor, then reload the API schema cache (Settings → API → Reload schema).",
      );
    }
    throw error;
  }
  return data ?? null;
}

export function buildSecureJoinLink(meeting) {
  if (!meeting?.id) return "";
  const token = meeting.secure_join_token || "";
  const tokenQuery = token ? `&token=${encodeURIComponent(token)}` : "";
  return `/#join?meetingId=${encodeURIComponent(meeting.id)}${tokenQuery}`;
}

export async function updateMeetingStatus({ meetingId, tutorId, status }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .update({ status })
    .eq("id", meetingId)
    .eq("tutor_id", tutorId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, tutorId, "meeting_status_changed", { status });
  return data;
}

export async function setMeetingLock({ meetingId, tutorId, locked }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .update({ is_locked: Boolean(locked) })
    .eq("id", meetingId)
    .eq("tutor_id", tutorId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, tutorId, "meeting_lock_changed", { locked: Boolean(locked) });
  return data;
}

export async function setMeetingWaitingRoom({ meetingId, tutorId, enabled }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .update({ waiting_room_enabled: Boolean(enabled) })
    .eq("id", meetingId)
    .eq("tutor_id", tutorId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, tutorId, "waiting_room_toggled", { enabled: Boolean(enabled) });
  return data;
}

export async function setMeetingPasscode({ meetingId, tutorId, passcode }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const passcodeHash = passcode ? await hashPasscode(passcode) : null;
  const { data, error } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .update({ passcode_hash: passcodeHash })
    .eq("id", meetingId)
    .eq("tutor_id", tutorId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, tutorId, "meeting_passcode_updated", {
    has_passcode: Boolean(passcodeHash),
  });
  return data;
}

export async function listWaitingRoom(meetingId) {
  if (!supabase || !meetingId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_WAITING_ROOM_TABLE)
    .select("id, meeting_id, user_id, status, requested_at, decided_at, decided_by, note")
    .eq("meeting_id", meetingId)
    .eq("status", "pending")
    .order("requested_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function decideWaitingRequest({
  requestId,
  meetingId,
  tutorId,
  decision,
  note = "",
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const normalized = decision === "approved" ? "approved" : "denied";
  const { data, error } = await supabase
    .from(LIVE_MEETING_WAITING_ROOM_TABLE)
    .update({
      status: normalized,
      decided_at: new Date().toISOString(),
      decided_by: tutorId,
      note: String(note || ""),
    })
    .eq("id", requestId)
    .eq("meeting_id", meetingId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, tutorId, "waiting_room_decision", {
    request_id: requestId,
    decision: normalized,
  });
  return data;
}

async function requireJoinChecks({ meeting, userId, role, passcode = "", joinToken = "" }) {
  if (meeting.is_locked && role !== "tutor") {
    throw new Error("Meeting is locked by host.");
  }
  if (role !== "tutor" && meeting.secure_join_token) {
    if (String(joinToken || "").trim() !== String(meeting.secure_join_token || "").trim()) {
      throw new Error("Invalid or missing secure join link.");
    }
  }
  if (meeting.passcode_hash) {
    const hashed = await hashPasscode(passcode);
    if (hashed !== meeting.passcode_hash) {
      throw new Error("Incorrect meeting passcode.");
    }
  }
  if (role === "student" && meeting.waiting_room_enabled) {
    const { data: waitingRow } = await supabase
      .from(LIVE_MEETING_WAITING_ROOM_TABLE)
      .select("id, status")
      .eq("meeting_id", meeting.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!waitingRow) {
      await supabase.from(LIVE_MEETING_WAITING_ROOM_TABLE).insert({
        meeting_id: meeting.id,
        user_id: userId,
        status: "pending",
      });
      throw new Error("Waiting for tutor approval.");
    }
    if (waitingRow.status === "pending") throw new Error("Waiting for tutor approval.");
    if (waitingRow.status === "denied") throw new Error("Join request denied by tutor.");
  }
}

export async function joinMeeting({ meetingId, userId, role, passcode = "", joinToken = "" }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  // Prefer secure, server-side enforced join if the RPC exists.
  try {
    const { data, error } = await supabase
      .rpc("join_meeting_secure", {
        p_meeting_id: meetingId,
        p_role: role,
        p_passcode: passcode || "",
        p_join_token: joinToken || "",
      })
      .single();
    if (error) throw error;
    return data;
  } catch (rpcError) {
    // If RPC isn't installed, fall back to legacy client-side checks.
    const message = rpcError?.message || "";
    const looksLikeMissingRpc =
      message.includes("function") && message.includes("join_meeting_secure");
    if (!looksLikeMissingRpc) throw rpcError;

    // For students, the legacy path is typically blocked by RLS and results in
    // confusing errors. Fail fast with a clear setup message.
    if (role === "student") {
      throw new Error(
        "Join API is not installed in Supabase yet. Run supabase/live_join_rpc.sql in Supabase SQL Editor, then reload the API schema cache (Settings → API → Reload schema).",
      );
    }

    const access = await canUserJoinMeeting({ meetingId, userId, role });
    if (!access.allowed) {
      throw new Error(access.reason || "You are not allowed to join this meeting.");
    }
    const meeting = await getMeetingById(meetingId);
    if (!meeting) throw new Error("Meeting not found.");
    await requireJoinChecks({ meeting, userId, role, passcode, joinToken });

    const payload = {
      meeting_id: meetingId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString(),
      left_at: null,
      hand_raised: false,
      last_heartbeat_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from(LIVE_MEETING_PARTICIPANTS_TABLE)
      .upsert(payload, { onConflict: "meeting_id,user_id" })
      .select("*")
      .single();
    if (error) throw error;
    await addAuditLog(meetingId, userId, "participant_joined", { role });
    return data;
  }
}

export async function leaveMeeting({ meetingId, userId }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .update({
      left_at: new Date().toISOString(),
      hand_raised: false,
      last_heartbeat_at: new Date().toISOString(),
    })
    .eq("meeting_id", meetingId)
    .eq("user_id", userId);
  if (error) throw error;
  await addAuditLog(meetingId, userId, "participant_left");
  return true;
}

export async function heartbeatParticipant({ meetingId, userId }) {
  if (!supabase || !meetingId || !userId) return false;
  const { error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .update({ last_heartbeat_at: new Date().toISOString() })
    .eq("meeting_id", meetingId)
    .eq("user_id", userId);
  if (error) throw error;
  return true;
}

export async function setRaisedHand({ meetingId, userId, handRaised }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .update({ hand_raised: Boolean(handRaised), last_heartbeat_at: new Date().toISOString() })
    .eq("meeting_id", meetingId)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, userId, "hand_state_changed", { hand_raised: Boolean(handRaised) });
  return data;
}

export async function setParticipantMuted({
  meetingId,
  actorId,
  participantUserId,
  muted,
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .update({ is_muted: Boolean(muted) })
    .eq("meeting_id", meetingId)
    .eq("user_id", participantUserId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, actorId, "participant_muted_changed", {
    target_user: participantUserId,
    muted: Boolean(muted),
  });
  return data;
}

export async function muteAllParticipants({ meetingId, actorId }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .update({ is_muted: true })
    .eq("meeting_id", meetingId)
    .eq("role", "student");
  if (error) throw error;
  await addAuditLog(meetingId, actorId, "mute_all");
  return true;
}

export async function removeParticipant({ meetingId, actorId, participantUserId }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .update({
      is_removed: true,
      left_at: new Date().toISOString(),
    })
    .eq("meeting_id", meetingId)
    .eq("user_id", participantUserId);
  if (error) throw error;
  await addAuditLog(meetingId, actorId, "participant_removed", {
    target_user: participantUserId,
  });
  return true;
}

export async function listParticipants(meetingId) {
  if (!supabase || !meetingId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_PARTICIPANTS_TABLE)
    .select(
      "id, meeting_id, user_id, role, role_label, hand_raised, is_muted, is_removed, can_share_screen, joined_at, left_at, last_heartbeat_at",
    )
    .eq("meeting_id", meetingId)
    .is("left_at", null)
    .order("joined_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendChatMessage({ meetingId, senderId, body }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const trimmed = String(body || "").trim();
  if (!trimmed) return null;
  const { data, error } = await supabase
    .from(LIVE_MEETING_CHAT_MESSAGES_TABLE)
    .insert({ meeting_id: meetingId, sender_id: senderId, body: trimmed })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listChatMessages(meetingId) {
  if (!supabase || !meetingId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_CHAT_MESSAGES_TABLE)
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export async function sendReaction({ meetingId, senderId, emoji }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const value = String(emoji || "").trim();
  if (!value) return null;
  const { data, error } = await supabase
    .from(LIVE_MEETING_REACTIONS_TABLE)
    .insert({ meeting_id: meetingId, sender_id: senderId, emoji: value })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listRecentReactions(meetingId) {
  if (!supabase || !meetingId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_REACTIONS_TABLE)
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

export async function createPoll({ meetingId, creatorId, question, options }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const normalizedOptions = (options ?? [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (!normalizedOptions.length) throw new Error("Poll requires at least one option.");
  const { data, error } = await supabase
    .from(LIVE_MEETING_POLLS_TABLE)
    .insert({
      meeting_id: meetingId,
      created_by: creatorId,
      question: String(question || "").trim(),
      options: normalizedOptions,
      status: "open",
    })
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, creatorId, "poll_created", { poll_id: data.id });
  return data;
}

export async function listPolls(meetingId) {
  if (!supabase || !meetingId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_POLLS_TABLE)
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function votePoll({ pollId, meetingId, voterId, optionIndex }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETING_POLL_VOTES_TABLE)
    .upsert(
      {
        poll_id: pollId,
        meeting_id: meetingId,
        voter_id: voterId,
        option_index: Number(optionIndex),
      },
      { onConflict: "poll_id,voter_id" },
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function closePoll({ pollId, meetingId, actorId }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETING_POLLS_TABLE)
    .update({ status: "closed" })
    .eq("id", pollId)
    .eq("meeting_id", meetingId)
    .select("*")
    .single();
  if (error) throw error;
  await addAuditLog(meetingId, actorId, "poll_closed", { poll_id: pollId });
  return data;
}

export async function listPollVotes(pollId) {
  if (!supabase || !pollId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_POLL_VOTES_TABLE)
    .select("*")
    .eq("poll_id", pollId);
  if (error) throw error;
  return data ?? [];
}

export async function askQuestion({ meetingId, senderId, body }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const text = String(body || "").trim();
  if (!text) return null;
  const { data, error } = await supabase
    .from(LIVE_MEETING_QUESTIONS_TABLE)
    .insert({
      meeting_id: meetingId,
      sender_id: senderId,
      body: text,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listQuestions(meetingId) {
  if (!supabase || !meetingId) return [];
  const { data, error } = await supabase
    .from(LIVE_MEETING_QUESTIONS_TABLE)
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function markQuestionAnswered({ questionId, meetingId, answered }) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(LIVE_MEETING_QUESTIONS_TABLE)
    .update({ is_answered: Boolean(answered) })
    .eq("id", questionId)
    .eq("meeting_id", meetingId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listPendingReminders(userId) {
  if (!supabase || !userId) return [];
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from(LIVE_MEETING_REMINDERS_TABLE)
    .select("id, meeting_id, user_id, reminder_at, status, channel")
    .eq("user_id", userId)
    .eq("status", "pending")
    .gte("reminder_at", nowIso)
    .order("reminder_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
