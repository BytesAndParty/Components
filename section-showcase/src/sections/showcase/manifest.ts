import { ProductV1 } from './ProductV1'
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
  ],
}
