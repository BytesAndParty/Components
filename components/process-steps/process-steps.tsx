import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '../lib/utils'
import { PAPER, paperGrain } from '../lib/scrapbook'

// ─── Types ──────────────────────────────────────────────────────────────────

export type ProcessStepsVariant = 'paper' | 'trail' | 'ledger'

export interface ProcessStep {
  /** Linien-Icon, z. B. aus lucide-react (`size={34} strokeWidth={1.4}`). Rein dekorativ. */
  icon: ReactNode
  /** Kurze Beschreibung des Schritts. */
  label: string
}

export interface ProcessStepsProps {
  steps: ProcessStep[]
  /**
   * Darstellung.
   * - `paper` (Default): Icon-Kreise aus Creme-Papier, handgezeichnete Pfeile, Labels in UI-Sans.
   * - `trail`: Kraft-Stempel mit Nummer, verbunden durch einen gepunkteten Pfad, Labels in Caveat.
   * - `ledger`: Maison-Stil ohne Badges, römische Ziffer über einer Hairline, Labels in Kapitälchen.
   */
  variant?: ProcessStepsVariant
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

// Papier fix (wie lib/scrapbook). Pfeile, Pfad und Hairline liegen auf dem Seitenhintergrund und folgen dem Theme.
const GRAIN = paperGrain(0.85, 2, 0.14, 180)

// Schrift lädt die App selbst (self-hosted via @fontsource), siehe COMPONENT.md.
const CAVEAT = "'Caveat', cursive"

const SPRING = { type: 'spring', stiffness: 150, damping: 20 } as const
const SNAPPY = { type: 'spring', stiffness: 300, damping: 30 } as const
const EXPO_OUT = [0.16, 1, 0.3, 1] as const

// Eine Spalte pro Schritt, sobald der Container breit genug ist (Container-Query statt Viewport:
// die Kette lebt auch in schmalen Spalten).
const GRID = 'grid grid-cols-1 @2xl:grid-cols-[repeat(var(--steps),minmax(0,1fr))]'

const ROMAN: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]

function toRoman(n: number) {
  let rest = n
  let out = ''
  for (const [value, numeral] of ROMAN) {
    while (rest >= value) {
      out += numeral
      rest -= value
    }
  }
  return out
}

// ─── Pfeil ──────────────────────────────────────────────────────────────────

const ARROW_SHAFT = 'M4 34 C 14 36, 22 18, 38 17 C 52 16, 60 22, 74 15'
const ARROW_HEAD = 'M62.5 12.8 Q 69 14 74.2 15.1 Q 71 19.5 68.6 25'

/** Liegt im Stack unter dem Schritt (90° gedreht), in der Zeile mittig auf der Spaltengrenze. */
function HandArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      // In der Zeile nie breiter als die Lücke zwischen zwei Kreisen (Spalte minus Kreis 5rem, etwas Luft).
      className="text-muted-foreground mx-auto mt-4 block h-6 w-11 rotate-90 @2xl:absolute @2xl:top-10 @2xl:right-0 @2xl:mt-0 @2xl:w-[min(2.75rem,calc(100%-5.5rem))] @2xl:translate-x-1/2 @2xl:-translate-y-1/2 @2xl:rotate-0"
    >
      <path d={ARROW_SHAFT} />
      <path d={ARROW_HEAD} />
    </svg>
  )
}

// ─── Varianten ──────────────────────────────────────────────────────────────

function PaperSteps({ steps, reduce }: { steps: ProcessStep[]; reduce: boolean }) {
  return (
    <ol className={cn(GRID, 'gap-y-4')}>
      {steps.map((step, i) => (
        <motion.li
          key={step.label}
          className="relative flex flex-col items-center"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          // Delay je Property, nie auf dem Top-Level der Transition (COMPONENT-GUIDELINES §5)
          transition={{
            opacity: { duration: 0.4, delay: i * 0.12 },
            y: { ...SPRING, delay: i * 0.12 },
          }}
        >
          <span
            aria-hidden="true"
            className="grid size-20 place-items-center rounded-full"
            style={{
              color: PAPER.cream.ink,
              backgroundColor: PAPER.cream.bg,
              backgroundImage: GRAIN,
              backgroundBlendMode: 'multiply',
              border: '1px solid oklch(0.27 0.02 60 / 0.45)',
              boxShadow: '0 6px 10px -4px oklch(0.2 0.03 60 / 0.3)',
              transform: `rotate(${i % 2 ? 2.5 : -2.5}deg)`,
            }}
          >
            {step.icon}
          </span>
          <span className="mt-3 max-w-36 px-2 text-center text-sm leading-snug">{step.label}</span>
          {i < steps.length - 1 && <HandArrow />}
        </motion.li>
      ))}
    </ol>
  )
}

