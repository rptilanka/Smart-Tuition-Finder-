import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "./theme-provider";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "si", label: "SI" },
  { code: "ta", label: "TA" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-4 right-4 z-[9999] select-none"
      style={
        isDark
          ? {
              background: "rgba(30,30,30,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.40)",
              borderRadius: 9999,
              padding: 4,
            }
          : {
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,1) inset, 0 2px 12px rgba(0,0,0,0.10)",
              borderRadius: 9999,
              padding: 4,
            }
      }
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1"
        aria-label="Change language"
      >
        <Globe size={16} />
        <span className="text-[11px] font-bold">{lang?.toUpperCase()}</span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-32 rounded-md py-1">
          <div
            className={`flex flex-col rounded-md overflow-hidden ${
              isDark ? "bg-black/70 text-white" : "bg-white text-black"
            }`}
          >
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLang(code);
                  setOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm hover:bg-white/10 transition ${
                  lang === code ? "font-bold" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
