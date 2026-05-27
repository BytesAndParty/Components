import { TimelineV1 } from './TimelineV1'
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
  ],
}
