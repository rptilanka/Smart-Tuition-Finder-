import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

const TutorPreviewContext = createContext({
  tutor: null,
  show: () => {},
  hide: () => {},
  register: () => {},
  isTouch: false,
});

export function useTutorPreview() {
  return useContext(TutorPreviewContext);
}

const CARD_WIDTH = 300;
const CARD_HEIGHT = 240;
const CURSOR_OFFSET = 22;
const EDGE_PADDING = 14;
const MAGNETIC_STRENGTH = 0.18;

function detectHoverless() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(hover: none)").matches;
}

export function TutorPreviewProvider({ children, tutors, resolveTutor }) {
  const [tutor, setTutor] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === "undefined" ? 1280 : window.innerWidth,
    h: typeof window === "undefined" ? 720 : window.innerHeight,
  }));

  const activeElRef = useRef(null);

  const registryRef = useRef(null);
  if (registryRef.current === null) {
    const map = new Map();
    if (tutors) {
      for (const [id, data] of Object.entries(tutors)) map.set(id, data);
    }
    registryRef.current = map;
  }

  useEffect(() => {
    if (!tutors) return;
    for (const [id, data] of Object.entries(tutors)) {
      registryRef.current.set(id, data);
    }
  }, [tutors]);

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, {
    stiffness: 210,
    damping: 24,
    mass: 0.55,
  });
  const springY = useSpring(mouseY, {
    stiffness: 210,
    damping: 24,
    mass: 0.55,
  });

  const resolve = useCallback(
    (id) => {
      if (!id) return null;
      if (registryRef.current.has(id)) return registryRef.current.get(id);
      if (resolveTutor) return resolveTutor(id);
      return null;
    },
    [resolveTutor],
  );

  const register = useCallback((id, data) => {
    if (!id) return;
    registryRef.current.set(id, data);
  }, []);

  const show = useCallback(
    (id) => {
      const data = resolve(id);
      if (data) setTutor(data);
    },
    [resolve],
  );

  const hide = useCallback(() => {
    setTutor(null);
    setPinned(false);
    if (activeElRef.current) {
      activeElRef.current.removeAttribute("data-tutor-active");
      activeElRef.current.style.removeProperty("--tp-tx");
      activeElRef.current.style.removeProperty("--tp-ty");
      activeElRef.current = null;
    }
  }, []);

  useEffect(() => {
    setIsTouch(detectHoverless());
  }, []);

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pinnedRef = useRef(false);
  pinnedRef.current = pinned;
  const isTouchRef = useRef(false);
  isTouchRef.current = isTouch;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleMouseMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);

      const el = activeElRef.current;
      if (!el || isTouchRef.current) return;
      if (!el.hasAttribute("data-tutor-magnetic")) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (event.clientX - cx) * MAGNETIC_STRENGTH;
      const dy = (event.clientY - cy) * MAGNETIC_STRENGTH;
      el.style.setProperty("--tp-tx", `${dx.toFixed(2)}px`);
      el.style.setProperty("--tp-ty", `${dy.toFixed(2)}px`);
    };

    const clearActive = (el) => {
      if (!el) return;
      el.removeAttribute("data-tutor-active");
      el.style.removeProperty("--tp-tx");
      el.style.removeProperty("--tp-ty");
    };

    const handleMouseOver = (event) => {
      if (isTouchRef.current) return;
      const target = event.target.closest?.("[data-tutor-id]");
      if (!target) return;
      const id = target.getAttribute("data-tutor-id");
      const data = resolve(id);
      if (!data) return;
      if (activeElRef.current === target) return;

      if (activeElRef.current && activeElRef.current !== target) {
        clearActive(activeElRef.current);
      }
      activeElRef.current = target;
      target.setAttribute("data-tutor-active", "");
      setTutor(data);
    };

    const handleMouseOut = (event) => {
      if (isTouchRef.current) return;
      const target = event.target.closest?.("[data-tutor-id]");
      if (!target) return;
      const related = event.relatedTarget;
      if (related && target.contains(related)) return;

      const relatedTutorEl = related?.closest?.("[data-tutor-id]");
      clearActive(target);
      if (activeElRef.current === target) activeElRef.current = null;
      if (relatedTutorEl && relatedTutorEl !== target) return;
      if (!pinnedRef.current) setTutor(null);
    };

    const handleTouchStart = (event) => {
      const target = event.target.closest?.("[data-tutor-id]");
      if (!target) {
        if (pinnedRef.current) {
          hide();
        }
        return;
      }
      const id = target.getAttribute("data-tutor-id");
      const data = resolve(id);
      if (!data) return;

      const touch = event.touches?.[0];
      if (touch) {
        mouseX.set(touch.clientX);
        mouseY.set(touch.clientY);
      }

      if (pinnedRef.current && activeElRef.current === target) {
        hide();
        return;
      }
      if (activeElRef.current && activeElRef.current !== target) {
        clearActive(activeElRef.current);
      }
      activeElRef.current = target;
      target.setAttribute("data-tutor-active", "");
      setTutor(data);
      setPinned(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [resolve, hide, mouseX, mouseY]);

  const contextValue = useMemo(
    () => ({ tutor, show, hide, register, isTouch }),
    [tutor, show, hide, register, isTouch],
  );

  return (
    <TutorPreviewContext.Provider value={contextValue}>
      {children}
      <TutorPreviewCard
        tutor={tutor}
        springX={springX}
        springY={springY}
        viewport={viewport}
        pinned={pinned}
        isTouch={isTouch}
        onDismiss={hide}
      />
    </TutorPreviewContext.Provider>
  );
}

