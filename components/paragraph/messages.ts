import type { ComponentMessages } from '../i18n'

export interface ParagraphMessages {
  expand: string
  collapse: string
}

export const MESSAGES = {
  de: { expand: 'Mehr lesen', collapse: 'Weniger' },
  en: { expand: 'Read more', collapse: 'Less' },
} as const satisfies ComponentMessages<ParagraphMessages>
