/**
 * Layout-Primitiv für Rebsorten-Teilgraphen.
 *
 * Beide Konzepte (Galerie pro Haus, Fokus auf eine Rebe) rendern nie den
 * ganzen Graphen, sondern immer einen kleinen Ausschnitt von 5–12 Knoten.
 * Diese Datei rechnet aus einer Knotenmenge eine fertige Komposition.
 *
 * Zwei Dinge unterscheiden sie vom alten `POS`-Handlayout:
 *
 * 1. KREUZUNGSKNOTEN. Zwei Elternlinien laufen nicht getrennt auf das Kind zu
 *    (das las sich als zwei unabhängige Kanten), sondern treffen sich in einem
 *    Punkt, der Jahr und Ort trägt — von dort geht EINE Linie zum Kind:
 *
 *        Blaufränkisch        Sankt Laurent
 *              │                    │
 *              └─────────┬──────────┘
 *                        ●  Klosterneuburg 1922
 *                        │
 *                     Zweigelt
 *
 *    Genealogie-Software löst „zwei Eltern → ein Kind" seit Jahrzehnten so
 *    (McGuffin & Balakrishnan, InfoVis 2005; Gramps; Ancestris).
 *
 * 2. KREUZUNGSMINIMIERUNG. Layering nach topologischer Tiefe, Dummy-Knoten für
 *    mehrschichtige Kanten (damit keine Linie durch ein fremdes Kästchen
 *    läuft), Barycenter-Sortierung und eine Prioritäts-Ausrichtung für die
 *    x-Position. Das alte Layout hatte 8 Kreuzungen bei 16 Kanten.
 *
 * Reine Geometrie — kein React, kein DOM, testbar.
 */

import { EDGES, NODES, nodeById, type Confidence, type LineageEdge } from './lineage-graph'

// ── Öffentliche Typen ───────────────────────────────────────────────────────

export interface LayoutOptions {
  /** Breite eines Sorten-Kästchens. */
  nodeW: number
  /** Höhe eines Sorten-Kästchens. */
  nodeH: number
  /** Horizontaler Mindestabstand zwischen zwei Kästchen. */
  gapX: number
  /** Vertikaler Abstand zwischen zwei Ebenen. */
  gapY: number
  /** Radius des Kreuzungspunkts. */
  unionR: number
  /** Rand um die gesamte Komposition. */
  pad: number
}

export const DEFAULT_LAYOUT: LayoutOptions = {
  nodeW: 208,
  nodeH: 84,
  gapX: 40,
  gapY: 108,
  unionR: 6,
  pad: 32,
}

export interface PlacedGrape {
  kind: 'grape'
  id: string
  /** Linke obere Ecke. */
  x: number
  y: number
  w: number
  h: number
  /** Mittelpunkt — bequem für Kanten und Fokus-Framing. */
  cx: number
  cy: number
  depth: number
}

export interface PlacedUnion {
  kind: 'union'
  /** Synthetische Id, z. B. `union:zweigelt`. */
  id: string
  /** Das Kind, das aus dieser Kreuzung hervorging. */
  childId: string
  cx: number
  cy: number
  r: number
  /** Beschriftung des Kreuzungs-Ereignisses, z. B. „Klosterneuburg · 1922". */
  label: string
  /** Mindestens ein Elternteil ist unbekannt oder nicht im Ausschnitt. */
  incomplete: boolean
}

export type PlacedNode = PlacedGrape | PlacedUnion

export interface PlacedEdge {
  id: string
  /** SVG-Pfad. */
  d: string
  /** `null` bei einem unbenannten Elternteil. */
  from: string | null
  to: string
  confidence: Confidence
  /** Kante endet an einem Fragezeichen-Stummel statt an einem Knoten. */
  unknownParent: boolean
  note?: string
}

export interface Layout {
  nodes: PlacedNode[]
  edges: PlacedEdge[]
  width: number
  height: number
  /** Anzahl Kantenkreuzungen — für Tests und Layout-Regression. */
  crossings: number
}

// ── Interne Struktur ────────────────────────────────────────────────────────

type ItemKind = 'grape' | 'union' | 'dummy' | 'stub'

interface Item {
  key: string
  kind: ItemKind
  /** Sorten-Id bei `grape`, Kind-Id bei `union`/`stub`, leer bei `dummy`. */
  ref: string
  layer: number
  order: number
  x: number
  w: number
  /** Kanten-Id, zu der ein Dummy gehört. */
  edgeId?: string
}

