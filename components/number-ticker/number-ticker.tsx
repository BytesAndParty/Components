import { type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NumberTickerProps {
  value: number
  /** Animationsdauer pro Ziffer in ms (default: 600) */
  duration?: number
  className?: string
  style?: CSSProperties
}

// ─── Digit-Column ────────────────────────────────────────────────────────────────

/**
 * Einzelne Ziffernsäule: 0–9 vertikal gestapelt, sichtbar nur jeweils 1 Ziffer.
 * Slide-Animation via CSS transition auf translateY.
 */
function DigitColumn({ digit, duration }: { digit: number; duration: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: '1em',
        verticalAlign: 'top',
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          // Jede Ziffer ist 1em hoch → digit 3 → translateY(-30%)
          transform: `translateY(-${digit * 10}%)`,
          transition: `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          willChange: 'transform',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <span
            key={d}
            style={{
              display: 'block',
              height: '1em',
              lineHeight: 1,
            }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function NumberTicker({
  value,
  duration = 600,
  className,
  style,
}: NumberTickerProps) {
  const rounded = Math.round(Math.abs(value))
  const digits = String(rounded).split('').map(Number)
  const isNegative = value < 0

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {isNegative && <span>-</span>}
      {digits.map((digit, i) => {
        // Key von rechts für stabile Animationen bei Stellen-Änderungen
        const posFromRight = digits.length - 1 - i
        return (
          <DigitColumn
            key={`digit-${posFromRight}`}
            digit={digit}
            duration={duration}
          />
        )
      })}
    </span>
  )
}
