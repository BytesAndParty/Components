import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────────

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
  style?: React.CSSProperties
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
      className={cn(
        "relative border-none px-7 py-2 rounded-lg text-center min-w-[144px] overflow-hidden",
        "transition-transform duration-400 ease-[cubic-bezier(0.36,1.01,0.32,1.27)]",
        "font-inherit appearance-none [WebkitTapHighlightColor:transparent] [mask-image:-webkit-radial-gradient(white,black)]",
        loading ? "cursor-default scale-95" : "cursor-pointer scale-100",
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
    >
      {/* Text label + plus icon */}
      <span
        className={cn(
          "text-sm font-medium block relative pl-6 -ml-2 leading-[26px] transition-transform duration-700 ease-in-out",
          loading ? "-translate-y-8" : "translate-y-0"
        )}
      >
        {/* Plus icon – vertical bar */}
        <span
          className={cn(
            "absolute w-[2px] height-[14px] rounded-[1px] left-2 top-[6px] bg-current transition-transform duration-[650ms] ease-in-out delay-[50ms]",
            loading ? "scale-75 rotate-180" : "scale-75 rotate-0"
          )}
        />
        {/* Plus icon – horizontal bar */}
        <span
          className={cn(
            "absolute w-[14px] height-[2px] rounded-[1px] left-0.5 top-3 bg-current transition-transform duration-[650ms] ease-in-out delay-[50ms]",
            loading ? "scale-75 rotate-180" : "scale-75 rotate-0"
          )}
        />
        {children}
      </span>

      {/* Cart assembly (slides in from outside left, fills, checkmark, slides out right) */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -mt-[13px] -ml-[18px] origin-[12px_23px] -translate-x-[120px] -rotate-[18deg]",
          loading ? "animate-[atc-cart_3.4s_linear_forwards_0.2s]" : ""
        )}
      >
        {/* Wheels */}
        <span
          className="absolute w-1.5 h-1.5 rounded-full bottom-0 left-[9px]"
          style={{
            boxShadow: `inset 0 0 0 2px ${textColor}`,
            filter: `drop-shadow(11px 0 0 ${textColor})`,
          }}
        />
        {/* Cart fill (scales up when loading) */}
        <span
          className={cn(
            "absolute w-4 h-[9px] left-[9px] bottom-[7px] origin-bottom",
            "perspective-[4px] -rotate-x-6",
            loading ? "scale-y-100 transition-transform duration-[1200ms] ease-in-out delay-[800ms]" : "scale-y-0 transition-transform duration-0"
          )}
          style={{ background: textColor }}
        />
        {/* Cart outline + checkmark */}
        <svg
          width="36"
          height="26"
          viewBox="0 0 36 26"
          className="relative z-10 block fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
          style={{ color: textColor }}
        >
          <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5" />
          <polyline
            points="15 13.5 17 15.5 22 10.5"
            className={cn(
              "[stroke-dasharray:10px] transition-[stroke-dashoffset]",
              loading ? "[stroke-dashoffset:0] duration-400 ease-in-out delay-[1730ms]" : "[stroke-dashoffset:10px] duration-0"
            )}
            style={{ stroke: bgColor }}
          />
        </svg>
      </div>
    </button>
  )
}
