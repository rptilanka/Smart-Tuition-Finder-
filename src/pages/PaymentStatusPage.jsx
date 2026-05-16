import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function PaymentStatusPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isSuccess = location.pathname.endsWith("/success");
  const isStudent = user?.user_metadata?.role === "student";

  return (
    <section className="min-h-[70vh] bg-[#f5f5f7] dark:bg-neutral-950 px-6 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-neutral-800">
          {isSuccess ? (
            <CheckCircle2 className="size-7 text-emerald-600" />
          ) : (
            <AlertTriangle className="size-7 text-amber-600" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isSuccess ? t.paymentSuccessful : t.paymentFailed}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {isSuccess
            ? isStudent
              ? t.subscriptionActivationSoon
              : t.proStatusUpdateSoon
            : t.paymentNotCompleted}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to={isStudent ? "/tutors" : "/tutor-pro"}>
              {isStudent ? t.backToTutorProfiles : t.backToProPlans}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={isStudent ? "/student-dashboard" : "/tutor-dashboard"}>
              {t.goToDashboard}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
