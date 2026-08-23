import { useState } from 'react'
import { Menu, X } from 'lucide-react'

/**
 * Cinematic Atmosphere — Glaskopfzeile über der Hero-Fotografie: dunkles
 * Zinc, dünner weißer Hairline-Rand, gedimmte Versalien-Links. Passt zur
 * Atmosphere-Linie (HeroV3) — kein Kerzengold, sondern der reaktive
 * Akzent aus der Theme-Engine.
 */

const LINKS = [
  { label: 'Kollektion', href: '/kollektion' },
  { label: 'Weingut', href: '/weingut' },
  { label: 'Verkostung', href: '/verkostung' },
]

export function NavCinematic() {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Hauptnavigation" className="border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <a
          href="/"
          className="font-display flex min-h-11 items-center text-xl font-medium tracking-tight text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
        >
          Buchart<span className="text-accent-lifted">°58</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Wachsende Hairline statt Pill: dieselbe Geste wie in den CTA-/
              Footer-Sections der Linie — die Pille war das einzige Element im
              ganzen Stil mit Radius. */}
          <a
            href="/kollektion"
            className="group hidden min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-accent-lifted uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none sm:inline-flex"
          >
            Entdecken
            <span
              aria-hidden="true"
              className="h-px w-6 bg-accent-lifted/60 transition-all duration-500 group-hover:w-12 group-hover:bg-accent-lifted"
            />
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="nav-cinematic-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            className="flex h-11 w-11 items-center justify-center text-zinc-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:outline-none lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure */}
      {open && (
        <div id="nav-cinematic-menu" className="border-t border-white/10 px-6 py-4 lg:hidden">
          {[...LINKS, { label: 'Entdecken', href: '/kollektion' }].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-11 items-center text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
