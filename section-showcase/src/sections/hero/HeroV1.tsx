import { ArrowRight } from 'lucide-react'

export function HeroV1() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-32">
        <div className="flex flex-col gap-8">
          <span className="text-muted-foreground inline-flex w-fit items-center gap-2 text-[11px] font-medium tracking-[0.22em] uppercase">
            <span className="bg-accent h-px w-8" />
            Maison fondée en 1958
          </span>

          <h1 className="font-display text-foreground text-[clamp(2.6rem,6.5vw,4.8rem)] leading-[1.02] font-medium tracking-[-0.02em]">
            Weine, die sich
            <br />
            <span className="text-accent italic">erzählen lassen.</span>
          </h1>

          <p className="text-muted-foreground max-w-md text-base leading-relaxed">
            Eine kuratierte Auswahl aus kleinen Gütern Frankreichs und Italiens —
            direkt vom Winzer, ohne Zwischenhändler, mit Geschichte zu jedem Etikett.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/kollektion"
              className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
            >
              Kollektion entdecken
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/winzer"
              className="text-foreground decoration-border hover:decoration-foreground text-sm font-medium underline underline-offset-4"
            >
              Unsere Winzer kennenlernen
            </a>
          </div>

          <dl className="border-border mt-4 flex gap-10 border-t pt-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Güter</dt>
              <dd className="font-display text-foreground mt-1 text-2xl">42</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cuvées</dt>
              <dd className="font-display text-foreground mt-1 text-2xl">218</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Jahrgänge</dt>
              <dd className="font-display text-foreground mt-1 text-2xl">2014–24</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="bg-accent/10 absolute -inset-6 -z-10 rounded-2xl blur-2xl" />
          <div className="border-border bg-card overflow-hidden rounded-xl border">
            <img
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80"
              alt="Weinkeller mit Eichenfässern"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <figcaption className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
            <span>Domaine Lacombe · Côtes du Rhône</span>
            <span className="tabular-nums">Jg. 2021</span>
          </figcaption>
        </div>
      </div>
    </section>
  )
}
