import type { ComponentMessages } from '../i18n'

export type AutocompleteMessages = {
  placeholder: string
  clearLabel: string
  suggestionsLabel: string
}

export const MESSAGES = {
  de: {
    placeholder: 'Suchen...',
    clearLabel: 'Eingabe löschen',
    suggestionsLabel: 'Vorschläge',
  },
  en: {
    placeholder: 'Search...',
    clearLabel: 'Clear input',
    suggestionsLabel: 'Suggestions',
  },
  // Machine draft like all pl texts, to be proofread by a Polish speaker (components/i18n/COMPONENT.md).
  pl: {
    placeholder: 'Szukaj...',
    clearLabel: 'Wyczyść pole',
    suggestionsLabel: 'Sugestie',
  },
} as const satisfies ComponentMessages<AutocompleteMessages>
