import { supabase, TUTOR_PROFILES_TABLE } from "./supabase";
import { TUTOR_ACCOUNT_SELECT_COLUMNS } from "./tutorProfileColumns";
import { withTutorProDecorations } from "./tutorProStatus";

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

export function mapTutorRowToProfileModel(row) {
  if (!row) return null;
  const mapped = {
    id: row.id,
    name: row.name,
    initials: initialsFor(row.name),
    subject: row.profile_subject ?? "",
    rating: 0,
    location: row.profile_location ?? "",
    accent: "linear-gradient(135deg,#14b8a6,#0ea5e9)",
    profileUrl: `/tutor/${row.id}`,
    yearsExperience: row.years_experience ?? null,
    hourlyRate: row.hourly_rate ?? null,
    reviewsCount: row.reviews_count ?? null,
    avatar_url: row.avatar_url ?? null,
    bio: row.bio ?? "",
    qualifications_experience: row.qualifications_experience ?? "",
    subjects_grades: row.subjects_grades ?? [],
    demo_videos: row.demo_videos ?? [],
    availability_booking: row.availability_booking ?? "",
    whatsapp_number: row.whatsapp_number ?? "",
    reviews: [],
    availability: []
  };
  return withTutorProDecorations(mapped);
}

export async function getTutorProfileByIdFromSupabase(id) {
  if (!supabase || !id) return null;
  const { data, error } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .select(TUTOR_ACCOUNT_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapTutorRowToProfileModel(data);
}
