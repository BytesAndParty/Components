import { useState, useEffect, useRef, type CSSProperties } from 'react'

// ─── Keyframes ──────────────────────────────────────────────────────────────────

const STYLE_ID = '__cart-icon-keyframes__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = `
    @keyframes ci-box-add {
      0%   { top: 20%; left: -30%; opacity: 0; }
      25%  { top: -20%; left: 50%; opacity: 1; }
      50%  { top: 0%; left: 70%; }
      75%  { top: 35%; left: 50%; }
      100% { top: 35%; left: 50%; opacity: 0; }
    }
    @keyframes ci-box-remove {
      0%   { top: 35%; left: 50%; opacity: 0; }
      25%  { top: 35%; left: 50%; }
      50%  { top: 0%; left: 70%; opacity: 1; }
      75%  { top: -20%; left: 50%; opacity: 1; }
      100% { top: 20%; left: -30%; opacity: 0; }
    }
    @keyframes ci-badge-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.3); }
      70%  { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    @keyframes ci-badge-in {
      0%   { transform: scale(0); }
      50%  { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
    @keyframes ci-badge-out {
      0%   { transform: scale(1); opacity: 1; }
      100% { transform: scale(0); opacity: 0; }
    }
  `
  document.head.appendChild(s)
}

if (typeof document !== 'undefined') injectStyles()

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

  const badgeAnimValue =
    badgeAnim === 'pop' ? 'ci-badge-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' :
    badgeAnim === 'in' ? 'ci-badge-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1)' :
    badgeAnim === 'out' ? 'ci-badge-out 250ms ease-in forwards' :
    'none'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Warenkorb${displayCount > 0 ? `, ${displayCount} Artikel` : ''}`}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 14,
        height: size + 14,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color,
        ...style,
      }}
    >
      {/* Cart SVG */}
      <svg
        width={size}
        height={size}
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

      {/* Flying box animation */}
      {anim && (
        <span
          style={{
            position: 'absolute',
            width: boxSize,
            height: boxSize,
            opacity: 0,
            pointerEvents: 'none',
            animation: anim === 'add'
              ? 'ci-box-add 1s ease-in-out'
              : 'ci-box-remove 1s ease-in-out',
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </span>
      )}

      {/* Badge */}
      {(displayCount > 0 || badgeAnim === 'out') && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            minWidth: badgeSize,
            height: badgeSize,
            padding: '0 4px',
            borderRadius: badgeSize / 2,
            background: badgeColor,
            color: badgeTextColor,
            fontSize: Math.max(9, Math.round(badgeSize * 0.6)),
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            fontFamily: 'inherit',
            animation: badgeAnimValue,
            pointerEvents: 'none',
          }}
        >
          {displayCount > 99 ? '99+' : displayCount}
        </span>
      )}
    </button>
  )
}
