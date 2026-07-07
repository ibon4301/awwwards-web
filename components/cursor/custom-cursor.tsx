"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

type CursorState = {
  label: string | null;
  variant: "default" | "block" | "text";
};

export function CustomCursor() {
  const enabled = useMediaQuery("(pointer: fine)");
  const [state, setState] = useState<CursorState>({ label: null, variant: "default" });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });

  const ringX = useSpring(x, { damping: 22, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(y, { damping: 22, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest<HTMLElement>("[data-cursor]");
      if (el) {
        const label = el.getAttribute("data-cursor") || null;
        const variant = (el.getAttribute("data-cursor-variant") as CursorState["variant"]) || "block";
        setState({ label, variant });
        return;
      }
      if (target.closest("a, button, [role='button']")) {
        setState({ label: null, variant: "text" });
        return;
      }
      setState({ label: null, variant: "default" });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isBlock = state.variant === "block";
  const isText = state.variant === "text";

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isBlock ? 14 : isText ? 8 : 8,
            height: isBlock ? 14 : isText ? 8 : 8,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full border border-white/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isBlock ? 96 : isText ? 64 : 36,
          height: isBlock ? 96 : isText ? 64 : 36,
          opacity: isBlock || isText ? 1 : 0.6,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {state.label && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] font-medium uppercase tracking-wide text-white"
          >
            {state.label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
