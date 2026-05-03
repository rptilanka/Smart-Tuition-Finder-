import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "../context/AuthContext";
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
    <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75 md:px-6">
      <nav className="mx-auto flex h-14 max-w-screen-xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link className="text-sm font-semibold tracking-[-0.01em] text-slate-950 dark:text-white" to="/">
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
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out"
                aria-label="Sign out"
                className="flex max-w-[min(52vw,240px)] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-2 text-left transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:hover:bg-slate-800 sm:max-w-[280px] sm:pr-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-950">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
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
                <LogOut className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
              </button>
            ) : (
              <Button asChild className="h-9 rounded-full bg-slate-950 px-4 text-sm text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
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
