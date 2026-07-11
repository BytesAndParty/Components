import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Die Rebstockmiete (Maison Editorial) — das reale Buchart-Angebot als Magazin-
 * Doppelseite statt Preistafel: Headline überlappt die hängende Foto-Tafel
 * (HeroV6-Sprache), die Stufen sind ein box-freies Hairline-Ledger mit
 * übergroßen italic Serif-Preisen, Fußnoten-Ziffern und der Randnotiz
 * „Die Miete ist rein symbolisch". Inhalte & Preise: buchart58.at/rebstock-miete.
 */

const TIERS: Array<{
  roman: string
  name: string
  duration: string
  data: string
  price: string
  footnote?: string
  featured?: boolean
}> = [
  {
    roman: 'I',
    name: 'Ein Jahr',
    duration: 'Zwölf Monate',
    data: '6 Rebstöcke · 12 Flaschen mit eigenem Etikett',
    price: 'ab 220,–',
    footnote: '1',
  },
  {
    roman: 'II',
    name: 'Zwei Jahre',
    duration: 'Vierundzwanzig Monate',
    data: '6 Rebstöcke · 24 Flaschen mit eigenem Etikett',
    price: 'ab 290,–',
    footnote: '1',
    featured: true,
  },
  {
    roman: 'XXX',
    name: 'La Grande',
    duration: 'Zwei Jahre',
    data: '30 Rebstöcke · die ganze Zeile gehört Ihnen',
    price: '820,–',
  },
]

const INCLUDED = [
  { n: '3', label: 'Flaschen zur Übergabe, personalisiert, in der Holzkassette' },
  { n: '1', label: 'Urkunde auf den Namen — zugleich Ihr Ticket' },
  { n: 'IV', label: 'Plätze bei der geführten Riedenwanderung' },
  { n: 'IV', label: 'Plätze bei der Verkostung, mit Aufstrichbroten' },
]

export function PricingV6() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — right edge */}
      <div className="absolute top-1/2 right-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="left">
          <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Rebstockmiete · Sooss · Anno 1958
          </span>
        </BlurFade>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Layered opener: photo plate, headline overlapping from the right */}
        <div className="relative mb-20 lg:mb-28">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative max-w-md">
              <RevealImage
                src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1200&q=80"
                alt="Rebzeile im Abendlicht — sechs Stöcke der Rebstockmiete"
                direction="up"
                duration={1400}
                className="aspect-3/4 w-full shadow-[24px_32px_60px_-24px_rgba(24,24,27,0.25)]"
              />
              <BlurFade delay={700} direction="up">
                <p className="mt-4 flex items-baseline justify-between text-zinc-400">
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Fig. 01</span>
                  <span className="font-display text-sm italic">Sechs Stöcke, kurz vor der Lese</span>
                </p>
              </BlurFade>
            </div>

            <div className="lg:absolute lg:top-10 lg:right-0 lg:z-10 lg:w-[62%]">
              <BlurFade delay={150} direction="up">
                <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                  Das Geschenk für Weinliebhaber
                </span>
              </BlurFade>
              <BlurFade delay={300} direction="up">
                {/* Nur die Headline hängt über die Foto-Tafel (Maison-Overlap) —
                    Kicker und Fließtext bleiben rechts davon lesbar. */}
                <h2 className="font-display mt-6 text-[clamp(3rem,7.5vw,7rem)] leading-[0.92] font-light tracking-tighter text-zinc-900 lg:relative lg:left-[-24%] lg:w-[124%]">
                  Sechs Stöcke tragen <span className="italic">Ihren</span>
                  <br />
                  <span className="italic">Namen.</span>
                </h2>
              </BlurFade>
              <BlurFade delay={450} direction="up">
                <p className="mt-8 max-w-md text-lg leading-relaxed font-light text-zinc-500">
                  Ein Jahr oder zwei gehört eine Rebzeile in Sooss Ihnen — mit Urkunde,
                  eigenem Etikett und einem Wiedersehen bei Wanderung und Verkostung.
                </p>
              </BlurFade>
            </div>
          </div>
        </div>

        {/* The ledger — three tiers, no boxes */}
        <div className="mx-auto max-w-5xl">
          <ul>
            {TIERS.map((tier, i) => (
              <li key={tier.name}>
                <BlurFade delay={400 + i * 150} direction="up">
                  <a
                    href="/rebstockmiete"
                    className="group grid min-h-11 grid-cols-1 items-baseline gap-2 border-t border-zinc-200 py-8 transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-[oklch(0.42_0.15_18)]/60 focus-visible:ring-offset-4 focus-visible:outline-none sm:grid-cols-[3rem_1fr_auto] sm:gap-8"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        'font-display text-lg font-light italic ' +
                        (tier.featured ? 'text-[oklch(0.42_0.15_18)]' : 'text-zinc-400')
                      }
                    >
                      {tier.roman}
                    </span>

                    <span className="flex flex-col gap-1.5 transition-transform duration-500 group-hover:translate-x-2">
                      <span className="flex items-baseline gap-4">
                        <span className="font-display text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">
                          {tier.name}
                        </span>
                        {tier.featured && (
                          <span className="text-[9px] font-bold tracking-[0.3em] text-[oklch(0.42_0.15_18)] uppercase">
                            Empfohlen
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                        {tier.duration} · {tier.data}
                      </span>
                    </span>

                    <span className="flex items-baseline gap-1 justify-self-start sm:justify-self-end">
                      <span className="font-display text-4xl font-light tracking-tighter text-zinc-900 italic transition-colors duration-300 group-hover:text-[oklch(0.42_0.15_18)] sm:text-5xl">
                        {tier.price}
                      </span>
                      {tier.footnote && (
                        <sup className="font-display text-sm text-zinc-400 italic">{tier.footnote}</sup>
                      )}
                    </span>
                  </a>
                </BlurFade>
              </li>
            ))}
          </ul>

          {/* Included in every tier — quiet data over a hairline */}
          <BlurFade delay={850} direction="up">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-zinc-200 pt-10 lg:grid-cols-4">
              {INCLUDED.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <span className="font-display text-4xl font-light tracking-tighter text-zinc-900 italic">
                    {item.n}
                  </span>
                  <span className="text-xs leading-relaxed font-light text-zinc-500">{item.label}</span>
                </div>
              ))}
            </div>
          </BlurFade>

          {/* Colophon line: footnote, varietals, CTA */}
          <BlurFade delay={1000} direction="up">
            <div className="mt-16 flex flex-col gap-8 border-t border-zinc-200 pt-8 lg:flex-row lg:items-baseline lg:justify-between">
              <div className="max-w-md">
                <p className="font-display text-sm leading-relaxed text-zinc-400 italic">
                  <sup>1</sup> je nach Rebsorte — die Miete ist rein symbolisch, die Urkunde
                  Ihr Ticket für Wanderung und Verkostung.
                </p>
                <p className="mt-3 text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  Zweigelt · Grüner Veltliner · Merlot · Chardonnay
                </p>
              </div>
              <a
                href="/rebstockmiete"
                className="group inline-flex min-h-11 items-center gap-4 text-xs font-bold tracking-[0.25em] text-zinc-900 uppercase focus-visible:ring-2 focus-visible:ring-[oklch(0.42_0.15_18)]/60 focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-12 bg-zinc-900 transition-all duration-500 group-hover:w-20"
                />
                Rebstock mieten
              </a>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
