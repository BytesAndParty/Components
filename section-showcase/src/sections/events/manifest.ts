import { EventsPinnwand } from './EventsPinnwand'
import type { SectionDef } from '../types'

export const eventsSection: SectionDef = {
  id: 'events',
  label: 'Veranstaltungen',
  variants: [
    {
      id: 'pinnwand',
      label: 'Die Pinnwand',
      description: 'Termine wie von Hand an die Hofwand geheftet: PaperNote-Collage (torn + notepad) neben Serif-Headline, Hairline-Terminliste und leisem CTA.',
      Component: EventsPinnwand,
    },
  ],
}
