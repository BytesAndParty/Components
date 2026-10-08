import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { BA, LABEL, type Glass, type LabelCode } from './buchart-data'

/**
 * Buch·Art — gemeinsame Bausteine der Familie. Abgeleitet aus der Original-CI von
 * buchart58.at: das Buch-Signet des Logos (links Weinglas, rechts Traube), die
 * Wortmarke „Weingut Buchart 58“ und der Farbcode der Etiketten. Moderner wird es
 * über Raum, Typo-Skala und ein einziges neues Element: das rote Lesebändchen
 * (aus dem Namensband der schwarzen Etiketten) als Markierung für „hier geht's weiter“.
 */

const DISPLAY = 'var(--font-buchart-display), Georgia, serif'
/** Goudy setzt sonst Mediävalziffern — Jahrgang und „58“ stehen auf den Etiketten als Normalziffern. */
const LINING = { fontVariantNumeric: 'lining-nums' } as const
const SANS = 'var(--font-buchart-sans), system-ui, sans-serif'

/** Notch-Form des Lesebändchens, quer gelegt — die Spitze zeigt nach rechts ins Weiterlesen. */
const RIBBON_CLIP = 'polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%)'

const SIGNET_PATHS = [
  // Buchdeckel unter den Seiten
  'M2.5 11v30.2c10.2-3 21.2-2.6 29.5 1.3 8.3-3.9 19.3-4.3 29.5-1.3V11',
  // linke und rechte Seite, in der Mitte am Falz zusammen
  'M32 9.2C24.3 4.8 13.6 4.4 5.2 7.4v30.3c8.4-2.9 19.1-2.5 26.8 1.8',
  'M32 9.2c7.7-4.4 18.4-4.8 26.8-1.8v30.3c-8.4-2.9-19.1-2.5-26.8 1.8V9.2',
  // Weinglas
  'M12.6 13.4c0 7.4 10.8 7.4 10.8 0Z',
  'M13.4 16.2h9.2',
  'M18 19.6v7.6',
  'M14.6 28.2c2.2-.9 4.6-.9 6.8 0',
  // Traube: Stiel und Blatt
  'M46 12.6c0-1.6.8-2.6 2.4-3',
  'M47.4 11.2c2.2-2 5.2-1.8 6.4.4-2.4 1.2-4.6 1-6.4-.4Z',
]

const GRAPES: [number, number][] = [
  [41.8, 15], [46, 15], [50.2, 15],
  [43.9, 18.7], [48.1, 18.7],
  [41.8, 18.7], [50.2, 18.7],
  [46, 22.4], [43.9, 26.1], [48.1, 22.4],
]

/**
 * Das Signet aus dem Logo, neu als Linienzeichnung. `draw` zeichnet die Linien
 * beim Einscrollen nach — einmal, langsam, wie mit Feder.
 */
export function Signet({ className, label, draw = false, strokeWidth = 1.25 }: { className?: string; label?: string; draw?: boolean; strokeWidth?: number }) {
  const reduce = useReducedMotion()
  const animate = draw && !reduce
  const lineProps = (i: number) =>
    animate
      ? {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { pathLength: { duration: 1.4, delay: 0.1 + i * 0.08, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.2, delay: 0.1 + i * 0.08 } },
        }
      : {}

  return (
    <svg
      viewBox="0 0 64 44"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {SIGNET_PATHS.map((d, i) => (
        <motion.path key={d} d={d} {...lineProps(i)} />
      ))}
      {GRAPES.map(([cx, cy], i) => (
        <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.9" {...lineProps(SIGNET_PATHS.length + i * 0.4)} />
      ))}
    </svg>
  )
}

/** Das Signet als reine SVG-Gruppe — für die Verwendung innerhalb anderer Zeichnungen (Etikett, Urkunde). */
function SignetGlyph({ transform, color, strokeWidth = 3 }: { transform: string; color: string; strokeWidth?: number }) {
  return (
    <g transform={transform} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {SIGNET_PATHS.map(d => (
        <path key={d} d={d} />
      ))}
      {GRAPES.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.9" />
      ))}
    </g>
  )
}

