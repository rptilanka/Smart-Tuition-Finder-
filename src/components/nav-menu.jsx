import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/tutors", label: "Tutors" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#join", label: "Join" },
];

export const NavMenu = ({ className, orientation, ...props }) => {
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
                className: cn({ "text-xl": orientation === "vertical" }),
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
