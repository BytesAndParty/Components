import type { ComponentMessages } from '../i18n'
import type { TextToolOptionsMessages } from './types'

export const MESSAGES = {
  de: {
    fontFamily: 'Schriftart',
    bold: 'Fett (Strg+B)',
    italic: 'Kursiv (Strg+I)',
    underline: 'Unterstrichen (Strg+U)',
    alignLeft: 'Linksbündig',
    alignCenter: 'Zentriert',
    alignRight: 'Rechtsbündig',
    alignJustify: 'Blocksatz',
    textColor: 'Textfarbe',
  },
  en: {
    fontFamily: 'Font',
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Justify',
    textColor: 'Text color',
  },
} as const satisfies ComponentMessages<TextToolOptionsMessages>
