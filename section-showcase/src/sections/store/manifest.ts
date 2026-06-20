import { StorePage } from './StorePage'
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
  ],
}
