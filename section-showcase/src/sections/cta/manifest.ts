import { CTAV1 } from './CTAV1'
import { CTAV3 } from './CTAV3'
import { CTAV4 } from './CTAV4'
import { CTAV5 } from './CTAV5'
import { CTACinematic } from './CTACinematic'
import type { SectionDef } from '../types'
import { CTABuchArt } from './CTABuchArt'

export const ctaSection: SectionDef = {
  id: 'cta',
  label: 'Call to Action',
  variants: [
    {
      id: 'v1',
      label: 'Elegant Card Invite',
      Component: CTAV1,
    },
    {
      id: 'v3',
      label: 'Die Einladung',
      description: 'Full-bleed Fotografie, Typografie unten links statt zentriert, RSVP-Ecknotiz und Hairline-Fußzeile — Lookbook-Schlussseite.',
      Component: CTAV3,
    },
    {
      id: 'v4',
      label: 'Die Karte (Domaine Privée)',
      description: 'Letterpress-Einladungskarte mit Doppel-Hairline-Rahmen, Monogramm-Siegel und gravierten Wann/Wo-Spalten.',
      Component: CTAV4,
    },
    {
      id: 'v5',
      label: 'Maison Finale',
      description: 'Magazin-Schlussseite in HeroV6-Sprache: Headline überlappt die hängende Tafel, wachsender Hairline-CTA, Kolophon-Zeile.',
      Component: CTAV5,
    },
    {
      id: 'cinematic',
      label: 'Cinematic Atmosphere',
      description: 'Kurzes Finale in HeroV3-Sprache: zentrierte Komposition, atmosphärische Fotografie mit Partikeln und Shiny Text.',
      Component: CTACinematic,
    },
    {
      id: 'buchart',
      label: 'Buch·Art — Wir sind für Sie da',
      description: 'Der Block, der auf jeder Original-Seite steht, als ein lautes Feld in Etikettenrot: drei Durchwahlen mit Monogramm statt Foto.',
      Component: CTABuchArt,
    },
  ],
}
