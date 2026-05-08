import { useState, useCallback, type CSSProperties } from 'react'
import { useComponentMessages, interpolate } from '../i18n'
import type { ComponentMessages } from '../i18n'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface RatingMessages {
  /** ARIA label for the entire rating group (default: "Rating" / "Bewertung") */
  ariaLabel: string
  /** Individual star label with {current} and {total} placeholders */
  starLabel: string
}

const RATING_MESSAGES = {
  de: {
    ariaLabel: 'Bewertung',
    starLabel: '{current} von {total} Sternen',
  },
  en: {
    ariaLabel: 'Rating',
    starLabel: '{current} of {total} stars',
  },
} as const satisfies ComponentMessages<RatingMessages>

export interface RatingProps {
  /** Number of stars (default: 5) */
  count?: number
  /** Current value (controlled) */
  value?: number
  /** Default value (uncontrolled) */
  defaultValue?: number
  /** Callback when value changes */
  onChange?: (value: number) => void
  /** Star size in px (default: 24) */
  size?: number
  /** Active star color (default: accent) */
  activeColor?: string
  /** Inactive star color (default: muted) */
  inactiveColor?: string
  /** Read-only display mode (default: false) */
  readOnly?: boolean
  /** i18n overrides */
  messages?: Partial<RatingMessages>
  className?: string
  style?: CSSProperties
}

// ─── Star SVG ───────────────────────────────────────────────────────────────────

function StarIcon({ size, fill, stroke }: { size: number; fill: string; stroke: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', transition: 'transform 200ms ease' }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────────
// Keyframes: rating-pop → showcase/src/styles.css (standalone: see COMPONENT.md)

export function Rating({
  count = 5,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  size = 24,
  activeColor = 'var(--accent, #6366f1)',
  inactiveColor = 'var(--border, #2a2a2e)',
  readOnly = false,
  messages,
  className,
  style,
}: RatingProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)

  const m = useComponentMessages(RATING_MESSAGES, messages)

  const currentValue = isControlled ? controlledValue : internalValue
  const displayValue = hoverValue ?? currentValue

  const handleClick = useCallback(
    (index: number) => {
      if (readOnly) return
      const newValue = index + 1
      if (!isControlled) setInternalValue(newValue)
      setAnimatingIndex(index)
      setTimeout(() => setAnimatingIndex(null), 300)
      onChange?.(newValue)
    },
    [readOnly, isControlled, onChange]
  )

  return (
    <div
      className={className}
      role="radiogroup"
      aria-label={m.ariaLabel}
      style={{
        display: 'inline-flex',
        gap: '2px',
        ...style,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const isFilled = i < displayValue
        const isAnimating = i === animatingIndex

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i < currentValue}
            aria-label={interpolate(m.starLabel, { current: i + 1, total: count })}
            disabled={readOnly}
            onClick={() => handleClick(i)}
            onMouseEnter={() => !readOnly && setHoverValue(i + 1)}
            onMouseLeave={() => setHoverValue(null)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: readOnly ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isAnimating ? 'rating-pop 300ms ease' : 'none',
              transition: 'transform 150ms ease',
              transform: !readOnly && hoverValue !== null && i < hoverValue ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <StarIcon
              size={size}
              fill={isFilled ? activeColor : 'none'}
              stroke={isFilled ? activeColor : inactiveColor}
            />
          </button>
        )
      })}
    </div>
  )
}

