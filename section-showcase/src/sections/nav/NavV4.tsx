import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useDisclosureDismiss } from '@components/lib/use-disclosure-dismiss'

/**
 * Domaine Privée — gravierte Kopfzeile auf Pergament (#f6f3ec): rundes
 * Siegel-Monogramm, Serif-Wortmark, Versalien-Links mit Underline-Tab-Logik
 * (wie die Filter in StoreCave) und Bordeaux-CTA zur Degustation.
 */

const LINKS = [
  { label: 'Die Weinkarte', href: '/weinkarte', current: true },
  { label: 'Die Rieden', href: '/rieden', current: false },
  { label: 'Die Chronik', href: '/chronik', current: false },
]

export function NavV4() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  // Escape schließt das Menü und gibt den Fokus an den Button zurück.
  useDisclosureDismiss(open, setOpen, toggleRef)

  return (
    <nav aria-label="Hauptnavigation" className="border-b border-[#ddd5c4] bg-[#f6f3ec]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <a
          href="/"
          className="flex min-h-11 items-center gap-3.5 focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="font-display flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd5c4] text-base font-light text-[#5c2331] italic"
          >
            D
          </span>
          <span className="font-display text-xl font-light tracking-tight text-[#221b16]">
            Domaine <span className="italic">Buchart</span>
          </span>
        </a>

        {/* Desktop links — quiet underline tabs */}
        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              className={`flex min-h-11 items-center border-b-2 pt-0.5 text-[11px] font-bold tracking-[0.25em] uppercase transition-all focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none ${
                link.current
                  ? 'border-[#5c2331] text-[#221b16]'
                  : 'border-transparent text-[#a89e8a] hover:text-[#6f6657]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/degustation"
            className="hidden min-h-11 items-center bg-[#5c2331] px-7 py-2.5 text-[10px] font-bold tracking-[0.25em] text-[#f6f3ec] uppercase transition-all duration-300 hover:bg-[#471a26] hover:shadow-[0_12px_32px_-12px_rgba(92,35,49,0.5)] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f3ec] focus-visible:outline-none sm:inline-flex"
          >
            Degustation
          </a>
          <button
            type="button"
            ref={toggleRef}
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="nav-v4-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            className="flex h-11 w-11 items-center justify-center text-[#8a8070] transition-colors hover:text-[#221b16] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure */}
      {open && (
        <div id="nav-v4-menu" className="border-t border-[#ddd5c4] px-6 py-4 lg:hidden">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={link.current ? 'page' : undefined}
              className={`flex min-h-11 items-center text-[11px] font-bold tracking-[0.25em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none ${
                link.current ? 'text-[#5c2331]' : 'text-[#a89e8a] hover:text-[#6f6657]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/degustation"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex min-h-11 items-center bg-[#5c2331] px-7 py-2.5 text-[10px] font-bold tracking-[0.25em] text-[#f6f3ec] uppercase transition-colors hover:bg-[#471a26] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
          >
            Degustation
          </a>
        </div>
      )}
    </nav>
  )
}
