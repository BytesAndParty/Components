import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'

import {
  childrenOf,
  hasUnknownParent,
  kinOf,
  kindLabel,
  nodeById,
  parentsOf,
  type GrapeNode,
} from './lineage-graph'
import { layoutSubgraph, type PlacedGrape, type PlacedUnion } from './lineage-layout'

/**
 * Bühne für einen Rebsorten-Teilgraphen.
 *
 * Rendert das Ergebnis von `layoutSubgraph` — Sorten als Kästchen, Kreuzungen
 * als beschrifteter Punkt, Kanten dazwischen. Sie zeigt bewusst NIE den ganzen
 * Graphen: der Aufrufer übergibt 5–12 Knoten, dann passt die Komposition ohne
 * Verkleinerung in den Viewport und die Typografie behält ihre echte Größe.
 *
 * Unterschiede zur alten Bühne, jeder als Antwort auf einen gemessenen Befund:
 *
 *  · Kein Kamera-Zoom über den Text. `SCALE_FLOOR` begrenzt die Verkleinerung
 *    auf 0,8; darunter scrollt der Container, statt die Schrift unlesbar zu
 *    machen (alt: 6,5 px Metazeile auf einem 13"-Laptop).
 *  · Kanten bei ~55 % Vordergrund und 2 px statt 15 % bei 1,3 px (WCAG 1.4.11).
 *  · Hervorhebung über `kinOf` — Vorfahren UND Nachkommen. Die alte Bühne
 *    kannte nur Vorfahren, deshalb leuchtete beim Klick auf eine Urrebe nichts.
 *  · Kein Ranken-Wasserzeichen. Es zeichnete Kurven in derselben Formsprache
 *    wie die Kanten, nur dreimal so breit.
 *  · Tastaturreihenfolge folgt den tatsächlichen Koordinaten, nicht einem
 *    separat gepflegten row/col (das widersprach dem Bild in 3 von 4 Reihen).
 */

const SCALE_FLOOR = 0.8

export interface LineageStageProps {
  /** Welche Sorten gezeigt werden. Der Aufrufer entscheidet den Ausschnitt. */
  ids: string[]
  selectedId: string | null
  onSelect: (id: string) => void
  /** Sorten ausserhalb des eigenen Hauses — gedämpft als Brücke gerendert. */
  bridgeIds?: string[]
  className?: string
}

/** Startpunkt eines SVG-Pfads („M x y …"). */
function pathStart(d: string): { x: number; y: number } | null {
  const m = /^M\s*(-?[\d.]+)\s+(-?[\d.]+)/.exec(d)
  return m ? { x: Number(m[1]), y: Number(m[2]) } : null
}

function ColourDot({ colour }: { colour: GrapeNode['colour'] }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-2 shrink-0 rounded-full ring-1 ring-inset ring-foreground/25"
      style={{ background: colour === 'red' ? 'oklch(0.48 0.17 18)' : 'oklch(0.85 0.09 92)' }}
    />
  )
}

function nodeAria(n: GrapeNode): string {
  const colour = n.colour === 'red' ? 'Rotwein' : 'Weißwein'
  const ps = parentsOf(n.id).map(p => nodeById(p)?.name ?? p)
  const rel = n.isFounder
    ? 'Urahn, Eltern unbekannt'
    : ps.length
      ? `Kreuzung aus ${ps.join(' und ')}${hasUnknownParent(n.id) ? ' und einem unbekannten Elternteil' : ''}`
      : 'Abstammung nicht erfasst'
  const kids = childrenOf(n.id).length
  const kidText = kids ? `, ${kids} Nachkomme${kids > 1 ? 'n' : ''} in dieser Ansicht` : ''
  const wines = n.wines?.length ? `, ${n.wines.length} Weine im Haus` : ''
  return `${n.name}, ${colour}, ${kindLabel(n)}, ${n.epoch.label}. ${rel}${kidText}${wines}.`
}

