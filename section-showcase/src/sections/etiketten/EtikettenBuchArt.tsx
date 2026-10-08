import { useEffect, useId, useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, ImagePlus, Minus, Plus } from 'lucide-react'
import { BUCHART_FONTS } from '../family-fonts'
import { Bottle, RibbonFill, RunningHead, Signet } from '../buchart-kit'
import { formatEuro } from '../buchart-data'

/**
 * Buch·Art — persönliche Weinetiketten, das Kernangebot seit der ersten Website
 * (2009 schon Menüpunkt „Eigenes Etikett“). Die zwei Linien des Originals
 * (mehrfärbig mit Bild & Text / schwarz mit Goldprägung, nur Text), Anlass, Text
 * und Foto erscheinen live auf einem Druckmuster mit Schnittmarken. Die Rechnung
 * folgt dem Rechenbeispiel der Original-Seite: Flaschen + einmalig 3 € Design.
 */

const LINES = [
  { id: 'bunt', title: 'Mehrfärbig', sub: 'mit Bild & Text' },
  { id: 'gold', title: 'Schwarz mit Goldprägung', sub: 'nur Text' },
] as const

type Line = (typeof LINES)[number]['id']

/** Anlässe aus der Vorlagen-Liste der Original-Seite; die Texte sind nur Vorschläge. */
const OCCASIONS = [
  { id: 'geburtstag', label: 'Geburtstag', text: 'Alles Gute zum Geburtstag!' },
  { id: 'hochzeit', label: 'Hochzeit', text: 'Auf das Brautpaar!' },
  { id: 'geburt', label: 'Geburt & Taufe', text: 'Willkommen auf der Welt!' },
  { id: 'pension', label: 'Pension', text: 'Auf den Ruhestand!' },
  { id: 'weihnachten', label: 'Weihnachten', text: 'Frohe Weihnachten!' },
  { id: 'ostern', label: 'Ostern', text: 'Frohe Ostern!' },
  { id: 'muttertag', label: 'Muttertag', text: 'Für die beste Mama.' },
  { id: 'firma', label: 'Firmengeschenk', text: 'Danke für ein großartiges Jahr.' },
]

const WINES = [
  { id: 'zweigelt', name: 'Zweigelt', vintage: 2024, price: 6 },
  { id: 'gv', name: 'Grüner Veltliner', vintage: 2025, price: 6 },
  { id: 'portugieser', name: 'Blauer Portugieser', vintage: 2025, price: 5.5 },
  { id: 'zweigelt-lieblich', name: 'Zweigelt lieblich', vintage: 2024, price: 7 },
  { id: 'coorbeau', name: 'Coorbeau noir', vintage: 2024, price: 9.5 },
  { id: 'frizzante', name: 'Frizzante Rosé', vintage: undefined, price: 8 },
]

const FORMATS = [
  { id: '075', label: '0,75 Liter', from: null },
  { id: '150', label: 'Magnum 1,5 Liter', from: 30 },
  { id: '300', label: 'Magnum 3 Liter', from: 45 },
] as const

const STEPS = [
  'Etikett wählen und Ihre Angaben unverbindlich senden.',
  'Wir entwerfen Muster und schicken sie Ihnen per E-Mail.',
  'Erst nach Ihrem OK werden die Etiketten gedruckt.',
  'Abholung in Sooss oder Versand zu Ihnen.',
]

const DESIGN_FEE = 3
const MAX_BYTES = 5 * 1024 * 1024

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8]'
const PEER_FOCUS = 'peer-focus-visible:ring-2 peer-focus-visible:ring-[#9e1919] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#f7f3e8]'
const LEGEND = 'text-[11px] font-medium tracking-[0.22em] text-[#7d6226] uppercase'

/** Schnittmarken an den vier Ecken — das Muster sieht aus wie ein Druckbogen. */
function CropMarks() {
  const corner = 'absolute h-5 w-5 border-[#1c1a17]/40'
  return (
    <span aria-hidden="true">
      <span className={`${corner} -top-7 -left-7 border-r border-b`} />
      <span className={`${corner} -top-7 -right-7 border-b border-l`} />
      <span className={`${corner} -bottom-7 -left-7 border-t border-r`} />
      <span className={`${corner} -right-7 -bottom-7 border-t border-l`} />
    </span>
  )
}

