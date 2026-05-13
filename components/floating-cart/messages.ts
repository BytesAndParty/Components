import type { ComponentMessages } from '../i18n'

export interface FloatingCartMessages {
  /** FAB aria-label. Supports {count} placeholder. */
  cartLabel: string
  /** Region landmark label. */
  region: string
  /** Remove-item button label. Supports {label} placeholder. */
  removeItem: string
  /** Fallback label when an item has no `label`. */
  itemFallback: string
}

export const MESSAGES = {
  de: {
    cartLabel: 'Warenkorb – {count} Artikel',
    region: 'Warenkorb',
    removeItem: '{label} entfernen',
    itemFallback: 'Artikel',
  },
  en: {
    cartLabel: 'Cart – {count} items',
    region: 'Shopping cart',
    removeItem: 'Remove {label}',
    itemFallback: 'Item',
  },
} as const satisfies ComponentMessages<FloatingCartMessages>
