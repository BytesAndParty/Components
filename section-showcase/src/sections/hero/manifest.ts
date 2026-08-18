import type { SectionDef } from '../types'
import { HeroV1 } from './HeroV1'
import { HeroV3 } from './HeroV3'
import { HeroV4 } from './HeroV4'
import { HeroV6 } from './HeroV6'
import { HeroV7 } from './HeroV7'
import { HeroV8 } from './HeroV8'
import { HeroNachtblau } from './HeroNachtblau'
import { HeroGenussgut } from './HeroGenussgut'
import { HeroSchwarzweiss } from './HeroSchwarzweiss'
import { HeroGastgeber } from './HeroGastgeber'

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
    {
      id: 'nachtblau',
      label: 'Nachtblau',
      description: 'Halbseitiger Split aus kühl gegradeter Fotografie und Navy-Feld, darunter ein zentrierter Serif-Zwischenruf; weißer Pill-CTA plus kursiver Serif-Link mit nachlaufendem Strich.',
      Component: HeroNachtblau,
    },
    {
      id: 'genussgut',
      label: 'Genussgut',
      description: 'Große Grotesk in konsequenter Kleinschreibung führt, die kursive Serif steht nur als Kicker darüber; Einstieg nach Geschäftsbereichen, Wortmarke als angeschnittenes Wasserzeichen.',
      Component: HeroGenussgut,
    },
    {
      id: 'schwarzweiss',
      label: 'Schwarzweiß',
      description: 'Reines Weiß ohne einen einzigen Farbton: gezeichnete Kellertür als Bildmarke, sehr große zentrierte Serif auf strenger Mittelachse, senkrechter Flaschen-Reiter für die Öffnungszeiten.',
      Component: HeroSchwarzweiss,
    },
    {
      id: 'gastgeber',
      label: 'Gastgeber',
      description: 'Warmes Creme, ein einziger Akzent in Ziegelrot, Symmetrie als Prinzip: mittige Wortmarke, gleichrangige Bereichsleiste, Buttons als handgezeichnete Stempel.',
      Component: HeroGastgeber,
    },
  ],
}
