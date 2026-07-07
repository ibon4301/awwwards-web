"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  cursorLabel?: string;
};

export function TiltCard({ children, className, cursorLabel }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });
  const glowX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(y, [0, 1], ["0%", "100%"]);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      data-cursor={cursorLabel}
      data-cursor-variant="block"
      className={cn("relative", className)}
    >
      {children}
      <motion.div
        aria-hidden
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(320px circle at ${gx} ${gy}, rgba(255,255,255,0.12), transparent 70%)`
          ),
        }}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
      />
    </motion.div>
  );
}
