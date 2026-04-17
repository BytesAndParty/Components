import type { CSSProperties, ReactNode } from 'react'
import { Particles, type ParticlesProps } from './particles'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ParticlesCardProps extends ParticlesProps {
  children?: ReactNode
  /** Additional CSS class for the outer container */
  className?: string
  /** Additional inline styles for the outer container */
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function ParticlesCard({
  children,
  className,
  style,
  ...particlesProps
}: ParticlesCardProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Particles-Layer: absolut hinter dem Content */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Particles {...particlesProps} />
      </div>

      {/* Content-Layer: relativ darüber */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
