import { useId, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { NumeralReveal } from '@components/numeral-reveal/numeral-reveal'
import { cn } from '@components/lib/utils'
import { TasteDiamond, type DiamondTheme } from './taste-diamond'
import { AXES, AXIS_LABEL, TASTE_WINES, ZERO_VALUES } from './taste-data'

/**
 * Maison Editorial — the taste diamond as a tasting note in a magazine. Six hairline-separated
 * entries with oversized italic numerals, a small monochrome diamond beside them. Hovering an
 * entry marks its axis in the diamond and vice versa; hovering the diamond opens a tooltip with the
 * value. Cream ground, zinc ink.
 */

const THEME: DiamondTheme = {
  grid: '#e4e4e7',
  gridOuter: '#a1a1aa',
  spoke: '#e4e4e7',
  spokeActive: '#18181b',
  dotRing: '#fdfcf9',
  label: 'text-zinc-600 hover:text-zinc-900',
  labelActive: 'text-zinc-900',
  value: '',
  focus: 'focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none',
  tip: 'border border-zinc-200 bg-[#fdfcf9] text-zinc-900 shadow-[0_10px_30px_-12px_rgba(24,24,27,0.3)]',
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

export function TasteEditorial() {
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const groupName = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const wine = TASTE_WINES[index]

  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl lg:mb-20">
          <BlurFade delay={100} direction="up">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-500 uppercase">Verkostungsnotiz</span>
          </BlurFade>
          <BlurFade delay={250} direction="up">
            <h2 className="font-display mt-6 text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.88] font-light tracking-tighter text-zinc-900">
              Sechs Eindrücke,
              <br />
              <span className="italic">ein Wein.</span>
            </h2>
          </BlurFade>
        </div>

        <fieldset className="mb-12">
          <legend className="sr-only">Wein wählen</legend>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {TASTE_WINES.map((w, i) => (
              <label
                key={w.slug}
                className="group relative flex min-h-11 cursor-pointer items-center gap-2.5 border-b border-transparent text-[15px] text-zinc-500 transition-[color,border-color] duration-300 hover:text-zinc-900 has-checked:border-zinc-900 has-checked:text-zinc-900 has-focus-visible:ring-2 has-focus-visible:ring-zinc-900"
              >
                <input type="radio" name={groupName} className="sr-only" checked={index === i} onChange={() => setIndex(i)} />
                <span aria-hidden="true" className="text-[9px] font-bold tracking-[0.3em] uppercase">
                  {ROMAN[i]}
                </span>
                <span className="font-display text-[1.25rem] italic">
                  {w.name}
                  {w.sub && ` ${w.sub}`}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div ref={ref} className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <ol>
            {AXES.map((key, i) => (
              <li
                key={key}
                onPointerEnter={e => e.pointerType === 'mouse' && setActive(i)}
                onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
                className={cn(
                  "relative grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-5 border-t border-zinc-200 py-6 transition-opacity duration-300 last:border-b before:absolute before:inset-x-0 before:-top-px before:h-px before:origin-left before:scale-x-0 before:bg-zinc-900 before:transition-transform before:duration-500 before:ease-out before:content-[''] motion-reduce:before:transition-none",
                  active === i && 'before:scale-x-100',
                  active !== null && active !== i && 'opacity-45',
                )}
              >
                <span aria-hidden="true" className="self-start pt-2 text-[9px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
                  <NumeralReveal numeral={ROMAN[i]} />
                </span>
                <div>
                  <h3 className={cn('text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-200', active === i ? 'text-zinc-900' : 'text-zinc-500')}>
                    {AXIS_LABEL[key]}
                  </h3>
                  <p className="font-display mt-1.5 text-[1.2rem] leading-snug font-light text-zinc-700">{wine.texts[i]}</p>
                </div>
                <span
                  className={cn(
                    'font-display text-[clamp(2.6rem,5vw,4rem)] leading-[0.8] font-light tracking-tighter italic tabular-nums transition-colors duration-300',
                    active === i ? 'text-zinc-900' : 'text-zinc-400',
                  )}
                >
                  {wine.values[i]}
                  <span className="sr-only"> von 10</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="lg:sticky lg:top-12 lg:self-start">
            <TasteDiamond
              series={[{ name: wine.name, values: inView ? wine.values : ZERO_VALUES, fill: 'rgba(24,24,27,0.06)', stroke: '#18181b', dot: '#18181b' }]}
              theme={THEME}
              active={active}
              onActive={setActive}
              hints={wine.texts}
              ariaLabel={`Geschmacksprofil ${wine.name}`}
            />
            {wine.note && <p className="mx-auto mt-6 max-w-sm text-center text-base leading-relaxed font-light text-zinc-600">{wine.note}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
