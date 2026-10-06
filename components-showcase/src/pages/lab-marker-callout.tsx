import { useId, useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { Section } from '../components/section'
import { Board, LabFonts, LabHeader, Traits } from './lab-shared'

// Temporäre Werkbank: vier Entwürfe für <MarkerCallout> im direkten Vergleich.
// Sobald ein Entwurf gewählt ist, wandert er nach components/marker-callout/ und
// diese Seite samt Route in App.tsx und lab-shared.tsx wird gelöscht.

type Tone = 'kraft' | 'sage' | 'rose'

interface CalloutProps {
  children: ReactNode
  color?: Tone
  rotate?: number
  className?: string
}

// ─── Gemeinsame Basis ───────────────────────────────────────────────────────

// Fix statt Theme-Tokens (SCRAPBOOK-TEXTBOXES.md #2): die Farbfläche ist ein physisches Objekt.
const INK = 'oklch(0.27 0.03 55)'

const FONT = {
  caveat: "'Caveat', cursive",
  kalam: "'Kalam', cursive",
  cormorant: "'Cormorant Garamond', Georgia, serif",
}

const BRUSH: Record<Tone, string> = {
  kraft: 'oklch(0.80 0.055 76)',
  sage: 'oklch(0.80 0.06 140)',
  rose: 'oklch(0.82 0.07 15)',
}

// Kräftiger, wie ein echter Textmarker.
const MARKER: Record<Tone, string> = {
  kraft: 'oklch(0.87 0.13 88)',
  sage: 'oklch(0.85 0.13 140)',
  rose: 'oklch(0.83 0.11 10)',
}

const WASH: Record<Tone, { fill: string; pool: string }> = {
  kraft: { fill: 'oklch(0.86 0.06 76 / 0.7)', pool: 'oklch(0.7 0.08 70 / 0.5)' },
  sage: { fill: 'oklch(0.86 0.06 140 / 0.7)', pool: 'oklch(0.7 0.08 140 / 0.5)' },
  rose: { fill: 'oklch(0.87 0.06 15 / 0.7)', pool: 'oklch(0.72 0.09 12 / 0.5)' },
}

const TAPE: Record<Tone, string> = {
  kraft: 'oklch(0.9 0.035 85 / 0.94)',
  sage: 'oklch(0.88 0.045 140 / 0.94)',
  rose: 'oklch(0.9 0.04 15 / 0.94)',
}

// ─── A · Pinselstrich ───────────────────────────────────────────────────────

// Drei handgezeichnete Blobs, damit mehrere Callouts nebeneinander nicht identisch wirken.
const BLOBS = [
  'M8 22 C 30 6, 90 14, 150 9 S 262 4, 292 20 C 298 44, 290 66, 294 92 C 270 112, 200 104, 150 112 S 40 114, 10 100 C 2 76, 12 50, 8 22 Z',
  'M14 12 C 70 2, 120 18, 190 8 S 280 10, 296 30 C 288 56, 298 78, 284 102 C 220 116, 150 100, 90 112 S 18 108, 6 88 C 12 64, 2 36, 14 12 Z',
  'M4 30 C 20 8, 70 20, 130 10 S 250 2, 290 14 C 300 40, 286 60, 296 86 C 260 104, 190 98, 140 110 S 50 118, 14 98 C 6 70, 14 52, 4 30 Z',
]

// Borsten-Streifen quer über dem Blob, werden vom Blob selbst abgeschnitten.
const STREAKS = ['M0 30 C 80 24, 200 38, 300 28', 'M0 52 C 90 58, 190 46, 300 54', 'M0 76 C 70 70, 210 82, 300 74', 'M0 96 C 100 100, 200 92, 300 98']

function CalloutA({ children, color = 'kraft', rotate = -1, blob = 0, className }: CalloutProps & { blob?: number }) {
  const reduce = useReducedMotion()
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const shown = reduce || inView
  return (
    <div ref={ref} className={cn('relative w-fit max-w-[22rem]', className)} style={{ transform: `rotate(${rotate}deg)` }}>
      {/* clip-path liegt auf dem inneren Wrapper, nie auf dem Beobachtungs-Element (STYLE-GUIDE §11) */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ clipPath: shown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          <defs>
            <filter id={`${id}-dry`} x="-5%" y="-10%" width="110%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05 0.16" numOctaves="3" seed={blob + 3} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <clipPath id={`${id}-clip`}>
              <path d={BLOBS[blob % BLOBS.length]} />
            </clipPath>
          </defs>
          <g filter={`url(#${id}-dry)`}>
            <path d={BLOBS[blob % BLOBS.length]} fill={BRUSH[color]} />
            <g clipPath={`url(#${id}-clip)`} stroke="oklch(1 0 0 / 0.2)" strokeWidth="2.2" fill="none" vectorEffect="non-scaling-stroke">
              {STREAKS.map(d => (
                <path key={d} d={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>
        </svg>
      </motion.div>
      <motion.div
        className="relative px-11 py-8 text-center text-[1.7rem] leading-[1.15]"
        style={{ fontFamily: FONT.caveat, color: INK }}
        initial={false}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.35 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ─── B · Textmarker ─────────────────────────────────────────────────────────

function CalloutB({ children, color = 'kraft', rotate = -0.8, className }: CalloutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  return (
    <div ref={ref} className={cn('w-fit max-w-[24rem]', className)} style={{ transform: `rotate(${rotate}deg)` }}>
      <p className="text-[1.4rem] leading-[2.15]" style={{ fontFamily: FONT.kalam, color: INK }}>
        <span
          className="transition-[background-size] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{
            // Pro Zeile ein eigener Strich dank box-decoration-break, leicht unter die Schrift gezogen.
            backgroundImage: `linear-gradient(100deg, transparent 0%, ${MARKER[color]} 3%, ${MARKER[color]} 96%, transparent 100%)`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 78%',
            backgroundSize: inView ? '100% 82%' : '0% 82%',
            WebkitBoxDecorationBreak: 'clone',
            boxDecorationBreak: 'clone',
            padding: '0.1em 0.45em',
            borderRadius: '0.5em 1.1em 0.6em 0.9em / 1em 0.45em 0.9em 0.5em',
          }}
        >
          {children}
        </span>
      </p>
    </div>
  )
}

// ─── C · Aquarell ───────────────────────────────────────────────────────────

function CalloutC({ children, color = 'kraft', rotate = -0.5, seed = 1, className }: CalloutProps & { seed?: number }) {
  const reduce = useReducedMotion()
  const id = useId()
  const w = WASH[color]
  return (
    <motion.div
      className={cn('relative w-fit max-w-[22rem]', className)}
      style={{ rotate }}
      initial={reduce ? false : { opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id={`${id}-bleed`} x="-15%" y="-25%" width="130%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="4" seed={seed * 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </svg>
      {/* Der Farbverlauf des Wassers: die Pigmente sammeln sich am Rand */}
      <div
        aria-hidden="true"
        className="absolute -inset-3"
        style={{
          background: w.fill,
          borderRadius: '46% 54% 52% 48% / 58% 44% 56% 42%',
          boxShadow: `inset 0 0 22px 6px ${w.pool}`,
          filter: `url(#${id}-bleed)`,
        }}
      />
      <div
        className="relative px-9 py-8 text-center text-[1.55rem] leading-[1.3] italic"
        style={{ fontFamily: FONT.cormorant, color: INK }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// ─── D · Kreppband-Zeilen ───────────────────────────────────────────────────

const TORN_ENDS = 'polygon(0 0, 100% 5%, calc(100% - 3px) 32%, 100% 58%, calc(100% - 4px) 80%, 100% 100%, 0 95%, 3px 70%, 0 46%, 4px 22%)'
const STRIP_TILT = [-1.4, 0.9, -0.5, 1.2]
const STRIP_SHIFT = [0, 14, 4, 20]

function CalloutD({ lines, color = 'kraft', rotate = -1, className }: { lines: string[]; color?: Tone; rotate?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('flex w-fit flex-col items-start', className)} style={{ transform: `rotate(${rotate}deg)`, filter: 'drop-shadow(0 3px 3px oklch(0.2 0.03 60 / 0.3))' }}>
      {lines.map((line, i) => (
        <motion.span
          key={line}
          className="-mb-px inline-block px-5 py-1.5 text-[1.25rem] leading-snug font-bold whitespace-nowrap"
          style={{
            marginLeft: STRIP_SHIFT[i % STRIP_SHIFT.length],
            rotate: STRIP_TILT[i % STRIP_TILT.length],
            fontFamily: FONT.kalam,
            color: INK,
            backgroundColor: TAPE[color],
            clipPath: TORN_ENDS,
          }}
          // Delay je Property, nie auf dem Top-Level der Transition (COMPONENT-GUIDELINES §5)
          initial={reduce ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.35, delay: i * 0.12 },
            x: { type: 'spring', stiffness: 150, damping: 20, delay: i * 0.12 },
          }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  )
}

// ─── Seite ──────────────────────────────────────────────────────────────────

const TEXT = {
  kraft: 'Ein besonderes Erlebnis für alle Weinliebhaber – mit euch!',
  sage: 'Reben mieten, durch die Ried wandern, im Keller verkosten.',
  rose: 'Die Miete ist rein symbolisch.',
}

const LINES = {
  kraft: ['Ein besonderes Erlebnis', 'für alle Weinliebhaber', '– mit euch!'],
  sage: ['Reben mieten,', 'durch die Ried wandern,', 'im Keller verkosten.'],
  rose: ['Die Miete', 'ist rein symbolisch.'],
}

export function LabMarkerCalloutPage() {
  return (
    <>
      <LabFonts />
      <LabHeader title="Marker-Callout">
        Vier Entwürfe mit identischen Inhalten: je ein Satz in Kraft, Salbei und Rosé. Kombinieren ist ausdrücklich
        erlaubt, z. B. „Fläche von A, Schrift von C“. Die Farbflächen bleiben beim Wechsel von Dark/Light und Akzent fix.
        Entwurf D bekommt den Text zeilenweise (<code>lines</code>), weil jede Zeile ein eigener Streifen ist.
      </LabHeader>

      <Section title="A · Pinselstrich" description="Am nächsten am Plan: eine handgezeichnete Pinselfläche mit Borstenstreifen und trockenem Rand, die sich beim Scrollen von links aufzieht." canReload>
        <Traits items={[
          ['Fläche', 'Blob-Pfad (3 Formen), Borstenstreifen'],
          ['Schrift', 'Caveat'],
          ['Rand', 'trocken ausgefranst (SVG-Displacement)'],
          ['Farben', 'Kraft, Salbei, Rosé'],
          ['Bewegung', 'Strich zieht sich auf, Text blendet nach'],
          ['Theme', 'fix'],
        ]} />
        <Board>
          <CalloutA color="kraft" rotate={-1.5} blob={0}>{TEXT.kraft}</CalloutA>
          <CalloutA color="sage" rotate={1} blob={1}>{TEXT.sage}</CalloutA>
          <CalloutA color="rose" rotate={-0.5} blob={2}>{TEXT.rose}</CalloutA>
        </Board>
      </Section>

      <Section title="B · Textmarker" description="Wie mit dem Leuchtstift gezogen: ein Strich pro Zeile, leicht unter der Schrift, ungleichmäßige Enden. Der Strich fährt beim Scrollen durch." canReload>
        <Traits items={[
          ['Fläche', 'ein Strich pro Zeile (box-decoration-break)'],
          ['Schrift', 'Kalam'],
          ['Rand', 'weich auslaufende, schiefe Enden'],
          ['Farben', 'Gelb, Grün, Rosa, kräftiger als A'],
          ['Bewegung', 'Wipe von links bei Sichtbarkeit'],
          ['Theme', 'fix'],
        ]} />
        <Board>
          <CalloutB color="kraft" rotate={-1}>{TEXT.kraft}</CalloutB>
          <CalloutB color="sage" rotate={0.8}>{TEXT.sage}</CalloutB>
          <CalloutB color="rose" rotate={-0.5}>{TEXT.rose}</CalloutB>
        </Board>
      </Section>

      <Section title="C · Aquarell" description="Ruhig und edel: eine verlaufende Farbwolke, die Pigmente sammeln sich am ausgefransten Rand, darüber Serif-Kursive." canReload>
        <Traits items={[
          ['Fläche', 'Wasserfarben-Wash mit Randpigment'],
          ['Schrift', 'Cormorant kursiv'],
          ['Rand', 'weich zerfließend, kein Strich'],
          ['Farben', 'blasser als A, mit Transparenz'],
          ['Bewegung', 'sanftes Einbluten (Blur zu scharf)'],
          ['Theme', 'fix'],
        ]} />
        <Board className="gap-x-24 gap-y-20">
          <CalloutC color="kraft" rotate={-0.6} seed={1}>{TEXT.kraft}</CalloutC>
          <CalloutC color="sage" rotate={0.5} seed={2}>{TEXT.sage}</CalloutC>
          <CalloutC color="rose" rotate={-0.3} seed={3}>{TEXT.rose}</CalloutC>
        </Board>
      </Section>

      <Section title="D · Kreppband-Zeilen" description="Jede Zeile ein eigener Papierstreifen mit gerissenen Enden, leicht schief und versetzt. Weniger Pinsel, mehr Scrapbook." canReload>
        <Traits items={[
          ['Fläche', 'Streifen pro Zeile, gerissene Enden'],
          ['Schrift', 'Kalam fett'],
          ['Rand', 'Rissenden links und rechts'],
          ['Farben', 'Kraft, Salbei, Rosé als Kreppband'],
          ['Bewegung', 'Streifen gleiten gestaffelt ein'],
          ['API', 'Text als lines[] statt children'],
        ]} />
        <Board>
          <CalloutD lines={LINES.kraft} color="kraft" rotate={-1.5} />
          <CalloutD lines={LINES.sage} color="sage" rotate={1} />
          <CalloutD lines={LINES.rose} color="rose" rotate={-0.5} />
        </Board>
      </Section>
    </>
  )
}
