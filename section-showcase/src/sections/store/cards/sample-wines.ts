import type { WineCardData } from './types'
import veltlinerElias from '../../assets/weine/veltliner-elias.webp'
import gruenerVeltliner from '../../assets/weine/gruener-veltliner.webp'
import riesling from '../../assets/weine/riesling.webp'
import zweigeltHolzfass from '../../assets/weine/zweigelt-holzfass.webp'
import zweigelt from '../../assets/weine/zweigelt.webp'
import rose from '../../assets/weine/rose.webp'

/** Ein Beispiel-Sortiment, geteilt von den Einzeldesign-Storefronts. */
export interface SampleWine {
  wine: WineCardData
  /** Bild-Signatur für WineCardEditorial */
  plate: string
  /** Fiche-Nummer für WineCardEditorial */
  fiche: string
  /** Bewertungs-Zeile für WineCardModern */
  rating: string
}

export const SAMPLE_WINES: SampleWine[] = [
  {
    wine: {
      name: 'Loibenberg Smaragd',
      vintage: 2021,
      lage: 'Ried Loibenberg',
      price: '€ 38,—',
      description: 'Rauch über nassem Stein, Quitte und weißer Pfeffer. Charakter aus alten Reben.',
      imageSrc: veltlinerElias,
      imageAlt: 'Loibenberg Smaragd',
    },
    plate: 'Platte I · Loibenberg',
    fiche: '№ 1 / 06',
    rating: '4.9 · Große Lage',
  },
  {
    wine: {
      name: 'Grüner Veltliner',
      vintage: 2023,
      edition: 'Urgestein',
      lage: 'Ried Kreutles',
      price: '€ 19,—',
      description: 'Weißer Pfeffer, grüner Apfel, knackige Frische — der Alltagsklassiker.',
      imageSrc: gruenerVeltliner,
      imageAlt: 'Grüner Veltliner',
    },
    plate: 'Platte II · Kreutles',
    fiche: '№ 2 / 06',
    rating: '4.7 · Klassiker',
  },
  {
    wine: {
      name: 'Riesling Federspiel',
      vintage: 2022,
      lage: 'Ried Pfaffenberg',
      price: '€ 22,—',
      description: 'Zitrus, Pfirsich, Feuerstein. Straffer Terrassenwein mit Länge.',
      imageSrc: riesling,
      imageAlt: 'Riesling Federspiel',
    },
    plate: 'Platte III · Pfaffenberg',
    fiche: '№ 3 / 06',
    rating: '4.8 · Terrassenwein',
  },
  {
    wine: {
      name: 'Blaufränkisch Reserve',
      vintage: 2020,
      lage: 'Leithaberg',
      price: '€ 32,—',
      description: 'Brombeere, Schokolade, feine Tannine. Achtzehn Monate im Barrique.',
      imageSrc: zweigeltHolzfass,
      imageAlt: 'Blaufränkisch Reserve',
    },
    plate: 'Platte IV · Leithaberg',
    fiche: '№ 4 / 06',
    rating: '4.8 · Barrique',
  },
  {
    wine: {
      name: 'Zweigelt vom Urgestein',
      vintage: 2022,
      lage: 'Ried Steinriegl',
      price: '€ 16,—',
      description: 'Kirsche, Pflaume, weich und fruchtbetont. Der offene Allrounder.',
      imageSrc: zweigelt,
      imageAlt: 'Zweigelt vom Urgestein',
    },
    plate: 'Platte V · Steinriegl',
    fiche: '№ 5 / 06',
    rating: '4.5 · Allrounder',
  },
  {
    wine: {
      name: 'Rosé de Saignée',
      vintage: 2023,
      lage: 'Ried Höhereck',
      price: '€ 17,—',
      description: 'Erdbeere, Wassermelone, trocken und belebend. Sommer in der Flasche.',
      imageSrc: rose,
      imageAlt: 'Rosé de Saignée',
    },
    plate: 'Platte VI · Höhereck',
    fiche: '№ 6 / 06',
    rating: '4.6 · Sommer',
  },
]
