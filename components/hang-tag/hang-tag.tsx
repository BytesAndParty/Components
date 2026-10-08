import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { animate, motion, useInView, useMotionValue, type Variants } from 'motion/react'
import { cn } from '../lib/utils'
import { useDeviceCapabilities } from '../lib/use-device-capabilities'
import { PAPER, paperGrain } from '../lib/scrapbook'

// ─── Types ──────────────────────────────────────────────────────────────────

export type HangTagVariant = 'hanging' | 'loose'

export interface HangTagProps {
  /** Text auf dem Anhänger, in Handschrift (Caveat). */
  children: ReactNode
  /** Unterschrift unten rechts, z. B. „Simon“. Der Gedankenstrich kommt automatisch davor. */
  sign?: ReactNode
  /** `hanging` hängt an einer Schnur vom Wrapper herab (Flaschenhals), `loose` liegt frei auf der Seite. */
  variant?: HangTagVariant
  /** Drehung in Grad. Bei `hanging` der Ruhewinkel: negativ hängt der Anhänger nach rechts, positiv nach links. */
  rotate?: number
  /** Nur `hanging`: Schnurlänge vom Knoten bis zur Öse, in px. */
  cordLength?: number
  /** Nur `hanging`: Halsbreite in px. Zeichnet die Schlaufe um den Hals, ohne Wert nur Knoten und Schnur. */
  neckWidth?: number
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

const GRAIN = paperGrain(0.85, 2, 0.13, 160)

// Schrift lädt die App selbst (self-hosted via @fontsource), siehe COMPONENT.md.
const FONT = "'Caveat', cursive"

// Ösenmitte, gemessen von der Oberkante des Anhängers.
const HOLE_Y = 22
const HOLE_R = 4.5
const HOLE_MASK = `radial-gradient(circle ${HOLE_R}px at 50% ${HOLE_Y}px, transparent ${HOLE_R - 0.5}px, #000 ${HOLE_R}px)`
const CUT_CORNERS = 'polygon(17px 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 0 100%, 0 17px)'
// Als filter am Elternteil: clip-path und Maske würden einen box-shadow mit abschneiden.
const SHADOW = 'drop-shadow(0 7px 9px oklch(0.2 0.03 60 / 0.32)) drop-shadow(0 1px 1px oklch(0.2 0.03 60 / 0.3))'

// Bäckergarn: creme Grund, Bordeaux als Strichelung darüber, dunkle Kante für hellen Hintergrund.
const TWINE = { base: 'oklch(0.94 0.015 85)', twist: 'oklch(0.46 0.13 22)', edge: 'oklch(0.2 0.02 60 / 0.35)', width: 2 }

// Leicht gedämpft, damit der Anhänger zwei, drei Mal nachpendelt.
const SWING = { type: 'spring', stiffness: 60, damping: 5 } as const
const SPRING = { type: 'spring', stiffness: 150, damping: 20 } as const
const SNAPPY = { type: 'spring', stiffness: 300, damping: 30 } as const

// ─── Parts ──────────────────────────────────────────────────────────────────

function Twine({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={TWINE.edge} strokeWidth={TWINE.width + 1} strokeLinecap="round" />
      <path d={d} fill="none" stroke={TWINE.base} strokeWidth={TWINE.width} strokeLinecap="round" />
      <path d={d} fill="none" stroke={TWINE.twist} strokeWidth={TWINE.width} strokeDasharray="2 2.6" />
    </>
  )
}

/** SVG mit Nullpunkt an (x, y). Pfade dürfen in alle Richtungen überstehen. */
function At({ x = 0, y = 0, children }: { x?: number | string; y?: number; children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="1"
      height="1"
      className="pointer-events-none absolute overflow-visible"
      style={{ left: x, top: y }}
    >
      {children}
    </svg>
  )
}

function Card({ children, sign }: { children: ReactNode; sign?: ReactNode }) {
  return (
    <div style={{ filter: SHADOW }}>
      <div
        className="relative flex min-h-42 w-33 flex-col px-3.5 pt-12 pb-3 text-center wrap-break-word"
        style={{
          color: PAPER.kraft.ink,
          backgroundColor: PAPER.kraft.bg,
          backgroundImage: GRAIN,
          backgroundBlendMode: 'multiply',
          clipPath: CUT_CORNERS,
          maskImage: HOLE_MASK,
        }}
      >
        {/* Verstärkungsring um die Öse */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 size-5.75 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: HOLE_Y,
            background: 'oklch(0.87 0.035 82)',
            boxShadow: 'inset 0 0 0 1px oklch(0.55 0.05 70 / 0.35), 0 1px 1.5px oklch(0.3 0.04 60 / 0.35)',
          }}
        />
        {/* leading hier statt am Wrapper: ein text-*-Override per className würde es sonst per tailwind-merge entfernen. */}
        <div className="leading-[1.02]">{children}</div>
        {sign && <div className="mt-auto self-end pt-2 text-[0.88em]">– {sign}</div>}
      </div>
    </div>
  )
}

