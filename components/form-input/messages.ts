import type { ComponentMessages } from '../i18n';

export type FormInputMessages = {
  requiredLabel: string;
};

export const MESSAGES = {
  de: {
    requiredLabel: '*',
  },
  en: {
    requiredLabel: '*',
  },
} as const satisfies ComponentMessages<FormInputMessages>;
