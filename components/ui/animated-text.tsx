"use client";

import React, { useEffect, useRef } from "react";
import SplitType from "split-type";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  splitBy?: "words" | "chars" | "lines";
  delay?: number;
  stagger?: number;
  start?: string;
};

export function AnimatedText({
  children,
  as: Tag = "div",
  className,
  splitBy = "words",
  delay = 0,
  stagger = 0.03,
  start = "top 85%",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap } = getGsap();

    const split = new SplitType(el, { types: "lines,words,chars" });
    const targets =
      splitBy === "chars" ? split.chars : splitBy === "lines" ? split.lines : split.words;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 115, opacity: 0, rotateZ: 4 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start,
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [children, splitBy, delay, stagger, start]);

  return React.createElement(
    Tag,
    { ref, className: cn(className) },
    children
  );
}
