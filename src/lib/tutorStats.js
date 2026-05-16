import { supabase, TUTOR_STUDENT_SUBSCRIPTIONS_TABLE, LIVE_MEETINGS_TABLE } from "./supabase";

export async function getTutorStats(tutorId) {
  if (!supabase || !tutorId) return { activeStudents: 0, sessionsThisWeek: 0 };
  const nowIso = new Date().toISOString();
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  const [subRes, meetRes] = await Promise.all([
    supabase
      .from(TUTOR_STUDENT_SUBSCRIPTIONS_TABLE)
      .select("student_id", { count: "exact" })
      .eq("tutor_id", tutorId)
      .eq("status", "active")
      .lte("start_at", nowIso)
      .gt("end_at", nowIso),
    supabase
      .from(LIVE_MEETINGS_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("tutor_id", tutorId)
      .gte("starts_at", weekStart)
      .lte("starts_at", weekEnd),
  ]);

  return {
    activeStudents: subRes.count ?? 0,
    sessionsThisWeek: meetRes.count ?? 0,
  };
}

export async function getStudentStats(studentId) {
  if (!supabase || !studentId) return { savedCount: 0, subscriptionCount: 0 };
  const nowIso = new Date().toISOString();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [savedRes, subRes] = await Promise.all([
    supabase.from("student_saved_tutors").select("id", { count: "exact", head: true }).eq("student_id", studentId),
    supabase
      .from(TUTOR_STUDENT_SUBSCRIPTIONS_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("status", "active")
      .lte("start_at", nowIso)
      .gt("end_at", nowIso),
  ]);

  return {
    savedCount: savedRes.count ?? 0,
    subscriptionCount: subRes.count ?? 0,
  };
}

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getWeekEnd() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}
