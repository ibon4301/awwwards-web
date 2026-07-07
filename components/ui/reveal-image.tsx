"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealImageProps = ImageProps & {
  containerClassName?: string;
  imageClassName?: string;
  cursorLabel?: string;
};

export function RevealImage({
  containerClassName,
  imageClassName,
  cursorLabel,
  ...imageProps
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const imageWrap = imageRef.current;
    if (!container || !imageWrap) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: container, start: "top 90%" },
        }
      );
      gsap.fromTo(
        imageWrap,
        { scale: 1.25, yPercent: -8 },
        {
          scale: 1,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      data-cursor={cursorLabel}
      data-cursor-variant="block"
      className={cn("relative overflow-hidden", containerClassName)}
    >
      <div ref={imageRef} className="h-full w-full">
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required and enforced by ImageProps */}
        <Image
          {...imageProps}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}
