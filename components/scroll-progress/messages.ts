import type { ComponentMessages } from '../i18n'

export interface ScrollProgressMessages {
  label: string
}

export const MESSAGES = {
  de: { label: 'Scroll-Fortschritt' },
  en: { label: 'Scroll progress' },
} as const satisfies ComponentMessages<ScrollProgressMessages>
