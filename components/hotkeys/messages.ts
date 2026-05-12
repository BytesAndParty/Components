import type { ComponentMessages } from '../i18n'

export type ShortcutOverviewMessages = {
  title: string
  subtitle: string
  openHint: string
}

export const MESSAGES = {
  de: {
    title:    'Tastenkürzel',
    subtitle: 'Alle aktiven Tastenkürzel auf dieser Seite',
    openHint: 'zum Öffnen',
  },
  en: {
    title:    'Shortcut Overview',
    subtitle: 'All active shortcuts on this page',
    openHint: 'to open',
  },
} as const satisfies ComponentMessages<ShortcutOverviewMessages>