/** Die Wortmarke wie im Logo: Signet, Haarlinie, „Weingut“ über „Buchart 58“. */
export function Wordmark({ className, signetClassName, size = 'md' }: { className?: string; signetClassName?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: { signet: 'h-7 w-10', word: 'text-[1.15rem]', kicker: 'text-[7px]' }, md: { signet: 'h-9 w-[3.25rem]', word: 'text-[1.5rem]', kicker: 'text-[8px]' }, lg: { signet: 'h-14 w-20', word: 'text-[2.4rem]', kicker: 'text-[10px]' } }[size]
  return (
    <span className={cn('inline-flex items-center gap-3 lining-nums', className)}>
      <Signet className={`${s.signet} shrink-0 ${signetClassName ?? ''}`} />
      <span aria-hidden="true" className="h-[70%] min-h-6 w-px self-stretch bg-current opacity-40" />
      <span className="flex flex-col leading-none">
        <span className={`${s.kicker} font-medium tracking-[0.42em] uppercase`} style={{ fontFamily: SANS }}>
          Weingut
        </span>
        <span className={`${s.word} mt-1 tracking-[0.04em] whitespace-nowrap uppercase`} style={{ fontFamily: DISPLAY, ...LINING }}>
          Buchart 58
        </span>
      </span>
    </span>
  )
}

const GLASS: Record<Glass, { base: string; light: string }> = {
  gruen: { base: '#2c3a17', light: '#5b6e33' },
  dunkel: { base: '#15120e', light: '#3b342b' },
  klar: { base: '#d9b9ae', light: '#f4e4dc' },
}

export interface BottleProps {
  code: LabelCode
  name: string
  sub?: string
  vintage?: number
  glass?: Glass
  /** Freier Etikettentext — ersetzt Sorte/Jahrgang (persönliches Etikett). */
  dedication?: string
  /** Größenangabe unten am Etikett. */
  size?: string
  className?: string
  /** Ohne Label ist die Flasche dekorativ (aria-hidden). */
  label?: string
}

/**
 * Flasche als Zeichnung, Etikett im Farbcode. Ersetzt Produktfotos nicht,
 * sondern zeigt das Etikettensystem — gleiche Komposition wie die echten Etiketten:
 * Signet oben, Namensband „Buchart 58“ mit Doppellinie, darunter Sorte und Jahrgang.
 */
export function Bottle({ code, name, sub, vintage, glass = 'gruen', dedication, size = '0,75 l', className, label }: BottleProps) {
  const uid = useId().replace(/\W/g, '')
  const l = LABEL[code]
  const g = GLASS[glass]
  const longName = name.length > 12
  return (
    <svg
      viewBox="0 0 100 340"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={g.base} />
          <stop offset="0.28" stopColor={g.light} />
          <stop offset="0.5" stopColor={g.base} />
          <stop offset="1" stopColor={g.base} stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* Glas */}
      <path
        d="M41 44h18v48c0 20 29 26 29 50v184q0 8-8 8H20q-8 0-8-8V142c0-24 29-30 29-50Z"
        fill={`url(#glass-${uid})`}
      />
      {/* Kapsel */}
      <rect x="40" y="2" width="20" height="44" rx="2.5" fill="#141312" />
      <path d="M40 38h20" stroke="#2a2826" strokeWidth="1" />

      {/* Etikett */}
      <rect x="16" y="172" width="68" height="124" fill={l.ground} />
      <rect x="16" y="172" width="68" height="124" fill={`url(#sheen-${uid})`} />
      <SignetGlyph transform="translate(42.3 178.5) scale(0.24)" color={code === 'weiss' ? BA.goldInk : BA.gold} />
      <rect x="21" y="196" width="58" height="13" fill={l.band} />
      <text x="50" y="205.6" textAnchor="middle" fontSize="8" fill={l.bandText} style={{ fontFamily: DISPLAY, ...LINING }}>
        Buchart 58
      </text>
      <path d={`M21 212h58M21 214h58`} stroke={l.band} strokeWidth="0.7" />

      {dedication ? (
        <foreignObject x="19" y="222" width="62" height="56">
          <p
            className="flex h-full items-center justify-center text-center leading-[1.15] italic"
            style={{ fontFamily: DISPLAY, color: l.text, fontSize: '6.6px' }}
          >
            {dedication}
          </p>
        </foreignObject>
      ) : (
        <>
          <text
            x="50"
            y="238"
            textAnchor="middle"
            fontSize={longName ? 7.4 : 9}
            fill={l.text}
            style={{ fontFamily: DISPLAY, ...LINING }}
            {...(name.length > 15 ? { textLength: 58, lengthAdjust: 'spacingAndGlyphs' } : {})}
          >
            {name}
          </text>
          {sub && (
            <text
              x="50"
              y="250"
              textAnchor="middle"
              fontSize="5"
              fontStyle="italic"
              fill={l.text}
              opacity="0.9"
              style={{ fontFamily: DISPLAY, ...LINING }}
              {...(sub.length > 22 ? { textLength: 58, lengthAdjust: 'spacingAndGlyphs' } : {})}
            >
              {sub}
            </text>
          )}
          {vintage && (
            <text x="50" y="266" textAnchor="middle" fontSize="6.4" fill={l.text} style={{ fontFamily: DISPLAY, ...LINING }}>
              {vintage}
            </text>
          )}
        </>
      )}
      <text x="50" y="288" textAnchor="middle" fontSize="3.3" letterSpacing="0.6" fill={l.text} opacity="0.8" style={{ fontFamily: SANS, ...LINING }}>
        WEINLAND ÖSTERREICH · {size}
      </text>
    </svg>
  )
}

