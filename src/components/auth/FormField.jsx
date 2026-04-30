import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Accessible, reusable form field used by both login and register forms.
 * Supports:
 *   · label + optional hint text
 *   · per-field error message
 *   · left-icon slot
 *   · password visibility toggle when type="password"
 */
export default function FormField({
  id,
  name,
  label,
  type = "text",
  icon: Icon,
  error,
  hint,
  value,
  onChange,
  autoComplete,
  placeholder,
  required,
  disabled
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <div
        className={`group relative flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 transition focus-within:bg-white dark:bg-slate-950 dark:focus-within:bg-slate-900 ${
          hasError
            ? "border-rose-400/80 focus-within:ring-2 focus-within:ring-rose-400/40"
            : "border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-950/10 dark:border-white/10 dark:focus-within:ring-white/10"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {Icon ? (
          <Icon
            size={16}
            className={
              hasError
                ? "text-rose-500"
                : "text-slate-400 transition group-focus-within:text-slate-700 dark:group-focus-within:text-slate-200"
            }
          />
        ) : null}
        <input
          id={id}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="w-full bg-transparent py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        ) : null}
      </div>

      {hasError ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs font-semibold text-rose-500"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
