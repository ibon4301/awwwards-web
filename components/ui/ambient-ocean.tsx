import { pseudoRandom } from "@/lib/utils";

const BUBBLE_COUNT = 16;

const bubbles = Array.from({ length: BUBBLE_COUNT }, (_, id) => ({
  id,
  left: pseudoRandom(id * 3 + 1) * 100,
  size: 4 + pseudoRandom(id * 3 + 2) * 14,
  duration: 14 + pseudoRandom(id * 3 + 3) * 16,
  delay: pseudoRandom(id * 5 + 7) * -20,
}));

export function AmbientOcean() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div
        className="caustic-layer absolute inset-0 opacity-[0.16] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 40% 30% at 20% 20%, rgba(79,224,196,0.5), transparent 60%), radial-gradient(ellipse 35% 25% at 80% 15%, rgba(127,212,255,0.4), transparent 60%), radial-gradient(ellipse 45% 35% at 55% 80%, rgba(79,224,196,0.35), transparent 60%)",
        }}
      />
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
