import { PricingV1 } from './PricingV1'
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
  ],
}
