import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/**
 * Gate for authenticated routes.
 * Wrap routes that require a signed-in tutor:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/tutor-dashboard" element={<TutorDashboardPage />} />
 *   </Route>
 *
 * Behaviour:
 *   · While the initial session is loading, render a spinner (prevents
 *     the dashboard from flashing then redirecting).
 *   · If there is no session, redirect to /tutor-login and remember
 *     the intended destination via `state.from` so we can send the user
 *     back after they sign in.
 *   · If there is a session, render the nested routes.
 */
export default function ProtectedRoute({ redirectTo = "/tutor-login" }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner label="Checking your session..." />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}

export function FullPageSpinner({ label }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
      <Loader2 size={28} className="animate-spin text-teal-500" />
      {label ? <p className="text-sm font-semibold">{label}</p> : null}
    </div>
  );
}
