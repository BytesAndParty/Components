import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ChevronDown, Grape, Menu, Network, Wine, X } from 'lucide-react'
import { cn } from '@components/lib/utils'

import {
  ancestorsOf,
  EDGES,
  FAMILY_LABEL,
  firstChildOf,
  kindLabel,
  LINEAGE,
  nodeById,
  REBSTOCKMIETE,
  type GrapeNode,
} from './lineage-data'

// ── Layout-Geometrie: Ahnentafel-Pyramide (breite Urreben oben) ─────────────

const NODE_W = 200
const NODE_H = 84
const COL_W = 224
const ROW_H = 188
const TOP = 56
const PADX = 48
const PADY = 60

const MAX_ROW = Math.max(...LINEAGE.map(n => n.row))
const MAX_COL = Math.max(...LINEAGE.map(n => n.col))
const CONTENT_W = PADX * 2 + (MAX_COL + 1) * COL_W
const CONTENT_H = TOP + MAX_ROW * ROW_H + NODE_H + PADY

function nodeX(n: GrapeNode) {
  return PADX + n.col * COL_W + COL_W / 2
}
function nodeTop(n: GrapeNode) {
  return TOP + n.row * ROW_H
}

/** Umrandung der Direktträger-Familie (eigener Stamm). */
const UHUDLER = LINEAGE.filter(n => n.family === 'direkttraeger')
const U_PAD = 26
const UHUDLER_BOX = {
  x: Math.min(...UHUDLER.map(nodeX)) - NODE_W / 2 - U_PAD,
  y: Math.min(...UHUDLER.map(nodeTop)) - U_PAD - 22,
  w: Math.max(...UHUDLER.map(nodeX)) - Math.min(...UHUDLER.map(nodeX)) + NODE_W + U_PAD * 2,
  h: NODE_H + U_PAD * 2 + 22,
}

/** Ids je Zeile, in Spaltenreihenfolge — Grundlage der ←/→-Navigation. */
const ROW_GROUPS = new Map<number, string[]>()
for (const n of [...LINEAGE].sort((a, b) => a.col - b.col)) {
  const arr = ROW_GROUPS.get(n.row) ?? []
  arr.push(n.id)
  ROW_GROUPS.set(n.row, arr)
}

const EMPTY = new Set<string>()

// ── Transform (Überblick ⇄ Fokus-Zoom) ──────────────────────────────────────

interface Size {
  w: number
  h: number
}
interface Transform {
  x: number
  y: number
  scale: number
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function fitTransform(s: Size): Transform {
  const scale = Math.min(s.w / CONTENT_W, s.h / CONTENT_H) * 0.92
  return { scale, x: (s.w - CONTENT_W * scale) / 2, y: (s.h - CONTENT_H * scale) / 2 }
}

function focusTransform(node: GrapeNode, s: Size, panelW: number): Transform {
  // Framing: die Rebe UND ihre direkten Eltern (die sichtbare Verwandtschaft),
  // zentriert im freien Bereich links neben dem Detail-Panel.
  const kin = [node, ...node.parents.map(p => nodeById(p)).filter((n): n is GrapeNode => !!n)]
  const minX = Math.min(...kin.map(nodeX)) - NODE_W / 2
  const maxX = Math.max(...kin.map(nodeX)) + NODE_W / 2
  const minY = Math.min(...kin.map(nodeTop))
  const maxY = Math.max(...kin.map(n => nodeTop(n) + NODE_H))
  const availW = Math.max(s.w - panelW, 320)
  const scale = clamp(Math.min(availW / (maxX - minX), s.h / (maxY - minY)) * 0.7, 0.75, 1.3)
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return { scale, x: availW / 2 - cx * scale, y: s.h / 2 - cy * scale }
}

// ── Kleine Helfer ────────────────────────────────────────────────────────────

const redInk = 'oklch(0.5 0.17 18)'
const whiteInk = 'oklch(0.82 0.09 92)'

function parentNames(n: GrapeNode) {
  return n.parents.map(p => nodeById(p)?.name ?? p).join(' × ')
}

function nodeAria(n: GrapeNode) {
  const color = n.color === 'red' ? 'Rotwein' : 'Weißwein'
  const rel = n.parents.length ? `Kreuzung aus ${parentNames(n)}` : `${kindLabel(n)}, keine Kreuzung`
  const w = n.wines.length ? `, ${n.wines.length} Weine im Haus` : ''
  return `${n.name}, ${color}, ${n.epoch}. ${rel}${w}. Enter zum Heranzoomen.`
}

function sibling(id: string, row: number, dir: number): string | undefined {
  const list = ROW_GROUPS.get(row)!
  return list[list.indexOf(id) + dir]
}

function ColorDot({ color, size = 8 }: { color: GrapeNode['color']; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: color === 'red' ? redInk : whiteInk, boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--foreground) 22%, transparent)' }}
    />
  )
}

