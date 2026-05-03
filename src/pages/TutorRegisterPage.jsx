import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserRound
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import AuthLayout from "../components/auth/AuthLayout";
import SupabaseSetupNotice from "../components/auth/SupabaseSetupNotice";
import { useAuth } from "../context/AuthContext";

export default function TutorRegisterPage({ embedded = false }) {
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = computePasswordStrength(password);

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
    if (!agreeTerms)
      errs.terms = "Please accept the Terms and Privacy Policy.";
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
      password,
      role: "tutor"
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

  const signUpFormInner = (
    <>
      {!isConfigured ? <SupabaseSetupNotice /> : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="tutor-register-name">Full name</Label>
          <div className="relative">
            <UserRound
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="tutor-register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Priya Wickramasinghe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.name)}
              className={cn(
                "pl-9",
                fieldErrors.name &&
                  "border-destructive focus-visible:border-destructive"
              )}
            />
          </div>
          {fieldErrors.name ? (
            <p className="text-xs font-medium text-destructive">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tutor-register-email">Email address</Label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="tutor-register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.email)}
              className={cn(
                "pl-9",
                fieldErrors.email &&
                  "border-destructive focus-visible:border-destructive"
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
          <Label htmlFor="tutor-register-password">Password</Label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="tutor-register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.password)}
              className={cn(
                "pl-9 pr-10",
                fieldErrors.password &&
                  "border-destructive focus-visible:border-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {password ? (
            <PasswordMeter strength={passwordStrength} />
          ) : (
            <p className="text-xs text-muted-foreground">
              Use 8+ characters with letters and numbers.
            </p>
          )}

          {fieldErrors.password ? (
            <p className="text-xs font-medium text-destructive">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tutor-register-confirm">Confirm password</Label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="tutor-register-confirm"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.confirm)}
              className={cn(
                "pl-9 pr-10",
                fieldErrors.confirm &&
                  "border-destructive focus-visible:border-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {fieldErrors.confirm ? (
            <p className="text-xs font-medium text-destructive">
              {fieldErrors.confirm}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Checkbox
              checked={agreeTerms}
              onCheckedChange={(value) => setAgreeTerms(Boolean(value))}
              disabled={submitting}
              className="mt-0.5"
              aria-invalid={Boolean(fieldErrors.terms)}
            />
            <span>
              I agree to the{" "}
              <Link
                to="/"
                className="font-semibold text-slate-950 hover:underline dark:text-white"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/"
                className="font-semibold text-slate-950 hover:underline dark:text-white"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {fieldErrors.terms ? (
            <p className="text-xs font-medium text-destructive">
              {fieldErrors.terms}
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
          className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          disabled={submitting || !isConfigured}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" />
              Creating your account...
            </>
          ) : (
            <>
              Create tutor account
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-3 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/tutor-login"
            className="font-semibold text-slate-950 hover:underline dark:text-white"
          >
            Sign in instead
          </Link>
        </p>
        {!embedded ? (
          <p className="text-muted-foreground">
            Joining as a student?{" "}
            <Link
              to="/signup?role=student"
              className="font-semibold text-foreground hover:underline"
            >
              Student registration
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );

  if (embedded) {
    return <div className="w-full">{signUpFormInner}</div>;
  }

  return (
    <AuthLayout
      title="Create your tutor account"
      subtitle="Set up your profile in a minute and start meeting students today."
    >
      {signUpFormInner}
    </AuthLayout>
  );
}

function PasswordMeter({ strength }) {
  const segments = [0, 1, 2, 3];
  const labels = ["Too weak", "Weak", "Good", "Strong"];
  const colors = [
    "bg-destructive",
    "bg-slate-400",
    "bg-slate-700",
    "bg-slate-950 dark:bg-white"
  ];

  return (
    <div className="space-y-1">
      <div className="flex gap-1.5">
        {segments.map((seg) => (
          <div
            key={seg}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-muted transition-colors",
              seg < strength.score && colors[strength.score - 1]
            )}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium text-muted-foreground">
        {strength.score > 0
          ? `Password strength: ${labels[strength.score - 1]}`
          : "Add at least 8 characters."}
      </p>
    </div>
  );
}

function computePasswordStrength(password) {
  if (!password) return { score: 0 };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return { score: Math.min(score, 4) };
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