const KEY = {
  grape: (id: string) => `g:${id}`,
  union: (child: string) => `u:${child}`,
  stub: (child: string, i: number) => `s:${child}:${i}`,
  dummy: (edgeId: string, layer: number) => `d:${edgeId}:${layer}`,
}

/** Kreuzungs-Kanten des Teilgraphen, gruppiert nach Kind. */
function incomingWithin(ids: Set<string>, childId: string): LineageEdge[] {
  return EDGES.filter(
    e => e.kind === 'crossing' && e.to === childId && (e.from === null || ids.has(e.from)),
  )
}

/** Beschriftung des Kreuzungspunkts aus dem Kind-Knoten. */
function unionLabel(childId: string): string {
  const n = nodeById(childId)
  if (!n) return ''
  const place = n.origin.split('·')[0].trim()
  const year = n.epoch.label
  // „Klosterneuburg 1922 · Fritz Zweigelt" -> „Klosterneuburg · 1922"
  const short = place.replace(/\s*\d{4}\s*/, '').trim()
  return short && short.length < 24 ? `${short} · ${year}` : year
}

/**
 * Topologische Tiefe INNERHALB des Ausschnitts (Knoten ausserhalb zählen nicht).
 *
 * Ein unbenannter Elternteil (`from: null`) zählt wie ein Elternteil auf Tiefe 0:
 * Sein Fragezeichen-Stummel belegt eine eigene Ebene, also muss das Kind
 * mindestens auf Tiefe 1 liegen. Sonst käme sein Kreuzungspunkt auf Ebene −1 —
 * das trifft z. B. Sankt Laurent im Haus Klosterneuburg, dessen benannter
 * Elternteil Pinot Noir ausserhalb des Ausschnitts liegt.
 */
function depthsWithin(ids: Set<string>): Map<string, number> {
  const depth = new Map<string, number>()
  const visiting = new Set<string>()
  const walk = (id: string): number => {
    const hit = depth.get(id)
    if (hit !== undefined) return hit
    if (visiting.has(id)) return 0 // Zyklenschutz; der Graph ist ein DAG
    visiting.add(id)
    const inc = incomingWithin(ids, id)
    const d = inc.length === 0 ? 0 : 1 + Math.max(...inc.map(e => (e.from === null ? 0 : walk(e.from))))
    visiting.delete(id)
    depth.set(id, d)
    return d
  }
  for (const id of ids) walk(id)
  return depth
}

// ── Ordnung: Barycenter-Sweeps ──────────────────────────────────────────────

function orderLayers(layers: Item[][], adjDown: Map<string, string[]>, adjUp: Map<string, string[]>) {
  const bary = (keys: string[], pos: Map<string, number>): number => {
    const vals = keys.map(k => pos.get(k)).filter((v): v is number => v !== undefined)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : Number.NaN
  }

  for (let sweep = 0; sweep < 6; sweep++) {
    const down = sweep % 2 === 0
    const range = down ? [...layers.keys()].slice(1) : [...layers.keys()].slice(0, -1).reverse()
    for (const li of range) {
      const pos = new Map<string, number>()
      const ref = layers[down ? li - 1 : li + 1]
      ref.forEach((it, i) => pos.set(it.key, i))
      const adj = down ? adjUp : adjDown
      const scored = layers[li].map((it, i) => ({
        it,
        i,
        b: bary(adj.get(it.key) ?? [], pos),
      }))
      scored.sort((a, b) => {
        const av = Number.isNaN(a.b) ? a.i : a.b
        const bv = Number.isNaN(b.b) ? b.i : b.b
        return av - bv || a.i - b.i
      })
      layers[li] = scored.map(s => s.it)
    }
    layers.forEach(l => l.forEach((it, i) => (it.order = i)))
  }
}

// ── x-Zuweisung: Barycenter + Überlappungsauflösung ─────────────────────────

