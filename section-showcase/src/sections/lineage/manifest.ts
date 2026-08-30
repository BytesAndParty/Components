import type { SectionDef } from '../types'
import { LineageV1 } from './LineageV1'
import { LineageV2 } from './LineageV2'
import { LineageV3 } from './LineageV3'

export const lineageSection: SectionDef = {
  id: 'lineage',
  label: 'Stammbaum',
  description: 'Interaktiver Rebsorten-Stammbaum – Herkunft, Lagen und Weine je Rebsorte.',
  variants: [
    {
      id: 'v2',
      label: 'Die vier Häuser (Galerie)',
      description:
        'Galerie pro Familie statt Gesamtkarte: erst ein Haus wählen, dann stehen nur 6–10 Sorten auf der Bühne — in echter Schriftgröße statt heruntergezoomt. Kreuzungen als beschrifteter Punkt, Brücken zu anderen Häusern gestrichelt. Abstammung gegen VIVC korrigiert.',
      Component: LineageV2,
    },
    {
      id: 'v3',
      label: 'Eine Rebe, ein Bildschirm (Fokus)',
      description:
        'Der Gegenentwurf: nie eine Gesamtkarte, immer eine Sorte gross im Zentrum mit Eltern, Kindern und Geschwistern drumherum. Ein Klick reist weiter. Verbindungen sind beschriftet („Klosterneuburg · 1922"), das Wissensende beim Urahn ist sichtbar markiert. Reflowt statt zu skalieren.',
      Component: LineageV3,
    },
    {
      id: 'v1',
      label: 'Espalier (Ahnentafel)',
      description:
        'Vertikaler Stammbaum der Thermenregion-Rebsorten. Klick zoomt an die Rebe heran, hebt den Ahnen-Pfad hervor und zeigt Lagen & Weine. Voll tastaturbedienbar, mit Listen-Fallback.',
      Component: LineageV1,
    },
  ],
}
