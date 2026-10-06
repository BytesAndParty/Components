import { Fragment, useEffect, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useDeviceCapabilities } from '@components/lib/use-device-capabilities'
import { Section } from '../components/section'

// Temporäre Werkbank: vier Entwürfe für <PaperNote> im direkten Vergleich.
// Sobald ein Entwurf gewählt ist, wandert er nach components/paper-note/ und
// diese Seite samt Route in App.tsx wird gelöscht.

type Paper = 'kraft' | 'cream' | 'dark'
type Direction = 'up' | 'down' | 'left' | 'right'

interface NoteProps {
  children: ReactNode
  variant?: Paper
  rotate?: number
  tape?: boolean
  arrow?: Direction
  /** Steuert die Zufallsform des Rands, damit nebeneinanderliegende Notizen nicht identisch aussehen. */
  seed?: number
  className?: string
  style?: CSSProperties
}

// ─── Gemeinsame Basis ───────────────────────────────────────────────────────

// Bewusst fixe Papierfarben (SCRAPBOOK-TEXTBOXES.md, Entscheidung #2) – als oklch statt Hex.
const PAPER: Record<Paper, { bg: string; ink: string }> = {
  kraft: { bg: 'oklch(0.80 0.055 76)', ink: 'oklch(0.27 0.035 55)' },
  cream: { bg: 'oklch(0.965 0.016 88)', ink: 'oklch(0.27 0.02 60)' },
  dark:  { bg: 'oklch(0.27 0.014 55)', ink: 'oklch(0.92 0.025 85)' },
}

const FONT = {
  caveat: "'Caveat', cursive",
  kalam: "'Kalam', cursive",
  cormorant: "'Cormorant Garamond', Georgia, serif",
  gochi: "'Gochi Hand', cursive",
}

const FONT_LINK_ID = '__lab-paper-note-fonts__'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Gochi+Hand&family=Kalam:wght@400;700&display=swap'

function injectFonts() {
  if (typeof document === 'undefined') return
  if (document.getElementById(FONT_LINK_ID)) return
  const link = document.createElement('link')
  link.id = FONT_LINK_ID
  link.rel = 'stylesheet'
  link.href = FONT_HREF
  document.head.appendChild(link)
}

