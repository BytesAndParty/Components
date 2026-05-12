import type { ComponentMessages } from '../i18n'

export interface FooterMessages {
  /** Suffix nach Jahr und Firmenname, z.B. "All rights reserved." */
  rightsReserved: string
}

export const MESSAGES = {
  de: {
    rightsReserved: 'Alle Rechte vorbehalten.',
  },
  en: {
    rightsReserved: 'All rights reserved.',
  },
} as const satisfies ComponentMessages<FooterMessages>
