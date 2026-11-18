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
} as const satisfies ComponentMessages<NumberInputMessages>
