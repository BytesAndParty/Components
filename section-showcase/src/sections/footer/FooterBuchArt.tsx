import { BUCHART_FONTS } from '../family-fonts'
import { Wordmark } from '../buchart-kit'
import { ADDRESS, CONTACTS, formatEuro, telHref } from '../buchart-data'

/**
 * Buch·Art — Kolophon in Kohle und Gold. Nimmt alles auf, was im Footer der
 * Original-Seite steht (Downloads, Versandkosten, Bankverbindung, AGB, Impressum,
 * Datenschutz, Widerruf), ordnet es in vier Spalten und behält den Satz, mit dem
 * die Familie ihre Schreibweise erklärt.
 */

const SHIPPING = [
  ['Österreich', `6er-Karton ${formatEuro(10)} · 12er-Karton frei`],
  ['Deutschland', `6er-Karton ${formatEuro(17)} · 12er-Karton ${formatEuro(12)}`],
]

const LEGAL = [
  { label: 'Preisliste ab Hof (PDF)', href: '/downloads' },
  { label: 'Bankverbindung', href: '/bankverbindung' },
  { label: 'AGB', href: '/agb' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'Widerrufsrecht', href: '/widerrufsrecht' },
  { label: 'Vertrag widerrufen', href: '/vertrag-widerrufen' },
]

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7c69f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1d1b]'
const HEAD = 'text-[11px] font-medium tracking-[0.24em] text-[#be9f55] uppercase'

export function FooterBuchArt() {
  return (
    <footer style={BUCHART_FONTS} className="bg-[#1e1d1b] px-6 pt-20 pb-10 text-[#d7c69f] lining-nums lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-[#be9f55]/35 pb-12">
          <a href="/" aria-label="Weingut Buchart 58 — Startseite" className={`text-[#f0e8c3] ${FOCUS}`}>
            <Wordmark signetClassName="text-[#be9f55]" className="sm:hidden" />
            <Wordmark size="lg" signetClassName="text-[#be9f55]" className="hidden sm:inline-flex" />
          </a>
          <p className="font-display max-w-sm text-[1.35rem] leading-snug italic text-[#f0e8c3]">Wein erleben im Weinort Sooss.</p>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className={HEAD}>Besuch</h2>
            <address className="mt-5 text-[14.5px] leading-[1.75] not-italic">
              Weingut Buchart 58
              <br />
              {ADDRESS.street}
              <br />
              {ADDRESS.zip} {ADDRESS.town}
              <br />
              {ADDRESS.region}
            </address>
            <p className="mt-4 text-[14.5px] leading-[1.6]">Ab Hof täglich 8 – 19 Uhr, auch an Sonn- und Feiertagen.</p>
          </div>

          <div>
            <h2 className={HEAD}>Direkt erreichen</h2>
            <ul className="mt-5 space-y-2 text-[14.5px]">
              {CONTACTS.map(c => (
                <li key={c.name}>
                  <a href={telHref(c.phone)} className={`inline-flex min-h-9 flex-wrap items-baseline gap-x-2 hover:text-[#f0e8c3] ${FOCUS}`}>
                    <span className="text-[#f0e8c3]">{c.name}</span>
                    <span className="tabular-nums">{c.phone}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${ADDRESS.email}`} className={`inline-flex min-h-9 items-center underline decoration-[#be9f55]/60 underline-offset-4 hover:text-[#f0e8c3] ${FOCUS}`}>
                  {ADDRESS.email}
                </a>
              </li>
              <li>
                <a href={ADDRESS.instagram} className={`inline-flex min-h-9 items-center hover:text-[#f0e8c3] ${FOCUS}`}>
                  Instagram · @buchart58
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={HEAD}>Versand mit DPD</h2>
            <dl className="mt-5 space-y-3 text-[14.5px]">
              {SHIPPING.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[#f0e8c3]">{k}</dt>
                  <dd className="mt-0.5 leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13px] leading-snug text-[#a39882]">Andere Länder bitte direkt per E-Mail anfragen.</p>
          </div>

          <div>
            <h2 className={HEAD}>Service</h2>
            <ul className="mt-5 space-y-1 text-[14.5px]">
              {LEGAL.map(l => (
                <li key={l.href}>
                  <a href={l.href} className={`group inline-flex min-h-9 items-center gap-2 hover:text-[#f0e8c3] ${FOCUS}`}>
                    <span aria-hidden="true" className="h-px w-3 bg-[#be9f55]/60 transition-all duration-500 group-hover:w-5 group-hover:bg-[#be9f55]" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#be9f55]/20 pt-8 text-[12.5px] text-[#a39882] lg:flex-row lg:items-baseline lg:justify-between">
          <p className="font-display text-[1.05rem] italic text-[#d7c69f]">Übrigens: Wir schreiben Sooß mit Doppel-s — also Sooss.</p>
          <p>Abgabe alkoholischer Getränke ab 16 Jahren · Preise inkl. 13 % MwSt.</p>
          <p>© 2026 Weingut Buchart 58, Sooss</p>
        </div>
      </div>
    </footer>
  )
}
