import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'

// ─── Keyframe injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__shiny-text-keyframes__'

function injectKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes shiny-text {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @media (prefers-reduced-motion: reduce) {
      .shiny-text-anim { animation: none !important; }
    }
  `
  document.head.appendChild(style)
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ShinyTextProps {
  children: ReactNode
  /** Shine-Farbe (default: white mit 80% Opacity) */
  shineColor?: string
  /** Animationsdauer in Sekunden (default: 5) */
  duration?: number
  className?: string
  style?: CSSProperties
}

export interface ShinyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  /** Shine-Farbe (default: rgba(255,255,255,0.6)) */
  shineColor?: string
  /** Animationsdauer in Sekunden (default: 5) */
  duration?: number
  style?: CSSProperties
}

// ─── ShinyText ──────────────────────────────────────────────────────────────────

export function ShinyText({
  children,
  shineColor = 'rgba(255,255,255,0.8)',
  duration = 5,
  className,
  style,
}: ShinyTextProps) {
  const injected = useRef(false)
  useEffect(() => {
    if (!injected.current) {
      injectKeyframes()
      injected.current = true
    }
  }, [])

  return (
    <span
      className={['shiny-text-anim', className].filter(Boolean).join(' ')}
      style={{
        backgroundImage: `linear-gradient(
          120deg,
          var(--foreground, currentColor) 40%,
          ${shineColor} 50%,
          var(--foreground, currentColor) 60%
        )`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: `shiny-text ${duration}s linear infinite`,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

// ─── ShinyButton ────────────────────────────────────────────────────────────────

export function ShinyButton({
  children,
  shineColor = 'rgba(255,255,255,0.6)',
  duration = 3,
  style,
  ...props
}: ShinyButtonProps) {
  const injected = useRef(false)
  useEffect(() => {
    if (!injected.current) {
      injectKeyframes()
      injected.current = true
    }
  }, [])

  return (
    <button
      {...props}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 1.25rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        // Accent-Hintergrund via CSS-Variable
        backgroundColor: 'var(--accent, #6366f1)',
        color: 'var(--accent-foreground, #fff)',
        fontWeight: 600,
        overflow: 'hidden',
        // Shine als Pseudo-Element-Ersatz: background-image overlay
        backgroundImage: `linear-gradient(
          120deg,
          transparent 40%,
          ${shineColor} 50%,
          transparent 60%
        )`,
        backgroundSize: '200% 100%',
        animation: `shiny-text ${duration}s linear infinite`,
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          // Verhindert dass der Shine-Gradient den Text-Kontrast zerstört
          backgroundImage: 'none',
          WebkitTextFillColor: 'inherit',
          color: 'inherit',
        }}
      >
        {children}
      </span>
    </button>
  )
}
