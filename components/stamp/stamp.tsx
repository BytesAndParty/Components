import { useId, useRef, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useComponentMessages } from '../i18n'
import { hashSeed } from '../lib/scrapbook'
import { cn } from '../lib/utils'
import { MESSAGES, type StampMessages } from './messages'

// ─── Types ──────────────────────────────────────────────────────────────────

export type StampVariant = 'seal' | 'date'

export interface StampProps {
  /** Jahrgang als vierstellige Jahreszahl, z. B. `2025`. */
  year: number
  /** `seal` Rundstempel mit Umschrift, `date` Datumsstempel mit Ziffernrädern. */
  variant?: StampVariant
  /** Absender, z. B. „Weingut Buchart“. `seal`: obere Umschrift, `date`: Zeile unter dem Datumsband. */
  issuer?: string
  /** Nur `seal`: untere Umschrift, z. B. „Sooß · Niederösterreich“. */
  place?: string
  /** Drehung in Grad. Default `-12` (seal) bzw. `-8` (date). */
  rotate?: number
  messages?: Partial<StampMessages>
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

const FONT = {
  sans: 'var(--font-sans, system-ui, sans-serif)',
  display: 'var(--font-display, Georgia, serif)',
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
}

// seal: Grundlinien der Umschrift. Oben stehen die Buchstaben nach außen, unten nach innen.
const RING_TOP = 69.5
const RING_BOTTOM = 78.75

// date: Abstand der Ziffern auf dem Rad (= Höhe des Datumsbands), zwei Umdrehungen 0–9.
const ROW = 38
const WHEEL = Array.from({ length: 20 }, (_, k) => k % 10)

/**
 * Staucht eine Zeile aus fetten, gesperrten Versalien auf `max` Einheiten, wenn sie geschätzt länger wäre.
 * Schätzung statt Messung, damit der Render rein bleibt. Bewusst knapp geschätzt: `textLength` würde eine
 * kürzere Zeile sonst auf `max` dehnen. Was knapp darüber liegt, fängt der Rand bis zu den Punkten ab.
 */
function fit(text: string, fontSize: number, tracking: number, max: number) {
  return text.length * fontSize * (0.62 + tracking) > max ? max : undefined
}

// ─── Ink ────────────────────────────────────────────────────────────────────

/** Fehlstellen im Farbauftrag: feines Rauschen, oberhalb von `cut` steil auf Alpha 0 geschnitten. Ergebnis `speckle`. */
function Speckle({ freq, seed, cut }: { freq: number; seed: number; cut: number }) {
  return (
    <>
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} result="fine" />
      <feColorMatrix in="fine" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8 0 0 0 ${8 * cut + 1}`} result="speckle" />
    </>
  )
}

interface ImpressionProps {
  uid: string
  seed: number
  shown: boolean
  reduce: boolean
  year: number
  label: string
  issuer?: string
  place?: string
}

// ─── seal ───────────────────────────────────────────────────────────────────

function Seal({ uid, seed, shown, reduce, year, label, issuer, place }: ImpressionProps) {
  const word = label.toUpperCase()
  const top = issuer?.toUpperCase()
  const bottom = place?.toUpperCase()
  return (
    <motion.div
      initial={false}
      animate={shown ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 1.3, rotate: 5, opacity: 0 }}
      // Aufgedrückt, setzt weich auf. Die Tinte ist sofort da.
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.12 } }}
    >
      <svg aria-hidden="true" viewBox="0 0 200 200" className="block h-auto w-full overflow-visible" fill="currentColor">
        <defs>
          <path id={`${uid}-top`} d={`M ${100 - RING_TOP} 100 A ${RING_TOP} ${RING_TOP} 0 0 1 ${100 + RING_TOP} 100`} />
          <path id={`${uid}-bottom`} d={`M ${100 - RING_BOTTOM} 100 A ${RING_BOTTOM} ${RING_BOTTOM} 0 0 0 ${100 + RING_BOTTOM} 100`} />
          {/* Filterfläche fest auf die viewBox, Ring samt rauem Rand liegt darin */}
          <filter id={`${uid}-ink`} filterUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
            <Speckle freq={0.6} seed={seed} cut={0.65} />
            <feDisplacementMap in="SourceGraphic" in2="fine" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="rough" />
            {/* Wolkig ungleichmäßiger Druck über die ganze Fläche */}
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={2} seed={seed + 1} result="coarse" />
            <feColorMatrix in="coarse" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2 0 0 0 1.9" result="density" />
            <feComposite in="speckle" in2="density" operator="in" result="mask" />
            <feComposite in="rough" in2="mask" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${uid}-ink)`}>
          <g fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="95" strokeWidth="3.2" />
            <circle cx="100" cy="100" r="88" strokeWidth="1.2" />
            {(top || bottom) && <circle cx="100" cy="100" r="60" strokeWidth="1.2" />}
          </g>
          {top && (
            <text textAnchor="middle" fontSize="12.5" fontWeight="700" letterSpacing="0.18em" style={{ fontFamily: FONT.sans }}>
              <textPath href={`#${uid}-top`} startOffset="50%" textLength={fit(top, 12.5, 0.18, 180)} lengthAdjust="spacingAndGlyphs">
                {top}
              </textPath>
            </text>
          )}
          {bottom && (
            <text textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.12em" style={{ fontFamily: FONT.sans }}>
              <textPath href={`#${uid}-bottom`} startOffset="50%" textLength={fit(bottom, 10, 0.12, 198)} lengthAdjust="spacingAndGlyphs">
                {bottom}
              </textPath>
            </text>
          )}
          {(top || bottom) && (
            <>
              <circle cx={100 - 74} cy="100" r="2.3" />
              <circle cx={100 + 74} cy="100" r="2.3" />
            </>
          )}
          {/* Ohne Umschrift füllt die Mitte den Ring */}
          <g transform={top || bottom ? undefined : 'translate(100 102) scale(1.4) translate(-100 -102)'}>
            {/* dx: halbe Sperrung, die nach dem letzten Buchstaben mitgezählt wird, sonst sitzt die Zeile links der Mitte */}
            <text
              x="100"
              y="86"
              dx={1.5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              letterSpacing="0.3em"
              textLength={fit(word, 10, 0.3, 100)}
              lengthAdjust="spacingAndGlyphs"
              style={{ fontFamily: FONT.sans }}
            >
              {word}
            </text>
            <text x="100" y="127" textAnchor="middle" fontSize="42" style={{ fontFamily: FONT.display, fontVariantNumeric: 'lining-nums' }}>
              {year}
            </text>
          </g>
        </g>
      </svg>
    </motion.div>
  )
}

