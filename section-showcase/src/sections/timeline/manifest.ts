import { TimelineV1 } from './TimelineV1'
import { TimelineV2 } from './TimelineV2'
import { TimelineV3 } from './TimelineV3'
import { TimelineV4 } from './TimelineV4'
import { TimelineV5 } from './TimelineV5'
import { TimelineV6 } from './TimelineV6'
import { TimelineCinematic } from './TimelineCinematic'
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
    {
      id: 'v4',
      label: 'Die Chronik (Domaine Privée)',
      description: 'Familienregister mit zentraler Hairline-Spine, Rauten-Siegeln und ovalen Medaillon-Tafeln — alternierend gesetzt.',
      Component: TimelineV4,
    },
    {
      id: 'v5',
      label: 'Nachtchronik (Cinematic)',
      description: 'Vier Filmszenen: entsättigte 21:9-Bildbänder, glühende Serif-Jahre, Rollen-Marker — Hover holt die Szene aus dem Grade.',
      Component: TimelineV5,
    },
    {
      id: 'v6',
      label: 'Maison Editorial',
      description: 'Chronik als Magazin-Register: Hairline-getrennte Einträge, übergroße italic Jahres-Ziffern mit römischem Marker, Foto-Tafel fürs Heute.',
      Component: TimelineV6,
    },
    {
      id: 'cinematic',
      label: 'Cinematic Atmosphere',
      description: 'Alternierendes Filmstreifen-Layout (HeroV3-Sprache): Bild und Jahr wechseln die Seite, Sprocket-Ticks am Rand, Partikel über der Spalte.',
      Component: TimelineCinematic,
    },
  ],
}