// ─── Varianten ──────────────────────────────────────────────────────────────

function HangingTag({ children, sign, rotate = -8, cordLength = 44, neckWidth, className, style }: Omit<HangTagProps, 'variant'>) {
  const { prefersReducedMotion: reduce } = useDeviceCapabilities()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  // Startet ausgelenkt und pendelt beim Einblenden in den Ruhewinkel.
  const angle = useMotionValue(reduce ? rotate : rotate + 16)

  useEffect(() => {
    if (reduce) {
      angle.set(rotate)
      return
    }
    if (!inView) return
    const controls = animate(angle, rotate, SWING)
    return () => controls.stop()
  }, [inView, reduce, rotate, angle])

  const loop = neckWidth === undefined ? 0 : neckWidth / 2 + 2

  return (
    // Der Wrapper ist der Knoten vorne am Hals: der Consumer setzt ihn per left/top auf die Flasche.
    <div className={cn('absolute size-0 text-[1.3rem]', className)} style={{ fontFamily: FONT, ...style }}>
      {neckWidth !== undefined && (
        <At y={-1}>
          <Twine d={`M ${-loop} -3 Q 0 5 ${loop} -3`} />
        </At>
      )}
      <motion.div
        className="absolute size-0"
        style={{ rotate: angle, transformOrigin: '0 0' }}
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: reduce || inView ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div ref={ref} className="absolute left-0 -translate-x-1/2" style={{ top: cordLength - HOLE_Y }}>
          <Card sign={sign}>{children}</Card>
        </div>
        {/* Nach dem Anhänger, damit die Schnur vor der Kante ins Loch läuft */}
        <At>
          <Twine d={`M -1 0 Q -3 ${cordLength / 2} -2.5 ${cordLength}`} />
          <Twine d={`M 1 0 Q 3 ${cordLength / 2} 2.5 ${cordLength}`} />
        </At>
      </motion.div>
      <At>
        <Twine d="M -1 1 Q -5 7 -9 11" />
        <Twine d="M 1 1 Q 4 8 4 13" />
        <circle r={2.6} fill={TWINE.base} stroke="oklch(0.2 0.02 60 / 0.4)" strokeWidth={0.7} />
      </At>
    </div>
  )
}

function LooseTag({ children, sign, rotate = -4, className, style }: Omit<HangTagProps, 'variant'>) {
  const { hasFinePointer, prefersReducedMotion: reduce } = useDeviceCapabilities()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const variants: Variants = {
    hidden: { opacity: 0, y: -14, rotate: rotate + 6 },
    shown: { opacity: 1, y: 0, rotate, scale: 1, transition: SPRING },
    // Hover richtet den Anhänger gerade, als würde man ihn in die Hand nehmen.
    lift: { rotate: 0, scale: 1.03, transition: SNAPPY },
  }

  return (
    // Untransformierter Wrapper wie bei PolaroidFrame: sonst flackert der Hover an den gedrehten Ecken.
    <motion.div
      ref={ref}
      className={cn('relative w-fit text-[1.3rem]', className)}
      style={{ fontFamily: FONT, ...style }}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'shown' : 'hidden'}
      whileHover={hasFinePointer && !reduce ? 'lift' : undefined}
    >
      <motion.div className="relative" variants={variants}>
        <Card sign={sign}>{children}</Card>
        {/* Lose Schnurenden aus der Öse */}
        <At x="50%" y={HOLE_Y}>
          <Twine d="M -1 0 C -6 -18, -20 -34, -38 -40" />
          <Twine d="M 1 0 C 6 -20, 4 -40, 16 -54" />
        </At>
      </motion.div>
    </motion.div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function HangTag({ variant = 'hanging', ...props }: HangTagProps) {
  return variant === 'loose' ? <LooseTag {...props} /> : <HangingTag {...props} />
}
