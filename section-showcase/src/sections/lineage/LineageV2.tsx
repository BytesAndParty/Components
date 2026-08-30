import { useSearchParams } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, Grape, Wine, X } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'

import {
  bridgesOf,
  childrenOf,
  CLUSTER_LABEL,
  CLUSTER_LEAD,
  diamondsOf,
  hasUnknownParent,
  kindLabel,
  nodeById,
  nodesInCluster,
  originStatement,
  parentsOf,
  REBSTOCKMIETE,
  siblingsOf,
  type Cluster,
  type GrapeNode,
} from './lineage-graph'
import { LineageStage } from './lineage-stage'

/**
 * „Die vier Häuser" — Galerie pro Familie.
 *
 * Der Einstieg ist bewusst KEINE Gesamtkarte: Die alte Bühne zeigte 20 Knoten
 * gleichzeitig und musste dafür auf Faktor 0,72 schrumpfen. Hier wählt man
 * zuerst ein Haus, und dann stehen nur noch 6–10 Sorten auf der Bühne — bei
 * ungefähr Maßstab 1, also in echter Schriftgröße.
 *
 * Die Häuser sind erzählerische Cluster (Ort und Zeit), keine Taxonomie:
 * eine Weinbauregion, eine Zuchtanstalt, eine Einwanderungswelle, die Urväter.
 *
 * Der Preis dieser Gliederung sind die Kanten ZWISCHEN den Häusern. Sie werden
 * als „Brücken" mitgerendert — gestrichelt, gedämpft, anklickbar. Ohne sie
 * zerfiele die Galerie in Inseln, was das bekannte Risiko dieses Musters ist.
 *
 * URL-State: `?haus=thermenregion` und `?rebe=rotgipfler`.
 */

const HOUSES: Cluster[] = ['thermenregion', 'klosterneuburg', 'amerikaner', 'ahnen']

// ── Detail ───────────────────────────────────────────────────────────────────

function RebstockCTA() {
  return (
    <div className="rounded-xl border border-accent/40 p-4" style={{ background: 'color-mix(in oklch, var(--accent) 8%, transparent)' }}>
      <p className="font-display text-lg font-medium text-foreground">{REBSTOCKMIETE.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{REBSTOCKMIETE.note}</p>
      <p className="mt-3 text-sm font-semibold text-accent-readable">{REBSTOCKMIETE.price}</p>
    </div>
  )
}

function Relation({ label, ids, onPick }: { label: string; ids: string[]; onPick: (id: string) => void }) {
  if (ids.length === 0) return null
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ids.map(id => (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            className="rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground transition-colors hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
          >
            {nodeById(id)?.name ?? id}
          </button>
        ))}
      </div>
    </div>
  )
}

