import { motion, useReducedMotion } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { BUCHART_FONTS } from '../family-fonts'
import { Bottle, RibbonFill, Signet, Stars } from '../buchart-kit'
import { RATING, type Glass, type LabelCode } from '../buchart-data'
import { CountUp } from '../count-up'

/**
 * Buch·Art — der Claim der Original-Seite („Wein erleben im Weinort Sooss“) als
 * große Goudy-Zeile, daneben die drei Etikettenfarben als Flaschen vor dem
 * Buch-Signet, das sich beim Laden mit Feder zeichnet. Die Fakten-Zeile unten
 * nimmt die Banner der alten Startseite auf, ohne Großbuchstaben-Rufe.
 */

const SHELF: { code: LabelCode; glass: Glass; name: string; sub?: string; vintage: number; caption: string; width: string }[] = [
  { code: 'weiss', glass: 'gruen', name: 'Grüner Veltliner', vintage: 2025, caption: 'Creme · Grün — die Weißweine', width: 'max-w-[8.4rem]' },
  { code: 'schwarz', glass: 'gruen', name: 'B 58', sub: 'Weißburgunder', vintage: 2023, caption: 'Kohle · Rot — Simons Linie', width: 'max-w-[9.6rem]' },
  { code: 'rot', glass: 'dunkel', name: 'Coorbeau noir', sub: 'Der schwarze Rabe', vintage: 2024, caption: 'Bordeaux — die großen Roten', width: 'max-w-[8.4rem]' },
]

const FACTS = [
  { value: '8–19', unit: 'Uhr', label: 'Ab Hof, täglich — auch Sonn- und Feiertag' },
  { value: '60', count: 60, unit: 'Weine', label: 'Trocken, lieblich und süß im Online-Shop' },
  { value: '5,0', unit: '', label: `aus ${RATING.count} Google-Bewertungen`, stars: true },
  { value: '12er', unit: 'Karton', label: 'Versandkostenfrei in ganz Österreich' },
]

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f3e8]'

export function HeroBuchArt() {
  const reduce = useReducedMotion()

  return (
    <section style={BUCHART_FONTS} className="relative overflow-hidden bg-[#f7f3e8] px-6 pt-16 lining-nums pb-14 text-[#1c1a17] lg:px-16 lg:pt-24">
      <div className="mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pb-16">
          <BlurFade delay={100}>
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#7d6226] uppercase">
              Familienweingut · Sooss · Thermenregion
            </p>
          </BlurFade>
          <BlurFade delay={220}>
            <h1 className="font-display mt-7 text-[clamp(3.1rem,8.2vw,7.6rem)] leading-[0.93] tracking-[-0.015em]">
              Wein erleben
              <br />
              <span className="italic text-[#9e1919]">im Weinort</span> Sooss.
            </h1>
          </BlurFade>
          <BlurFade delay={360}>
            <p className="mt-9 max-w-[34rem] text-[1.0625rem] leading-[1.7] text-[#5e574b]">
              Familie Buchart, Hauptstraße 58. Eigene Weine von trocken bis süß, Flaschen
              mit Ihrem persönlichen Etikett, Rebstöcke zum Verschenken und Wanderungen
              durch die Soosser Rieden — mit dem Kellermeister.
            </p>
          </BlurFade>
          <BlurFade delay={480}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="/weinshop" className={`group relative inline-flex min-h-12 items-center py-3 pr-11 pl-7 text-[14px] font-medium text-[#f7f3e8] ${FOCUS}`}>
                <RibbonFill />
                <span className="relative">Zum Weinshop</span>
              </a>
              <a href="/etiketten" className={`group inline-flex min-h-11 items-center gap-3 text-[14px] font-medium ${FOCUS}`}>
                Eigenes Etikett gestalten
                <span aria-hidden="true" className="h-px w-6 bg-[#be9f55] transition-all duration-500 group-hover:w-12 group-hover:bg-[#9e1919]" />
              </a>
            </div>
          </BlurFade>
        </div>

        {/* Das Regal: drei Etikettenfarben vor dem Signet. */}
        <div className="relative lg:col-span-5">
          <Signet draw strokeWidth={0.4} className="pointer-events-none absolute -top-6 left-1/2 w-[112%] max-w-none -translate-x-1/2 text-[#be9f55] opacity-70" />
          <ul className="relative grid grid-cols-3 items-end gap-3 border-b border-[#be9f55] px-2 sm:gap-6 sm:px-6">
            {SHELF.map((b, i) => (
              <motion.li
                key={b.name}
                className="group flex flex-col items-center"
                initial={reduce ? false : { opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20, delay: reduce ? 0 : 0.5 + i * 0.14 }}
              >
                <Bottle
                  code={b.code}
                  glass={b.glass}
                  name={b.name}
                  sub={b.sub}
                  vintage={b.vintage}
                  label={`${b.name} ${b.vintage}`}
                  className={`h-auto w-full ${b.width} drop-shadow-[10px_18px_18px_rgba(28,26,23,0.22)] transition-transform duration-500 group-hover:-translate-y-2`}
                />
              </motion.li>
            ))}
          </ul>
          <ul className="mt-4 grid grid-cols-3 gap-3 px-2 text-center text-[10.5px] leading-snug text-[#5e574b] sm:gap-6 sm:px-6">
            {SHELF.map(b => (
              <li key={b.caption}>{b.caption}</li>
            ))}
          </ul>
        </div>
      </div>

      <BlurFade delay={700} className="mx-auto mt-20 max-w-7xl">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[#ddd3bc] pt-8 lg:grid-cols-4">
          {FACTS.map(f => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="font-display text-[2.6rem] leading-none">
                  {f.count !== undefined ? <CountUp value={f.count} /> : f.value}
                </span>
                {f.unit && <span className="ml-2 text-[13px] text-[#7d6226]">{f.unit}</span>}
                {f.stars && <Stars value={RATING.value} className="ml-3 h-4 text-[#be9f55]" />}
                <span aria-hidden="true" className="mt-3 block max-w-[15rem] text-[13px] leading-snug text-[#5e574b]">
                  {f.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </BlurFade>
    </section>
  )
}
