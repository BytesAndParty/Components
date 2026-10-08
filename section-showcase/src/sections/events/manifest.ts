import { EventsPinnwand } from './EventsPinnwand'
import { EventsEinladung } from './EventsEinladung'
import { EventsWandertag } from './EventsWandertag'
import { EventsProgramm } from './EventsProgramm'
import type { SectionDef } from '../types'
import { EventsBuchArt } from './EventsBuchArt'

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
    {
      id: 'einladung',
      label: 'Die Einladung',
      description: 'Verkostung im Keller als handgemachte Einladungskarte: MarkerCallout (brush + tape), Highlighter-Textmarker, PolaroidFrame und ProcessSteps (paper).',
      Component: EventsEinladung,
    },
    {
      id: 'wandertag',
      label: 'Der Wandertag',
      description: 'Riedenwanderung als nachgehbarer Weg: ProcessSteps (trail) vom Hoftor bis in den Keller, darunter Polaroids von der Strecke.',
      Component: EventsWandertag,
    },
    {
      id: 'programm',
      label: 'Das Programm',
      description: 'Herbstabend in Maison-Sprache: ProcessSteps (ledger) mit römischen Ziffern über Hairlines, ein MarkerCallout (watercolor) als einziger handgemachter Moment.',
      Component: EventsProgramm,
    },
    {
      id: 'buchart',
      label: 'Buch·Art — Erlebnisse',
      description: 'Kleine und große Weinprobe, Riedenwanderung mit allen Original-Bedingungen als Karte im Kohle-Etikett; die Auswahl stellt das Anfrageformular ein.',
      Component: EventsBuchArt,
    },
  ],
}
