import { FooterV1 } from './FooterV1'
import { FooterV2 } from './FooterV2'
import { FooterV3 } from './FooterV3'
import { FooterV4 } from './FooterV4'
import type { SectionDef } from '../types'

export const footerSection: SectionDef = {
  id: 'footer',
  label: 'Footer',
  description: 'Abschluss-Sektion – Kontakt, Navigation, Markenton.',
  variants: [
    {
      id: 'v1',
      label: 'Standard Premium',
      description: 'Vollausgestatteter Footer mit Spalten, Social-Icons und Copyright.',
      Component: FooterV1,
    },
    {
      id: 'v2',
      label: 'Atelier Brief',
      description: 'Editorial Cream-Layout mit Newsletter-Eintrag und Hairlines.',
      Component: FooterV2,
    },
    {
      id: 'v3',
      label: 'Cellar Minimal',
      description: 'Dunkler Keller-Ton, übergroßer Wortmark, ein Zitat.',
      Component: FooterV3,
    },
    {
      id: 'v4',
      label: 'Le Colophon (Domaine Privée)',
      description: 'Tiefes Bordeaux statt Schwarz: übergroßer Serif-Wortmark, Cream-Hairlines, Kolophon-Zitat und Druckwerk-Schlusszeile.',
      Component: FooterV4,
    },
  ],
}
