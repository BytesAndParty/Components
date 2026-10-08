import { motion, useReducedMotion } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { BUCHART_FONTS } from '../family-fonts'
import { Medallion, RunningHead } from '../buchart-kit'
import { CONTACTS, FAMILY, telHref } from '../buchart-data'

/**
 * Buch·Art — der Stammbaum als Familie statt als Rebsorten-Genealogie: Anton und
 * Irmgard, darunter Simon, der laut Website Ideen „in den elterlichen Betrieb“
 * bringt, und Elias, der auf dem Familienfoto steht und einem Veltliner seinen
 * Namen gibt. Monogramme statt Porträts — echte Fotos liefert die Familie.
 * Die Linien zeichnen sich beim Einscrollen wie mit Tinte.
 */

const [anton, irmgard, simon] = FAMILY

const phoneOf = (p: (typeof FAMILY)[number]) => CONTACTS.find(c => c.name === p.call || p.name.startsWith(c.name))?.phone

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8]'

function Person({ p, delay }: { p: (typeof FAMILY)[number]; delay: number }) {
  const phone = phoneOf(p)
  return (
    <BlurFade delay={delay} className="flex flex-col items-center text-center">
      <Medallion initial={p.initial} className="h-24 w-24 bg-[#f7f3e8] text-[2.6rem]" />
      <h3 className="font-display mt-5 text-[1.9rem] leading-tight">{p.name}</h3>
      <p className="mt-1 text-[12px] font-medium tracking-[0.16em] text-[#7d6226] uppercase">{p.role}</p>
      <p className="mt-4 max-w-sm text-[15px] leading-[1.7] text-[#5e574b]">{p.text}</p>
      {phone && (
        <a href={telHref(phone)} className={`mt-4 inline-flex min-h-11 items-center text-[14px] underline decoration-[#be9f55] underline-offset-[6px] transition-colors hover:text-[#9e1919] ${FOCUS}`}>
          {p.call}: {phone}
        </a>
      )}
    </BlurFade>
  )
}

export function LineageBuchArt() {
  const reduce = useReducedMotion()
  const ink = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.5 },
          transition: { duration: 1.2, delay, ease: [0.65, 0, 0.35, 1] as const },
        }

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="V" title="Die Familie" />

        <BlurFade className="mt-14 text-center">
          <h2 className="font-display text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[0.98]">
            Eine Familie,
            <br />
            <span className="italic text-[#9e1919]">eine Hausnummer.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-[#5e574b]">
            Die 58 im Namen ist keine Jahreszahl — sie ist die Adresse: Hauptstraße&nbsp;58, Sooss.
          </p>
        </BlurFade>

        {/* Eltern */}
        <div className="relative mt-20 grid gap-16 md:grid-cols-2 md:gap-10">
          <Person p={anton} delay={100} />
          <Person p={irmgard} delay={220} />
          <span aria-hidden="true" className="font-display absolute top-9 left-1/2 hidden -translate-x-1/2 text-[1.8rem] italic text-[#be9f55] md:block">
            &amp;
          </span>
        </div>

        {/* Verbindungslinien — nur ab md, auf Mobil trägt die Reihenfolge. */}
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true" className="mt-10 hidden h-24 w-full text-[#be9f55] md:block">
          <motion.path d="M250 0v40h500V0M500 40v40" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" {...ink(0.2)} />
          <motion.path d="M250 120V80h500v40" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" {...ink(0.9)} />
        </svg>

        <p className="mt-16 text-center text-[11px] font-medium tracking-[0.28em] text-[#7d6226] uppercase md:mt-6">Die nächste Generation</p>

        <div className="mt-10 grid gap-16 md:grid-cols-2 md:gap-10">
          <Person p={simon} delay={150} />
          <BlurFade delay={270} className="flex flex-col items-center text-center">
            <Medallion initial="E" className="h-24 w-24 bg-[#f7f3e8] text-[2.6rem]" />
            <h3 className="font-display mt-5 text-[1.9rem] leading-tight">Elias</h3>
            <p className="mt-1 text-[12px] font-medium tracking-[0.16em] text-[#7d6226] uppercase">Auf dem Familienfoto</p>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.7] text-[#5e574b]">
              Und auf einem Etikett: Der <span className="font-display italic">Veltliner Elias</span> — trocken, milde Säure, fruchtige
              Frische — trägt seinen Namen.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
