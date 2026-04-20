import { useEffect, useRef, useState, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MorphingTextProps {
  /** Array von Texten, die zyklisch ineinander überblenden */
  texts: string[]
  /** Anzeigedauer pro Text in ms (default: 2000) */
  duration?: number
  className?: string
  style?: CSSProperties
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * Zwei überlagerte Spans blenden gegenläufig via `filter: blur` + `opacity`
 * ineinander über – kein Framer Motion, natives CSS.
 *
 * prefers-reduced-motion: einfaches Cross-Fade ohne Blur.
 */
export function MorphingText({
  texts,
  duration = 2000,
  className,
  style,
}: MorphingTextProps) {
  const [index, setIndex] = useState(0)
  const [morphing, setMorphing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (texts.length <= 1) return

    // Morphing-Phase: ca. 600ms vor dem Textwechsel starten
    const morphDuration = prefersReduced ? 0 : 600

    timerRef.current = setTimeout(() => {
      setMorphing(true)

      setTimeout(() => {
        setIndex(prev => (prev + 1) % texts.length)
        setMorphing(false)
      }, morphDuration)
    }, duration - morphDuration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [index, texts, duration, prefersReduced])

  const nextIndex = (index + 1) % texts.length

  // Überblend-Stile: aktueller Text faded aus, nächster faded ein
  const currentStyle: CSSProperties = morphing
    ? {
        opacity: 0,
        filter: prefersReduced ? 'none' : 'blur(8px)',
        transition: `opacity 600ms ease, filter 600ms ease`,
      }
    : {
        opacity: 1,
        filter: 'blur(0px)',
        transition: `opacity 600ms ease, filter 600ms ease`,
      }

  const nextStyle: CSSProperties = morphing
    ? {
        opacity: 1,
        filter: 'blur(0px)',
        transition: `opacity 600ms ease, filter 600ms ease`,
      }
    : {
        opacity: 0,
        filter: prefersReduced ? 'none' : 'blur(8px)',
        transition: 'none', // kein Fade beim Reset
      }

  return (
    <span
      className={className}
      style={{
        display: 'inline-grid',
        ...style,
      }}
    >
      {/* Beide Spans überlagert auf demselben Grid-Slot */}
      <span style={{ gridArea: '1 / 1', ...currentStyle }}>
        {texts[index]}
      </span>
      <span style={{ gridArea: '1 / 1', ...nextStyle }} aria-hidden>
        {texts[nextIndex]}
      </span>
    </span>
  )
}
