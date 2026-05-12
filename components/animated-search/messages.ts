import type { ComponentMessages } from '../i18n';

export type AnimatedSearchMessages = {
  placeholder: string;
  openLabel: string;
  submitLabel: string;
  closeLabel: string;
};

export const MESSAGES = {
  de: {
    placeholder: 'Suchen...',
    openLabel: 'Suche öffnen',
    submitLabel: 'Suche ausführen',
    closeLabel: 'Suche schließen',
  },
  en: {
    placeholder: 'Search...',
    openLabel: 'Open search',
    submitLabel: 'Submit search',
    closeLabel: 'Close search',
  },
} as const satisfies ComponentMessages<AnimatedSearchMessages>;
