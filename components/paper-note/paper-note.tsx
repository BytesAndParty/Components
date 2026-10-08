import { useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { cn } from '../lib/utils'
import { PAPER, WASHI, hashSeed, paperGrain } from '../lib/scrapbook'

// ─── Types ──────────────────────────────────────────────────────────────────

export type PaperNoteVariant = 'torn' | 'notepad'
export type PaperNotePaper = 'kraft' | 'cream' | 'dark'
export type PaperNoteArrow = 'up' | 'down' | 'left' | 'right'

export interface PaperNoteProps {
  /** Inhalt der Notiz. */
  children: ReactNode
  /**
   * Papier-Art.
   * - `torn` (Default): rundum gerissen, Washi-Tape mittig, fällt beim Scrollen ins Bild.
   * - `notepad`: vom Block abgerissen (nur oben), Kreppband an den Ecken, statisch.
   */
  variant?: PaperNoteVariant
  /** Papierfarbe. Bewusst fix und theme-unabhängig. Creme bekommt bei `notepad` Linien. */
  paper?: PaperNotePaper
  /** Drehung in Grad. Default `-2` (torn) bzw. `1.5` (notepad). */
  rotate?: number
  /** Klebestreifen anzeigen. */
  tape?: boolean
  /** Handgezeichneter Pfeil, der von der Notiz weg zeigt. Farbe = Textfarbe des Wrappers. */
  arrow?: PaperNoteArrow
  /** Form des Risses. Ohne Angabe pro Instanz automatisch verschieden. */
  seed?: number
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

// Papierfarben (PAPER) und Washi-Tape kommen fix aus lib/scrapbook.

// Schriften lädt die App selbst (self-hosted via @fontsource), siehe COMPONENT.md.
const FONT: Record<PaperNoteVariant, string> = {
  torn: "'Caveat', cursive",
  notepad: "'Kalam', cursive",
}

const DEFAULT_ROTATE: Record<PaperNoteVariant, number> = { torn: -2, notepad: 1.5 }

const SPRING = { type: 'spring', stiffness: 150, damping: 20 } as const

// ─── Texturen (Inline-SVG, kein Bild-Asset) ─────────────────────────────────

const GRAIN_FINE = paperGrain(0.85, 2, 0.14, 180)
const GRAIN_FIBER = paperGrain(0.012, 3, 0.2, 420)
const RULED = 'repeating-linear-gradient(to bottom, transparent 0 calc(1.75rem - 1px), oklch(0.72 0.04 240 / 0.35) calc(1.75rem - 1px) 1.75rem)'

const blend = (paper: PaperNotePaper) => (paper === 'dark' ? 'soft-light' : 'multiply')

// ─── Rissformen ─────────────────────────────────────────────────────────────

function rand(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (v: number, max: number) => Math.min(max, Math.max(0, v))

// Rissrand rundum. Tiefe in px statt %, damit sie nicht mit der Notizgröße skaliert.
// Random-Walk statt reinem Zufall – sonst wirkt der Rand gesägt statt gerissen.
function deckleEdge(seed: number, depth: number) {
  const r = rand(seed)
  let d = depth / 2
  const next = () => {
    d = clamp(d + (r() - 0.5) * depth * 0.9, depth)
    return d.toFixed(1)
  }
  const pts: string[] = []
  for (let x = 0; x < 100; x += 2.5) pts.push(`${x}% ${next()}px`)
  for (let y = 0; y < 100; y += 4) pts.push(`calc(100% - ${next()}px) ${y}%`)
  for (let x = 100; x > 0; x -= 2.5) pts.push(`${x}% calc(100% - ${next()}px)`)
  for (let y = 100; y > 0; y -= 4) pts.push(`${next()}px ${y}%`)
  return `polygon(${pts.join(', ')})`
}

// Nur die Oberkante gerissen. `fiber` liegt minimal höher und bildet den hellen Faserrand.
function tornTop(seed: number, depth: number) {
  const r = rand(seed)
  let d = depth / 2
  const paper: string[] = []
  const fiber: string[] = []
  for (let x = 0; x <= 100; x += 2) {
    d = clamp(d + (r() - 0.5) * depth, depth)
    paper.push(`${x}% ${(d + 3).toFixed(1)}px`)
    fiber.push(`${x}% ${(d + 3 - 1.2 - r() * 2.2).toFixed(1)}px`)
  }
  const close = ['100% 100%', '0% 100%']
  return {
    paper: `polygon(${[...paper, ...close].join(', ')})`,
    fiber: `polygon(${[...fiber, ...close].join(', ')})`,
  }
}

const TORN_ENDS = 'polygon(0 0, 100% 4%, calc(100% - 3px) 30%, 100% 55%, calc(100% - 4px) 78%, 100% 100%, 0 96%, 3px 70%, 0 48%, 4px 22%)'

// ─── Pfeil ──────────────────────────────────────────────────────────────────

const ARROW_PLACEMENT: Record<PaperNoteArrow, CSSProperties> = {
  right: { left: 'calc(100% + 6px)', top: '38%' },
  left:  { right: 'calc(100% + 6px)', top: '38%', transform: 'scaleX(-1)' },
  down:  { top: 'calc(100% + 22px)', left: '45%', transform: 'rotate(90deg)' },
  up:    { bottom: 'calc(100% + 22px)', left: '45%', transform: 'rotate(-90deg)' },
}

const ARROW_SHAFT = 'M4 34 C 14 36, 22 18, 38 17 C 52 16, 60 22, 74 15'
const ARROW_HEAD = 'M62.5 12.8 Q 69 14 74.2 15.1 Q 71 19.5 68.6 25'

const DRAW_SHAFT: Variants = {
  hidden: { pathLength: 0 },
  shown: { pathLength: 1, transition: { duration: 0.7, delay: 0.4, ease: 'easeInOut' } },
}
const DRAW_HEAD: Variants = {
  hidden: { pathLength: 0 },
  shown: { pathLength: 1, transition: { duration: 0.25, delay: 1.05, ease: 'easeOut' } },
}

function Arrow({ direction, draw, strokeWidth }: { direction: PaperNoteArrow; draw: boolean; strokeWidth: number }) {
  return (
    <svg
      aria-hidden="true"
      width="80"
      height="44"
      viewBox="0 0 80 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute"
      style={ARROW_PLACEMENT[direction]}
    >
      {draw ? (
        <>
          <motion.path d={ARROW_SHAFT} variants={DRAW_SHAFT} />
          <motion.path d={ARROW_HEAD} variants={DRAW_HEAD} />
        </>
      ) : (
        <>
          <path d={ARROW_SHAFT} />
          <path d={ARROW_HEAD} />
        </>
      )}
    </svg>
  )
}

// ─── Tape ───────────────────────────────────────────────────────────────────

function WashiTape() {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-3 left-1/2 h-6.5 w-27"
      style={{
        transform: 'translateX(-50%) rotate(-4deg)',
        ...WASHI,
      }}
    />
  )
}

function MaskingTape({ side }: { side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1.5 z-10 h-5.5 w-18.5"
      style={{
        ...(side === 'left' ? { left: -22 } : { right: -22 }),
        transform: `rotate(${side === 'left' ? -38 : 38}deg)`,
        background: `${GRAIN_FINE}, oklch(0.9 0.035 85 / 0.9)`,
        clipPath: TORN_ENDS,
      }}
    />
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PaperNote({
  children,
  variant = 'torn',
  paper = 'kraft',
  rotate,
  tape = false,
  arrow,
  seed,
  className,
  style,
}: PaperNoteProps) {
  const autoSeed = hashSeed(useId())
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const s = seed ?? autoSeed
  const angle = rotate ?? DEFAULT_ROTATE[variant]
  const p = PAPER[paper]

  if (variant === 'notepad') {
    const edge = tornTop(s, 7)
    const ruled = paper === 'cream'
    return (
      <div
        className={cn('relative isolate w-fit max-w-72 text-[1.15rem]', className)}
        style={{ transform: `rotate(${angle}deg)`, fontFamily: FONT.notepad, ...style }}
      >
        {/* Angehobene Ecken: zwei schräge Schatten, die nur unten hervorschauen */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-2 -z-10 h-1/4 w-2/5"
          style={{ boxShadow: '0 14px 12px oklch(0.15 0.02 60 / 0.4)', transform: 'rotate(-4deg)' }}
        />
        <span
          aria-hidden="true"
          className="absolute right-2 bottom-3 -z-10 h-1/4 w-2/5"
          style={{ boxShadow: '0 14px 12px oklch(0.15 0.02 60 / 0.4)', transform: 'rotate(4deg)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ clipPath: edge.fiber, background: 'oklch(0.97 0.012 88)', filter: 'blur(0.35px)' }}
        />
        <div
          className="relative px-7 pt-8 pb-7 leading-7"
          style={{
            clipPath: edge.paper,
            backgroundColor: p.bg,
            backgroundImage: ruled ? `${RULED}, ${GRAIN_FINE}` : `${GRAIN_FINE}, ${GRAIN_FIBER}`,
            backgroundPosition: ruled ? '0 2rem, 0 0' : undefined,
            backgroundBlendMode: blend(paper),
            color: p.ink,
          }}
        >
          {children}
        </div>
        {tape && (
          <>
            <MaskingTape side="left" />
            <MaskingTape side="right" />
          </>
        )}
        {arrow && <Arrow direction={arrow} draw={false} strokeWidth={1.8} />}
      </div>
    )
  }

  const drop: Variants = {
    hidden: { opacity: 0, y: -14, rotate: angle + 6 },
    shown: { opacity: 1, y: 0, rotate: angle, transition: SPRING },
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative w-fit max-w-68 text-[1.6rem]', className)}
      style={{ fontFamily: FONT.torn, ...style }}
      variants={drop}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'shown' : 'hidden'}
    >
      {/* Schatten am Eltern-Element: clip-path würde ihn sonst wegschneiden */}
      <div style={{ filter: 'drop-shadow(0 10px 12px oklch(0.2 0.03 60 / 0.28)) drop-shadow(0 2px 2px oklch(0.2 0.03 60 / 0.22))' }}>
        {/* leading hier statt am Wrapper: ein text-*-Override per className würde es sonst per tailwind-merge entfernen */}
        <div
          className="px-7 pt-7 pb-6 leading-[1.15]"
          style={{
            clipPath: deckleEdge(s, 3.5),
            backgroundColor: p.bg,
            backgroundImage: `${GRAIN_FINE}, ${GRAIN_FIBER}`,
            backgroundBlendMode: blend(paper),
            color: p.ink,
          }}
        >
          {children}
        </div>
      </div>
      {tape && <WashiTape />}
      {arrow && <Arrow direction={arrow} draw strokeWidth={2.2} />}
    </motion.div>
  )
}
