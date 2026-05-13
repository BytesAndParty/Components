import type { ComponentMessages } from '../i18n'

export interface CartIconMessages {
  /** Base label for the cart button when empty. */
  empty: string
  /** Label when items present. Supports {count} placeholder, e.g. "Cart, 3 items". */
  withCount: string
}

export const MESSAGES = {
  de: {
    empty: 'Warenkorb',
    withCount: 'Warenkorb, {count} Artikel',
  },
  en: {
    empty: 'Cart',
    withCount: 'Cart, {count} items',
  },
} as const satisfies ComponentMessages<CartIconMessages>
