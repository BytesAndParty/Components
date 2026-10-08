/**
 * Buch·Art — Farbwerte und echte Inhalte der Familie, die aus der Original-CI von
 * buchart58.at abgeleitet ist (Stand Oktober 2026). Alle Fakten, Preise und Zitate
 * stammen von der Website bzw. den Etiketten — nichts davon ist erfunden.
 *
 * Tailwind-Klassen schreiben die Hex-Werte weiter literal (sonst kompiliert die
 * Klasse nicht). Diese Konstanten sind für SVG-Fills und Inline-Styles gedacht.
 */

/** Farben, abgenommen vom Logo (Gold) und von den Etiketten (Bänder, Gründe). */
export const BA = {
  /** Seitengrund — heller als das Etikett, damit Etiketten darauf als Fläche lesbar bleiben. */
  paper: '#f7f3e8',
  /** Etikettencreme der Weißweine. */
  cream: '#f0e8c3',
  ink: '#1c1a17',
  /** Sekundärtext auf Papier, 6,4:1. */
  inkSoft: '#5e574b',
  line: '#ddd3bc',
  /** Logo-Gold — als Folie/Linie auf Hell, als Text nur auf Dunkel. */
  gold: '#be9f55',
  /** Gold als Textfarbe auf Papier (5,2:1). */
  goldInk: '#7d6226',
  /** Gold-Text auf Rot, Grün und Bordeaux (≥ 4,6:1). */
  goldLight: '#d7c69f',
  /** Namensband der Weißwein-Etiketten. */
  green: '#15420c',
  /** Namensband der schwarzen Etiketten — zugleich das Lesebändchen der Familie. */
  red: '#9e1919',
  bordeaux: '#a01f1e',
  bordeauxBand: '#6f1a1a',
  coal: '#2f2f30',
  night: '#1e1d1b',
} as const

/**
 * Der Etiketten-Farbcode als Kapitel-System:
 * weiss = Creme mit grünem Band, schwarz = Kohle mit rotem Band (Spezial & Simons Linie),
 * rot = Bordeaux mit dunklem Band (Premium-Rot).
 */
export type LabelCode = 'weiss' | 'schwarz' | 'rot'

export const LABEL: Record<LabelCode, { name: string; ground: string; band: string; text: string; bandText: string }> = {
  weiss: { name: 'Creme · Grün', ground: BA.cream, band: BA.green, text: BA.green, bandText: BA.goldLight },
  schwarz: { name: 'Kohle · Rot', ground: BA.coal, band: BA.red, text: BA.goldLight, bandText: BA.goldLight },
  rot: { name: 'Bordeaux', ground: BA.bordeaux, band: BA.bordeauxBand, text: BA.goldLight, bandText: BA.goldLight },
}

export type Glass = 'gruen' | 'dunkel' | 'klar'

export type WineCategory = 'weiss-trocken' | 'weiss-lieblich' | 'rot-trocken' | 'rot-lieblich' | 'frizzante' | 'raritaet'

export interface Wine {
  slug: string
  name: string
  /** Zweite Zeile auf dem Etikett (Sorte, Beiname). */
  sub?: string
  vintage?: number
  price: number
  /** Flaschengröße in Litern, Default 0,75. */
  size?: number
  taste: string
  category: WineCategory
  label: LabelCode
  glass: Glass
  /** Originaltext aus dem Shop — fehlt, wo der Shop keine Beschreibung hat. */
  note?: string
  soldOut?: boolean
}

export const CATEGORIES: { id: WineCategory; label: string }[] = [
  { id: 'weiss-trocken', label: 'Weißwein trocken' },
  { id: 'weiss-lieblich', label: 'Weißwein lieblich' },
  { id: 'rot-trocken', label: 'Rotwein trocken' },
  { id: 'rot-lieblich', label: 'Rotwein lieblich' },
  { id: 'frizzante', label: 'Frizzante & Sekt' },
  { id: 'raritaet', label: 'Raritäten' },
]

