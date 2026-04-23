import { useEffect, useRef } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface CursorGlowProps {
  /** Glow-Farbe – überschreibt --accent (default: 'auto') */
  color?: string
  /** Glow-Radius in px (default: 300) */
  size?: number
  /** Deckkraft des Glow (default: 0.15) */
  opacity?: number
  /** Blur-Stärke in px (default: 60) */
  blur?: number
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * Globaler Cursor-Glow-Effekt.
 * Rendert ein `position: fixed` Overlay, das dem Cursor folgt.
 * Bei prefers-reduced-motion wird nichts gerendert.
 *
 * Einbinden: einmal im Layout, außerhalb von Scrollcontainern.
 * ```tsx
 * <CursorGlow />
 * ```
 */
export function CursorGlow({
  color = 'auto',
  size = 300,
  opacity = 0.3,
  blur = 60,
}: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Hooks immer aufrufen – prefers-reduced-motion nur in der Logik berücksichtigen
  useEffect(() => {
    if (prefersReduced) return
    const glow = glowRef.current
    if (!glow) return

    function onMouseMove(e: MouseEvent) {
      glow!.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [size, prefersReduced])

  // prefers-reduced-motion: nichts rendern (nach allen Hooks)
  if (prefersReduced) return null

  const resolvedColor = color === 'auto' ? 'var(--accent, #6366f1)' : color

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${resolvedColor} 0%, transparent 70%)`,
          opacity,
          filter: `blur(${blur}px)`,
          willChange: 'transform',
          // Startet außerhalb des sichtbaren Bereichs bis erste mousemove feuert
          transform: `translate(-${size}px, -${size}px)`,
        }}
      />
    </div>
  )
}
