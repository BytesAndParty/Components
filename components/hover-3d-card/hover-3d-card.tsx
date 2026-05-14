import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface Hover3DCardProps {
  children: ReactNode
  /** Max tilt angle in degrees (default: 15) */
  maxTilt?: number
  /** Glare effect intensity 0-1 (default: 0.2) */
  glareIntensity?: number
  /** Whether to show the glare overlay (default: true) */
  glare?: boolean
  /** Transition speed in ms (default: 300) */
  transitionSpeed?: number
  /** Border radius in px (default: 16) */
  borderRadius?: number
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function Hover3DCard({
  children,
  maxTilt = 15,
  glareIntensity = 0.2,
  glare = true,
  transitionSpeed = 300,
  borderRadius = 16,
  className,
  style,
}: Hover3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)')
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      const rotateX = (y - 0.5) * -maxTilt * 2
      const rotateY = (x - 0.5) * maxTilt * 2

      setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
      setGlarePos({ x: x * 100, y: y * 100 })
    },
    [maxTilt]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  }, [])

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${borderRadius}px`,
        transform,
        transition: isHovering
          ? 'transform 50ms ease-out'
          : `transform ${transitionSpeed}ms ease`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}

      {/* Glare overlay */}
      {glare && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: isHovering ? 1 : 0,
            transition: `opacity ${transitionSpeed}ms ease`,
            background: `radial-gradient(
              circle at ${glarePos.x}% ${glarePos.y}%,
              rgba(255, 255, 255, ${glareIntensity}),
              transparent 60%
            )`,
          }}
        />
      )}
    </div>
  )
}
