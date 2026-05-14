import type { ComponentMessages } from '../i18n'

export interface CircularProgressMessages {
  /** Default accessible name. Supports {value} placeholder. */
  label: string
}

export const MESSAGES = {
  de: { label: 'Fortschritt: {value} %' },
  en: { label: 'Progress: {value}%' },
} as const satisfies ComponentMessages<CircularProgressMessages>
