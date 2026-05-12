import type { ComponentMessages } from '../i18n';

export type BackToTopMessages = {
  ariaLabel: string;
  shortcutLabel: string;
  shortcutDescription: string;
};

export const MESSAGES = {
  de: {
    ariaLabel: 'Nach oben scrollen',
    shortcutLabel: 'Nach oben',
    shortcutDescription: 'Scrollt sanft zum Seitenanfang',
  },
  en: {
    ariaLabel: 'Scroll to top',
    shortcutLabel: 'Scroll to top',
    shortcutDescription: 'Smoothly scrolls to the top of the page',
  },
} as const satisfies ComponentMessages<BackToTopMessages>;
