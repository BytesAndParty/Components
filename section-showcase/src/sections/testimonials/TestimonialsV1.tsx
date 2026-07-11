import { GlowCard } from '@components/glow-card/glow-card'
import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Expert Quotes — token-based standard-premium treatment: one featured
 * verdict in a wide GlowCard, two quiet supporting voices below it.
 * Source lines (Publikation/Anlass) replace star ratings; the oversized
 * quote glyph carries the accent instead of icon noise.
 */

const FEATURED = {
  name: 'Marc-André Leclerc',
  role: 'Chef Sommelier · Le Bristol, Paris',
  source: 'Carte des Vins 2026',
  content:
    'Auf unserer Karte stehen dreihundert Weingüter. Nach diesem Riesling haben wir Seite eins neu gesetzt.',
}

const VOICES = [
  {
    name: 'Elena Rossi',
    role: 'Weinkritikerin · Decanter',
    source: 'Jahrgangsreport',
    content:
      'Konsistenz ist das seltenste Talent im Weinbau. Hier trinkt man sie Jahrgang für Jahrgang.',
  },
  {
    name: 'Julian Schmidt',
    role: 'Sammler',
    source: 'Privatkeller, Hamburg',
    content:
      'Ich sammle seit zwanzig Jahren. Das hier sind die Flaschen, die ich nicht mehr tausche.',
  },
]

export function TestimonialsV1() {
  return (
    <section className="bg-background py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base leading-7 font-semibold tracking-widest uppercase">Le Verdict</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              Stimmen der Experten
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-8">
          {/* Featured verdict */}
          <BlurFade delay={300}>
            <GlowCard className="relative overflow-hidden p-10 sm:p-14">
              <span
                aria-hidden="true"
                className="font-display text-accent/15 pointer-events-none absolute -top-4 left-6 text-[10rem] leading-none font-light select-none"
              >
                „
              </span>
              <figure className="relative flex flex-col gap-8">
                <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase">
                  {FEATURED.source}
                </span>
                <blockquote className="font-display text-foreground text-2xl leading-snug font-light tracking-tight sm:text-4xl">
                  {FEATURED.content}
                </blockquote>
                <figcaption className="border-border flex flex-col gap-1 border-t pt-6">
                  <span className="font-display text-foreground text-lg font-medium">{FEATURED.name}</span>
                  <span className="text-muted-foreground text-xs tracking-wider uppercase">{FEATURED.role}</span>
                </figcaption>
              </figure>
            </GlowCard>
          </BlurFade>

          {/* Supporting voices */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {VOICES.map((t, i) => (
              <BlurFade key={t.name} delay={450 + i * 120}>
                <GlowCard className="h-full p-8">
                  <figure className="flex h-full flex-col justify-between gap-8">
                    <div>
                      <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase">
                        {t.source}
                      </span>
                      <blockquote className="font-display text-foreground mt-4 text-lg leading-relaxed font-light italic">
                        „{t.content}“
                      </blockquote>
                    </div>
                    <figcaption className="border-border flex flex-col gap-1 border-t pt-5">
                      <span className="font-display text-foreground font-medium">{t.name}</span>
                      <span className="text-muted-foreground text-xs tracking-wider uppercase">{t.role}</span>
                    </figcaption>
                  </figure>
                </GlowCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
