import type { SectionDef } from '../types'
import { TasteBuchArt } from './TasteBuchArt'
import { TasteNachtglut } from './TasteNachtglut'
import { TasteEditorial } from './TasteEditorial'
import { TasteVergleich } from './TasteVergleich'

export const tasteSection: SectionDef = {
  id: 'taste',
  label: 'Geschmacksprofil',
  description: 'Der Geschmacksdiamant: Süße, Säure, Körper, Tannin, Frucht und Alkohol je Wein auf einer Skala von 0 bis 10.',
  variants: [
    {
      id: 'buchart',
      label: 'Buch·Art — Der Diamant',
      description: 'Papier, Goldlinien, rote Eckpunkte wie das Lesebändchen. Weinliste mit dem Namensband des Etiketts, der Diamant zeichnet sich beim Einscrollen und wechselt fließend von Wein zu Wein.',
      Component: TasteBuchArt,
    },
    {
      id: 'nachtglut',
      label: 'Nachtglut (Cinematic)',
      description: 'Warmes Schwarz, atmender Lichthof hinter dem Diamanten, weicher Glow unter der Goldlinie. Weinwahl als Pillen, der Name blendet beim Wechsel über.',
      Component: TasteNachtglut,
    },
    {
      id: 'editorial',
      label: 'Maison Editorial — Verkostungsnotiz',
      description: 'Sechs hairline-getrennte Einträge mit übergroßen italic Ziffern, daneben ein kleiner Diamant in Tinte. Eintrag und Achse markieren sich gegenseitig.',
      Component: TasteEditorial,
    },
    {
      id: 'vergleich',
      label: 'Wein gegen Wein',
      description: 'Zwei Weine auf einem Diamanten (A grün, B rot), darunter eine Tabelle mit Balken und exakten Werten je Achse.',
      Component: TasteVergleich,
    },
  ],
}
