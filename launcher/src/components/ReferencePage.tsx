import { useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LauncherCard } from './LauncherCard'
import {
  COMPONENTS_HREF, DECISIONS, GUIDES, LAST_UPDATED, LINK_GROUPS, SECTIONS_BASE, STATUS, WORKFLOW,
} from '../reference-content'

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

const PANEL = 'border-border bg-card rounded-2xl border p-5'

function SectionHeading({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
      {intro && <p className="text-muted-foreground mt-1 max-w-2xl text-xs leading-relaxed">{intro}</p>}
    </div>
  )
}

// Technik für die Devs: standardmäßig zu, damit der Haupttext fürs Weingut lesbar bleibt.
function TechDetails({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group border-border mt-4 border-t pt-3">
      <summary className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex cursor-pointer list-none items-center gap-1 rounded text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        <ChevronRight size={13} className="transition-transform group-open:rotate-90" />
        {summary}
      </summary>
      <div className="text-muted-foreground mt-2 text-xs leading-relaxed">{children}</div>
    </details>
  )
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

      <header className="mb-14">
        <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.22em] uppercase">
          Referenz
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Aufbau-Referenz
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed">
          Wie die neue buchart58.at entsteht: wo man was ansieht, wie man die Werkzeuge bedient
          und warum wir es so bauen. Die Texte sind für alle geschrieben, technische Details
          lassen sich jeweils aufklappen.
        </p>
        <p className="text-muted-foreground/70 mt-3 text-[10px] tracking-[0.18em] uppercase">
          Stand {LAST_UPDATED}
        </p>
      </header>

      <section className="mb-14">
        <SectionHeading title="Wo wir stehen" />
        <ul className="mb-8 max-w-2xl space-y-2 text-sm leading-relaxed">
          {STATUS.map(s => (
            <li key={s} className="flex gap-3">
              <span aria-hidden="true" className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
              {s}
            </li>
          ))}
        </ul>

        <h3 className="mb-3 text-sm font-medium">So kommt eine Änderung live</h3>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW.map((step, i) => (
            <li key={step.title} className={PANEL}>
              <p className="text-accent-readable font-display text-2xl tabular-nums">{i + 1}</p>
              <p className="mt-1 text-sm font-medium">{step.title}</p>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-14">
        <SectionHeading
          title="Links"
          intro="Showcases öffnen im selben Tab, alles Externe in einem neuen."
        />
        <div className="space-y-6">
          {LINK_GROUPS.map(group => (
            <div key={group.title}>
              <h3 className="text-muted-foreground/70 mb-2 text-[10px] tracking-[0.18em] uppercase">{group.title}</h3>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {group.links.map(l => (
                  <li key={l.label}>
                    <LauncherCard size="sm" title={l.label} description={l.description} href={l.href} external={l.external} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <SectionHeading title="So wird's bedient" />
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {GUIDES.map(guide => {
            const List = guide.ordered ? 'ol' : 'ul'
            return (
              <li key={guide.title} className={PANEL}>
                <h3 className="mb-3 text-sm font-medium">{guide.title}</h3>
                <List className={`${guide.ordered ? 'list-decimal' : 'list-disc'} marker:text-muted-foreground/60 space-y-1.5 pl-4 text-xs leading-relaxed`}>
                  {guide.items.map(item => <li key={item}>{item}</li>)}
                </List>
                {guide.note && (
                  <p className="text-muted-foreground mt-3 text-xs leading-relaxed">{guide.note}</p>
                )}
                {guide.shortcuts && (
                  <TechDetails summary="Tastenkürzel">
                    <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
                      {guide.shortcuts.map(sc => (
                        <div key={sc.action} className="contents">
                          <dt className="flex gap-1">
                            {sc.keys.map(k => (
                              <kbd key={k} className="border-border bg-muted text-foreground rounded border px-1.5 py-0.5 font-sans text-[11px]">{k}</kbd>
                            ))}
                          </dt>
                          <dd>{sc.action}</dd>
                        </div>
                      ))}
                    </dl>
                  </TechDetails>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-14">
        <SectionHeading title="Warum wir das so machen" />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DECISIONS.map(d => (
            <li key={d.title} className={`${PANEL} flex flex-col`}>
              <h3 className="text-sm font-medium">{d.title}</h3>
              <p className="text-muted-foreground mt-2 flex-1 text-xs leading-relaxed">{d.why}</p>
              <TechDetails summary="Technische Details">
                <ul className="list-disc space-y-1 pl-4">
                  {d.tech.map(t => <li key={t}>{t}</li>)}
                </ul>
              </TechDetails>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <SectionHeading
          title="Components eingebettet"
          intro="Der Component-Showcase direkt auf dieser Seite, für einen schnellen Blick. Zum Stöbern besser über den Link oben öffnen, dort ist mehr Platz."
        />
        <div className="border-border overflow-hidden rounded-2xl border">
          <iframe
            src={COMPONENTS_HREF}
            title="Component-Showcase"
            className="h-[70vh] w-full"
          />
        </div>
      </section>

      <section>
        <SectionHeading
          title="Sections auswählen"
          intro="Grobe Vorauswahl ohne den Editor: Häkchen setzen oder entfernen, die Vorschau darunter baut sich sofort neu. Jede Section hat hier eine feste Standard-Variante. Varianten tauschen und die Reihenfolge ändern geht im Section-Editor (Link oben)."
        />

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
