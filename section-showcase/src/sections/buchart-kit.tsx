import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { NumeralReveal } from '@components/numeral-reveal/numeral-reveal'

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

/** Die Wortmarke wie im Logo: Signet, Haarlinie, „Weingut“ über „Buchart 58“. */
export function Wordmark({ className, signetClassName, size = 'md' }: { className?: string; signetClassName?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: { signet: 'h-7 w-10', word: 'text-[1.15rem]', kicker: 'text-[7px]' }, md: { signet: 'h-9 w-[3.25rem]', word: 'text-[1.5rem]', kicker: 'text-[9px]' }, lg: { signet: 'h-14 w-20', word: 'text-[2.4rem]', kicker: 'text-[10px]' } }[size]
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
        Kapitel <NumeralReveal numeral={chapter} />
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
