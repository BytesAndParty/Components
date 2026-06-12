import { TimelineV1 } from './TimelineV1'
import { TimelineV2 } from './TimelineV2'
import { TimelineV3 } from './TimelineV3'
import type { SectionDef } from '../types'

export const timelineSection: SectionDef = {
  id: 'timeline',
  label: 'Heritage & Timeline',
  variants: [
    {
      id: 'v1',
      label: 'Storytelling Split',
      Component: TimelineV1,
    },
    {
      id: 'v2',
      label: 'Minimal Chronology',
      description: 'Subtile Linienführung und Shiny-Years für historische Eleganz.',
      Component: TimelineV2,
    },
    {
      id: 'v3',
      label: 'Jahrhundert-Register',
      description: 'Typografisches Ledger statt Linie: konturierte Jahres-Ziffern füllen sich bei Hover, das Heute trägt eine Foto-Tafel.',
      Component: TimelineV3,
    },
  ],
}
