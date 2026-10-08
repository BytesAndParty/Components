import type { SectionDef } from '../types'
import { EtikettenBuchArt } from './EtikettenBuchArt'

export const etikettenSection: SectionDef = {
  id: 'etiketten',
  label: 'Etiketten',
  description: 'Persönliche Weinetiketten — Linie, Anlass, Text und Foto mit Live-Muster und Preisrechnung.',
  variants: [
    {
      id: 'buchart',
      label: 'Buch·Art',
      description: 'Die zwei Etikettenlinien des Originals (mehrfärbig mit Bild / schwarz mit Goldprägung) als Druckmuster mit Schnittmarken; Rechnung nach dem Rechenbeispiel: Flaschen + einmalig 3 € Design.',
      Component: EtikettenBuchArt,
    },
  ],
}
