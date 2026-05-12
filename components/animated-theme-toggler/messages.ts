import type { ComponentMessages } from '../i18n'

export interface AnimatedThemeTogglerMessages {
  /** Label announced when current theme is light (action: go dark). */
  switchToDark: string
  /** Label announced when current theme is dark (action: go light). */
  switchToLight: string
}

export const MESSAGES = {
  de: {
    switchToDark: 'Zum dunklen Modus wechseln',
    switchToLight: 'Zum hellen Modus wechseln',
  },
  en: {
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
  },
} as const satisfies ComponentMessages<AnimatedThemeTogglerMessages>
