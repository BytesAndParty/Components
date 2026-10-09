import { useState } from 'react'
import { cn } from '@components/lib/utils'
import { REBSTOCKMIETE, type BerryColour } from './lineage-graph'

/**
 * Gemeinsame Kleinteile der Stammbaum-Varianten. Lagen vorher als Kopien in
 * lineage-stage + LineageV3 (ColourDot) und LineageV2 + lineage-tree (RebstockCTA).
 */

export function ColourDot({ colour }: { colour: BerryColour }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-2 shrink-0 rounded-full ring-1 ring-inset ring-foreground/25"
      style={{ background: colour === 'red' ? 'oklch(0.48 0.17 18)' : 'oklch(0.85 0.09 92)' }}
    />
  )
}

/** Hinweis auf die Rebstockmiete. `bookable` ergänzt den Vormerken-Knopf (Stammbaum-Ansicht). */
export function RebstockCTA({ bookable = false }: { bookable?: boolean }) {
  const [booked, setBooked] = useState(false)
  return (
    <div className="rounded-xl border border-accent/40 p-4" style={{ background: 'color-mix(in oklch, var(--accent) 8%, transparent)' }}>
      <p className="font-display text-lg font-medium text-foreground">{REBSTOCKMIETE.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{REBSTOCKMIETE.note}</p>
      {bookable ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-accent-readable">{REBSTOCKMIETE.price}</span>
          <button
            type="button"
            onClick={() => setBooked(b => !b)}
            aria-pressed={booked}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-transform duration-200 active:scale-95 motion-reduce:transition-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none',
              booked ? 'border border-accent/50 text-accent' : 'bg-accent text-accent-foreground hover:brightness-110',
            )}
          >
            {booked ? 'Vorgemerkt ✓' : 'Patenschaft →'}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold text-accent-readable">{REBSTOCKMIETE.price}</p>
      )}
    </div>
  )
}
