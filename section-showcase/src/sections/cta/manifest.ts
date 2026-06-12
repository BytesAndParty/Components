import { CTAV1 } from './CTAV1'
import { CTAV2 } from './CTAV2'
import { CTAV3 } from './CTAV3'
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
    {
      id: 'v3',
      label: 'Die Einladung',
      description: 'Full-bleed Fotografie, Typografie unten links statt zentriert, RSVP-Ecknotiz und Hairline-Fußzeile — Lookbook-Schlussseite.',
      Component: CTAV3,
    },
  ],
}
