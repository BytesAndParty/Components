import { StoreCave } from './StoreCave'
import { StoreNocturne } from './StoreNocturne'
import { StoreMaison } from './StoreMaison'
import { StoreModern } from './StoreModern'
import { StoreArtisanal } from './StoreArtisanal'
import { StoreEditorial } from './StoreEditorial'
import { StoreNachtblau } from './StoreNachtblau'
import { StoreGenussgut } from './StoreGenussgut'
import { StoreSchwarzweiss } from './StoreSchwarzweiss'
import { StoreGastgeber } from './StoreGastgeber'
import { StoreCinematic } from './StoreCinematic'
import type { SectionDef } from '../types'

export const storeSection: SectionDef = {
  id: 'storefront',
  label: 'Storefront',
  description: 'Wein-Storefront — drei eigenständige Card-Designs.',
  variants: [
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
    {
      id: 'nachtblau',
      label: 'Nachtblau',
      description: 'Das Sortiment ohne Kachelraster: eine Position als halbseitiger Split, die übrigen als Serif-Ledger mit Haarlinien, geschlossen von einem Concierge-Band.',
      Component: StoreNachtblau,
    },
    {
      id: 'genussgut',
      label: 'Genussgut',
      description: 'Der Shop als einer von vier Bereichen: Aprikose-Bereichsleiste über die volle Breite, darunter das Sortiment mit Hover-Zoom, Outline-Buttons und Preisen in ruhiger Sans.',
      Component: StoreGenussgut,
    },
    {
      id: 'schwarzweiss',
      label: 'Schwarzweiß',
      description: 'Das Sortiment als versetztes Raster statt gleichförmiger Kacheln: wechselnde Bildformate auf eigenen Höhen, dazwischen ein ganzseitiges Serif-Zitat.',
      Component: StoreSchwarzweiss,
    },
    {
      id: 'gastgeber',
      label: 'Gastgeber',
      description: 'Das Sortiment als symmetrisches Register auf Creme: gleichrangige Bereichsleiste, sechs gleich große Positionen auf einer Achse — ohne Rabatte, Rosetten, Streichpreise oder Badges.',
      Component: StoreGastgeber,
    },
    {
      id: 'cinematic',
      label: 'Cinematic Atmosphere',
      description: 'Das Regal als vertikales Reel: stehender Vorspann links, sechs Positionen als Kontaktabzug-Zeilen rechts, jede führt auf die Detailseite.',
      Component: StoreCinematic,
    },
  ],
}
