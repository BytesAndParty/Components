/**
 * Rebsorten-Stammbaum — Datensatz.
 *
 * ILLUSTRATIV, aber ampelographisch echt: Die Verwandtschaften (parents) sind
 * dokumentierte Traubensorten-Genealogien. Quellen verifiziert 2026-07-25:
 *   · Rotgipfler        = Traminer × Roter Veltliner
 *   · Zierfandel/Spätrot = Roter Veltliner × Traminer
 *   · Neuburger          = Roter Veltliner × Silvaner
 *   · Grüner Veltliner   = Traminer × St.-Georgen-Rebe            (2007 bestimmt)
 *   · Zweigelt           = Blaufränkisch × Sankt Laurent          (Klosterneuburg 1922)
 *   · Blauburger         = Blauer Portugieser × Blaufränkisch     (F. Zweigelt 1923)  en.wikipedia.org/wiki/Blauburger
 *   · Rösler             = Zweigelt × (Seyve-Villard 18-402 × Blaufränkisch)  (G. Mayer 1960)  de.wikipedia.org/wiki/Roesler_(Rebsorte)
 *   · Rathay             = Blauburger × (Seyve-Villard 18-402 × Blaufränkisch) (1970)          de.wikipedia.org/wiki/Rathay
 *   · Uhudler            = Direktträger aus Südburgenland: Concord, Delaware, Elvira,
 *                          Ripatella, Isabella, Noah (Vitis vinifera × labrusca/riparia)        en.wikipedia.org/wiki/Uhudler
 *
 * Der Baum ist chronologisch angeordnet (oben alt → unten jung): Kinder erscheinen
 * IMMER unter ihren Eltern. `row` = Zeit-Zeile, `col` = Spur innerhalb der Zeile,
 * `epoch` = Anzeige-Epoche/Jahr.
 *
 * Weine, Preise, Ried-/Lagennamen und Bilder sind für den Showcase erfunden bzw.
 * illustrativ (Kolophon weist darauf hin). SWAPPABLE gegen Vendure/CMS.
 */

export type GrapeColor = 'red' | 'white'
export type GrapeFamily = 'vinifera' | 'direkttraeger'

export interface LageRef {
  name: string
  soil: string
  exposition: string
  elevation: string
}

export interface WineRef {
  name: string
  vintage: number
  style: string
  price: string
  note: string
}

export interface GrapeNode {
  id: string
  name: string
  aka?: string
  color: GrapeColor
  family: GrapeFamily
  /** Genealogische Art (nur für Label): 0 = Urrebe, 1 = Kreuzung, 2 = Neuzüchtung. */
  gen: number
  /** Zeit-Zeile im Stammbaum (0 = oben/alt, größer = weiter unten/jünger). */
  row: number
  /** Horizontale Spur innerhalb der Zeile (0-basiert). */
  col: number
  /** Anzeige-Epoche, z. B. „uralt", „1849", „1922". */
  epoch: string
  parents: string[]
  origin: string
  tagline: string
  aromas: string[]
  image: string
  lagen: LageRef[]
  wines: WineRef[]
}

export const REBSTOCKMIETE = {
  label: 'Diesen Rebstock mieten',
  price: '€ 58,– / Jahr',
  note: 'Patenschaft für eine namentliche Rebe in Sooss — im Showcase symbolisch.',
} as const

export const FAMILY_LABEL: Record<GrapeFamily, string> = {
  vinifera: 'Vitis vinifera',
  direkttraeger: 'Direktträger · Uhudler',
}

/** Reihen-Bänder (Generationen) für optionale Beschriftung. */
export const ROW_BANDS: { row: number; label: string }[] = [
  { row: 0, label: 'Urreben' },
  { row: 1, label: 'Kreuzungen' },
  { row: 2, label: 'Neuzüchtungen' },
  { row: 3, label: 'Direktträger · Uhudler' },
]

// ── Bilder (verifizierte Unsplash-IDs, illustrativ) ─────────────────────────
const IMG = {
  cellar: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
  barrel: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80',
  tasting: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
  bottle: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
  vine: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200&q=80',
} as const

/** Hintergrund-Untermalung hinter dem Vollbild-Baum. */
export const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=2000&q=80'

