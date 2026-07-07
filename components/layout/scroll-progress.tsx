"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const { gsap, ScrollTrigger } = getGsap();

    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[120] h-[2px] w-full bg-line/40">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-accent"
      />
    </div>
  );
}
