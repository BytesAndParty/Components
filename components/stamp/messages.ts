import type { ComponentMessages } from '../i18n'

export interface StampMessages {
  /** Wort vor dem Jahr, steht in Versalien auf dem Stempel und im zugänglichen Namen. */
  vintage: string
}

export const MESSAGES = {
  de: { vintage: 'Jahrgang' },
  en: { vintage: 'Vintage' },
} as const satisfies ComponentMessages<StampMessages>
