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

export const TUTOR_STUDENT_SUBSCRIPTIONS_TABLE = "tutor_student_subscriptions";
export const LIVE_MEETINGS_TABLE = "live_meetings";
export const LIVE_MEETING_PARTICIPANTS_TABLE = "live_meeting_participants";
export const LIVE_MEETING_CHAT_MESSAGES_TABLE = "live_meeting_chat_messages";
export const LIVE_MEETING_WAITING_ROOM_TABLE = "live_meeting_waiting_room";
export const LIVE_MEETING_REACTIONS_TABLE = "live_meeting_reactions";
export const LIVE_MEETING_POLLS_TABLE = "live_meeting_polls";
export const LIVE_MEETING_POLL_VOTES_TABLE = "live_meeting_poll_votes";
export const LIVE_MEETING_QUESTIONS_TABLE = "live_meeting_questions";
export const LIVE_MEETING_AUDIT_LOGS_TABLE = "live_meeting_audit_logs";
export const LIVE_MEETING_REMINDERS_TABLE = "live_meeting_reminders";

if (typeof window !== "undefined" && !isSupabaseConfigured) {
  console.warn(
    "[supabase] Not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "(or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local, " +
      "then restart the dev server.",
  );
}
