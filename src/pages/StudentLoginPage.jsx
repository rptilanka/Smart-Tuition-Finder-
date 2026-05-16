import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import AuthLayout from "../components/auth/AuthLayout";
import SupabaseSetupNotice from "../components/auth/SupabaseSetupNotice";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function StudentLoginAside({ t }) {
  return (
    <>
      <h3 className="max-w-sm text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground">
        {t.studentAsideTitle}
      </h3>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t.studentAsideDesc}
      </p>
      <ul className="mt-7 space-y-2.5 text-sm font-medium text-foreground/90">
        {t.studentAsideItems.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center bg-background/95 text-foreground shadow-sm backdrop-blur-sm">
              <CheckCircle2 size={13} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isConfigured } = useAuth();
  const { t } = useLanguage();

  const redirectTo = location.state?.from ?? "/student-dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = t.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t.emailInvalid;
    if (!password) errs.password = t.passwordRequired;
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
      setFormError(prettifyAuthError(error, t));
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout
      fullPage
      aside={<StudentLoginAside t={t} />}
      title={t.studentLoginTitle}
      subtitle={t.studentLoginSubtitle}
    >
      {!isConfigured ? <SupabaseSetupNotice /> : null}

      {location.state?.justRegistered ? (
        <p className="mb-4 rounded-xl glass-btn border border-emerald-300/60 bg-emerald-50/90 px-3 py-2 text-center text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          {t.accountCreated}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="student-login-email">{t.emailAddress}</Label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              id="student-login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.email)}
              className={cn(
                "pl-9",
                fieldErrors.email &&
                  "border-destructive focus-visible:border-destructive",
              )}
            />
          </div>
          {fieldErrors.email ? (
            <p className="text-xs font-medium text-destructive">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="student-login-password">{t.password}</Label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              id="student-login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.password)}
              className={cn(
                "pl-9 pr-10",
                fieldErrors.password &&
                  "border-destructive focus-visible:border-destructive",
              )}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? t.hidePassword : t.showPassword}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {fieldErrors.password ? (
            <p className="text-xs font-medium text-destructive">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {formError ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          disabled={submitting || !isConfigured}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" />
              {t.signingIn}
            </>
          ) : (
            <>
              {t.continueWithEmail}
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 space-y-5 text-center text-sm">
        <button
          type="button"
          className="block w-full text-muted-foreground underline underline-offset-2 transition hover:text-foreground"
        >
          {t.forgotPassword}
        </button>

        <p className="text-muted-foreground">
          {t.noAccount}{" "}
          <Link
            to="/signup"
            className="font-semibold text-slate-950 hover:underline dark:text-white"
          >
            {t.createStudentAccount}
          </Link>
        </p>

        <p className="text-muted-foreground">
          {t.areYouTutor}{" "}
          <Link
            to="/tutor-login"
            className="font-semibold text-foreground hover:underline"
          >
            {t.tutorSignIn}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function prettifyAuthError(error, t) {
  const message = error?.message ?? t.somethingWentWrong;
  if (/invalid login credentials|email not confirmed/i.test(message))
    return t.invalidCredentials;
  if (/rate limit/i.test(message))
    return t.tooManyAttempts;
  return message;
}
