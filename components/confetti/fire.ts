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

// ─── Rain ───────────────────────────────────────────────────────────────────────

export interface RainOptions {
  /** Total particles over the whole rain (default: 400) */
  particleCount?: number
  /** How long new confetti keeps falling in, in ms (default: 3000) */
  duration?: number
  /** Particle colors (default: built-in palette) */
  colors?: string[]
}

/**
 * Real rain instead of bursts: single particles drop in at random x positions
 * just above the top edge, with no launch impulse and a little side wind, spread
 * evenly over `duration`. `done` resolves once the last particle has crossed
 * the viewport; `cancel()` stops it immediately and resolves `done` as well.
 */
export function startRain(
  cannon: confetti.CreateTypes,
  { particleCount = 400, duration = 3000, colors = RAIN_COLORS.flat() }: RainOptions = {},
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { done: Promise.resolve(), cancel: () => {} }
  }

  // canvas-confetti moves a particle by gravity * 3 px per tick and runs at most one tick every
  // 16 ms (its own rAF throttle). On 75/90/144 Hz displays that is fewer than 60 ticks per second,
  // so the end of the rain is counted in ticks with the same throttle, not in milliseconds.
  const TICK_MS = Math.floor(1000 / 60)
  const MIN_GRAVITY = 1.4
  const distance = window.innerHeight * 1.05 + 20 // from just above the top to below the bottom edge
  const maxTravelTicks = Math.ceil(distance / (MIN_GRAVITY * 3))

  const drop = () => {
    const gravity = MIN_GRAVITY + Math.random() * 0.6
    cannon({
      particleCount: 1,
      origin: { x: Math.random(), y: -0.05 },
      startVelocity: 0,
      gravity,
      drift: (Math.random() - 0.5) * 1.2,
      // Opacity fades linearly over the lifetime; a longer lifetime keeps the
      // particle visible all the way down instead of vanishing mid-screen.
      ticks: Math.ceil((distance / (gravity * 3)) * 1.8),
      scalar: 0.7 + Math.random() * 0.5,
      colors: [colors[Math.floor(Math.random() * colors.length)]],
    })
  }

  let resolve = () => {}
  const done = new Promise<void>((r) => { resolve = r })
  let start = performance.now()
  let lastFrame = start
  let lastTick = 0
  let ticksSinceLastDrop = 0
  let spawned = 0
  let frame = 0

  const loop = (now: number) => {
    // rAF pauses in a background tab. Shift the schedule instead of dropping every
    // missed particle in one frame when the tab comes back.
    if (now - lastFrame > 100) start += now - lastFrame
    lastFrame = now

    if (spawned < particleCount) {
      const due = Math.round(particleCount * Math.min(1, (now - start) / duration))
      for (; spawned < due; spawned++) drop()
    } else if (now - lastTick > TICK_MS - 1) {
      lastTick = now
      if (++ticksSinceLastDrop >= maxTravelTicks) {
        // Every particle is off-screen now; reset clears the invisible remainder.
        cannon.reset()
        resolve()
        return
      }
    }
    frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)

  return {
    done,
    cancel() {
      cancelAnimationFrame(frame)
      cannon.reset()
      resolve()
    },
  }
}

/**
 * Imperative twin of `<ConfettiRain>`: rains on a temporary fullscreen canvas
 * that is removed again once the rain is over.
 */
export function fireConfettiRain(options?: RainOptions) {
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
  startRain(cannon, options).done.then(() => canvas.remove())
}
