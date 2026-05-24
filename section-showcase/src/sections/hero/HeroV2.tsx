import { ArrowRight } from 'lucide-react'

export function HeroV2() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Soft accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)',
        }}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-28 text-center lg:py-40">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Frühjahrs­selektion 2026
        </span>

        <h1 className="font-display text-[clamp(2.8rem,8vw,6rem)] font-medium leading-[0.98] tracking-[-0.025em] text-foreground">
          Jeder Schluck ein
          <br />
          <span className="italic text-accent">Ortswechsel.</span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Wir reisen, wir verkosten, wir wählen aus — und schicken dir das,
          was wir selbst am liebsten trinken. Keine Algorithmen, kein Marketing,
          nur ehrliche Empfehlungen.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground transition-all hover:gap-3"
          >
            Probierset bestellen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            oder als Abo →
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground/80">
          Versand­kostenfrei ab 80 € · 30 Tage Rückgaberecht
        </p>
      </div>
    </section>
  )
}
