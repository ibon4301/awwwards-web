import { AnimatedText } from "@/components/ui/animated-text";
import { pseudoRandom } from "@/lib/utils";
import { Creatures } from "./creatures";

const snow = Array.from({ length: 18 }, (_, id) => ({
  id,
  left: pseudoRandom(id * 11 + 3) * 100,
  size: 1.5 + pseudoRandom(id * 11 + 5) * 2.5,
  duration: 18 + pseudoRandom(id * 11 + 7) * 20,
  delay: pseudoRandom(id * 11 + 9) * -38,
}));

export function MinimalPause() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-background px-6 py-24 text-center">
      {/* other half of the glow that starts in the bioluminescence section:
          same size and color, centered 18vh below this section's top edge */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90vw_55vh_at_50%_18vh,_rgba(10,58,68,0.55),_transparent_70%)]" />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {snow.map((s) => (
          <span
            key={s.id}
            className="snow-particle"
            style={{
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="whale-track pointer-events-none absolute left-0 top-[16%] w-[44vw] min-w-[340px] text-[#9fd4d4] opacity-[0.07]"
      >
        <div className="whale-bob">
          <svg viewBox="0 0 520 240" className="w-full blur-[1.5px]" fill="currentColor">
            <path d="M28,120 C48,96 96,78 150,74 C196,70 236,68 268,72 C316,78 372,92 428,104 C438,90 470,64 505,54 C488,82 474,102 462,116 C478,132 496,158 508,180 C482,166 448,142 430,126 C392,128 348,128 300,134 C286,152 262,182 236,196 C244,176 250,156 252,140 C200,146 130,148 74,138 C52,132 36,128 28,120 Z" />
          </svg>
        </div>
      </div>

      <Creatures />

      <div className="pointer-events-none absolute left-6 top-10 z-10 sm:left-10">
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-muted">
          Silencio — 03
        </span>
      </div>

      <div className="float-suspended relative z-10">
        <AnimatedText
          as="p"
          splitBy="words"
          stagger={0.06}
          className="max-w-xl text-[clamp(1.25rem,2.6vw,1.85rem)] font-normal leading-relaxed text-muted"
        >
          En las profundidades, el silencio también es una corriente.
        </AnimatedText>
        <span className="mt-10 block font-mono text-[11px] tracking-[0.4em] text-muted/50">
          — 3.800 M —
        </span>
      </div>
    </section>
  );
}