/**
 * Hintergrund des Lesebändchen-Buttons. Liegt absolut im Button, damit der
 * Fokus-Ring am Button selbst nicht von der clip-path abgeschnitten wird.
 */
export function RibbonFill({ tone = 'red' }: { tone?: 'red' | 'gold' | 'paper' }) {
  const fill = {
    red: 'bg-[#9e1919] group-hover:bg-[#861414]',
    gold: 'bg-[#be9f55] group-hover:bg-[#cdb06a]',
    paper: 'bg-[#f7f3e8] group-hover:bg-white',
  }[tone]
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 transition-colors duration-300 ${fill}`}
      style={{ clipPath: RIBBON_CLIP }}
    />
  )
}

/** Das hängende Lesebändchen — rotes Band mit eingekerbtem Ende. */
export function Ribbon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-[#9e1919] ${className ?? ''}`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 8px), 0 100%)' }}
    />
  )
}

/**
 * Kolumnentitel wie im Buch: links die Marke, rechts das Kapitel, darunter
 * eine Goldlinie. Jede Section der Familie beginnt damit.
 */
export function RunningHead({ chapter, title, tone = 'paper' }: { chapter: string; title: string; tone?: 'paper' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <div className={`flex items-end justify-between gap-6 border-b pb-3 text-[10.5px] font-medium tracking-[0.24em] uppercase ${dark ? 'border-[#be9f55]/45 text-[#d7c69f]' : 'border-[#be9f55]/70 text-[#7d6226]'}`}>
      <span>Buchart 58</span>
      <span className="text-right">
        Kapitel {chapter}
        <span aria-hidden="true" className="mx-2.5 opacity-60">·</span>
        {title}
      </span>
    </div>
  )
}

/** Monogramm im Goldring — für die Familie, ohne Porträtfoto zu erfinden. */
export function Medallion({ initial, className, tone = 'paper' }: { initial: string; className?: string; tone?: 'paper' | 'dark' | 'red' }) {
  const ring = { paper: 'border-[#be9f55] text-[#7d6226] bg-[#f0e8c3]/60', dark: 'border-[#be9f55]/70 text-[#d7c69f] bg-white/[0.03]', red: 'border-[#d7c69f]/70 text-[#f0e8c3] bg-white/[0.05]' }[tone]
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full border ${ring} ${className ?? ''}`}
      style={{ fontFamily: DISPLAY, ...LINING }}
    >
      <span className="absolute inset-[3px] rounded-full border border-current opacity-30" />
      <span className="relative translate-y-[0.04em] leading-none">{initial}</span>
    </span>
  )
}

/** Fünf Sterne in Gold, gefüllt bis `value`. */
export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex gap-1 ${className ?? ''}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} viewBox="0 0 20 20" className="h-full w-auto">
          <path
            d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7Z"
            fill={i < value ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}
