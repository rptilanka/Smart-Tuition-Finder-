import { supabase, TUTOR_PROFILES_TABLE } from "./supabase";
import { TUTOR_ACCOUNT_SELECT_COLUMNS } from "./tutorProfileColumns";
import { subjectsGradesFromDb } from "./tutorProfileNormalize";
import { withTutorProDecorations } from "./tutorProStatus";

const ACCENTS = [
  "linear-gradient(135deg,#14b8a6,#0ea5e9)",
  "linear-gradient(135deg,#22c55e,#14b8a6)",
  "linear-gradient(135deg,#f97316,#f43f5e)",
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#d97706,#b45309)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
];

function initialsFor(name) {
  if (!name) return "T";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T"
  );
}

function accentForId(id) {
  if (!id) return ACCENTS[0];
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return ACCENTS[Math.abs(h) % ACCENTS.length];
}

function subjectLabelFromRow(row) {
  const line = (row.profile_subject ?? "").trim();
  if (line) return line;
  const subjects = subjectsGradesFromDb(row.subjects_grades);
  const first = subjects[0];
  if (!first?.subject) return "Tutor";
  const grades = Array.isArray(first.grades)
    ? first.grades.filter(Boolean)
    : [];
  if (!grades.length) return first.subject;
  return `${first.subject} · ${grades.slice(0, 2).join(", ")}`;
}

function descriptionFromRow(row) {
  const bio = typeof row.bio === "string" ? row.bio.trim() : "";
  if (bio) return bio.length > 200 ? `${bio.slice(0, 197)}…` : bio;
  const q =
    typeof row.qualifications_experience === "string"
      ? row.qualifications_experience.trim()
      : "";
  if (q) return q.length > 200 ? `${q.slice(0, 197)}…` : q;
  return "View profile for subjects, rates, and availability.";
}

export function mapTutorProfileRowToDirectoryTutor(row) {
  if (!row) return null;
  const mapped = {
    id: row.id,
    name: row.name,
    initials: initialsFor(row.name),
    avatar_url: row.avatar_url ?? null,
    subject: subjectLabelFromRow(row),
    rating: null,
    description: descriptionFromRow(row),
    location: (row.profile_location ?? "").trim(),
    accent: accentForId(row.id),
    profileUrl: `/tutor/${row.id}`,
    hourlyRate: row.hourly_rate ?? null,
    reviewsCount: row.reviews_count ?? null,
    profile_boost: row.profile_boost ?? null,
    verified_marks: row.verified_marks ?? null,
    is_verified_blue_mark: row.is_verified_blue_mark ?? null,
    source: "supabase",
  };
  return withTutorProDecorations(mapped);
}

export async function fetchTutorDirectoryFromSupabase() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .select(TUTOR_ACCOUNT_SELECT_COLUMNS)
    .order("updated_at", { ascending: false });
  if (error) {
    console.warn(
      "[tutorDirectory] Failed to load tutor_profiles:",
      error.message,
    );
    return [];
  }
  return (data ?? [])
    .map((row) => mapTutorProfileRowToDirectoryTutor(row))
    .filter(Boolean);
}
