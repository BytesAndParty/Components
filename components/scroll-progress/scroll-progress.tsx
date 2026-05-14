import { useEffect, useState, type CSSProperties } from 'react'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type ScrollProgressMessages } from './messages'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ScrollProgressProps {
  /** Color of the progress bar (default: var(--accent)) */
  color?: string
  /** Height of the bar in px (default: 3) */
  height?: number
  /** CSS top position, e.g. '56px' to place below a 56px navbar (default: '0') */
  top?: string
  /** z-index (default: 50) */
  zIndex?: number
  /** i18n override for the aria-label. */
  messages?: Partial<ScrollProgressMessages>
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function ScrollProgress({
  color = 'var(--accent, #6366f1)',
  height = 3,
  top = '0',
  zIndex = 50,
  messages,
  className,
  style,
}: ScrollProgressProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setProgress(scrollHeight <= 0 ? 0 : scrollTop / scrollHeight)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={m.label}
      style={{
        position: 'fixed',
        top,
        left: 0,
        width: '100%',
        height: `${height}px`,
        zIndex,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          transformOrigin: 'left',
          transform: `scaleX(${progress})`,
          background: color,
          transition: 'transform 50ms linear',
        }}
      />
    </div>
  )
}
