import { supabase } from "./supabase";

const TABLE = "student_saved_tutors";

export async function saveTutor(studentId, tutorId) {
  if (!supabase || !studentId || !tutorId) return;
  await supabase.from(TABLE).upsert({ student_id: studentId, tutor_id: tutorId }, { onConflict: "student_id,tutor_id" });
}

export async function unsaveTutor(studentId, tutorId) {
  if (!supabase || !studentId || !tutorId) return;
  await supabase.from(TABLE).delete().eq("student_id", studentId).eq("tutor_id", tutorId);
}

export async function isTutorSaved(studentId, tutorId) {
  if (!supabase || !studentId || !tutorId) return false;
  const { data } = await supabase.from(TABLE).select("id").eq("student_id", studentId).eq("tutor_id", tutorId).maybeSingle();
  return Boolean(data);
}

export async function getSavedTutors(studentId) {
  if (!supabase || !studentId) return [];
  const { data: saved } = await supabase
    .from(TABLE)
    .select("tutor_id, created_at")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (!saved?.length) return [];

  const ids = saved.map((r) => r.tutor_id);
  const { data: profiles } = await supabase
    .from("tutor_profiles")
    .select("id, name, slug, subjects")
    .in("id", ids);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  return saved.map((row) => {
    const p = profileMap[row.tutor_id];
    return {
      tutor_id: row.tutor_id,
      created_at: row.created_at,
      name: p?.name ?? null,
      slug: p?.slug ?? null,
      subjects: p?.subjects ?? [],
    };
  });
}

export async function getSavedTutorCount(studentId) {
  if (!supabase || !studentId) return 0;
  const { count } = await supabase.from(TABLE).select("id", { count: "exact", head: true }).eq("student_id", studentId);
  return count ?? 0;
}
