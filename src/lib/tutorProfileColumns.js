/**
 * Supabase `select()` column lists for account tables.
 * Tutor rows include extended marketing/teaching fields; student rows stay minimal.
 */

export const TUTOR_ACCOUNT_SELECT_COLUMNS =
  "id, name, email, avatar_url, bio, qualifications_experience, subjects_grades, demo_videos, availability_booking, whatsapp_number, profile_subject, profile_location, years_experience, hourly_rate, reviews_count, created_at, updated_at";

export const STUDENT_ACCOUNT_SELECT_COLUMNS =
  "id, name, email, avatar_url, bio, created_at, updated_at";