export function EtikettenBuchArt() {
  const [line, setLine] = useState<Line>('gold')
  const [occasion, setOccasion] = useState(OCCASIONS[0].id)
  const [text, setText] = useState('Alles Gute zum 50er, Maria!')
  const [wineId, setWineId] = useState(WINES[0].id)
  const [format, setFormat] = useState<(typeof FORMATS)[number]['id']>('075')
  const [qty, setQty] = useState(12)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState('')
  const [requested, setRequested] = useState(false)
  const reduce = useReducedMotion()
  const uid = useId()

  // Objekt-URL freigeben, sobald ein neues Bild kommt oder die Section verschwindet.
  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo)
  }, [photo])

  const wine = WINES.find(w => w.id === wineId) ?? WINES[0]
  const fmt = FORMATS.find(f => f.id === format) ?? FORMATS[0]
  const unit = fmt.from ?? wine.price
  const total = qty * unit + DESIGN_FEE
  const dark = line === 'gold'
  const size = fmt.label.replace('Magnum ', '').replace(' Liter', ' l')

  function pickOccasion(id: string) {
    const o = OCCASIONS.find(x => x.id === id)
    setOccasion(id)
    if (o) setText(o.text)
  }

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_BYTES) {
      setPhotoError('Das Bild ist größer als 5 MB.')
      return
    }
    setPhotoError('')
    setPhoto(URL.createObjectURL(file))
  }

  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="II" title="Persönliche Etiketten" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Einstellungen */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.95]">
              Mein eigener <span className="italic text-[#9e1919]">Wein!</span>
            </h2>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-[#5e574b]">
              Sag es mit einer Weinflasche: Zum Geburtstag, zur Hochzeit oder als Firmengeschenk — Anton gestaltet Ihr
              Etikett persönlich. Das Muster ist kostenlos und unverbindlich.
            </p>

            <fieldset className="mt-12">
              <legend className={LEGEND}>Etikett</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {LINES.map(l => (
                  <label key={l.id} className="cursor-pointer">
                    <input type="radio" name={`${uid}-line`} aria-label={`${l.title}, ${l.sub}`} checked={line === l.id} onChange={() => setLine(l.id)} className="peer sr-only" />
                    <span className={`flex min-h-20 items-center gap-4 border border-[#1c1a17]/15 px-4 py-3 transition-colors peer-checked:border-[#1c1a17] peer-checked:bg-white/60 hover:border-[#1c1a17]/40 ${PEER_FOCUS}`}>
                      <span aria-hidden="true" className={`h-12 w-9 shrink-0 border ${l.id === 'gold' ? 'border-[#be9f55] bg-[#1e1d1b]' : 'border-[#ddd3bc] bg-[linear-gradient(160deg,#f0e8c3_55%,#9e1919_55%,#9e1919_70%,#15420c_70%)]'}`} />
                      <span>
                        <span className="font-display block text-[1.25rem] leading-tight">{l.title}</span>
                        <span className="text-[13px] text-[#5e574b]">{l.sub}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className={LEGEND}>Anlass</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {OCCASIONS.map(o => (
                  <label key={o.id} className="cursor-pointer">
                    <input type="radio" name={`${uid}-occasion`} checked={occasion === o.id} onChange={() => pickOccasion(o.id)} className="peer sr-only" />
                    <span className={`inline-flex min-h-11 items-center border border-[#1c1a17]/15 px-4 text-[13.5px] transition-colors peer-checked:border-[#9e1919] peer-checked:bg-[#9e1919] peer-checked:text-[#f7f3e8] hover:border-[#1c1a17]/40 ${PEER_FOCUS}`}>
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-10">
              <div className="flex items-baseline justify-between">
                <label htmlFor={`${uid}-text`} className={LEGEND}>Ihr Text</label>
                <span className="text-[12px] text-[#5e574b] tabular-nums" aria-live="polite">{text.length} / 80</span>
              </div>
              <textarea
                id={`${uid}-text`}
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={80}
                rows={2}
                className="font-display mt-2 w-full resize-none border-0 border-b border-[#1c1a17]/25 bg-transparent px-0 py-2 text-[1.5rem] leading-snug italic focus:border-[#9e1919] focus:ring-0 focus-visible:outline-none"
              />
            </div>

            <AnimatePresence initial={false}>
              {line === 'bunt' && (
                <motion.div
                  key="photo"
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-8">
                    <input id={`${uid}-photo`} type="file" accept="image/jpeg,image/png" onChange={onPhoto} className="peer sr-only" aria-describedby={`${uid}-photo-hint`} />
                    <label htmlFor={`${uid}-photo`} className={`inline-flex min-h-12 cursor-pointer items-center gap-3 border border-dashed border-[#1c1a17]/35 px-5 text-[14px] transition-colors hover:border-[#9e1919] hover:text-[#9e1919] ${PEER_FOCUS}`}>
                      <ImagePlus size={18} strokeWidth={1.5} />
                      {photo ? 'Anderes Bild wählen' : 'Eigenes Bild hinzufügen'}
                    </label>
                    <p id={`${uid}-photo-hint`} className="mt-2 text-[12px] text-[#5e574b]">
                      JPG oder PNG, max. 5 MB — bitte nur Bilder, an denen Sie die Rechte haben.
                    </p>
                    {photoError && (
                      <p role="alert" className="mt-2 text-[13px] text-[#9e1919]">
                        {photoError}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-wine`} className={LEGEND}>Wein</label>
                <select
                  id={`${uid}-wine`}
                  value={wineId}
                  onChange={e => setWineId(e.target.value)}
                  className="mt-2 min-h-11 w-full border-0 border-b border-[#1c1a17]/25 bg-transparent px-0 text-[15px] focus:border-[#9e1919] focus:ring-0 focus-visible:outline-none"
                >
                  {WINES.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} {w.vintage ?? ''} — {formatEuro(w.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${uid}-format`} className={LEGEND}>Format</label>
                <select
                  id={`${uid}-format`}
                  value={format}
                  onChange={e => setFormat(e.target.value as (typeof FORMATS)[number]['id'])}
                  className="mt-2 min-h-11 w-full border-0 border-b border-[#1c1a17]/25 bg-transparent px-0 text-[15px] focus:border-[#9e1919] focus:ring-0 focus-visible:outline-none"
                >
                  {FORMATS.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                      {f.from ? ` — ab ${formatEuro(f.from)}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ol className="mt-14 grid gap-6 border-t border-[#ddd3bc] pt-8 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span aria-hidden="true" className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#be9f55] text-[1rem] text-[#7d6226]">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-[14.5px] leading-snug">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Das Muster */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-10">
              <p className={LEGEND}>Ihr Muster</p>
              <div className="mt-10 flex items-end justify-center gap-8 px-8">
                <div className="relative w-full max-w-[19rem]">
                  <CropMarks />
                  <motion.div
                    key={line}
                    initial={reduce ? false : { opacity: 0, rotateY: -12 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                    className={`relative flex aspect-[3/4] flex-col items-center px-6 pt-6 pb-5 text-center shadow-[14px_22px_34px_-20px_rgba(28,26,23,0.5)] ${dark ? 'bg-[#1e1d1b] text-[#be9f55]' : 'bg-[#f0e8c3] text-[#15420c]'}`}
                    role="img"
                    aria-label={`Etikettenmuster ${dark ? 'schwarz mit Goldprägung' : 'mehrfärbig'}: ${text || 'ohne Text'}, ${wine.name}`}
                  >
                    {dark && <span aria-hidden="true" className="absolute inset-2 border border-[#be9f55]/60" />}
                    <Signet className={`h-7 w-11 ${dark ? 'text-[#be9f55]' : 'text-[#7d6226]'}`} />
                    <span className={`font-display mt-2 px-3 py-0.5 text-[1rem] ${dark ? 'border-y border-[#be9f55]/70' : 'bg-[#15420c] text-[#d7c69f]'}`}>Buchart 58</span>

                    {!dark && (
                      <span className="mt-4 block aspect-[4/3] w-full overflow-hidden bg-[#e6dcb3]">
                        {photo ? (
                          <img src={photo} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-[#15420c]/50">
                            <ImagePlus size={22} strokeWidth={1.25} />
                            <span className="text-[11px]">Ihr Foto</span>
                          </span>
                        )}
                      </span>
                    )}

                    <span className={`font-display flex flex-1 items-center justify-center leading-[1.12] italic break-words ${dark ? 'text-[clamp(1.6rem,3.2vw,2.2rem)] text-[#d7c69f]' : 'mt-3 text-[clamp(1.2rem,2.4vw,1.55rem)]'}`}>
                      {text || '…'}
                    </span>
                    <span className="font-display text-[0.95rem]">
                      {wine.name} {wine.vintage ?? ''}
                    </span>
                    <span className="mt-1 text-[8px] tracking-[0.2em] uppercase opacity-80">Weinland Österreich · {size}</span>
                  </motion.div>
                </div>
                <Bottle
                  code={dark ? 'schwarz' : 'weiss'}
                  glass={wine.id === 'gv' ? 'gruen' : wine.id === 'frizzante' ? 'klar' : 'dunkel'}
                  name={wine.name}
                  dedication={text}
                  size={size}
                  className="hidden h-72 w-auto shrink-0 drop-shadow-[8px_14px_12px_rgba(28,26,23,0.25)] sm:block"
                />
              </div>

              {/* Die Rechnung nach dem Rechenbeispiel der Original-Seite. */}
              <div className="mt-14 border-t border-[#1c1a17]/80 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[14px]">Flaschen</span>
                  <div className="flex items-center border border-[#1c1a17]/20" role="group" aria-label="Anzahl Flaschen">
                    <button type="button" aria-label="Eine Flasche weniger" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))} className={`flex h-11 w-10 items-center justify-center disabled:opacity-30 ${FOCUS}`}>
                      <Minus size={14} />
                    </button>
                    <output aria-live="polite" className="w-10 text-center text-[15px] tabular-nums">{qty}</output>
                    <button type="button" aria-label="Eine Flasche mehr" disabled={qty >= 120} onClick={() => setQty(q => Math.min(120, q + 1))} className={`flex h-11 w-10 items-center justify-center disabled:opacity-30 ${FOCUS}`}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <dl className="mt-5 space-y-2 text-[14px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#5e574b]">
                      {qty} × {fmt.from ? fmt.label : wine.name} à {fmt.from ? 'ab ' : ''}
                      {formatEuro(unit)}
                    </dt>
                    <dd>{formatEuro(qty * unit)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#5e574b]">Etikettendesign, einmalig</dt>
                    <dd>{formatEuro(DESIGN_FEE)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-[#ddd3bc] pt-3">
                    <dt className="font-medium">Gesamt, ohne Versand</dt>
                    <dd className="font-display text-[2rem] leading-none">
                      {fmt.from && <span className="mr-1.5 text-[1.1rem] italic">ab</span>}
                      {formatEuro(total)}
                    </dd>
                  </div>
                </dl>

                <button type="button" onClick={() => setRequested(true)} className={`group relative mt-8 inline-flex min-h-12 w-full items-center justify-center py-3 pr-8 pl-6 text-[14px] font-medium text-[#f7f3e8] ${FOCUS}`}>
                  <RibbonFill />
                  <span className="relative inline-flex items-center gap-2" aria-live="polite">
                    {requested ? (
                      <>
                        <Check size={16} /> Danke — Ihr Muster kommt per E-Mail
                      </>
                    ) : (
                      'Kostenloses Muster anfordern'
                    )}
                  </span>
                </button>
                <p className="mt-4 text-[12px] leading-relaxed text-[#5e574b]">
                  Abholung ab einer Flasche, Versand ab 6 Flaschen — nicht jede muss ein eigenes Etikett tragen. Aktionen gelten
                  nicht für Flaschen mit persönlichem Etikett. Wir bedrucken Etiketten nur für unsere eigenen Weine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