/** Auszug aus den 60 Positionen des Online-Shops, Preise inkl. 13 % MwSt. */
export const WINES: Wine[] = [
  { slug: 'gruener-veltliner', name: 'Grüner Veltliner', vintage: 2025, price: 6, taste: 'trocken', category: 'weiss-trocken', label: 'weiss', glass: 'gruen', note: 'Klassiker mit viel Finesse und lebendiger Frische.' },
  { slug: 'riesling', name: 'Riesling', vintage: 2025, price: 7, taste: 'trocken', category: 'weiss-trocken', label: 'weiss', glass: 'gruen', note: 'In der Nase intensive Frucht, elegant am Gaumen.' },
  { slug: 'rotgipfler-lehm', name: 'Rotgipfler', sub: 'vom Lehm', vintage: 2025, price: 7.5, taste: 'trocken', category: 'weiss-trocken', label: 'weiss', glass: 'gruen' },
  { slug: 'chardonnay-muschelkalk', name: 'Chardonnay', sub: 'vom Muschelkalk', vintage: 2025, price: 7, taste: 'trocken', category: 'weiss-trocken', label: 'weiss', glass: 'gruen' },
  { slug: 'gemischter-satz', name: 'Gemischter Satz', vintage: 2025, price: 9, taste: 'trocken', category: 'weiss-trocken', label: 'weiss', glass: 'gruen', note: 'Frisch, lebendig und ausgewogen — ideal zur klassischen Wiener Küche.' },
  { slug: 'b58', name: 'B 58', sub: 'Weißburgunder · auf der Maische', vintage: 2023, price: 10, taste: 'trocken', category: 'weiss-trocken', label: 'schwarz', glass: 'gruen', note: 'Zubereitet wie Rotwein: gelb-golden, gelber Paprika, Melone, feine Holznoten. Created by Simon.' },
  { slug: 'traminer', name: 'Traminer', vintage: 2024, price: 6.5, taste: 'halbtrocken', category: 'weiss-lieblich', label: 'weiss', glass: 'gruen', note: 'Geschmack mit vielen Nuancen.' },
  { slug: 'rotgipfler-lieblich', name: 'Rotgipfler', vintage: 2025, price: 6.5, taste: 'lieblich', category: 'weiss-lieblich', label: 'weiss', glass: 'gruen', note: 'Der fast schon Süße!' },
  { slug: 'blauer-portugieser', name: 'Blauer Portugieser', vintage: 2025, price: 5.5, taste: 'trocken', category: 'rot-trocken', label: 'schwarz', glass: 'dunkel', note: 'Leicht und mild — der perfekte rote Sommerwein.' },
  { slug: 'zweigelt', name: 'Zweigelt', vintage: 2024, price: 6, taste: 'trocken', category: 'rot-trocken', label: 'schwarz', glass: 'dunkel', note: 'Kraftvoll und mild, mit reifen dunkelbeerigen Fruchtansätzen.' },
  { slug: 'coorbeau-noir', name: 'Coorbeau noir', sub: 'Der schwarze Rabe', vintage: 2024, price: 9.5, taste: 'trocken', category: 'rot-trocken', label: 'rot', glass: 'dunkel', note: 'Großer Jahrgang: reife Frucht, feine Gewürz- und Schokonote. Unser beliebter Allrounder.' },
  { slug: 'zweigelt-holzfass', name: 'Zweigelt', sub: 'Holzfass', vintage: 2023, price: 10.5, taste: 'trocken', category: 'rot-trocken', label: 'rot', glass: 'dunkel', note: 'Intensives Holz, breit und lang anhaltend.' },
  { slug: 'simon', name: 'Simon', sub: 'Blauer Portugieser', vintage: 2025, price: 9.5, taste: 'lieblich', category: 'rot-lieblich', label: 'schwarz', glass: 'dunkel', note: 'Geerntet unter dem Kaiserstein. Eine Belohnung für Körper, Geist und Seele.' },
  { slug: 'iris-jasmin', name: 'Iris Jasmin', vintage: 2025, price: 9.5, taste: 'lieblich', category: 'rot-lieblich', label: 'schwarz', glass: 'dunkel', note: 'Unsere Süße: Kirsch- und Beerenfrucht, samtig.' },
  { slug: 'coorbeau-noir-lieblich', name: 'Coorbeau noir', sub: 'Der schwarze Rabe', vintage: 2025, price: 9.5, taste: 'lieblich', category: 'rot-lieblich', label: 'rot', glass: 'dunkel', note: 'Unser Premiumprodukt: dunkles Rubingranat, samtig, süßer Abgang.' },
  { slug: 'frizzante-rose', name: 'Frizzante', sub: 'Rosé', price: 8, taste: 'prickelnd', category: 'frizzante', label: 'schwarz', glass: 'klar', note: 'Trocken, fruchtig.' },
  { slug: 'muskat-traminer-frizzante', name: 'Muskat Traminer', sub: 'Frizzante', price: 8, taste: 'prickelnd', category: 'frizzante', label: 'weiss', glass: 'klar' },
  { slug: 'blanc-cue', name: 'blanc CÜ', sub: 'Schaumwein', price: 10.5, taste: 'prickelnd', category: 'frizzante', label: 'weiss', glass: 'gruen', note: 'Fruchtig, spritzig, jung!' },
  { slug: 'triple-auslese', name: 'Triple Auslese III', vintage: 2023, price: 22, taste: 'halbtrocken', category: 'raritaet', label: 'rot', glass: 'dunkel', note: 'Das erste Meisterstück unseres jungen Kellermeisters — drei handverlesene Rebsorten.' },
  { slug: 'merlot-auslese', name: 'Merlot', sub: 'Auslese', vintage: 2019, price: 35, taste: 'trocken', category: 'raritaet', label: 'rot', glass: 'dunkel', note: 'Kraft und Finesse, sattes Rubin, zarte Holzwürze, gutes Reifepotenzial.' },
  { slug: 'eiswein', name: 'Eiswein', vintage: 2019, price: 15, size: 0.375, taste: 'süß', category: 'raritaet', label: 'weiss', glass: 'gruen', note: 'Geerntet in einer einzigen Nacht, vom 11. auf den 12. Dezember 2019.' },
]

