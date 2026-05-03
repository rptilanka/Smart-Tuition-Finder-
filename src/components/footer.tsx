import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Product",
    links: [
      { title: "Overview", href: "/" },
      { title: "Features", href: "/#features" },
      { title: "Tutors", href: "/tutors" },
      { title: "Join", href: "/#join" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Student Login", href: "/students-login" },
      { title: "Tutor Login", href: "/tutor-login" },
      { title: "Sign up", href: "/signup" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link className="text-xl font-semibold tracking-[-0.02em] text-white" to="/">
              Smart Tuition Finder
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Find trusted tutors, compare profiles, and connect with the right
              learning support faster.
            </p>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="font-medium text-white">{title}</h6>
              <ul className="mt-6 space-y-4">
                {links.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      className="text-sm text-white/55 transition-colors hover:text-white"
                      to={href}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-2">
            <h6 className="font-medium text-white">Stay up to date</h6>
            <form className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                className="h-10 w-full rounded-full border-white/15 bg-white/10 px-4 text-white placeholder:text-white/40 focus-visible:border-white focus-visible:ring-0 sm:w-64"
                placeholder="Enter your email"
                type="email"
              />
              <Button className="h-10 rounded-full bg-white px-5 text-black hover:bg-white/90" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 py-8 sm:flex-row">
          <span className="text-sm text-white/50">
            &copy; {new Date().getFullYear()}{" "}
            <Link className="hover:text-white" to="/">
              Smart Tuition Finder
            </Link>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-2">
            <Button asChild className="text-white/60 hover:bg-white/10 hover:text-white" size="icon-sm" variant="ghost">
              <a aria-label="Twitter" href="#" rel="noreferrer" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild className="text-white/60 hover:bg-white/10 hover:text-white" size="icon-sm" variant="ghost">
              <a aria-label="Dribbble" href="#" rel="noreferrer" target="_blank">
                <DribbbleIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild className="text-white/60 hover:bg-white/10 hover:text-white" size="icon-sm" variant="ghost">
              <a aria-label="Twitch" href="#" rel="noreferrer" target="_blank">
                <TwitchIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild className="text-white/60 hover:bg-white/10 hover:text-white" size="icon-sm" variant="ghost">
              <a aria-label="GitHub" href="#" rel="noreferrer" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
