import { AnimatedText } from "@/components/ui/animated-text";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Outro() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-background px-6 py-32 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,_rgba(79,224,196,0.18),_transparent_60%)]" />

      <span className="text-xs font-medium uppercase tracking-[0.35em] text-muted">
        Cierre — 04
      </span>

      <AnimatedText
        as="h2"
        splitBy="words"
        stagger={0.05}
        className="max-w-4xl text-[clamp(2.25rem,7.5vw,6.5rem)] font-semibold leading-[0.98] tracking-tight text-foreground"
      >
        Construyamos algo insondable.
      </AnimatedText>

      <div className="mt-6">
        <MagneticButton href="mailto:hola@marea.studio" cursorLabel="Saludar">
          Iniciar una conversación
        </MagneticButton>
      </div>

      <footer className="mt-24 flex w-full max-w-4xl flex-col items-center gap-6 border-t border-line pt-8 text-xs uppercase tracking-[0.3em] text-muted sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Marea Studio</span>
        <div className="flex gap-6">
          <a href="#" data-cursor="Abrir" data-cursor-variant="text">
            Instagram
          </a>
          <a href="#" data-cursor="Abrir" data-cursor-variant="text">
            Twitter
          </a>
          <a href="#" data-cursor="Abrir" data-cursor-variant="text">
            LinkedIn
          </a>
        </div>
      </footer>
    </section>
  );
}
