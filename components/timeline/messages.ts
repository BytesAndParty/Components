import type { ComponentMessages } from '../i18n'

export interface TimelineMessages {
  /** Default aria-label for the ordered list when none is supplied. */
  label: string
}

export const MESSAGES = {
  de: {
    label: 'Zeitstrahl',
  },
  en: {
    label: 'Timeline',
  },
} as const satisfies ComponentMessages<TimelineMessages>
