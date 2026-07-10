import { TestimonialsV1 } from './TestimonialsV1'
import { TestimonialsV2 } from './TestimonialsV2'
import { TestimonialsV3 } from './TestimonialsV3'
import { TestimonialsV5 } from './TestimonialsV5'
import { TestimonialsV6 } from './TestimonialsV6'
import type { SectionDef } from '../types'

export const testimonialsSection: SectionDef = {
  id: 'testimonials',
  label: 'Testimonials',
  variants: [
    {
      id: 'v1',
      label: 'Expert Quotes',
      Component: TestimonialsV1,
    },
    {
      id: 'v2',
      label: 'Artisanal Serif',
      description: 'Großformatige Typografie, asymmetrisch und minimalistisch.',
      Component: TestimonialsV2,
    },
    {
      id: 'v3',
      label: 'Editorial Letter',
      description: 'Eingerahmtes Lead-Zitat mit Paper-Stamp, zwei stille Folgestimmen (Cream / Buchart Style).',
      Component: TestimonialsV3,
    },
    {
      id: 'v5',
      label: 'Livre d’Or (Domaine Privée)',
      description: 'Aufgeschlagenes Gästebuch: Papier-Doppelseite mit Buchfalz-Hairline, Lead-Stimme links, zwei stille Einträge rechts.',
      Component: TestimonialsV5,
    },
    {
      id: 'v6',
      label: 'Maison Stimmen',
      description: 'Pull-Quote überlappt die Portrait-Tafel (HeroV6-Sprache), vertikale Rail, zwei stille Stimmen an der Hairline-Basis.',
      Component: TestimonialsV6,
    },
  ],
}
