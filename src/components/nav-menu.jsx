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

export const NavMenu = ({ className, orientation, ...props }) => {
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t.navHome },
    { href: "/#features", label: t.navFeatures },
    { href: "/tutors", label: t.navTutors },
    { href: "/#reviews", label: t.navReviews },
    { href: "/#join", label: t.navJoin },
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
