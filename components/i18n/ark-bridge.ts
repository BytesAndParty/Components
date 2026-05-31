import { useI18n } from './i18n-context'

// Ark UI v5 / Zag 1.40 translation shapes. Keys verified against
// @zag-js/popover/dist/popover.types.d.ts and @zag-js/image-cropper/dist/image-cropper.types.d.ts.
// Dialog has no translations prop in v5 — set aria-label on Dialog.Root or per-element instead.

interface Rect { x: number; y: number; width: number; height: number }
interface CropperShapeDetails { shape: 'rectangle' | 'circle' }
type SelectionValueTextDetails = Rect & CropperShapeDetails

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
