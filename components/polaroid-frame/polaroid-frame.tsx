import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, type Variants } from 'motion/react'
import { ImageOff } from 'lucide-react'
import { cn } from '../lib/utils'
import { useDeviceCapabilities } from '../lib/use-device-capabilities'
import { PAPER, WASHI, paperGrain } from '../lib/scrapbook'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PolaroidFrameProps {
  /** Bild-URL. */
  src: string
  /** Alt-Text. Pflicht; leer (`''`) nur bei rein dekorativem Foto. */
  alt: string
  /** Text auf dem breiten Rahmenfuß, in Handschrift (Caveat). Ohne Caption bleibt der Fuß leer. */
  caption?: ReactNode
  /** Drehung in Grad. */
  rotate?: number
  /** Washi-Tape mittig oben. */
  tape?: boolean
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

// Etwas weißer als das Creme-Papier: Polaroid-Rahmen sind Fotokarton, kein Notizpapier.
const FRAME = 'oklch(0.975 0.012 88)'
const GRAIN = paperGrain(0.85, 2, 0.1, 180)

// Schrift lädt die App selbst (self-hosted via @fontsource), siehe COMPONENT.md.
const FONT = "'Caveat', cursive"

const SPRING = { type: 'spring', stiffness: 150, damping: 20 } as const
const SNAPPY = { type: 'spring', stiffness: 300, damping: 30 } as const

// leading hier statt am Wrapper: ein text-*-Override per className würde es sonst per tailwind-merge entfernen.
const FOOT = 'flex min-h-[4.6rem] items-center justify-center px-1 py-2 text-center leading-[1.05]'

// ─── Component ──────────────────────────────────────────────────────────────

export function PolaroidFrame({
  src,
  alt,
  caption,
  rotate = 1.5,
  tape = false,
  className,
  style,
}: PolaroidFrameProps) {
  const { hasFinePointer, prefersReducedMotion: reduce } = useDeviceCapabilities()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  // Merkt sich die fehlgeschlagene URL statt eines Booleans: ein neues src setzt den Fallback ohne Effekt zurück.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc === src
  // Bei SSR kann das Bild schon vor der Hydration gescheitert sein, dann kam onError nie an.
  // src neu setzen lässt den Browser das Ergebnis erneut melden, jetzt mit Listener.
  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth === 0) img.src = src
  }, [src])

  const motionVariants: Variants = {
    hidden: { opacity: 0, y: -12, rotate: rotate + 5 },
    shown: { opacity: 1, y: 0, rotate, scale: 1, transition: SPRING },
    // Hover richtet das Foto gerade, als würde man es in die Hand nehmen.
    lift: { rotate: 0, scale: 1.03, transition: SNAPPY },
  }

  return (
    // Der Wrapper bleibt untransformiert: Hover-Fläche und Sichtbarkeits-Messung wandern nicht mit der
    // Drehung, sonst flackert der Hover an den Ecken. Die Variants vererben sich an die figure.
    <motion.div
      ref={ref}
      className={cn('relative w-64 text-[1.55rem]', className)}
      style={{ fontFamily: FONT, ...style }}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'shown' : 'hidden'}
      whileHover={hasFinePointer && !reduce ? 'lift' : undefined}
    >
      <motion.figure className="relative" variants={motionVariants}>
        <div
          className="px-3 pt-3"
          style={{
            color: PAPER.cream.ink,
            backgroundColor: FRAME,
            backgroundImage: GRAIN,
            backgroundBlendMode: 'multiply',
            boxShadow: '0 12px 22px -6px oklch(0.2 0.03 60 / 0.35), 0 2px 3px oklch(0.2 0.03 60 / 0.25)',
          }}
        >
          {/* Fläche hält das Quadrat, solange das Bild lädt. Lädt es nicht, bleibt das Polaroid „unentwickelt". */}
          <div className="relative aspect-square bg-[oklch(0.88_0.012_80)]">
            {failed ? (
              <div
                {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
                className="flex size-full flex-col items-center justify-center gap-2.5 px-6 text-center font-sans text-[0.7rem] leading-snug"
                style={{
                  color: PAPER.dark.ink,
                  background: 'radial-gradient(circle at 50% 42%, oklch(0.38 0.02 75), oklch(0.26 0.018 62))',
                }}
              >
                <ImageOff aria-hidden size={26} strokeWidth={1.25} className="opacity-50" />
                {alt && <span aria-hidden className="opacity-65">{alt}</span>}
              </div>
            ) : (
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onError={() => setFailedSrc(src)}
                className="size-full object-cover font-sans text-xs"
                style={{ filter: 'saturate(0.92) contrast(1.04)' }}
              />
            )}
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{ boxShadow: 'inset 0 0 0 1px oklch(0 0 0 / 0.14), inset 0 0 18px oklch(0 0 0 / 0.12)' }}
            />
          </div>
          {/* Inneres span: sonst würde jedes Kind einer ReactNode-Caption ein eigenes Flex-Item */}
          {caption ? (
            <figcaption className={FOOT}>
              <span>{caption}</span>
            </figcaption>
          ) : (
            <div aria-hidden="true" className={FOOT} />
          )}
        </div>
        {tape && (
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-6.5 w-26"
            style={{ transform: 'translateX(-50%) rotate(-4deg)', ...WASHI }}
          />
        )}
      </motion.figure>
    </motion.div>
  )
}
