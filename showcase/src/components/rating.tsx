import { useState, useCallback, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

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
  /** Read-only display mode (default: false) */
  readOnly?: boolean
  /** Custom active color (overrides text-accent) */
  activeColor?: string
  className?: string
  style?: CSSProperties
}

// ─── Star SVG ───────────────────────────────────────────────────────────────────

function StarIcon({ size, isFilled, isHovered }: { size: number; isFilled: boolean; isHovered: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block transition-transform duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function Rating({
  count = 5,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  size = 24,
  readOnly = false,
  activeColor,
  className,
  style,
}: RatingProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)

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
      className={`inline-flex gap-0.5 ${className || ''}`}
      role="radiogroup"
      aria-label="Rating"
      style={style}
    >
      {Array.from({ length: count }, (_, i) => {
        const isFilled = i < displayValue
        const isAnimating = i === animatingIndex
        const isHovered = !readOnly && hoverValue !== null && i < hoverValue

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i < currentValue}
            aria-label={`${i + 1} von ${count} Sternen`}
            disabled={readOnly}
            onClick={() => handleClick(i)}
            onMouseEnter={() => !readOnly && setHoverValue(i + 1)}
            onMouseLeave={() => setHoverValue(null)}
            className={`
              bg-transparent border-none p-0.5 flex items-center justify-center transition-transform duration-150
              ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              ${isAnimating ? 'animate-[rating-pop_300ms_ease]' : ''}
              ${isFilled ? '' : 'text-border'}
            `}
            style={{
              color: isFilled ? (activeColor || 'var(--accent)') : undefined
            }}
          >
            <StarIcon
              size={size}
              isFilled={isFilled}
              isHovered={isHovered}
            />
          </button>
        )
      })}
    </div>
  )
}
