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
        <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase backdrop-blur">
          <span className="bg-accent h-1.5 w-1.5 rounded-full" />
          Frühjahrs­selektion 2026
        </span>

        <h1 className="font-display text-foreground text-[clamp(2.8rem,8vw,6rem)] leading-[0.98] font-medium tracking-tight">
          Jeder Schluck ein
          <br />
          <span className="text-accent italic">Ortswechsel.</span>
        </h1>

        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          Wir reisen, wir verkosten, wir wählen aus — und schicken dir das,
          was wir selbst am liebsten trinken. Keine Algorithmen, kein Marketing,
          nur ehrliche Empfehlungen.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="/probierset"
            className="group bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all hover:gap-3"
          >
            Probierset bestellen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/abo"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            oder als Abo →
          </a>
        </div>

        <p className="text-muted-foreground/80 mt-4 text-xs">
          Versand­kostenfrei ab 80 € · 30 Tage Rückgaberecht
        </p>
      </div>
    </section>
  )
}
