import { useEffect, useId, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { hashSeed } from '../lib/scrapbook'
import { cn } from '../lib/utils'

// Handschrift-Markierungen des Highlighters (circle, strike, squiggle). Eigene Datei, weil die Geometrie
// den Highlighter sonst verdreifachen würde. Wird nur von highlighter.tsx benutzt.

// ─── Types ──────────────────────────────────────────────────────────────────────

export type HandAction = 'circle' | 'strike' | 'squiggle'
export type HighlightPen = 'pen' | 'nib' | 'pencil'

type Pt = [number, number]
type Rand = () => number

interface Stroke {
  d: string
  /** Sekunden nach dem Start der Markierung, bei Tempo 1. */
  delay: number
  duration: number
}

/** Form einer Markierung in Pixeln des Worts (w × h), mit eigenem Zufall pro Instanz. */
type Shape = (w: number, h: number, r: Rand) => Stroke[]

interface Pen {
  width: number
  opacity: number
  /** Körnung wie bei einer Mine, je höher, desto löchriger. */
  grain?: number
  /** Breitfeder: derselbe Pfad mehrfach entlang des Federwinkels versetzt. */
  nib?: boolean
  circle: Shape
  strike: Shape
  squiggle: Shape
}

// ─── Geometrie ──────────────────────────────────────────────────────────────────

/** mulberry32: kleiner deterministischer Zufall. Gleiche Instanz, gleiche Form bei jedem Render. */
function rng(seed: number): Rand {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const n1 = (v: number) => v.toFixed(1)

/** Glatte Kurve durch alle Punkte (Catmull-Rom als kubische Béziers). */
function smooth(p: Pt[]) {
  let d = `M ${n1(p[0][0])} ${n1(p[0][1])}`
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[i - 1] ?? p[i]
    const [x1, y1] = p[i]
    const [x2, y2] = p[i + 1]
    const [x3, y3] = p[i + 2] ?? p[i + 1]
    d += ` C ${n1(x1 + (x2 - x0) / 6)} ${n1(y1 + (y2 - y0) / 6)}, ${n1(x2 - (x3 - x1) / 6)} ${n1(y2 - (y3 - y1) / 6)}, ${n1(x2)} ${n1(y2)}`
  }
  return d
}

/**
 * Kreis um das Wort, wie von Hand gezogen: setzt oben links an, läuft gegen den Uhrzeigersinn,
 * wird pro Umlauf etwas enger und schließt deshalb nie exakt. Leicht eckig (Superellipse), damit er
 * knapp um das Wort liegt, ohne die Ecken der äußeren Buchstaben zu schneiden.
 */
function loop(w: number, h: number, r: Rand, turns: number, wobble: number) {
  const cx = w / 2 + (r() - 0.5) * h * 0.06
  const cy = h / 2 + (r() - 0.5) * h * 0.08
  const rx = w / 2 + h * 0.22
  const ry = h * 0.5
  const tilt = (r() - 0.5) * 0.12
  const phase = r() * Math.PI * 2
  const start = Math.PI * 1.15 + (r() - 0.5) * 0.4
  const steps = Math.ceil(36 * turns)
  const pts: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const u = i / steps
    const t = start - u * turns * Math.PI * 2
    const k = (1 - 0.04 * u * turns) * (1 + wobble * Math.sin(2 * t + phase))
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = rx * k * Math.sign(c) * Math.abs(c) ** (2 / 3)
    const y = ry * k * Math.sign(s) * Math.abs(s) ** (2 / 3)
    pts.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)])
  }
  return smooth(pts)
}

/**
 * Strich quer durchs Wort, leicht steigend und gebogen. `y` als Anteil der Zeilenhöhe: 0,6 trifft
 * Kleinbuchstaben, Mediävalziffern (Cormorant) und Versalziffern (Caveat) gleichermaßen.
 */
function line(w: number, h: number, r: Rand, y: number, slope: number) {
  const ext = h * 0.18
  const pts = [0, 0.33, 0.66, 1].map((u): Pt => [
    -ext + u * (w + 2 * ext) + (r() - 0.5) * 2,
    h * (y - slope * (u - 0.5)) + (r() - 0.5) * h * 0.04 - Math.sin(Math.PI * u) * h * 0.03,
  ])
  return smooth(pts)
}

