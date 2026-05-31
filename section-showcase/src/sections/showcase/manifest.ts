import { ProductV1 } from './ProductV1'
import { ProductV2 } from './ProductV2'
import type { SectionDef } from '../types'

export const showcaseSection: SectionDef = {
  id: 'showcase',
  label: 'Product Showcase',
  variants: [
    {
      id: 'v1',
      label: 'Interactive Detail Page',
      Component: ProductV1,
    },
    {
      id: 'v2',
      label: 'Artisanal Detail',
      description: 'Fokus auf das reine Produkt, extreme Typografie und offenes Layout.',
      Component: ProductV2,
    },
  ],
}
