import type { ComponentMessages } from '../i18n'

export interface RatingMessages {
  /** ARIA label for the entire rating group (default: "Rating" / "Bewertung") */
  ariaLabel: string
  /** Individual star label with {current} and {total} placeholders */
  starLabel: string
}

export const MESSAGES = {
  de: {
    ariaLabel: 'Bewertung',
    starLabel: '{current} von {total} Sternen',
  },
  en: {
    ariaLabel: 'Rating',
    starLabel: '{current} of {total} stars',
  },
} as const satisfies ComponentMessages<RatingMessages>