/** Welle unter dem Wort. */
function wave(w: number, h: number, r: Rand) {
  const ext = h * 0.06
  const y0 = h * 0.93
  const amp = h * 0.07
  const n = Math.max(4, Math.round((w + 2 * ext) / (h * 0.11)))
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const q = i % 4 // Viertelwellen: Mitte, oben, Mitte, unten
    pts.push([-ext + (i / n) * (w + 2 * ext), y0 + (q === 1 ? -amp : q === 3 ? amp : 0) * (1 + (r() - 0.5) * 0.5)])
  }
  return smooth(pts)
}

// ─── Stifte ─────────────────────────────────────────────────────────────────────

const PENS: Record<HighlightPen, Pen> = {
  // Füllfeder: fein, ein Zug, ruhig.
  pen: {
    width: 1.6,
    opacity: 1,
    circle: (w, h, r) => [{ d: loop(w, h, r, 1.12, 0.03), delay: 0, duration: 0.7 + w / 900 }],
    strike: (w, h, r) => [{ d: line(w, h, r, 0.6, 0.06), delay: 0, duration: 0.3 + w / 1200 }],
    squiggle: (w, h, r) => [{ d: wave(w, h, r), delay: 0, duration: 0.6 + w / 700 }],
  },
  // Breitfeder: wie die Füllfeder, mit Haar- und Schattenstrichen.
  nib: {
    width: 0.9,
    opacity: 1,
    nib: true,
    circle: (w, h, r) => [{ d: loop(w, h, r, 1.12, 0.03), delay: 0, duration: 0.8 + w / 900 }],
    strike: (w, h, r) => [{ d: line(w, h, r, 0.6, 0.06), delay: 0, duration: 0.35 + w / 1200 }],
    squiggle: (w, h, r) => [{ d: wave(w, h, r), delay: 0, duration: 0.7 + w / 700 }],
  },
  // Bleistift, skizziert: jede Markierung zweimal, leicht versetzt.
  pencil: {
    width: 1.4,
    opacity: 0.85,
    grain: 2.6,
    circle: (w, h, r) => [0, 1].map(i => ({ d: loop(w, h, r, 1, 0.05), delay: i * 0.35, duration: 0.8 + w / 900 })),
    strike: (w, h, r) => [
      { d: line(w, h, r, 0.59, 0.05), delay: 0, duration: 0.35 + w / 1200 },
      { d: line(w, h, r, 0.62, 0.08), delay: 0.25, duration: 0.35 + w / 1200 },
    ],
    squiggle: (w, h, r) => [0, 1].map(i => ({ d: wave(w, h, r), delay: i * 0.3, duration: 0.7 + w / 700 })),
  },
}

// Breitfeder (~40°): läuft der Strich quer zur Feder, liegen die Kopien nebeneinander (Schattenstrich),
// parallel zur Feder fallen sie zusammen (Haarstrich). Gleiche Technik wie Signature `nib`, hier in Pixeln.
const NIB = Array.from({ length: 7 }, (_, i) => [i * 0.5, i * -0.42] as const)
const SINGLE = [[0, 0] as const]

// ─── Component ──────────────────────────────────────────────────────────────────

interface HandMarkProps {
  spanRef: RefObject<HTMLSpanElement | null>
  action: HandAction
  pen: HighlightPen
  color: string
  isVisible: boolean
  /** Faktor auf alle Dauern und Verzögerungen (1 = Highlighter-Default von 800 ms). */
  tempo: number
  /** Verzögerung in ms. */
  delay: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** One visual line of the marked words, in pixels relative to the top-left corner of the measured box. */
interface Line {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Splits the box into one entry per visual line, so a phrase that wraps gets one mark per line instead of
 * one stretched shape. The text rects come from a Range over each child node; the overlay svg is skipped.
 * Returns the whole box for a single line, which keeps the shape of one-line marks unchanged.
 */
function measureLines(el: HTMLElement, w: number, h: number): Line[] {
  const origin = el.getBoundingClientRect()
  const range = document.createRange()
  const rects: DOMRect[] = []
  for (const node of Array.from(el.childNodes)) {
    if (node instanceof Element && node.tagName.toLowerCase() === 'svg') continue
    range.selectNode(node)
    rects.push(...Array.from(range.getClientRects()))
  }

  const rows: { left: number; right: number; top: number; bottom: number }[] = []
  for (const r of rects.filter(rect => rect.width > 0 && rect.height > 0).sort((a, b) => a.top - b.top)) {
    const row = rows[rows.length - 1]
    // Same line when the rect starts above the middle of the current row
    if (row && r.top < row.top + (row.bottom - row.top) / 2) {
      row.left = Math.min(row.left, r.left)
      row.right = Math.max(row.right, r.right)
    } else {
      rows.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom })
    }
  }
  if (rows.length < 2) return [{ x: 0, y: 0, w, h }]