// Wellenpfad durch die Spaltenmitten (viewBox 1000 × 72). Alle Segmente gleiche S-Kurve,
// so treffen sich die Tangenten an jedem Stempel ohne Knick.
function trailPath(count: number) {
  const center = (i: number) => ((i + 0.5) / count) * 1000
  let d = `M${center(0)} 36`
  for (let i = 1; i < count; i++) {
    const x0 = center(i - 1)
    const x1 = center(i)
    const dx = x1 - x0
    d += ` C ${x0 + dx * 0.4} 4, ${x1 - dx * 0.4} 68, ${x1} 36`
  }
  return d
}

const TRAIL_DRAW = 2.2

function TrailSteps({ steps, reduce }: { steps: ProcessStep[]; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const shown = reduce || inView
  // Jeder Stempel erscheint ungefähr dann, wenn der Pfad ihn erreicht.
  const stampDelay = (i: number) => (reduce ? 0 : 0.3 + (i / Math.max(steps.length - 1, 1)) * (TRAIL_DRAW - 0.6))

  return (
    <div ref={ref} className="relative">
      {/* clip-path auf dem inneren Wrapper, nie auf dem Beobachtungs-Element (STYLE-GUIDE §11) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 hidden h-18 @2xl:block"
        initial={false}
        animate={{ clipPath: shown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={{ duration: reduce ? 0 : TRAIL_DRAW, ease: 'easeInOut' }}
      >
        <svg className="text-muted-foreground size-full" viewBox="0 0 1000 72" preserveAspectRatio="none" fill="none">
          <path
            d={trailPath(steps.length)}
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="1 9"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
      <ol className={cn(GRID, 'relative gap-y-8')}>
        {steps.map((step, i) => (
          <motion.li
            key={step.label}
            className="flex items-center gap-4 @2xl:flex-col @2xl:gap-3"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={shown ? { opacity: 1, scale: 1 } : undefined}
            transition={{
              opacity: { duration: 0.4, delay: stampDelay(i) },
              scale: { ...SNAPPY, delay: stampDelay(i) },
            }}
          >
            <span
              aria-hidden="true"
              className="relative grid size-18 shrink-0 place-items-center rounded-full"
              style={{
                color: PAPER.kraft.ink,
                backgroundColor: PAPER.kraft.bg,
                backgroundImage: GRAIN,
                backgroundBlendMode: 'multiply',
                boxShadow: `0 5px 8px -3px oklch(0.2 0.03 60 / 0.4), inset 0 0 0 3px ${PAPER.kraft.bg}, inset 0 0 0 4px oklch(0.27 0.035 55 / 0.35)`,
              }}
            >
              {step.icon}
              <span
                className="absolute -top-2 -left-2 grid size-7 place-items-center rounded-full text-base"
                style={{
                  fontFamily: CAVEAT,
                  color: PAPER.cream.ink,
                  backgroundColor: PAPER.cream.bg,
                  boxShadow: '0 1px 3px oklch(0.2 0.03 60 / 0.4)',
                }}
              >
                {i + 1}
              </span>
            </span>
            <span className="text-xl leading-tight @2xl:px-2 @2xl:text-center" style={{ fontFamily: CAVEAT }}>
              {step.label}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

function LedgerSteps({ steps, reduce }: { steps: ProcessStep[]; reduce: boolean }) {
  return (
    <ol className={cn(GRID, 'gap-x-8 gap-y-10')}>
      {steps.map((step, i) => (
        <li key={step.label} className="relative pt-5">
          <motion.span
            aria-hidden="true"
            className="bg-border absolute inset-x-0 top-0 h-px origin-left"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ scaleX: { duration: 1.2, delay: i * 0.15, ease: EXPO_OUT } }}
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              opacity: { duration: 0.9, delay: 0.2 + i * 0.15 },
              y: { duration: 0.9, delay: 0.2 + i * 0.15, ease: EXPO_OUT },
            }}
          >
            <div aria-hidden="true" className="flex items-start justify-between">
              <span className="font-display text-[3.25rem] leading-none font-light italic">{toRoman(i + 1)}</span>
              <span className="text-muted-foreground mt-1.5 [&_svg]:size-6 [&_svg]:stroke-[1.1]">{step.icon}</span>
            </div>
            <p className="text-muted-foreground mt-5 text-[0.65rem] leading-relaxed tracking-[0.3em] uppercase">
              {step.label}
            </p>
          </motion.div>
        </li>
      ))}
    </ol>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProcessSteps({ steps, variant = 'paper', className, style }: ProcessStepsProps) {
  const reduce = useReducedMotion() ?? false
  if (steps.length === 0) return null
  // w-full: ein @container hat keine eigene Inhaltsbreite und fiele in w-fit- oder Flex-Eltern sonst auf 0.
  return (
    <div className={cn('@container w-full', className)} style={{ '--steps': steps.length, ...style } as CSSProperties}>
      {variant === 'paper' && <PaperSteps steps={steps} reduce={reduce} />}
      {variant === 'trail' && <TrailSteps steps={steps} reduce={reduce} />}
      {variant === 'ledger' && <LedgerSteps steps={steps} reduce={reduce} />}
    </div>
  )
}
