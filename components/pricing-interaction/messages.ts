import type { ComponentMessages } from '../i18n'

export interface PricingInteractionMessages {
  monthly: string
  yearly: string
  priceSuffix: string
  cta: string
  plansLabel: string
  periodLabel: string
}

export const MESSAGES = {
  de: {
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    priceSuffix: '/Monat',
    cta: 'Loslegen',
    plansLabel: 'Preispläne',
    periodLabel: 'Abrechnungszeitraum',
  },
  en: {
    monthly: 'Monthly',
    yearly: 'Yearly',
    priceSuffix: '/month',
    cta: 'Get Started',
    plansLabel: 'Pricing plans',
    periodLabel: 'Billing period',
  },
} as const satisfies ComponentMessages<PricingInteractionMessages>