  const lineHeight = h / rows.length
  return rows.map((row, i) => ({ x: row.left - origin.left, y: i * lineHeight, w: row.right - row.left, h: lineHeight }))
}

/** Ein markiertes Wort. Misst sich selbst und zeichnet den Strich in Pixeln, damit er bei jeder Breite gleich stark bleibt. */
export function HandMark({ spanRef, action, pen, color, isVisible, tempo, delay, className, style, children }: HandMarkProps) {
  const id = useId()
  const [box, setBox] = useState<{ w: number; h: number; lines: Line[] } | null>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect
      // A circle always surrounds the whole phrase; strike and squiggle follow every line.
      setBox({ w, h, lines: action === 'circle' ? [{ x: 0, y: 0, w, h }] : measureLines(el, w, h) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [spanRef, action])

  // The strokes must be painted once in their hidden state, otherwise the dashoffset transition has
  // nothing to animate from: the visibility observer can fire before the first measurement, and the
  // paths would then mount directly in their drawn state.
  const measured = box !== null
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!measured) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setArmed(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [measured])
  const shown = isVisible && armed

  const p = PENS[pen]
  const uid = id.replace(/\W/g, '')
  // One mark per line. Lines are written one after the other: each starts when the previous one is done.
  const drawn = box
    ? box.lines.reduce<{ line: Line; strokes: Stroke[]; offset: number }[]>((acc, line, i) => {
        const prev = acc[acc.length - 1]
        const offset = prev ? prev.offset + Math.max(...prev.strokes.map(s => s.delay + s.duration)) : 0
        const strokes = p[action](line.w, line.h, rng(hashSeed(i === 0 ? id : `${id}-${i}`)))
        return [...acc, { line, strokes, offset }]
      }, [])
    : []

  return (
    // Kreis: etwas seitlicher Rand, damit er die Nachbarwörter nicht berührt
    <span ref={spanRef} className={cn('relative inline-block', action === 'circle' && 'mx-[0.25em]', className)} style={style}>
      {/* Durchgestrichen heißt inhaltlich „nicht mehr gültig“ (alter Preis), daher <s> ohne die Standard-Linie */}
      {action === 'strike' ? <s className="no-underline">{children}</s> : children}
      {box && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${box.w} ${box.h}`}
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          style={{ color }}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {drawn.map(({ line, strokes, offset }, li) => {
            const filterId = `${uid}-lead-${li}`
            return (
              <g key={li} transform={`translate(${line.x} ${line.y})`}>
                {p.grain && (
                  <defs>
                    <filter id={filterId} filterUnits="userSpaceOnUse" x={-40} y={-40} width={line.w + 80} height={line.h + 80}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={(Math.abs(hashSeed(id)) % 997) + 1} result="grain" />
                      <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
                      {/* Alpha = 1 beim mittleren Rauschwert, darüber lichter: Löcher, wo die Mine nicht greift */}
                      <feColorMatrix in="grain" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-p.grain} 0 0 0 ${1 + p.grain / 2}`} result="mask" />
                      <feComposite in="rough" in2="mask" operator="in" />
                    </filter>
                  </defs>
                )}
                <g strokeWidth={p.width} opacity={p.opacity} filter={p.grain ? `url(#${filterId})` : undefined}>
                  {strokes.flatMap((s, i) => {
                    const start = delay + (offset + s.delay) * 1000 * tempo
                    return (p.nib ? NIB : SINGLE).map(([dx, dy]) => (
                      <path
                        key={`${i}-${dx}`}
                        d={s.d}
                        pathLength={1}
                        transform={dx || dy ? `translate(${dx} ${dy})` : undefined}
                        style={{
                          // Strich zeichnet sich über stroke-dashoffset. Die Deckkraft springt erst beim Ansetzen,
                          // sonst stünde vorher schon ein Punkt der runden Strichenden da.
                          strokeDasharray: 1,
                          strokeDashoffset: shown ? 0 : 1,
                          opacity: shown ? 1 : 0,
                          transition: `stroke-dashoffset ${s.duration * 1000 * tempo}ms ease-in-out ${start}ms, opacity 0s linear ${start}ms`,
                        }}
                      />
                    ))
                  })}
                </g>
              </g>
            )
          })}
        </svg>
      )}
    </span>
  )
}
