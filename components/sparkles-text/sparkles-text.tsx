import { useState, useEffect, useCallback, useRef, type ReactNode, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SparklesTextProps {
  children: ReactNode
  className?: string
  /** Color of the sparkles (default: accent color) */
  sparkleColor?: string
  /** Number of sparkles visible at once (default: 3) */
  sparkleCount?: number
  /** Min size of sparkles in px (default: 8) */
  minSize?: number
  /** Max size of sparkles in px (default: 18) */
  maxSize?: number
  /** Whether sparkles are active (default: true) */
  enabled?: boolean
  style?: CSSProperties
}

interface Sparkle {
  id: string
  x: number
  y: number
  size: number
  color: string
  createdAt: number
}

// ─── Sparkle SVG ────────────────────────────────────────────────────────────────

function SparkleIcon({ size, color, style }: { size: number; color: string; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        animation: 'sparkle-spin 700ms linear',
        ...style,
      }}
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </svg>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

let idCounter = 0
function generateSparkle(color: string, minSize: number, maxSize: number): Sparkle {
  return {
    id: `sparkle-${++idCounter}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (maxSize - minSize) + minSize,
    color,
    createdAt: Date.now(),
  }
}

// ─── Keyframes (injected once) ──────────────────────────────────────────────────

const STYLE_ID = '__sparkles-text-keyframes__'

function injectKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes sparkle-spin {
      0%   { transform: scale(0) rotate(0deg); opacity: 1; }
      50%  { transform: scale(1) rotate(90deg); opacity: 1; }
      100% { transform: scale(0) rotate(180deg); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function SparklesText({
  children,
  className,
  sparkleColor = 'var(--accent, #6366f1)',
  sparkleCount = 3,
  minSize = 8,
  maxSize = 18,
  enabled = true,
  style,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    injectKeyframes()
  }, [])

  const tick = useCallback(() => {
    const now = Date.now()
    setSparkles((prev: Sparkle[]) => {
      const alive = prev.filter(s => now - s.createdAt < 700)
      if (alive.length < sparkleCount) {
        return [...alive, generateSparkle(sparkleColor, minSize, maxSize)]
      }
      return alive
    })
  }, [sparkleColor, sparkleCount, minSize, maxSize])

  useEffect(() => {
    if (!enabled) {
      // Drop existing sparkles when feature is disabled mid-life.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSparkles([])
      return
    }
    intervalRef.current = setInterval(tick, 350)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, tick])

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {enabled &&
        sparkles.map(sparkle => (
          <SparkleIcon
            key={sparkle.id}
            size={sparkle.size}
            color={sparkle.color}
            style={{
              top: `${sparkle.y}%`,
              left: `${sparkle.x}%`,
              zIndex: 2,
            }}
          />
        ))}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  )
}
