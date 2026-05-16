import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "../context/AuthContext";
import { supabaseStorageImageProps } from "../lib/storage";
import { NavMenu } from "./nav-menu.jsx";

function initialsFor(name) {
  if (!name) return "?";
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}

const Navbar = () => {
  const { user, profile, isAuthenticated, loading, signOut } = useAuth();
  const displayName =
    (profile?.name ?? "").trim() ||
    (user?.user_metadata?.name ?? "").trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Account";
  const email = (user?.email ?? "").trim();
  const avatarUrl = profile?.avatar_url ?? null;

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-[999] flex justify-center px-5 pointer-events-none">
      <nav
        className="pointer-events-auto flex h-[4.5rem] w-full max-w-screen-xl items-center justify-between rounded-full px-8 md:px-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.18) 100%)',
          backdropFilter: 'blur(40px) saturate(200%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.05)',
          border: '1.5px solid rgba(255,255,255,0.55)',
          boxShadow: `
            inset 0 2px 0 rgba(255,255,255,0.70),
            inset 0 -1px 0 rgba(255,255,255,0.20),
            0 12px 40px rgba(0,0,0,0.13),
            0 2px 8px rgba(0,0,0,0.06)
          `,
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            className="text-base font-bold tracking-[-0.02em] text-slate-900/90 drop-shadow-sm dark:text-white/90"
            to="/"
          >
            Smart Tuition
          </Link>
        </div>

        <div className="hidden md:flex">
          <NavMenu />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {loading ? (
              <div
                className="h-9 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
                aria-hidden
              />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to={user?.user_metadata?.role === "tutor" ? "/tutor-dashboard" : "/student-dashboard"}
                  className="flex max-w-[min(44vw,220px)] items-center gap-2 rounded-full py-1 pl-1 pr-3 text-left transition sm:max-w-[260px]"
                  style={{
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.40)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
                  }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-950">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        {...supabaseStorageImageProps(avatarUrl)}
                      />
                    ) : (
                      initialsFor(displayName)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-tight text-slate-950 dark:text-white">
                      {displayName}
                    </span>
                    {email ? (
                      <span className="block truncate text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                        {email}
                      </span>
                    ) : null}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:text-red-500"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.38)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <Button
                asChild
                className="h-9 rounded-full px-4 text-sm font-semibold text-slate-900 transition dark:text-white"
                style={{
                  background: 'rgba(255,255,255,0.30)',
                  border: '1px solid rgba(255,255,255,0.50)',
                  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.60), 0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Link to="/signup">
                  Sign up <ArrowUpRight />
                </Link>
              </Button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild className="group md:hidden">
              <Button size="icon" variant="ghost">
                <Menu className="group-data-[state=open]:hidden" />
                <X className="hidden group-data-[state=open]:block" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="h-[calc(100svh-4rem)] w-screen rounded-none border-none bg-background p-6"
              sideOffset={14}
            >
              <NavMenu orientation="vertical" />
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </div>
  );

};

export default Navbar;
