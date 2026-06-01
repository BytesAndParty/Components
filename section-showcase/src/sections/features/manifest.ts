import { FeaturesV1 } from './FeaturesV1'
import { FeaturesV2 } from './FeaturesV2'
import { FeaturesV3 } from './FeaturesV3'
import type { SectionDef } from '../types'

export const featuresSection: SectionDef = {
  id: 'features',
  label: 'Features & Story',
  variants: [
    {
      id: 'v1',
      label: 'Minimalist Glow Cards',
      Component: FeaturesV1,
    },
    {
      id: 'v2',
      label: 'Story-Driven Split',
      Component: FeaturesV2,
    },
    {
      id: 'v3',
      label: 'Vintage Index',
      description: 'Editorial Hairline-Tabelle mit Index-Nummern und Serif-Headlines (Cream / Buchart Style).',
      Component: FeaturesV3,
    },
  ],
}
