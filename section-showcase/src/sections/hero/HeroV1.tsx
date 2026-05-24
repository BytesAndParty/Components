import { ArrowRight } from 'lucide-react'

export function HeroV1() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-32">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-px w-8 bg-accent" />
            Maison fondée en 1958
          </span>

          <h1 className="font-display text-[clamp(2.6rem,6.5vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.02em] text-foreground">
            Weine, die sich
            <br />
            <span className="italic text-accent">erzählen lassen.</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Eine kuratierte Auswahl aus kleinen Gütern Frankreichs und Italiens —
            direkt vom Winzer, ohne Zwischenhändler, mit Geschichte zu jedem Etikett.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Kollektion entdecken
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Unsere Winzer kennenlernen
            </a>
          </div>

          <dl className="mt-4 flex gap-10 border-t border-border pt-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Güter</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">42</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cuvées</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">218</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Jahrgänge</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">2014–24</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-2xl bg-accent/10 blur-2xl" />
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <img
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80"
              alt="Weinkeller mit Eichenfässern"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Domaine Lacombe · Côtes du Rhône</span>
            <span className="tabular-nums">Jg. 2021</span>
          </figcaption>
        </div>
      </div>
    </section>
  )
}
