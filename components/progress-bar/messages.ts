import type { ComponentMessages } from '../i18n';

export type ProgressBarMessages = {
  /** Default accessible name when neither `aria-label` nor `aria-labelledby` is given. */
  label: string;
};

export const MESSAGES = {
  de: {
    label: 'Fortschritt',
  },
  en: {
    label: 'Progress',
  },
} as const satisfies ComponentMessages<ProgressBarMessages>;
