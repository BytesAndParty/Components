import { useState, useRef, type ReactNode, type CSSProperties } from 'react'

export interface Hover3DCardProps {
  children: ReactNode
  /** Maximum rotation angle in degrees (default: 15) */
  maxRotate?: number
  /** Perspective distance in px (default: 1000) */
  perspective?: number
  /** Smoothness of the return animation in ms (default: 400) */
  transitionSpeed?: number
  /** Show a glare/shine effect (default: true) */
  glare?: boolean
  /** Glare opacity/intensity (0-1, default: 0.15) */
  glareIntensity?: number
  className?: string
  style?: CSSProperties
}

export function Hover3DCard({
  children,
  maxRotate = 15,
  perspective = 1000,
  transitionSpeed = 400,
  glare = true,
  glareIntensity = 0.15,
  className,
  style,
}: Hover3DCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxRotate
    const rotateY = ((x - centerX) / centerX) * maxRotate

    setRotate({ x: rotateX, y: rotateY })
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  function handleMouseEnter() {
    setIsHovering(true)
  }

  function handleMouseLeave() {
    setIsHovering(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: `${perspective}px`,
        transition: isHovering
          ? 'none'
          : `transform ${transitionSpeed}ms ease-out`,
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        cursor: 'pointer',
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
