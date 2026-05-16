import { useMemo, useState } from "react";
import { SendHorizonal } from "lucide-react";

function formatTime(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (_error) {
    return "";
  }
}

export default function LiveChatPanel({ messages, currentUserId, onSend }) {
  const [text, setText] = useState("");
  const sorted = useMemo(
    () =>
      [...(messages ?? [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    [messages],
  );

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
      <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-100">
        Live chat
      </h3>
      <div className="mt-3 h-64 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
        {sorted.length ? (
          sorted.map((item) => {
            const mine = item.sender_id === currentUserId;
            return (
              <div
                key={item.id ?? `${item.sender_id}-${item.created_at}-${item.body}`}
                className={`rounded-xl px-3 py-2 text-xs ${
                  mine
                    ? "ml-8 bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "mr-8 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                <p className="break-words">{item.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-white/75" : "text-slate-400"}`}>
                  {formatTime(item.created_at)}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            No messages yet.
          </p>
        )}
      </div>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = text.trim();
          if (!trimmed) return;
          onSend?.(trimmed);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask a question in the live class..."
          className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="submit"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950"
          aria-label="Send message"
        >
          <SendHorizonal size={15} />
        </button>
      </form>
    </div>
  );
}
