"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getGsap } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({ markers: false });

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
