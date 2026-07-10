import { GalleryV1 } from './GalleryV1'
import { GalleryV3 } from './GalleryV3'
import { GalleryV4 } from './GalleryV4'
import { GalleryV5 } from './GalleryV5'
import { GalleryV6 } from './GalleryV6'
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
    {
      id: 'v5',
      label: 'Das Triptychon (Domaine Privée)',
      description: 'Drei Rundbogen-Fenster in strenger Symmetrie, Mitteltafel erhöht — Museums-Labels mit römischen Nummern und Italic-Captions.',
      Component: GalleryV5,
    },
    {
      id: 'v6',
      label: 'Maison Spread',
      description: 'Magazin-Doppelseite: versetzt hängende, überlappende Tafeln mit Fig.-Nummern, Ghost-Word „Herbst“ und Hairline-Fußzeile.',
      Component: GalleryV6,
    },
  ],
}
