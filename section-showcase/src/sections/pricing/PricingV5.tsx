import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Maison Editorial — das Rebstock-Abonnement als editoriale Preistafel. Drei Stufen als
 * Hairline-geführte Spalten mit römischen Ziffern, übergroßen Serif-Preisen und stillen
 * CTAs; die empfohlene Stufe trägt einen Bordeaux-Rahmen. Cream-Grund. Distinkt zu
 * PricingV2 (PricingInteraction) und PricingV4 (Le Cercle Ledger).
 */

const TIERS: Array<{
  roman: string
  name: string
  price: string
  cadence: string
  note: string
  featured?: boolean
  includes: string[]
}> = [
  {
    roman: 'I',
    name: 'Connaisseur',
    price: '49',
    cadence: '/ Monat',
    note: 'Der Einstieg',
    includes: ['3 Flaschen, kuratiert', 'Jahrgangsheft je Lieferung', 'Ab Hof abholbar'],
  },
  {
    roman: 'II',
    name: 'Grand Cru',
    price: '89',
    cadence: '/ Monat',
    note: 'Empfohlen',
    featured: true,
    includes: ['6 Flaschen inkl. Raritäten', 'Zwei Plätze bei Kellerführungen', 'Erstzugriff auf Neuerscheinungen'],
  },
  {
    roman: 'III',
    name: 'Millésime',
    price: '159',
    cadence: '/ Monat',
    note: 'Die Sammlung',
    includes: ['12 Flaschen & Magnums', 'Private Verkostung im Keller', 'Eigener Rebstock im Abo'],
  },
]

export function PricingV5() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — left edge */}
      <div className="absolute top-1/2 left-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="right">
          <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Le Club · Édition MMXXVI
          </span>
        </BlurFade>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 max-w-3xl lg:mb-24">
          <BlurFade delay={100} direction="up">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Rebstock-Abonnement</span>
          </BlurFade>
          <BlurFade delay={250} direction="up">
            <h2 className="font-display mt-6 text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.88] font-light tracking-tighter text-zinc-900">
              Ein Abo für
              <br />
              <span className="italic">Kenner.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={400} direction="up">
            <p className="mt-6 max-w-md text-lg leading-relaxed font-light text-zinc-500">
              Jeden Monat eine kuratierte Auswahl unserer besten Jahrgänge — direkt aus dem Keller.
            </p>
          </BlurFade>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {TIERS.map((tier, i) => (
            <BlurFade key={tier.name} delay={500 + i * 150} direction="up" className="flex">
              <article
                className={
                  'flex w-full flex-col justify-between border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl lg:p-10 ' +
                  (tier.featured ? 'border-[oklch(0.42_0.15_18)] bg-white shadow-lg' : 'border-zinc-200 bg-white/60')
                }
              >
                <div>
                  <div className="flex items-baseline justify-between border-b border-zinc-100 pb-5">
                    <span className="font-display text-2xl font-light tracking-tight text-zinc-900">{tier.name}</span>
                    <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">{tier.roman}</span>
                  </div>

                  <span className="mt-5 block text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase italic">
                    {tier.note}
                  </span>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-6xl font-light tracking-tighter text-zinc-900">€ {tier.price}</span>
                    <span className="text-sm font-light text-zinc-400">{tier.cadence}</span>
                  </div>

                  <ul className="mt-8 flex flex-col">
                    {tier.includes.map((inc) => (
                      <li
                        key={inc}
                        className="flex items-baseline gap-3 border-b border-zinc-100 py-3 text-sm font-light text-zinc-600"
                      >
                        <span aria-hidden="true" className="font-display text-zinc-400 italic">—</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="/rebstock"
                  className="group mt-10 inline-flex min-h-11 items-center gap-4 text-xs font-bold tracking-[0.25em] text-zinc-900 uppercase"
                >
                  <span aria-hidden="true" className="h-px w-8 bg-zinc-900 transition-all duration-500 group-hover:w-14" />
                  Mitglied werden
                </a>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