export function LineageStage({ ids, selectedId, onSelect, bridgeIds = [], className }: LineageStageProps) {
  const reduce = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef(new Map<string, HTMLButtonElement | null>())
  const [box, setBox] = useState({ w: 0, h: 0 })

  const layout = layoutSubgraph(ids)
  const grapes = layout.nodes.filter((n): n is PlacedGrape => n.kind === 'grape')
  const unions = layout.nodes.filter((n): n is PlacedUnion => n.kind === 'union')
  const bridge = new Set(bridgeIds)

  // Tab-Reihenfolge = Leserichtung der tatsächlichen Komposition.
  const ordered = [...grapes].sort((a, b) => a.cy - b.cy || a.cx - b.cx)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const rovingId = focusedId && grapes.some(g => g.id === focusedId) ? focusedId : (ordered[0]?.id ?? null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setBox({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fit = box.w > 0 && layout.width > 0 ? Math.min(1, box.w / layout.width) : 1
  const scale = Math.max(SCALE_FLOOR, fit)

  const lit = selectedId ? kinOf(selectedId) : null
  const isLit = (id: string) => !lit || lit.has(id)

  function focusNode(id: string) {
    setFocusedId(id)
    btnRefs.current.get(id)?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, g: PlacedGrape) {
    let next: string | undefined
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowLeft': {
        const row = grapes.filter(x => Math.abs(x.cy - g.cy) < 1).sort((a, b) => a.cx - b.cx)
        const i = row.findIndex(x => x.id === g.id)
        next = row[i + (e.key === 'ArrowRight' ? 1 : -1)]?.id
        break
      }
      case 'ArrowUp':
        next = parentsOf(g.id).find(p => grapes.some(x => x.id === p))
        break
      case 'ArrowDown':
        next = childrenOf(g.id).find(c => grapes.some(x => x.id === c))
        break
      case 'Enter':
      case ' ':
        // Die Command-Bar des Showcases hört auf `window` und würde sonst die
        // Section wechseln — stopPropagation schneidet sie ab, weil React seine
        // Handler am Root-Container registriert und `window` später im Pfad liegt.
        e.stopPropagation()
        e.preventDefault()
        onSelect(g.id)
        return
      default:
        return
    }
    e.stopPropagation()
    e.preventDefault()
    if (next) focusNode(next)
  }

  const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 150, damping: 20 }

  return (
    <div
      ref={boxRef}
      className={cn('relative w-full overflow-x-auto overflow-y-hidden', className)}
      style={{ height: layout.height * scale }}
    >
      <div
        role="group"
        aria-label="Abstammung. Mit Tab eine Sorte fokussieren, mit den Pfeiltasten zu Eltern, Kindern und Nachbarn wechseln, mit Enter öffnen."
        className="relative"
        style={{
          width: layout.width,
          height: layout.height,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Kanten + Kreuzungspunkte */}
        <svg
          width={layout.width}
          height={layout.height}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {layout.edges.map(e => {
            const on = (!e.from || isLit(e.from)) && isLit(e.to)
            const dashed = e.confidence === 'hypothesis' || e.unknownParent
            return (
              <path
                key={e.id}
                d={e.d}
                fill="none"
                strokeLinecap="round"
                stroke={on && lit ? 'var(--accent)' : 'color-mix(in oklch, var(--foreground) 55%, transparent)'}
                strokeWidth={on && lit ? 2.5 : 2}
                strokeDasharray={dashed ? '5 6' : undefined}
                style={{
                  opacity: on ? 1 : 0.25,
                  transition: reduce ? undefined : 'opacity 260ms, stroke 260ms',
                }}
              />
            )
          })}

          {/* Fragezeichen am unbenannten Elternteil */}
          {layout.edges
            .filter(e => e.unknownParent)
            .map(e => {
              const p = pathStart(e.d)
              if (!p) return null
              return (
                <g key={`q-${e.id}`} opacity={isLit(e.to) ? 0.85 : 0.3}>
                  <circle cx={p.x} cy={p.y} r={13} fill="var(--card)" stroke="color-mix(in oklch, var(--foreground) 45%, transparent)" strokeWidth={1.5} strokeDasharray="4 4" />
                  <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">?</text>
                </g>
              )
            })}

          {/* Kreuzungspunkte: hier treffen sich die Elternlinien */}
          {unions.map(u => {
            const on = isLit(u.childId)
            return (
              <g key={u.id} opacity={on ? 1 : 0.3} style={{ transition: reduce ? undefined : 'opacity 260ms' }}>
                <circle
                  cx={u.cx}
                  cy={u.cy}
                  r={u.r}
                  fill={on && lit ? 'var(--accent)' : 'color-mix(in oklch, var(--foreground) 70%, transparent)'}
                />
                <text
                  x={u.cx + u.r + 8}
                  y={u.cy + 4}
                  fontSize={11}
                  fill="var(--muted-foreground)"
                  className="font-medium"
                >
                  {u.label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Sorten */}
        {grapes.map(g => {
          const n = nodeById(g.id)
          if (!n) return null
          const on = isLit(g.id)
          const selected = g.id === selectedId
          const isBridge = bridge.has(g.id)
          return (
            <motion.button
              key={g.id}
              ref={el => {
                btnRefs.current.set(g.id, el)
              }}
              type="button"
              tabIndex={rovingId === g.id ? 0 : -1}
              aria-pressed={selected}
              aria-label={nodeAria(n)}
              onFocus={() => setFocusedId(g.id)}
              onClick={() => onSelect(g.id)}
              onKeyDown={e => onKeyDown(e, g)}
              animate={{ opacity: on ? 1 : 0.35 }}
              transition={spring}
              className={cn(
                'absolute flex flex-col justify-center gap-1 rounded-xl border bg-card px-4 text-left outline-none',
                'transition-[border-color,box-shadow,transform] duration-200 motion-reduce:transition-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                  ? 'border-accent shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)]'
                  : 'border-border hover:-translate-y-0.5 hover:border-accent/60 motion-reduce:hover:translate-y-0',
                isBridge && 'border-dashed',
              )}
              style={{ left: g.x, top: g.y, width: g.w, height: g.h }}
            >
              <span className="flex items-center gap-2">
                <ColourDot colour={n.colour} />
                <span className="font-display text-[20px] leading-tight text-foreground">{n.name}</span>
              </span>
              <span className="flex items-center gap-2 text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
                {kindLabel(n)} · {n.epoch.label}
                {n.wines?.length ? <span className="text-accent-readable normal-case">· im Haus</span> : null}
              </span>
              {isBridge && (
                <span className="text-[10px] text-muted-foreground/80">gehört zu einem anderen Haus</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
