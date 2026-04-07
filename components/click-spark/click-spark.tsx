import { useRef, useCallback, type ReactNode, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ClickSparkProps {
  children: ReactNode
  /** Color of the sparks (default: accent) */
  sparkColor?: string
  /** Size of each spark in px (default: 10) */
  sparkSize?: number
  /** Radius of the spark burst in px (default: 15) */
  sparkRadius?: number
  /** Number of sparks per click (default: 8) */
  sparkCount?: number
  /** Duration of the animation in ms (default: 400) */
  duration?: number
  className?: string
  style?: CSSProperties
}

// ─── Keyframes (injected once) ──────────────────────────────────────────────────

const STYLE_ID = '__click-spark-keyframes__'

function injectKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes click-spark-fly {
      0%   { transform: translate(var(--spark-x, 0), var(--spark-y, 0)) scale(1); opacity: 1; }
      100% { transform: translate(var(--spark-end-x, 0), var(--spark-end-y, 0)) scale(0); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function ClickSpark({
  children,
  sparkColor = 'var(--accent, #6366f1)',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  className,
  style,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      injectKeyframes()

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      for (let i = 0; i < sparkCount; i++) {
        const angle = (360 / sparkCount) * i
        const rad = (angle * Math.PI) / 180
        const endX = Math.cos(rad) * sparkRadius
        const endY = Math.sin(rad) * sparkRadius

        const spark = document.createElement('div')
        spark.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${sparkSize}px;
          height: ${sparkSize}px;
          pointer-events: none;
          z-index: 10;
          --spark-x: 0px;
          --spark-y: 0px;
          --spark-end-x: ${endX}px;
          --spark-end-y: ${endY}px;
          animation: click-spark-fly ${duration}ms ease-out forwards;
        `

        // SVG spark shape
        spark.innerHTML = `
          <svg viewBox="0 0 10 10" width="${sparkSize}" height="${sparkSize}" style="display:block;">
            <circle cx="5" cy="5" r="3" fill="${sparkColor}" />
          </svg>
        `

        containerRef.current.appendChild(spark)
        setTimeout(() => spark.remove(), duration)
      }
    },
    [sparkColor, sparkSize, sparkRadius, sparkCount, duration]
  )

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
