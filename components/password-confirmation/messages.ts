import type { ComponentMessages } from '../i18n'

export interface PasswordConfirmationMessages {
  placeholder: string
  match: string
  /** aria-label for the confirmation input. */
  ariaLabel: string
}

export const MESSAGES = {
  de: {
    placeholder: 'Passwort bestätigen',
    match: 'Passwörter stimmen überein',
    ariaLabel: 'Passwort bestätigen',
  },
  en: {
    placeholder: 'Confirm password',
    match: 'Passwords match',
    ariaLabel: 'Confirm password',
  },
} as const satisfies ComponentMessages<PasswordConfirmationMessages>
