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
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex items-center rounded-full overflow-hidden select-none"
      style={
        isDark
          ? {
              background: "rgba(30,30,30,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.40)",
            }
          : {
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,1) inset, 0 2px 12px rgba(0,0,0,0.10)",
            }
      }
    >
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`h-8 px-3 text-[11px] font-bold tracking-wide transition-colors cursor-pointer ${
            lang === code
              ? isDark
                ? "bg-white/25 text-white"
                : "bg-slate-900 text-white"
              : isDark
                ? "text-white/50 hover:text-white/85"
                : "text-slate-400 hover:text-slate-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
