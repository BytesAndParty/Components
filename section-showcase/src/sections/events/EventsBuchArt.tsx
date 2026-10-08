import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, Minus, Plus } from 'lucide-react'
import { BUCHART_FONTS } from '../family-fonts'
import { RibbonFill, RunningHead } from '../buchart-kit'
import { ADDRESS } from '../buchart-data'

/**
 * Buch·Art — „Zu Gast in Sooss“ im Farbcode der schwarzen Etiketten (Kohle,
 * Gold, rotes Band). Die drei Angebote der Original-Seite mit allen Bedingungen
 * als Karte zum Auswählen; die Auswahl stellt das Anfrageformular ein (Mindest-
 * personen, ob überhaupt angemeldet werden muss). Preise und Regeln wortgetreu.
 */

const OFFERS = [
  {
    id: 'kleine',
    title: 'Kleine Weinprobe',
    price: '6,00 €',
    per: 'pro Person',
    details: ['Ca. 15 Minuten, im Stehen, während des Weineinkaufs', '4 Weinproben, dazu Leitungs- oder Sodawasser', 'Ab 60 € Weineinkauf pro Person entfällt der Betrag'],
    min: 1,
    walkIn: true,
  },
  {
    id: 'grosse',
    title: 'Große Weinprobe',
    price: '30,00 €',
    per: 'pro Person, inkl. 10 € Weingutschein',
    details: ['Ca. 1 Stunde, mit Sitzgelegenheit', '8 Weinproben frei wählbar, ein Aufstrichbrot', 'Filmpräsentation rund um die Weinproduktion', 'Mit Einkauf ab 90 €: 10 € pro Person — ab 150 € frei'],
    min: 2,
    walkIn: false,
  },
  {
    id: 'wanderung',
    title: 'Riedenwanderung',
    price: '40,00 €',
    per: 'pro Person, inkl. 20 € Weingutschein',
    details: ['Mit Weinbau- und Kellermeister Anton Buchart', 'Meist weit über 2 Stunden, 8 Weinproben, zwei Aufstrichbrote', 'Nur Einzelgruppen ab 4 Personen — keine Sammelgruppen', 'Nur bei Schönwetter, festes Schuhwerk empfohlen'],
    min: 4,
    walkIn: false,
  },
] as const

type OfferId = (typeof OFFERS)[number]['id']

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7c69f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1d1b]'
const FIELD = 'mt-2 w-full border-0 border-b border-[#d7c69f]/40 bg-transparent px-0 py-2.5 text-[15px] text-[#f0e8c3] placeholder:text-[#a39882] transition-colors focus:border-[#d7c69f] focus:ring-0 focus-visible:outline-none'
const LABEL = 'block text-[11px] font-medium tracking-[0.2em] text-[#d7c69f] uppercase'

