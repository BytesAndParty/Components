import { useId, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BookingCalendar, type BookingSlot } from '@components/booking-calendar/booking-calendar'
import { BUCHART_FONTS } from '../family-fonts'
import { RunningHead } from '../buchart-kit'
import { ADDRESS } from '../buchart-data'

/**
 * Buch·Art — „Zu Gast in Sooss“ im Farbcode der schwarzen Etiketten (Kohle,
 * Gold, rotes Band). Die drei Angebote der Original-Seite mit allen Bedingungen
 * als Karte zum Auswählen; die Auswahl stellt den Buchungskalender ein — oder
 * zeigt, dass für die kleine Probe gar keine Anmeldung nötig ist. Preise und
 * Regeln wortgetreu.
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
const LABEL = 'block text-[11px] font-medium tracking-[0.2em] text-[#d7c69f] uppercase'

/**
 * BookingCalendar folgt den Theme-Tokens. Die Fläche hier ist fest Kohle, darum
 * werden die Tokens am Wrapper auf die Etikettenfarben gesetzt — gilt in Dark
 * und Light gleich.
 */
const CALENDAR_TOKENS = {
  '--foreground': '#f0e8c3',
  '--muted-foreground': '#a39882',
  '--muted': 'rgba(240, 232, 195, 0.06)',
  '--border': 'rgba(215, 198, 159, 0.28)',
  '--card': '#262522',
  '--accent': '#9e1919',
  '--accent-foreground': '#f7f3e8',
  '--accent-readable': '#d7c69f',
  '--ring': '#d7c69f',
} as CSSProperties

/** Tag in `n` Tagen als ISO-Datum, in lokaler Zeit (toISOString wäre UTC). */
function isoDay(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Nächster Wochentag (0 = Sonntag … 6 = Samstag) ab heute plus `weeks` Wochen. */
function nextWeekday(day: number, weeks: number) {
  const offset = (day - new Date().getDay() + 7) % 7 || 7
  return isoDay(offset + weeks * 7)
}

/**
 * Demo-Termine: Im Original gibt es Wanderung und große Probe nach Vereinbarung.
 * Hier stehen beispielhafte Wochenend-Slots, damit der Buchungsablauf sichtbar wird.
 */
const WEEKS = [0, 1, 2, 3]

// Einmal beim Laden berechnet, nicht pro Render — das Datum ist kein Render-Input.
const SLOTS: Record<'wanderung' | 'grosse', BookingSlot[]> = {
  wanderung: WEEKS.flatMap(w => [
    { id: `rw-sa-${w}`, date: nextWeekday(6, w), time: '10:00', capacity: 15, price: 40 },
    { id: `rw-so-${w}`, date: nextWeekday(0, w), time: '14:00', capacity: 15, price: 40 },
  ]),
  grosse: WEEKS.flatMap(w => [
    { id: `gp-fr-${w}`, date: nextWeekday(5, w), time: '17:00', capacity: 15, price: 30 },
    { id: `gp-sa-${w}`, date: nextWeekday(6, w), time: '15:00', capacity: 15, price: 30 },
  ]),
}

export function EventsBuchArt() {
  const [offerId, setOfferId] = useState<OfferId>('wanderung')
  const reduce = useReducedMotion()
  const uid = useId()
  const offer = OFFERS.find(o => o.id === offerId) ?? OFFERS[2]

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
                      <input type="radio" name={`${uid}-offer`} value={o.id} checked={active} onChange={() => setOfferId(o.id)} className="peer sr-only" />
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
                ) : (
                  <motion.div key={offer.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }}>
                    <p className="font-display text-[1.5rem] leading-tight">
                      Termin: <span className="italic text-[#be9f55]">{offer.title}</span>
                    </p>
                    <div className="mt-6" style={CALENDAR_TOKENS}>
                      <BookingCalendar slots={SLOTS[offer.id]} />
                    </div>
                    <p className="mt-6 text-[12px] leading-relaxed text-[#a39882]">
                      {offer.min > 1 && `Ab ${offer.min} Personen. `}Unverbindliche Anfrage, kein Kaufabschluss. Lieber ein eigener Termin?{' '}
                      <a href={`mailto:${ADDRESS.email}`} className={`text-[#d7c69f] underline underline-offset-4 ${FOCUS}`}>
                        {ADDRESS.email}
                      </a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
