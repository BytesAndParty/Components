import type { ComponentMessages } from '../i18n'

export interface DockMessages {
  /** ARIA label for the dock toolbar container. */
  toolbarLabel: string
}

export const MESSAGES = {
  de: {
    toolbarLabel: 'Schnellzugriff',
  },
  en: {
    toolbarLabel: 'Quick access',
  },
} as const satisfies ComponentMessages<DockMessages>
