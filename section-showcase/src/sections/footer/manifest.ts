import { FooterV1 } from './FooterV1'
import type { SectionDef } from '../types'

export const footerSection: SectionDef = {
  id: 'footer',
  label: 'Footer',
  variants: [
    {
      id: 'v1',
      label: 'Standard Premium',
      Component: FooterV1,
    },
  ],
}
