import { CTAV1 } from './CTAV1'
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
  ],
}
