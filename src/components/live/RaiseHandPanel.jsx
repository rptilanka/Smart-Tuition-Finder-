import { Hand, HandMetal } from "lucide-react";

export default function RaiseHandPanel({
  participants,
  currentUserId,
  handRaised,
  onToggleHand,
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-100">
          Raise hand
        </h3>
        <button
          type="button"
          onClick={onToggleHand}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
            handRaised
              ? "bg-amber-500 text-white"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          }`}
        >
          {handRaised ? <HandMetal size={13} /> : <Hand size={13} />}
          {handRaised ? "Lower hand" : "Raise hand"}
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {(participants ?? []).map((p) => (
          <li
            key={`${p.meeting_id}-${p.user_id}`}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800"
          >
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {p.user_id === currentUserId ? "You" : `${p.role} ${p.user_id.slice(0, 6)}`}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
              {p.hand_raised ? <HandMetal size={12} className="text-amber-500" /> : <Hand size={12} />}
              {p.hand_raised ? "Raised" : "Idle"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
