import { REBSTOCKMIETE, type BerryColour } from './lineage-graph'

/**
 * Gemeinsame Kleinteile der Stammbaum-Varianten (ColourDot in lineage-stage und
 * LineageV3, RebstockCTA in LineageV2).
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

/** Hinweis auf die Rebstockmiete. */
export function RebstockCTA() {
  return (
    <div className="rounded-xl border border-accent/40 p-4" style={{ background: 'color-mix(in oklch, var(--accent) 8%, transparent)' }}>
      <p className="font-display text-lg font-medium text-foreground">{REBSTOCKMIETE.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{REBSTOCKMIETE.note}</p>
      <p className="mt-3 text-sm font-semibold text-accent-readable">{REBSTOCKMIETE.price}</p>
    </div>
  )
}
