import { useState, useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────
// Keyframes: atc-cart → showcase/src/styles.css (standalone: see COMPONENT.md)

export interface AddToCartButtonProps {
  children?: ReactNode
  /** Called when the button is clicked (fires at animation start) */
  onClick?: () => void
  /** Full animation duration in ms (default: 3700) */
  duration?: number
  /** Button background color */
  bgColor?: string
  /** Text / icon color */
  textColor?: string
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * Animated Add-to-Cart button inspired by Aaron Iker (Dribbble).
 *
 * Click triggers a multi-stage animation:
 * 1. Text slides up, plus icon rotates
 * 2. Cart SVG rolls in from left
 * 3. Cart "fills up"
 * 4. Checkmark draws in
 * 5. Cart rolls out to right
 * 6. Button resets to idle
 */
export function AddToCartButton({
  children = 'Add to cart',
  onClick,
  duration = 3700,
  bgColor = 'var(--accent, #6366f1)',
  textColor = '#fff',
  className,
  style,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleClick = useCallback(() => {
    if (loading) return
    setLoading(true)
    onClick?.()
    timerRef.current = setTimeout(() => setLoading(false), duration)
  }, [loading, onClick, duration])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={{
        position: 'relative',
        border: 'none',
        background: bgColor,
        padding: '8px 28px',
        borderRadius: '8px',
        cursor: loading ? 'default' : 'pointer',
        textAlign: 'center',
        minWidth: '144px',
        color: textColor,
        overflow: 'hidden',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        transform: `scale(${loading ? 0.95 : 1})`,
        transition: 'transform .4s cubic-bezier(.36, 1.01, .32, 1.27)',
        fontFamily: 'inherit',
        WebkitAppearance: 'none' as const,
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {/* Text label + plus icon */}
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          display: 'block',
          position: 'relative',
          paddingLeft: '24px',
          marginLeft: '-8px',
          lineHeight: '26px',
          transform: `translateY(${loading ? '-32px' : '0'})`,
          transition: 'transform .7s ease',
        }}
      >
        {/* Plus icon – vertical bar */}
        <span
          style={{
            position: 'absolute',
            width: '2px',
            height: '14px',
            borderRadius: '1px',
            left: '8px',
            top: '6px',
            background: 'currentColor',
            transform: `scale(.75) rotate(${loading ? '180deg' : '0deg'})`,
            transition: 'transform .65s ease .05s',
          }}
        />
        {/* Plus icon – horizontal bar */}
        <span
          style={{
            position: 'absolute',
            width: '14px',
            height: '2px',
            borderRadius: '1px',
            left: '2px',
            top: '12px',
            background: 'currentColor',
            transform: `scale(.75) rotate(${loading ? '180deg' : '0deg'})`,
            transition: 'transform .65s ease .05s',
          }}
        />
        {children}
      </span>

      {/* Cart assembly (slides in from outside left, fills, checkmark, slides out right) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          margin: '-13px 0 0 -18px',
          transformOrigin: '12px 23px',
          transform: loading ? 'translateX(-120px) rotate(-18deg)' : 'translateX(-120px) rotate(-18deg)',
          animation: loading ? 'atc-cart 3.4s linear forwards .2s' : 'none',
        }}
      >
        {/* Wheels */}
        <span
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            boxShadow: `inset 0 0 0 2px ${textColor}`,
            bottom: 0,
            left: '9px',
            filter: `drop-shadow(11px 0 0 ${textColor})`,
          }}
        />
        {/* Cart fill (scales up when loading) */}
        <span
          style={{
            position: 'absolute',
            width: '16px',
            height: '9px',
            background: textColor,
            left: '9px',
            bottom: '7px',
            transformOrigin: '50% 100%',
            transform: `perspective(4px) rotateX(-6deg) scaleY(${loading ? 1 : 0})`,
            transition: loading
              ? 'transform 1.2s ease .8s'
              : 'transform 0s ease 0s',
          }}
        />
        {/* Cart outline + checkmark */}
        <svg
          width="36"
          height="26"
          viewBox="0 0 36 26"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'block',
            fill: 'none',
            stroke: textColor,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        >
          <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5" />
          <polyline
            points="15 13.5 17 15.5 22 10.5"
            style={{
              stroke: bgColor,
              strokeDasharray: '10px',
              strokeDashoffset: loading ? '0' : '10px',
              transition: loading
                ? 'stroke-dashoffset .4s ease 1.73s'
                : 'stroke-dashoffset 0s ease 0s',
            }}
          />
        </svg>
      </div>
    </button>
  )
}