function noise(freq: number, octaves: number, alpha: number, size: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='${alpha}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const GRAIN_FINE = noise(0.85, 2, 0.14, 180)
const GRAIN_FIBER = noise(0.012, 3, 0.2, 420)
const RULED = 'repeating-linear-gradient(to bottom, transparent 0 calc(1.75rem - 1px), oklch(0.72 0.04 240 / 0.35) calc(1.75rem - 1px) 1.75rem)'

const blend = (variant: Paper) => (variant === 'dark' ? 'soft-light' : 'multiply')

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

// Mit der Schere geschnitten: leicht schiefe Ecken, rechts unten ein exakter Knick fürs Eselsohr.
function scissorCut(seed: number, fold: number) {
  const r = rand(seed)
  const j = () => (r() * 3).toFixed(1)
  return `polygon(${j()}px ${j()}px, calc(100% - ${j()}px) ${j()}px, 100% calc(100% - ${fold}px), calc(100% - ${fold}px) 100%, ${j()}px calc(100% - ${j()}px))`
}

function zigzagEnds(teeth: number, depth: number) {
  const left: string[] = []
  const right: string[] = []
  for (let i = 0; i <= teeth; i++) {
    const y = ((i / teeth) * 100).toFixed(1)
    left.push(`${i % 2 ? depth : 0}px ${y}%`)
    right.unshift(`calc(100% - ${i % 2 ? depth : 0}px) ${y}%`)
  }
  return `polygon(${[...left, ...right].join(', ')})`
}

const ZIGZAG = zigzagEnds(6, 4)
const ZIGZAG_FINE = zigzagEnds(12, 1.5)
const TORN_ENDS = 'polygon(0 0, 100% 4%, calc(100% - 3px) 30%, 100% 55%, calc(100% - 4px) 78%, 100% 100%, 0 96%, 3px 70%, 0 48%, 4px 22%)'

// ─── Pfeil ──────────────────────────────────────────────────────────────────

const ARROW_PLACEMENT: Record<Direction, CSSProperties> = {
  right: { left: 'calc(100% + 6px)', top: '38%' },
  left:  { right: 'calc(100% + 6px)', top: '38%', transform: 'scaleX(-1)' },
  down:  { top: 'calc(100% + 22px)', left: '45%', transform: 'rotate(90deg)' },
  up:    { bottom: 'calc(100% + 22px)', left: '45%', transform: 'rotate(-90deg)' },
}

function Arrow({ direction, color, draw, strokeWidth = 2.2 }: {
  direction: Direction
  color: string
  draw: boolean
  strokeWidth?: number
}) {
  return (
    <svg
      aria-hidden="true"
      width="80"
      height="44"
      viewBox="0 0 80 44"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute"
      style={ARROW_PLACEMENT[direction]}
    >
      <motion.path
        d="M4 34 C 14 36, 22 18, 38 17 C 52 16, 60 22, 74 15"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: 'easeInOut' }}
      />
      <motion.path
        d="M62.5 12.8 Q 69 14 74.2 15.1 Q 71 19.5 68.6 25"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, delay: 1.05, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ─── A · Scrapbook klassisch ────────────────────────────────────────────────

function NoteA({ children, variant = 'kraft', rotate = -2, tape, arrow, seed = 1, className, style }: NoteProps) {
  const reduce = useReducedMotion()
  const p = PAPER[variant]
  return (
    <motion.div
      className={cn('relative w-fit', className)}
      style={style}
      initial={reduce ? false : { opacity: 0, y: -14, rotate: rotate + 6 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      {/* Schatten am Eltern-Element: clip-path würde ihn sonst wegschneiden */}
      <div style={{ filter: 'drop-shadow(0 10px 12px oklch(0.2 0.03 60 / 0.28)) drop-shadow(0 2px 2px oklch(0.2 0.03 60 / 0.22))' }}>
        <div
          className="max-w-[17rem] px-7 pt-7 pb-6 text-[1.6rem] leading-[1.15]"
          style={{
            clipPath: deckleEdge(seed, 3.5),
            backgroundColor: p.bg,
            backgroundImage: `${GRAIN_FINE}, ${GRAIN_FIBER}`,
            backgroundBlendMode: blend(variant),
            color: p.ink,
            fontFamily: FONT.caveat,
          }}
        >
          {children}
        </div>
      </div>
      {tape && (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-[26px] w-[108px]"
          style={{
            transform: 'translateX(-50%) rotate(-4deg)',
            background: 'linear-gradient(180deg, oklch(1 0 0 / 0.14), transparent 45%), repeating-linear-gradient(90deg, oklch(0.6 0.07 118 / 0.8) 0 3px, oklch(0.64 0.07 118 / 0.72) 3px 7px)',
            clipPath: ZIGZAG,
          }}
        />
      )}
      {arrow && <Arrow direction={arrow} color="var(--foreground)" draw={!reduce} />}
    </motion.div>
  )
}

// ─── B · Notizblock-Abriss ──────────────────────────────────────────────────

function MaskingTape({ side }: { side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1.5 z-10 h-[22px] w-[74px]"
      style={{
        ...(side === 'left' ? { left: -22 } : { right: -22 }),
        transform: `rotate(${side === 'left' ? -38 : 38}deg)`,
        background: `${GRAIN_FINE}, oklch(0.9 0.035 85 / 0.9)`,
        clipPath: TORN_ENDS,
      }}
    />
  )
}

function NoteB({ children, variant = 'cream', rotate = 1.5, tape, arrow, seed = 1, className, style }: NoteProps) {
  const p = PAPER[variant]
  const edge = tornTop(seed, 7)
  const ruled = variant === 'cream'
  return (
    <div className={cn('relative isolate w-fit', className)} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
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
        className="relative max-w-[18rem] px-7 pt-8 pb-7 text-[1.15rem] leading-[1.75rem]"
        style={{
          clipPath: edge.paper,
          backgroundColor: p.bg,
          backgroundImage: ruled ? `${RULED}, ${GRAIN_FINE}` : `${GRAIN_FINE}, ${GRAIN_FIBER}`,
          backgroundPosition: ruled ? '0 2rem, 0 0' : undefined,
          backgroundBlendMode: blend(variant),
          color: p.ink,
          fontFamily: FONT.kalam,
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
      {arrow && <Arrow direction={arrow} color="var(--foreground)" draw={false} strokeWidth={1.8} />}
    </div>
  )
}

// ─── C · Büttenpapier ───────────────────────────────────────────────────────

const BUETTEN_SEEDS = [11, 23, 37]

function NoteC({ children, variant = 'cream', rotate = -0.6, tape, arrow, seed = 1, className, style }: NoteProps) {
  const reduce = useReducedMotion()
  const p = PAPER[variant]
  return (
    <motion.div
      className={cn('relative w-fit', className)}
      style={{ rotate, ...style }}
      initial={reduce ? false : { opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Displacement nur auf der Papierfläche, damit die Schrift nicht mitverzerrt wird */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: p.bg,
          backgroundImage: GRAIN_FINE,
          backgroundBlendMode: blend(variant),
          filter: `url(#lab-buetten-${seed % BUETTEN_SEEDS.length}) drop-shadow(0 18px 26px oklch(0.2 0.02 60 / 0.22))`,
        }}
      />
      <div
        className="relative max-w-[18rem] px-9 py-9 text-[1.45rem] leading-[1.3]"
        style={{ color: p.ink, fontFamily: FONT.cormorant, fontStyle: 'italic' }}
      >
        {children}
      </div>
      {tape && (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-6 w-24"
          style={{
            transform: 'translateX(-50%) rotate(2.5deg)',
            background: 'linear-gradient(100deg, oklch(1 0 0 / 0.08) 0%, oklch(1 0 0 / 0.38) 36%, oklch(1 0 0 / 0.1) 50%, oklch(1 0 0 / 0.2) 100%)',
            backdropFilter: 'blur(0.6px) saturate(1.15)',
            boxShadow: 'inset 0 0 0 0.5px oklch(0.5 0 0 / 0.3)',
            clipPath: ZIGZAG_FINE,
          }}
        />
      )}
      {arrow && <Arrow direction={arrow} color="var(--muted-foreground)" draw={false} strokeWidth={1.3} />}
    </motion.div>
  )
}

function BuettenFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {BUETTEN_SEEDS.map((s, i) => (
          <filter key={s} id={`lab-buetten-${i}`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed={s} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        ))}
      </defs>
    </svg>
  )
}

// ─── D · Collage ────────────────────────────────────────────────────────────

const FOLD = 26

function NoteD({ children, variant = 'kraft', rotate = 3, tape, arrow, seed = 1, className, style }: NoteProps) {
  const reduce = useReducedMotion()
  const { hasFinePointer } = useDeviceCapabilities()
  const p = PAPER[variant]
  const soft = { type: 'spring', stiffness: 150, damping: 20 } as const
  const snappy = { type: 'spring', stiffness: 300, damping: 30 } as const
  const lift = {
    hidden: { opacity: 0, scale: 0.92, y: 0, rotate },
    rest: { opacity: 1, scale: 1, y: 0, rotate, transition: soft },
    lift: { opacity: 1, scale: 1.035, y: -6, rotate: rotate * 0.25, transition: snappy },
  }
  const shadow = {
    hidden: { filter: 'drop-shadow(0 3px 3px oklch(0.2 0.02 60 / 0.25))' },
    rest: { filter: 'drop-shadow(0 3px 3px oklch(0.2 0.02 60 / 0.25))', transition: soft },
    lift: { filter: 'drop-shadow(0 18px 16px oklch(0.2 0.02 60 / 0.3))', transition: snappy },
  }
  return (
    <motion.div
      className={cn('relative w-fit', className)}
      style={style}
      variants={lift}
      initial={reduce ? false : 'hidden'}
      animate="rest"
      whileHover={hasFinePointer && !reduce ? 'lift' : undefined}
    >
      <motion.div variants={shadow}>
        <div
          className="relative max-w-[16rem] px-6 pt-6 pb-9 text-[1.35rem] leading-[1.25]"
          style={{
            clipPath: scissorCut(seed, FOLD),
            backgroundColor: p.bg,
            backgroundImage: `${GRAIN_FINE}, ${GRAIN_FIBER}`,
            backgroundBlendMode: blend(variant),
            color: p.ink,
            fontFamily: FONT.gochi,
          }}
        >
          {children}
          {/* Eselsohr: Schatten auf dem Papier, darüber die umgeklappte Ecke */}
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0"
            style={{
              width: FOLD,
              height: FOLD,
              background: 'linear-gradient(135deg, oklch(0 0 0 / 0.22) 0 50%, transparent 50%)',
              filter: 'blur(2.5px)',
              transform: 'translate(-2px, -2px)',
            }}
          />
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0"
            style={{
              width: FOLD,
              height: FOLD,
              background: `linear-gradient(315deg, color-mix(in oklch, ${p.bg} 70%, white) 0%, ${p.bg} 55%, color-mix(in oklch, ${p.bg} 88%, black) 100%)`,
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            }}
          />
        </div>
      </motion.div>
      {tape && (
        <span
          aria-hidden="true"
          className="absolute -top-3 -right-6 h-[26px] w-[96px]"
          style={{
            transform: 'rotate(28deg)',
            background: 'repeating-linear-gradient(-45deg, color-mix(in oklch, var(--accent) 78%, transparent) 0 5px, color-mix(in oklch, var(--accent) 32%, transparent) 5px 10px)',
            clipPath: ZIGZAG,
          }}
        />
      )}
      {arrow && <Arrow direction={arrow} color="var(--accent)" draw={!reduce} strokeWidth={2.6} />}
    </motion.div>
  )
}

// ─── Seite ──────────────────────────────────────────────────────────────────

const TEXT = {
  kraft: 'Kellerführung am Samstag – wir öffnen die alten Fässer nur für euch.',
  cream: 'Wir schenken dir ein Glas vom 2019er zum Anstoßen.',
  dark: 'Auf einen unvergesslichen Abend zwischen den Reben!',
}

function Traits({ items }: { items: [string, string][] }) {
  return (
    <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
      {items.map(([k, v]) => (
        <Fragment key={k}>
          <dt className="text-muted-foreground pt-0.5 text-[0.7rem] tracking-[0.15em] uppercase">{k}</dt>
          <dd>{v}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

function Board({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-start gap-x-24 gap-y-24 px-4 pt-8 pb-16">{children}</div>
}

export function LabPaperNotePage() {
  useEffect(() => {
    injectFonts()
  }, [])

  return (
    <>
      <BuettenFilters />

      <header className="mb-20 max-w-2xl">
        <p className="text-muted-foreground text-[0.7rem] tracking-[0.18em] uppercase">Werkbank · temporär</p>
        <h1 className="mt-3 text-6xl leading-none" style={{ fontFamily: FONT.cormorant, fontStyle: 'italic' }}>
          Paper-Note
        </h1>
        <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
          Vier Entwürfe mit identischen Inhalten: Kraft mit Tape und Pfeil, Creme pur, Dunkel mit Tape und Pfeil.
          Kombinieren ist ausdrücklich erlaubt, z. B. „Form von B, Schrift von A“. Beim Umschalten von Dark/Light
          und Akzent bleibt das Papier fix, nur Pfeile und bei D das Tape folgen dem Theme.
        </p>
      </header>

      <Section title="A · Scrapbook klassisch" description="Am nächsten am Plan: rundum gerissenes Papier, Washi-Tape, verspielte Handschrift." canReload>
        <Traits items={[
          ['Rand', 'rundum gerissen, feine Zacken'],
          ['Schrift', 'Caveat'],
          ['Tape', 'Washi oliv, Zackenenden, mittig'],
          ['Schatten', 'liegt flach auf'],
          ['Bewegung', 'fällt beim Laden ein, Pfeil zeichnet sich'],
          ['Theme', 'Pfeil in Textfarbe'],
        ]} />
        <Board>
          <NoteA variant="kraft" rotate={-3} seed={3} tape arrow="right">{TEXT.kraft}</NoteA>
          <NoteA variant="cream" rotate={2} seed={8}>{TEXT.cream}</NoteA>
          <NoteA variant="dark" rotate={-1.5} seed={13} tape arrow="down">{TEXT.dark}</NoteA>
        </Board>
      </Section>

      <Section title="B · Notizblock-Abriss" description="Vom Block gerissen: nur die Oberkante zerfasert, die Ecken heben sich leicht ab. Creme bekommt Linien." canReload>
        <Traits items={[
          ['Rand', 'oben gerissen mit hellem Faserrand'],
          ['Schrift', 'Kalam'],
          ['Tape', 'Kreppband an beiden Ecken'],
          ['Schatten', 'Ecken angehoben'],
          ['Bewegung', 'keine, rein statisch'],
          ['Theme', 'Pfeil in Textfarbe'],
        ]} />
        <Board>
          <NoteB variant="kraft" rotate={-2} seed={4} tape arrow="right">{TEXT.kraft}</NoteB>
          <NoteB variant="cream" rotate={1.5} seed={9}>{TEXT.cream}</NoteB>
          <NoteB variant="dark" rotate={-1} seed={14} tape arrow="down">{TEXT.dark}</NoteB>
        </Board>
      </Section>

      <Section title="C · Büttenpapier" description="Ruhig und edel, nah an der buchart58-Ästhetik: weicher, unregelmäßiger Büttenrand, Serif-Kursive, kaum Drehung." canReload>
        <Traits items={[
          ['Rand', 'weich verlaufender Büttenrand'],
          ['Schrift', 'Cormorant Garamond kursiv'],
          ['Tape', 'transparenter Klebestreifen'],
          ['Schatten', 'weich und breit'],
          ['Bewegung', 'sanftes Einblenden'],
          ['Theme', 'feiner Pfeil in Muted-Farbe'],
        ]} />
        <Board>
          <NoteC variant="kraft" rotate={-1} seed={0} tape arrow="right">{TEXT.kraft}</NoteC>
          <NoteC variant="cream" rotate={0.5} seed={1}>{TEXT.cream}</NoteC>
          <NoteC variant="dark" rotate={-0.4} seed={2} tape arrow="down">{TEXT.dark}</NoteC>
        </Board>
      </Section>

      <Section title="D · Collage" description="Verspielt und physisch: mit der Schere geschnitten, Eselsohr, gemustertes Washi in Akzentfarbe, hebt sich beim Hover." canReload>
        <Traits items={[
          ['Rand', 'geschnitten, leicht schief, Eselsohr'],
          ['Schrift', 'Gochi Hand'],
          ['Tape', 'gestreiftes Washi, schräg über der Ecke'],
          ['Schatten', 'wächst beim Anheben'],
          ['Bewegung', 'Pop-in, Hover hebt die Notiz an'],
          ['Theme', 'Tape und Pfeil in Akzentfarbe'],
        ]} />
        <Board>
          <NoteD variant="kraft" rotate={-3} seed={5} tape arrow="right">{TEXT.kraft}</NoteD>
          <NoteD variant="cream" rotate={2.5} seed={10}>{TEXT.cream}</NoteD>
          <NoteD variant="dark" rotate={-2} seed={15} tape arrow="down">{TEXT.dark}</NoteD>
        </Board>
      </Section>
    </>
  )
}
