import { useRef, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react'
import { useDisclosureDismiss } from '@components/lib/use-disclosure-dismiss'
import { BUCHART_FONTS } from '../family-fonts'
import { Ribbon, Wordmark } from '../buchart-kit'
import { CONTACTS, telHref } from '../buchart-data'

/**
 * Buch·Art — Kopfzeile aus der Original-CI: die Logo-Wortmarke mit Buch-Signet
 * in Gold, darüber eine schmale Kohle-Leiste mit den Fakten, die auf der alten
 * Seite in jedem Banner stehen (täglich 8–19 Uhr, 12er-Karton frei Haus).
 * Das rote Lesebändchen hängt von der Kante und wandert zum Punkt unter dem
 * Zeiger — ruht es, markiert es die aktuelle Seite. Die sechs Punkte bilden
 * die Seitenstruktur von buchart58.at ab, nur geordnet.
 */

const LINKS = [
  { label: 'Weine', href: '/weinshop', numeral: 'I' },
  { label: 'Etiketten', href: '/etiketten', numeral: 'II' },
  { label: 'Rebstockmiete', href: '/rebstockmiete', numeral: 'III' },
  { label: 'Erlebnisse', href: '/erlebnisse', numeral: 'IV' },
  { label: 'Weingut', href: '/weingut', numeral: 'V' },
  { label: 'Kontakt', href: '/kontakt', numeral: 'VI' },
]

const CURRENT = '/weinshop'
const sales = CONTACTS[1]

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8]'

export function NavBuchArt() {
  const [open, setOpen] = useState(false)
  const [pointer, setPointer] = useState<string | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  useDisclosureDismiss(open, setOpen, toggleRef)

  const ribbonAt = pointer ?? CURRENT

  return (
    <header style={BUCHART_FONTS} className="bg-[#f7f3e8] text-[#1c1a17]">
      {/* Faktenleiste — das, was Stammkunden zuerst wissen wollen. */}
      <div className="bg-[#1e1d1b] px-6 text-[11px] tracking-[0.06em] text-[#d7c69f] lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 py-2">
          <p>Ab Hof täglich 8–19 Uhr, auch an Sonn- &amp; Feiertagen</p>
          <p className="hidden md:block">12er-Karton versandkostenfrei in ganz Österreich</p>
          <a
            href={telHref(sales.phone)}
            className="hidden min-h-8 items-center underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7c69f] sm:inline-flex"
          >
            {sales.phone}
          </a>
        </div>
      </div>

      <nav aria-label="Hauptnavigation" className="border-b border-[#ddd3bc] px-6 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_1fr_auto] lg:gap-6">
          <a href="/" aria-label="Weingut Buchart 58 — Startseite" className={`flex min-h-11 items-center py-5 ${FOCUS}`}>
            <Wordmark size="sm" signetClassName="text-[#be9f55]" className="sm:hidden" />
            <Wordmark signetClassName="text-[#be9f55]" className="hidden sm:inline-flex" />
          </a>

          {/* Desktop: das Bändchen gleitet per layoutId zwischen den Punkten. */}
          <LayoutGroup>
            <ul className="hidden justify-center gap-1 lg:flex" onMouseLeave={() => setPointer(null)}>
              {LINKS.map(link => (
                <li key={link.href} className="relative">
                  {ribbonAt === link.href && (
                    <motion.span
                      layoutId="buchart-nav-ribbon"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute top-0 left-[calc(50%-6px)] w-3"
                    >
                      <Ribbon className="h-6 w-3" />
                    </motion.span>
                  )}
                  <a
                    href={link.href}
                    aria-current={link.href === CURRENT ? 'page' : undefined}
                    onMouseEnter={() => setPointer(link.href)}
                    onFocus={() => setPointer(link.href)}
                    onBlur={() => setPointer(null)}
                    className={`flex min-h-11 items-center px-4 pt-9 pb-6 text-[13px] font-medium tracking-[0.02em] transition-colors duration-300 hover:text-[#9e1919] aria-[current=page]:text-[#9e1919] ${FOCUS}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </LayoutGroup>

          <div className="flex items-center gap-1 justify-self-end">
            <a href="/konto" aria-label="Mein Konto" className={`hidden h-11 w-11 items-center sm:flex justify-center text-[#5e574b] transition-colors hover:text-[#1c1a17] ${FOCUS}`}>
              <UserRound size={19} strokeWidth={1.5} />
            </a>
            <a
              href="/warenkorb"
              aria-label="Warenkorb, 12 Flaschen"
              className={`relative flex h-11 w-11 items-center justify-center text-[#5e574b] transition-colors hover:text-[#1c1a17] ${FOCUS}`}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              <span aria-hidden="true" className="absolute -top-px right-0 bg-[#9e1919] px-1 pt-0.5 pb-1.5 text-[9.5px] leading-none font-semibold text-[#f7f3e8]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }}>
                12
              </span>
            </a>
            <button
              type="button"
              ref={toggleRef}
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-controls="buchart-nav-menu"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              className={`flex h-11 w-11 items-center justify-center text-[#1c1a17] lg:hidden ${FOCUS}`}
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobil: das Menü als Inhaltsverzeichnis mit Kapitelziffern. */}
        {open && (
          <ol id="buchart-nav-menu" className="mx-auto max-w-7xl border-t border-[#ddd3bc] py-3 lg:hidden">
            {LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={link.href === CURRENT ? 'page' : undefined}
                  className={`flex min-h-12 items-baseline gap-4 py-2 aria-[current=page]:text-[#9e1919] ${FOCUS}`}
                >
                  <span className="w-8 text-[11px] tracking-[0.18em] text-[#7d6226]">{link.numeral}</span>
                  <span className="text-[1.6rem] leading-none" style={{ fontFamily: 'var(--font-buchart-display)' }}>
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-[#ddd3bc] pt-2 sm:hidden">
              <a href="/konto" onClick={() => setOpen(false)} className={`flex min-h-12 items-center gap-4 py-2 text-[14px] ${FOCUS}`}>
                <UserRound size={18} strokeWidth={1.5} className="ml-0.5 w-8 text-[#7d6226]" />
                Mein Konto
              </a>
            </li>
          </ol>
        )}
      </nav>
    </header>
  )
}
