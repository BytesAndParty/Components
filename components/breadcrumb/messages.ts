import type { ComponentMessages } from '../i18n';

export type BreadcrumbMessages = {
  ariaLabel: string;
  more: string;
};

export const MESSAGES = {
  de: {
    ariaLabel: 'Brotkrumen-Navigation',
    more: 'Mehr',
  },
  en: {
    ariaLabel: 'Breadcrumb navigation',
    more: 'More',
  },
} as const satisfies ComponentMessages<BreadcrumbMessages>;
