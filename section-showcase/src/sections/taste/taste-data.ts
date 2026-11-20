import { WINES, type LabelCode } from '../buchart-data'

/** The six axes of the taste diamond, in the order they are drawn (clockwise from the top). */
export const AXES = ['Sweetness', 'Acidity', 'Body', 'Tannin', 'Fruit', 'Alcohol'] as const
export type AxisKey = (typeof AXES)[number]

/** German axis labels, same wording as TASTE_LABELS.de in Buchart58 (shared/src/constants/taste.ts). */
export const AXIS_LABEL: Record<AxisKey, string> = {
  Sweetness: 'Süße',
  Acidity: 'Säure',
  Body: 'Körper',
  Tannin: 'Tannin',
  Fruit: 'Frucht',
  Alcohol: 'Alkohol',
}

/** Scale is 0–10 on every axis. */
export const AXIS_COUNT = AXES.length
export const ZERO_VALUES: number[] = AXES.map(() => 0)

type Profile = Record<AxisKey, readonly [value: number, text: string]>

/**
 * Taste profiles copied from the `tasteprofile` field in Buchart58/server/src/seed-data/wines.json
 * (Riesling trocken, Eiswein, Simon, Blauer Portugieser, Zweigelt Holzfass, Coorbeau noir trocken).
 * Keys are the slugs of WINES in buchart-data.ts, so name, vintage, label code and note come from there.
 * The seed Eiswein entry is 0,375 l without the 2019 vintage the shop list shows — the profile is the
 * wine type's, not a vintage-specific tasting.
 */
const PROFILES: Record<string, Profile> = {
  riesling: {
    Sweetness: [1, 'Kaum Restsüße.'],
    Acidity: [8, 'Lebendige, ausgeprägte Säure.'],
    Body: [4, 'Leicht.'],
    Tannin: [1, 'Kein spürbares Tannin.'],
    Fruit: [7, 'Fruchtig.'],
    Alcohol: [6, 'Mittlerer Alkohol.'],
  },
  eiswein: {
    Sweetness: [10, 'Sehr süß, edelsüß.'],
    Acidity: [9, 'Lebendige, ausgeprägte Säure.'],
    Body: [7, 'Kräftig.'],
    Tannin: [1, 'Kein spürbares Tannin.'],
    Fruit: [9, 'Intensive Frucht.'],
    Alcohol: [3, 'Wenig Alkohol.'],
  },
  simon: {
    Sweetness: [6, 'Deutliche Süße.'],
    Acidity: [4, 'Moderate Säure.'],
    Body: [4, 'Leicht.'],
    Tannin: [1, 'Kein spürbares Tannin.'],
    Fruit: [6, 'Fruchtig.'],
    Alcohol: [4, 'Wenig Alkohol.'],
  },
  'blauer-portugieser': {
    Sweetness: [1, 'Kaum Restsüße.'],
    Acidity: [3, 'Milde Säure.'],
    Body: [3, 'Leicht.'],
    Tannin: [3, 'Zartes Tannin.'],
    Fruit: [6, 'Fruchtig.'],
    Alcohol: [6, 'Mittlerer Alkohol.'],
  },
  'zweigelt-holzfass': {
    Sweetness: [1, 'Kaum Restsüße.'],
    Acidity: [5, 'Moderate Säure.'],
    Body: [8, 'Kräftig.'],
    Tannin: [7, 'Präsentes Tannin.'],
    Fruit: [6, 'Fruchtig.'],
    Alcohol: [8, 'Spürbarer Alkohol.'],
  },
  'coorbeau-noir': {
    Sweetness: [1, 'Kaum Restsüße.'],
    Acidity: [5, 'Moderate Säure.'],
    Body: [7, 'Kräftig.'],
    Tannin: [7, 'Präsentes Tannin.'],
    Fruit: [7, 'Fruchtig.'],
    Alcohol: [8, 'Spürbarer Alkohol.'],
  },
}

export interface TasteWine {
  slug: string
  name: string
  sub?: string
  vintage?: number
  label: LabelCode
  note?: string
  /** One value per axis, in AXES order. */
  values: number[]
  /** One short description per axis, in AXES order. */
  texts: string[]
}

export const TASTE_WINES: TasteWine[] = Object.entries(PROFILES).flatMap(([slug, profile]) => {
  const wine = WINES.find(w => w.slug === slug)
  if (!wine) return []
  return {
    slug,
    name: wine.name,
    sub: wine.sub,
    vintage: wine.vintage,
    label: wine.label,
    note: wine.note,
    values: AXES.map(key => profile[key][0]),
    texts: AXES.map(key => profile[key][1]),
  }
})
