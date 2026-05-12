import type { ComponentMessages } from '../i18n';

export type SliderMessages = {
  ariaLabel: string;
};

export const MESSAGES = {
  de: {
    ariaLabel: 'Schieberegler',
  },
  en: {
    ariaLabel: 'Slider',
  },
} as const satisfies ComponentMessages<SliderMessages>;
