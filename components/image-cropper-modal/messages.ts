import type { ComponentMessages } from '../i18n'

export type ImageCropperMessages = {
  title: string
  apply: string
  cancel: string
  zoomIn: string
  zoomOut: string
  zoom: string
  resetRotation: string
  flipH: string
  flipV: string
  noImage: string
  closeDialog: string
}

export const MESSAGES = {
  de: {
    title:         'Bild zuschneiden',
    apply:         'Zuschnitt anwenden',
    cancel:        'Abbrechen',
    zoomIn:        'Vergrößern',
    zoomOut:       'Verkleinerern',
    zoom:          'Zoom',
    resetRotation: 'Rotation zurücksetzen',
    flipH:         'Horizontal spiegeln',
    flipV:         'Vertikal spiegeln',
    noImage:       'Kein Bild ausgewählt.',
    closeDialog:   'Dialog schließen',
  },
  en: {
    title:         'Crop Image',
    apply:         'Apply Crop',
    cancel:        'Cancel',
    zoomIn:        'Zoom in',
    zoomOut:       'Zoom out',
    zoom:          'Zoom',
    resetRotation: 'Reset rotation',
    flipH:         'Flip horizontal',
    flipV:         'Flip vertical',
    noImage:       'No image selected.',
    closeDialog:   'Close dialog',
  },
} as const satisfies ComponentMessages<ImageCropperMessages>
