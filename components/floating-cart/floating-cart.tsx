import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────
// Keyframes (fc-show, fc-hide, fc-remove-product, fc-fade-*, fc-item-in, fc-badge-bump)
// are defined in styles.css

export interface FloatingCartItem {
  /** Unique item id */
  id: string
  /** Image source for the thumbnail */
  image?: string
  /** Fallback label if no image */
  label?: string
  /** Item count (default: 1) */
  count?: number
}

export interface FloatingCartProps {
  /** Items currently in the cart */
  items: FloatingCartItem[]
  /** Total price string (e.g. "€ 42,00") */
  totalPrice?: string
  /** Click on the main FAB (go to checkout etc.) */
  onClick?: () => void
  /** Click on a specific item */
  onItemClick?: (id: string) => void
  /** Remove an item */
  onItemRemove?: (id: string) => void
  /** Accent color for the FAB */
  fabColor?: string
  /** Text color on the FAB */
  fabTextColor?: string
  /** Maximum visible item thumbnails (default: 4) */
  maxVisible?: number
  /** Custom cart icon (default: built-in SVG) */
  icon?: ReactNode
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function FloatingCart({
  items,
  totalPrice,
  onClick,
  onItemClick,
  onItemRemove,
  fabColor = 'var(--accent, #6366f1)',
  fabTextColor = '#fff',
  maxVisible = 4,
  icon,
  className,
  style,
}: FloatingCartProps) {
  const totalCount = items.reduce((sum, item) => sum + (item.count ?? 1), 0)
  const [visible, setVisible] = useState(false)
  const [badgeBump, setBadgeBump] = useState(false)
  const prevCount = useRef(0)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [countAnim, setCountAnim] = useState<Record<string, 'up' | 'down' | null>>({})

  // Show/hide FAB based on item count. The synchronous setVisible(true)
  // could be derived from `totalCount > 0`, but the hide path needs a
  // 300ms delay (post-removal animation), so we keep both transitions
  // in one effect to share state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (totalCount > 0 && !visible) setVisible(true)
    if (totalCount === 0 && visible) {
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [totalCount, visible])

  // Badge bump when count changes
  useEffect(() => {
    if (totalCount !== prevCount.current && totalCount > 0) {
      setBadgeBump(true)
      const t = setTimeout(() => setBadgeBump(false), 350)
      prevCount.current = totalCount
      return () => clearTimeout(t)
    }
    prevCount.current = totalCount
  }, [totalCount])

  // Track count changes per item for fadeDown/fadeUp animations
  const prevItemCounts = useRef<Record<string, number>>({})
  useEffect(() => {
    for (const item of items) {
      const prev = prevItemCounts.current[item.id] ?? 0
      const curr = item.count ?? 1
      if (curr !== prev && prev > 0) {
        // Count changed — animate: fadeDown then fadeUp
        setCountAnim(a => ({ ...a, [item.id]: 'down' }))
        setTimeout(() => {
          setCountAnim(a => ({ ...a, [item.id]: 'up' }))
        }, 400)
        setTimeout(() => {
          setCountAnim(a => ({ ...a, [item.id]: null }))
        }, 800)
      }
      prevItemCounts.current[item.id] = curr
    }
  }, [items])

  const handleRemove = (id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      setRemovingId(null)
      onItemRemove?.(id)
    }, 200)
  }

  if (!visible && totalCount === 0) return null

  const displayItems = items.slice(-maxVisible)

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        paddingBottom: '68px',
        ...style,
      }}
    >
      {/* Stacked product items (Quickbeam-style circles) */}
      {displayItems.map((item) => {
        const isRemoving = removingId === item.id
        const isHovered = hoveredId === item.id
        const itemCount = item.count ?? 1
        const animState = countAnim[item.id]

        return (
          <div
            key={item.id}
            style={{
              position: 'relative',
              marginBottom: '0px',
              animation: isRemoving
                ? 'fc-remove-product 200ms ease-in-out forwards'
                : 'fc-item-in 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Product circle (60×60, image fills) */}
            <div
              onClick={() => onItemClick?.(item.id)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: 'rgba(0, 0, 0, 0.23) 0 6px 13px 0',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 1s ease-in-out',
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.label ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--card, #141416)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--muted-foreground, #71717a)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    padding: '4px',
                  }}>
                    {item.label ?? '?'}
                  </span>
                </div>
              )}

              {/* Overlay .s1 – shows price (default visible) */}
              <span style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'rgba(22, 22, 26, 0.5)',
                color: '#fff',
                display: isHovered ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'default',
                textAlign: 'center',
                padding: '4px',
              }}>
                {item.label ?? ''}
              </span>

              {/* Overlay .s2 – shows variant info on hover */}
              {isHovered && (
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'rgba(22, 22, 26, 0.5)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'default',
                  textAlign: 'center',
                  padding: '4px',
                }}>
                  {item.count && item.count > 1 ? `×${item.count}` : item.label ?? ''}
                </span>
              )}
            </div>

            {/* Count badge (Quickbeam: fadeDown/fadeUp on change) */}
            {itemCount > 1 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                minWidth: '20px',
                height: '20px',
                borderRadius: '10px',
                background: 'var(--background, #16161a)',
                color: 'var(--foreground, #fff)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 4px 0',
                textAlign: 'center',
                overflow: 'hidden',
                zIndex: 10,
                opacity: animState === 'down' ? 0 : 1,
                animation: animState === 'down'
                  ? 'fc-fade-down 400ms ease-in-out'
                  : animState === 'up'
                    ? 'fc-fade-up 400ms ease-in-out'
                    : 'none',
              }}>
                {itemCount}
              </span>
            )}

            {/* Remove button (×) – visible on hover, slides left like Quickbeam */}
            {onItemRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(item.id) }}
                aria-label={`${item.label ?? 'Artikel'} entfernen`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--background, #16161a)',
                  border: 'none',
                  color: 'var(--foreground, #fff)',
                  cursor: 'pointer',
                  display: isHovered ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  lineHeight: 1,
                  padding: 0,
                  zIndex: 10,
                  transition: 'background 300ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = fabColor)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--background, #16161a)')}
              >
                ×
              </button>
            )}
          </div>
        )
      })}

      {/* Main FAB button (Quickbeam: swing-in from right with rotation) */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`Warenkorb – ${totalCount} Artikel`}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: `2px solid ${fabColor}`,
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          boxShadow: 'rgba(0, 0, 0, 0.23) 0 6px 13px 0',
          animation: totalCount > 0
            ? 'fc-show 1s ease-in-out forwards'
            : 'fc-hide 200ms ease-in forwards',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--foreground, #303030)'
          const inner = e.currentTarget.firstElementChild as HTMLElement
          if (inner) inner.style.background = 'var(--foreground, #303030)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = fabColor
          const inner = e.currentTarget.firstElementChild as HTMLElement
          if (inner) inner.style.background = fabColor
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: fabColor,
            border: '2px solid var(--card, #fff)',
            transition: 'background 300ms ease',
            color: fabTextColor,
          }}
        >
          {icon ?? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
        </span>

        {/* Total price / count badge */}
        <span
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '11px',
            background: 'var(--background, #0a0a0b)',
            color: 'var(--foreground, #e4e4e7)',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            whiteSpace: 'nowrap',
            display: 'block',
            height: '20px',
            lineHeight: '16px',
            animation: badgeBump ? 'fc-badge-bump 300ms ease' : 'none',
          }}
        >
          {totalPrice ?? totalCount}
        </span>
      </button>
    </div>
  )
}
