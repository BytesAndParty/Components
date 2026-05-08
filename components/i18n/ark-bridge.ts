import { useI18n } from './provider'

const ARK_DE = {
  dialog: {
    closeTrigger: 'Dialog schließen',
  },
  popover: {
    closeTrigger: 'Popover schließen',
  },
  imageCropper: {
    rotateLeft: 'Nach links drehen',
    rotateRight: 'Nach rechts drehen',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    reset: 'Zurücksetzen',
    cropArea: 'Ausschnitt',
    handle: (side: string) => `Anfasser ${side} zum Ändern der Größe`,
  },
} as const

const ARK_EN = {
  dialog: {
    closeTrigger: 'Close dialog',
  },
  popover: {
    closeTrigger: 'Close popover',
  },
  imageCropper: {
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset',
    cropArea: 'Crop area',
    handle: (side: string) => `Resize ${side} handle`,
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
