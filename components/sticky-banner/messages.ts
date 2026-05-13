import type { ComponentMessages } from '../i18n'

export interface StickyBannerMessages {
  region: string
  dismiss: string
}

export const MESSAGES = {
  de: {
    region: 'Hinweis',
    dismiss: 'Banner schließen',
  },
  en: {
    region: 'Notice',
    dismiss: 'Dismiss banner',
  },
} as const satisfies ComponentMessages<StickyBannerMessages>
