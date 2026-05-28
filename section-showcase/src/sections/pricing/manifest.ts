import { PricingV1 } from './PricingV1'
import { PricingV2 } from './PricingV2'
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
  ],
}