// ── Lagen ──────────────────────────────────────────────────────────────────
const RIED_KRAMER: LageRef = { name: 'Ried Kramer', soil: 'Kalkstein & Dolomit', exposition: 'Südost', elevation: '280 m' }
const RIED_STEINRIEGEL: LageRef = { name: 'Ried Steinriegel', soil: 'Schotter über Kalk', exposition: 'Süd', elevation: '260 m' }
const RIED_SOOSSER_HOEHE: LageRef = { name: 'Ried Sooßer Höhe', soil: 'Braunerde auf Lehm', exposition: 'Südwest', elevation: '310 m' }
const RIED_LINDKOGEL: LageRef = { name: 'Ried Lindkogel', soil: 'Dolomitverwitterung', exposition: 'Süd', elevation: '340 m' }

// ── Der Stammbaum (chronologisch, oben alt → unten jung) ────────────────────
export const LINEAGE: GrapeNode[] = [
  // ── Zeile 0 · Urreben (uralt) ──────────────────────────────────────────────
  {
    id: 'traminer', name: 'Traminer', aka: 'Savagnin', color: 'white', family: 'vinifera',
    gen: 0, row: 0, col: 0, epoch: 'uralt', parents: [],
    origin: 'Der Urahn · Zentraleuropa',
    tagline: 'Die Ahnenrebe. Aus ihr gehen mehr Sorten hervor als aus fast jeder anderen Traube Europas.',
    aromas: ['Rosenblüte', 'Litschi', 'Muskat'], image: IMG.vine,
    lagen: [RIED_KRAMER],
    wines: [{ name: 'Gelber Traminer', vintage: 2022, style: 'Trocken · aromatisch', price: '€ 26,00', note: 'Maischestandzeit, spontan vergoren.' }],
  },
  {
    id: 'roter-veltliner', name: 'Roter Veltliner', color: 'white', family: 'vinifera',
    gen: 0, row: 0, col: 1, epoch: 'uralt', parents: [],
    origin: 'Niederösterreichische Urrebe',
    tagline: 'Rare, kräftige Weiße — Elternteil gleich mehrerer Thermenregion-Spezialitäten.',
    aromas: ['Quitte', 'Walnuss', 'gelber Apfel'], image: IMG.vine,
    lagen: [RIED_SOOSSER_HOEHE],
    wines: [{ name: 'Roter Veltliner', vintage: 2022, style: 'Trocken', price: '€ 21,00', note: 'Kleiner Ertrag, nur in guten Jahren gefüllt.' }],
  },
  {
    id: 'silvaner', name: 'Silvaner', color: 'white', family: 'vinifera',
    gen: 0, row: 0, col: 2, epoch: 'uralt', parents: [],
    origin: 'Alte österreichische Herkunft',
    tagline: 'Leise, erdig, unaufgeregt — der stille Partner in mancher Kreuzung.',
    aromas: ['Birne', 'Heu', 'Feldblume'], image: IMG.vine,
    lagen: [RIED_STEINRIEGEL], wines: [],
  },
  {
    id: 'sankt-georgen', name: 'St.-Georgen-Rebe', color: 'white', family: 'vinifera',
    gen: 0, row: 0, col: 3, epoch: 'uralt', parents: [],
    origin: 'Burgenland · Wildfund 2000',
    tagline: 'Ein einzelner wilder Rebstock, im Jahr 2000 wiederentdeckt — Elternteil des Grünen Veltliners.',
    aromas: ['Wiesenkräuter', 'grüner Apfel'], image: IMG.vine, lagen: [], wines: [],
  },

  // ── Zeile 1 · Urreben (uralt), die roten Stammväter ────────────────────────
  {
    id: 'blaufraenkisch', name: 'Blaufränkisch', color: 'red', family: 'vinifera',
    gen: 0, row: 0, col: 4, epoch: 'uralt', parents: [],
    origin: 'Mitteleuropäische Urrebe',
    tagline: 'Die dunkle Stammmutter der österreichischen Rotweine — Würze, Struktur, langer Atem.',
    aromas: ['Weichsel', 'Brombeere', 'schwarzer Pfeffer'], image: IMG.barrel,
    lagen: [RIED_LINDKOGEL],
    wines: [{ name: 'Blaufränkisch vom Dolomit', vintage: 2021, style: 'Trocken · Reserve', price: '€ 24,00', note: 'Zwölf Monate im großen Holz, Handlese.' }],
  },
  {
    id: 'sankt-laurent', name: 'Sankt Laurent', aka: 'St. Laurent', color: 'red', family: 'vinifera',
    gen: 0, row: 0, col: 5, epoch: 'uralt', parents: [],
    origin: 'Alte Burgunder-Verwandtschaft',
    tagline: 'Samtig, dunkelbeerig, mit dem Duft des Laurentiustags, an dem er zu reifen beginnt.',
    aromas: ['Sauerkirsche', 'Waldboden', 'Nelke'], image: IMG.barrel,
    lagen: [RIED_STEINRIEGEL],
    wines: [{ name: 'Sankt Laurent, Alte Reben', vintage: 2020, style: 'Trocken', price: '€ 22,50', note: 'Von Stöcken über 40 Jahre.' }],
  },
  {
    id: 'blauer-portugieser', name: 'Blauer Portugieser', color: 'red', family: 'vinifera',
    gen: 0, row: 0, col: 6, epoch: 'uralt', parents: [],
    origin: 'Donauraum · alte Massenträgerrebe',
    tagline: 'Leicht, süffig, früh gelesen — der freundliche Alltagsrote und Elternteil des Blauburgers.',
    aromas: ['rote Ribisel', 'Kirsche', 'Veilchen'], image: IMG.barrel, lagen: [], wines: [],
  },

  // ── Zeile 2 · Alte Naturkreuzungen (vor 1800) ──────────────────────────────
  {
    id: 'rotgipfler', name: 'Rotgipfler', color: 'white', family: 'vinifera',
    gen: 1, row: 1, col: 0, epoch: 'vor 1800', parents: ['traminer', 'roter-veltliner'],
    origin: 'Leitsorte der Thermenregion',
    tagline: 'Dicht, würzig, honiggelb — halb Sooss, halb Legende. Klassisch mit dem Zierfandel im Duett.',
    aromas: ['Marille', 'Akazienhonig', 'Ingwer'], image: IMG.tasting,
    lagen: [RIED_KRAMER, RIED_SOOSSER_HOEHE],
    wines: [
      { name: 'Rotgipfler Ried Kramer', vintage: 2022, style: 'Trocken · Lagenwein', price: '€ 29,00', note: 'Die Paradelage des Hauses, urgesteinsgeprägt.' },
      { name: 'Spätrot-Rotgipfler', vintage: 2021, style: 'Trocken · Cuvée', price: '€ 32,00', note: 'Das historische Thermenregion-Duett mit Zierfandel.' },
    ],
  },
  {
    id: 'zierfandel', name: 'Zierfandel', aka: 'Spätrot', color: 'white', family: 'vinifera',
    gen: 1, row: 1, col: 1, epoch: 'vor 1800', parents: ['roter-veltliner', 'traminer'],
    origin: 'Thermenregion · rare Spezialität',
    tagline: 'Der „Spätrot": vollmundig, mit rötlich schimmernder Beere. Selten rein, meist im Verschnitt.',
    aromas: ['gelbe Frucht', 'Nuss', 'Wachs'], image: IMG.tasting,
    lagen: [RIED_KRAMER],
    wines: [{ name: 'Zierfandel, reinsortig', vintage: 2021, style: 'Trocken', price: '€ 31,00', note: 'Nur 900 Flaschen, handnummeriert.' }],
  },
  {
    id: 'neuburger', name: 'Neuburger', color: 'white', family: 'vinifera',
    gen: 1, row: 1, col: 2, epoch: 'vor 1800', parents: ['roter-veltliner', 'silvaner'],
    origin: 'Zufallssämling · Donauraum',
    tagline: 'Mild, nussig, mit blaubereiftem Laub — ein leiser Klassiker, der Geduld belohnt.',
    aromas: ['Haselnuss', 'Blüte', 'Mandel'], image: IMG.tasting,
    lagen: [RIED_SOOSSER_HOEHE],
    wines: [{ name: 'Neuburger', vintage: 2022, style: 'Trocken', price: '€ 19,50', note: 'Auf der Feinhefe ausgebaut.' }],
  },
  {
    id: 'gruener-veltliner', name: 'Grüner Veltliner', color: 'white', family: 'vinifera',
    gen: 1, row: 1, col: 3, epoch: 'vor 1800', parents: ['traminer', 'sankt-georgen'],
    origin: 'Österreichs Signatur-Rebe',
    tagline: 'Pfeffrig, knackig, unverkennbar — Kind des Traminers und einer einzelnen wilden Rebe.',
    aromas: ['weißer Pfeffer', 'Limette', 'Erbse'], image: IMG.tasting,
    lagen: [RIED_SOOSSER_HOEHE, RIED_STEINRIEGEL],
    wines: [
      { name: 'Grüner Veltliner Steinriegel', vintage: 2023, style: 'Trocken · Lagenwein', price: '€ 18,90', note: 'Schotterlage, straff und salzig.' },
      { name: 'Grüner Veltliner Federspiel', vintage: 2023, style: 'Trocken · leicht', price: '€ 14,50', note: 'Der Heurigenwein, jung getrunken.' },
    ],
  },

  // ── Zeile 3 · Amerikas Reben, 19. Jh. (Uhudler-Direktträger) ───────────────
  {
    id: 'isabella', name: 'Isabella', color: 'red', family: 'direkttraeger',
    gen: 0, row: 3, col: 0, epoch: '1816', parents: [],
    origin: 'Nordamerika · Vitis labrusca',
    tagline: 'Der „Foxton": erdbeerig-parfümiert, unverkennbar wild. Klassische Uhudler-Traube.',
    aromas: ['Walderdbeere', 'Fuchston', 'Waldhonig'], image: IMG.bottle, lagen: [], wines: [],
  },
  {
    id: 'concord', name: 'Concord', color: 'red', family: 'direkttraeger',
    gen: 0, row: 3, col: 1, epoch: '1849', parents: [],
    origin: 'Massachusetts · Vitis labrusca',
    tagline: 'Tiefblau, süß, unbändig fruchtig — die Amerikanerin im Südburgenländer Uhudler-Satz.',
    aromas: ['blaue Traube', 'Kaugummi', 'Brombeere'], image: IMG.bottle, lagen: [], wines: [],
  },
  {
    id: 'elvira', name: 'Elvira', color: 'white', family: 'direkttraeger',
    gen: 0, row: 3, col: 2, epoch: '1863', parents: [],
    origin: 'USA · Vitis labrusca × riparia',
    tagline: 'Hellfruchtig, robust, ertragreich — die weiße Stimme im Uhudler.',
    aromas: ['grüner Apfel', 'Muskat', 'Kräuter'], image: IMG.bottle, lagen: [], wines: [],
  },
  {
    id: 'noah', name: 'Noah', color: 'white', family: 'direkttraeger',
    gen: 0, row: 3, col: 3, epoch: '1869', parents: [],
    origin: 'USA · Vitis labrusca × riparia',
    tagline: 'Grünlich, hochgehäckt an alten Kellergassen — der historische Direktträger des Uhudlers.',
    aromas: ['Foxton', 'Wiese', 'grüne Nuss'], image: IMG.bottle, lagen: [], wines: [],
  },

  // ── Zeile 4 · Klosterneuburg (1920er) ──────────────────────────────────────
  {
    id: 'zweigelt', name: 'Zweigelt', color: 'red', family: 'vinifera',
    gen: 1, row: 1, col: 4, epoch: '1922', parents: ['blaufraenkisch', 'sankt-laurent'],
    origin: 'Klosterneuburg 1922 · Fritz Zweigelt',
    tagline: 'Österreichs meistgepflanzter Rotwein — die Wucht des Blaufränkisch, der Samt des Sankt Laurent.',
    aromas: ['Kirsche', 'Zwetschke', 'Kakao'], image: IMG.barrel,
    lagen: [RIED_STEINRIEGEL, RIED_LINDKOGEL],
    wines: [
      { name: 'Zweigelt vom Kalk', vintage: 2022, style: 'Trocken', price: '€ 16,50', note: 'Der Alltagswein des Hauses, saftig und direkt.' },
      { name: 'Zweigelt Réserve „58"', vintage: 2020, style: 'Trocken · Barrique', price: '€ 34,00', note: 'Achtzehn Monate Holz, nur Magnum.' },
    ],
  },
  {
    id: 'blauburger', name: 'Blauburger', color: 'red', family: 'vinifera',
    gen: 1, row: 1, col: 5, epoch: '1923', parents: ['blauer-portugieser', 'blaufraenkisch'],
    origin: 'Klosterneuburg 1923 · Fritz Zweigelt',
    tagline: 'Tiefdunkel, weich, farbstark — oft der Färber in der Cuvée, selten allein im Rampenlicht.',
    aromas: ['Holunder', 'Zwetschke', 'Bitterschokolade'], image: IMG.barrel,
    lagen: [RIED_LINDKOGEL],
    wines: [{ name: 'Blauburger', vintage: 2021, style: 'Trocken', price: '€ 17,50', note: 'Dunkle Farbe, sanftes Tannin.' }],
  },

  // ── Zeile 5 · Hybriden (um 1930) — die Brücke ──────────────────────────────
  {
    id: 'seyve-villard', name: 'Seyve-Villard 18-402', aka: 'die Brücke', color: 'white', family: 'direkttraeger',
    gen: 0, row: 1, col: 6, epoch: 'um 1930', parents: [],
    origin: 'Französische Hybride',
    tagline: 'Die französische Hybridrebe, aus der über Klosterneuburg das Blut der PIWI-Sorten Rösler & Rathay stammt.',
    aromas: ['neutral', 'krautig'], image: IMG.bottle, lagen: [], wines: [],
  },

  // ── Zeile 6 · PIWI-Neuzüchtungen (1960–1970) ───────────────────────────────
  {
    id: 'roesler', name: 'Rösler', color: 'red', family: 'vinifera',
    gen: 2, row: 2, col: 4, epoch: '1960', parents: ['zweigelt', 'seyve-villard'],
    origin: 'Klosterneuburg 1960 · G. Mayer · PIWI',
    tagline: 'Pilzwiderstandsfähige Neuzüchtung: tiefdunkel und würzig, mit einem Tropfen Wildreben-Blut.',
    aromas: ['Brombeere', 'Lorbeer', 'Tabak'], image: IMG.barrel,
    lagen: [RIED_LINDKOGEL],
    wines: [{ name: 'Rösler PIWI', vintage: 2022, style: 'Trocken · biotauglich', price: '€ 23,00', note: 'Kaum Spritzung nötig — der Zukunftsrote.' }],
  },
  {
    id: 'rathay', name: 'Rathay', color: 'red', family: 'vinifera',
    gen: 2, row: 2, col: 5, epoch: '1970', parents: ['blauburger', 'seyve-villard'],
    origin: 'Klosterneuburg 1970 · PIWI',
    tagline: 'Dunkel, vollmundig, tanninreich — benannt nach dem zweiten Direktor der Klosterneuburger Weinschule.',
    aromas: ['dunkle Kirsche', 'Nelke', 'Kakao'], image: IMG.barrel,
    lagen: [],
    wines: [{ name: 'Rathay', vintage: 2021, style: 'Trocken · Reserve', price: '€ 25,00', note: 'Frosthart und robust, nur wenige Zeilen.' }],
  },
]

