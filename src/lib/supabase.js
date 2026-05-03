import { createClient } from "@supabase/supabase-js";

const env = import.meta.env ?? {};

const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "";

const anonKey =
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";

const hasValidUrl =
  typeof url === "string" &&
  url.startsWith("https://") &&
  url.includes(".supabase.co") &&
  !url.includes("YOUR-PROJECT-ID");

const hasValidAnonKey =
  typeof anonKey === "string" &&
  anonKey.length > 20 &&
  anonKey !== "your-anon-public-key-here" &&
  (anonKey.startsWith("sb_publishable_") ||
    anonKey.startsWith("eyJ") ||
    anonKey.length > 40);

export const isSupabaseConfigured = hasValidUrl && hasValidAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "stf-auth",
        flowType: "pkce",
      },
    })
  : null;

export const TUTOR_PROFILES_TABLE =
  env.VITE_SUPABASE_TUTOR_PROFILES_TABLE ||
  env.VITE_SUPABASE_TUTOR_ACCOUNT_TABLE ||
  env.NEXT_PUBLIC_SUPABASE_TUTOR_PROFILES_TABLE ||
  "tutor_accounts";

export const TUTOR_ACCOUNTS_TABLE = TUTOR_PROFILES_TABLE;

export const STUDENT_ACCOUNTS_TABLE = "student_accounts";

if (typeof window !== "undefined" && !isSupabaseConfigured) {
  console.warn(
    "[supabase] Not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "(or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local, " +
      "then restart the dev server.",
  );
}
