import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NavMenu } from "./nav-menu.jsx";

const Navbar = () => {
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
            <Button asChild className="h-9 rounded-full bg-slate-950 px-4 text-sm text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              <Link to="/signup">
                Sign up <ArrowUpRight />
              </Link>
            </Button>
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
