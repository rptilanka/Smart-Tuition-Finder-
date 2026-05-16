import { ArrowUpRight, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "./theme-provider";
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
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
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
        style={isDark ? {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: 'none',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)',
        } : {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)',
          backdropFilter: 'blur(40px) saturate(200%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.05)',
          border: 'none',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.80), 0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            className="text-xl font-bold tracking-[-0.02em] text-slate-900/90 drop-shadow-sm dark:text-white/90"
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-950 text-[11px] font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-neutral-950"
                  title={displayName}
                >
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
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:text-red-500"
                  style={isDark ? {
                    background: 'rgba(255,255,255,0.07)',
                  } : {
                    background: 'rgba(255,255,255,0.50)',
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <Button
                asChild
                className="h-9 rounded-full px-4 text-sm font-semibold text-slate-900 transition dark:text-white"
                style={isDark ? {
                  background: 'rgba(255,255,255,0.08)',
                } : {
                  background: 'rgba(255,255,255,0.55)',
                  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.75)',
                }}
              >
                <Link to="/signup">
                  Sign up <ArrowUpRight />
                </Link>
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition"
            style={isDark ? {
              background: 'rgba(255,255,255,0.07)',
            } : {
              background: 'rgba(255,255,255,0.50)',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.70)',
            }}
          >
            {isDark
              ? <Sun className="h-[1.1rem] w-[1.1rem] text-white" />
              : <Moon className="h-[1.1rem] w-[1.1rem] text-slate-700" />
            }
          </button>

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
