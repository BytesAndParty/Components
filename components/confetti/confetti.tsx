import { useRef, useCallback, type ReactNode, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ConfettiOptions {
  /** Number of particles (default: 80) */
  particleCount?: number
  /** Spread angle in degrees (default: 70) */
  spread?: number
  /** Launch angle in degrees - 0=right, 90=up (default: 90) */
  angle?: number
  /** Initial velocity (default: 45) */
  startVelocity?: number
  /** Gravity (default: 1) */
  gravity?: number
  /** How quickly particles slow down (0-1, default: 0.92) */
  decay?: number
  /** Duration in ms (default: 3000) */
  duration?: number
  /** Particle colors */
  colors?: string[]
  /** Origin x (0-1), relative to container or viewport */
  originX?: number
  /** Origin y (0-1), relative to container or viewport */
  originY?: number
}

export interface ConfettiCanvasProps {
  /** Fullscreen overlay or contained within parent (default: 'fullscreen') */
  mode?: 'fullscreen' | 'contained'
  className?: string
  style?: CSSProperties
}

export interface ConfettiButtonProps {
  children: ReactNode
  /** Confetti mode: fullscreen or local (default: 'local') */
  mode?: 'fullscreen' | 'local'
  /** Confetti options */
  confettiOptions?: ConfettiOptions
  /** Additional onClick handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  style?: CSSProperties
  disabled?: boolean
}

// ─── Particle System ────────────────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'rect' | 'circle'
  opacity: number
  life: number
  maxLife: number
}

const DEFAULT_COLORS = [
  '#6366f1', '#f43f5e', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
]

function createParticle(
  originX: number,
  originY: number,
  options: Required<ConfettiOptions>
): Particle {
  const angleRad = (options.angle * Math.PI) / 180
  const spreadRad = (options.spread * Math.PI) / 180
  const randomAngle = angleRad + (Math.random() - 0.5) * spreadRad
  // velocity in pixels per second
  const velocity = options.startVelocity * 10 * (0.5 + Math.random() * 0.5)

  return {
    x: originX,
    y: originY,
    vx: Math.cos(randomAngle) * velocity,
    vy: -Math.sin(randomAngle) * velocity,
    color: options.colors[Math.floor(Math.random() * options.colors.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    opacity: 1,
    life: 0,
    maxLife: options.duration,
  }
}

function renderConfetti(
  canvas: HTMLCanvasElement,
  options: ConfettiOptions,
  mode: 'fullscreen' | 'contained'
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const opts: Required<ConfettiOptions> = {
    particleCount: options.particleCount ?? 80,
    spread: options.spread ?? 70,
    angle: options.angle ?? 90,
    startVelocity: options.startVelocity ?? 45,
    gravity: options.gravity ?? 1,
    decay: options.decay ?? 0.92,
    duration: options.duration ?? 3000,
    colors: options.colors ?? DEFAULT_COLORS,
    originX: options.originX ?? 0.5,
    originY: options.originY ?? 0.5,
  }

  const originX = opts.originX * rect.width
  const originY = opts.originY * rect.height

  const particles: Particle[] = Array.from(
    { length: opts.particleCount },
    () => createParticle(originX, originY, opts)
  )

  let prevTime = 0

  function animate(time: number) {
    if (!prevTime) prevTime = time
    const dt = Math.min((time - prevTime) / 1000, 0.05) // seconds, capped at 50ms
    prevTime = time

    ctx!.clearRect(0, 0, rect.width, rect.height)

    let alive = false
    for (const p of particles) {
      p.life += dt * 1000
      if (p.life > p.maxLife) continue

      alive = true

      // Apply gravity (pixels/s²) and velocity (pixels/s)
      p.vy += opts.gravity * 800 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt

      // Decay per-second: v *= decay^(dt*60) to be framerate-independent
      const frameDec = Math.pow(opts.decay, dt * 60)
      p.vx *= frameDec
      p.vy *= frameDec

      p.rotation += p.rotationSpeed * dt * 60

      // Fade out in last 30%
      const lifeRatio = p.life / p.maxLife
      p.opacity = lifeRatio > 0.7 ? 1 - (lifeRatio - 0.7) / 0.3 : 1

      ctx!.save()
      ctx!.translate(p.x, p.y)
      ctx!.rotate((p.rotation * Math.PI) / 180)
      ctx!.globalAlpha = p.opacity
      ctx!.fillStyle = p.color

      if (p.shape === 'rect') {
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else {
        ctx!.beginPath()
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx!.fill()
      }

      ctx!.restore()
    }

    if (alive) {
      requestAnimationFrame(animate)
    } else {
      ctx!.clearRect(0, 0, rect.width, rect.height)
    }
  }

  requestAnimationFrame(animate)
}

// ─── Imperative API ─────────────────────────────────────────────────────────────

/**
 * Fire confetti from a specific point on the page (fullscreen overlay).
 * Creates and removes a temporary canvas.
 */
export function fireConfetti(options?: ConfettiOptions) {
  const canvas = document.createElement('canvas')
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '9999',
  } satisfies Partial<CSSStyleDeclaration>)
  document.body.appendChild(canvas)

  const duration = options?.duration ?? 3000

  // Fire multiple bursts spread across the viewport
  const bursts = [
    { originX: 0.15, originY: 0.6 },
    { originX: 0.5, originY: 0.4 },
    { originX: 0.85, originY: 0.6 },
  ]
  const perBurst = Math.ceil((options?.particleCount ?? 80) / bursts.length)

  for (const burst of bursts) {
    renderConfetti(
      canvas,
      {
        ...options,
        particleCount: perBurst,
        spread: options?.spread ?? 120,
        originX: burst.originX,
        originY: burst.originY,
      },
      'fullscreen'
    )
  }

  setTimeout(() => {
    canvas.remove()
  }, duration + 100)
}

// ─── ConfettiButton (local or fullscreen) ───────────────────────────────────────

export function ConfettiButton({
  children,
  mode = 'local',
  confettiOptions,
  onClick,
  className,
  style,
  disabled,
}: ConfettiButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)

      if (mode === 'fullscreen') {
        const rect = e.currentTarget.getBoundingClientRect()
        fireConfetti({
          ...confettiOptions,
          originX: rect.left / window.innerWidth + (rect.width / window.innerWidth) / 2,
          originY: rect.top / window.innerHeight,
          angle: 90,
        })
        return
      }

      // Local mode: render on the contained canvas
      if (canvasRef.current) {
        renderConfetti(
          canvasRef.current,
          {
            particleCount: 40,
            spread: 60,
            startVelocity: 30,
            gravity: 1.2,
            duration: 2000,
            ...confettiOptions,
            originX: 0.5,
            originY: 0.35,
            angle: 90,
          },
          'contained'
        )
      }
    },
    [mode, confettiOptions, onClick]
  )

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        type="button"
        className={className}
        style={style}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </button>
      {mode === 'local' && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: '-150%',
            left: '-75%',
            width: '250%',
            height: '400%',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
