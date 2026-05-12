import type { ComponentMessages } from '../i18n'

export type ValidatorBadgeMessages = {
  compliant: string
  missingFields: string
  panelTitle: string
  footer: string
  close: string
  error: string
  warning: string
}

export const MESSAGES = {
  de: {
    compliant: 'EU-konform',
    missingFields: '{count} Feld{count} fehlt',
    panelTitle: 'EU Label Compliance',
    footer: 'EU-Verordnung 2023/2977 — Pflichtfelder für Wein in der EU.',
    close: 'Schließen',
    error: 'Fehler',
    warning: 'Warnung',
  },
  en: {
    compliant: 'EU compliant',
    missingFields: '{count} missing field{count}',
    panelTitle: 'EU Label Compliance',
    footer: 'EU Regulation 2023/2977 — required fields for wine sold in the EU.',
    close: 'Close',
    error: 'Error',
    warning: 'Warning',
  },
} as const satisfies ComponentMessages<ValidatorBadgeMessages>
