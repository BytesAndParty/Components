import { type CSSProperties, type ReactNode } from 'react'
import { useComponentMessages, interpolate } from '../i18n'
import { MESSAGES, type CircularProgressMessages } from './messages'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface CircularProgressProps {
  /** Fortschrittswert 0–100 */
  value: number
  /** Gesamtgröße in px (default: 80) */
  size?: number
  /** Linienstärke in px (default: 6) */
  strokeWidth?: number
  /** Farbe des Fortschrittsrings (default: --accent) */
  color?: string
  /** Farbe des Hintergrundrings (default: --border) */
  trackColor?: string
  /** Optionaler Inhalt in der Mitte (Label, Icon, Zahl, …) */
  children?: ReactNode
  /** Animationsdauer in ms (default: 600) */
  duration?: number
  /** Override the aria-label entirely. Default uses i18n template "Progress: X%". */
  'aria-label'?: string
  /** i18n overrides for the aria-label template. */
  messages?: Partial<CircularProgressMessages>
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  color = 'var(--accent, #6366f1)',
  trackColor = 'var(--border, rgba(255,255,255,0.12))',
  children,
  duration = 600,
  'aria-label': ariaLabel,
  messages,
  className,
  style,
}: CircularProgressProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const clampedValue = Math.min(100, Math.max(0, value))
  const label = ariaLabel ?? interpolate(m.label, { value: clampedValue })
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // strokeDashoffset = circumference wenn 0%, 0 wenn 100%
  const offset = circumference * (1 - clampedValue / 100)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <span
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Hintergrundring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Fortschrittsring: startet oben (−90° Rotation) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
            transition: prefersReduced
              ? 'none'
              : `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      </svg>

      {/* Inhalts-Slot (z.B. Prozentzahl, Icon, …) — aria-hidden, value is on the progressbar */}
      {children && (
        <span aria-hidden style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </span>
      )}
    </span>
  )
}
