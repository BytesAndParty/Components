import type { ComponentMessages } from '../i18n'

export interface HeartLikeMessages {
  /** Label announced when the heart is empty (action: like). */
  like: string
  /** Label announced when the heart is filled (action: unlike). */
  unlike: string
}

export const MESSAGES = {
  de: {
    like: 'Favorisieren',
    unlike: 'Favorit entfernen',
  },
  en: {
    like: 'Like',
    unlike: 'Unlike',
  },
} as const satisfies ComponentMessages<HeartLikeMessages>
