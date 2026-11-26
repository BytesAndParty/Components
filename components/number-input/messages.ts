import type { ComponentMessages } from '../i18n'

export type NumberInputMessages = {
  /** Accessible name of the minus stepper. */
  decrement: string
  /** Accessible name of the plus stepper. */
  increment: string
}

export const MESSAGES = {
  de: {
    decrement: 'Verringern',
    increment: 'Erhöhen',
  },
  en: {
    decrement: 'Decrease',
    increment: 'Increase',
  },
  // Machine draft like all pl texts, to be proofread by a Polish speaker (components/i18n/COMPONENT.md).
  pl: {
    decrement: 'Zmniejsz',
    increment: 'Zwiększ',
  },
} as const satisfies ComponentMessages<NumberInputMessages>
