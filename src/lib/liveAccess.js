import {
  LIVE_MEETINGS_TABLE,
  TUTOR_ACCOUNTS_TABLE,
  supabase,
} from "./supabase";

function isActiveWindow(row) {
  if (!row) return false;
  if (row.status !== "active") return false;
  const now = Date.now();
  const start = row.start_at ? new Date(row.start_at).getTime() : 0;
  const end = row.end_at ? new Date(row.end_at).getTime() : 0;
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && end > now;
}

export function isTutorProFromProfileRow(row) {
  if (!row) return false;
  return Boolean(
    row.profile_boost ??
      row.is_profile_boosted ??
      row.is_verified_blue_mark ??
      Number(row.verified_marks) > 0,
  );
}

export async function canTutorCreateMeeting(tutorId) {
  if (!supabase || !tutorId) return { allowed: false, reason: "Missing Supabase or tutor ID." };

  const { data, error } = await supabase
    .from(TUTOR_ACCOUNTS_TABLE)
    .select("id")
    .eq("id", tutorId)
    .maybeSingle();

  if (error) return { allowed: false, reason: error.message };
  if (!data) return { allowed: false, reason: "Tutor profile not found." };

  return { allowed: true, reason: "", profile: data };
}

export async function canStudentJoinTutorMeeting(studentId, tutorId) {
  if (!supabase || !studentId || !tutorId) {
    return { allowed: false, reason: "Missing Supabase, student, or tutor ID." };
  }

  const [{ data: student, error: studentError }, { data: subRow, error: subError }] =
    await Promise.all([
      supabase.from(STUDENT_ACCOUNTS_TABLE).select("id").eq("id", studentId).maybeSingle(),
      supabase
        .from(TUTOR_STUDENT_SUBSCRIPTIONS_TABLE)
        .select("id, status, start_at, end_at")
        .eq("student_id", studentId)
        .eq("tutor_id", tutorId)
        .order("end_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (studentError) return { allowed: false, reason: studentError.message };
  if (!student) return { allowed: false, reason: "Student account not found." };
  if (subError) return { allowed: false, reason: subError.message };
  if (!isActiveWindow(subRow)) {
    return { allowed: false, reason: "Active subscription to this tutor is required." };
  }
  return { allowed: true, reason: "", subscription: subRow };
}

export async function canUserJoinMeeting({ meetingId, userId, role }) {
  if (!supabase || !meetingId || !userId || !role) {
    return { allowed: false, reason: "Missing required join parameters." };
  }

  const { data: meeting, error: meetingError } = await supabase
    .from(LIVE_MEETINGS_TABLE)
    .select("id, tutor_id, status, starts_at, ends_at")
    .eq("id", meetingId)
    .maybeSingle();

  if (meetingError) return { allowed: false, reason: meetingError.message };
  if (!meeting) return { allowed: false, reason: "Meeting not found." };
  if (meeting.status === "ended" || meeting.status === "cancelled") {
    return { allowed: false, reason: "This meeting is not joinable." };
  }

  if (role === "tutor") {
    if (meeting.tutor_id !== userId) return { allowed: false, reason: "Only meeting owner can host." };
    return { allowed: true, reason: "", meeting };
  }

  // Students with the secure join link can join without a subscription check.
  // The join token itself is validated inside joinMeeting → requireJoinChecks.
  return { allowed: true, reason: "", meeting };
}
