import type { ComponentMessages } from '../i18n'

export interface PasswordSetupMessages {
  passwordLabel: string
  confirmLabel: string
  passwordPlaceholder: string
  showPassword: string
  hidePassword: string
  generate: string
  copy: string
  copied: string
  match: string
  // strength levels
  strengthVeryWeak: string
  strengthWeak: string
  strengthMedium: string
  strengthStrong: string
  strengthVeryStrong: string
  // checklist
  checkMinLength: string
  checkUppercase: string
  checkNumber: string
  checkSpecial: string
}

export const MESSAGES = {
  de: {
    passwordLabel: 'Passwort',
    confirmLabel: 'Passwort bestätigen',
    passwordPlaceholder: 'Passwort eingeben',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort verbergen',
    generate: 'Generieren',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    match: 'Passwörter stimmen überein',
    strengthVeryWeak: 'Sehr schwach',
    strengthWeak: 'Schwach',
    strengthMedium: 'Mittel',
    strengthStrong: 'Stark',
    strengthVeryStrong: 'Sehr stark',
    checkMinLength: 'Mindestens 8 Zeichen',
    checkUppercase: 'Ein Großbuchstabe',
    checkNumber: 'Eine Zahl',
    checkSpecial: 'Ein Sonderzeichen',
  },
  en: {
    passwordLabel: 'Password',
    confirmLabel: 'Confirm password',
    passwordPlaceholder: 'Enter your password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    generate: 'Generate',
    copy: 'Copy',
    copied: 'Copied!',
    match: 'Passwords match',
    strengthVeryWeak: 'Very weak',
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Strong',
    strengthVeryStrong: 'Very strong',
    checkMinLength: 'At least 8 characters',
    checkUppercase: 'One uppercase letter',
    checkNumber: 'One number',
    checkSpecial: 'One special character',
  },
} as const satisfies ComponentMessages<PasswordSetupMessages>
