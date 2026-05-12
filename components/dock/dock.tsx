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
import { useComponentMessages } from '../i18n'
import { MESSAGES, type DockMessages } from './messages'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DockProps {
  children: ReactNode
  /** Maximale Scale bei Mouse-Hover (default: 1.6) */
  magnification?: number
  /** Radius des Magnification-Effekts in px (default: 100) */
  distance?: number
  /** i18n overrides — currently only `toolbarLabel`. */
  messages?: Partial<DockMessages>
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

  const innerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    transformOrigin: 'bottom center',
    willChange: 'transform',
    background: 'transparent',
    border: 'none',
    padding: 0,
    color: 'inherit',
    textDecoration: 'none',
    cursor: href || onClick ? 'pointer' : 'default',
  }

  const inner = (
    <>
      {/* Icon container — decorative wrapper, label sits below for accessible name */}
      <span
        aria-hidden
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
    </>
  )

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={{ ...innerStyle, scale }}
      >
        {inner}
      </motion.a>
    )
  }

  if (onClick) {
    return (
      <motion.button
        ref={ref as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={className}
        style={{ ...innerStyle, scale }}
      >
        {inner}
      </motion.button>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...innerStyle, scale }}
    >
      {inner}
    </motion.div>
  )
}

// ─── Dock (Root) ────────────────────────────────────────────────────────────────

export function Dock({
  children,
  magnification = 1.6,
  distance = 100,
  messages,
  className,
  style,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)
  const m = useComponentMessages(MESSAGES, messages)

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
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={m.toolbarLabel}
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
