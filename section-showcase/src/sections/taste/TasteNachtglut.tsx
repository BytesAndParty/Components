import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { LABEL } from '../buchart-data'
import { TasteDiamond, type DiamondTheme } from './taste-diamond'
import { AXES, AXIS_LABEL, TASTE_WINES, ZERO_VALUES } from './taste-data'

/**
 * Nachtglut — the taste diamond as a lit object in the dark: warm black ground, a slow breathing
 * halo behind it, a blurred glow copy under the gold outline. Wines are chosen from a row of
 * pills; the name swaps with a short blur-fade while the polygon morphs.
 */

const THEME: DiamondTheme = {
  grid: 'rgba(201,162,94,0.16)',
  gridOuter: 'rgba(201,162,94,0.5)',
  spoke: 'rgba(201,162,94,0.14)',
  spokeActive: '#e8d5ae',
  dotRing: '#0d0a09',
  label: 'text-[#a89a85] hover:text-[#f3ece0]',
  labelActive: 'text-[#e8d5ae]',
  value: 'font-display text-[1.3rem] text-[#f3ece0] lining-nums',
  focus: 'focus-visible:ring-2 focus-visible:ring-[#c9a25e] focus-visible:outline-none',
}

export function TasteNachtglut() {
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const groupName = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const wine = TASTE_WINES[index]

  return (
    <section className="relative overflow-hidden bg-[#0d0a09] px-6 py-20 text-[#f3ece0] sm:py-28 lg:px-16 lg:py-36">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[56%] left-1/2 h-[48rem] w-[48rem] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(201,162,94,0.2), rgba(201,162,94,0) 70%)' }}
        animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div ref={ref} className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#c9a25e] uppercase">Nachtprobe · Geschmacksprofil</span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#f3ece0] sm:text-6xl">
              Geschmack
              <br />
              im <span className="italic"><ShinyText duration={8} shineColor="#e8d5ae">Kerzenlicht.</ShinyText></span>
            </h2>
          </BlurFade>
        </div>

        <div className="mt-14 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={wine.slug}
              initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: reduce ? 0 : 0.3 }}
            >
              <p className="text-[11px] font-medium tracking-[0.35em] text-[#c9a25e] uppercase">{wine.vintage ?? 'Ohne Jahrgang'}</p>
              <p className="font-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight font-light italic">
                {wine.name}
                {wine.sub && <span className="text-[#a89a85]"> {wine.sub}</span>}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <TasteDiamond
          className="mt-8"
          series={[{ name: wine.name, values: inView ? wine.values : ZERO_VALUES, fill: 'rgba(201,162,94,0.16)', stroke: '#e8d5ae', dot: '#c9a25e' }]}
          theme={THEME}
          active={active}
          onActive={setActive}
          ariaLabel={`Geschmacksprofil ${wine.name}`}
          glow
          showValues
        />

        <p aria-live="polite" className="font-display mx-auto mt-6 min-h-[4rem] max-w-md text-center text-[1.15rem] leading-[1.6] font-light text-[#d8cbb8] italic">
          {active !== null ? `${AXIS_LABEL[AXES[active]]} ${wine.values[active]} von 10 — ${wine.texts[active]}` : (wine.note ?? '')}
        </p>

        <fieldset className="mt-8">
          <legend className="sr-only">Wein wählen</legend>
          <div className="flex flex-wrap justify-center gap-2.5">
            {TASTE_WINES.map((w, i) => (
              <label
                key={w.slug}
                className="relative flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-[#c9a25e]/25 px-5 py-2 text-[14px] text-[#a89a85] transition-[color,border-color,background-color,transform] duration-300 hover:border-[#c9a25e]/60 hover:text-[#f3ece0] active:scale-95 has-checked:border-[#c9a25e] has-checked:bg-[#c9a25e]/10 has-checked:text-[#f3ece0] has-focus-visible:ring-2 has-focus-visible:ring-[#c9a25e]"
              >
                <input type="radio" name={groupName} className="sr-only" checked={index === i} onChange={() => setIndex(i)} />
                <span aria-hidden="true" className="h-2 w-2 rounded-full ring-1 ring-[#f3ece0]/30" style={{ backgroundColor: LABEL[w.label].band }} />
                {w.name}
                {w.sub && <span className="hidden sm:inline"> {w.sub}</span>}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  )
}
