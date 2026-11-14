import { ShinyText } from '@components/shiny-text/shiny-text'
import type { WineCardData } from './types'

export interface WineCardArtisanalProps {
  wine: WineCardData
  onSelect?: () => void
}

/**
 * Artisanal & Minimal — Cream-Karte (#fdfcf9), große Serif-Headline, ShinyText auf der
 * Jahrgangszeile, weicher Boden-Schatten unter der Flasche, Underline-CTA.
 * Aufgeteilt aus StorePage (Spalte 2).
 */
export function WineCardArtisanal({ wine, onSelect }: WineCardArtisanalProps) {
  return (
    <div className="flex h-full flex-col justify-between border border-zinc-100 bg-[#fdfcf9] p-8 text-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div>
        <div className="group relative mb-8 flex items-center justify-center py-6">
          <div className="absolute -bottom-2 left-1/2 h-4 w-[40%] -translate-x-1/2 rounded-[50%] bg-black/5 blur-xl" />
          <img
            src={wine.imageSrc}
            alt={wine.imageAlt}
            className="relative z-10 w-36 transition-transform duration-500 group-hover:-translate-y-2"
          />
        </div>

        <span className="mb-2 block text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">{wine.lage}</span>

        <h3 className="font-display text-3xl leading-tight font-light tracking-tight text-zinc-900">{wine.name}</h3>
        <p className="font-display text-zinc-600 italic">
          <ShinyText duration={8} shineColor="oklch(0.85 0.03 90 / 0.4)" className="inline-block! text-zinc-700!">
            {wine.edition ? `${wine.edition} ${wine.vintage}` : wine.vintage}
          </ShinyText>
        </p>

        <p className="mt-4 text-sm leading-relaxed font-light text-zinc-500">{wine.description}</p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
        <div>
          <span className="block text-[9px] tracking-widest text-zinc-400 uppercase">Preis</span>
          <span className="text-xl font-light tracking-tight text-zinc-900">{wine.price}</span>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex min-h-11 cursor-pointer items-center border-b border-zinc-900 pb-0.5 text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase transition-colors hover:border-zinc-300 hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
        >
          Detailansicht
        </button>
      </div>
    </div>
  )
}
