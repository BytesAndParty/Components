import type { ComponentMessages } from '../i18n'

export type ColorPickerMessages = {
  formatHex: string
  formatRgb: string
  formatHsl: string
  eyedropper: string
  hue: string
  alpha: string
  saturationBrightness: string
  selectColor: string
  saturationBrightnessValue: string
  area2d: string
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
    selectColor: 'Farbe {color} wählen',
    saturationBrightnessValue: 'Sättigung {s}, Helligkeit {b}',
    area2d: '2D-Regler',
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
    selectColor: 'Select {color}',
    saturationBrightnessValue: 'saturation {s}, brightness {b}',
    area2d: '2D slider',
    paletteIvory: 'Ivory & Parchment',
    paletteGold: 'Gold & Amber',
    paletteWine: 'Burgundy & Wine',
    paletteMidnight: 'Midnight & Navy',
    paletteBark: 'Bark & Earth',
  },
} as const satisfies ComponentMessages<ColorPickerMessages>
