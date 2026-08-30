import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CornerDownLeft, Grape, Wine } from 'lucide-react'
import { cn } from '@components/lib/utils'

import {
  childrenOf,
  CLUSTER_LABEL,
  diamondsOf,
  EDGES,
  hasUnknownParent,
  kindLabel,
  nodeById,
  NODES,
  originStatement,
  parentsOf,
  REBSTOCKMIETE,
  siblingsOf,
  type GrapeNode,
} from './lineage-graph'

/**
 * „Eine Rebe, ein Bildschirm" — Fokus statt Landkarte.
 *
 * Der Gegenentwurf zur Galerie: Es gibt NIE eine Gesamtkarte. Immer genau eine
 * Sorte im Zentrum, gross, und drumherum nur die unmittelbare Verwandtschaft.
 * Ein Klick auf einen Nachbarn reist dorthin — er wird zum neuen Zentrum.
 * Wikipedia-Navigation statt Übersichtsplan.
 *
 * Weil nie mehr als 5–8 Kästchen gleichzeitig da sind, dürfen die Verbindungen
 * dick, kontrastreich und BESCHRIFTET sein. Die Frage „wie sind sie verbunden"
 * ist damit nicht mehr interpretierbar, sondern hingeschrieben.
 *
 * Technisch bewusst anders als LineageV2: keine Koordinaten-Mathematik,
 * sondern normales Flow-Layout. Die Verbindungen sind gerade Linien in einem
 * genormten viewBox mit `preserveAspectRatio="none"` — gerade Linien bleiben
 * unter nicht-uniformer Skalierung gerade, also stimmt die Geometrie bei jeder
 * Breite, ohne dass irgendetwas gemessen werden muss. Das Layout reflowt damit
 * echt (statt zu skalieren) und die Tab-Reihenfolge ergibt sich aus dem DOM.
 *
 * URL-State: `?rebe=…`. Jede Reise ist ein History-Eintrag, Browser-Zurück
 * fährt die Spur zurück.
 */

const START_ID = 'rotgipfler'

// ── Verbindungen ─────────────────────────────────────────────────────────────

/** Y-Verbindung von n Eltern herunter auf einen Punkt. */
function ConnectorUp({ count, label, lit }: { count: number; label: string; lit: boolean }) {
  const stroke = lit ? 'var(--accent)' : 'color-mix(in oklch, var(--foreground) 55%, transparent)'
  // Ansatzpunkte gleichmässig verteilt — deckt sich mit der flex-Verteilung darüber.
  const xs = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100)
  return (
    <div className="relative h-20 w-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {xs.map(x => (
          <line key={x} x1={x} y1="0" x2="50" y2="62" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1="50" y1="62" x2="50" y2="100" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Der Kreuzungspunkt: hier werden zwei Elternlinien zu einer. */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2" style={{ top: '62%' }}>
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: lit ? 'var(--accent)' : 'color-mix(in oklch, var(--foreground) 70%, transparent)' }}
        />
        <span className="text-[12px] whitespace-nowrap text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

/** Fächer vom Zentrum herunter auf n Kinder. */
function ConnectorDown({ count }: { count: number }) {
  const stroke = 'color-mix(in oklch, var(--foreground) 55%, transparent)'
  const xs = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100)
  return (
    <div className="relative h-16 w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="50" y1="0" x2="50" y2="34" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {xs.map(x => (
          <line key={x} x1="50" y1="34" x2={x} y2="100" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  )
}

/** Sichtbares Ende des Wissens — nicht dasselbe wie fehlende Daten. */
function FounderCap() {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3 pb-2">
      <div
        aria-hidden="true"
        className="h-px w-40"
        style={{ background: 'repeating-linear-gradient(90deg, color-mix(in oklch, var(--foreground) 50%, transparent) 0 6px, transparent 6px 12px)' }}
      />
      <p className="text-center text-[13px] leading-relaxed text-muted-foreground">
        Urahn — die Eltern sind nicht bekannt.
        <br />
        <span className="text-muted-foreground/75">Hier endet das gesicherte Wissen, nicht die Datenlage.</span>
      </p>
    </div>
  )
}

// ── Karten ───────────────────────────────────────────────────────────────────

function ColourDot({ colour }: { colour: GrapeNode['colour'] }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-2 shrink-0 rounded-full ring-1 ring-inset ring-foreground/25"
      style={{ background: colour === 'red' ? 'oklch(0.48 0.17 18)' : 'oklch(0.85 0.09 92)' }}
    />
  )
}

