import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
  disabled,
  variant = "default",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  const hasError = Boolean(error);
  const isBlocks = variant === "blocks";

  if (isBlocks) {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white"
        >
          {label}
        </label>
        <div
          className={cn(
            "flex items-center rounded-lg border border-gray-200 bg-white transition-colors focus-within:border-black dark:border-white/15 dark:bg-neutral-950 dark:focus-within:border-white",
            hasError &&
              "border-red-500 focus-within:border-red-500 dark:border-red-500",
            disabled && "opacity-60",
          )}
        >
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
            aria-describedby={
              hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            className="min-h-[52px] w-full flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-950 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : null}
        </div>

        {hasError ? (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-xs font-semibold text-destructive"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <div
        className={`group relative flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 transition focus-within:bg-white dark:bg-neutral-950 dark:focus-within:bg-slate-900 ${
          hasError
            ? "border-rose-400/80 focus-within:border-rose-500 focus-within:ring-0"
            : "border-slate-200 focus-within:border-black focus-within:ring-0 dark:border-white/10 dark:focus-within:border-white"
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
          aria-describedby={
            hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className="w-full bg-transparent py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-neutral-800 dark:hover:text-slate-200"
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
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
