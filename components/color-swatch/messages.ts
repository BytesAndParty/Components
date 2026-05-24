import type { ComponentMessages } from '../i18n'

export type ColorSwatchMessages = {
  trigger: string
}

export const MESSAGES = {
  de: {
    trigger: 'Farbe auswählen',
  },
  en: {
    trigger: 'Pick color',
  },
} as const satisfies ComponentMessages<ColorSwatchMessages>
