import type { ComponentMessages } from '../i18n'

export interface ProductTagMessages {
  new: string
  sale: string
  lowStock: string
  bestseller: string
  limited: string
  organic: string
  vegan: string
  award: string
}

export const MESSAGES = {
  de: {
    new: 'NEU',
    sale: 'SALE',
    lowStock: 'Bald weg',
    bestseller: 'Bestseller',
    limited: 'Limitiert',
    organic: 'Bio',
    vegan: 'Vegan',
    award: 'Prämiert',
  },
  en: {
    new: 'NEW',
    sale: 'SALE',
    lowStock: 'Low stock',
    bestseller: 'Bestseller',
    limited: 'Limited',
    organic: 'Organic',
    vegan: 'Vegan',
    award: 'Award winning',
  },
} as const satisfies ComponentMessages<ProductTagMessages>
