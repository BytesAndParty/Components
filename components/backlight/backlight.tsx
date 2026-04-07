import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

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
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33% { transform: translate(5%, -8%) scale(1.1); }
      66% { transform: translate(-5%, 5%) scale(0.95); }
    }
    @keyframes backlight-float-1 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33% { transform: translate(-8%, 5%) scale(0.9); }
      66% { transform: translate(6%, -3%) scale(1.05); }
    }
    @keyframes backlight-float-2 {
      0%, 100% { transform: translate(0%, 0%) scale(1.05); }
      33% { transform: translate(4%, 6%) scale(0.95); }
      66% { transform: translate(-6%, -4%) scale(1.1); }
    }
  `
  document.head.appendChild(style)
}

// ─── Blob positions ─────────────────────────────────────────────────────────────

const blobConfigs = [
  { top: '10%', left: '20%', size: '60%' },
  { top: '40%', left: '50%', size: '55%' },
  { top: '20%', left: '70%', size: '50%' },
  { top: '60%', left: '30%', size: '45%' },
  { top: '50%', left: '60%', size: '50%' },
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

  const blobElements: ReactNode[] = []
  for (let i = 0; i < blobCount; i++) {
    const cfg = blobConfigs[i]
    const duration = (6 + i * 2) / speed
    const animName = `backlight-float-${i % 3}`

    blobElements.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: cfg.top,
          left: cfg.left,
          width: cfg.size,
          height: cfg.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${resolvedColor} 0%, transparent 70%)`,
          opacity: intensity * (0.7 + (i % 2) * 0.3),
          filter: `blur(${blur}px)`,
          animation: animated ? `${animName} ${duration}s ease-in-out infinite` : 'none',
          pointerEvents: 'none',
        }}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Glow layer behind content */}
      <div
        style={{
          position: 'absolute',
          inset: `-${blur}px`,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {blobElements}
      </div>
      {/* Content on top */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
