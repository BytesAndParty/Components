import { useEffect, useRef, type CSSProperties } from 'react'

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
  /** Index in particleColors — die aufgelöste Farbe liegt in colorsRef. */
  colorIndex: number
  alpha: number
}

/** Wie oft (in Frames) die CSS-Variablen neu ausgelesen werden. ~3×/s reicht,
 *  um dem animierten Accent-Wechsel des AccentSwitchers zu folgen. */
const COLOR_SAMPLE_INTERVAL = 20

// ─── Component ──────────────────────────────────────────────────────────────────

export function Particles({
  particleColors = ['#ffffff'],
  particleCount = 200,
  particleSpread: _particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 2,
  moveParticlesOnHover = false,
  hoverRadius = 80,
  className,
  style,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const colorsRef = useRef<string[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement ?? canvas
    const dpr = window.devicePixelRatio || 1
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Canvas kennt keine CSS-Variablen: `ctx.fillStyle = 'var(--accent)'` ist
    // kein gültiger Farbwert, wird still verworfen — der Partikel erbt dann
    // die Farbe des zuvor gezeichneten. Deshalb pro var()-Farbe ein
    // display:none-Sonde-Element, dessen computed color wir auslesen. Sonden
    // bleiben stehen, damit ein Accent-Wechsel ohne DOM-Mutation ankommt.
    const probes = particleColors.map(raw => {
      if (!raw.includes('var(')) return null
      const probe = document.createElement('span')
      probe.style.display = 'none'
      probe.style.color = raw
      parent.appendChild(probe)
      return probe
    })

    function sampleColors() {
      colorsRef.current = particleColors.map((raw, i) => {
        const probe = probes[i]
        return probe ? getComputedStyle(probe).color : raw
      })
    }

    sampleColors()

    function createParticles(width: number, height: number): Particle[] {
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
          colorIndex: Math.floor(Math.random() * particleColors.length),
          alpha: Math.random() * 0.6 + 0.4,
        })
      }
      return particles
    }

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

    // Bei reduzierter Bewegung gibt es keine Schleife, die nach dem Resize
    // neu zeichnen würde — das eine Standbild muss hier nachgezogen werden.
    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (prefersReduced) frame(false)
    })
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

    if (moveParticlesOnHover && !prefersReduced) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    let frameCount = 0

    function frame(move: boolean) {
      const width = canvas!.width / dpr
      const height = canvas!.height / dpr

      ctx!.clearRect(0, 0, width, height)

      if (frameCount++ % COLOR_SAMPLE_INTERVAL === 0) sampleColors()

      for (const p of particlesRef.current) {
        // Update position
        if (move) {
          p.x += p.vx
          p.y += p.vy
        }

        // Wrap around edges
        if (p.x < -p.size) p.x = width + p.size
        else if (p.x > width + p.size) p.x = -p.size
        if (p.y < -p.size) p.y = height + p.size
        else if (p.y > height + p.size) p.y = -p.size

        // Mouse repulsion
        if (moveParticlesOnHover && move) {
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
        ctx!.fillStyle = colorsRef.current[p.colorIndex]
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
    }

    function animate() {
      frame(true)
      animRef.current = requestAnimationFrame(animate)
    }

    // Nur laufen, solange die Section im Viewport ist: eine Komposition
    // stapelt mehrere Particles-Sections übereinander, und jede unsichtbare
    // RAF-Schleife kostet dieselbe Framezeit wie die sichtbare.
    let running = false
    function start() {
      if (running) return
      running = true
      animRef.current = requestAnimationFrame(animate)
    }
    function stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(animRef.current)
    }

    // prefers-reduced-motion: Der Staub bleibt als Bild stehen, statt zu
    // verschwinden — die Atmosphäre trägt die Section, die Bewegung nicht.
    if (prefersReduced) {
      frame(false)
      return () => {
        resizeObserver.disconnect()
        for (const probe of probes) probe?.remove()
      }
    }

    const inViewObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
      else stop()
    })
    inViewObserver.observe(parent)

    return () => {
      stop()
      inViewObserver.disconnect()
      resizeObserver.disconnect()
      for (const probe of probes) probe?.remove()
      if (moveParticlesOnHover) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [moveParticlesOnHover, hoverRadius, particleBaseSize, particleColors, particleCount, speed])

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        // Kein `position: relative` hier: Inline-Styles schlagen Klassen, und
        // Consumer platzieren den Layer per `absolute inset-0` — die Inline-
        // Regel hätte das überstimmt und den Layer in den Fluss gezogen.
        // `contain: layout` macht den Wrapper trotzdem zum Containing Block
        // für das absolut gesetzte Canvas, ohne `position` zu belegen.
        contain: 'layout paint',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: moveParticlesOnHover ? 'auto' : 'none',
        }}
      />
    </div>
  )
}
