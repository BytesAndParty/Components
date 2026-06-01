import { TestimonialsV1 } from './TestimonialsV1'
import { TestimonialsV2 } from './TestimonialsV2'
import { TestimonialsV3 } from './TestimonialsV3'
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
  ],
}
