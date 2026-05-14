import { useEffect, useRef, useCallback, type CSSProperties } from 'react'
import { animate, stagger } from 'motion/react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BounceCardsProps {
  /** Array of image URLs to display */
  images: string[]
  /** Width of the container in px */
  containerWidth?: number
  /** Height of the container in px */
  containerHeight?: number
  /** Delay before the entrance animation starts (seconds) */
  animationDelay?: number
  /** Stagger between each card's entrance animation (seconds) */
  animationStagger?: number
  /** Custom CSS transform strings for each card position */
  transformStyles?: string[]
  /** Optional per-image alt texts. Empty/missing means decorative. */
  alts?: string[]
  /** Enable hover interaction that pushes siblings apart */
  enableHover?: boolean
  /** Additional CSS class */
  className?: string
  /** Additional inline styles for the container */
  style?: CSSProperties
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getNoRotationTransform(transformStr: string): string {
  if (/rotate\([\s\S]*?\)/.test(transformStr)) {
    return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)')
  }
  return transformStr === 'none' ? 'rotate(0deg)' : `${transformStr} rotate(0deg)`
}

function getPushedTransform(baseTransform: string, offsetX: number): string {
  const translateRegex = /translate\(([-0-9.]+)px\)/
  const match = baseTransform.match(translateRegex)
  if (match) {
    const newX = parseFloat(match[1]) + offsetX
    return baseTransform.replace(translateRegex, `translate(${newX}px)`)
  }
  return baseTransform === 'none'
    ? `translate(${offsetX}px)`
    : `${baseTransform} translate(${offsetX}px)`
}

// Spring-Profile statt GSAP-Easings:
// - ENTRANCE: niedriges Damping → spürbares Federn (≈ "elastic.out")
// - HOVER:    snappy, geringe Schwingung (≈ "back.out(1.4)")
const ENTRANCE_SPRING = { type: 'spring' as const, stiffness: 100, damping: 9 }
const HOVER_SPRING = { type: 'spring' as const, stiffness: 280, damping: 22 }

const PUSH_DISTANCE = 160
const PUSH_STAGGER = 0.05

// ─── Component ──────────────────────────────────────────────────────────────────

export function BounceCards({
  images,
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)',
  ],
  enableHover = true,
  alts,
  className,
  style,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Entrance animation: scale-Property animieren, transform bleibt unangetastet.
  // CSS `scale` und `transform` sind separate Properties — sie komponieren
  // ohne sich gegenseitig zu überschreiben.
  //
  // Keyframes [0, 1] statt manueller `style.scale = '0'`-Mutation: wenn
  // animate() aus irgendeinem Grund nicht feuert (HMR / strict-mode double
  // mount mit cleanup-Race), bleiben die Karten so nicht permanent unsichtbar.
  useEffect(() => {
    if (!containerRef.current) return
    const cards = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[data-bounce-card]')
    )
    if (cards.length === 0) return

    const controls = animate(
      cards,
      { scale: [0, 1] },
      {
        delay: stagger(animationStagger, { startDelay: animationDelay }),
        ...ENTRANCE_SPRING,
      }
    )

    return () => controls.stop()
  }, [animationStagger, animationDelay])

  const pushSiblings = useCallback(
    (hoveredIdx: number) => {
      if (!enableHover || !containerRef.current) return

      images.forEach((_, i) => {
        const target = containerRef.current!.querySelector<HTMLElement>(`[data-bounce-card="${i}"]`)
        if (!target) return

        const baseTransform = transformStyles[i] || 'none'

        if (i === hoveredIdx) {
          animate(
            target,
            { transform: getNoRotationTransform(baseTransform) },
            HOVER_SPRING
          )
        } else {
          const offsetX = i < hoveredIdx ? -PUSH_DISTANCE : PUSH_DISTANCE
          const distance = Math.abs(hoveredIdx - i)
          animate(
            target,
            { transform: getPushedTransform(baseTransform, offsetX) },
            { ...HOVER_SPRING, delay: distance * PUSH_STAGGER }
          )
        }
      })
    },
    [enableHover, images, transformStyles]
  )

  const resetSiblings = useCallback(() => {
    if (!enableHover || !containerRef.current) return

    images.forEach((_, i) => {
      const target = containerRef.current!.querySelector<HTMLElement>(`[data-bounce-card="${i}"]`)
      if (!target) return
      animate(target, { transform: transformStyles[i] || 'none' }, HOVER_SPRING)
    })
  }, [enableHover, images, transformStyles])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight,
        ...style,
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          data-bounce-card={idx}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            width: '60%',
            aspectRatio: '3 / 4',
            borderRadius: '12px',
            overflow: 'hidden',
            transform: transformStyles[idx] ?? 'none',
            transformOrigin: 'center center',
            cursor: enableHover ? 'pointer' : 'default',
            transition: 'box-shadow 0.3s',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
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