// ── Graph-Helfer ───────────────────────────────────────────────────────────

const BY_ID = new Map(LINEAGE.map(n => [n.id, n]))

export function nodeById(id: string): GrapeNode | undefined {
  return BY_ID.get(id)
}

/** Transitive Vorfahren (ohne den Knoten selbst). */
export function ancestorsOf(id: string): Set<string> {
  const acc = new Set<string>()
  const walk = (cur: string) => {
    const node = BY_ID.get(cur)
    if (!node) return
    for (const p of node.parents) {
      if (!acc.has(p)) {
        acc.add(p)
        walk(p)
      }
    }
  }
  walk(id)
  return acc
}

/** Erster Kind-Knoten (primäre Linie bevorzugt) — für Pfeil-runter-Navigation. */
export function firstChildOf(id: string): string | undefined {
  return LINEAGE.find(n => n.parents[0] === id)?.id ?? LINEAGE.find(n => n.parents.includes(id))?.id
}

/** Kurzlabel für Art des Knotens. */
export function kindLabel(n: GrapeNode): string {
  if (n.family === 'direkttraeger') return 'Direktträger'
  return n.gen === 0 ? 'Urrebe' : n.gen === 1 ? 'Kreuzung' : 'Neuzüchtung'
}

/** Alle Kanten Eltern→Kind. primary = durchgezogene Primärlinie. */
export interface LineageEdge {
  from: string
  to: string
  primary: boolean
}
export const EDGES: LineageEdge[] = LINEAGE.flatMap(n =>
  n.parents.map((from, i) => ({ from, to: n.id, primary: i === 0 })),
)
