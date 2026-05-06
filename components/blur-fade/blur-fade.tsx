import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BlurFadeProps {
  children: ReactNode
  /** Verzögerung in ms bevor die Animation startet (default: 0) */
  delay?: number
  /** Animationsdauer in ms (default: 600) */
  duration?: number
  /** Einblend-Richtung (default: 'up') */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Blur-Stärke zu Beginn (default: '8px') */
  blur?: string
  /** Animation nur einmal abspielen wenn Element sichtbar wird (default: true) */
  once?: boolean
  className?: string
  style?: CSSProperties
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const OFFSET = '20px'

function getInitialTransform(direction: BlurFadeProps['direction']): string {
  switch (direction) {
    case 'down':  return `translateY(-${OFFSET})`
    case 'left':  return `translateX(${OFFSET})`
    case 'right': return `translateX(-${OFFSET})`
    case 'up':
    default:      return `translateY(${OFFSET})`
  }
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function BlurFade({
  children,
  delay = 0,
  duration = 600,
  direction = 'up',
  blur = '8px',
  once = true,
  className,
  style,
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  // prefers-reduced-motion: Sample once on mount via lazy initial state.
  // matchMedia in render would be impure (react-hooks/purity); doing it
  // here means visible can start as `true` for reduced-motion users
  // without a setState-in-effect.
  const [prefersReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [visible, setVisible] = useState(prefersReduced)

  useEffect(() => {
    if (prefersReduced) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, prefersReduced])

  const initialTransform = getInitialTransform(direction)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : `blur(${blur})`,
        transform: visible ? 'translate(0, 0)' : initialTransform,
        transition: prefersReduced
          ? 'none'
          : `opacity ${duration}ms ease ${delay}ms, filter ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
