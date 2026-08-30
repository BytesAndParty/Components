/**
 * Rebsorten-Abstammung — korrigiertes Graph-Modell.
 *
 * Ersetzt `lineage-data.ts`. Der Unterschied ist nicht kosmetisch, sondern
 * strukturell: Rebsorten-Genealogie ist KEIN Baum wie beim Menschen.
 *
 *   · Sorten sind vegetativ vermehrte Klone — ein Traminer heute ist genetisch
 *     derselbe Stock wie vor 1000 Jahren. Es gibt keine Generationen, alle
 *     Sorten leben gleichzeitig. Zeit taugt deshalb NICHT als Layout-Achse
 *     (im Altmodell stand Isabella/1816 unter Zweigelt/1922).
 *   · Der Graph ist ein DAG: Blaufränkisch steckt in Rösler zweimal — über
 *     Zweigelt und über Klosterneuburg 1189-9-77. Solche Rückkreuzungs-
 *     Diamanten sind der Beweis, dass es kein Baum ist.
 *   · Es gibt mehrere Beziehungsarten. Eine Mutation (Pinot Noir -> Pinot Gris)
 *     erzeugt einen Klon, KEIN Kind. Nur ein Samen erzeugt eine neue Sorte.
 *   · Abstammung ist probabilistisch. `confidence` unterscheidet
 *     markerbestätigt von bloss publiziert von vermutet.
 *   · „Keine Eltern" hat zwei verschiedene Bedeutungen, die das Altmodell
 *     vermischt hat: `isFounder` = Eltern real unbekannt (Wissensgrenze) vs.
 *     eine Kante mit `from: null` = Elternteil existiert, ist aber unbenannt.
 *
 * ── Quellenlage ────────────────────────────────────────────────────────────
 * Alle `parentage`-Angaben einzeln gegen VIVC (Vitis International Variety
 * Catalogue, Julius Kühn-Institut) geprüft, verifiziert 2026-08-30.
 * Jede Kante trägt ihre Quelle inline in `source`.
 *
 * Weine, Preise, Ried-/Lagennamen und Bilder sind für den Showcase erfunden
 * bzw. illustrativ. SWAPPABLE gegen Vendure/CMS.
 */

// ── Typen ───────────────────────────────────────────────────────────────────

export type BerryColour = 'red' | 'white'

/** Botanische Einordnung — ersetzt das alte, unscharfe `family`. */
export type Species =
  | 'vinifera' /* Vitis vinifera, europäische Kulturrebe */
  | 'interspecific' /* Kreuzung über Artgrenzen (PIWI, Direktträger) */
  | 'american' /* amerikanische Wildart bzw. deren Züchtung */

/** Die vier „Häuser" — erzählerische Cluster, nicht Taxonomie. */
export type Cluster = 'thermenregion' | 'klosterneuburg' | 'amerikaner' | 'ahnen'

export type EdgeKind =
  | 'crossing' /* Kreuzung Eltern -> Kind, über Samen. Erzeugt eine neue Sorte. */
  | 'mutation' /* somatischer Klon/Farbmutant. Erzeugt KEINE neue Sorte. */
  | 'rootstock' /* Veredelung: Unterlage -> Edelreis. Zweite Abstammungsebene. */

export type Confidence =
  | 'marker-confirmed' /* VIVC: „pedigree confirmed by markers: YES" */
  | 'published' /* publiziert, in VIVC (noch) nicht als bestätigt geführt */
  | 'hypothesis' /* Ampelographie/Literatur, „vermutlich" */

export interface EdgeSource {
  label: string
  url: string
}

export interface LineageEdge {
  /** `null` = Elternteil ist bekannt vorhanden, aber unbenannt (z. B. „Pinot Noir × ?"). */
  from: string | null
  to: string
  kind: EdgeKind
  confidence: Confidence
  source: EdgeSource
  /** Freitext, wenn die Kante eine Einschränkung trägt. */
  note?: string
}

export interface Epoch {
  /** Anzeigetext, z. B. „uralt", „1922", „um 1930". */
  label: string
  year?: number
  certainty: 'exact' | 'approx' | 'disputed'
  note?: string
}

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
  /** Anzeigename im Haus-Sprachgebrauch. */
  name: string
  /** VIVC-Primename, wenn er vom Anzeigenamen abweicht. */
  primeName?: string
  aka?: string
  vivcId?: number
  colour: BerryColour
  species: Species
  cluster: Cluster
  /** Eltern real unbekannt — echtes Wissensende, kein Datenloch. */
  isFounder: boolean
  /** Namenlose Zuchtnummer ohne Handelsnamen. Wird kleiner gerendert, ohne Detailseite. */
  isBreedingLine: boolean
  /** Abstammung wurde für diesen Showcase nicht recherchiert (Rekursionsgrenze). */
  parentageUnresearched?: boolean
  /** Das Weingut baut sie an — treibt Gewichtung im Layout und den Galerie-Filter. */
  inHouse: boolean
  epoch: Epoch
  origin: string
  tagline?: string
  aromas?: string[]
  image?: string
  lagen?: LageRef[]
  wines?: WineRef[]
}

