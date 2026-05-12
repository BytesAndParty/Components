import type { ComponentMessages } from '../i18n';

export type FieldHintMessages = {
  triggerLabel: string;
};

export const MESSAGES = {
  de: {
    triggerLabel: 'Mehr Informationen',
  },
  en: {
    triggerLabel: 'More information',
  },
} as const satisfies ComponentMessages<FieldHintMessages>;
