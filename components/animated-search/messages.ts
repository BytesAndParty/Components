import type { ComponentMessages } from '../i18n';

export type AnimatedSearchMessages = {
  placeholder: string;
};

export const MESSAGES = {
  de: {
    placeholder: 'Suchen...',
  },
  en: {
    placeholder: 'Search...',
  },
} as const satisfies ComponentMessages<AnimatedSearchMessages>;
