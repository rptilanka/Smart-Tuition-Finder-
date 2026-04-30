import { createClient } from "@supabase/supabase-js";

/**
 * Smart Tuition Finder — Supabase browser client.
 *
 * The anon (or new `sb_publishable_*`) key is safe to expose in the
 * browser. All privileged actions are protected by Row Level Security
 * policies defined in `supabase/schema.sql` (e.g. `tutor_accounts`).
 *
 * We read from BOTH `VITE_*` and `NEXT_PUBLIC_*` env names so the same
 * `.env.local` works whether you wire it up with Vite or Next.js
 * conventions. (Vite is configured in `vite.config.js` to also expose
 * the `NEXT_PUBLIC_` prefix.)
 *
 * If the env vars aren't configured, we export `supabase = null` and
 * `isSupabaseConfigured = false`. The Auth context + pages detect this
 * and show a friendly setup message instead of crashing the app.
 */

const env = import.meta.env ?? {};

const url =
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const anonKey =
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Validate shape so the placeholder values shipped in `.env.example`
// are treated as "not configured" until the developer replaces them
// with real Supabase credentials.
const hasValidUrl =
  typeof url === "string" &&
  url.startsWith("https://") &&
  url.includes(".supabase.co") &&
  !url.includes("YOUR-PROJECT-ID");

// Accepts:
//   · classic JWT anon key (long, dot-separated)
//   · new publishable key format `sb_publishable_*`
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
        flowType: "pkce"
      }
    })
  : null;

/** Canonical tutor profile table linked 1:1 with auth.users. */
export const TUTOR_PROFILES_TABLE = "tutor_profiles";

/** Legacy alias kept for compatibility with older code paths. */
export const TUTOR_ACCOUNTS_TABLE = TUTOR_PROFILES_TABLE;

/** Same shape as tutor_accounts; DB trigger uses user_metadata.role = 'student'. */
export const STUDENT_ACCOUNTS_TABLE = "student_accounts";

if (typeof window !== "undefined" && !isSupabaseConfigured) {
  console.warn(
    "[supabase] Not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "(or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local, " +
      "then restart the dev server."
  );
}
