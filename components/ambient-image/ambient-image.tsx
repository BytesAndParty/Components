import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface AmbientImageProps {
  /** Image source URL */
  src: string
  /** Alt text */
  alt?: string
  /** Blur radius for the ambient glow in px (default: 40) */
  blur?: number
  /** Glow intensity / opacity (default: 0.6) */
  intensity?: number
  /** How far the glow extends beyond the image in px (default: 20) */
  spread?: number
  /** Border radius for both image and glow (default: '12px') */
  borderRadius?: string | number
  /** Animate the glow fade-in (default: true) */
  animated?: boolean
  className?: string
  style?: CSSProperties
}

// ─── Helper: extract edge colors from image ─────────────────────────────────────

function extractEdgeColors(
  img: HTMLImageElement,
  samples: number = 12
): { top: string; right: string; bottom: string; left: string } {
  const canvas = document.createElement('canvas')
  // Sample at reduced resolution for performance
  const size = 64
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return fallback()

  try {
    ctx.drawImage(img, 0, 0, size, size)
  } catch {
    return fallback()
  }

  const data = ctx.getImageData(0, 0, size, size).data

  function avgColor(pixels: [number, number][]) {
    let r = 0, g = 0, b = 0, count = 0
    for (const [x, y] of pixels) {
      const i = (y * size + x) * 4
      // Skip very dark or transparent pixels
      if (data[i + 3] < 128) continue
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }
    if (count === 0) return 'rgba(100,100,100,0.5)'
    return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
  }

  const step = Math.max(1, Math.floor(size / samples))
  const edgeDepth = Math.max(2, Math.floor(size * 0.15))

  // Sample edge regions
  const topPixels: [number, number][] = []
  const bottomPixels: [number, number][] = []
  const leftPixels: [number, number][] = []
  const rightPixels: [number, number][] = []

  for (let i = 0; i < size; i += step) {
    for (let d = 0; d < edgeDepth; d += 2) {
      topPixels.push([i, d])
      bottomPixels.push([i, size - 1 - d])
      leftPixels.push([d, i])
      rightPixels.push([size - 1 - d, i])
    }
  }

  return {
    top: avgColor(topPixels),
    right: avgColor(rightPixels),
    bottom: avgColor(bottomPixels),
    left: avgColor(leftPixels),
  }
}

function fallback() {
  const c = 'rgba(100,100,100,0.5)'
  return { top: c, right: c, bottom: c, left: c }
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function AmbientImage({
  src,
  alt = '',
  blur = 40,
  intensity = 0.6,
  spread = 20,
  borderRadius = '12px',
  animated = true,
  className,
  style,
}: AmbientImageProps) {
  const [colors, setColors] = useState<ReturnType<typeof extractEdgeColors> | null>(null)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleLoad = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    setLoaded(true)

    // Use a small delay to ensure the image is rendered
    requestAnimationFrame(() => {
      const edgeColors = extractEdgeColors(img)
      setColors(edgeColors)
    })
  }, [])

  // Re-extract when src changes
  useEffect(() => {
    setColors(null)
    setLoaded(false)
  }, [src])

  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius
  const showGlow = loaded && colors !== null

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {/* Glow layers – one per edge */}
      {showGlow && (
        <>
          {/* Top glow */}
          <div
            style={{
              position: 'absolute',
              top: `-${spread}px`,
              left: '10%',
              right: '10%',
              height: '40%',
              background: colors.top,
              filter: `blur(${blur}px)`,
              opacity: animated ? (showGlow ? intensity : 0) : intensity,
              transition: animated ? 'opacity 600ms ease' : 'none',
              pointerEvents: 'none',
              zIndex: 0,
              borderRadius: resolvedRadius,
            }}
          />
          {/* Bottom glow */}
          <div
            style={{
              position: 'absolute',
              bottom: `-${spread}px`,
              left: '10%',
              right: '10%',
              height: '40%',
              background: colors.bottom,
              filter: `blur(${blur}px)`,
              opacity: animated ? (showGlow ? intensity : 0) : intensity,
              transition: animated ? 'opacity 600ms ease' : 'none',
              pointerEvents: 'none',
              zIndex: 0,
              borderRadius: resolvedRadius,
            }}
          />
          {/* Left glow */}
          <div
            style={{
              position: 'absolute',
              left: `-${spread}px`,
              top: '10%',
              bottom: '10%',
              width: '40%',
              background: colors.left,
              filter: `blur(${blur}px)`,
              opacity: animated ? (showGlow ? intensity : 0) : intensity,
              transition: animated ? 'opacity 600ms ease' : 'none',
              pointerEvents: 'none',
              zIndex: 0,
              borderRadius: resolvedRadius,
            }}
          />
          {/* Right glow */}
          <div
            style={{
              position: 'absolute',
              right: `-${spread}px`,
              top: '10%',
              bottom: '10%',
              width: '40%',
              background: colors.right,
              filter: `blur(${blur}px)`,
              opacity: animated ? (showGlow ? intensity : 0) : intensity,
              transition: animated ? 'opacity 600ms ease' : 'none',
              pointerEvents: 'none',
              zIndex: 0,
              borderRadius: resolvedRadius,
            }}
          />
        </>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        onLoad={handleLoad}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: resolvedRadius,
          zIndex: 1,
        }}
      />
    </div>
  )
}
