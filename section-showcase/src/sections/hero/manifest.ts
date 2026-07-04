import type { SectionDef } from '../types'
import { HeroV1 } from './HeroV1'
import { HeroV2 } from './HeroV2'
import { HeroV3 } from './HeroV3'
import { HeroV4 } from './HeroV4'
import { HeroV5 } from './HeroV5'
import { HeroV6 } from './HeroV6'
import { HeroV7 } from './HeroV7'
import { HeroV8 } from './HeroV8'

export const heroSection: SectionDef = {
  id: 'hero',
  label: 'Hero',
  description: 'Erster Sichtbereich – Markenversprechen und primärer CTA.',
  variants: [
    {
      id: 'v1',
      label: 'Editorial Split',
      description: 'Zweispaltig: linke Typografie, rechte Bildfläche.',
      Component: HeroV1,
    },
    {
      id: 'v2',
      label: 'Centered Statement',
      description: 'Großformatige zentrierte Aussage mit weichem Akzent-Glow.',
      Component: HeroV2,
    },
    {
      id: 'v3',
      label: 'Cinematic Atmosphere',
      description: 'Full-screen mit atmosphärischen Partikeln und Shiny Text.',
      Component: HeroV3,
    },
    {
      id: 'v4',
      label: 'Artisanal Minimal',
      description: 'Extremer Whitespace, Serif-Typografie und asymmetrischer Fokus (Buchart Style).',
      Component: HeroV4,
    },
    {
      id: 'v5',
      label: 'Modern Tech',
      description: 'Dunkles Design mit Aurora-Text, Partikeln und magnetischen Interaktionen.',
      Component: HeroV5,
    },
    {
      id: 'v6',
      label: 'Maison Editorial',
      description: 'Geschichtete Magazin-Komposition: Headline überlappt die Fotografie, vertikale Meta-Leiste, Curtain-Reveals.',
      Component: HeroV6,
    },
    {
      id: 'v7',
      label: 'Domaine Privée',
      description: 'Symmetrische Gut-Komposition um ein Rundbogen-Fenster: Kalkstein-Cream, Bordeaux-Tinte, Headline krönt den Bogen.',
      Component: HeroV7,
    },
    {
      id: 'v8',
      label: 'Nocturne (Cinematic)',
      description: 'Kellerkino: Kerzengold-Lichtstrahlen aus der Luke, Staub im Lichtkegel, Title-Card unten links, Ghost-Ziffer „58“.',
      Component: HeroV8,
    },
  ],
}
