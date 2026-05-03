import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const MARKETING_IMAGE_URL =
  "https://assets.lummi.ai/assets/Qma6gVoeYt2hGHzTKM2muQsQEw17L3Tz2pfr1bMg1jA1cU";

function FormShell({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-lg flex-col items-center px-0 sm:px-1"
    >
      <Link
        to="/"
        className="text-center text-sm font-semibold tracking-[-0.01em] text-foreground hover:underline"
      >
        Smart Tuition
      </Link>
      <h1 className="mt-4 text-center text-xl font-medium text-foreground">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-8 w-full">{children}</div>
    </motion.div>
  );
}

function MarketingPanel({ aside }) {
  return (
    <div className="relative hidden h-full min-h-[calc(100vh-56px-2rem)] overflow-hidden lg:block lg:w-full">
      <img
        src={MARKETING_IMAGE_URL}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-background from-[26%] via-background/78 to-transparent dark:from-background dark:via-background/72"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-[calc(100vh-56px-2rem)] flex-col justify-end p-8 lg:p-10">
        {aside}
      </div>
    </div>
  );
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  aside,
  fullPage,
}) {
  if (fullPage && aside) {
    return (
      <div className="min-h-[calc(100vh-56px)] w-full bg-background p-4">
        <div className="grid min-h-[calc(100vh-56px-2rem)] w-full grid-cols-1 gap-0 lg:grid-cols-2 lg:items-stretch">
          <MarketingPanel aside={aside} />

          <div className="flex min-h-[calc(100vh-56px-2rem)] w-full flex-col justify-center overflow-y-auto bg-background px-5 py-10 sm:px-8 lg:min-h-0 lg:h-full lg:px-8 lg:py-8 xl:px-12">
            <FormShell title={title} subtitle={subtitle}>
              {children}
            </FormShell>
          </div>
        </div>
      </div>
    );
  }

  if (fullPage) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-background p-4">
        <FormShell title={title} subtitle={subtitle}>
          {children}
        </FormShell>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid w-full max-w-6xl grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch"
      >
        <div className="relative hidden h-full min-h-[calc(100vh-56px-2rem)] overflow-hidden lg:block lg:w-full">
          <img
            src={MARKETING_IMAGE_URL}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-background from-[26%] via-background/78 to-transparent dark:from-background dark:via-background/72"
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-[calc(100vh-56px-2rem)] flex-col justify-end p-8 lg:p-10">
            {aside ?? (
              <>
                <h3 className="max-w-sm text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground">
                  Teach what you love.
                  <br />
                  Grow your student base.
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Join hundreds of Sri Lankan tutors already using Smart Tuition
                  Finder to fill their calendars and get discovered by motivated
                  students.
                </p>

                <ul className="mt-7 space-y-2.5 text-sm font-medium text-foreground/90">
                  {[
                    "Verified profile with demo videos",
                    "Smart matching with nearby students",
                    "Built-in session scheduling",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center bg-background/95 text-foreground shadow-sm backdrop-blur-sm">
                        <CheckCircle2 size={13} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center py-6 lg:py-10">
          <FormShell title={title} subtitle={subtitle}>
            {children}
          </FormShell>
        </div>
      </motion.div>
    </div>
  );
}
