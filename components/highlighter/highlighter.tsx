import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../lib/utils'
import { HandMark, type HighlightPen } from './hand-mark'

export type { HighlightPen } from './hand-mark'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type HighlightAction = 'highlight' | 'underline' | 'marker' | 'circle' | 'strike' | 'squiggle'

export interface HighlighterProps {
  children: ReactNode
  /**
   * Type of highlight effect.
   * - `highlight`: flat full-height background
   * - `underline`: 2px line
   * - `marker`: hand-drawn felt-tip stroke, one per line, slightly below the text with uneven ends
   * - `circle`: hand-drawn loop around the words
   * - `strike`: hand-drawn line through the words, rendered as `<s>` (no longer valid, e.g. an old price)
   * - `squiggle`: hand-drawn wave below the words
   *
   * `circle`, `strike` and `squiggle` keep the words on one line; use them for single words or short phrases.
   */
  action?: HighlightAction
  /**
   * Pen for `circle`, `strike` and `squiggle`: `pen` fountain pen (default), `nib` broad nib with thin and thick
   * strokes, `pencil` sketched twice in grainy graphite. Ignored by the other actions.
   */
  pen?: HighlightPen
  /**
   * Highlight color, any CSS color (default: accent). `highlight` uses it at 20 % unless it is a `var()`,
   * `marker` always at 45 %, the hand-drawn actions at full strength (`currentColor` takes the text color).
   */
  color?: string
  /**
   * Animation duration in ms (default: 800). The hand-drawn actions take their writing time from the word width
   * and scale it by `duration / 800`.
   */
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
      .${CLASS}, .${CLASS} path { transition: none !important; }
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
  pen = 'pen',
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
    // action: Die Handschrift-Actions rendern ein anderes Element (HandMark), beim Wechsel neu beobachten.
  }, [animateOnView, action])

  if (action === 'circle' || action === 'strike' || action === 'squiggle') {
    return (
      <HandMark
        spanRef={ref}
        action={action}
        pen={pen}
        color={color}
        isVisible={isVisible}
        tempo={duration / 800}
        delay={delay}
        className={cn(CLASS, className)}
        style={style}
      >
        {children}
      </HandMark>
    )
  }

  if (action === 'marker') {
    const ink = `color-mix(in oklch, ${color} 45%, transparent)`
    const markerStyle: CSSProperties = {
      // Weich auslaufende Enden, Strich leicht unter die Schrift gezogen.
      backgroundImage: `linear-gradient(100deg, transparent 0%, ${ink} 3%, ${ink} 96%, transparent 100%)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 78%',
      backgroundSize: isVisible ? '100% 82%' : '0% 82%',
      // Ein eigener Strich pro Zeile statt einer durchgehenden Fläche.
      WebkitBoxDecorationBreak: 'clone',
      boxDecorationBreak: 'clone',
      padding: '0.1em 0.45em',
      borderRadius: '0.5em 1.1em 0.6em 0.9em / 1em 0.45em 0.9em 0.5em',
      transition: `background-size ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      ...style,
    }
    return (
      <span ref={ref} className={cn(CLASS, className)} style={markerStyle}>
        {children}
      </span>
    )
  }

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
