import { NavV1 } from './NavV1'
import { NavV2 } from './NavV2'
import { NavV3 } from './NavV3'
import { NavV4 } from './NavV4'
import { NavV5 } from './NavV5'
import { NavV6 } from './NavV6'
import type { SectionDef } from '../types'

export const navSection: SectionDef = {
  id: 'nav',
  label: 'Navigation',
  description: 'Kopfzeile – Marke, Hauptnavigation und Einstieg in den Shop.',
  variants: [
    {
      id: 'v1',
      label: 'Standard Premium',
      description: 'Semantische Token-Leiste (Dark/Light): Sans-Wortmark, Suche, Warenkorb-Badge und Accent-CTA.',
      Component: NavV1,
    },
    {
      id: 'v2',
      label: 'Artisanal Minimal',
      description: 'Cream-Kopfzeile: Serif-Wortmark, Versalien-Links mit wachsender Underline, Ab-Hof-CTA als Textlink.',
      Component: NavV2,
    },
    {
      id: 'v3',
      label: 'Maison Masthead',
      description: 'Magazin-Impressum über volle Breite: Meta-Zeile zwischen Hairlines, übergroßer italic Wortmark, Links mit wachsenden Strichen, Warenkorb mit Fußnoten-Ziffer.',
      Component: NavV3,
    },
    {
      id: 'v4',
      label: 'Domaine Privée',
      description: 'Graviert auf Pergament: Siegel-Monogramm, Underline-Tabs als Links, Bordeaux-CTA zur Degustation.',
      Component: NavV4,
    },
    {
      id: 'v5',
      label: 'Nocturne (Cinematic)',
      description: 'Fast-Schwarz mit Kerzengold: gedimmte Links glimmen im Hover auf, wachsende Gold-Hairline zur Weinkarte.',
      Component: NavV5,
    },
    {
      id: 'v6',
      label: 'Editorial',
      description: 'Zeitungskopf auf Papierton: Folio-Zeile, zentrierter Serif-Wortmark, Ressort-Leiste zwischen Doppellinien mit Seitenzahlen als Fußnoten.',
      Component: NavV6,
    },
  ],
}
