import { useRef, useState } from 'react'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useDisclosureDismiss } from '@components/lib/use-disclosure-dismiss'

/**
 * Standard Premium — semantische Kopfzeile über Design-Tokens (Dark/Light-fähig):
 * Sans-Wortmark, ruhige Link-Reihe, Suche + Warenkorb mit Akzent-Badge und
 * Accent-CTA. Mobile klappt in ein Disclosure-Panel.
 */

const LINKS = [
  { label: 'Sortiment', href: '/sortiment', current: true },
  { label: 'Weingut', href: '/weingut', current: false },
  { label: 'Verkostung', href: '/verkostung', current: false },
  { label: 'Journal', href: '/journal', current: false },
]

export function NavV1() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  // Escape schließt das Menü und gibt den Fokus an den Button zurück.
  useDisclosureDismiss(open, setOpen, toggleRef)

  return (
    <nav aria-label="Hauptnavigation" className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <a href="/" className="text-foreground focus-visible:ring-ring flex min-h-11 items-center gap-2 rounded-md text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none">
          Buchart<span className="text-accent">°58</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              className={`focus-visible:ring-ring flex min-h-11 items-center rounded-md px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                link.current
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Suche öffnen"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            aria-label="Warenkorb, 2 Artikel"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ShoppingBag size={17} />
            <span aria-hidden="true" className="bg-accent text-accent-foreground absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums">
              2
            </span>
          </button>
          <a
            href="/sortiment"
            className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring hidden min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            Ab Hof kaufen
          </a>
          <button
            type="button"
            ref={toggleRef}
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="nav-v1-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure */}
      {open && (
        <div id="nav-v1-menu" className="border-border border-t px-6 py-3 lg:hidden">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={link.current ? 'page' : undefined}
              className={`focus-visible:ring-ring flex min-h-11 items-center rounded-md px-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                link.current ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
