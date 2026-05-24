import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";
import { fetchTutorDirectoryFromSupabase } from "../lib/tutorDirectory";

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

function buildSystemPrompt(tutors) {
  const tutorBlock =
    tutors.length > 0
      ? `TUTOR DATABASE (${tutors.length} tutors):\n` +
        tutors
          .map(
            (t, i) =>
              `${i + 1}. Name: ${t.name} | Subject: ${t.subject} | Location: ${t.location || "Not specified"} | About: ${t.description || "No description available"} | Profile: ${window.location.origin}/tutor/${t.id}`,
          )
          .join("\n")
      : "TUTOR DATABASE: No tutors loaded yet.";

  return `You are the assistant for Smart Tuition Finder. You have direct access to the live tutor database below.

${tutorBlock}

RULES:
- When the user asks about tutors for a subject (e.g. "math tutors", "science teachers"), immediately list matching tutors from the database. Do NOT ask follow-up questions.
- For each matching tutor show: name (bold), subject, location, a short description of the tutor (from the About field), and a profile link.
- If no tutors match, say so clearly and suggest visiting /tutors.
- Answer in clear, well-structured paragraphs. Use **bold** for names and labels. Use numbered or bulleted lists where it helps readability.
- Be concise and direct. Do not ask clarifying questions unless the request is completely ambiguous.
- Format profile links as markdown: [View Profile](url).`;
}

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

async function callGenerateContent(apiKey, model, contents, systemPrompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 700,
        },
      }),
    },
  );
  const data = await response.json();
  return { response, data, model };
}

function renderInline(text) {
  const parts = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) {
      parts.push(<strong key={key++} className="font-semibold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++} className="italic">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <a key={key++} href={match[5]} target="_blank" rel="noopener noreferrer"
          className="underline text-blue-300 hover:text-blue-200 break-all">
          {match[4]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MarkdownMessage({ text }) {
  if (typeof text !== "string" || !text) return null;

  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let key = 0;

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={key++} className="my-2 space-y-1 pl-4">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    const numMatch = line.match(/^\s*\d+\.\s+(.*)/);
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);

    if (numMatch || bulletMatch) {
      listItems.push((numMatch || bulletMatch)[1]);
      continue;
    }

    flushList();

    if (!line.trim()) {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    const headingMatch = line.match(/^#{1,3}\s+(.*)/);
    if (headingMatch) {
      elements.push(
        <p key={key++} className="mt-3 mb-1 text-sm font-semibold text-white">
          {renderInline(headingMatch[1])}
        </p>
      );
      continue;
    }

    elements.push(
      <p key={key++} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-0.5">{elements}</div>;
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

  if (text) return { ok: true, text };

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
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetchTutorDirectoryFromSupabase().then(setTutors).catch(() => {});
  }, []);
  const fullTitle = "Tutor Guide";
  const fullHeading = "How can I help you today?";
  const [typedTitle, setTypedTitle] = useState("");
  const [typedHeading, setTypedHeading] = useState("");
  const typingRef = useRef({ cancelled: false });
  const [isTyping, setIsTyping] = useState(false);

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
      const systemPrompt = buildSystemPrompt(tutors);

      for (const model of modelChain()) {
        const { response, data } = await callGenerateContent(
          apiKey,
          model,
          contents,
          systemPrompt,
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

  useEffect(() => {
    let mounted = true;
    typingRef.current.cancelled = false;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const type = async (text, setter, charDelay = 40, endDelay = 120) => {
      setter("");
      for (let i = 0; i < text.length; i += 1) {
        if (!mounted || typingRef.current.cancelled) return;
        setter((prev) => prev + text[i]);
        // small jitter to feel more natural
        // eslint-disable-next-line no-await-in-loop
        await sleep(charDelay + (i % 3 === 0 ? 10 : 0));
      }
      // pause after finishing this string
      // eslint-disable-next-line no-await-in-loop
      await sleep(endDelay);
    };

    (async () => {
      if (isOpen && messages.length === 0) {
        typingRef.current.cancelled = false;
        setTypedTitle("");
        setTypedHeading("");
        setIsTyping(true);

        await type(fullTitle, setTypedTitle, 45, 140);
        if (!mounted || typingRef.current.cancelled) {
          setIsTyping(false);
          return;
        }
        await type(fullHeading, setTypedHeading, 36, 0);
        setIsTyping(false);
      } else {
        // show full text immediately when modal closed or there are messages
        setTypedTitle(fullTitle);
        setTypedHeading(fullHeading);
        setIsTyping(false);
      }
    })();

    return () => {
      mounted = false;
      typingRef.current.cancelled = true;
      setIsTyping(false);
    };
  }, [isOpen, messages.length]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          >
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.section
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="glass-ultra relative z-10 mx-auto flex h-[520px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
            >
            <div className="relative px-4 py-3">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-black/10 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close chatbot"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-transparent px-3 py-4">
              {messages.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-4">
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">{typedTitle}</p>
                    <h2 className="mx-auto max-w-2xl text-2xl md:text-3xl font-semibold text-slate-800 dark:text-white">
                      <span>{typedHeading}</span>
                      {isTyping ? (
                        <span className="ml-1 inline-block w-3 animate-pulse text-slate-800 dark:text-white">|</span>
                      ) : null}
                    </h2>
                  </div>

                  <form onSubmit={onSubmit} className="w-full max-w-3xl">
                    <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500">
                        <span className="text-xl">+</span>
                      </div>

                      <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Ask anything"
                        className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
                      />

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 transition disabled:opacity-60"
                        aria-label="Send message"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                </div>
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
                      {isUser
                        ? <p className="text-sm leading-relaxed">{message.text}</p>
                        : <MarkdownMessage text={message.text} />}
                    </div>
                  </div>
                );
              })}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="glass-btn rounded-2xl px-3 py-2 text-sm text-slate-800 dark:text-white/85">
                    Tutor Guide is typing…
                  </div>
                </div>
              ) : null}
            </div>

            {messages.length > 0 ? (
              <form
                onSubmit={onSubmit}
                className="border-t border-slate-200/60 bg-transparent p-3 dark:border-white/10"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Type your question…"
                    className="w-full rounded-xl glass-btn px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition dark:text-white dark:placeholder:text-white/45"
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
            ) : null}
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
