import type { WineCardData } from './types'

export interface WineCardEditorialProps {
  wine: WineCardData
  /** Bild-Signatur unten links, z. B. "Platte XII · Riede Loibenberg" */
  plate?: string
  /** Fiche-Nummer oben rechts, z. B. "№ 4 / 18" */
  fiche?: string
  onSelect?: () => void
}

/**
 * Editorial Spread — weiße Karte als „Fiche Technique": Foto mit Platten-Signatur,
 * Hairline-Meta, übergroße italic Jahrgangs-Ziffer, wachsende Hairline am CTA.
 * Aufgeteilt aus StorePage (Spalte 3).
 */
export function WineCardEditorial({ wine, plate, fiche, onSelect }: WineCardEditorialProps) {
  const shortYear = String(wine.vintage).slice(-2)

  return (
    <div className="flex h-full flex-col justify-between border border-zinc-200 bg-white p-8 text-zinc-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div>
        <div className="relative mb-8 flex aspect-4/3 items-center justify-center overflow-hidden border border-zinc-100 bg-zinc-50">
          <img
            src={wine.imageSrc}
            alt={wine.imageAlt}
            className="h-full w-full object-cover opacity-90 transition-opacity duration-300 hover:opacity-100"
          />
          {plate && (
            <span className="absolute bottom-2 left-3 text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              {plate}
            </span>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase">Fiche Technique</span>
          {fiche && <span className="font-display text-xs text-zinc-400 italic">{fiche}</span>}
        </div>

        <span className="font-display mb-1 block text-5xl font-light tracking-tighter text-zinc-900">’{shortYear}</span>
        <h3 className="font-display text-2xl leading-tight font-light tracking-tight text-zinc-900">{wine.name}</h3>

        <p className="mt-4 text-sm leading-relaxed font-light text-zinc-500">{wine.description}</p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
        <div>
          <span className="block text-[9px] tracking-widest text-zinc-400 uppercase">Ab Hof</span>
          <span className="text-xl font-light tracking-tight text-zinc-900">{wine.price}</span>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="group inline-flex min-h-11 cursor-pointer items-center gap-3 pb-0.5 text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase transition-colors hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
        >
          <span>Anfragen</span>
          <span aria-hidden="true" className="h-px w-6 bg-zinc-900 transition-all duration-300 group-hover:w-10" />
        </button>
      </div>
    </div>
  )
}
