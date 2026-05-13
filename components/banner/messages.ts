import type { ComponentMessages } from '../i18n'

export interface BannerMessages {
  /** Region landmark label. */
  region: string
  /** Aria-label for the close/dismiss button. */
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
} as const satisfies ComponentMessages<BannerMessages>
