"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, suffix = "", durationMs = 1100) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState("0" + suffix);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(target + suffix);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          io.unobserve(el);
          const t0 = performance.now();
          const step = (t: number) => {
            const p = Math.min((t - t0) / durationMs, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(target * eased) + suffix);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix, durationMs]);

  return { ref, display };
}
