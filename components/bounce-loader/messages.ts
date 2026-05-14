import type { ComponentMessages } from '../i18n'

export interface BounceLoaderMessages {
  loading: string
}

export const MESSAGES = {
  de: { loading: 'Lädt' },
  en: { loading: 'Loading' },
} as const satisfies ComponentMessages<BounceLoaderMessages>
