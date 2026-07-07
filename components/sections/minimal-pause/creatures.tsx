"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";

const EYE = "#06131c";

function FishSvg() {
  return (
    <svg viewBox="0 0 100 60" className="w-full" fill="currentColor">
      <path d="M10,30 C25,12 55,8 72,22 L92,10 C88,22 88,38 92,50 L72,38 C55,52 25,48 10,30 Z" />
      <circle cx="24" cy="27" r="2.5" fill={EYE} />
    </svg>
  );
}

function CrabSvg() {
  return (
    <svg viewBox="0 0 120 90" className="w-full">
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M40,62 L24,74 M44,68 L32,82 M76,68 L88,82 M80,62 L96,74" />
        <path d="M42,44 Q30,34 22,33" />
        <path d="M78,44 Q90,34 98,33" />
      </g>
      <g fill="currentColor">
        <ellipse cx="60" cy="56" rx="24" ry="15" />
        <circle cx="52" cy="38" r="3.5" />
        <circle cx="68" cy="38" r="3.5" />
        <path d="M16,30 L23.5,27.3 A8,8 0 1 0 22.1,35.1 Z" />
        <path d="M104,30 L96.5,27.3 A8,8 0 1 1 97.9,35.1 Z" />
      </g>
    </svg>
  );
}

type CreatureConfig = {
  id: string;
  kind: "fish" | "crab";
  pos: React.CSSProperties;
  width: number;
  color: string;
  opacity: number;
  seed: number;
  range: { x: number; y: number };
};

const CREATURES: CreatureConfig[] = [
  { id: "fish-a", kind: "fish", pos: { left: "9%", top: "26%" }, width: 64, color: "#4fe0c4", opacity: 0.4, seed: 17, range: { x: 110, y: 55 } },
  { id: "fish-b", kind: "fish", pos: { right: "11%", top: "36%" }, width: 46, color: "#7fd4ff", opacity: 0.38, seed: 42, range: { x: 90, y: 45 } },
  { id: "fish-c", kind: "fish", pos: { left: "17%", bottom: "20%" }, width: 38, color: "#9fd4d4", opacity: 0.32, seed: 73, range: { x: 70, y: 38 } },
  { id: "crab", kind: "crab", pos: { right: "18%", bottom: "11%" }, width: 70, color: "#e8a87c", opacity: 0.35, seed: 91, range: { x: 85, y: 4 } },
];

function DraggableCreature({ kind, pos, width, color, opacity, seed, range }: Omit<CreatureConfig, "id">) {
  const wanderRef = useRef<HTMLDivElement>(null);

  // ragdoll: body swing follows drag velocity through a loose spring, so the
  // creature trails and flops both while dragged and on the bounce back home
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const vx = useVelocity(x);
  const swing = useSpring(useTransform(vx, [-1500, 1500], [-55, 55]), {
    stiffness: 220,
    damping: 9,
    mass: 0.9,
  });

  useEffect(() => {
    const el = wanderRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let facing = 1;
    const { x: rx, y: ry } = range;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 1e-3);
      const t = now / 1000 + seed;

      let ox: number;
      let oy: number;

      if (kind === "fish") {
        ox = Math.sin(t * 0.3) * rx + Math.sin(t * 0.13 + 2.1) * rx * 0.6;
        oy = Math.sin(t * 0.24 + 1.3) * ry + Math.sin(t * 0.1 + 4.2) * ry * 0.5;
      } else {
        ox = Math.sin(t * 0.2) * rx + Math.sin(t * 0.07 + 1.2) * rx * 0.5;
        oy = 0;
      }

      const velX = (ox - lastX) / dt;
      const velY = (oy - lastY) / dt;

      if (kind === "fish") {
        // face where you swim (the svg faces left), tilt the nose into
        // vertical motion, and add a small tail wiggle
        if (Math.abs(velX) > 5) facing = velX < 0 ? 1 : -1;
        const tilt = Math.max(-18, Math.min(18, velY * 1.1));
        const wiggle = Math.sin(t * 3.2) * 2.5;
        el.style.transform = `translate3d(${ox}px, ${oy}px, 0) scaleX(${facing}) rotate(${tilt + wiggle}deg)`;
      } else {
        // crabs scuttle sideways: tiny steps and a rocking shuffle,
        // livelier the faster they move
        const speedF = Math.min(1, Math.abs(velX) / 18);
        const step = -Math.abs(Math.sin(t * 5)) * 3.5 * speedF;
        const rock = Math.sin(t * 7) * 4 * (0.25 + speedF);
        el.style.transform = `translate3d(${ox}px, ${step}px, 0) rotate(${rock}deg)`;
      }

      lastX = ox;
      lastY = oy;
      lastT = now;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [kind, seed, range]);

  return (
    <div ref={wanderRef} className="absolute z-[5]" style={{ ...pos, width, color, opacity }}>
      <motion.div
        drag
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 90, bounceDamping: 7 }}
        whileHover={{ scale: 1.12 }}
        whileDrag={{ scale: 1.18 }}
        data-cursor="Arrastra"
        data-cursor-variant="block"
        style={{ x, y, rotate: swing }}
      >
        {kind === "fish" ? <FishSvg /> : <CrabSvg />}
      </motion.div>
    </div>
  );
}

export function Creatures() {
  return (
    <>
      {CREATURES.map(({ id, ...rest }) => (
        <DraggableCreature key={id} {...rest} />
      ))}
    </>
  );
}