export const CLUSTER_LABEL: Record<Cluster, string> = {
  thermenregion: 'Die Thermenregion',
  klosterneuburg: 'Klosterneuburg',
  amerikaner: 'Die Amerikaner',
  ahnen: 'Die Ahnen',
}

export const CLUSTER_LEAD: Record<Cluster, string> = {
  thermenregion:
    'Was hier seit Jahrhunderten wächst — und woher es kommt. Vom Traminer stammen der Rotgipfler und der Grüne Veltliner ab.',
  klosterneuburg:
    'Die Weinbauschule bei Wien, in der 1922 der Zweigelt entstand — und vier Jahrzehnte später die pilzwiderstandsfähigen Neuzüchtungen.',
  amerikaner:
    'Nach der Reblaus kamen die Reben aus Nordamerika. Sie sind wurzelecht und brauchen keine Veredelung — deshalb gibt es den Uhudler.',
  ahnen: 'Die wenigen Sorten, aus denen fast alles andere hervorgegangen ist.',
}

export const REBSTOCKMIETE = {
  label: 'Diesen Rebstock mieten',
  price: '€ 58,– / Jahr',
  note: 'Patenschaft für eine namentliche Rebe in Sooss — im Showcase symbolisch.',
} as const

// ── Bilder (verifizierte Unsplash-IDs, illustrativ) ─────────────────────────
const IMG = {
  barrel: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80',
  tasting: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
  bottle: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
  vine: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200&q=80',
} as const

// ── Lagen ──────────────────────────────────────────────────────────────────
const RIED_KRAMER: LageRef = { name: 'Ried Kramer', soil: 'Kalkstein & Dolomit', exposition: 'Südost', elevation: '280 m' }
const RIED_STEINRIEGEL: LageRef = { name: 'Ried Steinriegel', soil: 'Schotter über Kalk', exposition: 'Süd', elevation: '260 m' }
const RIED_SOOSSER_HOEHE: LageRef = { name: 'Ried Sooßer Höhe', soil: 'Braunerde auf Lehm', exposition: 'Südwest', elevation: '310 m' }
const RIED_LINDKOGEL: LageRef = { name: 'Ried Lindkogel', soil: 'Dolomitverwitterung', exposition: 'Süd', elevation: '340 m' }

// ── Quellen-Kürzel ─────────────────────────────────────────────────────────
const vivc = (id: number, name: string): EdgeSource => ({
  label: `VIVC ${id} · ${name}`,
  url: `https://www.vivc.de/index.php?r=passport/view&id=${id}`,
})

// ── Knoten ─────────────────────────────────────────────────────────────────