function NeighbourCard({
  id,
  relation,
  onGo,
}: {
  id: string
  /** Verwandtschaftsrolle für das aria-label — NICHT die ARIA-Rolle. */
  relation: string
  onGo: (id: string) => void
}) {
  const n = nodeById(id)
  if (!n) return null
  return (
    <button
      type="button"
      onClick={() => onGo(id)}
      aria-label={`${relation}: ${n.name}, ${kindLabel(n)}, ${n.epoch.label}. Öffnen.`}
      className="group flex min-h-11 w-full max-w-[240px] flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0 motion-reduce:transition-none outline-none"
    >
      <span className="flex items-center gap-2">
        <ColourDot colour={n.colour} />
        <span className="font-display text-[19px] leading-tight text-foreground">{n.name}</span>
      </span>
      <span className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
        {kindLabel(n)} · {n.epoch.label}
      </span>
    </button>
  )
}

/** Stellvertreter für den nachgewiesenen, aber unbenannten Elternteil. */
function UnknownParentCard() {
  return (
    <div className="flex w-full max-w-[240px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border px-4 py-3 text-center">
      <span className="font-display text-[19px] leading-tight text-muted-foreground">?</span>
      <span className="text-[11px] leading-snug text-muted-foreground">
        nachgewiesen,
        <br />
        aber unbenannt
      </span>
    </div>
  )
}

// ── Zentrum ──────────────────────────────────────────────────────────────────