export function EventsBuchArt() {
  const [offerId, setOfferId] = useState<OfferId>('wanderung')
  const [persons, setPersons] = useState(4)
  const [sent, setSent] = useState(false)
  const reduce = useReducedMotion()
  const uid = useId()
  const offer = OFFERS.find(o => o.id === offerId) ?? OFFERS[2]
  const count = Math.max(persons, offer.min)

  function choose(id: OfferId) {
    setOfferId(id)
    setSent(false)
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section style={BUCHART_FONTS} className="bg-[#1e1d1b] px-6 py-20 text-[#f0e8c3] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead tone="dark" chapter="IV" title="Erlebnisse" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[0.98]">
              Verbringen Sie
              <br />
              <span className="italic text-[#be9f55]">angenehme Stunden</span> bei uns.
            </h2>

            <fieldset className="mt-12">
              <legend className="sr-only">Angebot wählen</legend>
              <div className="divide-y divide-[#d7c69f]/20 border-y border-[#d7c69f]/20">
                {OFFERS.map(o => {
                  const active = o.id === offerId
                  return (
                    <label key={o.id} className="group relative block cursor-pointer py-7 pl-8">
                      <input type="radio" name={`${uid}-offer`} value={o.id} checked={active} onChange={() => choose(o.id)} className="peer sr-only" />
                      {/* Das rote Band markiert die Auswahl — dieselbe Geste wie in Nav und Shop. */}
                      <span aria-hidden="true" className={`absolute top-0 left-0 h-14 w-2.5 bg-[#9e1919] transition-transform duration-500 ${active ? 'scale-y-100' : 'scale-y-0'} origin-top`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)' }} />
                      <span className="absolute inset-0 peer-focus-visible:ring-2 peer-focus-visible:ring-[#d7c69f] peer-focus-visible:ring-inset" />
                      <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <span className={`font-display text-[1.9rem] leading-tight transition-colors ${active ? 'text-[#f0e8c3]' : 'text-[#f0e8c3]/75 group-hover:text-[#f0e8c3]'}`}>{o.title}</span>
                        <span className="text-right">
                          <span className="font-display text-[1.6rem] text-[#be9f55]">{o.price}</span>
                          <span className="block text-[12px] text-[#a39882]">{o.per}</span>
                        </span>
                      </span>
                      <ul className="mt-3 grid gap-x-8 gap-y-1 text-[13.5px] leading-snug text-[#d7c69f]/90 sm:grid-cols-2">
                        {o.details.map(d => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-10">
              <AnimatePresence mode="wait" initial={false}>
                {offer.walkIn ? (
                  <motion.div key="walkin" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} className="border border-[#d7c69f]/30 p-8">
                    <p className={LABEL}>Ohne Voranmeldung</p>
                    <p className="font-display mt-4 text-[1.9rem] leading-tight">Einfach vorbeikommen.</p>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-[#d7c69f]">
                      Während Ihres Weineinkaufs verkosten Sie jederzeit in Ruhe — täglich von 8 bis 19 Uhr, auch an Sonn- und Feiertagen.
                    </p>
                    <p className="mt-6 text-[14.5px]">
                      {ADDRESS.street}, {ADDRESS.zip} {ADDRESS.town}
                    </p>
                  </motion.div>
                ) : sent ? (
                  <motion.div key="sent" role="status" initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="border border-[#be9f55] p-8">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#be9f55] text-[#be9f55]">
                      <Check size={18} />
                    </span>
                    <p className="font-display mt-5 text-[1.9rem] leading-tight">Danke — Ihre Anfrage ist notiert.</p>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-[#d7c69f]">
                      {offer.title} für {count} Personen. Wir melden uns mit einer Bestätigung oder einem Gegenvorschlag.
                    </p>
                    <button type="button" onClick={() => setSent(false)} className={`mt-6 min-h-11 text-[13px] underline underline-offset-4 ${FOCUS}`}>
                      Weitere Anfrage
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key={`form-${offer.id}`} onSubmit={submit} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} className="space-y-6">
                    <p className="font-display text-[1.5rem] leading-tight">
                      Anfrage: <span className="italic text-[#be9f55]">{offer.title}</span>
                    </p>
                    <div>
                      <label htmlFor={`${uid}-name`} className={LABEL}>Name</label>
                      <input id={`${uid}-name`} name="name" required autoComplete="name" className={FIELD} />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <div>
                        <label htmlFor={`${uid}-mail`} className={LABEL}>E-Mail</label>
                        <input id={`${uid}-mail`} name="email" type="email" required autoComplete="email" className={FIELD} />
                      </div>
                      <div>
                        <label htmlFor={`${uid}-tel`} className={LABEL}>Telefon</label>
                        <input id={`${uid}-tel`} name="tel" type="tel" required autoComplete="tel" className={FIELD} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor={`${uid}-date`} className={LABEL}>Wunschtermin</label>
                        <input id={`${uid}-date`} name="date" type="date" required className={`${FIELD} [color-scheme:dark]`} />
                      </div>
                      <div>
                        <span id={`${uid}-persons`} className={LABEL}>Personen</span>
                        <div role="group" aria-labelledby={`${uid}-persons`} className="mt-2 flex items-center justify-between border-b border-[#d7c69f]/40">
                          <button type="button" aria-label="Eine Person weniger" disabled={count <= offer.min} onClick={() => setPersons(Math.max(offer.min, count - 1))} className={`flex h-11 w-9 items-center justify-center disabled:opacity-30 ${FOCUS}`}>
                            <Minus size={14} />
                          </button>
                          <output aria-live="polite" className="text-[15px] tabular-nums">{count}</output>
                          <button type="button" aria-label="Eine Person mehr" disabled={count >= 15} onClick={() => setPersons(Math.min(15, count + 1))} className={`flex h-11 w-9 items-center justify-center disabled:opacity-30 ${FOCUS}`}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`${uid}-note`} className={LABEL}>Wünsche, gewünschte Weine</label>
                      <textarea id={`${uid}-note`} name="note" rows={2} className={`${FIELD} resize-none`} />
                    </div>
                    <button type="submit" className={`group relative inline-flex min-h-12 w-full items-center justify-center py-3 pr-8 pl-6 text-[14px] font-medium text-[#f7f3e8] ${FOCUS}`}>
                      <RibbonFill />
                      <span className="relative">Unverbindlich anfragen</span>
                    </button>
                    <p className="text-[12px] leading-relaxed text-[#a39882]">
                      {offer.min > 1 && `Ab ${offer.min} Personen. `}Kein Kaufabschluss. Unsere Vinothek schließt um 19 Uhr.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
