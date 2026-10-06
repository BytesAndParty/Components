import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Barrel, Droplets, Grape, Sun, Wine } from 'lucide-react'
import { cn } from '@components/lib/utils'
import { Section } from '../components/section'
import { Board, LabFonts, LabHeader, Traits } from './lab-shared'

// Temporäre Werkbank: vier Entwürfe für <ProcessSteps> im direkten Vergleich.
// Sobald ein Entwurf gewählt ist, wandert er nach components/process-steps/ und
// diese Seite samt Route in App.tsx und lab-shared.tsx wird gelöscht.

interface Step {
  icon: ReactNode
  label: string
}

interface StepsProps {
  steps: Step[]
  className?: string
}

// ─── Gemeinsame Basis ───────────────────────────────────────────────────────

// Papier-Farben fix (SCRAPBOOK-TEXTBOXES.md #2), Pfeile und Linien auf dem Seitenhintergrund folgen dem Theme.
const PAPER = 'oklch(0.965 0.016 88)'
const KRAFT = 'oklch(0.80 0.055 76)'
const INK = 'oklch(0.27 0.02 60)'
const CHALKBOARD = 'oklch(0.27 0.014 55)'
const CHALK = 'oklch(0.95 0.012 90)'

const FONT = {
  caveat: "'Caveat', cursive",
  kalam: "'Kalam', cursive",
  cormorant: "'Cormorant Garamond', Georgia, serif",
}

const ICON = { size: 34, strokeWidth: 1.4 } as const

const WINE_STEPS: Step[] = [
  { icon: <Sun {...ICON} />, label: 'Reifen am Stock' },
  { icon: <Grape {...ICON} />, label: 'Lese von Hand' },
  { icon: <Droplets {...ICON} />, label: 'Sanft pressen' },
  { icon: <Barrel {...ICON} />, label: 'Reifen im Fass' },
  { icon: <Wine {...ICON} />, label: 'Verkosten' },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

function noise(freq: number, octaves: number, alpha: number, size: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='${alpha}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const GRAIN = noise(0.85, 2, 0.14, 180)

const ARROW_SHAFT = 'M4 34 C 14 36, 22 18, 38 17 C 52 16, 60 22, 74 15'
const ARROW_HEAD = 'M62.5 12.8 Q 69 14 74.2 15.1 Q 71 19.5 68.6 25'

/** Handgezeichneter Pfeil. Dreht sich im vertikalen Stack um 90°. */
function HandArrow({ className, dashed }: { className?: string; dashed?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="64"
      height="36"
      viewBox="0 0 80 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0 rotate-90 sm:rotate-0', className)}
    >
      <path d={ARROW_SHAFT} strokeDasharray={dashed ? '1 6' : undefined} />
      <path d={ARROW_HEAD} />
    </svg>
  )
}

// ─── A · Papier-Kreise ──────────────────────────────────────────────────────

function StepsA({ steps, className }: StepsProps) {
  const reduce = useReducedMotion()
  return (
    <ol className={cn('flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center', className)}>
      {steps.map((step, i) => (
        <motion.li
          key={step.label}
          className="flex flex-col items-center gap-3 sm:flex-row sm:items-start"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            opacity: { duration: 0.4, delay: i * 0.12 },
            y: { type: 'spring', stiffness: 150, damping: 20, delay: i * 0.12 },
          }}
        >
          <div className="flex w-28 flex-col items-center gap-3">
            <span
              className="grid size-[5.5rem] place-items-center rounded-full"
              style={{
                color: INK,
                backgroundColor: PAPER,
                backgroundImage: GRAIN,
                backgroundBlendMode: 'multiply',
                border: '1px solid oklch(0.27 0.02 60 / 0.45)',
                boxShadow: '0 6px 10px -4px oklch(0.2 0.03 60 / 0.3)',
                transform: `rotate(${i % 2 ? 2.5 : -2.5}deg)`,
              }}
            >
              <span aria-hidden="true">{step.icon}</span>
            </span>
            <span className="text-center text-sm leading-snug">{step.label}</span>
          </div>
          {i < steps.length - 1 && <HandArrow className="text-muted-foreground mt-7" />}
        </motion.li>
      ))}
    </ol>
  )
}

// ─── B · Wanderpfad ─────────────────────────────────────────────────────────

// Pfad läuft durch die Mittelpunkte der fünf Spalten (10 %, 30 %, 50 %, 70 %, 90 % von 1000).
const TRAIL = 'M100 36 C 180 4, 220 68, 300 36 S 420 4, 500 36 S 620 68, 700 36 S 820 4, 900 36'

