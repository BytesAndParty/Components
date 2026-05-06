import { useState, useEffect, useRef, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface PixelImageProps {
  /** Image source URL */
  src: string
  /** Alt text */
  alt?: string
  /** Grid configuration */
  grid?: { rows: number; cols: number }
  /** Animate from grayscale to color (default: false) */
  grayscale?: boolean
  /** Animation duration in ms (default: 800) */
  duration?: number
  /** Stagger delay between cells in ms (default: 40) */
  stagger?: number
  /** Trigger animation on scroll into view (default: true) */
  triggerOnView?: boolean
  /** Intersection observer threshold (default: 0.3) */
  threshold?: number
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function PixelImage({
  src,
  alt = '',
  grid = { rows: 4, cols: 6 },
  grayscale = false,
  duration = 800,
  stagger = 40,
  triggerOnView = true,
  threshold = 0.3,
  className,
  style,
}: PixelImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(!triggerOnView)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cellCount = grid.rows * grid.cols

  // Preload image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.src = src
  }, [src])

  // Intersection observer
  useEffect(() => {
    if (!triggerOnView || revealed) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [triggerOnView, revealed, threshold])

  // Generate shuffled reveal order
  const revealOrder = useRef<number[]>([])
  if (revealOrder.current.length !== cellCount) {
    revealOrder.current = Array.from({ length: cellCount }, (_, i) => i)
    // Fisher-Yates shuffle
    for (let i = cellCount - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[revealOrder.current[i], revealOrder.current[j]] = [revealOrder.current[j], revealOrder.current[i]]
    }
  }

  const cells: React.ReactNode[] = []
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const cellIndex = row * grid.cols + col
      const order = revealOrder.current.indexOf(cellIndex)
      const delay = order * stagger

      cells.push(
        <div
          key={cellIndex}
          style={{
            position: 'absolute',
            top: `${(row / grid.rows) * 100}%`,
            left: `${(col / grid.cols) * 100}%`,
            width: `${100 / grid.cols}%`,
            height: `${100 / grid.rows}%`,
            backgroundImage: imageLoaded ? `url(${src})` : 'none',
            backgroundSize: `${grid.cols * 100}% ${grid.rows * 100}%`,
            backgroundPosition: `${(col / (grid.cols - 1)) * 100}% ${(row / (grid.rows - 1)) * 100}%`,
            opacity: revealed ? 1 : 0,
            filter: revealed
              ? grayscale ? 'none' : 'none'
              : grayscale ? 'grayscale(1)' : 'none',
            transition: `opacity ${duration}ms ease ${delay}ms, filter ${duration}ms ease ${delay}ms`,
          }}
        />
      )
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={alt}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Hidden image for accessibility */}
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      {cells}
    </div>
  )
}
