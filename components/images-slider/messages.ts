import type { ComponentMessages } from '../i18n'

export interface ImagesSliderMessages {
  carousel: string
  /** Slide N of total. Supports {current} and {total}. */
  slide: string
  loading: string
}

export const MESSAGES = {
  de: {
    carousel: 'Bilder-Karussell',
    slide: 'Folie {current} von {total}',
    loading: 'Wird geladen…',
  },
  en: {
    carousel: 'Image carousel',
    slide: 'Slide {current} of {total}',
    loading: 'Loading…',
  },
} as const satisfies ComponentMessages<ImagesSliderMessages>
