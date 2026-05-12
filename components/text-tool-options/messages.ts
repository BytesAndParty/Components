import type { ComponentMessages } from '../i18n'

export type TextToolOptionsMessages = {
  bold: string
  italic: string
  underline: string
  alignLeft: string
  alignCenter: string
  alignRight: string
  alignJustify: string
  textColor: string
}

export const MESSAGES = {
  de: {
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
