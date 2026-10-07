import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import confetti from 'canvas-confetti'
import { fireConfetti, startRain, type ConfettiOptions } from './fire'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type { ConfettiOptions }

export interface ConfettiButtonProps {
  children: ReactNode
  /** Confetti options */
  confettiOptions?: ConfettiOptions
  /** Additional onClick handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  style?: CSSProperties
  disabled?: boolean
}

// ─── ConfettiRain Component ─────────────────────────────────────────────────────

export interface ConfettiRainProps {
  /** Whether the rain is currently active */
  active: boolean
  /** Called when the animation has finished */
  onComplete?: () => void
  /** Total particle count (default: 400) */
  particleCount?: number
  /** Particle colors */
  colors?: string[]
  /** How long new confetti keeps falling in, in ms (default: 3000) */
  duration?: number
}

/**
 * Declarative confetti rain overlay.
 * Set `active` to true to start the animation.
 */
export function ConfettiRain({
  active,
  onComplete,
  particleCount,
  colors,
  duration,
}: ConfettiRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    // One cannon per run: the canvas unmounts while inactive, so a cannon kept
    // across runs would keep drawing on the detached old canvas.
    const cannon = confetti.create(canvasRef.current, { resize: true })
    const rain = startRain(cannon, { particleCount, colors, duration })
    let cancelled = false
    rain.done.then(() => {
      if (!cancelled) onComplete?.()
    })

    return () => {
      cancelled = true
      rain.cancel()
    }
  }, [active, particleCount, colors, duration, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}

// ─── ConfettiButton ─────────────────────────────────────────────────────────────

/**
 * All confetti fires on the global canvas (fullscreen).
 * Origin is calculated from the button's position in the viewport.
 */
export function ConfettiButton({
  children,
  confettiOptions,
  onClick,
  className,
  style,
  disabled,
}: ConfettiButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e)

    const rect = e.currentTarget.getBoundingClientRect()
    fireConfetti({
      ...confettiOptions,
      originX: (rect.left + rect.width / 2) / window.innerWidth,
      originY: (rect.top + rect.height / 2) / window.innerHeight,
    })
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
