"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { AnimatedText } from "@/components/ui/animated-text";
import { MagneticButton } from "@/components/ui/magnetic-button";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const titleX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const titleY = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(79,224,196,0.16),_transparent_60%)]" />

      <div className="absolute inset-0">
        <HeroScene />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[380px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/55 blur-3xl"
      />

      <motion.div
        style={{ x: titleX, y: titleY }}
        className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-muted"
        >
          Un estudio en profundidad
        </motion.p>

        <AnimatedText
          as="h1"
          splitBy="chars"
          delay={0.35}
          stagger={0.02}
          className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.92] tracking-tight text-foreground"
        >
          Marea
        </AnimatedText>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-md text-balance text-base leading-relaxed text-muted"
        >
          Un experimento en luz, profundidad y calma — construido para sentirse tanto como para verse.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto mt-12"
        >
          <MagneticButton href="#manifesto" cursorLabel="Explorar">
            Comenzar el descenso
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Desliza</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
