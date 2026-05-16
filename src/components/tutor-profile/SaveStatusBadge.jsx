import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function SaveStatusBadge({ status, errorMessage }) {
  return (
    <AnimatePresence mode="wait">
      {status === "saving" ? (
        <motion.span
          key="saving"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1.5 rounded-full glass-btn bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-neutral-800 dark:text-slate-300"
        >
          <Loader2 size={11} className="animate-spin" />
          Saving
        </motion.span>
      ) : status === "saved" ? (
        <motion.span
          key="saved"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1.5 rounded-full glass-btn bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
        >
          <CheckCircle2 size={11} />
          Saved
        </motion.span>
      ) : status === "error" ? (
        <motion.span
          key="error"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          title={errorMessage}
          className="inline-flex items-center gap-1.5 rounded-full glass-btn bg-rose-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
        >
          <AlertCircle size={11} />
          Save failed
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
