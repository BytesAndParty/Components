import { useId, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { BUCHART_FONTS } from '../family-fonts'
import { RunningHead } from '../buchart-kit'
import { LABEL } from '../buchart-data'
import { TasteDiamond, type DiamondTheme } from './taste-diamond'
import { AXES, AXIS_LABEL, TASTE_WINES, ZERO_VALUES } from './taste-data'

/**
 * Buch·Art — the taste diamond on paper. Gold hairlines, the red reading-ribbon colour on the
 * vertices, and a list of wines whose marker is the name band of the label (green, red, bordeaux).
 * The diamond draws itself out of the centre once it scrolls into view, then morphs per wine.
 */

const THEME: DiamondTheme = {
  grid: '#ddd3bc',
  gridOuter: '#be9f55',
  spoke: '#ddd3bc',
  spokeActive: '#7d6226',
  dotRing: '#f7f3e8',
  label: 'text-[#5e574b] hover:text-[#1c1a17]',
  labelActive: 'text-[#7d6226]',
  value: 'font-display text-[1.25rem] text-[#1c1a17]',
  focus: 'focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:outline-none',
}

export function TasteBuchArt() {
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const groupName = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const wine = TASTE_WINES[index]

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="V" title="Geschmacksprofil" />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.98]">
              Sechs Achsen,
              <br />
              <span className="italic text-[#15420c]">ein Glas.</span>
            </h2>
            <p className="mt-7 max-w-md text-[1.0625rem] leading-[1.7] text-[#5e574b]">
              Süße, Säure, Körper, Tannin, Frucht und Alkohol — je Achse auf einer Skala von 0 bis 10. So lesen Sie auf einen Blick,
              wie ein Wein im Glas auftritt.
            </p>

            <fieldset className="mt-10">
              <legend className="text-[11px] font-medium tracking-[0.2em] text-[#7d6226] uppercase">Wein wählen</legend>
              <div className="mt-4 grid gap-2">
                {TASTE_WINES.map((w, i) => (
                  <label
                    key={w.slug}
                    className="relative flex min-h-12 cursor-pointer items-center gap-4 border border-[#ddd3bc] px-4 py-2 transition-[background-color,border-color,transform] duration-300 hover:border-[#be9f55] active:scale-[0.99] has-checked:border-[#be9f55] has-checked:bg-[#f0e8c3]/60 has-focus-visible:ring-2 has-focus-visible:ring-[#9e1919]"
                  >
                    <input type="radio" name={groupName} className="sr-only" checked={index === i} onChange={() => setIndex(i)} />
                    <span aria-hidden="true" className="h-6 w-1.5 shrink-0" style={{ backgroundColor: LABEL[w.label].band }} />
                    <span className="font-display text-[1.2rem] leading-tight">
                      {w.name}
                      {w.sub && <span className="text-[#5e574b] italic"> {w.sub}</span>}
                    </span>
                    {w.vintage && <span className="ml-auto text-[13px] text-[#5e574b] tabular-nums">{w.vintage}</span>}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div ref={ref} className="lg:col-span-6 lg:col-start-7">
            <div className="text-center">
              <p className="text-[11px] font-medium tracking-[0.2em] text-[#7d6226] uppercase">Geschmacksprofil{wine.vintage ? ` · ${wine.vintage}` : ''}</p>
              <p className="font-display mt-2 text-[1.9rem] leading-tight">
                {wine.name}
                {wine.sub && <span className="text-[#5e574b] italic"> {wine.sub}</span>}
              </p>
            </div>

            <TasteDiamond
              className="mt-6"
              series={[{ name: wine.name, values: inView ? wine.values : ZERO_VALUES, fill: 'rgba(190,159,85,0.28)', stroke: '#7d6226', dot: '#9e1919' }]}
              theme={THEME}
              active={active}
              onActive={setActive}
              ariaLabel={`Geschmacksprofil ${wine.name}`}
              showValues
            />

            <p aria-live="polite" className="mx-auto mt-4 min-h-[4.5rem] max-w-md border-l border-[#be9f55] pl-5 text-[15px] leading-[1.7] text-[#5e574b]">
              {active !== null ? (
                <>
                  <span className="font-medium text-[#1c1a17]">{AXIS_LABEL[AXES[active]]} {wine.values[active]} von 10</span> — {wine.texts[active]}
                </>
              ) : (
                (wine.note ?? 'Fahren Sie über eine Achse, um sie zu lesen.')
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
