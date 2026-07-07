"use client";

import { useEffect, useRef } from "react";

export function Noise() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx || !ref.current) return;

    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = Math.random() * 255;
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);

    ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="noise-layer pointer-events-none fixed inset-0 z-[150] opacity-[0.35] mix-blend-overlay"
      style={{ backgroundRepeat: "repeat" }}
    />
  );
}
