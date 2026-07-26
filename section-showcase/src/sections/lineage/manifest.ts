import type { SectionDef } from '../types'
import { LineageV1 } from './LineageV1'

export const lineageSection: SectionDef = {
  id: 'lineage',
  label: 'Stammbaum',
  description: 'Interaktiver Rebsorten-Stammbaum – Herkunft, Lagen und Weine je Rebsorte.',
  variants: [
    {
      id: 'v1',
      label: 'Espalier (Ahnentafel)',
      description:
        'Vertikaler Stammbaum der Thermenregion-Rebsorten. Klick zoomt an die Rebe heran, hebt den Ahnen-Pfad hervor und zeigt Lagen & Weine. Voll tastaturbedienbar, mit Listen-Fallback.',
      Component: LineageV1,
    },
  ],
}
