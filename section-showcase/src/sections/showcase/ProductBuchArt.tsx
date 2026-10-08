import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, Minus, Plus } from 'lucide-react'
import { BUCHART_FONTS } from '../family-fonts'
import { Bottle, RibbonFill, RunningHead } from '../buchart-kit'
import { formatEuro } from '../buchart-data'

/**
 * Buch·Art — Produktseite im Farbcode der Bordeaux-Etiketten. Der Coorbeau noir
 * („Der schwarze Rabe“) gibt es im Shop trocken (2024) und lieblich (2025) —
 * hier als Umschalter, Texte und Ausbau wortgetreu aus dem Shop. Formate aus der
 * Magnum-Seite, Etikett-Hinweis aus „Personalisierte Weinetiketten“.
 */

const STYLES = {
  trocken: {
    vintage: 2024,
    price: 9.5,
    note: 'Großer Jahrgang: reife Frucht, feine Gewürz- und Schokonote.',
    facts: [
      ['Ausbau', 'Holzfass'],
      ['Trinktemperatur', '16 – 18 °C'],
      ['Genuss', 'Unser beliebter Allrounder — bester Speisenbegleiter.'],
    ],
  },
  lieblich: {
    vintage: 2025,
    price: 9.5,
    note: 'Unser Premiumprodukt: dunkles Rubingranat, feine Aromabeeren, samtig, süßer Abgang.',
    facts: [
      ['Ausbau', 'Stahltank'],
      ['Trinktemperatur', '16 – 18 °C'],
      ['Genuss', 'Sowohl vor dem Kachelofen als auch für einen lauen Sommerabend.'],
    ],
  },
} as const

type Style = keyof typeof STYLES

const FORMATS = [
  { id: '075', amount: '0,75', label: '0,75 l', price: null, hint: 'Flasche' },
  { id: '150', amount: '1,5', label: '1,5 l', price: 30, hint: 'Magnum mit Ihrem Etikett, ab' },
  { id: '300', amount: '3', label: '3 l', price: 45, hint: 'Magnum mit Ihrem Etikett, ab' },
] as const

const FOCUS_DARK = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7c69f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#6f1a1a]'

