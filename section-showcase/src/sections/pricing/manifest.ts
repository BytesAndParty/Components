import { PricingV2 } from './PricingV2'
import { PricingV4 } from './PricingV4'
import { PricingV5 } from './PricingV5'
import { PricingV6 } from './PricingV6'
import { PricingV7 } from './PricingV7'
import type { SectionDef } from '../types'

export const pricingSection: SectionDef = {
  id: 'pricing',
  label: 'Pricing & Clubs',
  variants: [
    {
      id: 'v2',
      label: 'Artisanal Card',
      description: 'Gepolsterte weiße Fläche, Serif-Typografie und dezenter Schatten.',
      Component: PricingV2,
    },
    {
      id: 'v4',
      label: 'Le Cercle (Domaine Privée)',
      description: 'Mitgliedschaften als graviertes Ledger: Hairline-Spalten, römische Ziffern, Bordeaux-Siegel auf der mittleren Stufe.',
      Component: PricingV4,
    },
    {
      id: 'v5',
      label: 'Maison Editorial',
      description: 'Rebstock-Abo als editoriale Preistafel: Hairline-Listen, römische Ziffern, übergroße Serif-Preise, Bordeaux-Rahmen auf der empfohlenen Stufe.',
      Component: PricingV5,
    },
    {
      id: 'v6',
      label: 'Die Rebstockmiete (Maison)',
      description: 'Das reale Buchart-Angebot als Magazin-Doppelseite: Headline überlappt die Foto-Tafel, Stufen als box-freies Hairline-Ledger mit Fußnoten — Preise und Leistungen von buchart58.at.',
      Component: PricingV6,
    },
    {
      id: 'v7',
      label: 'Die Abendkarte (Nocturne)',
      description: 'Die realen Verkostungs-Pakete als Weinkarte im Kerzenlicht: gedimmte Gold-Ledger-Positionen glimmen im Hover auf, Ghost-Ziffer „58" — Kontrastfläche zur Maison-Rebstockmiete.',
      Component: PricingV7,
    },
  ],
}
