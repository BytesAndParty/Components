import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type HighlightAction = 'highlight' | 'underline'

export interface HighlighterProps {
  children: ReactNode
  /** Type of highlight effect */
  action?: HighlightAction
  /** Highlight color (default: accent) */
  color?: string
  /** Animation duration in ms (default: 800) */
  duration?: number
  /** Trigger animation when scrolled into view (default: true) */
  animateOnView?: boolean
  /** Delay before animation starts in ms (default: 0) */
  delay?: number
  className?: string
  style?: CSSProperties
}

// ─── Keyframes (injected once) ──────────────────────────────────────────────────

const STYLE_ID = '__highlighter-keyframes__'

function injectKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes highlighter-reveal {
      from { background-size: 0% 100%; }
      to   { background-size: 100% 100%; }
    }
    @keyframes underline-reveal {
      from { background-size: 0% 2px; }
      to   { background-size: 100% 2px; }
    }
  `
  document.head.appendChild(style)
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function Highlighter({
  children,
  action = 'highlight',
  color = 'var(--accent, #6366f1)',
  duration = 800,
  animateOnView = true,
  delay = 0,
  className,
  style,
}: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(!animateOnView)

  useEffect(() => {
    injectKeyframes()
  }, [])

  useEffect(() => {
    if (!animateOnView || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animateOnView])

  const isHighlight = action === 'highlight'
  const alpha = isHighlight ? '33' : 'ff'
  const bgColor = color.startsWith('var(')
    ? color
    : `${color}${alpha}`

  const baseStyle: CSSProperties = {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    backgroundSize: isVisible
      ? isHighlight ? '100% 100%' : '100% 2px'
      : isHighlight ? '0% 100%' : '0% 2px',
    backgroundImage: isHighlight
      ? `linear-gradient(${bgColor}, ${bgColor})`
      : `linear-gradient(${color.startsWith('var(') ? color : bgColor}, ${color.startsWith('var(') ? color : bgColor})`,
    transition: `background-size ${duration}ms ease ${delay}ms`,
    ...(isHighlight
      ? { borderRadius: '2px', padding: '2px 4px' }
      : { paddingBottom: '4px' }),
    ...style,
  }

  return (
    <span ref={ref} className={className} style={baseStyle}>
      {children}
    </span>
  )
}