// ── Weinreben-Wasserzeichen ──────────────────────────────────────────────────

function GrapeCluster({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  const dx = r * 2.05
  const dy = r * 1.85
  const perRow = [3, 2, 2, 1]
  const dots: { cx: number; cy: number }[] = []
  perRow.forEach((count, ri) => {
    for (let i = 0; i < count; i++) dots.push({ cx: x + (i - (count - 1) / 2) * dx, cy: y + ri * dy })
  })
  return (
    <g>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={r} />
      ))}
    </g>
  )
}

function VineBackdrop() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice" style={{ color: 'var(--foreground)', opacity: 0.05 }}>
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M500,720 C 470,600 540,540 500,440 C 470,360 560,300 520,205 C 500,150 500,105 505,36" />
        <path d="M508,470 C 380,450 300,410 200,342 C 150,307 120,270 95,232" />
        <path d="M500,412 C 640,397 720,352 800,292 C 850,254 880,217 905,182" />
        <path d="M514,300 C 430,285 370,255 300,206" />
        <path d="M512,242 C 610,227 670,197 730,152" />
        <path d="M95,232 c -22,-8 -34,-28 -14,-42" />
        <path d="M905,182 c 22,-10 36,-28 16,-44" />
        <path d="M300,206 c -18,-14 -22,-34 0,-42" />
      </g>
      <g fill="currentColor">
        <GrapeCluster x={200} y={346} r={8} />
        <GrapeCluster x={800} y={296} r={8} />
        <GrapeCluster x={300} y={210} r={7} />
        <GrapeCluster x={730} y={156} r={7} />
        <GrapeCluster x={505} y={58} r={7} />
      </g>
      <g fill="currentColor" opacity="0.7">
        <ellipse cx="250" cy="382" rx="26" ry="14" transform="rotate(-28 250 382)" />
        <ellipse cx="760" cy="332" rx="26" ry="14" transform="rotate(28 760 332)" />
        <ellipse cx="432" cy="300" rx="22" ry="12" transform="rotate(-15 432 300)" />
      </g>
    </svg>
  )
}

// ── Detail-Inhalt (geteilt zwischen Panel & Liste) ──────────────────────────

function RebstockCTA() {
  const [booked, setBooked] = useState(false)
  return (
    <div className="rounded-xl border border-accent/40 p-4" style={{ background: 'color-mix(in oklch, var(--accent) 8%, transparent)' }}>
      <p className="font-display text-lg font-medium text-foreground">{REBSTOCKMIETE.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{REBSTOCKMIETE.note}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-accent">{REBSTOCKMIETE.price}</span>
        <button
          type="button"
          onClick={() => setBooked(b => !b)}
          aria-pressed={booked}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-semibold transition-transform duration-200 active:scale-95 motion-reduce:transition-none',
            'focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none',
            booked ? 'border border-accent/50 text-accent' : 'bg-accent text-accent-foreground hover:brightness-110',
          )}
        >
          {booked ? 'Vorgemerkt ✓' : 'Patenschaft →'}
        </button>
      </div>
    </div>
  )
}