function TutorPreviewCard({
  tutor,
  springX,
  springY,
  viewport,
  pinned,
  isTouch,
  onDismiss,
}) {
  const anchorToBottom = isTouch && pinned;

  const translateX = useTransform(springX, (v) => {
    if (anchorToBottom) {
      return Math.max(EDGE_PADDING, (viewport.w - CARD_WIDTH) / 2);
    }
    const overflowsRight =
      v + CURSOR_OFFSET + CARD_WIDTH > viewport.w - EDGE_PADDING;
    const raw = overflowsRight
      ? v - CURSOR_OFFSET - CARD_WIDTH
      : v + CURSOR_OFFSET;
    const max = viewport.w - CARD_WIDTH - EDGE_PADDING;
    return Math.min(Math.max(raw, EDGE_PADDING), Math.max(EDGE_PADDING, max));
  });

  const translateY = useTransform(springY, (v) => {
    if (anchorToBottom) {
      return viewport.h - CARD_HEIGHT - 28;
    }
    const overflowsBottom =
      v + CURSOR_OFFSET + CARD_HEIGHT > viewport.h - EDGE_PADDING;
    const raw = overflowsBottom
      ? v - CURSOR_OFFSET - CARD_HEIGHT
      : v + CURSOR_OFFSET;
    const max = viewport.h - CARD_HEIGHT - EDGE_PADDING;
    return Math.min(Math.max(raw, EDGE_PADDING), Math.max(EDGE_PADDING, max));
  });

  return (
    <AnimatePresence mode="wait">
      {tutor ? (
        <motion.div
          key={tutor.id ?? tutor.name}
          style={{
            x: translateX,
            y: translateY,
            width: CARD_WIDTH,
            pointerEvents: pinned ? "auto" : "none",
          }}
          initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed left-0 top-0 z-[100] will-change-transform"
          role="tooltip"
          aria-live="polite"
        >
          <div className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:ring-white/10">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-base font-semibold text-white dark:bg-neutral-800 dark:text-white">
                  {tutor.initials ??
                    tutor.name
                      ?.split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white">
                    {tutor.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex rounded-full glass-btn bg-slate-100 px-2 py-[2px] text-[11px] font-semibold text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
                      {tutor.subject}
                    </span>
                    <Rating value={tutor.rating} />
                  </div>
                </div>
                {pinned && isTouch ? (
                  <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="Dismiss tutor preview"
                    className="rounded-full glass-btn bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-neutral-800 dark:text-slate-200"
                  >
                    Close
                  </button>
                ) : null}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {tutor.description}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                <MapPin size={13} />
                {tutor.location}
              </div>

              <Link
                to={tutor.profileUrl ?? `/tutor/${tutor.id ?? ""}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full glass-btn bg-neutral-950 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                View Profile
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Rating({ value }) {
  if (typeof value !== "number") return null;
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rounded);
        const half = !filled && i + 0.5 === rounded;
        return (
          <Star
            key={i}
            size={11}
            className={
              filled || half
                ? "text-slate-950 dark:text-white"
                : "text-slate-300 dark:text-slate-600"
            }
            fill={filled ? "currentColor" : "none"}
            strokeWidth={2}
          />
        );
      })}
      <span className="ml-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
