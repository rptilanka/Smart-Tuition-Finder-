import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/auth/FormField";
import SupabaseSetupNotice from "../components/auth/SupabaseSetupNotice";
import { useAuth } from "../context/AuthContext";

export default function TutorLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isConfigured } = useAuth();

  const redirectTo = location.state?.from ?? "/tutor-dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await signIn({ email, password });
    setSubmitting(false);

    if (error) {
      setFormError(prettifyAuthError(error));
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your tutor dashboard to manage sessions, students, and your profile."
    >
      {!isConfigured ? <SupabaseSetupNotice /> : null}

      {location.state?.justRegistered ? (
        <p className="mb-4 rounded-xl border border-emerald-300/60 bg-emerald-50/90 px-3 py-2 text-center text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          Account created. Sign in with your email and password below.
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="login-email"
          name="email"
          label="Email address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          error={fieldErrors.email}
          required
          disabled={submitting}
        />

        <FormField
          id="login-password"
          name="password"
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
          error={fieldErrors.password}
          required
          disabled={submitting}
        />

        <AnimatePresence>
          {formError ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-xl border border-rose-300/60 bg-rose-50/80 p-3 text-xs font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={!submitting ? { y: -1 } : undefined}
          whileTap={!submitting ? { scale: 0.98 } : undefined}
          disabled={submitting || !isConfigured}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing you in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        New to Smart Tuition Finder?{" "}
        <Link
          to="/signup?role=tutor"
          className="font-semibold text-slate-950 hover:underline dark:text-white"
        >
          Create a tutor account
        </Link>
      </p>

      <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        Looking for a tutor as a student?{" "}
        <Link
          to="/students-login"
          className="font-semibold text-slate-950 hover:underline dark:text-white"
        >
          Student sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function prettifyAuthError(error) {
  const message = error?.message ?? "Something went wrong. Please try again.";
  if (/invalid login credentials|email not confirmed/i.test(message))
    return "Invalid email or password.";
  if (/rate limit/i.test(message))
    return "Too many attempts. Please wait a moment and try again.";
  return message;
}
