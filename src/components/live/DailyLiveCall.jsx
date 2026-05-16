import { useEffect, useRef } from "react";

export default function DailyLiveCall({ roomUrl, token }) {
  const containerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      const { default: DailyIframe } = await import("@daily-co/daily-js");
      if (cancelled || !containerRef.current) return;
      const frame = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "1rem",
        },
      });
      frameRef.current = frame;
      await frame.join({ url: roomUrl, token });
    }

    mount().catch((err) => {
      console.error("[daily] join failed", err);
    });

    return () => {
      cancelled = true;
      try {
        frameRef.current?.destroy();
      } catch {
        /* ignore */
      }
      frameRef.current = null;
    };
  }, [roomUrl, token]);

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10">
      <div ref={containerRef} className="h-[min(72vh,720px)] w-full min-h-[360px]" />
    </div>
  );
}