export const NODES: GrapeNode[] = [
  // ══ Die Ahnen ════════════════════════════════════════════════════════════
  {
    id: 'heunisch-weiss',
    name: 'Heunisch weiß',
    aka: 'Gouais blanc, Gwäss',
    vivcId: 4573,
    colour: 'white',
    species: 'vinifera',
    cluster: 'ahnen',
    isFounder: true,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: 'uralt', certainty: 'approx' },
    origin: 'Mitteleuropa · einer der drei großen Ahnen',
    tagline:
      'Im Mittelalter als Massenträger verachtet, weil der Wein wenig taugte — und trotzdem der Elternteil von rund 80 europäischen Sorten. Steckt auch in diesem Haus: über den Blaufränkisch.',
    image: IMG.vine,
  },
  {
    id: 'blaue-zimmettraube',
    name: 'Zimmettraube blau',
    vivcId: 13138,
    colour: 'red',
    species: 'vinifera',
    cluster: 'ahnen',
    isFounder: false,
    isBreedingLine: false,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'uralt', certainty: 'approx' },
    origin: 'Südosteuropa',
    tagline:
      'Die gemeinsame Mutter von Blaufränkisch und Blauem Portugieser — die beiden sind also Halbgeschwister.',
  },
  {
    id: 'pinot-noir',
    name: 'Pinot Noir',
    aka: 'Blauburgunder',
    vivcId: 9279,
    colour: 'red',
    species: 'vinifera',
    cluster: 'ahnen',
    isFounder: true,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: 'uralt', certainty: 'approx' },
    origin: 'Burgund · einer der drei großen Ahnen',
    tagline: 'Uralt, wandelbar, überall — und Elternteil des Sankt Laurent.',
    image: IMG.barrel,
  },
  {
    id: 'oesterreichisch-weiss',
    name: 'Österreichisch Weiß',
    vivcId: 8759,
    colour: 'white',
    species: 'vinifera',
    cluster: 'ahnen',
    isFounder: false,
    isBreedingLine: false,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'uralt', certainty: 'approx' },
    origin: 'Österreich · alte Landsorte',
    tagline: 'Kaum noch angebaut — aber ohne sie gäbe es keinen Silvaner.',
  },
  {
    id: 'seibel-7162',
    name: 'Seibel 7162',
    colour: 'red',
    species: 'interspecific',
    cluster: 'ahnen',
    isFounder: false,
    isBreedingLine: true,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'um 1900', certainty: 'approx' },
    origin: 'Frankreich · Zuchtnummer',
  },
  {
    id: 'seyve-villard-12308',
    name: 'Seyve-Villard 12-308',
    colour: 'red',
    species: 'interspecific',
    cluster: 'ahnen',
    isFounder: false,
    isBreedingLine: true,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'um 1920', certainty: 'approx' },
    origin: 'Frankreich · Zuchtnummer',
  },
  {
    id: 'martha',
    name: 'Martha',
    vivcId: 7355,
    colour: 'white',
    species: 'american',
    cluster: 'ahnen',
    isFounder: false,
    isBreedingLine: false,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: '1868', year: 1868, certainty: 'approx' },
    origin: 'USA · Concord-Sämling',
  },
  {
    id: 'meslier-petit',
    name: 'Meslier Petit',
    vivcId: 7660,
    colour: 'white',
    species: 'vinifera',
    cluster: 'ahnen',
    isFounder: false,
    isBreedingLine: false,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'alt', certainty: 'approx' },
    origin: 'Frankreich',
    tagline: 'Der europäische Elternteil der Isabella — erst über Marker gefunden.',
  },

  // ══ Die Thermenregion ════════════════════════════════════════════════════
  {
    id: 'traminer',
    name: 'Traminer',
    primeName: 'Savagnin blanc',
    aka: 'Savagnin',
    vivcId: 17636,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: true,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'uralt', certainty: 'approx' },
    origin: 'Zentraleuropa · einer der drei großen Ahnen',
    tagline:
      'Einer der drei großen Ahnen des europäischen Weinbaus — neben Pinot und Heunisch. Aus ihm stammen der Silvaner, der Grüne Veltliner und der Rotgipfler dieses Hauses.',
    aromas: ['Rosenblüte', 'Litschi', 'Muskat'],
    image: IMG.vine,
    lagen: [RIED_KRAMER],
    wines: [{ name: 'Gelber Traminer', vintage: 2022, style: 'Trocken · aromatisch', price: '€ 26,00', note: 'Maischestandzeit, spontan vergoren.' }],
  },
  {
    id: 'roter-veltliner',
    name: 'Roter Veltliner',
    vivcId: 12931,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: true,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'uralt', certainty: 'approx' },
    origin: 'Niederösterreich · Urrebe',
    tagline: 'Rare, kräftige Weiße — Elternteil gleich mehrerer Thermenregion-Spezialitäten.',
    aromas: ['Quitte', 'Walnuss', 'gelber Apfel'],
    image: IMG.vine,
    lagen: [RIED_SOOSSER_HOEHE],
    wines: [{ name: 'Roter Veltliner', vintage: 2022, style: 'Trocken', price: '€ 21,00', note: 'Kleiner Ertrag, nur in guten Jahren gefüllt.' }],
  },
  {
    id: 'silvaner',
    name: 'Silvaner',
    primeName: 'Silvaner grün',
    vivcId: 11805,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1600', certainty: 'approx' },
    origin: 'Österreich',
    tagline: 'Leise, erdig, unaufgeregt — und über den Blauen Portugieser die Brücke zum roten Ast.',
    aromas: ['Birne', 'Heu', 'Feldblume'],
    image: IMG.vine,
    lagen: [RIED_STEINRIEGEL],
  },
  {
    id: 'sankt-georgen',
    name: 'St.-Georgen-Rebe',
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: true,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: 'Wildfund 2000', year: 2000, certainty: 'exact', note: 'Fundjahr, nicht Entstehungsjahr' },
    origin: 'Burgenland · ein einzelner wilder Rebstock',
    tagline:
      'Ein einziger wilder Stock, im Jahr 2000 bei St. Georgen wiederentdeckt — und Elternteil des Grünen Veltliners.',
    image: IMG.vine,
  },
  {
    id: 'rotgipfler',
    name: 'Rotgipfler',
    vivcId: 10230,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1800', certainty: 'approx' },
    origin: 'Leitsorte der Thermenregion',
    tagline:
      'Dicht, würzig, honiggelb — halb Sooss, halb Legende. Vollgeschwister des Zierfandels: dieselben Eltern, derselbe Samen-Satz.',
    aromas: ['Marille', 'Akazienhonig', 'Ingwer'],
    image: IMG.tasting,
    lagen: [RIED_KRAMER, RIED_SOOSSER_HOEHE],
    wines: [
      { name: 'Rotgipfler Ried Kramer', vintage: 2022, style: 'Trocken · Lagenwein', price: '€ 29,00', note: 'Die Paradelage des Hauses, urgesteinsgeprägt.' },
      { name: 'Spätrot-Rotgipfler', vintage: 2021, style: 'Trocken · Cuvée', price: '€ 32,00', note: 'Das historische Thermenregion-Duett mit Zierfandel.' },
    ],
  },
  {
    id: 'zierfandel',
    name: 'Zierfandel',
    aka: 'Spätrot',
    vivcId: 13250,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1800', certainty: 'approx' },
    origin: 'Thermenregion · rare Spezialität',
    tagline:
      'Der „Spätrot": vollmundig, mit rötlich schimmernder Beere. Nicht verwandt mit dem kalifornischen Zinfandel — nur ähnlich benannt.',
    aromas: ['gelbe Frucht', 'Nuss', 'Wachs'],
    image: IMG.tasting,
    lagen: [RIED_KRAMER],
    wines: [{ name: 'Zierfandel, reinsortig', vintage: 2021, style: 'Trocken', price: '€ 31,00', note: 'Nur 900 Flaschen, handnummeriert.' }],
  },
  {
    id: 'neuburger',
    name: 'Neuburger',
    vivcId: 8497,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1800', certainty: 'approx' },
    origin: 'Zufallssämling · Donauraum',
    tagline: 'Mild, nussig, mit blaubereiftem Laub — ein leiser Klassiker, der Geduld belohnt.',
    aromas: ['Haselnuss', 'Blüte', 'Mandel'],
    image: IMG.tasting,
    lagen: [RIED_SOOSSER_HOEHE],
    wines: [{ name: 'Neuburger', vintage: 2022, style: 'Trocken', price: '€ 19,50', note: 'Auf der Feinhefe ausgebaut.' }],
  },
  {
    id: 'gruener-veltliner',
    name: 'Grüner Veltliner',
    vivcId: 12930,
    colour: 'white',
    species: 'vinifera',
    cluster: 'thermenregion',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1800', certainty: 'approx' },
    origin: 'Österreichs Signatur-Rebe',
    tagline: 'Pfeffrig, knackig, unverkennbar — Kind des Traminers und einer einzelnen wilden Rebe.',
    aromas: ['weißer Pfeffer', 'Limette', 'Erbse'],
    image: IMG.tasting,
    lagen: [RIED_SOOSSER_HOEHE, RIED_STEINRIEGEL],
    wines: [
      { name: 'Grüner Veltliner Steinriegel', vintage: 2023, style: 'Trocken · Lagenwein', price: '€ 18,90', note: 'Schotterlage, straff und salzig.' },
      { name: 'Grüner Veltliner Federspiel', vintage: 2023, style: 'Trocken · leicht', price: '€ 14,50', note: 'Der Heurigenwein, jung getrunken.' },
    ],
  },

  // ══ Klosterneuburg ═══════════════════════════════════════════════════════
  {
    id: 'blaufraenkisch',
    name: 'Blaufränkisch',
    vivcId: 1459,
    colour: 'red',
    species: 'vinifera',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1800', certainty: 'approx' },
    origin: 'Slowenien · historisch Untersteiermark',
    tagline:
      'Die dunkle Stammmutter der österreichischen Rotweine — Würze, Struktur, langer Atem. Steckt in Zweigelt, Blauburger, Rösler und Rathay.',
    aromas: ['Weichsel', 'Brombeere', 'schwarzer Pfeffer'],
    image: IMG.barrel,
    lagen: [RIED_LINDKOGEL],
    wines: [{ name: 'Blaufränkisch vom Dolomit', vintage: 2021, style: 'Trocken · Reserve', price: '€ 24,00', note: 'Zwölf Monate im großen Holz, Handlese.' }],
  },
  {
    id: 'sankt-laurent',
    name: 'Sankt Laurent',
    primeName: 'Saint Laurent',
    aka: 'St. Laurent',
    vivcId: 10470,
    colour: 'red',
    species: 'vinifera',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: 'vor 1860', certainty: 'approx' },
    origin: 'Frankreich',
    tagline:
      'Samtig, dunkelbeerig, mit dem Duft des Laurentiustags. Ein Pinot-Kind — der zweite Elternteil ist bis heute unbekannt.',
    aromas: ['Sauerkirsche', 'Waldboden', 'Nelke'],
    image: IMG.barrel,
    lagen: [RIED_STEINRIEGEL],
    wines: [{ name: 'Sankt Laurent, Alte Reben', vintage: 2020, style: 'Trocken', price: '€ 22,50', note: 'Von Stöcken über 40 Jahre.' }],
  },
  {
    id: 'blauer-portugieser',
    name: 'Blauer Portugieser',
    primeName: 'Portugieser blau',
    vivcId: 9620,
    colour: 'red',
    species: 'vinifera',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: 'vor 1800', certainty: 'approx' },
    origin: 'Slowenien · historisch Untersteiermark',
    tagline:
      'Leicht, süffig, früh gelesen. Halbgeschwister des Blaufränkisch — beide haben die Zimmettraube als Elternteil.',
    aromas: ['rote Ribisel', 'Kirsche', 'Veilchen'],
    image: IMG.barrel,
  },
  {
    id: 'zweigelt',
    name: 'Zweigelt',
    vivcId: 13484,
    colour: 'red',
    species: 'vinifera',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: '1922', year: 1922, certainty: 'exact' },
    origin: 'Klosterneuburg 1922 · Fritz Zweigelt',
    tagline: 'Österreichs meistgepflanzter Rotwein — die Wucht des Blaufränkisch, der Samt des Sankt Laurent.',
    aromas: ['Kirsche', 'Zwetschke', 'Kakao'],
    image: IMG.barrel,
    lagen: [RIED_STEINRIEGEL, RIED_LINDKOGEL],
    wines: [
      { name: 'Zweigelt vom Kalk', vintage: 2022, style: 'Trocken', price: '€ 16,50', note: 'Der Alltagswein des Hauses, saftig und direkt.' },
      { name: 'Zweigelt Réserve „58"', vintage: 2020, style: 'Trocken · Barrique', price: '€ 34,00', note: 'Achtzehn Monate Holz, nur Magnum.' },
    ],
  },
  {
    id: 'blauburger',
    name: 'Blauburger',
    vivcId: 1454,
    colour: 'red',
    species: 'vinifera',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: '1923', year: 1923, certainty: 'exact' },
    origin: 'Klosterneuburg 1923 · Fritz Zweigelt',
    tagline: 'Tiefdunkel, weich, farbstark — oft der Färber in der Cuvée, selten allein im Rampenlicht.',
    aromas: ['Holunder', 'Zwetschke', 'Bitterschokolade'],
    image: IMG.barrel,
    lagen: [RIED_LINDKOGEL],
    wines: [{ name: 'Blauburger', vintage: 2021, style: 'Trocken', price: '€ 17,50', note: 'Dunkle Farbe, sanftes Tannin.' }],
  },
  {
    id: 'seyve-villard-18402',
    name: 'Seyve-Villard 18-402',
    aka: 'die Brücke',
    vivcId: 11619,
    // VIVC 11619: „Colour of berry skin: NOIR". Im Altmodell fälschlich weiß.
    colour: 'red',
    species: 'interspecific',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: true,
    inHouse: false,
    epoch: { label: 'um 1930', certainty: 'approx' },
    origin: 'Frankreich · Hybridzüchtung',
    tagline:
      'Die französische Hybride, über die das Wildreben-Blut nach Klosterneuburg kam — und von dort in Rösler und Rathay.',
  },
  {
    id: 'kn-1189-9-77',
    name: 'Klosterneuburg 1189-9-77',
    aka: 'Zuchtnummer ohne Handelsnamen',
    vivcId: 23475,
    colour: 'red',
    species: 'interspecific',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: true,
    inHouse: false,
    epoch: { label: 'um 1960', certainty: 'approx' },
    origin: 'Klosterneuburg · HBLAuBA',
    tagline:
      'Kein Wein, nur ein Zwischenschritt: die Kreuzung, aus der Rösler und Rathay hervorgingen. Sie trägt Blaufränkisch ein zweites Mal in beide hinein.',
  },
  {
    id: 'roesler',
    name: 'Rösler',
    vivcId: 15438,
    colour: 'red',
    species: 'interspecific',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: '1970', year: 1970, certainty: 'disputed', note: 'VIVC nennt 1970; ältere Quellen nennen 1960 als Kreuzungsjahr.' },
    origin: 'Klosterneuburg · Gertrude Mayer · PIWI',
    tagline:
      'Pilzwiderstandsfähig, tiefdunkel, würzig. In ihm steckt Blaufränkisch zweimal — über den Zweigelt und über die Zuchtnummer.',
    aromas: ['Brombeere', 'Lorbeer', 'Tabak'],
    image: IMG.barrel,
    lagen: [RIED_LINDKOGEL],
    wines: [{ name: 'Rösler PIWI', vintage: 2022, style: 'Trocken · biotauglich', price: '€ 23,00', note: 'Kaum Spritzung nötig — der Zukunftsrote.' }],
  },
  {
    id: 'rathay',
    name: 'Rathay',
    vivcId: 16398,
    colour: 'red',
    species: 'interspecific',
    cluster: 'klosterneuburg',
    isFounder: false,
    isBreedingLine: false,
    inHouse: true,
    epoch: { label: '1970', year: 1970, certainty: 'exact' },
    origin: 'Klosterneuburg · Gertrude Mayer · PIWI',
    tagline: 'Dunkel, vollmundig, tanninreich — benannt nach dem zweiten Direktor der Klosterneuburger Weinbauschule.',
    aromas: ['dunkle Kirsche', 'Nelke', 'Kakao'],
    image: IMG.barrel,
    wines: [{ name: 'Rathay', vintage: 2021, style: 'Trocken · Reserve', price: '€ 25,00', note: 'Frosthart und robust, nur wenige Zeilen.' }],
  },

  // ══ Die Amerikaner ═══════════════════════════════════════════════════════
  {
    id: 'catawba',
    name: 'Catawba',
    vivcId: 2201,
    colour: 'red',
    species: 'american',
    cluster: 'amerikaner',
    isFounder: false,
    isBreedingLine: false,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'um 1800', certainty: 'approx' },
    origin: 'USA · North Carolina',
    tagline: 'Die ältere Amerikanerin — Elternteil des Concord.',
  },
  {
    id: 'taylor',
    name: 'Taylor',
    vivcId: 12269,
    colour: 'white',
    species: 'american',
    cluster: 'amerikaner',
    isFounder: false,
    isBreedingLine: false,
    parentageUnresearched: true,
    inHouse: false,
    epoch: { label: 'um 1840', certainty: 'approx' },
    origin: 'USA · Vitis labrusca × riparia',
    tagline: 'Elternteil von Elvira und Noah — die beiden sind also Halbgeschwister.',
  },
  {
    id: 'isabella',
    name: 'Isabella',
    vivcId: 5560,
    colour: 'red',
    species: 'american',
    cluster: 'amerikaner',
    isFounder: false,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: '1816', year: 1816, certainty: 'approx' },
    origin: 'USA · Vitis labrusca × vinifera',
    tagline: 'Der „Foxton": erdbeerig-parfümiert, unverkennbar wild. Klassische Uhudler-Traube.',
    aromas: ['Walderdbeere', 'Fuchston', 'Waldhonig'],
    image: IMG.bottle,
  },
  {
    id: 'concord',
    name: 'Concord',
    vivcId: 2801,
    colour: 'red',
    species: 'american',
    cluster: 'amerikaner',
    isFounder: false,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: '1849', year: 1849, certainty: 'approx' },
    origin: 'Massachusetts · Ephraim W. Bull',
    tagline: 'Tiefblau, süß, unbändig fruchtig — die Amerikanerin im Südburgenländer Uhudler-Satz.',
    aromas: ['blaue Traube', 'Kaugummi', 'Brombeere'],
    image: IMG.bottle,
  },
  {
    id: 'elvira',
    name: 'Elvira',
    vivcId: 3886,
    colour: 'white',
    species: 'american',
    cluster: 'amerikaner',
    isFounder: false,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: '1862', year: 1862, certainty: 'exact' },
    origin: 'USA · Jacob Rommel',
    tagline: 'Hellfruchtig, robust, ertragreich — die weiße Stimme im Uhudler.',
    aromas: ['grüner Apfel', 'Muskat', 'Kräuter'],
    image: IMG.bottle,
  },
  {
    id: 'noah',
    name: 'Noah',
    vivcId: 8573,
    colour: 'white',
    species: 'american',
    cluster: 'amerikaner',
    isFounder: false,
    isBreedingLine: false,
    inHouse: false,
    epoch: { label: '1869', year: 1869, certainty: 'exact' },
    origin: 'USA · Otto Wasserzieher',
    tagline: 'Grünlich, hochgehäckt an alten Kellergassen — der historische Direktträger des Uhudlers.',
    aromas: ['Foxton', 'Wiese', 'grüne Nuss'],
    image: IMG.bottle,
  },
]

