import { supabase, STUDENT_ACCOUNTS_TABLE } from "./supabase";

const PROFILE_COLUMNS =
  "id, name, email, avatar_url, bio, created_at, updated_at";

const ALLOWED_FIELDS = new Set(["name", "bio", "avatar_url"]);

export async function updateStudentProfile(userId, patch) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };
  if (!userId) return { data: null, error: new Error("Not signed in.") };

  const payload = {};
  for (const [k, v] of Object.entries(patch ?? {})) {
    if (!ALLOWED_FIELDS.has(k)) continue;
    if (v === undefined) continue;
    payload[k] = typeof v === "string" ? v : v;
  }
  if (Object.keys(payload).length === 0) return { data: null, error: null };

  const { data, error } = await supabase
    .from(STUDENT_ACCOUNTS_TABLE)
    .update(payload)
    .eq("id", userId)
    .select(PROFILE_COLUMNS)
    .single();

  return { data, error };
}
