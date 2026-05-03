import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { FullPageSpinner } from "../components/auth/ProtectedRoute";
import TutorProfilePage from "./TutorProfilePage";

export default function TutorOwnProfilePage() {
  const { user, profile, profileLoading, isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50/80 p-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <h1 className="text-lg font-bold">Supabase isn&apos;t configured</h1>
          <p className="mt-2 text-sm">
            Add your Supabase URL and key to <code>.env.local</code> and restart
            the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (user?.user_metadata?.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }

  if (profileLoading && !profile) {
    return <FullPageSpinner label="Loading your profile..." />;
  }

  const tutorId = profile?.id ?? user?.id;
  if (!tutorId) {
    return <Navigate to="/tutor-profile/edit" replace />;
  }

  return <TutorProfilePage tutorId={tutorId} />;
}
