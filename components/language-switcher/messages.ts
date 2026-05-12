import type { ComponentMessages } from '../i18n'

export type LanguageSwitcherMessages = {
  header: string
  triggerLabel: string
}

export const MESSAGES = {
  de: {
    header: 'Sprache',
    triggerLabel: 'Sprache auswählen',
  },
  en: {
    header: 'Language',
    triggerLabel: 'Select language',
  },
} as const satisfies ComponentMessages<LanguageSwitcherMessages>