// ── Kanten ─────────────────────────────────────────────────────────────────
// Jede Kante einzeln gegen VIVC geprüft (verifiziert 2026-08-30).
// `from: null` = Elternteil existiert nachweislich, ist aber unbenannt.

export const EDGES: LineageEdge[] = [
  // Thermenregion
  { from: 'traminer', to: 'silvaner', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(11805, 'Silvaner grün') },
  { from: 'oesterreichisch-weiss', to: 'silvaner', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(11805, 'Silvaner grün') },

  { from: 'traminer', to: 'rotgipfler', kind: 'crossing', confidence: 'published', source: vivc(10230, 'Rotgipfler') },
  { from: 'roter-veltliner', to: 'rotgipfler', kind: 'crossing', confidence: 'published', source: vivc(10230, 'Rotgipfler') },

  { from: 'traminer', to: 'zierfandel', kind: 'crossing', confidence: 'hypothesis', source: vivc(13250, 'Zierfandel'), note: 'Vollgeschwister des Rotgipflers — dieselbe Elternkombination.' },
  { from: 'roter-veltliner', to: 'zierfandel', kind: 'crossing', confidence: 'hypothesis', source: vivc(13250, 'Zierfandel') },

  { from: 'roter-veltliner', to: 'neuburger', kind: 'crossing', confidence: 'published', source: vivc(8497, 'Neuburger') },
  { from: 'silvaner', to: 'neuburger', kind: 'crossing', confidence: 'published', source: vivc(8497, 'Neuburger') },

  { from: 'traminer', to: 'gruener-veltliner', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(12930, 'Grüner Veltliner') },
  { from: 'sankt-georgen', to: 'gruener-veltliner', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(12930, 'Grüner Veltliner') },

  // Klosterneuburg
  { from: 'blaue-zimmettraube', to: 'blaufraenkisch', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(1459, 'Blaufränkisch') },
  { from: 'heunisch-weiss', to: 'blaufraenkisch', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(1459, 'Blaufränkisch') },

  { from: 'blaue-zimmettraube', to: 'blauer-portugieser', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(9620, 'Portugieser blau') },
  { from: 'silvaner', to: 'blauer-portugieser', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(9620, 'Portugieser blau') },

  { from: 'pinot-noir', to: 'sankt-laurent', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(10470, 'Saint Laurent') },
  { from: null, to: 'sankt-laurent', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(10470, 'Saint Laurent'), note: 'Zweiter Elternteil bis heute unbekannt.' },

  { from: 'blaufraenkisch', to: 'zweigelt', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(13484, 'Zweigelt') },
  { from: 'sankt-laurent', to: 'zweigelt', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(13484, 'Zweigelt') },

  { from: 'blauer-portugieser', to: 'blauburger', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(1454, 'Blauburger') },
  { from: 'blaufraenkisch', to: 'blauburger', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(1454, 'Blauburger') },

  { from: 'seibel-7162', to: 'seyve-villard-18402', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(11619, 'Seyve-Villard 18-402') },
  { from: 'seyve-villard-12308', to: 'seyve-villard-18402', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(11619, 'Seyve-Villard 18-402') },

  { from: 'seyve-villard-18402', to: 'kn-1189-9-77', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(23475, 'Klosterneuburg 1189-9-77') },
  { from: 'blaufraenkisch', to: 'kn-1189-9-77', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(23475, 'Klosterneuburg 1189-9-77') },

  { from: 'zweigelt', to: 'roesler', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(15438, 'Rösler') },
  { from: 'kn-1189-9-77', to: 'roesler', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(15438, 'Rösler') },

  { from: 'blauburger', to: 'rathay', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(16398, 'Rathay') },
  { from: 'kn-1189-9-77', to: 'rathay', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(16398, 'Rathay') },

  // Die Amerikaner
  { from: 'catawba', to: 'concord', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(2801, 'Concord') },
  { from: null, to: 'concord', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(2801, 'Concord'), note: 'Wilde Vitis labrusca, nicht näher bestimmt.' },

  { from: 'meslier-petit', to: 'isabella', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(5560, 'Isabella') },
  { from: null, to: 'isabella', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(5560, 'Isabella'), note: 'Wilde Vitis labrusca, nicht näher bestimmt.' },

  { from: 'taylor', to: 'elvira', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(3886, 'Elvira') },
  { from: 'martha', to: 'elvira', kind: 'crossing', confidence: 'hypothesis', source: vivc(3886, 'Elvira'), note: 'VIVC führt den zweiten Elternteil mit Fragezeichen.' },

  { from: 'taylor', to: 'noah', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(8573, 'Noah') },
  { from: null, to: 'noah', kind: 'crossing', confidence: 'marker-confirmed', source: vivc(8573, 'Noah'), note: 'Freie Abblüte — zweiter Elternteil unbekannt.' },
]

