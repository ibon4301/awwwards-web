"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";

export function Marquee({ text, speed = 40 }: { text: string; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const { gsap, ScrollTrigger } = getGsap();

    const tween = gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      duration: speed,
      ease: "none",
    });

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity() / -1000;
        const skew = gsap.utils.clamp(-20, 20, velocity);
        gsap.to(track, { skewX: skew, duration: 0.4, ease: "power3.out", overwrite: true });
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, [speed]);

  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-line py-6">
      <div ref={trackRef} className="inline-flex w-max">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-8 pr-8 text-[clamp(2rem,6vw,5rem)] font-medium uppercase tracking-tight text-foreground/90"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <span key={idx} className="flex items-center gap-8">
                {text}
                <span className="text-accent">*</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
