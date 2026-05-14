import { useCallback, useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import confetti from 'canvas-confetti'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ConfettiOptions {
  /** Number of particles (default: 100) */
  particleCount?: number
  /** Spread angle in degrees (default: 70) */
  spread?: number
  /** Launch angle in degrees - 0=right, 90=up (default: 90) */
  angle?: number
  /** Initial velocity (default: 45) */
  startVelocity?: number
  /** Gravity (default: 1) */
  gravity?: number
  /** How quickly particles slow down (0-1, default: 0.9) */
  decay?: number
  /** Particle colors */
  colors?: string[]
  /** Origin x (0-1) */
  originX?: number
  /** Origin y (0-1) */
  originY?: number
  /** Shapes: 'square' | 'circle' | 'star' */
  shapes?: confetti.Shape[]
  /** Scale factor (default: 1) */
  scalar?: number
  /** Ticks / lifetime (default: 200) */
  ticks?: number
  /** Drift sideways (default: 0) */
  drift?: number
}

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

// ─── Helpers ────────────────────────────────────────────────────────────────────

const RAIN_COLORS: [string, string][] = [
  ['#6366f1', '#818cf8'],   // indigo
  ['#f59e0b', '#fbbf24'],   // amber
  ['#10b981', '#34d399'],   // emerald
  ['#f43f5e', '#fb7185'],   // rose
]

function toConfettiOpts(options?: ConfettiOptions): confetti.Options {
  if (!options) return {}
  return {
    particleCount: options.particleCount,
    spread: options.spread,
    angle: options.angle,
    startVelocity: options.startVelocity,
    gravity: options.gravity,
    decay: options.decay,
    colors: options.colors,
    shapes: options.shapes,
    scalar: options.scalar,
    ticks: options.ticks,
    drift: options.drift,
    origin: (options.originX != null || options.originY != null)
      ? { x: options.originX ?? 0.5, y: options.originY ?? 0.5 }
      : undefined,
    disableForReducedMotion: true,
  }
}

// ─── Imperative API ─────────────────────────────────────────────────────────────

/**
 * Fire a realistic confetti burst across the full viewport.
 * Uses multiple layered shots with different spreads for a natural look.
 */
export function fireConfetti(options?: ConfettiOptions) {
  const base = toConfettiOpts(options)
  const count = options?.particleCount ?? 200
  const origin = base.origin ?? { x: 0.5, y: 0.5 }

  const fire = (ratio: number, opts: confetti.Options) => {
    confetti({
      ...base,
      ...opts,
      origin,
      particleCount: Math.floor(count * ratio),
      disableForReducedMotion: true,
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 80 })
  fire(0.35, { spread: 140, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 180, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 180, startVelocity: 45 })
}

/**
 * Rain confetti from the top across the full viewport width.
 * Creates a temporary fullscreen canvas and fires multiple waves
 * of particles from random x positions along the top edge.
 */
export function fireConfettiRain(options?: ConfettiOptions) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '9999',
  } satisfies Partial<CSSStyleDeclaration>)
  document.body.appendChild(canvas)

  const cannon = confetti.create(canvas, { resize: true })
  const base = toConfettiOpts(options)
  const total = options?.particleCount ?? 400
  const waves = 5
  const positions = 4
  const colorGroups = options?.colors ? [options.colors] : RAIN_COLORS
  const perShot = Math.max(2, Math.floor(total / (waves * positions * colorGroups.length)))

  let wavesDone = 0

  function fireWave() {
    for (let i = 0; i < positions; i++) {
      const x = Math.random()
      for (const group of colorGroups) {
        cannon({
          ...base,
          origin: { x, y: -0.05 },
          angle: 270 + (Math.random() - 0.5) * 30,
          spread: 15 + Math.random() * 15,
          startVelocity: 20 + Math.random() * 40,
          gravity: 1.2 + Math.random() * 0.6,
          ticks: options?.ticks ?? 350,
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
      setTimeout(fireWave, 350)
    } else {
      // Clean up canvas after particles are done
      setTimeout(() => {
        cannon.reset()
        canvas.remove()
      }, 4000)
    }
  }

  fireWave()
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
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)

      const rect = e.currentTarget.getBoundingClientRect()
      fireConfetti({
        ...confettiOptions,
        originX: (rect.left + rect.width / 2) / window.innerWidth,
        originY: (rect.top + rect.height / 2) / window.innerHeight,
      })
    },
    [confettiOptions, onClick]
  )

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
