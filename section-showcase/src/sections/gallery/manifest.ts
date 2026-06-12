import { GalleryV1 } from './GalleryV1'
import { GalleryV2 } from './GalleryV2'
import { GalleryV3 } from './GalleryV3'
import { GalleryV4 } from './GalleryV4'
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
    {
      id: 'v3',
      label: 'Editorial Plates',
      description: 'Tafelband mit römischen Plate-Nummern, Ort/Saison-Meta und Italic-Captions (Cream / Buchart Style).',
      Component: GalleryV3,
    },
    {
      id: 'v4',
      label: 'Nachtkeller Collage',
      description: 'Überlappende, leicht rotierte Tafeln auf warmem Schwarz — wie von Hand gepinnt, mit Ghost-Word und Kellermeister-Notiz.',
      Component: GalleryV4,
    },
  ],
}
