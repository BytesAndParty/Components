import { useState } from 'react'
import { Menu, X } from 'lucide-react'

/**
 * Artisanal Minimal — Cream-Kopfzeile (#fdfcf9): Serif-Wortmark mit italic-Wechsel,
 * winzige Versalien-Links mit wachsender Underline, Ab-Hof-CTA als unterstrichener
 * Text. Viel Luft, keine Füllflächen.
 */

const LINKS = [
  { label: 'Die Weine', href: '/sortiment' },
  { label: 'Das Weingut', href: '/weingut' },
  { label: 'Verkostung', href: '/verkostung' },
]

export function NavV2() {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Hauptnavigation" className="border-b border-zinc-100 bg-[#fdfcf9]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 lg:px-8">
        <a
          href="/"
          className="font-display flex min-h-11 items-center text-2xl font-light tracking-tight text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
        >
          Buchart <span className="italic">&amp; Söhne.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-10 lg:flex">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="group flex min-h-11 flex-col items-start justify-center text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
            >
              <span>{link.label}</span>
              <span aria-hidden="true" className="mt-1 h-px w-0 bg-zinc-900 transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/ab-hof"
            className="hidden min-h-11 items-center border-b border-zinc-900 pb-0.5 text-[10px] font-bold tracking-[0.2em] text-zinc-900 uppercase transition-colors hover:border-zinc-300 hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none sm:inline-flex"
          >
            Ab-Hof-Verkauf
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="nav-v2-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            className="flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure */}
      {open && (
        <div id="nav-v2-menu" className="border-t border-zinc-100 px-6 py-4 lg:hidden">
          {[...LINKS, { label: 'Ab-Hof-Verkauf', href: '/ab-hof' }].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
