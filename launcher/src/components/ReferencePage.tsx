import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { LauncherCard } from './LauncherCard'

const DEV = import.meta.env.DEV

const COMPONENTS_HREF = DEV ? 'http://localhost:5171' : '/components/'
const SECTIONS_BASE = DEV ? 'http://localhost:5174/' : '/sections/'

interface LinkEntry {
  label: string
  href: string
  description: string
}

const LINKS: LinkEntry[] = [
  {
    label: 'Component-Showcase',
    href: COMPONENTS_HREF,
    description: 'Die einzelnen Bausteine — Buttons, Inputs, Color-Picker, Karten.',
  },
  {
    label: 'Section-Showcase (Editor)',
    href: SECTIONS_BASE,
    description: 'Alle Sections in ihren Varianten, mit Herz-Favoriten und Drag-Reorder.',
  },
  {
    label: 'Section-Showcase (Vorschau)',
    href: `${SECTIONS_BASE}preview`,
    description: 'Die zuletzt im Editor favorisierten Sections als zusammenhängende Seite.',
  },
]

// Feste Section-Reihenfolge + Default-Variante pro Section (angelehnt an die
// „kanonische Komposition" aus STYLE-GUIDE.md §1). Nur eine Variante pro
// Section — Feintuning einzelner Varianten passiert im echten Section-Editor,
// hier geht's nur um eine grobe Ja/Nein-Vorauswahl.
const SECTIONS: { id: string; label: string; variant: string; defaultChecked: boolean }[] = [
  { id: 'nav', label: 'Navigation', variant: 'v3', defaultChecked: true },
  { id: 'hero', label: 'Hero', variant: 'v6', defaultChecked: true },
  { id: 'features', label: 'Features & Story', variant: 'v5', defaultChecked: true },
  { id: 'showcase', label: 'Product Showcase', variant: 'v5', defaultChecked: true },
  { id: 'storefront', label: 'Storefront', variant: 'nocturne', defaultChecked: true },
  { id: 'pricing', label: 'Pricing & Clubs', variant: 'v6', defaultChecked: true },
  { id: 'cta', label: 'Call to Action', variant: 'v5', defaultChecked: true },
  { id: 'timeline', label: 'Heritage & Timeline', variant: 'v2', defaultChecked: true },
  { id: 'testimonials', label: 'Testimonials', variant: 'v2', defaultChecked: true },
  { id: 'gallery', label: 'Bento Gallery', variant: 'v3', defaultChecked: true },
  { id: 'lineage', label: 'Stammbaum', variant: 'v2', defaultChecked: false },
  { id: 'footer', label: 'Footer', variant: 'v5', defaultChecked: true },
]

function buildPreviewSrc(checked: Record<string, boolean>): string {
  const pairs = SECTIONS.filter(s => checked[s.id]).map(s => `${s.id}:${s.variant}`)
  if (pairs.length === 0) return `${SECTIONS_BASE}preview`
  const params = new URLSearchParams({ s: pairs.join(',') })
  return `${SECTIONS_BASE}preview?${params.toString()}`
}

interface ReferencePageProps {
  onBack: () => void
}

export function ReferencePage({ onBack }: ReferencePageProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map(s => [s.id, s.defaultChecked]))
  )

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <button
        type="button"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mb-10 flex items-center gap-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ChevronLeft size={15} />
        Zurück
      </button>

      <header className="mb-12">
        <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.22em] uppercase">
          Referenz
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Aufbau-Referenz
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed">
          Interne Übersicht für den Aufbau der offiziellen buchart58.at-Seite (aktuell in Arbeit,
          Ziel-Hosting Contabo). Links auf die Showcases, ein eingebetteter Blick auf die
          Component-Bibliothek und eine grobe Sections-Vorauswahl zum schnellen Zusammenklicken
          einer Seiten-Idee.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="font-display mb-4 text-xl font-medium tracking-tight">Links</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LINKS.map(l => (
            <li key={l.label}>
              <LauncherCard size="sm" title={l.label} description={l.description} href={l.href} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-4 text-xl font-medium tracking-tight">Components eingebettet</h2>
        <div className="border-border overflow-hidden rounded-2xl border">
          <iframe
            src={COMPONENTS_HREF}
            title="Component-Showcase"
            className="h-[70vh] w-full"
          />
        </div>
      </section>

      <section>
        <h2 className="font-display mb-1 text-xl font-medium tracking-tight">Sections auswählen</h2>
        <p className="text-muted-foreground mb-5 text-xs leading-relaxed">
          Dummy-Vorauswahl — jeweils eine feste Default-Variante pro Section. Feintuning einzelner
          Varianten im vollen Editor (Link oben).
        </p>

        <ul className="mb-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {SECTIONS.map(s => (
            <li key={s.id}>
              <label className="text-foreground has-checked:text-accent flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked[s.id] ?? false}
                  onChange={() => toggle(s.id)}
                  className="border-border focus-visible:ring-ring accent-accent h-4 w-4 rounded focus-visible:ring-2 focus-visible:outline-none"
                />
                {s.label}
              </label>
            </li>
          ))}
        </ul>

        <div className="border-border overflow-hidden rounded-2xl border">
          <iframe
            key={buildPreviewSrc(checked)}
            src={buildPreviewSrc(checked)}
            title="Sections-Vorschau"
            className="h-[70vh] w-full"
          />
        </div>
      </section>
    </div>
  )
}
