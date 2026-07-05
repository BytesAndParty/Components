import { StorePage } from './StorePage'
import { StoreCave } from './StoreCave'
import { StoreNocturne } from './StoreNocturne'
import { StoreMaison } from './StoreMaison'
import type { SectionDef } from '../types'

export const storeSection: SectionDef = {
  id: 'storefront',
  label: 'Storefront',
  description: 'Dummy-Wein-Storefront mit drei Spalten für drei verschiedene Produktdesigns.',
  variants: [
    {
      id: 'default',
      label: 'Store Page',
      Component: StorePage,
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