function StepsB({ steps, className }: StepsProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const shown = reduce || inView
  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* clip-path auf dem inneren Wrapper, nie auf dem Beobachtungs-Element (STYLE-GUIDE §11) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 hidden h-[4.5rem] sm:block"
        initial={false}
        animate={{ clipPath: shown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={{ duration: reduce ? 0 : 2.2, ease: 'easeInOut' }}
      >
        <svg className="size-full text-muted-foreground" viewBox="0 0 1000 72" preserveAspectRatio="none" fill="none">
          <path d={TRAIL} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" />
        </svg>
      </motion.div>
      <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-5 sm:gap-0">
        {steps.map((step, i) => (
          <motion.li
            key={step.label}
            className="flex flex-row items-center gap-4 sm:flex-col sm:gap-3"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={shown ? { opacity: 1, scale: 1 } : undefined}
            transition={{
              opacity: { duration: 0.4, delay: reduce ? 0 : 0.3 + i * 0.4 },
              scale: { type: 'spring', stiffness: 300, damping: 30, delay: reduce ? 0 : 0.3 + i * 0.4 },
            }}
          >
            <span
              className="relative grid size-[4.5rem] shrink-0 place-items-center rounded-full"
              style={{
                color: INK,
                backgroundColor: KRAFT,
                backgroundImage: GRAIN,
                backgroundBlendMode: 'multiply',
                boxShadow: '0 5px 8px -3px oklch(0.2 0.03 60 / 0.4), inset 0 0 0 3px oklch(0.8 0.055 76), inset 0 0 0 4px oklch(0.27 0.035 55 / 0.35)',
              }}
            >
              <span aria-hidden="true">{step.icon}</span>
              <span
                aria-hidden="true"
                className="absolute -top-2 -left-2 grid size-7 place-items-center rounded-full text-base"
                style={{ fontFamily: FONT.caveat, backgroundColor: PAPER, color: INK, boxShadow: '0 1px 3px oklch(0.2 0.03 60 / 0.4)' }}
              >
                {i + 1}
              </span>
            </span>
            <span className="text-xl leading-tight sm:text-center" style={{ fontFamily: FONT.caveat }}>
              {step.label}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

// ─── C · Hairline-Ledger ────────────────────────────────────────────────────

function StepsC({ steps, className }: StepsProps) {
  const reduce = useReducedMotion()
  return (
    <ol className={cn('grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-5', className)}>
      {steps.map((step, i) => (
        <li key={step.label} className="relative pt-5">
          <motion.span
            aria-hidden="true"
            className="bg-border absolute inset-x-0 top-0 h-px origin-left"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              opacity: { duration: 0.9, delay: 0.2 + i * 0.15 },
              y: { duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <div className="flex items-start justify-between">
              <span aria-hidden="true" className="text-[3.25rem] leading-none font-light italic" style={{ fontFamily: FONT.cormorant }}>
                {ROMAN[i]}
              </span>
              <span aria-hidden="true" className="text-muted-foreground mt-1.5 [&_svg]:size-6 [&_svg]:stroke-[1.1]">
                {step.icon}
              </span>
            </div>
            <p className="text-muted-foreground mt-5 text-[0.65rem] leading-relaxed tracking-[0.3em] uppercase">{step.label}</p>
          </motion.div>
        </li>
      ))}
    </ol>
  )
}

// ─── D · Kreidetafel ────────────────────────────────────────────────────────

function StepsD({ steps, className }: StepsProps) {
  const reduce = useReducedMotion()
  const chalk: CSSProperties = { filter: 'url(#lab-chalk)' }
  return (
    <div
      className={cn('relative w-fit max-w-full rounded-sm px-8 py-10 sm:px-10', className)}
      style={{
        backgroundColor: CHALKBOARD,
        backgroundImage: `${GRAIN}, radial-gradient(120% 90% at 30% 20%, oklch(0.34 0.012 55), transparent 70%)`,
        backgroundBlendMode: 'soft-light, normal',
        color: CHALK,
        border: '10px solid oklch(0.5 0.06 60)',
        boxShadow: '0 14px 24px -10px oklch(0.2 0.03 60 / 0.5), inset 0 0 24px oklch(0 0 0 / 0.45)',
      }}
    >
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="lab-chalk" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <ol className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        {steps.map((step, i) => (
          <motion.li
            key={step.label}
            className="flex flex-col items-center gap-3 sm:flex-row sm:items-start"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: i * 0.25 }}
          >
            <div className="flex w-28 flex-col items-center gap-3">
              <span aria-hidden="true" className="grid size-20 place-items-center rounded-full border-[1.5px] border-dashed border-current/70" style={chalk}>
                {step.icon}
              </span>
              <span className="text-center text-[1.05rem] leading-tight" style={{ fontFamily: FONT.kalam, ...chalk }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && <HandArrow dashed className="mt-6 opacity-80" />}
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

// ─── Seite ──────────────────────────────────────────────────────────────────

const SHORT_STEPS = WINE_STEPS.filter((_, i) => i !== 2 && i !== 3)

export function LabProcessStepsPage() {
  return (
    <>
      <LabFonts />
      <LabHeader title="Process-Steps">
        Vier Entwürfe mit identischen Inhalten: der Weg einer Traube in fünf Schritten, darunter eine kurze Kette mit
        drei Schritten. Kombinieren ist ausdrücklich erlaubt, z. B. „Kreise von A auf dem Pfad von B“. Die Schmalansicht
        (unter 640 px) stapelt die Schritte vertikal und dreht die Pfeile. Linien und Pfeile auf dem Seitenhintergrund
        folgen dem Theme, Papier und Tafel bleiben fix.
      </LabHeader>

      <Section title="A · Papier-Kreise" description="Am nächsten am Plan: Icon-Kreise aus Papier mit dünner Linie, handgezeichnete Pfeile dazwischen, Labels in der UI-Schrift." canReload>
        <Traits items={[
          ['Badge', 'Papierkreis mit Korn, leicht gedreht'],
          ['Pfeile', 'handgezeichnet, Theme-Farbe'],
          ['Label', 'UI-Sans, gut lesbar'],
          ['Bewegung', 'Schritte steigen gestaffelt auf'],
          ['Mobil', 'vertikal, Pfeile 90° gedreht'],
          ['Theme', 'Pfeile und Label folgen dem Theme'],
        ]} />
        <div className="space-y-16 px-4 pt-8 pb-16">
          <StepsA steps={WINE_STEPS} />
          <StepsA steps={SHORT_STEPS} />
        </div>
      </Section>

      <Section title="B · Wanderpfad" description="Ein gepunkteter Weg zieht sich durch die Kraft-Stempel und verbindet sie. Schritte erscheinen, wenn der Weg sie erreicht." canReload>
        <Traits items={[
          ['Badge', 'Kraft-Stempel mit Doppelring, Nummer'],
          ['Pfeile', 'durchgehender gepunkteter Pfad'],
          ['Label', 'Caveat'],
          ['Bewegung', 'Pfad zeichnet sich, Stempel poppen nach'],
          ['Mobil', 'vertikale Liste, ohne Pfad'],
          ['Theme', 'Pfad folgt dem Theme'],
        ]} />
        <div className="space-y-16 px-4 pt-8 pb-16">
          <StepsB steps={WINE_STEPS} />
        </div>
      </Section>

      <Section title="C · Hairline-Ledger" description="Maison-Sprache ohne Boxen: römische Ziffer über einer Hairline, Icon als stilles Detail, Label in Kapitälchen." canReload>
        <Traits items={[
          ['Badge', 'keins, große Serif-Ziffer I bis V'],
          ['Pfeile', 'keine, die Hairline führt'],
          ['Label', 'Kapitälchen, weit gesperrt'],
          ['Bewegung', 'Hairline zeichnet sich, Text blendet nach'],
          ['Mobil', 'einspaltige Liste'],
          ['Theme', 'komplett semantisch'],
        ]} />
        <div className="space-y-16 px-4 pt-8 pb-16">
          <StepsC steps={WINE_STEPS} />
        </div>
      </Section>

      <Section title="D · Kreidetafel" description="Chalkboard mit Holzrahmen: Kreide-Icons mit rauer Kante, gestrichelte Kreisringe, Pfeile in Kreide." canReload>
        <Traits items={[
          ['Badge', 'gestrichelter Kreidekreis'],
          ['Pfeile', 'Kreide, gepunktet'],
          ['Label', 'Kalam in Kreideweiß'],
          ['Bewegung', 'Schritte blenden langsam nacheinander ein'],
          ['Mobil', 'vertikal im Rahmen'],
          ['Theme', 'fix, eigene Fläche'],
        ]} />
        <Board className="gap-12">
          <StepsD steps={WINE_STEPS} />
          <StepsD steps={SHORT_STEPS} />
        </Board>
      </Section>
    </>
  )
}
