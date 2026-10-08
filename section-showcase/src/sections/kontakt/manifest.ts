import type { SectionDef } from '../types'
import { KontaktBuchArt } from './KontaktBuchArt'

export const kontaktSection: SectionDef = {
  id: 'kontakt',
  label: 'Kontakt',
  description: 'Kontakt & Anreise — Adresse, Öffnungszeiten, Durchwahlen, Lage.',
  variants: [
    {
      id: 'buchart',
      label: 'Buch·Art',
      description: 'Adresse und Ab-Hof-Zeiten groß, Durchwahlen nach Zuständigkeit, schematische Lagekarte in Goldlinie statt Karten-iFrame.',
      Component: KontaktBuchArt,
    },
  ],
}
