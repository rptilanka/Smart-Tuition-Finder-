import { AlertTriangle } from "lucide-react";

export default function SupabaseSetupNotice() {
  return (
    <div className="mb-5 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300">
          <AlertTriangle size={14} />
        </span>
        <div className="text-xs leading-relaxed">
          <p className="font-bold uppercase tracking-wider">
            Supabase not configured
          </p>
          <p className="mt-1">
            Add your Supabase URL and anon key to{" "}
            <code className="rounded bg-amber-200/60 px-1 py-0.5 text-[11px] dark:bg-amber-400/20">
              .env.local
            </code>{" "}
            (see{" "}
            <code className="rounded bg-amber-200/60 px-1 py-0.5 text-[11px] dark:bg-amber-400/20">
              .env.example
            </code>
            ), then run{" "}
            <code className="rounded bg-amber-200/60 px-1 py-0.5 text-[11px] dark:bg-amber-400/20">
              supabase/schema.sql
            </code>{" "}
            in the SQL editor to enable sign-up and login.
          </p>
        </div>
      </div>
    </div>
  );
}
