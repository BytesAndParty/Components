import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { cn } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface CartIconProps {
  /** Number of items in cart */
  count?: number
  /** Icon size in px (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
  /** Badge background color */
  badgeColor?: string
  /** Badge text color */
  badgeTextColor?: string
  /** Click handler */
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function CartIcon({
  count = 0,
  size = 24,
  color = 'currentColor',
  badgeColor = 'var(--accent, #6366f1)',
  badgeTextColor = '#fff',
  onClick,
  className,
  style,
}: CartIconProps) {
  const [displayCount, setDisplayCount] = useState(count)
  const [anim, setAnim] = useState<'add' | 'remove' | null>(null)
  const [badgeAnim, setBadgeAnim] = useState<'pop' | 'in' | 'out' | null>(null)
  const prevCount = useRef(count)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      setDisplayCount(count)
      prevCount.current = count
      return
    }

    const prev = prevCount.current
    if (count === prev) return
    prevCount.current = count

    setAnim(count > prev ? 'add' : 'remove')

    if (prev === 0 && count > 0) setBadgeAnim('in')
    else if (count === 0) setBadgeAnim('out')
    else setBadgeAnim('pop')

    const t1 = setTimeout(() => setDisplayCount(count), 500)
    const t2 = setTimeout(() => setAnim(null), 1000)
    const t3 = setTimeout(() => {
      setBadgeAnim(null)
      if (count === 0) setDisplayCount(0)
    }, 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [count])

  const badgeSize = Math.max(16, Math.round(size * 0.65))
  const boxSize = Math.round(size * 0.4)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Warenkorb${displayCount > 0 ? `, ${displayCount} Artikel` : ''}`}
      className={cn("relative inline-flex items-center justify-center p-0 bg-transparent border-none cursor-pointer", className)}
      style={{
        width: size + 14,
        height: size + 14,
        color,
        ...style,
      }}
    >
      {/* Cart SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* Flying box animation */}
      {anim && (
        <span
          className={cn(
            "absolute opacity-0 pointer-events-none",
            anim === 'add' ? "animate-[ci-box-add_1s_ease-in-out]" : "animate-[ci-box-remove_1s_ease-in-out]"
          )}
          style={{
            width: boxSize,
            height: boxSize,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            className="fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </span>
      )}

      {/* Badge */}
      {(displayCount > 0 || badgeAnim === 'out') && (
        <span
          className={cn(
            "absolute top-0 right-0 px-1 flex items-center justify-center leading-none font-bold font-inherit pointer-events-none",
            badgeAnim === 'pop' && "animate-[ci-badge-pop_400ms_cubic-bezier(0.34,1.56,0.64,1)]",
            badgeAnim === 'in' && "animate-[ci-badge-in_350ms_cubic-bezier(0.34,1.56,0.64,1)]",
            badgeAnim === 'out' && "animate-[ci-badge-out_250ms_ease-in_forwards]"
          )}
          style={{
            minWidth: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            background: badgeColor,
            color: badgeTextColor,
            fontSize: Math.max(9, Math.round(badgeSize * 0.6)),
          }}
        >
          {displayCount > 99 ? '99+' : displayCount}
        </span>
      )}
    </button>
  )
}
