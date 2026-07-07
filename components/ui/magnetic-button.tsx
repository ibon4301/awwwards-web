"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  cursorLabel?: string;
  onClick?: () => void;
};

export function MagneticButton({
  children,
  href,
  className,
  cursorLabel,
  onClick,
}: MagneticButtonProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic(0.35);

  const innerClassName = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-line bg-white/[0.03] px-8 py-4 text-sm font-medium tracking-wide text-foreground backdrop-blur-sm transition-colors hover:border-accent/40",
    className
  );

  const glow = (
    <span className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-accent/0 via-accent/15 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  );

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      {href ? (
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Link
            href={href}
            data-cursor={cursorLabel}
            data-cursor-variant="block"
            className={innerClassName}
          >
            <span className="relative z-10">{children}</span>
            {glow}
          </Link>
        </motion.div>
      ) : (
        <motion.button
          onClick={onClick}
          data-cursor={cursorLabel}
          data-cursor-variant="block"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={innerClassName}
        >
          <span className="relative z-10">{children}</span>
          {glow}
        </motion.button>
      )}
    </motion.div>
  );
}
