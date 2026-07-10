import { useState } from 'react'
import { Menu, X } from 'lucide-react'

/**
 * Maison Masthead — Kopfzeile als Magazin-Impressum (Maison-Editorial-Linie):
 * Meta-Zeile zwischen Hairlines (Ort · Édition), darunter übergroßer italic
 * Serif-Wortmark und eine Link-Reihe mit wachsenden Strichen wie im Kolophon
 * (FooterV5). Die Nav liest sich als erste Druckseite, nicht als App-Leiste.
 */

const LINKS = [
  { label: 'Die Weine', href: '/sortiment' },
  { label: 'Das Weingut', href: '/weingut' },
  { label: 'Besuch & Verkostung', href: '/besuch' },
  { label: 'Journal', href: '/journal' },
]

export function NavV3() {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Hauptnavigation" className="bg-[#fdfcf9] px-6 pt-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Meta row between hairlines */}
        <div className="flex items-baseline justify-between border-y border-zinc-200 py-2.5">
          <span className="text-[9px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
            Wachau · Österreich
          </span>
          <span className="hidden text-[9px] font-bold tracking-[0.4em] text-zinc-400 uppercase sm:block">
            Seit 1958
          </span>
          <span className="text-[9px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
            Édition MMXXVI
          </span>
        </div>

        {/* Masthead row */}
        <div className="flex items-end justify-between gap-6 py-7">
          <a
            href="/"
            className="font-display flex min-h-11 items-end text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.9] font-light tracking-tighter text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            Buchart&nbsp;<span className="italic">&amp; Söhne.</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 pb-1 lg:flex">
            {LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="group inline-flex min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-zinc-900 uppercase transition-colors hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
              >
                <span aria-hidden="true" className="h-px w-4 bg-zinc-300 transition-all duration-500 group-hover:w-8 group-hover:bg-zinc-900" />
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="nav-v3-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            className="mb-1 flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Mobile disclosure — set like an index column */}
        {open && (
          <div id="nav-v3-menu" className="border-t border-zinc-200 py-4 lg:hidden">
            {LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex min-h-11 items-baseline justify-between gap-4 text-[10px] font-bold tracking-[0.25em] text-zinc-900 uppercase transition-colors hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
              >
                <span>{link.label}</span>
                <span className="font-display text-xs font-light text-zinc-400 italic normal-case">
                  S. {String(i + 1).padStart(2, '0')}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Closing hairline */}
        <div className="border-b border-zinc-200" />
      </div>
    </nav>
  )
}
