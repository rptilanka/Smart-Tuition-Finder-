import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserRound
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import SupabaseSetupNotice from "../components/auth/SupabaseSetupNotice";
import { useAuth } from "../context/AuthContext";

const benefits = [
  "Discover verified tutors across Sri Lanka",
  "Filter by subject, grade, location and budget",
  "Save favourite tutors and message them instantly",
  "Track your learning journey from one dashboard"
];

export default function StudentRegisterPage({ embedded = false }) {
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
      role: "student"
    });
    setSubmitting(false);

    if (error) {
      setFormError(prettifyAuthError(error));
      return;
    }

    if (data?.session) {
      navigate("/student-dashboard", { replace: true });
      return;
    }

    navigate("/students-login", {
      replace: true,
      state: { justRegistered: true }
    });
  };

  const signUpFormInner = (
    <>
              {!isConfigured ? <SupabaseSetupNotice /> : null}

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="student-register-name">Full name</Label>
                  <div className="relative">
                    <UserRound
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="student-register-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Nethmi Wijesinghe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                      aria-invalid={Boolean(fieldErrors.name)}
                      className={cn(
                        "pl-9",
                        fieldErrors.name &&
                          "border-destructive focus-visible:ring-destructive/40"
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
                  <Label htmlFor="student-register-email">Email address</Label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="student-register-email"
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
                          "border-destructive focus-visible:ring-destructive/40"
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
                  <Label htmlFor="student-register-password">Password</Label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="student-register-password"
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
                          "border-destructive focus-visible:ring-destructive/40"
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
                  <Label htmlFor="student-register-confirm">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="student-register-confirm"
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
                          "border-destructive focus-visible:ring-destructive/40"
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
                      Create student account
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
                    to="/students-login"
                    className="font-semibold text-slate-950 hover:underline dark:text-white"
                  >
                    Sign in instead
                  </Link>
                </p>
                {!embedded ? (
                  <p className="text-muted-foreground">
                    Teaching on the platform?{" "}
                    <Link
                      to="/signup?role=tutor"
                      className="font-semibold text-foreground hover:underline"
                    >
                      Tutor registration
                    </Link>
                  </p>
                ) : null}
              </div>
    </>
  );

  const signUpCard = (
    <Card className="w-full max-w-md rounded-[2.5rem] border-0 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
      <CardHeader className="px-6 pt-6">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <UserRound size={12} />
          Student sign up
        </div>
        <CardTitle className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 md:text-4xl dark:text-white">
          Create your account
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
          Join in under a minute and start finding tutors that fit your goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">{signUpFormInner}</CardContent>
    </Card>
  );

  if (embedded) {
    return <div className="w-full">{signUpFormInner}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#f5f5f7] dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <aside className="hidden flex-col justify-between lg:flex">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-white/10">
                <GraduationCap size={16} />
              </span>
              Smart Tuition Finder
            </Link>

            <h2 className="mt-10 max-w-md text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-slate-950 dark:text-white">
              Find your perfect tutor in minutes.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-500 dark:text-slate-400">
              Create a free student account to browse, save and connect with the
              best tutors near you — all from a single, modern dashboard.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-white/10">
                    <CheckCircle2 size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <ShieldCheck size={16} />
              Trusted by 1,000+ Sri Lankan students
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your information is encrypted and never shared. You control which
              tutors see your details.
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-center">{signUpCard}</div>
      </div>
    </div>
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
