import { supabase } from "./supabase";

const TABLE = "tutor_reviews";

export async function submitReview({ tutorId, studentId, rating, body, reviewerName }) {
  if (!supabase || !tutorId || !studentId) throw new Error("Missing required fields.");
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      { tutor_id: tutorId, student_id: studentId, rating, body: body || null, reviewer_name: reviewerName || null, updated_at: new Date().toISOString() },
      { onConflict: "tutor_id,student_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTutorReviews(tutorId) {
  if (!supabase || !tutorId) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, rating, body, reviewer_name, created_at, updated_at")
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getStudentReviewForTutor(studentId, tutorId) {
  if (!supabase || !studentId || !tutorId) return null;
  const { data } = await supabase
    .from(TABLE)
    .select("id, rating, body")
    .eq("student_id", studentId)
    .eq("tutor_id", tutorId)
    .maybeSingle();
  return data ?? null;
}

export async function getAllReviews({ limit = 100 } = {}) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, rating, body, reviewer_name, created_at, tutor_id, tutor_profiles(name, profile_subject, subjects_grades)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    reviewerName: r.reviewer_name || "Anonymous",
    createdAt: r.created_at,
    tutorId: r.tutor_id,
    tutorName: r.tutor_profiles?.name ?? "Tutor",
    tutorSubject: r.tutor_profiles?.profile_subject || "Tutor",
  }));
}

export async function getTutorRatingStats(tutorId) {
  if (!supabase || !tutorId) return { average: null, count: 0 };
  const { data } = await supabase
    .from(TABLE)
    .select("rating")
    .eq("tutor_id", tutorId);
  const rows = data ?? [];
  if (!rows.length) return { average: null, count: 0 };
  const avg = rows.reduce((s, r) => s + r.rating, 0) / rows.length;
  return { average: Math.round(avg * 10) / 10, count: rows.length };
}