function DetailBody({ node, onSelectParent }: { node: GrapeNode; onSelectParent: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-lg border border-border" style={{ aspectRatio: '16 / 10' }}>
        <img src={node.image} alt={`${node.name} — illustrative Aufnahme`} loading="lazy" className="h-full w-full object-cover" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <ColorDot color={node.color} />
          <span className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
            {node.color === 'red' ? 'Rotwein' : 'Weißwein'} · {kindLabel(node)} · {node.epoch}
          </span>
        </div>
        <h3 className="font-display mt-2 text-3xl leading-none font-medium text-foreground">{node.name}</h3>
        {node.aka && <p className="font-display text-base text-muted-foreground italic">auch: {node.aka}</p>}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{node.tagline}</p>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">Herkunft</p>
        {node.parents.length ? (
          <p className="mt-2 text-sm text-foreground">
            Kreuzung aus{' '}
            {node.parents.map((p, i) => (
              <span key={p}>
                {i > 0 && <span className="text-muted-foreground"> × </span>}
                <button
                  type="button"
                  onClick={() => onSelectParent(p)}
                  className="font-medium text-accent underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm outline-none"
                >
                  {nodeById(p)?.name}
                </button>
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-2 text-sm text-foreground">{node.family === 'direkttraeger' ? 'Direktträger — eigener Stamm, nicht mit dem Traminer verwandt.' : 'Urrebe — keine bekannte Kreuzung.'}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{node.origin}</p>
      </div>

      <div>
        <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">Im Glas</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {node.aromas.map(a => (
            <span key={a} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-foreground/85" style={{ background: 'color-mix(in oklch, var(--accent) 4%, transparent)' }}>
              {a}
            </span>
          ))}
        </div>
      </div>

      {node.lagen.length > 0 && (
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

      {node.wines.length > 0 && (
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
                <span className="shrink-0 text-sm font-semibold text-accent">{w.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {node.family === 'vinifera' && <RebstockCTA />}
    </div>
  )
}

// ── Reader-/Listen-Ansicht (Mobile-Default & Desktop-Toggle) ────────────────

const OUTLINE_GROUPS: { title: string; match: (n: GrapeNode) => boolean }[] = [
  { title: 'Urreben · uralt', match: n => n.family === 'vinifera' && n.row === 0 },
  { title: 'Kreuzungen & Hybriden', match: n => n.family === 'vinifera' && n.row === 1 },
  { title: 'Neuzüchtungen (PIWI) · 1960–1970', match: n => n.family === 'vinifera' && n.row === 2 },
  { title: 'Direktträger · Uhudler (eigener Stamm)', match: n => n.family === 'direkttraeger' },
]

function Outline({
  selectedId,
  onToggle,
  onSelectParent,
  reduce,
}: {
  selectedId: string | null
  onToggle: (id: string) => void
  onSelectParent: (id: string) => void
  reduce: boolean | null
}) {
  return (
    <div className="flex flex-col gap-8">
      {OUTLINE_GROUPS.map(group => (
        <section key={group.title}>
          <h3 className="flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] text-muted-foreground uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-border" />
            {group.title}
          </h3>
          <ul className="mt-4 flex flex-col border-y border-border/70">
            {LINEAGE.filter(group.match).map(n => {
              const open = selectedId === n.id
              return (
                <li key={n.id} className="border-b border-border/70 last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => onToggle(n.id)}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="flex items-center gap-3">
                      <ColorDot color={n.color} />
                      <span className="font-display text-lg text-foreground">{n.name}</span>
                      <span className="text-xs text-muted-foreground">{n.epoch}</span>
                    </span>
                    <ChevronDown size={16} className={cn('shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none', open && 'rotate-180')} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="detail"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.28, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1 pb-6">
                          <DetailBody node={n} onSelectParent={onSelectParent} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-[color-mix(in_oklch,var(--card)_78%,transparent)] px-3 py-2 text-[10px] text-muted-foreground backdrop-blur-sm">
      <span className="flex items-center gap-1.5"><ColorDot color="white" /> Weiß</span>
      <span className="flex items-center gap-1.5"><ColorDot color="red" /> Rot</span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="6" aria-hidden="true"><line x1="0" y1="3" x2="18" y2="3" stroke="currentColor" strokeWidth="1.4" /></svg>
        Primärlinie
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="6" aria-hidden="true"><line x1="0" y1="3" x2="18" y2="3" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 4" /></svg>
        Kreuzung
      </span>
    </div>
  )
}

// ── Haupt-Komponente ─────────────────────────────────────────────────────────

export function LineageTree({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement | null>())
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  // Merkt sich, ob wir aus dem Überblick heraus einen History-Eintrag gepusht
  // haben — dann poppt der Zurück-Weg diesen (Browser-Zurück-kompatibel),
  // statt bei einem Direkt-Deep-Link aus der App zu navigieren.
  const canPopRef = useRef(false)

  const rebeParam = searchParams.get('rebe')
  const selectedId = rebeParam && nodeById(rebeParam) ? rebeParam : null
  const view: 'tree' | 'list' = searchParams.get('ansicht') === 'liste' ? 'list' : 'tree'

  const [size, setSize] = useState<Size>({ w: 0, h: 0 })
  const [focusedId, setFocusedId] = useState<string>(selectedId ?? LINEAGE[0].id)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [view])

  // Globales Escape → zoom raus. Selbständig (referenziert keine Render-Closure),
  // damit es nicht mit dem Knoten-Handler doppelt feuert und navigate(-1) verdoppelt.
  useEffect(() => {
    if (!selectedId) return
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (canPopRef.current) {
        canPopRef.current = false
        navigate(-1)
      } else {
        setSearchParams(
          prev => {
            const p = new URLSearchParams(prev)
            p.delete('rebe')
            return p
          },
          { replace: true },
        )
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selectedId, navigate, setSearchParams])

  function setRebe(id: string | null, replace = false) {
    setSearchParams(
      prev => {
        const p = new URLSearchParams(prev)
        if (id) p.set('rebe', id)
        else p.delete('rebe')
        return p
      },
      { replace },
    )
  }

  /** Zoom raus an die Ausgangsposition — poppt den gepushten Auswahl-Eintrag
   *  (Browser-Zurück-kompatibel) oder räumt bei Direkt-Deep-Link den Param weg. */
  function goToOverview() {
    if (canPopRef.current) {
      canPopRef.current = false
      navigate(-1)
    } else {
      setRebe(null, true)
    }
  }
  function setView(v: 'tree' | 'list') {
    setSearchParams(
      prev => {
        const p = new URLSearchParams(prev)
        if (v === 'list') p.set('ansicht', 'liste')
        else p.delete('ansicht')
        return p
      },
      { replace: true },
    )
  }

  const ready = size.w > 0 && size.h > 0
  const selected = selectedId ? nodeById(selectedId) ?? null : null
  const panelOpen = !!selected && size.w >= 1024
  const target = selected ? focusTransform(selected, size, panelOpen ? 400 : 0) : fitTransform(size)
  const ancestors = selectedId ? ancestorsOf(selectedId) : EMPTY
  const onPath = (id: string) => !selectedId || id === selectedId || ancestors.has(id)
  const edgeLit = (from: string, to: string) => !!selectedId && (to === selectedId || ancestors.has(to)) && ancestors.has(from)

  // Weiche, lange Kamerafahrt (Maison-Default-Spring); Reduced-Motion springt hart.
  const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 150, damping: 20 }

  function selectNode(id: string) {
    // Erstauswahl aus dem Überblick = History-Push (ein Browser-Zurück zoomt
    // wieder raus); Wechsel zwischen Reben = replace (Zurück bleibt der Überblick).
    const entering = !selectedId
    if (entering) canPopRef.current = true
    setRebe(id, !entering)
    setFocusedId(id)
  }
  function focusNode(id: string) {
    setFocusedId(id)
    nodeRefs.current.get(id)?.focus()
  }
  function onNodeKeyDown(e: KeyboardEvent<HTMLButtonElement>, node: GrapeNode) {
    let next: string | undefined
    switch (e.key) {
      case 'ArrowRight':
        next = sibling(node.id, node.row, 1)
        break
      case 'ArrowLeft':
        next = sibling(node.id, node.row, -1)
        break
      case 'ArrowUp':
        next = node.parents[0]
        break
      case 'ArrowDown':
        next = firstChildOf(node.id)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        selectNode(node.id)
        return
      // Escape wird global behandelt (siehe useEffect), damit es auch ohne
      // fokussierten Knoten (z. B. bei Direkt-Deep-Link) zuverlässig rauszoomt.
      default:
        return
    }
    if (next) {
      e.preventDefault()
      focusNode(next)
      if (selectedId) setRebe(next, true)
    }
  }

  const canvas = (
    <div ref={stageRef} role="group" aria-label="Rebsorten-Stammbaum, interaktive Ahnentafel. Mit Tab eine Rebsorte fokussieren, mit den Pfeiltasten zu Eltern, Kindern und Nachbarn wechseln, mit Enter heranzoomen, mit Escape zum Überblick." className="relative h-svh w-full overflow-hidden">
      {/* Weinreben-Wasserzeichen */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <VineBackdrop />
      </div>

      {/* Recede-Scrim: im Fokus tritt der Hintergrund sanft zurück, damit die
          herangezoomte Rebe + ihr Ahnen-Pfad Tiefe bekommen. Theme-aware. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 15, background: 'var(--background)' }}
        initial={false}
        animate={{ opacity: selectedId ? 0.5 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
      />

      {/* Klick auf freie Fläche zoomt raus (Maus; per Tastatur Escape). */}
      <button type="button" aria-hidden="true" tabIndex={-1} onClick={goToOverview} className="absolute inset-0 z-10 cursor-default" />

      {ready && (
        <motion.div
          animate={{ x: target.x, y: target.y, scale: target.scale }}
          transition={spring}
          style={{ position: 'absolute', top: 0, left: 0, width: CONTENT_W, height: CONTENT_H, transformOrigin: '0 0', zIndex: 20, pointerEvents: 'none' } as CSSProperties}
        >
          {/* Kanten (eckige Klammern) + Uhudler-Umrandung */}
          <svg width={CONTENT_W} height={CONTENT_H} className="absolute inset-0 overflow-visible" aria-hidden="true" style={{ pointerEvents: 'none' }}>
            <rect x={UHUDLER_BOX.x} y={UHUDLER_BOX.y} width={UHUDLER_BOX.w} height={UHUDLER_BOX.h} rx={18} fill="color-mix(in oklch, var(--foreground) 2.5%, transparent)" stroke="var(--border)" strokeWidth={1.2} strokeDasharray="2 8" />
            <text x={UHUDLER_BOX.x + 18} y={UHUDLER_BOX.y + 22} fill="var(--muted-foreground)" fontSize={13} letterSpacing="2">
              {FAMILY_LABEL.direkttraeger}
            </text>

            {EDGES.map(e => {
              const a = nodeById(e.from)!
              const b = nodeById(e.to)!
              const x1 = nodeX(a)
              const y1 = nodeTop(a) + NODE_H
              const x2 = nodeX(b)
              const y2 = nodeTop(b)
              const midY = y2 - 30
              const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`
              const lit = edgeLit(e.from, e.to)
              const dim = !!selectedId && !lit
              return (
                <path
                  key={`${e.from}-${e.to}`}
                  d={d}
                  fill="none"
                  stroke={lit ? 'var(--accent)' : 'var(--border)'}
                  strokeWidth={lit ? 2.2 : 1.3}
                  strokeDasharray={e.primary ? undefined : '4 6'}
                  style={{ opacity: dim ? 0.18 : lit ? 1 : 0.6, transition: reduce ? undefined : 'opacity 300ms, stroke 300ms' }}
                />
              )
            })}
          </svg>

          {/* Knoten (Portrait + Name) */}
          {LINEAGE.map(n => {
            const isSel = n.id === selectedId
            const lit = onPath(n.id)
            return (
              <button
                key={n.id}
                ref={el => {
                  nodeRefs.current.set(n.id, el)
                }}
                type="button"
                tabIndex={focusedId === n.id ? 0 : -1}
                aria-pressed={isSel}
                aria-label={nodeAria(n)}
                onFocus={() => setFocusedId(n.id)}
                onClick={e => {
                  e.stopPropagation()
                  selectNode(n.id)
                }}
                onKeyDown={e => onNodeKeyDown(e, n)}
                className={cn(
                  'pointer-events-auto absolute flex items-center gap-3 rounded-xl border p-2.5 text-left outline-none',
                  'transition-[opacity,transform,box-shadow,border-color] duration-300 motion-reduce:transition-none',
                  'focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isSel ? 'border-accent shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]' : 'border-border hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg motion-reduce:hover:translate-y-0',
                  selectedId && !lit && 'opacity-35',
                )}
                style={{
                  left: nodeX(n) - NODE_W / 2,
                  top: nodeTop(n),
                  width: NODE_W,
                  height: NODE_H,
                  background: isSel ? 'color-mix(in oklch, var(--accent) 10%, var(--card))' : 'var(--card)',
                }}
              >
                <img
                  src={n.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-13 w-13 shrink-0 rounded-full object-cover"
                  style={{ boxShadow: `0 0 0 2px ${n.color === 'red' ? redInk : whiteInk}` }}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="font-display truncate text-base leading-tight font-normal text-foreground">{n.name}</span>
                  <span className="truncate text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">{kindLabel(n)} · {n.epoch}</span>
                </span>
              </button>
            )
          })}
        </motion.div>
      )}

      {/* Steuerung — oben rechts, weicht dem Detail-Panel aus, liegt immer darüber. */}
      <div
        className={cn(
          'absolute top-4 z-50 flex gap-2 transition-[right] duration-300 motion-reduce:transition-none',
          panelOpen ? 'right-98' : 'right-4',
        )}
      >
        {selectedId ? (
          <button
            type="button"
            onClick={goToOverview}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-[color-mix(in_oklch,var(--card)_82%,transparent)] px-3 py-1.5 text-xs text-foreground backdrop-blur-sm transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
          >
            <ArrowLeft size={13} /> Überblick
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setView('list')}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-[color-mix(in_oklch,var(--card)_82%,transparent)] px-3 py-1.5 text-xs text-foreground backdrop-blur-sm transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
          >
            <Menu size={13} /> Als Liste
          </button>
        )}
      </div>

      {/* Legende (Overlay unten links) */}
      <div className="absolute bottom-4 left-4 z-30 max-w-[calc(100%-2rem)]">
        <Legend />
      </div>

      {/* Detail-Panel (Desktop, glasig) */}
      <AnimatePresence>
        {panelOpen && selected && (
          <motion.aside
            key="panel"
            initial={reduce ? false : { x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: 24, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 }}
            aria-label={`Detail: ${selected.name}`}
            className="absolute top-4 right-4 bottom-4 z-40 w-90 overflow-y-auto rounded-xl border border-border p-5"
            style={{ background: 'color-mix(in oklch, var(--card) 85%, transparent)', backdropFilter: 'blur(16px)' }}
          >
            <button
              type="button"
              onClick={goToOverview}
              aria-label="Detail schließen"
              className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/60 outline-none"
            >
              <X size={14} />
            </button>
            <DetailBody node={selected} onSelectParent={selectNode} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className={cn('w-full', className)}>
      <div className="hidden lg:block">
        {view === 'tree' ? (
          canvas
        ) : (
          <div className="mx-auto max-w-4xl px-8 py-16">
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setView('tree')}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
              >
                <Network size={13} /> Als Baum
              </button>
            </div>
            <Outline selectedId={selectedId} onToggle={id => setRebe(selectedId === id ? null : id, true)} onSelectParent={id => setRebe(id, true)} reduce={reduce} />
          </div>
        )}
      </div>

      <div className="px-6 pb-16 lg:hidden">
        <p className="mb-4 text-[11px] tracking-wide text-muted-foreground">Rebsorte antippen für Herkunft, Lagen und Weine.</p>
        <Outline selectedId={selectedId} onToggle={id => setRebe(selectedId === id ? null : id, true)} onSelectParent={id => setRebe(id, true)} reduce={reduce} />
      </div>
    </div>
  )
}