export function formatEuro(value: number) {
  return value.toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export const ADDRESS = {
  street: 'Hauptstraße 58',
  zip: '2504',
  town: 'Sooss',
  region: 'Thermenregion · Niederösterreich',
  email: 'wein@buchart58.at',
  hours: 'Täglich 8 – 19 Uhr, auch an Sonn- und Feiertagen',
  instagram: 'https://www.instagram.com/buchart58/',
}

/** „Wir sind für Sie da!“ — die drei direkten Durchwahlen von jeder Seite der Website. */
export const CONTACTS = [
  { name: 'Simon', initial: 'S', role: 'Kellermeister-Beratung', phone: '+43 699 131 709 28' },
  { name: 'Irmi', initial: 'I', role: 'Verkauf & Verkostung', phone: '+43 664 215 45 93' },
  { name: 'Anton', initial: 'A', role: 'Etiketten & Rebstockmiete', phone: '+43 664 215 45 92' },
]

export function telHref(phone: string) {
  return 'tel:' + phone.replace(/\s/g, '')
}

export const FAMILY = [
  {
    name: 'Anton Buchart',
    call: 'Toni',
    initial: 'A',
    role: 'Weinbau- und Kellermeister · Etiketten',
    text: 'Gilt als Computerfreak der Familie und Profi für Etikettengestaltung — gerne designt er auch Ihr persönliches Weinetikett. Als gelernter Kellermeister gibt er den Weinen mit Gespür für die optimale Kelterung ihren Charakter.',
  },
  {
    name: 'Irmgard Buchart',
    call: 'Irmi',
    initial: 'I',
    role: 'Die gute Seele des Hauses',
    text: 'Allrounderin und Rückhalt der Familie. Mit viel guter Laune kümmert sie sich um alle Kunden — und um die, die es noch werden — und behält stets den Überblick.',
  },
  {
    name: 'Simon Buchart',
    call: 'Simon',
    initial: 'S',
    role: 'Weinbau- und Kellermeister · Sommelier',
    text: 'Das junge Herz des Weinguts. Bringt eine eigene Linie mit leichten Varianten in den elterlichen Betrieb — von der Rebe bis ins Glas — und beweist mit unkonventionellen Videos, dass Weinbau auch Spaß machen darf.',
  },
]

/** Rebsorten laut Website, „Unsere Weinsorten in Sooss“. */
export const VARIETIES = {
  weiss: ['Grüner Veltliner', 'Riesling', 'Neuburger', 'Müller Thurgau', 'Rotgipfler', 'Chardonnay', 'Traminer', 'Pinot blanc', 'Gelber Muskateller', 'Muskat Ottonell'],
  rot: ['Blauer Portugieser', 'Zweigelt', 'St. Laurent', 'Merlot', 'Cabernet Sauvignon', 'Coorbeau noir'],
}

/** Die vier Lagen, die auf der Website namentlich genannt werden. */
export const RIEDEN = [
  { name: 'Rauhenstein Gmösel', wines: 'Zweigelt · Grüner Veltliner · Chardonnay' },
  { name: 'Lange Weingärten', wines: 'Coorbeau noir' },
  { name: 'Kirchenwiese', wines: 'Merlot' },
  { name: 'Kaiserstein', wines: 'Blauer Portugieser „Simon“' },
]

/** Rebstockmiete — alle Varianten, Preise laut Website (Grundbetrag + Ernte). */
export const REBSTOCK = [
  { variety: 'Zweigelt', ried: 'Rauhenstein Gmösel', one: 220, two: 290 },
  { variety: 'Grüner Veltliner', ried: 'Rauhenstein Gmösel', one: 220, two: 290 },
  { variety: 'Merlot', ried: 'Ried Kirchenwiese', one: 240, two: 320 },
  { variety: 'Chardonnay', ried: 'Rauhenstein Gmösel', one: 240, two: 320 },
  { variety: 'Coorbeau noir', ried: 'Ried Lange Weingärten', one: 280, two: 390 },
]

export const REBSTOCK_XXL = { variety: 'Zweigelt', stocks: 30, bottles: 120, price: 820 }

export const REVIEWS = [
  { quote: 'Wenn du dieses Haus betrittst, fühlst du dich sofort willkommen. Für mich der beste Wein in Sooss — die Weine, die Beratung und die Verkostung sind spitze.', name: 'Walter Wild' },
  { quote: 'Man spürt sofort, dass hier ein herzlicher Familienbetrieb mit viel Leidenschaft geführt wird. Besonders schön, dass sich Irmi Zeit für eine Verkostung mit uns genommen hat.', name: 'Manuela Dekic' },
  { quote: 'Eine äußerst freundliche Begrüßung, fachlich kompetente Info zu den verschiedenen Weinsorten. Eine positive Atmosphäre — ein Weingenuss pur.', name: 'Bernhard Lingfeld' },
]

export const RATING = { value: 5, count: 66 }
