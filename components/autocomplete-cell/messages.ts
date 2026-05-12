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
} as const satisfies ComponentMessages<AutocompleteMessages>
