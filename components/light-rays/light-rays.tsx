import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface LightRaysProps {
  children?: ReactNode
  /** Number of rays (default: 5) */
  rays?: number
  /** Base color for the rays (default: 'var(--accent, #6366f1)') */
  color?: string
  /** Animation speed multiplier (default: 1) */
  speed?: number
  /** Maximum opacity of a single ray (default: 0.12) */
  intensity?: number
  /** Origin: 'top' | 'top-left' | 'top-right' (default: 'top') */
  origin?: 'top' | 'top-left' | 'top-right'
  className?: string
  style?: CSSProperties
}

// ─── Keyframe injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__light-rays-styles__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes light-ray-pulse {
      0%, 100% { opacity: var(--ray-min-opacity); }
      50% { opacity: var(--ray-max-opacity); }
    }
    @keyframes light-ray-sway {
      0%, 100% { transform: rotate(var(--ray-start-angle)) scaleY(1); }
      50% { transform: rotate(var(--ray-end-angle)) scaleY(1.05); }
    }
  `
  document.head.appendChild(style)
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function LightRays({
  children,
  rays = 5,
  color = 'var(--accent, #6366f1)',
  speed = 1,
  intensity = 0.12,
  origin = 'top',
  className,
  style,
}: LightRaysProps) {
  const injected = useRef(false)

  useEffect(() => {
    if (!injected.current) {
      injectStyles()
      injected.current = true
    }
  }, [])

  const originMap = {
    top: '50% 0%',
    'top-left': '20% 0%',
    'top-right': '80% 0%',
  }

  const rayElements: ReactNode[] = []

  for (let i = 0; i < rays; i++) {
    const baseAngle = -30 + (60 / (rays - 1 || 1)) * i
    const swayAmount = 3 + Math.random() * 4
    const duration = (4 + Math.random() * 3) / speed
    const delay = Math.random() * -duration
    const width = 30 + Math.random() * 40
    const minOpacity = intensity * 0.2
    const maxOpacity = intensity * (0.6 + Math.random() * 0.4)

    rayElements.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          width: `${width}%`,
          height: '140%',
          marginLeft: `${-width / 2}%`,
          background: `linear-gradient(180deg, ${color} 0%, transparent 70%)`,
          transformOrigin: originMap[origin],
          '--ray-start-angle': `${baseAngle - swayAmount}deg`,
          '--ray-end-angle': `${baseAngle + swayAmount}deg`,
          '--ray-min-opacity': `${minOpacity}`,
          '--ray-max-opacity': `${maxOpacity}`,
          opacity: minOpacity,
          animation: `light-ray-sway ${duration}s ease-in-out ${delay}s infinite, light-ray-pulse ${duration * 0.8}s ease-in-out ${delay}s infinite`,
          pointerEvents: 'none',
          filter: 'blur(8px)',
        } as CSSProperties}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {rayElements}
      </div>
      {children && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  )
}
