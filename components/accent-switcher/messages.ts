import type { ComponentMessages } from '../i18n'

export interface AccentSwitcherMessages {
  /** Label for the trigger button and dropdown header. */
  label: string
  /** Visually-hidden suffix marking the active palette. */
  current: string
}

export const MESSAGES = {
  de: {
    label: 'Akzentfarbe',
    current: '(aktiv)',
  },
  en: {
    label: 'Accent color',
    current: '(current)',
  },
} as const satisfies ComponentMessages<AccentSwitcherMessages>
