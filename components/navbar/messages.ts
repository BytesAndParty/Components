import type { ComponentMessages } from '../i18n'

export type NavbarMessages = {
  ariaLabel: string
  openMenu: string
  closeMenu: string
}

export const MESSAGES = {
  de: {
    ariaLabel: 'Hauptnavigation',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
  },
  en: {
    ariaLabel: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
} as const satisfies ComponentMessages<NavbarMessages>
