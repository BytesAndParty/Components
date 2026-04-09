import { useEffect, useRef, useCallback, type CSSProperties } from 'react'
import { gsap } from 'gsap'

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
  /** GSAP easing function string */
  easeType?: string
  /** Custom CSS transform strings for each card position */
  transformStyles?: string[]
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

// ─── Component ──────────────────────────────────────────────────────────────────

export function BounceCards({
  images,
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)',
  ],
  enableHover = true,
  className,
  style,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll<HTMLElement>('[data-bounce-card]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [animationStagger, easeType, animationDelay])

  const pushSiblings = useCallback(
    (hoveredIdx: number) => {
      if (!enableHover || !containerRef.current) return

      images.forEach((_, i) => {
        const target = containerRef.current!.querySelector<HTMLElement>(`[data-bounce-card="${i}"]`)
        if (!target) return
        gsap.killTweensOf(target)

        const baseTransform = transformStyles[i] || 'none'

        if (i === hoveredIdx) {
          gsap.to(target, {
            transform: getNoRotationTransform(baseTransform),
            duration: 0.4,
            ease: 'back.out(1.4)',
            overwrite: 'auto',
          })
        } else {
          const offsetX = i < hoveredIdx ? -160 : 160
          const distance = Math.abs(hoveredIdx - i)
          gsap.to(target, {
            transform: getPushedTransform(baseTransform, offsetX),
            duration: 0.4,
            ease: 'back.out(1.4)',
            delay: distance * 0.05,
            overwrite: 'auto',
          })
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
      gsap.killTweensOf(target)
      gsap.to(target, {
        transform: transformStyles[i] || 'none',
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      })
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
            alt={`card-${idx}`}
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
