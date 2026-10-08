import { useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '../lib/utils'
import { PAPER, hashSeed } from '../lib/scrapbook'

// ─── Types ──────────────────────────────────────────────────────────────────

export type MarkerCalloutColor = 'kraft' | 'sage' | 'rose'

interface MarkerCalloutBase {
  /** Farbe der Fläche. Bewusst eine feste Mini-Palette, theme-unabhängig. */
  color?: MarkerCalloutColor
  /** Drehung in Grad. */
  rotate?: number
  /** Legt Pinselform bzw. Aquarell-Rand fest. Ohne Angabe pro Instanz automatisch verschieden. */
  seed?: number
  className?: string
  style?: CSSProperties
}

interface MarkerCalloutSurface extends MarkerCalloutBase {
  /**
   * - `brush` (Default): handgezeichnete Pinselfläche mit Borstenstreifen und trockenem Rand, Caveat.
   * - `watercolor`: verlaufende Farbwolke mit Pigmentrand, Display-Serif kursiv.
   */
  variant?: 'brush' | 'watercolor'
  children: ReactNode
  lines?: never
}

interface MarkerCalloutTape extends MarkerCalloutBase {
  /** `tape`: jede Zeile ein eigener Kreppband-Streifen mit gerissenen Enden, Kalam fett. */
  variant: 'tape'
  /** Eine Zeile pro Streifen. */
  lines: string[]
  children?: never
}

export type MarkerCalloutProps = MarkerCalloutSurface | MarkerCalloutTape

// ─── Tokens ─────────────────────────────────────────────────────────────────

// Fix statt Theme-Tokens (wie lib/scrapbook): die Fläche ist ein physisches Objekt.
const INK = PAPER.kraft.ink

const BRUSH: Record<MarkerCalloutColor, string> = {
  kraft: PAPER.kraft.bg,
  sage: 'oklch(0.80 0.06 140)',
  rose: 'oklch(0.82 0.07 15)',
}

const WASH: Record<MarkerCalloutColor, { fill: string; pool: string }> = {
  kraft: { fill: 'oklch(0.86 0.06 76 / 0.7)', pool: 'oklch(0.7 0.08 70 / 0.5)' },
  sage: { fill: 'oklch(0.86 0.06 140 / 0.7)', pool: 'oklch(0.7 0.08 140 / 0.5)' },
  rose: { fill: 'oklch(0.87 0.06 15 / 0.7)', pool: 'oklch(0.72 0.09 12 / 0.5)' },
}

const TAPE: Record<MarkerCalloutColor, string> = {
  kraft: 'oklch(0.9 0.035 85 / 0.94)',
  sage: 'oklch(0.88 0.045 140 / 0.94)',
  rose: 'oklch(0.9 0.04 15 / 0.94)',
}

// Schriften lädt die App selbst (self-hosted via @fontsource), siehe COMPONENT.md.
const FONT = { caveat: "'Caveat', cursive", kalam: "'Kalam', cursive" }

const SPRING = { type: 'spring', stiffness: 150, damping: 20 } as const
const EXPO_OUT = [0.16, 1, 0.3, 1] as const

// ─── Brush ──────────────────────────────────────────────────────────────────

// Drei handgezeichnete Blobs, damit mehrere Callouts nebeneinander nicht identisch wirken.
const BLOBS = [
  'M8 22 C 30 6, 90 14, 150 9 S 262 4, 292 20 C 298 44, 290 66, 294 92 C 270 112, 200 104, 150 112 S 40 114, 10 100 C 2 76, 12 50, 8 22 Z',
  'M14 12 C 70 2, 120 18, 190 8 S 280 10, 296 30 C 288 56, 298 78, 284 102 C 220 116, 150 100, 90 112 S 18 108, 6 88 C 12 64, 2 36, 14 12 Z',
  'M4 30 C 20 8, 70 20, 130 10 S 250 2, 290 14 C 300 40, 286 60, 296 86 C 260 104, 190 98, 140 110 S 50 118, 14 98 C 6 70, 14 52, 4 30 Z',
]

// Borsten-Streifen quer über dem Blob, vom Blob selbst abgeschnitten.
const STREAKS = [
  'M0 30 C 80 24, 200 38, 300 28',
  'M0 52 C 90 58, 190 46, 300 54',
  'M0 76 C 70 70, 210 82, 300 74',
  'M0 96 C 100 100, 200 92, 300 98',
]

function BrushCallout({ children, color, rotate, seed, reduce, className, style }: SurfaceInnerProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const shown = reduce || inView
  const blob = BLOBS[Math.abs(seed) % BLOBS.length]

  return (
    <div
      ref={ref}
      className={cn('relative w-fit max-w-88 text-[1.7rem] leading-[1.15]', className)}
      style={{ transform: `rotate(${rotate}deg)`, fontFamily: FONT.caveat, ...style }}
    >
      {/* clip-path liegt auf dem inneren Wrapper, nie auf dem Beobachtungs-Element (STYLE-GUIDE §11) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={{ clipPath: shown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={{ duration: reduce ? 0 : 0.9, ease: EXPO_OUT }}
      >
        <svg className="absolute inset-0 size-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          <defs>
            <filter id={`${id}-dry`} x="-5%" y="-10%" width="110%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05 0.16" numOctaves="3" seed={Math.abs(seed) % 97} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <clipPath id={`${id}-clip`}>
              <path d={blob} />
            </clipPath>
          </defs>
          <g filter={`url(#${id}-dry)`}>
            <path d={blob} fill={BRUSH[color]} />
            <g clipPath={`url(#${id}-clip)`} stroke="oklch(1 0 0 / 0.2)" strokeWidth="2.2" fill="none">
              {STREAKS.map(d => (
                <path key={d} d={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>
        </svg>
      </motion.div>
      <motion.div
        className="relative px-11 py-8 text-center"
        style={{ color: INK }}
        initial={false}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.35 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ─── Watercolor ─────────────────────────────────────────────────────────────

function WatercolorCallout({ children, color, rotate, seed, reduce, className, style }: SurfaceInnerProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const shown = reduce || inView
  const wash = WASH[color]

  return (
    <div
      ref={ref}
      className={cn('relative w-fit max-w-88 text-[1.55rem] leading-[1.3]', className)}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id={`${id}-bleed`} x="-15%" y="-25%" width="130%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="4" seed={Math.abs(seed) % 97} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </svg>
      {/* Die Farbe blutet beim Erscheinen ein: unscharf zu scharf */}
      <motion.div
        initial={false}
        // Nach dem Einbluten kein Filter-Layer mehr über dem Text
        animate={shown ? { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : { opacity: 0, filter: 'blur(8px)' }}
        transition={{ duration: reduce ? 0 : 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Die Pigmente sammeln sich am Rand */}
        <div
          aria-hidden="true"
          className="absolute -inset-3"
          style={{
            background: wash.fill,
            borderRadius: '46% 54% 52% 48% / 58% 44% 56% 42%',
            boxShadow: `inset 0 0 22px 6px ${wash.pool}`,
            filter: `url(#${id}-bleed)`,
          }}
        />
        <div className="font-display relative px-9 py-8 text-center italic" style={{ color: INK }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Tape ───────────────────────────────────────────────────────────────────

const TORN_ENDS = 'polygon(0 0, 100% 5%, calc(100% - 3px) 32%, 100% 58%, calc(100% - 4px) 80%, 100% 100%, 0 95%, 3px 70%, 0 46%, 4px 22%)'
const STRIP_TILT = [-1.4, 0.9, -0.5, 1.2]
const STRIP_SHIFT = [0, 14, 4, 20]

function TapeCallout({ lines, color, rotate, reduce, className, style }: TapeInnerProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const shown = reduce || inView

  return (
    <p
      ref={ref}
      className={cn('flex w-fit flex-col items-start text-[1.25rem] leading-snug', className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: 'drop-shadow(0 3px 3px oklch(0.2 0.03 60 / 0.3))',
        fontFamily: FONT.kalam,
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <motion.span
          key={`${i}-${line}`}
          className="-mb-px inline-block px-5 py-1.5 font-bold whitespace-nowrap"
          style={{
            marginLeft: STRIP_SHIFT[i % STRIP_SHIFT.length],
            rotate: STRIP_TILT[i % STRIP_TILT.length],
            color: INK,
            backgroundColor: TAPE[color],
            clipPath: TORN_ENDS,
          }}
          initial={false}
          animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
          // Delay je Property, nie auf dem Top-Level der Transition (COMPONENT-GUIDELINES §5)
          transition={{
            opacity: { duration: reduce ? 0 : 0.35, delay: reduce ? 0 : i * 0.12 },
            x: reduce ? { duration: 0 } : { ...SPRING, delay: i * 0.12 },
          }}
        >
          {line}
        </motion.span>
      ))}
    </p>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

interface InnerBase {
  color: MarkerCalloutColor
  rotate: number
  seed: number
  reduce: boolean
  className?: string
  style?: CSSProperties
}
type SurfaceInnerProps = InnerBase & { children: ReactNode }
type TapeInnerProps = InnerBase & { lines: string[] }

const DEFAULT_ROTATE = { brush: -1, watercolor: -0.5, tape: -1 } as const

export function MarkerCallout({
  variant = 'brush',
  children,
  lines,
  color = 'kraft',
  rotate,
  seed,
  className,
  style,
}: MarkerCalloutProps) {
  const autoSeed = hashSeed(useId())
  const reduce = useReducedMotion() ?? false
  const inner: InnerBase = {
    color,
    rotate: rotate ?? DEFAULT_ROTATE[variant],
    seed: seed ?? autoSeed,
    reduce,
    className,
    style,
  }

  if (variant === 'tape') return <TapeCallout {...inner} lines={lines ?? []} />
  if (variant === 'watercolor') return <WatercolorCallout {...inner}>{children}</WatercolorCallout>
  return <BrushCallout {...inner}>{children}</BrushCallout>
}
