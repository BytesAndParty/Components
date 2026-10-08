import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { BUCHART_FONTS } from '../family-fonts'
import { Bottle, Ribbon, RunningHead } from '../buchart-kit'
import { CATEGORIES, LABEL, WINES, formatEuro, type LabelCode, type WineCategory } from '../buchart-data'

/**
 * Buch·Art — der Online-Shop: dieselben Kategorien wie auf buchart58.at, die Weine
 * als gezeichnete Flaschen im Etiketten-Farbcode. Statt eines Warenkorb-Badges
 * füllt sich oben ein 12er-Karton — weil im Original nur volle 12er-Kartons
 * versandkostenfrei reisen, ist das die Information, die beim Einkaufen zählt.
 */

type Filter = 'alle' | WineCategory

const TABS: { id: Filter; label: string }[] = [{ id: 'alle', label: 'Alle' }, ...CATEGORIES]

const LEGEND: { code: LabelCode; text: string }[] = [
  { code: 'weiss', text: 'Die klassischen Weißweine' },
  { code: 'schwarz', text: 'Simons Linie, Spezialitäten und die Lieblichen' },
  { code: 'rot', text: 'Die großen Roten und Raritäten' },
]

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8]'

export function StoreBuchArt() {
  const [filter, setFilter] = useState<Filter>('alle')
  const [bottles, setBottles] = useState(7)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reduce = useReducedMotion()

  const wines = filter === 'alle' ? WINES : WINES.filter(w => w.category === filter)
  const inCarton = bottles % 12 === 0 && bottles > 0 ? 12 : bottles % 12
  const fullCartons = Math.floor(bottles / 12)

  // Tabs nach WAI-ARIA: Pfeiltasten wandern, Home/End springen, Auswahl folgt dem Fokus.
  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setFilter(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="I" title="Der Weinshop" />

        <div className="mt-14 grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.95]">
              Unsere Weine, <span className="italic text-[#9e1919]">selbst erzeugt.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-[#5e574b]">
              Trocken, lieblich und süß — ein Auszug aus 60 Positionen. Ab Hof verkosten Sie jederzeit
              ohne Voranmeldung, online liefern wir nach Österreich und Deutschland.
            </p>
          </div>

          {/* Der Karton füllt sich mit jeder Flasche. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-[#ddd3bc] bg-[#fbf9f3] p-5">
              <p className="flex items-baseline justify-between text-[12px] text-[#5e574b]">
                <span className="font-medium tracking-[0.16em] text-[#7d6226] uppercase">Ihr Karton</span>
                <span aria-live="polite">
                  {bottles} {bottles === 1 ? 'Flasche' : 'Flaschen'}
                  {fullCartons > 0 && ` · ${fullCartons} × voll`}
                </span>
              </p>
              <div className="mt-4 grid grid-cols-6 gap-1.5" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className="relative h-7 overflow-hidden border border-[#ddd3bc] bg-[#f7f3e8]">
                    <motion.span
                      className="absolute inset-0 origin-bottom bg-[#15420c]"
                      initial={false}
                      animate={{ scaleY: i < inCarton ? 1 : 0 }}
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[13px] leading-snug">
                {inCarton === 12 ? 'Karton voll — versandkostenfrei in ganz Österreich.' : `Noch ${12 - inCarton} bis zum versandkostenfreien 12er-Karton.`}
              </p>
            </div>
          </div>
        </div>

        <LayoutGroup>
          <div role="tablist" aria-label="Kategorien" className="no-scrollbar mt-14 flex gap-1 overflow-x-auto border-b border-[#ddd3bc]">
            {TABS.map((t, i) => {
              const selected = filter === t.id
              return (
                <button
                  key={t.id}
                  ref={el => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`buchart-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls="buchart-shop-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setFilter(t.id)}
                  onKeyDown={e => onTabKey(e, i)}
                  className={`relative shrink-0 px-4 pt-8 pb-4 text-[13.5px] whitespace-nowrap transition-colors ${selected ? 'text-[#9e1919]' : 'text-[#5e574b] hover:text-[#1c1a17]'} ${FOCUS}`}
                >
                  {selected && (
                    <motion.span layoutId="buchart-shop-ribbon" className="absolute top-0 left-[calc(50%-6px)] w-3" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}>
                      <Ribbon className="h-6 w-3" />
                    </motion.span>
                  )}
                  {t.label}
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        <div id="buchart-shop-panel" role="tabpanel" aria-labelledby={`buchart-tab-${filter}`} className="pt-12">
          <motion.ul layout={!reduce} className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {wines.map((w, i) => (
                <motion.li
                  key={w.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { opacity: { delay: i * 0.03 }, y: { delay: i * 0.03, type: 'spring', stiffness: 300, damping: 30 } } }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  className="group flex flex-col"
                >
                  <div className="relative flex h-64 items-end justify-center bg-linear-to-b from-transparent from-40% to-[#efe9da] pb-4">
                    <Bottle
                      code={w.label}
                      glass={w.glass}
                      name={w.name}
                      sub={w.sub}
                      vintage={w.vintage}
                      size={w.size ? '0,375 l' : '0,75 l'}
                      className="h-60 w-auto drop-shadow-[8px_14px_12px_rgba(28,26,23,0.22)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-1"
                    />
                  </div>
                  <h3 className="font-display mt-5 text-[1.4rem] leading-tight">
                    {w.name} {w.vintage && <span className="text-[#7d6226]">{w.vintage}</span>}
                  </h3>
                  {w.sub && <p className="font-display text-[15px] italic text-[#5e574b]">{w.sub}</p>}
                  <p className="mt-2 text-[12px] tracking-[0.06em] text-[#5e574b]">
                    {w.taste}
                    {w.size && ' · 0,375 l'}
                  </p>
                  {w.note && <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-[#5e574b]">{w.note}</p>}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-[15px] font-medium">{formatEuro(w.price)}</span>
                    <button
                      type="button"
                      onClick={() => setBottles(b => b + 1)}
                      aria-label={`${w.name}${w.vintage ? ` ${w.vintage}` : ''} in den Karton`}
                      className={`flex h-11 w-11 items-center justify-center border border-[#1c1a17]/20 transition-[background-color,color,transform] duration-300 hover:bg-[#9e1919] hover:text-[#f7f3e8] active:scale-90 ${FOCUS}`}
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        <div className="mt-20 grid gap-10 border-t border-[#ddd3bc] pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium tracking-[0.26em] text-[#7d6226] uppercase">Die Etiketten lesen</p>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-[#5e574b]">
              Die Farbe des Etiketts sagt, in welches Kapitel ein Wein gehört — so wie im Regal der Vinothek.
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
            {LEGEND.map(l => (
              <li key={l.code} className="flex items-start gap-4">
                <span aria-hidden="true" className="mt-1 flex h-12 w-9 shrink-0 flex-col justify-center gap-[3px] px-1" style={{ background: LABEL[l.code].ground }}>
                  <span className="h-2 w-full" style={{ background: LABEL[l.code].band }} />
                  <span className="h-px w-full" style={{ background: LABEL[l.code].band }} />
                </span>
                <span>
                  <span className="font-display block text-[1.15rem]">{LABEL[l.code].name}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-[#5e574b]">{l.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-[12.5px] leading-relaxed text-[#5e574b]">
          Versand mit DPD — Österreich: 6er-Karton {formatEuro(10)}, 12er-Karton versandkostenfrei · Deutschland: 6er-Karton {formatEuro(17)}, 12er-Karton {formatEuro(12)}. Alle Preise inkl. 13 % MwSt.
          Abgabe alkoholischer Getränke ab 16 Jahren.
        </p>
      </div>
    </section>
  )
}
