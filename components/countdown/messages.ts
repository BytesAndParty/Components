import type { ComponentMessages } from '../i18n'

export interface CountdownMessages {
  days: string
  hours: string
  minutes: string
  seconds: string
  /** Hidden SR label, supports {d} {h} {m} {s} placeholders. */
  remaining: string
}

export const MESSAGES = {
  de: {
    days: 'Tage',
    hours: 'Std',
    minutes: 'Min',
    seconds: 'Sek',
    remaining: '{d} Tage, {h} Stunden, {m} Minuten, {s} Sekunden verbleiben',
  },
  en: {
    days: 'Days',
    hours: 'Hrs',
    minutes: 'Min',
    seconds: 'Sec',
    remaining: '{d} days, {h} hours, {m} minutes, {s} seconds remaining',
  },
} as const satisfies ComponentMessages<CountdownMessages>
