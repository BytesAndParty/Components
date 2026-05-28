import { CTAV1 } from './CTAV1'
import { CTAV2 } from './CTAV2'
import type { SectionDef } from '../types'

export const ctaSection: SectionDef = {
  id: 'cta',
  label: 'Call to Action',
  variants: [
    {
      id: 'v1',
      label: 'Elegant Card Invite',
      Component: CTAV1,
    },
    {
      id: 'v2',
      label: 'Pure Invitation',
      description: 'Extremer Fokus auf Text, Aurora-Background und Black-Label CTA.',
      Component: CTAV2,
    },
  ],
}
