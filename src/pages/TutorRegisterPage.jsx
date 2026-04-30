import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, Lock, Mail, UserRound } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/auth/FormField";
import SupabaseSetupNotice from "../components/auth/SupabaseSetupNotice";
import { useAuth } from "../context/AuthContext";

export default function TutorRegisterPage({ embedded = false }) {
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name || name.trim().length < 2)
      errs.name = "Please enter your full name.";
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 8)
      errs.password = "Use at least 8 characters.";
    if (!confirm) errs.confirm = "Please confirm your password.";
    else if (confirm !== password)
      errs.confirm = "Passwords don't match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    const { error, data } = await signUp({
      name,
      email,
      password
    });
    setSubmitting(false);

    if (error) {
      setFormError(prettifyAuthError(error));
      return;
    }

    if (data?.session) {
      navigate("/tutor-dashboard", { replace: true });
      return;
    }

    navigate("/tutor-login", {
      replace: true,
      state: { justRegistered: true }
    });
  };

  const formBlock = (
    <>
      {!isConfigured ? <SupabaseSetupNotice /> : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="register-name"
          name="name"
          label="Full name"
          type="text"
          icon={UserRound}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="e.g. Priya Wickramasinghe"
          error={fieldErrors.name}
          required
          disabled={submitting}
        />

        <FormField
          id="register-email"
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
          id="register-password"
          name="password"
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use 8+ characters with a mix of letters and numbers."
          error={fieldErrors.password}
          required
          disabled={submitting}
        />

        <FormField
          id="register-confirm"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          icon={Lock}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={fieldErrors.confirm}
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
              Creating your account...
            </>
          ) : (
            "Create tutor account"
          )}
        </motion.button>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link
          to="/tutor-login"
          className="font-semibold text-slate-950 hover:underline dark:text-white"
        >
          Sign in instead
        </Link>
      </p>

      {!embedded ? (
        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          Joining as a student?{" "}
          <Link
            to="/signup?role=student"
            className="font-semibold text-slate-950 hover:underline dark:text-white"
          >
            Student registration
          </Link>
        </p>
      ) : null}
    </>
  );

  if (embedded) {
    return <div className="w-full">{formBlock}</div>;
  }

  return (
    <AuthLayout
      title="Create your tutor account"
      subtitle="Set up your profile in a minute and start meeting students today."
    >
      {formBlock}
    </AuthLayout>
  );
}

function prettifyAuthError(error) {
  const message =
    error?.message ?? "Something went wrong creating your account.";
  if (/already registered/i.test(message) || /already exists/i.test(message))
    return "An account with this email already exists. Try signing in instead.";
  if (/password.*short|password.*weak/i.test(message))
    return "That password is too weak. Try a longer mix of letters and numbers.";
  if (/rate limit/i.test(message))
    return "Too many attempts. Please wait a moment and try again.";
  return message;
}
