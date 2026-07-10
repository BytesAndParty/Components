import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface RevealImageProps {
  /** Image source URL */
  src: string
  /** Alt text — pass '' for purely decorative images */
  alt: string
  /** Wipe-Richtung der Enthüllung (default: 'up') */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Animationsdauer in ms (default: 1200) */
  duration?: number
  /** Verzögerung in ms bevor die Animation startet (default: 0) */
  delay?: number
  /** Start-Skalierung des Bildes für den Gegen-Zoom (default: 1.12) */
  zoom?: number
  /** Animation nur einmal abspielen wenn Element sichtbar wird (default: true) */
  once?: boolean
  /** Klassen für den Wrapper — Größe/Aspect hier setzen (z. B. 'aspect-3/4') */
  className?: string
  /** Klassen für das innere <img> */
  imgClassName?: string
  style?: CSSProperties
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** clip-path inset(top right bottom left) so the image is fully hidden at the
 *  edge opposite to the wipe direction. */
function getInitialClip(direction: RevealImageProps['direction']): string {
  switch (direction) {
    case 'down':  return 'inset(0 0 100% 0)'
    case 'left':  return 'inset(0 0 0 100%)'
    case 'right': return 'inset(0 100% 0 0)'
    case 'up':
    default:      return 'inset(100% 0 0 0)'
  }
}

/** Expo-out — schneller Start, sehr weiches Ausklingen (Editorial-Feel). */
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ─── Component ──────────────────────────────────────────────────────────────────

export function RevealImage({
  src,
  alt,
  direction = 'up',
  duration = 1200,
  delay = 0,
  zoom = 1.12,
  once = true,
  className,
  imgClassName,
  style,
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  // prefers-reduced-motion: Sample once on mount via lazy initial state —
  // matchMedia in render would be impure (react-hooks/purity).
  const [prefersReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [visible, setVisible] = useState(prefersReduced)

  useEffect(() => {
    if (prefersReduced) return

    const el = ref.current
    if (!el) return

    // Reveal immediately when the element is already (partly) in the viewport
    // on mount — spart den ersten Observer-Roundtrip und startet die Animation
    // ohne Frame-Verzögerung. Below-the-fold-Bilder reveaen via Observer.
    const r = el.getBoundingClientRect()
    const alreadyInView = r.top < window.innerHeight && r.bottom > 0
    if (alreadyInView) {
      setVisible(true)
      if (once) return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, prefersReduced])

  const transition = prefersReduced
    ? 'none'
    : `clip-path ${duration}ms ${EASE} ${delay}ms`
  const imgTransition = prefersReduced
    ? 'none'
    : `transform ${duration}ms ${EASE} ${delay}ms`

  // clip-path liegt auf einem INNEREN Wrapper, nicht auf dem beobachteten
  // Element: Chromium rechnet die eigene clip-path in die Intersection ein —
  // inset(100% …) hätte nie eine Intersection und das Reveal würde für
  // Below-the-fold-Bilder niemals starten (Deadlock).
  return (
    <div ref={ref} className={cn('overflow-hidden', className)} style={style}>
      <div
        className="h-full w-full"
        style={{
          clipPath: visible ? 'inset(0 0 0 0)' : getInitialClip(direction),
          transition,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn('block h-full w-full object-cover', imgClassName)}
          style={{
            transform: visible ? 'scale(1)' : `scale(${zoom})`,
            transition: imgTransition,
          }}
        />
      </div>
    </div>
  )
}