function Detail({ node, onPick, onClose }: { node: GrapeNode; onPick: (id: string) => void; onClose: () => void }) {
  const sibs = siblingsOf(node.id)
  const diamonds = diamondsOf(node.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
            {node.colour === 'red' ? 'Rotwein' : 'Weißwein'} · {kindLabel(node)} · {node.epoch.label}
          </p>
          <h3 className="font-display mt-2 text-3xl leading-none font-medium text-foreground">{node.name}</h3>
          {node.aka && <p className="font-display text-base text-muted-foreground italic">auch: {node.aka}</p>}
          {node.primeName && node.primeName !== node.name && (
            <p className="mt-1 text-xs text-muted-foreground">Botanisch: {node.primeName}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Detail schließen"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <X size={16} />
        </button>
      </div>

      {node.image && (
        <div className="overflow-hidden rounded-lg border border-border" style={{ aspectRatio: '16 / 10' }}>
          <img src={node.image} alt={`${node.name} — illustrative Aufnahme`} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}

      {node.tagline && <p className="text-sm leading-relaxed text-muted-foreground">{node.tagline}</p>}

      <div className="border-t border-border pt-4">
        <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">Herkunft</p>
        <p className="mt-2 text-sm text-foreground">{originStatement(node)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{node.origin}</p>
        {node.epoch.note && <p className="mt-1 text-xs text-muted-foreground italic">{node.epoch.note}</p>}
        {node.vivcId && (
          <a
            href={`https://www.vivc.de/index.php?r=passport/view&id=${node.vivcId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-accent-readable underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
          >
            VIVC {node.vivcId} ↗
          </a>
        )}
      </div>

      <Relation label="Eltern" ids={parentsOf(node.id)} onPick={onPick} />
      {hasUnknownParent(node.id) && (
        <p className="-mt-3 text-xs text-muted-foreground italic">
          Ein weiterer Elternteil ist nachgewiesen, aber bis heute unbenannt.
        </p>
      )}
      <Relation label="Vollgeschwister" ids={sibs.full} onPick={onPick} />
      <Relation label="Halbgeschwister" ids={sibs.half} onPick={onPick} />
      <Relation label="Nachkommen" ids={childrenOf(node.id)} onPick={onPick} />

      {diamonds.length > 0 && (
        <div className="rounded-lg border border-border bg-card/60 p-3">
          <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">Mehrfach verwandt</p>
          <ul className="mt-2 flex flex-col gap-1">
            {diamonds.map(d => (
              <li key={d.ancestor} className="text-[13px] text-foreground">
                {nodeById(d.ancestor)?.name} fließt <strong className="font-semibold">{d.paths}×</strong> ein
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Rückkreuzung — derselbe Vorfahre über mehrere Wege. Deshalb ist ein Rebstammbaum kein Baum.
          </p>
        </div>
      )}

      {node.aromas && node.aromas.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">Im Glas</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {node.aromas.map(a => (
              <span key={a} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-foreground/85">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {node.lagen && node.lagen.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
            <Grape size={12} /> Lagen in Sooss
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {node.lagen.map(l => (
              <li key={l.name} className="rounded-lg border border-border bg-card p-3">
                <p className="text-sm font-medium text-foreground">{l.name}</p>
                <dl className="mt-1.5 grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <dt className="text-muted-foreground/70">Boden</dt>
                    <dd className="text-foreground/80">{l.soil}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground/70">Lage</dt>
                    <dd className="text-foreground/80">{l.exposition}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground/70">Höhe</dt>
                    <dd className="text-foreground/80">{l.elevation}</dd>
                  </div>
                </dl>
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
          <ul className="mt-2 flex flex-col gap-2">
            {node.wines.map(w => (
              <li key={`${w.name}-${w.vintage}`} className="flex items-start justify-between gap-3 border-b border-border/70 pb-2 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {w.name} <span className="text-muted-foreground">{w.vintage}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {w.style} · {w.note}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-accent-readable">{w.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {node.inHouse && <RebstockCTA />}
    </div>
  )
}

// ── Galerie-Einstieg ─────────────────────────────────────────────────────────

function HouseCard({ cluster, onOpen }: { cluster: Cluster; onOpen: () => void }) {
  const members = nodesInCluster(cluster)
  const inHouse = members.filter(m => m.inHouse)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0 motion-reduce:transition-none outline-none"
    >
      <span className="text-[10px] font-bold tracking-[0.28em] text-muted-foreground uppercase">
        {members.length} Sorten · {inHouse.length} im Sortiment
      </span>
      <span className="font-display text-3xl leading-none text-foreground">{CLUSTER_LABEL[cluster]}</span>
      <span className="text-sm leading-relaxed text-muted-foreground">{CLUSTER_LEAD[cluster]}</span>
      <span className="mt-1 flex flex-wrap gap-1.5">
        {members.slice(0, 5).map(m => (
          <span key={m.id} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {m.name}
          </span>
        ))}
        {members.length > 5 && (
          <span className="px-1 py-1 text-[11px] text-muted-foreground">+{members.length - 5}</span>
        )}
      </span>
    </button>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────

export function LineageV2() {
  const reduce = useReducedMotion()
  const [params, setParams] = useSearchParams()

  const houseParam = params.get('haus')
  const house = HOUSES.includes(houseParam as Cluster) ? (houseParam as Cluster) : null
  const rebeParam = params.get('rebe')
  const selected = rebeParam && nodeById(rebeParam) ? nodeById(rebeParam)! : null

  function update(next: { haus?: Cluster | null; rebe?: string | null }, replace = false) {
    setParams(
      prev => {
        const p = new URLSearchParams(prev)
        if ('haus' in next) {
          if (next.haus) p.set('haus', next.haus)
          else p.delete('haus')
        }
        if ('rebe' in next) {
          if (next.rebe) p.set('rebe', next.rebe)
          else p.delete('rebe')
        }
        return p
      },
      { replace },
    )
  }

  /** Wechsel zu einer Sorte — springt bei Bedarf in deren Haus. */
  function pickGrape(id: string) {
    const n = nodeById(id)
    if (!n) return
    if (house && n.cluster !== house) update({ haus: n.cluster, rebe: id })
    else update({ rebe: id }, true)
  }

  const stageIds = house ? [...nodesInCluster(house).map(n => n.id), ...bridgesOf(house)] : []
  const bridgeIds = house ? bridgesOf(house) : []

  return (
    <section className="relative w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 lg:px-8">
        <header className="max-w-2xl">
          <BlurFade delay={100}>
            <span className="text-[11px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
              Sooss · Thermenregion · Ampelographie
            </span>
          </BlurFade>
          <BlurFade delay={220}>
            <h2 className="font-display mt-4 text-4xl leading-[0.95] font-light tracking-tight text-foreground lg:text-6xl">
              Von einer Rebe <span className="italic">stammen viele.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={340}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Rebsorten vererben sich anders als Menschen. Eine Sorte ist ein Klon — der Traminer von heute ist
              derselbe Stock wie vor tausend Jahren, und er lebt gleichzeitig mit seinen Urenkeln. Vier Häuser,
              jedes mit seiner eigenen Geschichte.
            </p>
          </BlurFade>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {!house ? (
            <motion.div
              key="gallery"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
              className="mt-14 grid gap-5 sm:grid-cols-2"
            >
              {HOUSES.map(c => (
                <HouseCard key={c} cluster={c} onOpen={() => update({ haus: c, rebe: null })} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={house}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
              className="mt-12"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
                <div>
                  <h3 className="font-display text-3xl text-foreground">{CLUSTER_LABEL[house]}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{CLUSTER_LEAD[house]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => update({ haus: null, rebe: null })}
                  className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm text-foreground transition-colors hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
                >
                  <ArrowLeft size={15} /> Alle Häuser
                </button>
              </div>

              <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
                <LineageStage
                  ids={stageIds}
                  bridgeIds={bridgeIds}
                  selectedId={selected?.id ?? null}
                  onSelect={pickGrape}
                />

                {/* Klebt am oberen Rand — kann nicht aus dem Viewport scrollen. */}
                <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:overflow-y-auto">
                  {selected ? (
                    <Detail node={selected} onPick={pickGrape} onClose={() => update({ rebe: null }, true)} />
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-6">
                      <p className="font-display text-xl text-foreground">Eine Sorte wählen</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Die Punkte auf den Linien sind Kreuzungen — dort treffen sich zwei Elternlinien und
                        werden zu einer. Gestrichelte Kästchen gehören zu einem anderen Haus.
                      </p>
                    </div>
                  )}
                </aside>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex items-center gap-6 border-t border-border pt-8">
          <span aria-hidden="true" className="h-px w-16 bg-border" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
            Abstammung gegen VIVC belegt · Weine, Lagen &amp; Bilder illustrativ
          </p>
        </div>
      </div>
    </section>
  )
}
