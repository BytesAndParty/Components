import { useEffect, useRef, useState, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MorphingTextProps {
  /** Array von Texten, die zyklisch ineinander überblenden */
  texts: string[]
  /** Anzeigedauer pro Text in ms (default: 4000) */
  duration?: number
  /** Dauer des Blur-Übergangs in ms (default: 800) */
  morphDuration?: number
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
  duration = 4000,
  morphDuration = 800,
  className,
  style,
}: MorphingTextProps) {
  const [index, setIndex] = useState(0)
  const [morphing, setMorphing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const activeMorphDuration = prefersReduced ? 0 : morphDuration

  useEffect(() => {
    if (texts.length <= 1) return

    timerRef.current = setTimeout(() => {
      setMorphing(true)

      setTimeout(() => {
        setIndex(prev => (prev + 1) % texts.length)
        setMorphing(false)
      }, activeMorphDuration)
    }, duration - activeMorphDuration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [index, texts, duration, activeMorphDuration])

  const nextIndex = (index + 1) % texts.length

  const transition = `opacity ${activeMorphDuration}ms ease, filter ${activeMorphDuration}ms ease`

  // Aktueller Text: sofort sichtbar (kein Fade-In beim Index-Wechsel), faded bei Morph aus
  const currentStyle: CSSProperties = morphing
    ? { opacity: 0, filter: 'blur(10px)', transition }
    : { opacity: 1, filter: 'blur(0px)', transition: 'none' }

  // Nächster Text: sofort unsichtbar, faded bei Morph ein
  const nextStyle: CSSProperties = morphing
    ? { opacity: 1, filter: 'blur(0px)', transition }
    : { opacity: 0, filter: 'blur(10px)', transition: 'none' }

  return (
    <span
      className={className}
      style={{ display: 'inline-grid', ...style }}
    >
      {/* Unsichtbare Sizer-Spans: Grid-Breite = breitester Text → kein Layout-Sprung */}
      {texts.map((t, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            gridArea: '1 / 1',
            visibility: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {t}
        </span>
      ))}
      <span style={{ gridArea: '1 / 1', ...currentStyle }}>{texts[index]}</span>
      <span style={{ gridArea: '1 / 1', ...nextStyle }} aria-hidden>
        {texts[nextIndex]}
      </span>
    </span>
  )
}
