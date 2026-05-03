import {
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DockProps {
  children: ReactNode
  /** Maximale Scale bei Mouse-Hover (default: 1.6) */
  magnification?: number
  /** Radius des Magnification-Effekts in px (default: 100) */
  distance?: number
  className?: string
  style?: CSSProperties
}

export interface DockItemProps {
  icon: ReactNode
  label: string
  href?: string
  onClick?: () => void
  className?: string
}

// ─── DockItem ───────────────────────────────────────────────────────────────────

/**
 * Internes Item – berechnet Scale aus der Distanz der Maus zur Mitte des Items.
 * Nimmt `mouseX` als MotionValue vom Dock entgegen.
 */
interface DockItemInternalProps extends DockItemProps {
  mouseX: MotionValue<number>
  magnification: number
  distance: number
}

function DockItemInternal({
  icon,
  label,
  href,
  onClick,
  mouseX,
  magnification,
  distance,
  className,
}: DockItemInternalProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Distanz der Maus-X zum Mittelpunkt des Items
  const distFromCenter = useTransform(mouseX, (val: number) => {
    const el = ref.current
    if (!el) return distance + 1 // außerhalb des Effektradius
    const rect = el.getBoundingClientRect()
    return Math.abs(val - (rect.left + rect.width / 2))
  })

  // Scale: 1 (außerhalb) → magnification (genau im Zentrum)
  const scaleValue = useTransform(
    distFromCenter,
    [0, distance],
    [magnification, 1]
  )

  const scale = useSpring(scaleValue, {
    stiffness: 260,
    damping: 22,
    mass: 0.5,
  })

  const content = (
    <motion.div
      ref={ref}
      style={{
        scale,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        cursor: href || onClick ? 'pointer' : 'default',
        transformOrigin: 'bottom center',
        willChange: 'transform',
      }}
      className={className}
      onClick={onClick}
      title={label}
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Icon-Container */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          borderRadius: '0.875rem',
          background: 'color-mix(in oklch, var(--card) 80%, var(--border))',
          border: '1px solid var(--border, rgba(255,255,255,0.1))',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          fontSize: '1.4rem',
          color: 'var(--foreground)',
          transition: 'background 150ms ease, border-color 150ms ease',
        }}
      >
        {icon}
      </span>

      {/* Tooltip-Label (immer sichtbar, klein) */}
      <span
        style={{
          fontSize: '0.65rem',
          color: 'var(--muted-foreground, rgba(255,255,255,0.5))',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </span>
    </motion.div>
  )

  if (href) {
    return <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a>
  }
  return content
}

// ─── Dock (Root) ────────────────────────────────────────────────────────────────

export function Dock({
  children,
  magnification = 1.6,
  distance = 100,
  className,
  style,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  function handleMouseMove(e: React.MouseEvent) {
    mouseX.set(e.clientX)
  }

  function handleMouseLeave() {
    mouseX.set(Infinity) // Infinity → alle Items auf scale 1 zurück
  }

  // Children mit mouseX, magnification, distance anreichern
  const items = Array.isArray(children) ? children : [children]
  const enrichedItems = items.map((child: React.ReactNode, i: number) => {
    if (!child || typeof child !== 'object') return child
    const el = child as React.ReactElement<DockItemProps>
    if (el.type !== DockItem) return child
    return (
      <DockItemInternal
        key={i}
        {...el.props}
        mouseX={mouseX}
        magnification={magnification}
        distance={distance}
      />
    )
  })

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '1.25rem',
        background: 'color-mix(in oklch, var(--card) 70%, transparent)',
        border: '1px solid var(--border, rgba(255,255,255,0.1))',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {enrichedItems}
    </motion.div>
  )
}

// ─── DockItem (öffentliches API) ─────────────────────────────────────────────────

/**
 * Marker-Komponente: wird vom Dock in DockItemInternal umgewandelt.
 * Direkte Nutzung ohne Dock macht keinen Sinn.
 */
export function DockItem(_props: DockItemProps): null {
  return null
}
