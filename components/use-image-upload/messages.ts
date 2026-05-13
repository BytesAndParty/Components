import type { ComponentMessages } from '../i18n'

export interface ImageUploadMessages {
  dropZone: string
  dragging: string
  prompt: string
  remove: string
  /** Fallback alt text when no filename is available. */
  previewAlt: string
}

export const MESSAGES = {
  de: {
    dropZone: 'Bild hochladen',
    dragging: 'Loslassen zum Hochladen',
    prompt: 'Klicken oder Bild ablegen',
    remove: 'Entfernen',
    previewAlt: 'Vorschau',
  },
  en: {
    dropZone: 'Upload image',
    dragging: 'Drop to upload',
    prompt: 'Click or drop an image',
    remove: 'Remove',
    previewAlt: 'Preview',
  },
} as const satisfies ComponentMessages<ImageUploadMessages>
