import { ProductV1 } from './ProductV1'
import { ProductV2 } from './ProductV2'
import { ProductV3 } from './ProductV3'
import { ProductV4 } from './ProductV4'
import { ProductV5 } from './ProductV5'
import { ProductV6 } from './ProductV6'
import { ProductNachtblau } from './ProductNachtblau'
import { ProductGenussgut } from './ProductGenussgut'
import { ProductSchwarzweiss } from './ProductSchwarzweiss'
import { ProductGastgeber } from './ProductGastgeber'
import { ProductCinematic } from './ProductCinematic'
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
    {
      id: 'v6',
      label: 'Maison Editorial',
      description: 'Ein Wein als geschichteter Magazin-Held: Name überlappt die Flaschen-Tafel, Etikett-Detail versetzt, Fiche Technique als Hairline-Basis. Cream-Grund, asymmetrisch.',
      Component: ProductV6,
    },
    {
      id: 'nachtblau',
      label: 'Nachtblau',
      description: 'Eine Flasche im kühlen Streiflicht: Serif-Name auf Navy links, randlose Produkttafel rechts, darunter die Fiche Technique als Sans-Haarlinien neben dem Fasslager.',
      Component: ProductNachtblau,
    },
    {
      id: 'genussgut',
      label: 'Genussgut',
      description: 'Ein Wein als ruhige Warenkunde: Flasche im Hochformat auf Aprikose-hell, Name in großer Kleinschreib-Grotesk, Notizen als Hairline-Zeilen, Gebinde-Auswahl als einziger Auftritt von Orangerot.',
      Component: ProductGenussgut,
    },
    {
      id: 'schwarzweiss',
      label: 'Schwarzweiß',
      description: 'Ein einzelner Wein auf Weiß: entsättigte Reportagefotografie, Name in großer Serif, technische Daten als schwarze Haarlinien-Zeilen — der schwarze Flächen-Button ist der einzige harte Kontrast.',
      Component: ProductSchwarzweiss,
    },
    {
      id: 'gastgeber',
      label: 'Gastgeber',
      description: 'Ein Wein auf der Mittelachse: Flasche groß und warm auf Creme-Feld, Verkostungsnotiz als ruhige zentrierte Spalte, technische Daten in zwei ausbalancierten Spalten.',
      Component: ProductGastgeber,
    },
    {
      id: 'cinematic',
      label: 'Cinematic Atmosphere',
      description: 'Detailseite als Standbild: die Flasche vor der Landschaft statt vor flachem Schwarz, Fiche als Abspann mit Rollen- und Einstellungsnummer.',
      Component: ProductCinematic,
    },
  ],
}