function assignX(layers: Item[][], adjDown: Map<string, string[]>, adjUp: Map<string, string[]>, gapX: number) {
  const byKey = new Map<string, Item>()
  layers.flat().forEach(it => byKey.set(it.key, it))

  // Startaufstellung: dicht an dicht.
  for (const layer of layers) {
    let cursor = 0
    for (const it of layer) {
      it.x = cursor + it.w / 2
      cursor += it.w + gapX
    }
  }

  const resolve = (layer: Item[]) => {
    // links -> rechts auseinanderschieben
    for (let i = 1; i < layer.length; i++) {
      const min = layer[i - 1].x + layer[i - 1].w / 2 + gapX + layer[i].w / 2
      if (layer[i].x < min) layer[i].x = min
    }
    // rechts -> links, damit die Gruppe nicht nach rechts driftet
    for (let i = layer.length - 2; i >= 0; i--) {
      const max = layer[i + 1].x - layer[i + 1].w / 2 - gapX - layer[i].w / 2
      if (layer[i].x > max) layer[i].x = max
    }
  }

  for (let pass = 0; pass < 8; pass++) {
    const down = pass % 2 === 0
    const range = down ? [...layers.keys()].slice(1) : [...layers.keys()].slice(0, -1).reverse()
    for (const li of range) {
      for (const it of layers[li]) {
        const nb = (down ? adjUp : adjDown).get(it.key) ?? []
        const xs = nb.map(k => byKey.get(k)?.x).filter((v): v is number => v !== undefined)
        if (xs.length) it.x = xs.reduce((a, b) => a + b, 0) / xs.length
      }
      layers[li].sort((a, b) => a.x - b.x)
      resolve(layers[li])
    }
  }
  layers.forEach(l => l.forEach((it, i) => (it.order = i)))
}

// ── Pfade ───────────────────────────────────────────────────────────────────

