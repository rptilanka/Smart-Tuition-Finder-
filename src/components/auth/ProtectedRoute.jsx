import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
