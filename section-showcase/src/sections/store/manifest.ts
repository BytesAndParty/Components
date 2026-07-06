import { StorePage } from './StorePage'
import { StoreCave } from './StoreCave'
import { StoreNocturne } from './StoreNocturne'
import { StoreMaison } from './StoreMaison'
import { StoreModern } from './StoreModern'
import { StoreArtisanal } from './StoreArtisanal'
import { StoreEditorial } from './StoreEditorial'
import type { SectionDef } from '../types'

export const storeSection: SectionDef = {
  id: 'storefront',
  label: 'Storefront',
  description: 'Wein-Storefront — drei Card-Designs, je als eigene Variante, plus eine Vergleichsansicht.',
  variants: [
    {
      id: 'default',
      label: 'Alle Drei (Vergleich)',
      description: 'Vergleichsansicht: alle drei Card-Designs nebeneinander. Die Einzeldesigns stehen als eigene Varianten (Modern · Artisanal · Editorial).',
      Component: StorePage,
    },
    {
      id: 'modern',
      label: 'Modern & Interactive',
      description: 'Nur das dunkle, interaktive Card-Design — AmbientImage-Glow, Star-Rating, Accent-CTA.',
      Component: StoreModern,
    },
    {
      id: 'artisanal',
      label: 'Artisanal & Minimal',
      description: 'Nur das Cream-Serif-Card-Design mit ShinyText und Underline-CTA.',
      Component: StoreArtisanal,
    },
    {
      id: 'editorial',
      label: 'Editorial Spread',
      description: 'Nur das weiße Fiche-Technique-Card-Design mit Platten-Signatur.',
      Component: StoreEditorial,
    },
    {
      id: 'cave',
      label: 'La Cave (Domaine Privée)',
      description: 'Shop als gravierte Weinkarte: Ledger-Zeilen, Filter-Tabs, Featured-Cuvée im Rundbogen — jede Zeile öffnet die Grand-Cru-Detailseite.',
      Component: StoreCave,
    },
    {
      id: 'nocturne',
      label: 'Cave Nocturne (Cinematic)',
      description: 'Nachtverkauf: drei Flaschen im Ambient-Spot, der Rest als gedimmtes Gold-Ledger — jede Position öffnet die Chiaroscuro-Detailseite.',
      Component: StoreNocturne,
    },
    {
      id: 'maison',
      label: 'Maison Editorial',
      description: 'Sortiment als Magazin-Register: Cream-Kopf mit übergroßer Serif, Raster aus Editorial-Karten mit Platten-Signatur — jede Position öffnet die Maison-Detailseite.',
      Component: StoreMaison,
    },
  ],
}
