import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// ─── Keyframes ──────────────────────────────────────────────────────────────────

const STYLE_ID = '__floating-cart-keyframes__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = `
    @keyframes fc-show {
      0%   { transform: rotate(70deg); right: -100px; }
      50%  { transform: rotate(-20deg); right: 20px; }
      100% { transform: rotate(0deg); right: 0; }
    }
    @keyframes fc-hide {
      0%   { transform: translateX(0); }
      100% { transform: translateX(200px); }
    }
    @keyframes fc-item-in {
      0%   { transform: scale(0) rotate(10deg); opacity: 0; }
      60%  { transform: scale(1.15) rotate(-3deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes fc-item-out {
      0%   { transform: scale(1); opacity: 1; }
      40%  { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
      100% { transform: scale(0) rotate(-10deg); opacity: 0; }
    }
    @keyframes fc-badge-bump {
      0%   { transform: translateX(-50%) scale(1); }
      50%  { transform: translateX(-50%) scale(1.3); }
      100% { transform: translateX(-50%) scale(1); }
    }
  `
  document.head.appendChild(s)
}

if (typeof document !== 'undefined') injectStyles()

// ─── Types ──────────────────────────────────────────────────────────────────────

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

  // Show/hide FAB based on item count
  useEffect(() => {
    if (totalCount > 0 && !visible) setVisible(true)
    if (totalCount === 0 && visible) {
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [totalCount, visible])

  // Badge bump when count changes
  useEffect(() => {
    if (totalCount > prevCount.current) {
      setBadgeBump(true)
      const t = setTimeout(() => setBadgeBump(false), 350)
      prevCount.current = totalCount
      return () => clearTimeout(t)
    }
    prevCount.current = totalCount
  }, [totalCount])

  const handleRemove = (id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      setRemovingId(null)
      onItemRemove?.(id)
    }, 300)
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
      {/* Stacked item thumbnails */}
      {displayItems.map((item) => {
        const isRemoving = removingId === item.id
        return (
          <div
            key={item.id}
            style={{
              position: 'relative',
              animation: isRemoving
                ? 'fc-item-out 300ms ease-in forwards'
                : 'fc-item-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            <div
              onClick={() => onItemClick?.(item.id)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: 'rgba(0, 0, 0, 0.23) 0 6px 13px 0',
                cursor: 'pointer',
                border: '2px solid var(--card, #fff)',
                background: 'var(--card, #141416)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.label ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted, #71717a)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  padding: '4px',
                }}>
                  {item.label ?? '?'}
                </span>
              )}
            </div>

            {/* Count badge per item */}
            {(item.count ?? 1) > 1 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                background: 'var(--bg, #0a0a0b)',
                color: 'var(--text, #e4e4e7)',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid var(--card, #141416)',
              }}>
                {item.count}
              </span>
            )}

            {/* Remove button */}
            {onItemRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(item.id) }}
                aria-label={`Remove ${item.label ?? 'item'}`}
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--bg, #0a0a0b)',
                  border: '2px solid var(--card, #141416)',
                  color: 'var(--text, #e4e4e7)',
                  cursor: 'pointer',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  lineHeight: 1,
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent, #6366f1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg, #0a0a0b)')}
              >
                ×
              </button>
            )}
          </div>
        )
      })}

      {/* Main FAB */}
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
          animation: totalCount > 0
            ? 'fc-show 800ms ease-in-out forwards'
            : 'fc-hide 200ms ease-in forwards',
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
            background: 'var(--bg, #0a0a0b)',
            color: 'var(--text, #e4e4e7)',
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
