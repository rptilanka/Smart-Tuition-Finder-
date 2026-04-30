import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageSpinner } from "./ProtectedRoute";

/**
 * Inverse of ProtectedRoute: renders login/register pages only when the
 * user is *not* signed in. If they are already authenticated, send them
 * to the right home (student vs tutor) unless `redirectTo` overrides.
 */
export default function PublicOnlyRoute({ redirectTo }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (isAuthenticated) {
    const fallback =
      user?.user_metadata?.role === "student"
        ? "/student-dashboard"
        : "/tutor-dashboard";
    return <Navigate to={redirectTo ?? fallback} replace />;
  }
  return <Outlet />;
}
