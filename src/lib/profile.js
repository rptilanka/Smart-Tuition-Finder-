import { supabase, TUTOR_PROFILES_TABLE } from "./supabase";
import { TUTOR_ACCOUNT_SELECT_COLUMNS } from "./tutorProfileColumns";
import { sanitizeTutorProfilePatch } from "./tutorProfileNormalize";

export const TUTOR_PROFILE_COLUMNS = TUTOR_ACCOUNT_SELECT_COLUMNS;

const SOCIAL_COLUMNS = [
  "social_facebook_url",
  "social_twitter_url",
  "social_instagram_url",
  "social_whatsapp_url",
];

function isMissingColumnError(error) {
  // PostgreSQL error code 42703 = undefined_column
  return (
    error?.code === "42703" ||
    (typeof error?.message === "string" &&
      (error.message.includes("column") || error.message.includes("does not exist")))
  );
}

export async function updateTutorProfile(userId, patch, fallbacks = {}) {
  if (!supabase)
    return { data: null, error: new Error("Supabase is not configured.") };
  if (!userId) return { data: null, error: new Error("Not signed in.") };

  const sanitized = sanitizeTutorProfilePatch(patch ?? {});
  if (Object.keys(sanitized).length === 0) return { data: null, error: null };

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
  const hasNameInPatch = Object.prototype.hasOwnProperty.call(
    sanitized,
    "name",
  );
  const nameResolved =
    (hasNameInPatch ? sanitized.name : (existing?.name ?? "").trim()) ||
    fbName ||
    (emailResolved ? emailResolved.split("@")[0] : "") ||
    "Tutor";

  if (!emailResolved) {
    return {
      data: null,
      error: new Error("Cannot save profile: missing email. Sign in again."),
    };
  }

  const merged = {
    id: userId,
    email: emailResolved,
    name: nameResolved,
    ...sanitized,
  };

  let { data, error } = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .upsert(merged, { onConflict: "id" })
    .select(TUTOR_ACCOUNT_SELECT_COLUMNS)
    .maybeSingle();

  // If the upsert failed because social link columns don't exist yet in the DB
  // (migration not run), retry without them so the core save always succeeds.
  if (error && isMissingColumnError(error)) {
    const {
      social_facebook_url,
      social_twitter_url,
      social_instagram_url,
      social_whatsapp_url,
      ...mergedCore
    } = merged;
    const coreSelectColumns = TUTOR_ACCOUNT_SELECT_COLUMNS
      .split(",")
      .map((c) => c.trim())
      .filter((c) => !SOCIAL_COLUMNS.includes(c))
      .join(", ");
    const retry = await supabase
      .from(TUTOR_PROFILES_TABLE)
      .upsert(mergedCore, { onConflict: "id" })
      .select(coreSelectColumns)
      .maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    return { data: null, error };
  }

  if (data) {
    return { data, error: null };
  }

  const refetch = await supabase
    .from(TUTOR_PROFILES_TABLE)
    .select(TUTOR_ACCOUNT_SELECT_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  return { data: refetch.data ?? null, error: refetch.error };
}
