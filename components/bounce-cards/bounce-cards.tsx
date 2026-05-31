import { useRef, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BounceCardsProps {
  /** Array of image URLs */
  images: string[]
  /** Optional array of alt texts */
  alts?: string[]
  /** Base size for the cards in px (default: 200) */
  baseSize?: number
  /** Max translation on hover in px (default: 40) */
  maxTranslation?: number
  /** Overlap factor (0-1, default: 0.5) */
  overlap?: number
  /** Bounce animation duration in ms (default: 500) */
  duration?: number
  /** Elasticity / bounciness (default: 0.6) */
  elasticity?: number
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * Animated "stack" of cards that bounce apart when the container is hovered.
 */
export function BounceCards({
  images,
  alts,
  baseSize = 200,
  maxTranslation = 40,
  overlap = 0.5,
  duration = 500,
  elasticity = 0.6,
  className,
  style,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  function pushSiblings(index: number) {
    cardRefs.current.forEach((card, idx) => {
      if (!card) return
      const diff = idx - index
      const distance = Math.abs(diff)
      const direction = diff > 0 ? 1 : -1

      // Move siblings away from the hovered card based on proximity
      const translation =
        distance === 0
          ? 0
          : (maxTranslation / distance) * direction * (1 - overlap)

      card.style.transition = `transform ${duration}ms cubic-bezier(.17, .67, ${elasticity}, 1.2)`
      card.style.transform = `translateX(${translation}px) scale(${
        distance === 0 ? 1.05 : 1
      })`
      card.style.zIndex = distance === 0 ? '10' : String(5 - distance)
    })
  }

  function resetSiblings() {
    cardRefs.current.forEach((card, idx) => {
      if (!card) return
      card.style.transition = `transform ${duration}ms cubic-bezier(.17, .67, ${elasticity}, 1.2)`
      card.style.transform = `translateX(0) scale(1)`
      card.style.zIndex = String(idx)
    })
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseLeave={resetSiblings}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: baseSize + maxTranslation,
        padding: `0 ${maxTranslation}px`,
        ...style,
      }}
    >
      {images.map((src, idx) => (
        <div
          key={src}
          ref={(el) => {
            cardRefs.current[idx] = el
          }}
          onMouseEnter={() => pushSiblings(idx)}
          style={{
            width: baseSize,
            height: baseSize,
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#2a2a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            marginLeft: idx === 0 ? 0 : -baseSize * overlap,
            zIndex: idx,
            position: 'relative',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}
        >
          <img
            src={src}
            alt={alts?.[idx] ?? ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}
    </div>
  )
}