/** Glatte Kurve durch eine Punktfolge, mit vertikalen Tangenten. */
function pathThrough(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const k = Math.max(12, Math.abs(b.y - a.y) * 0.5)
    d += ` C ${a.x.toFixed(1)} ${(a.y + k).toFixed(1)}, ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
  }
  return d
}

// ── Kreuzungszählung (für Tests) ────────────────────────────────────────────

function sampleCount(d: string): { x: number; y: number }[] {
  // Grobe Näherung: die Kontrollpunkte des Pfads reichen für eine
  // Kreuzungs-Kennzahl, die Layout-Regressionen sichtbar macht.
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] })
  return pts
}

function segmentsIntersect(
  a: { x: number; y: number }, b: { x: number; y: number },
  c: { x: number; y: number }, e: { x: number; y: number },
): boolean {
  const s1x = b.x - a.x, s1y = b.y - a.y, s2x = e.x - c.x, s2y = e.y - c.y
  const den = -s2x * s1y + s1x * s2y
  if (Math.abs(den) < 1e-9) return false
  const s = (-s1y * (a.x - c.x) + s1x * (a.y - c.y)) / den
  const t = (s2x * (a.y - c.y) - s2y * (a.x - c.x)) / den
  return s > 0.01 && s < 0.99 && t > 0.01 && t < 0.99
}

function countCrossings(edges: PlacedEdge[]): number {
  const polys = edges.map(e => sampleCount(e.d))
  let n = 0
  for (let i = 0; i < polys.length; i++) {
    for (let j = i + 1; j < polys.length; j++) {
      let hit = false
      for (let a = 0; a + 1 < polys[i].length && !hit; a++) {
        for (let b = 0; b + 1 < polys[j].length; b++) {
          if (segmentsIntersect(polys[i][a], polys[i][a + 1], polys[j][b], polys[j][b + 1])) {
            hit = true
            break
          }
        }
      }
      if (hit) n++
    }
  }
  return n
}

// ── Hauptfunktion ───────────────────────────────────────────────────────────

/**
 * Rechnet eine fertige Komposition für den Teilgraphen `nodeIds`.
 *
 * Der Aufrufer entscheidet, WELCHE Knoten er zeigt (ein Haus, ein Ego-Graph,
 * die ganze Tafel) — diese Funktion entscheidet nur, wo sie liegen.
 */
export function layoutSubgraph(nodeIds: string[], opts: Partial<LayoutOptions> = {}): Layout {
  const o = { ...DEFAULT_LAYOUT, ...opts }
  const ids = new Set(nodeIds.filter(id => nodeById(id)))
  if (ids.size === 0) return { nodes: [], edges: [], width: 0, height: 0, crossings: 0 }

  const depth = depthsWithin(ids)
  const maxDepth = Math.max(...[...ids].map(id => depth.get(id) ?? 0))

  // ── Items anlegen ────────────────────────────────────────────────────────
  // Sorten liegen auf geraden Ebenen (2·Tiefe), Kreuzungspunkte auf der
  // ungeraden Ebene direkt darüber.
  const layerCount = maxDepth * 2 + 1
  const layers: Item[][] = Array.from({ length: layerCount }, () => [])
  const items = new Map<string, Item>()

  const push = (it: Item) => {
    items.set(it.key, it)
    layers[it.layer].push(it)
  }

  for (const id of ids) {
    const d = depth.get(id) ?? 0
    push({ key: KEY.grape(id), kind: 'grape', ref: id, layer: d * 2, order: 0, x: 0, w: o.nodeW })
  }

  const adjDown = new Map<string, string[]>()
  const adjUp = new Map<string, string[]>()
  const link = (from: string, to: string) => {
    adjDown.set(from, [...(adjDown.get(from) ?? []), to])
    adjUp.set(to, [...(adjUp.get(to) ?? []), from])
  }

  interface RawEdge {
    id: string
    from: string | null
    to: string
    confidence: Confidence
    note?: string
    /** Ziel-Item: der Kreuzungspunkt des Kindes. */
    unionKey: string
    /** Start-Item. */
    sourceKey: string
    unknownParent: boolean
  }
  const raw: RawEdge[] = []

  for (const id of ids) {
    const inc = incomingWithin(ids, id)
    if (inc.length === 0) continue
    const d = depth.get(id) ?? 0
    const uKey = KEY.union(id)
    push({ key: uKey, kind: 'union', ref: id, layer: d * 2 - 1, order: 0, x: 0, w: o.unionR * 2 })
    link(uKey, KEY.grape(id))

    inc.forEach((e, i) => {
      if (e.from === null) {
        // Unbenannter Elternteil: kurzer Stummel neben dem Kreuzungspunkt.
        const sKey = KEY.stub(id, i)
        push({ key: sKey, kind: 'stub', ref: id, layer: d * 2 - 2 >= 0 ? d * 2 - 2 : 0, order: 0, x: 0, w: 28 })
        link(sKey, uKey)
        raw.push({ id: `${sKey}->${uKey}`, from: null, to: id, confidence: e.confidence, note: e.note, unionKey: uKey, sourceKey: sKey, unknownParent: true })
      } else {
        link(KEY.grape(e.from), uKey)
        raw.push({ id: `${e.from}->${id}`, from: e.from, to: id, confidence: e.confidence, note: e.note, unionKey: uKey, sourceKey: KEY.grape(e.from), unknownParent: false })
      }
    })
  }

  // ── Dummy-Knoten für mehrschichtige Kanten ───────────────────────────────
  // Ohne sie läuft eine Kante von Ebene 0 nach Ebene 5 quer durch alle
  // Kästchen dazwischen.
  const routes = new Map<string, string[]>() // edgeId -> Item-Keys von Start bis Kreuzungspunkt
  for (const r of raw) {
    const a = items.get(r.sourceKey)!
    const b = items.get(r.unionKey)!
    const chain = [r.sourceKey]
    if (b.layer - a.layer > 1) {
      // vorhandene Verbindung durch die Kette ersetzen
      adjDown.set(r.sourceKey, (adjDown.get(r.sourceKey) ?? []).filter(k => k !== r.unionKey))
      adjUp.set(r.unionKey, (adjUp.get(r.unionKey) ?? []).filter(k => k !== r.sourceKey))
      let prev = r.sourceKey
      for (let L = a.layer + 1; L < b.layer; L++) {
        const dk = KEY.dummy(r.id, L)
        push({ key: dk, kind: 'dummy', ref: '', layer: L, order: 0, x: 0, w: 2, edgeId: r.id })
        link(prev, dk)
        chain.push(dk)
        prev = dk
      }
      link(prev, r.unionKey)
    }
    chain.push(r.unionKey)
    routes.set(r.id, chain)
  }

  // ── Ordnen und positionieren ─────────────────────────────────────────────
  layers.forEach(l => l.forEach((it, i) => (it.order = i)))
  orderLayers(layers, adjDown, adjUp)
  assignX(layers, adjDown, adjUp, o.gapX)

  // y je Ebene: Sortenzeilen im Raster, Kreuzungspunkte im Zwischenraum.
  const rowY = (grapeDepth: number) => o.pad + grapeDepth * (o.nodeH + o.gapY)
  const layerY = (layer: number) =>
    layer % 2 === 0 ? rowY(layer / 2) : rowY((layer + 1) / 2) - o.gapY * 0.46

  // Auf x >= pad normalisieren.
  const allItems = [...items.values()]
  const minX = Math.min(...allItems.map(it => it.x - it.w / 2))
  const shift = o.pad - minX
  allItems.forEach(it => (it.x += shift))

  // ── Ausgabe: Knoten ──────────────────────────────────────────────────────
  const placed: PlacedNode[] = []
  for (const it of allItems) {
    if (it.kind === 'grape') {
      const y = layerY(it.layer)
      placed.push({
        kind: 'grape',
        id: it.ref,
        x: it.x - o.nodeW / 2,
        y,
        w: o.nodeW,
        h: o.nodeH,
        cx: it.x,
        cy: y + o.nodeH / 2,
        depth: it.layer / 2,
      })
    } else if (it.kind === 'union') {
      const inc = incomingWithin(ids, it.ref)
      const total = EDGES.filter(e => e.kind === 'crossing' && e.to === it.ref).length
      placed.push({
        kind: 'union',
        id: it.key,
        childId: it.ref,
        cx: it.x,
        cy: layerY(it.layer),
        r: o.unionR,
        label: unionLabel(it.ref),
        incomplete: inc.length < total || inc.some(e => e.from === null),
      })
    }
  }

  // ── Ausgabe: Kanten ──────────────────────────────────────────────────────
  const pointOf = (key: string, role: 'exit' | 'enter' | 'mid'): { x: number; y: number } => {
    const it = items.get(key)!
    const y = layerY(it.layer)
    if (it.kind === 'grape') return { x: it.x, y: role === 'exit' ? y + o.nodeH : y }
    return { x: it.x, y }
  }

  const outEdges: PlacedEdge[] = []
  for (const r of raw) {
    const chain = routes.get(r.id)!
    const pts = chain.map((k, i) =>
      pointOf(k, i === 0 ? 'exit' : i === chain.length - 1 ? 'enter' : 'mid'),
    )
    outEdges.push({
      id: r.id,
      d: pathThrough(pts),
      from: r.from,
      to: r.to,
      confidence: r.confidence,
      unknownParent: r.unknownParent,
      note: r.note,
    })
  }
  // Kreuzungspunkt -> Kind: eine Linie, unabhängig von der Elternzahl.
  for (const p of placed) {
    if (p.kind !== 'union') continue
    const child = placed.find(q => q.kind === 'grape' && q.id === p.childId) as PlacedGrape | undefined
    if (!child) continue
    outEdges.push({
      id: `${p.id}->child`,
      d: pathThrough([{ x: p.cx, y: p.cy }, { x: child.cx, y: child.y }]),
      from: p.id,
      to: p.childId,
      confidence: 'marker-confirmed',
      unknownParent: false,
    })
  }

  const width = Math.max(...allItems.map(it => it.x + it.w / 2)) + o.pad
  const height = rowY(maxDepth) + o.nodeH + o.pad

  return { nodes: placed, edges: outEdges, width, height, crossings: countCrossings(outEdges) }
}

/** Bequemer Ausschnitt: eine Rebe plus Eltern, Geschwister und Kinder (Ego-Graph). */
export function egoIds(id: string, hops = 1): string[] {
  const acc = new Set<string>([id])
  const step = (cur: string) => {
    for (const e of EDGES) {
      if (e.kind !== 'crossing') continue
      if (e.to === cur && e.from) acc.add(e.from)
      if (e.from === cur) acc.add(e.to)
    }
  }
  let frontier = [id]
  for (let h = 0; h < hops; h++) {
    const before = new Set(acc)
    frontier.forEach(step)
    frontier = [...acc].filter(x => !before.has(x))
  }
  // Geschwister ergänzen: alles, was einen Elternteil mit `id` teilt.
  const mine = EDGES.filter(e => e.kind === 'crossing' && e.to === id && e.from).map(e => e.from!)
  for (const n of NODES) {
    const theirs = EDGES.filter(e => e.kind === 'crossing' && e.to === n.id && e.from).map(e => e.from!)
    if (theirs.some(p => mine.includes(p))) acc.add(n.id)
  }
  return [...acc]
}
