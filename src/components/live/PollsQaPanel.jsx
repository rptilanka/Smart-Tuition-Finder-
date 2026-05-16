import { useMemo, useState } from "react";
import { CircleHelp, ListChecks, Vote } from "lucide-react";

export default function PollsQaPanel({
  role,
  polls,
  pollVotesByPollId,
  questions,
  onCreatePoll,
  onVotePoll,
  onClosePoll,
  onAskQuestion,
  onToggleQuestionAnswered,
}) {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("Option 1\nOption 2");
  const [questionText, setQuestionText] = useState("");

  const sortedPolls = useMemo(() => [...(polls ?? [])], [polls]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-100">
          <Vote size={14} />
          Polls
        </h3>

        {role === "tutor" ? (
          <form
            className="mt-3 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              const options = pollOptions
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean);
              if (!pollQuestion.trim() || options.length < 2) return;
              onCreatePoll?.(pollQuestion.trim(), options);
              setPollQuestion("");
              setPollOptions("Option 1\nOption 2");
            }}
          >
            <input
              value={pollQuestion}
              onChange={(event) => setPollQuestion(event.target.value)}
              placeholder="Poll question"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-950"
            />
            <textarea
              value={pollOptions}
              onChange={(event) => setPollOptions(event.target.value)}
              rows={3}
              placeholder={"One option per line"}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              <ListChecks size={12} />
              Create poll
            </button>
          </form>
        ) : null}

        <ul className="mt-3 space-y-2">
          {sortedPolls.map((poll) => (
            <li key={poll.id} className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">{poll.question}</p>
              <div className="mt-2 space-y-1">
                {(poll.options ?? []).map((option, idx) => {
                  const votes = pollVotesByPollId?.[poll.id]?.[idx] ?? 0;
                  return (
                    <button
                      key={`${poll.id}-${idx}`}
                      type="button"
                      disabled={poll.status !== "open"}
                      onClick={() => onVotePoll?.(poll.id, idx)}
                      className="flex w-full items-center justify-between rounded-lg bg-white px-2 py-1 text-left disabled:opacity-70 dark:bg-slate-900"
                    >
                      <span>{option}</span>
                      <span className="font-bold">{votes}</span>
                    </button>
                  );
                })}
              </div>
              {role === "tutor" && poll.status === "open" ? (
                <button
                  type="button"
                  onClick={() => onClosePoll?.(poll.id)}
                  className="mt-2 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white"
                >
                  Close poll
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-100">
          <CircleHelp size={14} />
          Q&A
        </h3>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const text = questionText.trim();
            if (!text) return;
            onAskQuestion?.(text);
            setQuestionText("");
          }}
        >
          <input
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder="Ask a question..."
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-950"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            Ask
          </button>
        </form>
        <ul className="mt-3 space-y-2">
          {(questions ?? []).slice(0, 8).map((question) => (
            <li key={question.id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{question.body}</p>
                {role === "tutor" ? (
                  <button
                    type="button"
                    onClick={() =>
                      onToggleQuestionAnswered?.(question.id, !question.is_answered)
                    }
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      question.is_answered
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {question.is_answered ? "Answered" : "Mark answered"}
                  </button>
                ) : question.is_answered ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Answered
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