// ── Graph-Helfer ───────────────────────────────────────────────────────────

const BY_ID = new Map(NODES.map(n => [n.id, n]))

export function nodeById(id: string): GrapeNode | undefined {
  return BY_ID.get(id)
}

/** Alle Kreuzungs-Kanten, die in `id` münden. */
export function incomingOf(id: string): LineageEdge[] {
  return EDGES.filter(e => e.to === id && e.kind === 'crossing')
}

/** Benannte Eltern von `id` (unbenannte `from: null` werden übersprungen). */
export function parentsOf(id: string): string[] {
  return incomingOf(id)
    .map(e => e.from)
    .filter((p): p is string => p !== null)
}

/** Hat `id` einen nachgewiesenen, aber unbenannten Elternteil? */
export function hasUnknownParent(id: string): boolean {
  return incomingOf(id).some(e => e.from === null)
}

export function childrenOf(id: string): string[] {
  return EDGES.filter(e => e.from === id && e.kind === 'crossing').map(e => e.to)
}

/** Transitive Vorfahren (ohne den Knoten selbst). */
export function ancestorsOf(id: string): Set<string> {
  const acc = new Set<string>()
  const walk = (cur: string) => {
    for (const p of parentsOf(cur)) {
      if (!acc.has(p)) {
        acc.add(p)
        walk(p)
      }
    }
  }
  walk(id)
  return acc
}

