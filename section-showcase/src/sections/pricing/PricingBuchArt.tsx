import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BUCHART_FONTS } from '../family-fonts'
import { RibbonFill, RunningHead, Signet } from '../buchart-kit'
import { REBSTOCK, REBSTOCK_XXL, formatEuro } from '../buchart-data'

/**
 * Buch·Art — die Rebstockmiete, „das einzigartige Original im Weinort Sooss“.
 * Alle Varianten der Original-Seite als Ledger, Laufzeit umschaltbar. Rechts
 * entsteht die Urkunde, die es wirklich gibt (in der Holzkassette, zugleich
 * Ticket für Wanderung und Verkostung) — der Name tippt sich live hinein.
 */

const SERVICES = [
  'Holzkassette mit Urkunde und 3 Flaschen mit individuellem Etikett',
  '12 Flaschen „persönlicher Wein von seinen Reben“ pro Jahr, mit eigenem Etikett',
  'Geführte Riedenwanderung für 4 Personen zu den „eigenen“ Rebstöcken',
  'Weinverkostung für 4 Personen mit Aufstrichbroten',
]

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8]'

export function PricingBuchArt() {
  const [years, setYears] = useState<1 | 2>(1)
  const [variety, setVariety] = useState(REBSTOCK[0].variety)
  const [name, setName] = useState('')
  const reduce = useReducedMotion()
  const uid = useId()
  const pick = REBSTOCK.find(r => r.variety === variety) ?? REBSTOCK[0]

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="III" title="Rebstockmiete" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#7d6226] uppercase">Das einzigartige Original im Weinort Sooss</p>
            <h2 className="font-display mt-6 text-[clamp(2.7rem,5.8vw,5rem)] leading-[0.97]">
              Sechs Rebstöcke,
              <br />
              <span className="italic text-[#9e1919]">ein ganzer Jahrgang.</span>
            </h2>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-[1.7] text-[#5e574b]">
              Für die Hochzeit, den runden Geburtstag, die Sponsion oder zu Weihnachten. Wir vermieten
              Rebstöcke — die Hege und Pflege „Ihrer“ Reben übernehmen selbstverständlich wir.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
              <fieldset>
                <legend className="sr-only">Laufzeit</legend>
                <div className="inline-flex border border-[#1c1a17]/20">
                  {([1, 2] as const).map(y => (
                    <label key={y} className="cursor-pointer">
                      <input type="radio" name={`${uid}-years`} checked={years === y} onChange={() => setYears(y)} className="peer sr-only" />
                      <span className="flex min-h-11 items-center px-5 text-[13.5px] transition-colors peer-checked:bg-[#1c1a17] peer-checked:text-[#f7f3e8] peer-focus-visible:ring-2 peer-focus-visible:ring-[#9e1919] peer-focus-visible:ring-offset-2 hover:bg-[#1c1a17]/5">
                        {y === 1 ? '1 Jahr · 12 Flaschen' : '2 Jahre · 24 Flaschen'}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="text-[12.5px] text-[#5e574b]">Gesamtpreis inkl. Kassette, Urkunde und Ernte</p>
            </div>

            <fieldset className="mt-6">
              <legend className="sr-only">Rebsorte</legend>
              <div className="divide-y divide-[#ddd3bc] border-y border-[#ddd3bc]">
                {REBSTOCK.map(r => {
                  const active = r.variety === variety
                  const price = years === 1 ? r.one : r.two
                  return (
                    <label key={r.variety} className="group relative flex cursor-pointer items-center gap-5 py-5 pl-7">
                      <input type="radio" name={`${uid}-variety`} aria-label={`${r.variety}, 6 Rebstöcke, ${r.ried}, ${formatEuro(price)}`} checked={active} onChange={() => setVariety(r.variety)} className="peer sr-only" />
                      <span aria-hidden="true" className={`absolute top-0 left-0 h-12 w-2.5 origin-top bg-[#9e1919] transition-transform duration-500 ${active ? 'scale-y-100' : 'scale-y-0'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)' }} />
                      <span className="absolute inset-0 peer-focus-visible:ring-2 peer-focus-visible:ring-[#9e1919] peer-focus-visible:ring-inset" />
                      <span className="min-w-0 flex-1">
                        <span className="font-display block text-[1.7rem] leading-tight transition-transform duration-500 group-hover:translate-x-1">{r.variety}</span>
                        <span className="text-[13px] text-[#5e574b]">6 Rebstöcke · {r.ried}</span>
                      </span>
                      <span className="font-display relative h-9 w-32 overflow-hidden text-right text-[1.9rem] leading-9">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={price}
                            className="absolute inset-0"
                            initial={reduce ? false : { y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={reduce ? undefined : { y: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          >
                            {formatEuro(price)}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 bg-[#1e1d1b] px-7 py-6 text-[#f0e8c3]">
              <span>
                <span className="font-display text-[1.7rem]">XXL</span>
                <span className="ml-3 text-[13.5px] text-[#d7c69f]">
                  {REBSTOCK_XXL.stocks} Rebstöcke {REBSTOCK_XXL.variety} · 2 Jahre · {REBSTOCK_XXL.bottles} Flaschen
                </span>
              </span>
              <span className="font-display text-[1.9rem] text-[#be9f55]">{formatEuro(REBSTOCK_XXL.price)}</span>
            </div>

            <ul className="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {SERVICES.map(s => (
                <li key={s} className="flex gap-3 text-[14.5px] leading-snug">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#be9f55]" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] text-[#5e574b]">Weitere Personen bei Wanderung und Verkostung: 15 € pro Person.</p>
          </div>

          {/* Die Urkunde — der Name schreibt sich live hinein. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-10">
              <label htmlFor={`${uid}-name`} className="block text-[11px] font-medium tracking-[0.2em] text-[#7d6226] uppercase">
                Ausgestellt auf
              </label>
              <input
                id={`${uid}-name`}
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={40}
                placeholder="Name des Beschenkten"
                className="mt-2 w-full border-0 border-b border-[#1c1a17]/25 bg-transparent px-0 py-2.5 text-[15px] placeholder:text-[#5e574b]/70 focus:border-[#9e1919] focus:ring-0 focus-visible:outline-none"
              />

              <figure className="relative mt-8 bg-[#f0e8c3] p-3 shadow-[18px_26px_40px_-22px_rgba(28,26,23,0.45)]">
                <div className="border border-[#be9f55] p-1.5">
                  <div className="flex aspect-[3/4] flex-col items-center border border-[#be9f55]/60 px-6 py-8 text-center text-[#15420c]">
                    <Signet className="h-9 w-14 text-[#7d6226]" />
                    <p className="font-display mt-4 text-[2.2rem] leading-none">Urkunde</p>
                    <p className="mt-2 text-[10px] font-medium tracking-[0.3em] uppercase">Rebstockmiete</p>
                    <p className="font-display mt-6 text-[1rem] italic">für</p>
                    <p className="font-display mt-1 min-h-[2.4rem] w-full border-b border-[#15420c]/30 pb-1 text-[1.75rem] leading-tight break-words">
                      {name || <span className="text-[#15420c]/35">…</span>}
                    </p>
                    <p className="mt-5 text-[12.5px] leading-relaxed">
                      6 Rebstöcke {pick.variety}
                      <br />
                      {pick.ried}
                      <br />
                      Dauer der Miete: {years === 1 ? 'ein Jahr' : 'zwei Jahre'}
                    </p>
                    <p className="mt-auto pt-4 text-[10.5px] leading-snug text-[#15420c]/80">
                      Gilt als Ticket für Riedenwanderung und Weinkost.
                      <br />
                      Weingut Buchart 58 · Sooss
                    </p>
                  </div>
                </div>
                <figcaption className="sr-only">Vorschau der Urkunde</figcaption>
              </figure>

              <a href="/rebstockmiete/anfrage" className={`group relative mt-8 inline-flex min-h-12 w-full items-center justify-center py-3 pr-8 pl-6 text-[14px] font-medium text-[#f7f3e8] ${FOCUS}`}>
                <RibbonFill />
                <span className="relative">Unverbindlich anfragen · {formatEuro(years === 1 ? pick.one : pick.two)}</span>
              </a>
              <p className="font-display mt-8 text-[1.15rem] leading-snug italic text-[#5e574b]">
                „Natürlich können Sie auch ein Grundstück auf dem Mond kaufen oder einem Stern einen Namen geben …“
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-[#5e574b]">Die Miete ist rein symbolisch. Die Urkunde ist kein Gutschein und gilt bis zum festgelegten Datum.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
