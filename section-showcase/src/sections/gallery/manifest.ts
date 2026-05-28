import { GalleryV1 } from './GalleryV1'
import { GalleryV2 } from './GalleryV2'
import type { SectionDef } from '../types'

export const gallerySection: SectionDef = {
  id: 'gallery',
  label: 'Bento Gallery',
  variants: [
    {
      id: 'v1',
      label: 'Artisanal Bento',
      Component: GalleryV1,
    },
    {
      id: 'v2',
      label: 'Atmospheric Asymmetry',
      description: 'Offenes Grid mit extremem Weichzeichner und Aurora-Watermark.',
      Component: GalleryV2,
    },
  ],
}