/**
 * Transitive Nachkommen (ohne den Knoten selbst).
 *
 * Fehlte im Altmodell komplett — deshalb leuchtete beim Klick auf eine Urrebe
 * (Traminer, Blaufränkisch …) KEINE einzige Kante auf: die Hervorhebung kannte
 * nur Vorfahren, und die sind bei einem Founder leer.
 */
export function descendantsOf(id: string): Set<string> {
  const acc = new Set<string>()
  const walk = (cur: string) => {
    for (const c of childrenOf(cur)) {
      if (!acc.has(c)) {
        acc.add(c)
        walk(c)
      }
    }
  }
  walk(id)
  return acc
}

/** Vorfahren + Nachkommen + der Knoten selbst — die vollständige Verwandtschaft. */
export function kinOf(id: string): Set<string> {
  const acc = new Set<string>([id, ...ancestorsOf(id), ...descendantsOf(id)])
  return acc
}

/** Vollgeschwister: exakt dieselbe Elternkombination. Halbgeschwister: mindestens ein Elternteil geteilt. */
export function siblingsOf(id: string): { full: string[]; half: string[] } {
  const mine = new Set(parentsOf(id))
  const full: string[] = []
  const half: string[] = []
  if (mine.size === 0) return { full, half }
  for (const n of NODES) {
    if (n.id === id) continue
    const theirs = parentsOf(n.id)
    if (theirs.length === 0) continue
    const shared = theirs.filter(p => mine.has(p))
    if (shared.length === 0) continue
    if (shared.length === mine.size && theirs.length === mine.size) full.push(n.id)
    else half.push(n.id)
  }
  return { full, half }
}

