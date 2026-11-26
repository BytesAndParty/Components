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
  // Machine draft like all pl texts, to be proofread by a Polish speaker (components/i18n/COMPONENT.md).
  pl: {
    label: 'Oś czasu',
  },
} as const satisfies ComponentMessages<TimelineMessages>
