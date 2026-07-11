import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Le Cercle — Domaine Privée membership tiers as an engraved ledger:
 * three columns behind vertical hairlines, roman numerals, serif prices.
 * The middle tier carries the bordeaux seal; hovers stay physical and quiet.
 */

const TIERS = [
  {
    numeral: 'I',
    name: 'Freunde des Hauses',
    price: '190 €',
    cadence: 'je Jahr · 6 Flaschen',
    text: 'Der Einstieg in den Kreis — zwei Sendungen im Jahr, kuratiert vom Kellermeister.',
    features: [
      'Frühjahrs- & Herbst-Sendung',
      'Zugang zum Mitglieder-Sortiment',
      'Einladung zur Lesewoche',
    ],
    featured: false,
  },
  {
    numeral: 'II',
    name: 'Cercle Privé',
    price: '480 €',
    cadence: 'je Jahr · 12 Flaschen',
    text: 'Die Reserven des Hauses, bevor sie die Karte erreichen — inklusive der nummerierten Cuvée.',
    features: [
      'Vier Sendungen, temperiert frei Haus',
      'Cuvée des Hauses, nummeriert',
      'Jährliche Kellerdegustation zu zweit',
      'Vorkaufsrecht auf Magnums',
    ],
    featured: true,
  },
  {
    numeral: 'III',
    name: 'Réserve Perpétuelle',
    price: '1.200 €',
    cadence: 'je Jahr · eigenes Fach',
    text: 'Ein eigenes Fach im Gewölbe. Ihre Jahrgänge reifen bei uns, bis Sie sie rufen.',
    features: [
      'Privates Kellerfach, klimatisiert',
      'Alle Cercle-Privé-Leistungen',
      'Verkostung mit dem Winzer, jährlich',
      'Zugriff auf die Bibliothek ab 1997',
    ],
    featured: false,
  },
]

export function PricingV4() {
  return (
    <section className="bg-[#f6f3ec] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              Le Cercle · Mitgliedschaft
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#221b16] sm:text-6xl">
              Drei Wege in
              <br />
              den <span className="italic text-[#5c2331]">Keller.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={340} direction="up">
            <p className="mt-6 text-lg leading-relaxed font-light text-[#6f6657]">
              Kein Abo, das man vergisst — ein Platz am Tisch, den man behält.
              Jederzeit kündbar, niemals gedrängt.
            </p>
          </BlurFade>
        </div>

        {/* Ledger columns */}
        <div className="mt-20 grid grid-cols-1 gap-10 border-y border-[#ddd5c4] py-4 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-[#ddd5c4] lg:py-0">
          {TIERS.map((tier, i) => (
            <BlurFade key={tier.numeral} delay={400 + i * 150} direction="up" className="h-full">
              <article
                className={`flex h-full flex-col px-2 py-10 transition-all duration-500 hover:-translate-y-1.5 lg:px-10 lg:py-14 ${
                  tier.featured ? 'bg-[#5c2331] text-[#f6f3ec] shadow-[0_36px_72px_-36px_rgba(92,35,49,0.55)] lg:-my-6 lg:py-20' : ''
                }`}
              >
                <span
                  className={`font-display text-lg font-light italic ${
                    tier.featured ? 'text-[#d9b98f]' : 'text-[#5c2331]'
                  }`}
                >
                  {tier.numeral}
                </span>
                <h3
                  className={`font-display mt-4 text-3xl font-light tracking-tight ${
                    tier.featured ? 'text-[#f6f3ec]' : 'text-[#221b16]'
                  }`}
                >
                  {tier.name}
                </h3>
                <div className="mt-7 flex items-baseline gap-3">
                  <span
                    className={`font-display text-5xl font-light tracking-tight tabular-nums ${
                      tier.featured ? 'text-[#f6f3ec]' : 'text-[#221b16]'
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={`text-[9px] font-bold tracking-[0.25em] uppercase ${
                      tier.featured ? 'text-[#d8c3c6]' : 'text-[#a89e8a]'
                    }`}
                  >
                    {tier.cadence}
                  </span>
                </div>
                <p
                  className={`mt-5 text-sm leading-relaxed font-light ${
                    tier.featured ? 'text-[#e8d9db]' : 'text-[#6f6657]'
                  }`}
                >
                  {tier.text}
                </p>

                <ul
                  className={`mt-8 flex flex-col divide-y border-y text-sm font-light ${
                    tier.featured
                      ? 'divide-[#7a4450]/60 border-[#7a4450]/60 text-[#f0e4e6]'
                      : 'divide-[#ddd5c4]/70 border-[#ddd5c4] text-[#4d4436]'
                  }`}
                >
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-baseline gap-3 py-3">
                      <span aria-hidden="true" className={tier.featured ? 'text-[#d9b98f]' : 'text-[#5c2331]'}>
                        —
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  {tier.featured ? (
                    <a
                      href="/cercle"
                      className="inline-flex min-h-11 w-full items-center justify-center bg-[#f6f3ec] px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] text-[#5c2331] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)] focus-visible:ring-2 focus-visible:ring-[#f6f3ec]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#5c2331] focus-visible:outline-none"
                    >
                      Dem Cercle beitreten
                    </a>
                  ) : (
                    <a
                      href="/cercle"
                      className="group inline-flex min-h-11 items-center gap-4 text-[11px] font-bold tracking-[0.25em] text-[#221b16] uppercase transition-colors hover:text-[#5c2331] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
                    >
                      <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
                      Anfragen
                    </a>
                  )}
                </div>
              </article>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={900}>
          <p className="mt-12 text-center font-display text-sm font-light text-[#8a8070] italic">
            Mitgliedschaften ruhen, wenn Sie es wünschen — Wein wartet geduldig, wir auch.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
