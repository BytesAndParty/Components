import type { ComponentMessages } from '../i18n'

export interface StepperMessages {
  back: string
  next: string
  finalize: string
  /** Used as group aria-label, supports {current} and {total} placeholders. */
  stepOfTotal: string
  /** aria-label suffix for completed steps. */
  completed: string
}

export const MESSAGES = {
  de: {
    back: 'Zurück',
    next: 'Weiter',
    finalize: 'Abschließen',
    stepOfTotal: 'Schritt {current} von {total}',
    completed: 'abgeschlossen',
  },
  en: {
    back: 'Back',
    next: 'Next',
    finalize: 'Finish',
    stepOfTotal: 'Step {current} of {total}',
    completed: 'completed',
  },
} as const satisfies ComponentMessages<StepperMessages>
