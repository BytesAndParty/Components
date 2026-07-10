import { FeaturesV1 } from './FeaturesV1'
import { FeaturesV2 } from './FeaturesV2'
import { FeaturesV3 } from './FeaturesV3'
import { FeaturesV4 } from './FeaturesV4'
import { FeaturesV5 } from './FeaturesV5'
import { FeaturesV6 } from './FeaturesV6'
import { FeaturesV7 } from './FeaturesV7'
import { FeaturesV8 } from './FeaturesV8'
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
    {
      id: 'v4',
      label: 'Interactive Grid',
      description: 'Modernes Grid mit Glow-Karten und Hover-Effekten.',
      Component: FeaturesV4,
    },
    {
      id: 'v5',
      label: 'Die Rieden (Domaine Privée)',
      description: 'Drei Terroirs als Rundbogen-Tafeln mit römischen Siegeln, gravierten Datenzeilen und stillen Hovers.',
      Component: FeaturesV5,
    },
    {
      id: 'v6',
      label: 'Maison Editorial',
      description: 'Geschichteter Magazin-Essay: Headline überlappt die Fotografie von rechts, hängende Zweit-Tafel, Grundsätze als Fig. 02–04.',
      Component: FeaturesV6,
    },
    {
      id: 'v7',
      label: 'Artisanal Minimal',
      description: 'Typografisches Manifest: Serif-Statement als Treppensatz, drei versetzte Randnotizen, extremer Weißraum — bewusst ohne Bild (Buchart Style).',
      Component: FeaturesV7,
    },
    {
      id: 'v8',
      label: 'Nocturne (Cinematic)',
      description: 'Drei Kellerszenen als Film-Stills: Kerzengold-Hairlines, Ghost-Numerale, Lower-Third-Captions und Staub im Dunkel.',
      Component: FeaturesV8,
    },
  ],
}