/**
 * Zählt, über wie viele verschiedene Pfade `ancestor` in `id` einfliesst.
 * > 1 bedeutet Rückkreuzung — der „Diamant", der beweist, dass es kein Baum ist.
 * Beispiel: Blaufränkisch fliesst zweimal in Rösler ein.
 */
export function pathCount(ancestor: string, id: string): number {
  if (ancestor === id) return 1
  return parentsOf(id).reduce((sum, p) => sum + pathCount(ancestor, p), 0)
}

/** Alle Vorfahren, die über mehr als einen Pfad einfliessen. */
export function diamondsOf(id: string): { ancestor: string; paths: number }[] {
  return [...ancestorsOf(id)]
    .map(a => ({ ancestor: a, paths: pathCount(a, id) }))
    .filter(d => d.paths > 1)
    .sort((a, b) => b.paths - a.paths)
}

/** Topologische Tiefe: Kind liegt immer unter seinem tiefsten Elternteil. Ersetzt das alte, widersprüchliche `row`. */
export function depthOf(id: string): number {
  const ps = parentsOf(id)
  if (ps.length === 0) return 0
  return 1 + Math.max(...ps.map(depthOf))
}

export function nodesInCluster(c: Cluster): GrapeNode[] {
  return NODES.filter(n => n.cluster === c)
}

