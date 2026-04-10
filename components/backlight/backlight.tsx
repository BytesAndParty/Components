import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BacklightProps {
  children: ReactNode
  /** Number of glow blobs (default: 3) */
  blobs?: number
  /** Base glow color. If 'auto', uses --accent (default: 'auto') */
  color?: string
  /** Glow intensity / opacity (default: 0.3) */
  intensity?: number
  /** Glow blur radius in px (default: 60) */
  blur?: number
  /** Animate the glow blobs (default: true) */
  animated?: boolean
  /** Animation speed multiplier (default: 1) */
  speed?: number
  className?: string
  style?: CSSProperties
}

// ─── Keyframe injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__backlight-styles__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes backlight-float-0 {
      0%, 100% { transform: scale(1) translate(0%, 0%); }
      33%       { transform: scale(1.08) translate(4%, -5%); }
      66%       { transform: scale(0.94) translate(-4%, 4%); }
    }
    @keyframes backlight-float-1 {
      0%, 100% { transform: scale(1) translate(0%, 0%); }
      33%       { transform: scale(0.92) translate(-5%, 4%); }
      66%       { transform: scale(1.06) translate(5%, -3%); }
    }
    @keyframes backlight-float-2 {
      0%, 100% { transform: scale(1.04) translate(0%, 0%); }
      33%       { transform: scale(0.96) translate(3%, 5%); }
      66%       { transform: scale(1.08) translate(-5%, -4%); }
    }
  `
  document.head.appendChild(style)
}

// ─── Blob configs ───────────────────────────────────────────────────────────────
// cx/cy = Mittelpunkt des Radial-Gradients (innerhalb der Card-Fläche)
// Blobs decken exakt die Card-Fläche ab (inset: 0), der blur-Filter
// lässt den Glow symmetrisch nach außen bluten.

const blobConfigs = [
  { cx: '50%', cy: '50%', weight: 1.0, animIndex: 0 }, // Zentrum
  { cx: '30%', cy: '30%', weight: 0.65, animIndex: 1 }, // oben-links
  { cx: '70%', cy: '70%', weight: 0.65, animIndex: 2 }, // unten-rechts
  { cx: '70%', cy: '30%', weight: 0.55, animIndex: 0 }, // oben-rechts
  { cx: '30%', cy: '70%', weight: 0.55, animIndex: 1 }, // unten-links
]

// ─── Component ──────────────────────────────────────────────────────────────────

export function Backlight({
  children,
  blobs = 3,
  color = 'auto',
  intensity = 0.3,
  blur = 60,
  animated = true,
  speed = 1,
  className,
  style,
}: BacklightProps) {
  const injected = useRef(false)

  useEffect(() => {
    if (!injected.current && animated) {
      injectStyles()
      injected.current = true
    }
  }, [animated])

  const resolvedColor = color === 'auto' ? 'var(--accent, #6366f1)' : color
  const blobCount = Math.min(blobs, blobConfigs.length)

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Glow-Blobs: decken exakt die Card-Fläche ab (inset: 0).
          filter: blur lässt den Glow nach außen bluten – symmetrisch
          auf allen Seiten, da der Startpunkt mittig liegt. */}
      {Array.from({ length: blobCount }, (_, i) => {
        const cfg = blobConfigs[i]
        const duration = (7 + i * 2.5) / speed
        const animName = `backlight-float-${cfg.animIndex}`
        return (
          <div
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at ${cfg.cx} ${cfg.cy}, ${resolvedColor} 0%, transparent 65%)`,
              opacity: intensity * cfg.weight,
              filter: `blur(${blur}px)`,
              animation: animated ? `${animName} ${duration}s ease-in-out infinite` : 'none',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )
      })}

      {/* Content on top */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
