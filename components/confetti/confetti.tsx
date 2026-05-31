import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import confetti from 'canvas-confetti'
import { fireConfetti, RAIN_COLORS, type ConfettiOptions } from './fire'

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
  /** Number of waves (default: 5) */
  waves?: number
  /** Delay between waves in ms (default: 350) */
  waveDelay?: number
}

/**
 * Declarative confetti rain overlay.
 * Set `active` to true to start the animation.
 */
export function ConfettiRain({
  active,
  onComplete,
  particleCount = 400,
  colors,
  waves = 7,
  waveDelay = 500,
}: ConfettiRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cannonRef = useRef<confetti.CreateTypes | null>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    if (!cannonRef.current) {
      cannonRef.current = confetti.create(canvasRef.current, { resize: true })
    }
    const cannon = cannonRef.current

    const positions = 4
    const colorGroups = colors ? [colors] : RAIN_COLORS
    const perShot = Math.max(2, Math.floor(particleCount / (waves * positions * colorGroups.length)))
    let wavesDone = 0
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    function fireWave() {
      if (cancelled) return
      for (let i = 0; i < positions; i++) {
        const x = Math.random()
        for (const group of colorGroups) {
          cannon({
            origin: { x, y: -0.05 },
            angle: 270 + (Math.random() - 0.5) * 30,
            spread: 15 + Math.random() * 15,
            startVelocity: 20 + Math.random() * 40,
            gravity: 1.2 + Math.random() * 0.6,
            ticks: 350,
            particleCount: perShot,
            scalar: 0.7 + Math.random() * 0.6,
            drift: (Math.random() - 0.5) * 2,
            colors: Array.isArray(group) ? group : [group],
            disableForReducedMotion: true,
          })
        }
      }
      wavesDone++
      if (wavesDone < waves) {
        timers.push(setTimeout(fireWave, waveDelay))
      } else {
        timers.push(setTimeout(() => onComplete?.(), 3000))
      }
    }

    fireWave()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      cannon.reset()
    }
  }, [active, particleCount, colors, waves, waveDelay, onComplete])

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
