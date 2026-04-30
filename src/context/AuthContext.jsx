import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  isSupabaseConfigured,
  supabase,
  STUDENT_ACCOUNTS_TABLE,
  TUTOR_PROFILES_TABLE
} from "../lib/supabase";
import {
  STUDENT_ACCOUNT_SELECT_COLUMNS,
  TUTOR_ACCOUNT_SELECT_COLUMNS
} from "../lib/tutorProfileColumns";

/**
 * AuthContext
 * -----------
 * Wraps Supabase auth in a React context so every page/component can
 * read the current session, user, and tutor profile without prop drilling.
 *
 * Responsibilities:
 *   · Hydrate from the persisted Supabase session on first render.
 *   · Subscribe to `onAuthStateChange` so logins/logouts in another tab
 *     propagate to this tab.
 *   · Load `tutor_profiles` or `student_accounts` (via RLS) from `user_metadata.role`.
 *   · Expose `signUp`, `signIn`, `signOut`, `refreshProfile` helpers.
 *   · Surface a stable `{ data, error }` shape from every action so UI
 *     code stays predictable.
 */

const AuthContext = createContext(null);

/**
 * Choose tutor_profiles vs student_accounts.
 * Uses JWT `user_metadata.role` when set; otherwise detects an existing student row
 * (older signups may lack `role` on the token but still have a student_accounts row).
 */
async function resolveProfileTable(userId, roleHint) {
  if (!supabase || !userId) return TUTOR_PROFILES_TABLE;
  const normalized =
    typeof roleHint === "string" ? roleHint.toLowerCase().trim() : "";
  if (normalized === "student") return STUDENT_ACCOUNTS_TABLE;
  if (normalized === "tutor") return TUTOR_PROFILES_TABLE;

  const { data: studentRow, error } = await supabase
    .from(STUDENT_ACCOUNTS_TABLE)
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (!error && studentRow) return STUDENT_ACCOUNTS_TABLE;

  return TUTOR_PROFILES_TABLE;
}

