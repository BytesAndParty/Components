import { ProductV1 } from './ProductV1'
import { ProductV2 } from './ProductV2'
import { ProductV3 } from './ProductV3'
import { ProductV4 } from './ProductV4'
import { ProductV5 } from './ProductV5'
import type { SectionDef } from '../types'

export const showcaseSection: SectionDef = {
  id: 'showcase',
  label: 'Product Showcase',
  variants: [
    {
      id: 'v1',
      label: 'Interactive Detail Page',
      Component: ProductV1,
    },
    {
      id: 'v2',
      label: 'Artisanal Detail',
      description: 'Fokus auf das reine Produkt, extreme Typografie und offenes Layout.',
      Component: ProductV2,
    },
    {
      id: 'v3',
      label: 'Editorial Spread',
      description: 'Aufgeschlagene Magazin-Doppelseite: Fotografie links, Fiche Technique mit Jahrgangs-Ziffer und Hairline-Daten rechts.',
      Component: ProductV3,
    },
    {
      id: 'v4',
      label: 'Grand Cru (Domaine Privée)',
      description: 'Flasche im Rundbogen mit Lupen-Zoom aufs Etikett, Degustationsprofil als Hairline-Skalen und Keller-Ledger.',
      Component: ProductV4,
    },
    {
      id: 'v5',
      label: 'Chiaroscuro (Cinematic)',
      description: 'Eine Flasche im Kerzengold-Spot auf warmem Schwarz: Backlight-Glow, Abspann-Ledger, glühende Ghost-Jahrgangsziffer.',
      Component: ProductV5,
    },
  ],
}
