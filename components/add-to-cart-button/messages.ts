import type { ComponentMessages } from '../i18n'

export interface AddToCartButtonMessages {
  /** Default label when idle. */
  idle: string
  /** Announced to screen readers when the item is added. */
  added: string
}

export const MESSAGES = {
  de: {
    idle: 'In den Warenkorb',
    added: 'Zum Warenkorb hinzugefügt',
  },
  en: {
    idle: 'Add to cart',
    added: 'Added to cart',
  },
} as const satisfies ComponentMessages<AddToCartButtonMessages>
