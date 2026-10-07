import { useId, useRef, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SignatureVariant = 'nib' | 'pen' | 'felt'

export interface SignatureStroke {
  /** SVG-Pfad eines Federzugs, also alles, was ohne Absetzen geschrieben wird. */
  d: string
  /** Schreibdauer in Sekunden, bezogen auf `pen`. `nib` schreibt langsamer, `felt` schneller. */
  duration: number
}

export interface SignatureProps {
  /** Federzüge in Schreibreihenfolge, z. B. Namenszug, i-Punkt, Schwung. */
  strokes: SignatureStroke[]
  /** viewBox der Pfade, z. B. `'0 0 254 112'`. */
  viewBox: string
  /** `nib` Breitfeder mit Haar- und Schattenstrichen, `pen` Füllfeder, `felt` Filzstift. */
  variant?: SignatureVariant
  /** Zugänglicher Name, z. B. „Unterschrift: Simon Buchart“. Ohne Wert ist die Unterschrift Deko (`aria-hidden`). */
  label?: string
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

// Strichstärke, Federversatz und Rauheit sind für eine 254 Einheiten breite viewBox abgestimmt und
// skalieren mit der tatsächlichen Breite, damit jede Unterschrift unabhängig von ihren Einheiten gleich wirkt.
const REF_WIDTH = 254

// Pause zwischen zwei Federzügen in Sekunden: Feder absetzen und neu ansetzen.
const LIFT = 0.15

// Breitfeder: derselbe Pfad mehrfach entlang des Federwinkels (~40°) versetzt. Läuft der Strich quer zur Feder,
// liegen die Kopien nebeneinander (Schattenstrich), parallel zur Feder fallen sie zusammen (Haarstrich).
const NIB = Array.from({ length: 7 }, (_, i) => [i * 0.42, i * -0.36] as const)
const SINGLE = [[0, 0] as const]

const VARIANTS = {
  nib: { width: 0.9, tempo: 1.35, opacity: 1, copies: NIB },
  pen: { width: 1.5, tempo: 1, opacity: 1, copies: SINGLE },
  felt: { width: 3, tempo: 0.7, opacity: 0.9, copies: SINGLE },
} satisfies Record<SignatureVariant, { width: number; tempo: number; opacity: number; copies: (readonly [number, number])[] }>

// ─── Component ──────────────────────────────────────────────────────────────

export function Signature({ strokes, viewBox, variant = 'nib', label, className, style }: SignatureProps) {
  const id = useId()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const shown = Boolean(reduce) || inView

  const { width, tempo, opacity, copies } = VARIANTS[variant]
  const unit = Number(viewBox.trim().split(/[\s,]+/)[2]) / REF_WIDTH
  // Startzeit je Federzug: alle vorigen Züge plus je eine Pause zum Absetzen.
  const starts = strokes.map((_, i) => strokes.slice(0, i).reduce((t, s) => t + s.duration + LIFT, 0))
  const felt = variant === 'felt'

  return (
    <div ref={ref} className={cn('w-60', className)} style={style}>
      <svg
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        viewBox={viewBox}
        className="block h-auto w-full overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {felt && (
          <defs>
            {/* Rauer Rand des Filzstifts: der Strich wird minimal verrauscht versetzt */}
            <filter id={`${id}-felt`} x="-5%" y="-10%" width="110%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency={0.85 / unit} numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={1.8 * unit} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        )}
        <g strokeWidth={width * unit} filter={felt ? `url(#${id}-felt)` : undefined}>
          {strokes.map((s, i) =>
            copies.map(([dx, dy]) => (
              <motion.path
                key={`${i}-${dx}`}
                d={s.d}
                transform={dx || dy ? `translate(${dx * unit} ${dy * unit})` : undefined}
                initial={false}
                animate={shown ? { pathLength: 1, opacity } : { pathLength: 0, opacity: 0 }}
                // Delay je Property (COMPONENT-GUIDELINES §5). Die Deckkraft springt erst beim Ansetzen der Feder,
                // sonst stünde vorher schon ein Punkt der runden Strichenden da.
                transition={{
                  pathLength: { duration: s.duration * tempo, delay: starts[i] * tempo, ease: 'easeInOut' },
                  opacity: { duration: 0.01, delay: starts[i] * tempo },
                }}
              />
            )),
          )}
        </g>
      </svg>
    </div>
  )
}
