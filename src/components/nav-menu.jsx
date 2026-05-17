import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { buildSecureJoinLink, listTutorMeetings } from "../lib/liveMeetings";

export const NavMenu = ({ className, orientation, ...props }) => {
  const { t } = useLanguage();

  const { user, isAuthenticated } = useAuth();
  const isTutor = (user?.user_metadata?.role ?? "") !== "student";
  const [latestActiveMeeting, setLatestActiveMeeting] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadLatest() {
      if (!isAuthenticated || !isTutor || !user?.id) {
        if (mounted) setLatestActiveMeeting(null);
        return;
      }
      try {
        const rows = await listTutorMeetings(user.id);
        const active = (rows ?? []).filter(
          (m) => m && m.status !== "ended" && m.status !== "cancelled",
        );
        const live = active.find((m) => m.status === "live") ?? null;
        const next = live ?? active[0] ?? null;
        if (mounted) setLatestActiveMeeting(next);
      } catch {
        if (mounted) setLatestActiveMeeting(null);
      }
    }
    loadLatest();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isTutor, user?.id]);

  const joinHref = useMemo(() => {
    if (!latestActiveMeeting) return "/#join";
    return buildSecureJoinLink(latestActiveMeeting) || "/#join";
  }, [latestActiveMeeting]);

  const links = [
    { href: "/", label: t.navHome },
    { href: "/#features", label: t.navFeatures },
    { href: "/tutors", label: t.navTutors },
    { href: "/#reviews", label: t.navReviews },
    { href: joinHref, label: t.navJoin },
  ];

  return (
    <NavigationMenu className={className} orientation={orientation} {...props}>
      <NavigationMenuList
        className={cn({
          "flex-col items-start gap-4": orientation === "vertical",
        })}
      >
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle({
                className: cn("text-base font-medium", { "text-xl": orientation === "vertical" }),
              })}
            >
              <Link to={link.href}>{link.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
