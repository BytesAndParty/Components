import type { ComponentMessages } from '../i18n'

export interface GooeyInputMessages {
  placeholder: string
  openLabel: string
  closeLabel: string
}

export const MESSAGES = {
  de: {
    placeholder: 'Suchen…',
    openLabel: 'Suche öffnen',
    closeLabel: 'Suche schließen',
  },
  en: {
    placeholder: 'Search…',
    openLabel: 'Open search',
    closeLabel: 'Close search',
  },
} as const satisfies ComponentMessages<GooeyInputMessages>
