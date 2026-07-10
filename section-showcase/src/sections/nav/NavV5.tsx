import { useState } from 'react'
import { Menu, X } from 'lucide-react'

/**
 * Nocturne — cineastische Kopfzeile auf Fast-Schwarz (#0d0a09): Serif-Wortmark
 * in Kerzengold, gedimmte Versalien-Links, die im Hover aufglimmen, und eine
 * wachsende Gold-Hairline zum Nachtverkauf. Passt zur Nocturne-Linie
 * (HeroV8 / StoreNocturne).
 */

const LINKS = [
  { label: 'Der Keller', href: '/keller' },
  { label: 'Nachtverkauf', href: '/nachtverkauf' },
  { label: 'Raritäten', href: '/raritaeten' },
]

export function NavV5() {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Hauptnavigation" className="border-b border-[#c9a25e]/20 bg-[#0d0a09]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <a
          href="/"
          className="font-display flex min-h-11 items-center text-xl font-light tracking-tight text-[#f3ece0] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0a09] focus-visible:outline-none"
        >
          Buchart <span className="ml-1.5 italic text-[#c9a25e]">’58</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-[10px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase transition-colors hover:text-[#e8d5ae] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/nachtverkauf"
            className="group hidden min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#c9a25e] uppercase transition-colors hover:text-[#e8d5ae] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none sm:inline-flex"
          >
            Zur Weinkarte
            <span aria-hidden="true" className="h-px w-6 bg-[#c9a25e]/60 transition-all duration-500 group-hover:w-12 group-hover:bg-[#c9a25e]" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="nav-v5-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            className="flex h-11 w-11 items-center justify-center text-[#6b5f50] transition-colors hover:text-[#e8d5ae] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure */}
      {open && (
        <div id="nav-v5-menu" className="border-t border-[#c9a25e]/10 px-6 py-4 lg:hidden">
          {[...LINKS, { label: 'Zur Weinkarte', href: '/nachtverkauf' }].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-11 items-center text-[10px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase transition-colors hover:text-[#e8d5ae] focus-visible:ring-2 focus-visible:ring-[#c9a25e]/70 focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
