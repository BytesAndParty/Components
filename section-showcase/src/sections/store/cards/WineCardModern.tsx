import { AmbientImage } from '@components/ambient-image/ambient-image'
import { Star, ArrowRight } from 'lucide-react'
import type { WineCardData } from './types'

export interface WineCardModernProps {
  wine: WineCardData
  /** Bewertungs-Zeile, z. B. "4.9 · Premium Selection" */
  rating?: string
  onSelect?: () => void
}

/**
 * Modern & Interactive — dunkle/semantische Karte mit AmbientImage-Glow, Star-Rating
 * und Accent-CTA. Aufgeteilt aus StorePage (Spalte 1).
 */
export function WineCardModern({ wine, rating, onSelect }: WineCardModernProps) {
  return (
    <div className="border-border bg-card/45 hover:border-accent/40 focus-within:ring-accent/50 flex h-full flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-within:ring-2">
      <div>
        <div className="from-accent/5 relative mb-8 flex items-center justify-center overflow-hidden rounded-xl bg-radial to-transparent py-6">
          <AmbientImage
            src={wine.imageSrc}
            alt={wine.imageAlt}
            borderRadius="1rem"
            intensity={0.4}
            blur={40}
            className="aspect-3/4 w-44 shadow-lg"
          />
        </div>

        {rating && (
          <div className="text-accent mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">{rating}</span>
          </div>
        )}

        <h3 className="font-sans text-foreground text-2xl font-semibold tracking-tight">{wine.name}</h3>
        <p className="text-accent mt-1 text-sm font-medium">Vintage {wine.vintage}</p>
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed font-light">{wine.description}</p>
      </div>

      <div className="border-border mt-8 flex items-center justify-between border-t pt-6">
        <div>
          <span className="text-muted-foreground block text-xs">Ab Hof</span>
          <span className="text-foreground text-xl font-bold">{wine.price}</span>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent/60 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <span>Entdecken</span>
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