/** Upsert a row into tutor_profiles or student_accounts (requires session for RLS). */
async function upsertAccountProfile(userId, table, name, email) {
  if (!supabase || !userId) return null;
  const { error } = await supabase.from(table).upsert(
    {
      id: userId,
      name: name?.trim() || email?.split("@")[0] || "User",
      email: email?.trim() ?? ""
    },
    { onConflict: "id" }
  );
  if (error) {
    console.warn(
      `[auth] Could not upsert ${table} for user ${userId}:`,
      error.message
    );
  }
  return error;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /** Cache key so we reload when e.g. role appears in JWT after refresh. */
  const lastProfileKey = useRef(null);

  const user = session?.user ?? null;

  // ---------------------------------------------------------------
  // Initial hydration + subscription
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
      })
      .catch((err) => {
        console.error("Failed to load Supabase session", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) return;
        setSession(nextSession ?? null);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------------
  // Profile loader — runs whenever the user id changes
  // ---------------------------------------------------------------
  const loadProfile = useCallback(async (userId, role, hints = {}) => {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }
    const table = await resolveProfileTable(userId, role);
    const selectColumns =
      table === TUTOR_PROFILES_TABLE
        ? TUTOR_ACCOUNT_SELECT_COLUMNS
        : STUDENT_ACCOUNT_SELECT_COLUMNS;
    setProfileLoading(true);
    try {
      let { data, error } = await supabase
        .from(table)
        .select(selectColumns)
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error(`Failed to load profile from ${table}`, error);
        setProfile(null);
        return null;
      }

      if (
        !data &&
        table === TUTOR_PROFILES_TABLE &&
        typeof hints.email === "string" &&
        hints.email.trim()
      ) {
        const email = hints.email.trim();
        const displayName = (hints.displayName ?? "").trim();
        const seedName =
          displayName || email.split("@")[0] || "Tutor";
        await supabase.from(TUTOR_PROFILES_TABLE).upsert(
          { id: userId, name: seedName, email },
          { onConflict: "id" }
        );
        const second = await supabase
          .from(table)
          .select(selectColumns)
          .eq("id", userId)
          .maybeSingle();
        data = second.data;
        error = second.error;
        if (error) {
          console.error(`Failed to reload tutor_profiles`, error);
        }
      }

      setProfile(data ?? null);
      return data ?? null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = user?.id ?? null;
    const role = user?.user_metadata?.role ?? null;
    const email = user?.email ?? "";
    const key = userId ? `${userId}:${role ?? ""}:${email}` : null;
    if (key === lastProfileKey.current) return;
    lastProfileKey.current = key;
    if (!userId) {
      lastProfileKey.current = null;
      setProfile(null);
      return;
    }
    loadProfile(userId, role, {
      email,
      displayName: user?.user_metadata?.name ?? ""
    });
  }, [user?.id, user?.email, user?.user_metadata?.role, user?.user_metadata?.name, loadProfile]);

  // ---------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------

  const signUp = useCallback(async ({ name, email, password, role }) => {
    if (!supabase) return configError();

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const isStudent = role === "student";
    const profileTable = isStudent ? STUDENT_ACCOUNTS_TABLE : TUTOR_PROFILES_TABLE;
    const redirectPath = isStudent ? "/students-login" : "/tutor-login";

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: trimmedName,
          role: isStudent ? "student" : "tutor"
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}${redirectPath}`
            : undefined
      }
    });

    if (error) return { data: null, error };

    // With a session, RLS allows upsert; without a session (e.g. email
    // confirmation still enabled in the project), the DB trigger still inserts.
    if (data.user?.id && data.session) {
      const canonicalEmail = (data.user.email ?? trimmedEmail).trim();
      await upsertAccountProfile(
        data.user.id,
        profileTable,
        trimmedName,
        canonicalEmail
      );
    }

    // When Supabase returns a session immediately, refresh local session state
    // so ProtectedRoute + profile loaders see the user on the next navigation.
    if (data.session) {
      await supabase.auth.getSession();
    }

    return { data, error: null };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabase) return configError();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email?.trim().toLowerCase(),
      password
    });

    if (error) return { data: null, error };

    // Ensure profile row exists in Supabase (trigger + client upsert).
    if (data.user) {
      const profileTable = await resolveProfileTable(
        data.user.id,
        data.user.user_metadata?.role
      );
      const isStudent = profileTable === STUDENT_ACCOUNTS_TABLE;
      const defaultName = isStudent ? "Student" : "Tutor";
      const displayName =
        data.user.user_metadata?.name ??
        data.user.email?.split("@")[0] ??
        defaultName;
      await upsertAccountProfile(
        data.user.id,
        profileTable,
        displayName,
        (data.user.email ?? "").trim()
      );
    }

    return { data, error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return configError();
    const { error } = await supabase.auth.signOut();
    if (error) return { data: null, error };
    setSession(null);
    setProfile(null);
    return { data: true, error: null };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return null;
    return loadProfile(user.id, user.user_metadata?.role ?? null, {
      email: user.email ?? "",
      displayName: user.user_metadata?.name ?? ""
    });
  }, [user?.id, user?.email, user?.user_metadata?.role, user?.user_metadata?.name, loadProfile]);

  // ---------------------------------------------------------------
  // Context value (memoised)
  // ---------------------------------------------------------------
  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isAuthenticated: Boolean(user),
      loading,
      profileLoading,
      isConfigured: isSupabaseConfigured,
      signUp,
      signIn,
      signOut,
      refreshProfile
    }),
    [
      session,
      user,
      profile,
      loading,
      profileLoading,
      signUp,
      signIn,
      signOut,
      refreshProfile
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

function configError() {
  return {
    data: null,
    error: {
      name: "SupabaseNotConfigured",
      message:
        "Supabase isn't configured yet. Copy .env.example to .env.local and set your Supabase URL + anon key."
    }
  };
}
