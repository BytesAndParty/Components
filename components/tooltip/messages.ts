import type { ComponentMessages } from '../i18n';

export type TooltipMessages = {
  ariaLabel: string;
};

export const MESSAGES = {
  de: {
    ariaLabel: 'Tooltip',
  },
  en: {
    ariaLabel: 'Tooltip',
  },
} as const satisfies ComponentMessages<TooltipMessages>;
