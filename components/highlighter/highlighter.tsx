import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type HighlightAction = 'highlight' | 'underline'

export interface HighlighterProps {
  children: ReactNode
  /** Type of highlight effect */
  action?: HighlightAction
  /** Highlight color, any CSS color (default: accent). `highlight` uses it at 20 % unless it is a `var()`. */
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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

const STYLE_ID = '__highlighter-styles__'
const CLASS = '__highlighter'

// !important, weil die Transition inline am Span sitzt.
function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @media (prefers-reduced-motion: reduce) {
      .${CLASS} { transition: none !important; }
    }
  `
  document.head.appendChild(style)
}

// Farbe mit Transparenz für jedes CSS-Farbformat (früher Hex-Suffix, das brach bei oklch()).
// var()-Farben bleiben wie bisher unverändert.
function tint(color: string, percent: number) {
  return color.startsWith('var(') ? color : `color-mix(in oklch, ${color} ${percent}%, transparent)`
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function Highlighter({
  children,
  action = 'highlight',
  color = 'var(--accent)',
  duration = 800,
  animateOnView = true,
  delay = 0,
  className,
  style,
}: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(!animateOnView)

  useEffect(() => {
    injectStyles()
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
  const bgColor = isHighlight ? tint(color, 20) : color

  const baseStyle: CSSProperties = {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    backgroundSize: isVisible
      ? isHighlight ? '100% 100%' : '100% 2px'
      : isHighlight ? '0% 100%' : '0% 2px',
    backgroundImage: `linear-gradient(${bgColor}, ${bgColor})`,
    transition: `background-size ${duration}ms ease ${delay}ms`,
    ...(isHighlight
      ? { borderRadius: '2px', padding: '2px 4px' }
      : { paddingBottom: '4px' }),
    ...style,
  }

  return (
    <span ref={ref} className={cn(CLASS, className)} style={baseStyle}>
      {children}
    </span>
  )
}