function CentreCard({ node }: { node: GrapeNode }) {
  const diamonds = diamondsOf(node.id)
  return (
    <article className="w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/50 bg-card shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55)]">
      <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {node.image && (
          <div className="min-h-44 border-b border-border sm:border-r sm:border-b-0">
            <img src={node.image} alt={`${node.name} — illustrative Aufnahme`} loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-4 p-6">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
              <ColourDot colour={node.colour} />
              {kindLabel(node)} · {node.epoch.label} · {CLUSTER_LABEL[node.cluster]}
            </p>
            <h3 className="font-display mt-2 text-4xl leading-none font-medium text-foreground">{node.name}</h3>
            {node.aka && <p className="font-display text-base text-muted-foreground italic">auch: {node.aka}</p>}
          </div>

          {node.tagline && <p className="text-sm leading-relaxed text-muted-foreground">{node.tagline}</p>}

          <p className="text-sm text-foreground">{originStatement(node)}</p>

          {node.aromas && node.aromas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {node.aromas.map(a => (
                <span key={a} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-foreground/85">
                  {a}
                </span>
              ))}
            </div>
          )}

          {diamonds.length > 0 && (
            <p className="rounded-lg border border-border px-3 py-2 text-[13px] text-foreground">
              {diamonds.map(d => `${nodeById(d.ancestor)?.name} ${d.paths}×`).join(' · ')}
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Rückkreuzung — derselbe Vorfahre über mehrere Wege.
              </span>
            </p>
          )}

          {node.vivcId && (
            <a
              href={`https://www.vivc.de/index.php?r=passport/view&id=${node.vivcId}`}
              target="_blank"
              rel="noreferrer"
              className="w-fit rounded-sm text-xs text-accent-readable underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring outline-none"
            >
              VIVC {node.vivcId} ↗
            </a>
          )}
        </div>
      </div>

      {((node.lagen?.length ?? 0) > 0 || (node.wines?.length ?? 0) > 0) && (
        <div className="grid gap-6 border-t border-border p-6 sm:grid-cols-2">
          {node.lagen && node.lagen.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
                <Grape size={12} /> Lagen in Sooss
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {node.lagen.map(l => (
                  <li key={l.name} className="text-[13px] text-foreground">
                    {l.name} <span className="text-muted-foreground">· {l.soil}, {l.exposition}, {l.elevation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {node.wines && node.wines.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
                <Wine size={12} /> Weine im Haus
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {node.wines.map(w => (
                  <li key={`${w.name}-${w.vintage}`} className="flex justify-between gap-3 text-[13px]">
                    <span className="text-foreground">
                      {w.name} <span className="text-muted-foreground">{w.vintage}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-accent-readable">{w.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {node.inHouse && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-accent/30 px-6 py-4" style={{ background: 'color-mix(in oklch, var(--accent) 7%, transparent)' }}>
          <div>
            <p className="font-display text-lg text-foreground">{REBSTOCKMIETE.label}</p>
            <p className="text-xs text-muted-foreground">{REBSTOCKMIETE.note}</p>
          </div>
          <span className="text-sm font-semibold text-accent-readable">{REBSTOCKMIETE.price}</span>
        </div>
      )}
    </article>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────

/** Beschriftung des Kreuzungs-Ereignisses. */
function crossingLabel(n: GrapeNode): string {
  const place = n.origin.split('·')[0].replace(/\s*\d{4}\s*/, '').trim()
  return place && place.length < 24 ? `${place} · ${n.epoch.label}` : `Kreuzung · ${n.epoch.label}`
}

export function LineageV3() {
  const reduce = useReducedMotion()
  const [params, setParams] = useSearchParams()
  const [trail, setTrail] = useState<string[]>([])

  const param = params.get('rebe')
  const centre = (param && nodeById(param)) || nodeById(START_ID)!

  function go(id: string) {
    if (id === centre.id) return
    setTrail(t => [...t.filter(x => x !== centre.id), centre.id].slice(-6))
    setParams(
      prev => {
        const p = new URLSearchParams(prev)
        p.set('rebe', id)
        return p
      },
      { replace: false },
    )
  }

  const parents = parentsOf(centre.id)
  const unknown = hasUnknownParent(centre.id)
  const kids = childrenOf(centre.id)
  const sibs = siblingsOf(centre.id)
  const parentSlots = parents.length + (unknown ? 1 : 0)

  // Für jedes Kind: mit wem wurde gekreuzt?
  const kidPartner = (kid: string) =>
    EDGES.filter(e => e.kind === 'crossing' && e.to === kid && e.from && e.from !== centre.id)
      .map(e => nodeById(e.from!)?.name)
      .filter(Boolean)
      .join(' und ')

  return (
    <section className="relative w-full bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 lg:px-8">
        <header className="w-full max-w-2xl text-center">
          <span className="text-[11px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
            Sooss · Thermenregion · Ampelographie
          </span>
          <h2 className="font-display mt-4 text-4xl leading-[0.95] font-light tracking-tight text-foreground lg:text-5xl">
            Jede Rebe hat <span className="italic">ihre Verwandtschaft.</span>
          </h2>
        </header>

        {/* Reise-Leiste — Gedächtnis statt Landkarte */}
        {trail.length > 0 && (
          <nav aria-label="Zuletzt besucht" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <CornerDownLeft size={13} className="text-muted-foreground" aria-hidden="true" />
            {trail.map(id => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className="min-h-11 rounded-full border border-border px-3 text-[12px] text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
              >
                {nodeById(id)?.name}
              </button>
            ))}
          </nav>
        )}

        <p aria-live="polite" className="sr-only">
          {centre.name}. {originStatement(centre)}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={centre.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 20 }}
            className="mt-12 flex w-full flex-col items-center"
          >
            {/* ── Eltern ── */}
            {centre.isFounder ? (
              <FounderCap />
            ) : parentSlots > 0 ? (
              <>
                <div className="flex w-full max-w-3xl items-stretch justify-center gap-6">
                  {parents.map(p => (
                    <NeighbourCard key={p} id={p} relation="Elternteil" onGo={go} />
                  ))}
                  {unknown && <UnknownParentCard />}
                </div>
                <div className="w-full max-w-3xl">
                  <ConnectorUp count={parentSlots} label={crossingLabel(centre)} lit />
                </div>
              </>
            ) : (
              <p className="pb-6 text-center text-[13px] text-muted-foreground">
                Abstammung für diesen Showcase nicht weiter verfolgt.
              </p>
            )}

            {/* ── Zentrum ── */}
            <CentreCard node={centre} />

            {/* ── Kinder ── */}
            {kids.length > 0 && (
              <>
                <div className="w-full max-w-3xl">
                  <ConnectorDown count={kids.length} />
                </div>
                <div className="flex w-full max-w-4xl flex-wrap items-stretch justify-center gap-6">
                  {kids.map(k => {
                    const partner = kidPartner(k)
                    return (
                      <div key={k} className="flex max-w-[240px] flex-col items-center gap-1.5">
                        <NeighbourCard id={k} relation="Nachkomme" onGo={go} />
                        {partner && (
                          <span className="text-center text-[11px] leading-snug text-muted-foreground">
                            × {partner}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* ── Geschwister ── */}
            {(sibs.full.length > 0 || sibs.half.length > 0) && (
              <div className="mt-14 w-full max-w-4xl border-t border-border pt-8">
                {sibs.full.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
                      Vollgeschwister — dieselben Eltern
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {sibs.full.map(s => (
                        <NeighbourCard key={s} id={s} relation="Vollgeschwister" onGo={go} />
                      ))}
                    </div>
                  </div>
                )}
                {sibs.half.length > 0 && (
                  <div className={cn(sibs.full.length > 0 && 'mt-8')}>
                    <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
                      Halbgeschwister — ein Elternteil geteilt
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {sibs.half.map(s => (
                        <NeighbourCard key={s} id={s} relation="Halbgeschwister" onGo={go} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sorten-Index — gezielter Einstieg ohne Gesamtkarte */}
        <div className="mt-20 w-full border-t border-border pt-8">
          <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
            Alle Sorten
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {NODES.filter(n => !n.isBreedingLine).map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => go(n.id)}
                aria-current={n.id === centre.id ? 'true' : undefined}
                className={cn(
                  'min-h-11 rounded-full border px-3.5 text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none',
                  n.id === centre.id
                    ? 'border-accent text-accent-readable'
                    : 'border-border text-muted-foreground hover:border-accent/60 hover:text-foreground',
                )}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center gap-6">
          <span aria-hidden="true" className="h-px w-16 bg-border" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
            Abstammung gegen VIVC belegt · Weine, Lagen &amp; Bilder illustrativ
          </p>
        </div>
      </div>
    </section>
  )
}