/**
 * Knoten ausserhalb von `c`, die per Kreuzung direkt mit dem Cluster verbunden
 * sind — die „Brücken-Chips" der Familien-Ansicht. Ohne sie zerfällt die
 * Galerie in unverbundene Inseln.
 */
export function bridgesOf(c: Cluster): string[] {
  const inside = new Set(nodesInCluster(c).map(n => n.id))
  const out = new Set<string>()
  for (const e of EDGES) {
    if (e.kind !== 'crossing' || !e.from) continue
    if (inside.has(e.to) && !inside.has(e.from)) out.add(e.from)
    if (inside.has(e.from) && !inside.has(e.to)) out.add(e.to)
  }
  return [...out]
}

/** Kurzlabel für die Art des Knotens. */
export function kindLabel(n: GrapeNode): string {
  if (n.isBreedingLine) return 'Zuchtnummer'
  if (n.isFounder) return 'Urahn'
  if (n.species === 'american') return 'Direktträger'
  if (n.species === 'interspecific') return 'Neuzüchtung'
  return 'Kreuzung'
}

/** Wie die Herkunft im Detail formuliert wird — ehrlich über Wissensgrenzen. */
export function originStatement(n: GrapeNode): string {
  if (n.isFounder) return 'Urahn — die Eltern sind nicht bekannt. Hier endet das gesicherte Wissen.'
  if (n.parentageUnresearched) return 'Abstammung für diesen Showcase nicht weiter verfolgt.'
  const named = parentsOf(n.id).map(p => nodeById(p)?.name ?? p)
  const unknown = hasUnknownParent(n.id)
  if (named.length === 0) return 'Kreuzung aus unbekannten Eltern.'
  if (unknown) return `Kreuzung aus ${named.join(' × ')} und einem unbekannten Elternteil.`
  return `Kreuzung aus ${named.join(' × ')}.`
}
