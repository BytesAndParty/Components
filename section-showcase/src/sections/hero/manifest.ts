import type { SectionDef } from '../types'
import { HeroV1 } from './HeroV1'
import { HeroV2 } from './HeroV2'

export const heroSection: SectionDef = {
  id: 'hero',
  label: 'Hero',
  description: 'Erster Sichtbereich – Markenversprechen und primärer CTA.',
  variants: [
    {
      id: 'v1',
      label: 'Editorial Split',
      description: 'Zweispaltig: linke Typografie, rechte Bildfläche.',
      Component: HeroV1,
    },
    {
      id: 'v2',
      label: 'Centered Statement',
      description: 'Großformatige zentrierte Aussage mit weichem Akzent-Glow.',
      Component: HeroV2,
    },
  ],
}
