import type { ComponentMessages } from '../i18n'

export type ColorPickerMessages = {
  formatHex: string
  formatRgb: string
  formatHsl: string
  eyedropper: string
  hue: string
  alpha: string
  saturationBrightness: string
  presetsLabel: string
  paletteIvory: string
  paletteGold: string
  paletteWine: string
  paletteMidnight: string
  paletteBark: string
}

export const MESSAGES = {
  de: {
    formatHex: 'Hex',
    formatRgb: 'RGB',
    formatHsl: 'HSL',
    eyedropper: 'Farbe vom Bildschirm wählen',
    hue: 'Farbton',
    alpha: 'Transparenz',
    saturationBrightness: 'Sättigung und Helligkeit',
    presetsLabel: 'Vorgaben',
    paletteIvory: 'Elfenbein & Pergament',
    paletteGold: 'Gold & Bernstein',
    paletteWine: 'Burgunder & Wein',
    paletteMidnight: 'Mitternacht & Marine',
    paletteBark: 'Rinde & Erde',
  },
  en: {
    formatHex: 'Hex',
    formatRgb: 'RGB',
    formatHsl: 'HSL',
    eyedropper: 'Pick color from screen',
    hue: 'Hue',
    alpha: 'Alpha',
    saturationBrightness: 'Saturation and brightness',
    presetsLabel: 'Presets',
    paletteIvory: 'Ivory & Parchment',
    paletteGold: 'Gold & Amber',
    paletteWine: 'Burgundy & Wine',
    paletteMidnight: 'Midnight & Navy',
    paletteBark: 'Bark & Earth',
  },
} as const satisfies ComponentMessages<ColorPickerMessages>
