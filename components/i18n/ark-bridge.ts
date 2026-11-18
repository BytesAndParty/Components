import { useI18n } from './i18n-context'

// Ark UI v5 / Zag 1.40 translation shapes. Keys verified against
// @zag-js/popover/dist/popover.types.d.ts and @zag-js/image-cropper/dist/image-cropper.types.d.ts
// (IntlTranslations); datePicker against @zag-js/date-picker 1.45 (date-picker.types.d.ts,
// defaults in date-picker.utils.mjs).
// Dialog has no translations prop in v5 — set aria-label on Dialog.Root or per-element instead.

interface Rect { x: number; y: number; width: number; height: number }
interface CropperShapeDetails { shape: 'rectangle' | 'circle' }
type SelectionValueTextDetails = Rect & CropperShapeDetails

type DateView = 'day' | 'month' | 'year'
// Subset of Zag's DayTableCellState; `valueText` is already formatted in the picker's locale.
interface DayCellState {
  valueText: string
  unavailable: boolean
  selected: boolean
  inRange: boolean
  firstInRange: boolean
  lastInRange: boolean
}

const ARK_DE = {
  popover: {
    closeTriggerLabel: 'Popover schließen',
  },
  imageCropper: {
    rootLabel: 'Bildausschnitt-Editor',
    rootRoleDescription: 'Bildausschnitt-Editor',
    previewLoading: 'Vorschau wird geladen',
    previewDescription: () => 'Vorschau des Bildausschnitts',
    selectionLabel: ({ shape }: CropperShapeDetails) =>
      shape === 'circle' ? 'Kreis-Auswahlbereich' : 'Rechteckiger Auswahlbereich',
    selectionRoleDescription: 'Auswahlbereich',
    selectionInstructions: 'Mit den Pfeiltasten verschieben, mit den Anfassern die Größe ändern.',
    selectionValueText: ({ width, height }: SelectionValueTextDetails) =>
      `${Math.round(width)} mal ${Math.round(height)} Pixel`,
  },
  // `placeholder` is left out: Zag 1.45 builds the input placeholder from the locale and never reads it.
  datePicker: {
    dayCell: (state: DayCellState) => {
      if (state.unavailable) return `Nicht verfügbar. ${state.valueText}`
      if (state.firstInRange) return `Zeitraum beginnt am ${state.valueText}`
      if (state.lastInRange) return `Zeitraum endet am ${state.valueText}`
      if (state.inRange) return `Im Zeitraum. ${state.valueText}`
      if (state.selected) return `Ausgewähltes Datum. ${state.valueText}`
      return `${state.valueText} wählen`
    },
    trigger: (open: boolean) => (open ? 'Kalender schließen' : 'Kalender öffnen'),
    viewTrigger: (view: DateView, nextView: DateView | undefined) => {
      const names = { day: 'Tagesansicht', month: 'Monatsansicht', year: 'Jahresansicht' }
      return nextView ? `Zur ${names[nextView]} wechseln` : names[view]
    },
    presetTrigger: ([start = '', end = '']: string[]) => `${start} bis ${end} wählen`,
    prevTrigger: (view: DateView) =>
      ({ day: 'Zum vorherigen Monat', month: 'Zum vorherigen Jahr', year: 'Zum vorherigen Jahrzehnt' })[view],
    nextTrigger: (view: DateView) =>
      ({ day: 'Zum nächsten Monat', month: 'Zum nächsten Jahr', year: 'Zum nächsten Jahrzehnt' })[view],
    content: 'Kalender',
    monthSelect: 'Monat wählen',
    yearSelect: 'Jahr wählen',
    clearTrigger: 'Auswahl löschen',
    weekColumnHeader: 'KW',
    weekNumberCell: (weekNumber: number) => `Kalenderwoche ${weekNumber}`,
  },
} as const

const ARK_EN = {
  popover: {
    closeTriggerLabel: 'Close popover',
  },
  imageCropper: {
    rootLabel: 'Image cropper',
    rootRoleDescription: 'Image cropper',
    previewLoading: 'Loading preview',
    previewDescription: () => 'Cropped image preview',
    selectionLabel: ({ shape }: CropperShapeDetails) =>
      shape === 'circle' ? 'Circular selection area' : 'Rectangular selection area',
    selectionRoleDescription: 'Selection area',
    selectionInstructions: 'Use arrow keys to move, drag the handles to resize.',
    selectionValueText: ({ width, height }: SelectionValueTextDetails) =>
      `${Math.round(width)} by ${Math.round(height)} pixels`,
  },
  // Same wording as Zag's English defaults, so English output does not change.
  datePicker: {
    dayCell: (state: DayCellState) => {
      if (state.unavailable) return `Not available. ${state.valueText}`
      if (state.firstInRange) return `Starting range from ${state.valueText}`
      if (state.lastInRange) return `Range ending at ${state.valueText}`
      if (state.inRange) return `In range. ${state.valueText}`
      if (state.selected) return `Selected date. ${state.valueText}`
      return `Choose ${state.valueText}`
    },
    trigger: (open: boolean) => (open ? 'Close calendar' : 'Open calendar'),
    viewTrigger: (view: DateView, nextView: DateView | undefined) =>
      nextView ? `Switch to ${nextView} view` : `${view} view`,
    presetTrigger: ([start = '', end = '']: string[]) => `select ${start} to ${end}`,
    prevTrigger: (view: DateView) =>
      ({ day: 'Switch to previous month', month: 'Switch to previous year', year: 'Switch to previous decade' })[view],
    nextTrigger: (view: DateView) =>
      ({ day: 'Switch to next month', month: 'Switch to next year', year: 'Switch to next decade' })[view],
    content: 'calendar',
    monthSelect: 'Select month',
    yearSelect: 'Select year',
    clearTrigger: 'Clear selected dates',
    weekColumnHeader: 'Wk',
    weekNumberCell: (weekNumber: number) => `Week ${weekNumber}`,
  },
} as const

export type ArkComponent = keyof typeof ARK_EN

/**
 * Bridge hook to provide localized translations for Ark UI components.
 * Maps current design-engine locale to Ark-compatible translation objects.
 */
export function useArkTranslations<T extends ArkComponent>(component: T) {
  const { locale } = useI18n()
  const translations = locale === 'de' ? ARK_DE : ARK_EN
  return translations[component] as (typeof ARK_EN)[T]
}