export function ProductBuchArt() {
  const [style, setStyle] = useState<Style>('trocken')
  const [format, setFormat] = useState<(typeof FORMATS)[number]['id']>('075')
  const [qty, setQty] = useState(6)
  const [added, setAdded] = useState(false)
  const reduce = useReducedMotion()
  const s = STYLES[style]
  const f = FORMATS.find(x => x.id === format) ?? FORMATS[0]
  const unit = f.price ?? s.price

  function addToCart() {
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <section style={BUCHART_FONTS} className="relative overflow-hidden bg-[#6f1a1a] px-6 lining-nums py-20 text-[#f0e8c3] lg:px-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <RunningHead tone="dark" chapter="I" title="Rotwein · Bordeaux-Etikett" />

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Flasche vor dem Wort „noir“ — das Etikett ist der Held, nicht ein Foto. */}
          <div className="relative flex justify-center lg:col-span-5">
            <span aria-hidden="true" className="font-display pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(8rem,22vw,17rem)] leading-none italic text-[#a01f1e] select-none">
              noir
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={style}
                initial={reduce ? false : { opacity: 0, y: 24, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -16, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="relative"
              >
                <Bottle
                  code="rot"
                  glass="dunkel"
                  name="Coorbeau noir"
                  sub="Der schwarze Rabe"
                  vintage={s.vintage}
                  size={f.label}
                  label={`Coorbeau noir ${s.vintage}, ${style}`}
                  className="h-[min(34rem,70vw)] w-auto drop-shadow-[18px_30px_30px_rgba(0,0,0,0.45)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[11px] font-medium tracking-[0.26em] text-[#d7c69f] uppercase">Rotwein · Ried Lange Weingärten</p>
            <h2 className="font-display mt-5 text-[clamp(3rem,6.5vw,5.6rem)] leading-[0.95]">Coorbeau noir</h2>
            <p className="font-display mt-2 text-[1.6rem] italic text-[#d7c69f]">„Der schwarze Rabe“</p>

            <fieldset className="mt-8">
              <legend className="sr-only">Geschmack und Jahrgang</legend>
              <div className="inline-flex border border-[#d7c69f]/50">
                {(Object.keys(STYLES) as Style[]).map(key => (
                  <label key={key} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="buchart-style"
                      value={key}
                      checked={style === key}
                      onChange={() => setStyle(key)}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-11 items-center px-5 text-[13px] transition-colors peer-checked:bg-[#f0e8c3] peer-checked:text-[#6f1a1a] peer-focus-visible:ring-2 peer-focus-visible:ring-[#d7c69f] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#6f1a1a] hover:bg-white/5">
                      {key} {STYLES[key].vintage}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-8 max-w-lg text-[1.0625rem] leading-[1.7] text-[#f0e8c3]/90">{s.note}</p>

            <dl className="mt-8 divide-y divide-[#d7c69f]/25 border-y border-[#d7c69f]/25">
              {s.facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-[14px]">
                  <dt className="text-[#d7c69f]">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <fieldset className="mt-8">
              <legend className="text-[11px] font-medium tracking-[0.26em] text-[#d7c69f] uppercase">Format</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {FORMATS.map(x => (
                  <label key={x.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="buchart-format"
                      value={x.id}
                      aria-label={x.price ? `${x.label}, ${x.hint} ${formatEuro(x.price)}` : `${x.label}, ${x.hint}`}
                      checked={format === x.id}
                      onChange={() => setFormat(x.id)}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-16 flex-col justify-center border border-[#d7c69f]/35 px-3 py-2 transition-[border-color,background-color] peer-checked:border-[#d7c69f] peer-checked:bg-white/[0.06] peer-focus-visible:ring-2 peer-focus-visible:ring-[#d7c69f] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#6f1a1a] hover:border-[#d7c69f]/70">
                      <span className="leading-none">
                        {/* Liter-„l“ in der Sans — in Goudy liest es sich wie eine 1. */}
                        <span className="font-display text-[1.3rem]">{x.amount}</span>
                        <span className="ml-1 text-[12px]">Liter</span>
                      </span>
                      <span className="mt-1.5 text-[11px] leading-tight text-[#d7c69f]">
                        {x.price ? `${x.hint} ${formatEuro(x.price)}` : x.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-6">
              <p>
                <span className="font-display text-[2.8rem] leading-none">
                  {f.price && <span className="mr-2 text-[1.4rem] italic">ab</span>}
                  {formatEuro(unit)}
                </span>
                <span className="mt-1 block text-[12px] text-[#d7c69f]">inkl. 13 % MwSt. {f.price ? '· zzgl. Etikett' : `· ${f.label}`}</span>
              </p>

              <div className="flex items-center border border-[#d7c69f]/50" role="group" aria-label="Menge">
                <button type="button" aria-label="Eine Flasche weniger" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))} className={`flex h-12 w-11 items-center justify-center transition-colors hover:bg-white/5 disabled:opacity-40 ${FOCUS_DARK}`}>
                  <Minus size={15} />
                </button>
                <output aria-live="polite" className="w-10 text-center text-[15px] tabular-nums">
                  {qty}
                </output>
                <button type="button" aria-label="Eine Flasche mehr" onClick={() => setQty(q => Math.min(120, q + 1))} className={`flex h-12 w-11 items-center justify-center transition-colors hover:bg-white/5 ${FOCUS_DARK}`}>
                  <Plus size={15} />
                </button>
              </div>

              <button type="button" onClick={addToCart} className={`group relative inline-flex min-h-12 items-center gap-2 py-3 pr-11 pl-7 text-[14px] font-medium text-[#1c1a17] ${FOCUS_DARK}`}>
                <RibbonFill tone="gold" />
                <span className="relative inline-flex items-center gap-2" aria-live="polite">
                  {added ? (
                    <>
                      <Check size={16} /> Im Warenkorb
                    </>
                  ) : (
                    'In den Warenkorb'
                  )}
                </span>
              </button>
            </div>

            <p className="mt-8 max-w-lg text-[13px] leading-relaxed text-[#d7c69f]">
              {qty % 12 === 0
                ? `${qty / 12 === 1 ? 'Ein voller 12er-Karton' : `${qty / 12} volle 12er-Kartons`} — versandkostenfrei in ganz Österreich.`
                : `Noch ${12 - (qty % 12)} Flaschen bis zum nächsten vollen 12er-Karton — nur volle Kartons reisen versandkostenfrei (AT).`}{' '}
              Mit Ihrem eigenen Etikett: Designerstellung einmalig {formatEuro(3)}, Muster kostenlos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
