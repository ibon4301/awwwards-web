"use client";

import { useEffect, useRef } from "react";

const WORDS = ["Refracción", "Calma", "Abismo", "Ingravidez", "Bioluminiscencia"];

const COLORS = [
  { r: 79, g: 224, b: 196 }, // teal
  { r: 127, g: 212, b: 255 }, // cyan
  { r: 125, g: 255, b: 178 }, // green
  { r: 233, g: 247, b: 244 }, // foam
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
  phase: number;
  color: (typeof COLORS)[number];
};

type Ripple = { x: number; y: number; r: number; max: number };

type FloatingWord = { text: string; x: number; y: number; life: number };

export function Bioluminescence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const hint = hintRef.current;
    if (!section || !canvas || !hint) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    const words: FloatingWord[] = [];

    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    let travelled = 0;
    let hintGone = false;
    let wordIndex = 0;
    let raf = 0;

    const spawnParticles = () => {
      particles.length = 0;
      const count = coarse ? 140 : 260;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          size: 0.8 + Math.random() * 1.8,
          energy: 0,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) spawnParticles();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(section);
    resize();

    const dismissHint = () => {
      if (hintGone) return;
      hintGone = true;
      hint.style.opacity = "0";
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      if (pointer.active) {
        pointer.vx = x - pointer.x;
        pointer.vy = y - pointer.y;
        travelled += Math.hypot(pointer.vx, pointer.vy);
        if (travelled > 400) dismissHint();
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.vx = 0;
      pointer.vy = 0;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      ripples.push({ x, y, r: 0, max: Math.max(width, height) * 0.6 });
      words.push({ text: WORDS[wordIndex % WORDS.length], x, y, life: 0 });
      wordIndex++;
      dismissHint();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointerdown", onDown);

    const fontFamily = getComputedStyle(document.body).fontFamily;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = performance.now() * 0.001;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // pointer light — the water glows softly around the cursor
      if (pointer.active) {
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 150);
        glow.addColorStop(0, "rgba(79, 224, 196, 0.09)");
        glow.addColorStop(1, "rgba(79, 224, 196, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(pointer.x - 150, pointer.y - 150, 300, 300);
      }

      const stirSpeed = Math.hypot(pointer.vx, pointer.vy);

      // ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 5.5;
        const fade = 1 - rp.r / rp.max;
        if (fade <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(127, 212, 255, ${0.45 * fade})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      const lit: Particle[] = [];

      for (const p of particles) {
        // idle drift — plankton wanders and slowly rises
        p.vx += Math.sin(t * 0.4 + p.phase) * 0.003;
        p.vy += Math.cos(t * 0.3 + p.phase) * 0.003 - 0.002;

        // cursor stirs nearby particles
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 0.001) {
            const influence = 1 - d / 130;
            p.vx += (pointer.vx * 0.06 + (dx / d) * 0.3) * influence;
            p.vy += (pointer.vy * 0.06 + (dy / d) * 0.3) * influence;
            p.energy = Math.min(1, p.energy + influence * (0.08 + stirSpeed * 0.015));
          }
        }

        // ripple fronts ignite what they touch
        for (const rp of ripples) {
          const dx = p.x - rp.x;
          const dy = p.y - rp.y;
          const d = Math.hypot(dx, dy);
          if (Math.abs(d - rp.r) < 45 && d > 0.001) {
            const fade = 1 - rp.r / rp.max;
            p.energy = Math.min(1, p.energy + 0.5 * fade);
            p.vx += (dx / d) * 0.8 * fade;
            p.vy += (dy / d) * 0.8 * fade;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.energy *= 0.965;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // ambient twinkle so the water never feels dead
        if (Math.random() < 0.0004) p.energy = Math.max(p.energy, 0.6);

        const { r, g, b } = p.color;
        const alpha = 0.1 + p.energy * 0.85;
        const radius = p.size * (1 + p.energy * 2.2);

        if (p.energy > 0.12) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6);
          halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.energy * 0.35})`);
          halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 6, 0, Math.PI * 2);
          ctx.fill();
          lit.push(p);
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // constellation threads between awakened plankton
      for (let i = 0; i < lit.length; i++) {
        for (let j = i + 1; j < lit.length; j++) {
          const a = lit[i];
          const c = lit[j];
          const dx = a.x - c.x;
          const dy = a.y - c.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8100) {
            const alpha = (1 - Math.sqrt(d2) / 90) * Math.min(a.energy, c.energy) * 0.5;
            ctx.strokeStyle = `rgba(127, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
        }
      }

      // words released by each ripple
      ctx.textAlign = "center";
      for (let i = words.length - 1; i >= 0; i--) {
        const w = words[i];
        w.life += 0.008;
        if (w.life >= 1) {
          words.splice(i, 1);
          continue;
        }
        const alpha = Math.sin(Math.PI * w.life) * 0.9;
        ctx.font = `500 ${13 + w.life * 6}px ${fontFamily}`;
        ctx.fillStyle = `rgba(233, 247, 244, ${alpha})`;
        ctx.fillText(w.text.toUpperCase(), w.x, w.y - w.life * 60);
      }

      ctx.globalCompositeOperation = "source-over";
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="corrientes"
      className="relative h-screen touch-none overflow-hidden bg-background"
    >
      {/* glow sized in viewport units and centered 18vh past the bottom edge — the
          matching half lives at the top of the next section, so the light crosses
          the seam without a visible cut */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90vw_55vh_at_50%_calc(100%_+_18vh),_rgba(10,58,68,0.55),_transparent_70%)]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
      />

      <div className="pointer-events-none absolute left-6 top-10 z-10 sm:left-10">
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-muted">
          Bioluminiscencia — 02
        </span>
      </div>

      <p
        ref={hintRef}
        className="pointer-events-none absolute bottom-14 left-1/2 z-10 -translate-x-1/2 text-center text-sm text-muted transition-opacity duration-1000"
      >
        Agita el agua — toca para despertar la luz
      </p>
    </section>
  );
}
