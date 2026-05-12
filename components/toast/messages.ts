import type { ComponentMessages } from '../i18n';

export type ToastMessages = {
  dismiss: string;
};

export const MESSAGES = {
  de: {
    dismiss: 'Schließen',
  },
  en: {
    dismiss: 'Dismiss',
  },
} as const satisfies ComponentMessages<ToastMessages>;
