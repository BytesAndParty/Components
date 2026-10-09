import { useRef, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { NumberTicker } from '@components/number-ticker/number-ticker'

/**
 * Kennzahl, die beim Einscrollen auf ihren Wert rollt (Style-Guide §7: „Count-up
 * der Kennzahlen"). NumberTicker animiert nur Stellen, die schon da sind — von 0
 * aus würden die neuen Stellen ohne Bewegung erscheinen. Der Startwert hat darum
 * dieselbe Stellenzahl und an jeder Stelle eine andere Ziffer, so rollt jede Säule.
 *
 * Immer Normalziffern: NumberTicker zeigt jede Ziffer in einer 1-em-Zelle.
 * Mediävalziffern (Cormorant, Goudy) ragen mit Ober- und Unterlängen hinaus,
 * dann blitzen Teile der Nachbarziffern im Fenster auf.
 */
function scrambled(value: number) {
  const digits = String(Math.round(Math.abs(value))).split('')
  return Number(
    digits
      .map((d, i) => {
        const shifted = (Number(d) + 5) % 10
        // Keine führende Null, sonst fiele eine Stelle weg.
        return i === 0 && shifted === 0 && digits.length > 1 ? 1 : shifted
      })
      .join('')
  )
}

export function CountUp({
  value,
  pad = 0,
  duration = 1400,
  className,
  style,
}: {
  value: number
  /** Mindeststellen, aufgefüllt mit führenden Nullen („07"). */
  pad?: number
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const lead = '0'.repeat(Math.max(0, pad - String(value).length))

  return (
    <span ref={ref} className={className}>
      {/* Screenreader lesen immer den Zielwert, nie den Startwert. */}
      <span className="sr-only">
        {lead}
        {value}
      </span>
      <span aria-hidden="true" style={{ fontVariantNumeric: 'lining-nums' }}>
        {lead}
        <NumberTicker
          value={inView || reduce ? value : scrambled(value)}
          duration={duration}
          style={{ fontVariantNumeric: 'lining-nums tabular-nums', ...style }}
        />
      </span>
    </span>
  )
}
