import { supabase, TUTOR_PROFILES_TABLE } from "./supabase";
import { TUTOR_ACCOUNT_SELECT_COLUMNS } from "./tutorProfileColumns";
import { sanitizeTutorProfilePatch } from "./tutorProfileNormalize";

export const TUTOR_PROFILE_COLUMNS = TUTOR_ACCOUNT_SELECT_COLUMNS;

/**
 * @param {{ email?: string | null; displayName?: string | null }} [fallbacks]
 *        Used when inserting the first row (no tutor_profiles yet).
 */
export async function updateTutorProfile(userId, patch, fallbacks = {}) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };
  if (!userId)
    return { data: null, error: new Error("Not signed in.") };

  const sanitized = sanitizeTutorProfilePatch(patch ?? {});
  if (Object.keys(sanitized).length === 0)
    return { data: null, error: null };

  const { data: existing, error: readErr } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .select("name,email")
    .eq("id", userId)
    .maybeSingle();

  if (readErr) {
    return { data: null, error: readErr };
  }

  const fbEmail = (fallbacks.email ?? "").trim();
  const fbName = (fallbacks.displayName ?? "").trim();
  const emailResolved = (existing?.email ?? "").trim() || fbEmail;
  const hasNameInPatch = Object.prototype.hasOwnProperty.call(sanitized, "name");
  const nameResolved =
    (hasNameInPatch ? sanitized.name : (existing?.name ?? "").trim()) ||
    fbName ||
    (emailResolved ? emailResolved.split("@")[0] : "") ||
    "Tutor";

  if (!emailResolved) {
    return {
      data: null,
      error: new Error("Cannot save profile: missing email. Sign in again.")
    };
  }

  const merged = {
    id: userId,
    email: emailResolved,
    name: nameResolved,
    ...sanitized
  };

  const { data, error } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .upsert(merged, { onConflict: "id" })
    .select(TUTOR_ACCOUNT_SELECT_COLUMNS)
    .single();

  return { data, error };
}