// ─── date ───────────────────────────────────────────────────────────────────

function DateStamp({ uid, seed, shown, reduce, year, label, issuer }: ImpressionProps) {
  const digits = String(year).split('')
  const word = label.toUpperCase()
  const bottom = issuer?.toUpperCase()
  return (
    <motion.div
      initial={false}
      animate={shown ? { scale: 1, opacity: 1 } : { scale: 1.12, opacity: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
    >
      <svg aria-hidden="true" viewBox="0 0 240 140" className="block h-auto w-full overflow-visible" fill="currentColor">
        <defs>
          <clipPath id={`${uid}-inner`}>
            <ellipse cx="120" cy="70" rx="107" ry="57" />
          </clipPath>
          <clipPath id={`${uid}-band`}>
            <rect x="40" y="53" width="160" height="36" />
          </clipPath>
          {/* Filterfläche fest auf die viewBox. Relativ zur Bounding Box würde sie mit den verdeckten Ziffern der Räder
              auf ein Vielfaches wachsen und jeden Frame neu gerechnet. */}
          <filter id={`${uid}-ink`} filterUnits="userSpaceOnUse" x="0" y="0" width="240" height="140">
            {/* Frisches Stempelkissen: die Tinte läuft minimal aus, Ecken werden weich */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.9" result="soft" />
            <feComponentTransfer in="soft" result="bled">
              <feFuncA type="linear" slope="3.2" intercept="-0.9" />
            </feComponentTransfer>
            <Speckle freq={0.7} seed={seed} cut={0.68} />
            <feComposite in="bled" in2="speckle" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${uid}-ink)`}>
          <g fill="none" stroke="currentColor">
            <ellipse cx="120" cy="70" rx="114" ry="64" strokeWidth="3.6" />
            <ellipse cx="120" cy="70" rx="107" ry="57" strokeWidth="1.5" />
            <g clipPath={`url(#${uid}-inner)`} strokeWidth="1.5">
              <line x1="0" y1="52" x2="240" y2="52" />
              <line x1="0" y1="90" x2="240" y2="90" />
            </g>
          </g>
          <text
            x="120"
            y="42"
            dx={2.1}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            letterSpacing="0.32em"
            textLength={fit(word, 13, 0.32, 150)}
            lengthAdjust="spacingAndGlyphs"
            style={{ fontFamily: FONT.sans }}
          >
            {word}
          </text>
          <circle cx="40" cy="71" r="2.6" />
          <circle cx="200" cy="71" r="2.6" />
          {/* Ziffernräder: rasten nacheinander auf das Jahr ein. Delays je Property (COMPONENT-GUIDELINES §5). */}
          <g clipPath={`url(#${uid}-band)`} fontSize="30" fontWeight="700" textAnchor="middle" style={{ fontFamily: FONT.mono }}>
            {digits.map((digit, i) => (
              <motion.g
                key={i}
                initial={false}
                animate={{ y: shown ? -(10 + Number(digit)) * ROW : 0 }}
                transition={reduce ? { duration: 0 } : { y: { duration: 1 + i * 0.18, delay: 0.1 + i * 0.08, ease: [0.22, 0.9, 0.3, 1] } }}
              >
                {WHEEL.map((n, k) => (
                  <text key={k} x={120 + (i - (digits.length - 1) / 2) * 24} y={82 + k * ROW}>
                    {n}
                  </text>
                ))}
              </motion.g>
            ))}
          </g>
          {bottom && (
            <text
              x="120"
              y="112"
              dx={1.2}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              letterSpacing="0.26em"
              textLength={fit(bottom, 9.5, 0.26, 140)}
              lengthAdjust="spacingAndGlyphs"
              style={{ fontFamily: FONT.sans }}
            >
              {bottom}
            </text>
          )}
        </g>
      </svg>
    </motion.div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Stamp({ year, variant = 'seal', issuer, place, rotate, messages, className, style }: StampProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const id = useId()
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  // 30 % statt mehr: Auf einer Kachel mit overflow-hidden ist ein Stempel über der Ecke oft zur Hälfte abgeschnitten.
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const seal = variant === 'seal'

  const impression: ImpressionProps = {
    uid: id.replace(/\W/g, ''),
    // Jeder Abdruck bekommt eigene Fehlstellen, wie bei einem echten Stempel. feTurbulence behandelt Seeds ≤ 0 wie 1.
    seed: (Math.abs(hashSeed(id)) % 997) + 1,
    shown: reduce || inView,
    reduce,
    year,
    label: m.vintage,
    issuer,
    place,
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${m.vintage} ${year}`}
      className={cn(seal ? 'w-40' : 'w-52', className)}
      style={{ rotate: `${rotate ?? (seal ? -12 : -8)}deg`, ...style }}
    >
      {seal ? <Seal {...impression} /> : <DateStamp {...impression} />}
    </div>
  )
}
