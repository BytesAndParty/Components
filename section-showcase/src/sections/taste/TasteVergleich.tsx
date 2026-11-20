import { useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { BUCHART_FONTS } from '../family-fonts'
import { TasteDiamond, type DiamondTheme } from './taste-diamond'
import { AXES, AXIS_LABEL, TASTE_WINES, ZERO_VALUES, type TasteWine } from './taste-data'

/**
 * Wein gegen Wein — two wines on one diamond, wine A in label green, wine B in ribbon red. Below,
 * a table gives the exact numbers per axis with a bar each; the letters A and B make the two
 * readable without colour. Rows and axis names mark the same axis in the diamond.
 */

const GREEN = '#15420c'
const RED = '#9e1919'

const THEME: DiamondTheme = {
  grid: '#ddd3bc',
  gridOuter: '#be9f55',
  spoke: '#ddd3bc',
  spokeActive: '#7d6226',
  dotRing: '#fdfcf9',
  label: 'text-[#5e574b] hover:text-[#1c1a17]',
  labelActive: 'text-[#7d6226]',
  value: '',
  focus: 'focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:outline-none',
}

const wineTitle = (w: TasteWine) => [w.name, w.sub, w.vintage].filter(Boolean).join(' ')

function WineSelect({ letter, color, value, onChange }: { letter: string; color: string; value: number; onChange: (index: number) => void }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#5e574b] uppercase">
        <span aria-hidden="true" className="h-0.5 w-6" style={{ backgroundColor: color }} />
        Wein {letter}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="font-display mt-2 min-h-12 w-full cursor-pointer border border-[#ddd3bc] bg-white px-4 text-[1.15rem] text-[#1c1a17] transition-[border-color,box-shadow] duration-300 hover:border-[#be9f55] focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:outline-none"
      >
        {TASTE_WINES.map((w, i) => (
          <option key={w.slug} value={i}>
            {wineTitle(w)}
          </option>
        ))}
      </select>
    </div>
  )
}

function Bar({ letter, value, color }: { letter: string; value: number; color: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="w-3 text-[10px] font-bold" style={{ color }}>
        {letter}
      </span>
      <span aria-hidden="true" className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#ddd3bc]/70">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{ width: `${value * 10}%` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 24 }}
        />
      </span>
      <span className="w-5 text-right text-[13px] tabular-nums">{value}</span>
    </div>
  )
}

export function TasteVergleich() {
  const [aIndex, setAIndex] = useState(0)
  const [bIndex, setBIndex] = useState(TASTE_WINES.length - 1)
  const [active, setActive] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const a = TASTE_WINES[aIndex]
  const b = TASTE_WINES[bIndex]

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[11px] font-medium tracking-[0.3em] text-[#7d6226] uppercase">Geschmacksprofil · Vergleich</p>
          <h2 className="font-display mt-5 text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.98]">
            Zwei Weine,
            <br />
            <span className="italic text-[#15420c]">ein Diamant.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[1.0625rem] leading-[1.7] text-[#5e574b]">Legen Sie zwei Weine übereinander und sehen Sie, worin sie sich unterscheiden.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <WineSelect letter="A" color={GREEN} value={aIndex} onChange={setAIndex} />
          <WineSelect letter="B" color={RED} value={bIndex} onChange={setBIndex} />
        </div>

        <div ref={ref} className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <TasteDiamond
            series={[
              { name: 'Wein A', values: inView ? a.values : ZERO_VALUES, fill: 'rgba(21,66,12,0.14)', stroke: GREEN, dot: GREEN },
              { name: 'Wein B', values: inView ? b.values : ZERO_VALUES, fill: 'rgba(158,25,25,0.12)', stroke: RED, dot: RED },
            ]}
            theme={THEME}
            active={active}
            onActive={setActive}
            ariaLabel={`Geschmacksprofil im Vergleich: ${wineTitle(a)} gegen ${wineTitle(b)}`}
          />

          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Geschmacksachsen von {wineTitle(a)} (A) und {wineTitle(b)} (B), Skala 0 bis 10
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Achse</th>
                <th scope="col">Wein A</th>
                <th scope="col">Wein B</th>
              </tr>
            </thead>
            <tbody>
              {AXES.map((key, i) => (
                <tr
                  key={key}
                  onPointerEnter={e => e.pointerType === 'mouse' && setActive(i)}
                  onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
                  className={`border-t border-[#ddd3bc] transition-colors duration-200 last:border-b ${active === i ? 'bg-[#f0e8c3]/50' : ''}`}
                >
                  <th scope="row" className="w-28 py-3.5 pr-3 pl-2 align-middle text-[11px] font-medium tracking-[0.18em] text-[#5e574b] uppercase">
                    {AXIS_LABEL[key]}
                  </th>
                  <td className="py-3.5 pr-4 align-middle">
                    <Bar letter="A" value={a.values[i]} color={GREEN} />
                    <div className="h-1.5" />
                    <Bar letter="B" value={b.values[i]} color={RED} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
