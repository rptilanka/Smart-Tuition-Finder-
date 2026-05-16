import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

const SYSTEM_PROMPT = `You are the in-app assistant for Smart Tuition Finder: students and parents discover tutors by subject, level, and location (including Sri Lanka). Answer clearly. Stay on tutor discovery and how the site works; do not claim live database access. Be concise unless asked for detail.

Write in plain text only. Do not use markdown: no asterisks, no hash headings, no backticks, no underscore emphasis. Prefer numbered lists (1. 2. 3.) and short lines. Write labels like Subject: or Level: as plain words with a colon.`;

function modelChain() {
  const env = import.meta.env.VITE_GEMINI_MODEL?.trim();
  const ordered = env ? [env, ...MODEL_FALLBACK_CHAIN] : MODEL_FALLBACK_CHAIN;
  return [...new Set(ordered)];
}

function isRetriableWithOtherModel(status, apiMessage) {
  const m = (apiMessage || "").toLowerCase();
  return (
    status === 429 ||
    status === 404 ||
    /quota|resource_exhausted|limit:\s*0|not found|does not exist|unsupported|is not found/i.test(
      m,
    )
  );
}

function friendlyError(raw) {
  const r = (raw || "").trim();
  if (/quota|resource_exhausted|limit:\s*0/i.test(r)) {
    return [
      "Google’s free quota for the models we tried was used up, or that model has no free access (limit 0) on your API key.",
      "",
      "What you can do: wait until the reset time if the API message included one; check usage at https://ai.dev/rate-limit ; review limits at https://ai.google.dev/gemini-api/docs/rate-limits ; or enable billing on your Google AI / Cloud project for higher limits.",
      "",
      "You can also set VITE_GEMINI_MODEL in `.env.local` to a model your project still has quota for, then restart the dev server.",
    ].join("\n");
  }
  return r.length > 1400 ? `${r.slice(0, 1400)}…` : r;
}

async function callGenerateContent(apiKey, model, contents) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 512,
        },
      }),
    },
  );
  const data = await response.json();
  return { response, data, model };
}

function plainTextAssistantReply(raw) {
  if (typeof raw !== "string" || !raw) return raw;
  let t = raw;
  t = t.replace(/```[\w]*\r?\n?([\s\S]*?)```/g, "$1");
  for (let i = 0; i < 4 && /\*\*[^*]+\*\*/.test(t); i += 1) {
    t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  }
  t = t.replace(/__([^_]+)__/g, "$1");
  t = t.replace(/^\s*\*\s+/gm, "");
  t = t.replace(/\*([^*\n]+)\*/g, "$1");
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
  t = t.replace(/^#{1,6}\s+/gm, "");
  t = t.replace(/\*\*/g, "");
  t = t.replace(/`/g, "");
  return t;
}

function extractReplyFromData(data) {
  if (data?.promptFeedback?.blockReason) {
    return {
      ok: false,
      error:
        "That message couldn’t be processed. Try asking in different words.",
    };
  }

  const candidate = data?.candidates?.[0];
  const finish = candidate?.finishReason;
  const text =
    candidate?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim() ?? "";

  if (text) return { ok: true, text: plainTextAssistantReply(text) };

  if (finish === "SAFETY" || finish === "RECITATION") {
    return {
      ok: false,
      error: "The reply was filtered. Try a shorter or more general question.",
    };
  }

  const apiErr =
    typeof data?.error?.message === "string" ? data.error.message : null;
  return {
    ok: false,
    error: apiErr || "No reply text came back. Another model may work.",
  };
}

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || isLoading) {
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: prompt },
        {
          role: "model",
          text: "The assistant isn’t configured yet. Add VITE_GEMINI_API_KEY to `.env.local`, restart the dev server, then try again.",
        },
      ]);
      setInput("");
      return;
    }

    const nextMessages = [...messages, { role: "user", text: prompt }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const contents = nextMessages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      }));

      let lastError = "Request failed.";

      for (const model of modelChain()) {
        const { response, data } = await callGenerateContent(
          apiKey,
          model,
          contents,
        );

        if (response.ok) {
          const parsed = extractReplyFromData(data);
          if (parsed.ok) {
            setMessages((prev) => [
              ...prev,
              { role: "model", text: parsed.text },
            ]);
            return;
          }
          lastError = parsed.error;
          const nonModelIssue =
            lastError.includes("couldn’t be processed") ||
            lastError.includes("filtered");
          if (nonModelIssue) throw new Error(friendlyError(lastError));
          continue;
        }

        const apiMsg =
          typeof data?.error?.message === "string"
            ? data.error.message
            : `Request failed (${response.status}).`;
        lastError = apiMsg;

        if (isRetriableWithOtherModel(response.status, apiMsg)) {
          continue;
        }
        throw new Error(friendlyError(apiMsg));
      }

      throw new Error(friendlyError(lastError));
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[75] inline-flex items-center gap-2 rounded-full glass-btn border border-white/15 bg-black px-5 py-3 font-semibold text-white shadow-[0_16px_34px_rgba(0,0,0,0.45)]"
      >
        <MessageCircle size={18} />
        Chatbot
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[80] flex h-[520px] w-[360px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-black text-white shadow-[0_24px_56px_rgba(0,0,0,0.6)]"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 p-2 text-white">
                  <Bot size={17} />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">Tutor Guide</p>
                  <p className="text-xs text-white/65">Smart Tuition Finder</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close chatbot"
              >
                <X size={16} />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-black px-3 py-4">
              {messages.length === 0 ? (
                <p className="px-1 text-center text-sm text-white/60">
                  Ask a question below.
                </p>
              ) : null}
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        isUser
                          ? "bg-white text-black"
                          : "border border-white/10 bg-zinc-900 text-white"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-1 text-[11px] opacity-70">
                        {isUser ? <User size={11} /> : <Bot size={11} />}
                        {isUser ? "You" : "Tutor Guide"}
                      </div>
                      <p className="whitespace-pre-wrap">
                        {isUser
                          ? message.text
                          : plainTextAssistantReply(message.text)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white/85">
                    Tutor Guide is typing…
                  </div>
                </div>
              ) : null}
            </div>

            <form
              onSubmit={onSubmit}
              className="border-t border-white/10 bg-black p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your question…"
                  className="w-full rounded-xl glass-btn border border-white/15 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/45"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white text-black transition hover:bg-white/90 disabled:opacity-70"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
