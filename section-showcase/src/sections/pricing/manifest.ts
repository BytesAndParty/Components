import { PricingV1 } from './PricingV1'
import { PricingV2 } from './PricingV2'
import { PricingV3 } from './PricingV3'
import { PricingV4 } from './PricingV4'
import type { SectionDef } from '../types'

export const pricingSection: SectionDef = {
  id: 'pricing',
  label: 'Pricing & Clubs',
  variants: [
    {
      id: 'v1',
      label: 'Interactive Subscription',
      Component: PricingV1,
    },
    {
      id: 'v2',
      label: 'Artisanal Card',
      description: 'Gepolsterte weiße Fläche, Serif-Typografie und dezenter Schatten.',
      Component: PricingV2,
    },
    {
      id: 'v3',
      label: 'Glow Tiers',
      description: 'Drei statische Stufen mit Glow-Karten und Hover-Effekten.',
      Component: PricingV3,
    },
    {
      id: 'v4',
      label: 'Le Cercle (Domaine Privée)',
      description: 'Mitgliedschaften als graviertes Ledger: Hairline-Spalten, römische Ziffern, Bordeaux-Siegel auf der mittleren Stufe.',
      Component: PricingV4,
    },
  ],
}
