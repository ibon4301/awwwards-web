import { AnimatedText } from "@/components/ui/animated-text";
import { Marquee } from "@/components/ui/marquee";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative flex min-h-screen flex-col justify-center gap-20 bg-background py-32"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <span className="mb-8 block text-xs font-medium uppercase tracking-[0.35em] text-muted">
          Manifiesto — 01
        </span>
        <AnimatedText
          as="p"
          splitBy="lines"
          className="text-[clamp(1.75rem,4.4vw,3.75rem)] font-medium leading-[1.15] tracking-tight text-foreground"
        >
          Creemos que las interfaces deben sentirse como una corriente —
          cada movimiento con intención, cada píxel deliberado, cada scroll
          un descenso más que un trámite.
        </AnimatedText>
      </div>

      <Marquee text="Tejido en la marea" />
    </section>
  );
}
