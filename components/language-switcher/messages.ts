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
  // Machine draft like all pl texts, to be proofread by a Polish speaker (components/i18n/COMPONENT.md).
  pl: {
    header: 'Język',
    triggerLabel: 'Wybierz język',
  },
} as const satisfies ComponentMessages<LanguageSwitcherMessages>
