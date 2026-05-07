import { useEffect, useRef, useCallback, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ParticlesProps {
  /** Array of CSS color strings for the particles */
  particleColors?: string[]
  /** Total number of particles */
  particleCount?: number
  /** Spread radius of the particle cloud (arbitrary units, affects spacing) */
  particleSpread?: number
  /** Animation speed multiplier */
  speed?: number
  /** Base size of particles in px */
  particleBaseSize?: number
  /** Whether particles react to mouse movement */
  moveParticlesOnHover?: boolean
  /** Strength of the mouse repulsion effect (default: 80) */
  hoverRadius?: number
  /** Additional CSS class for the container */
  className?: string
  /** Additional inline styles for the container */
  style?: CSSProperties
}

// ─── Internals ──────────────────────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function Particles({
  particleColors = ['#ffffff'],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 2,
  moveParticlesOnHover = false,
  hoverRadius = 80,
  className,
  style,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  const createParticles = useCallback(
    (width: number, height: number): Particle[] => {
      const particles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const angle = Math.random() * Math.PI * 2
        const velocity = (Math.random() * 0.5 + 0.5) * speed

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * particleBaseSize + 1,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          alpha: Math.random() * 0.6 + 0.4,
        })
      }
      return particles
    },
    [particleCount, speed, particleBaseSize, particleColors]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement ?? canvas
    const dpr = window.devicePixelRatio || 1

    function resize() {
      const rect = parent.getBoundingClientRect()
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      canvas!.style.width = `${rect.width}px`
      canvas!.style.height = `${rect.height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current = createParticles(rect.width, rect.height)
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    if (moveParticlesOnHover) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    function animate() {
      const width = canvas!.width / dpr
      const height = canvas!.height / dpr

      ctx!.clearRect(0, 0, width, height)

      for (const p of particlesRef.current) {
        // Update position
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -p.size) p.x = width + p.size
        else if (p.x > width + p.size) p.x = -p.size
        if (p.y < -p.size) p.y = height + p.size
        else if (p.y > height + p.size) p.y = -p.size

        // Mouse repulsion
        if (moveParticlesOnHover) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < hoverRadius && dist > 0) {
            const force = (hoverRadius - dist) / hoverRadius
            p.x += (dx / dist) * force * 3
            p.y += (dy / dist) * force * 3
          }
        }

        // Draw
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = p.color
        ctx!.fill()
      }
      ctx!.globalAlpha = 1

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      resizeObserver.disconnect()
      if (moveParticlesOnHover) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [createParticles, moveParticlesOnHover, hoverRadius])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: moveParticlesOnHover ? 'auto' : 'none',
        }}
      />
    </div>
  )
}
