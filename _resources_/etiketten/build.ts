/**
 * Builds the label design alternatives for Weingut Buchart 58:
 * print-size SVGs (mm, fonts embedded), PNG previews and an overview sheet.
 *
 * Run from the repo root: bun _resources_/etiketten/build.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import QRCode from 'qrcode'
import { chromium } from '@playwright/test'

const HERE = import.meta.dir
const FONT_DIR = join(HERE, '..', '..', 'section-showcase', 'node_modules', '@fontsource')

// ─── Format ─────────────────────────────────────────────────────────────────────
// Estimated from the product photos (width to height ≈ 0.55). The real size has
// to come from the printer; every layout is plain vector and can be re-spaced.
const W = 80
const H = 140
const CX = W / 2

/** Placeholder: the real QR code points to the wine's e-label page. */
const QR_URL = 'https://www.buchart58.at'

// ─── Fonts (Buch·Art family of the section showcase, both OFL) ──────────────────
const FONT_FACES: Record<string, { family: string; file: string; weight: number; style: string; css: string }> = {
  g: { family: 'Goudy', file: 'sorts-mill-goudy/files/sorts-mill-goudy-latin-400-normal.woff2', weight: 400, style: 'normal', css: 'font-family:Goudy;font-variant-numeric:lining-nums' },
  gi: { family: 'Goudy', file: 'sorts-mill-goudy/files/sorts-mill-goudy-latin-400-italic.woff2', weight: 400, style: 'italic', css: 'font-family:Goudy;font-style:italic;font-variant-numeric:lining-nums' },
  s4: { family: 'Schibsted', file: 'schibsted-grotesk/files/schibsted-grotesk-latin-400-normal.woff2', weight: 400, style: 'normal', css: 'font-family:Schibsted;font-weight:400' },
  s5: { family: 'Schibsted', file: 'schibsted-grotesk/files/schibsted-grotesk-latin-500-normal.woff2', weight: 500, style: 'normal', css: 'font-family:Schibsted;font-weight:500' },
  s6: { family: 'Schibsted', file: 'schibsted-grotesk/files/schibsted-grotesk-latin-600-normal.woff2', weight: 600, style: 'normal', css: 'font-family:Schibsted;font-weight:600' },
}

function fontCss(body: string): string {
  // Embed only the faces a label uses; each text element carries exactly one class.
  return Object.entries(FONT_FACES)
    .filter(([cls]) => body.includes(`class="${cls}"`))
    .map(([cls, f]) => {
      const data = readFileSync(join(FONT_DIR, f.file)).toString('base64')
      return `@font-face{font-family:${f.family};src:url(data:font/woff2;base64,${data}) format('woff2');font-weight:${f.weight};font-style:${f.style}}.${cls}{${f.css}}`
    })
    .join('')
}

// ─── Primitives ─────────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const n = (v: number) => Number(v.toFixed(3))

interface TextOpts { anchor?: 'start' | 'middle' | 'end'; ls?: number; rotate?: number }

/** One line of text; size is the font size in mm. */
function text(x: number, y: number, size: number, cls: keyof typeof FONT_FACES, fill: string, content: string, o: TextOpts = {}) {
  const anchor = o.anchor && o.anchor !== 'start' ? ` text-anchor="${o.anchor}"` : ''
  const ls = o.ls ? ` letter-spacing="${o.ls}"` : ''
  // Letter-spacing also follows the last glyph; shift so centred text stays centred.
  if (o.ls && o.anchor === 'middle' && !o.rotate) x += o.ls / 2
  const rot = o.rotate ? ` transform="rotate(${o.rotate} ${n(x)} ${n(y)})"` : ''
  return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" class="${cls}" fill="${fill}"${anchor}${ls}${rot}>${esc(content)}</text>`
}

const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, width: number) =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${stroke}" stroke-width="${width}"/>`

// The book signet from the logo (left page wine glass, right page grape),
// same line drawing as section-showcase/src/sections/buchart-kit.tsx.
const SIGNET_PATHS = [
  'M2.5 11v30.2c10.2-3 21.2-2.6 29.5 1.3 8.3-3.9 19.3-4.3 29.5-1.3V11',
  'M32 9.2C24.3 4.8 13.6 4.4 5.2 7.4v30.3c8.4-2.9 19.1-2.5 26.8 1.8',
  'M32 9.2c7.7-4.4 18.4-4.8 26.8-1.8v30.3c-8.4-2.9-19.1-2.5-26.8 1.8V9.2',
  'M12.6 13.4c0 7.4 10.8 7.4 10.8 0Z',
  'M13.4 16.2h9.2',
  'M18 19.6v7.6',
  'M14.6 28.2c2.2-.9 4.6-.9 6.8 0',
  'M46 12.6c0-1.6.8-2.6 2.4-3',
  'M47.4 11.2c2.2-2 5.2-1.8 6.4.4-2.4 1.2-4.6 1-6.4-.4Z',
]
const GRAPES: [number, number][] = [
  [41.8, 15], [46, 15], [50.2, 15], [43.9, 18.7], [48.1, 18.7],
  [41.8, 18.7], [50.2, 18.7], [46, 22.4], [43.9, 26.1], [48.1, 22.4],
]

/** Signet centred on cx, top edge at top; width in mm, stroke width in mm. */
function signet(cx: number, top: number, width: number, stroke: string, strokeMm: number) {
  const s = width / 64
  const paths = SIGNET_PATHS.map(d => `<path d="${d}"/>`).join('')
  const grapes = GRAPES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.9"/>`).join('')
  return `<g transform="translate(${n(cx - width / 2)} ${n(top)}) scale(${n(s)})" fill="none" stroke="${stroke}" stroke-width="${n(strokeMm / s)}" stroke-linecap="round" stroke-linejoin="round">${paths}${grapes}</g>`
}

/** QR code; with a tile colour it sits on a light square (needed on dark labels). */
function qr(x: number, y: number, size: number, dark: string, tile?: string) {
  const code = QRCode.create(QR_URL, { errorCorrectionLevel: 'M' })
  const count = code.modules.size
  const pad = tile ? size * 0.12 : 0
  const m = (size - 2 * pad) / count
  let d = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (code.modules.get(r, c)) d += `M${n(x + pad + c * m)} ${n(y + pad + r * m)}h${n(m)}v${n(m)}h${n(-m)}z`
    }
  }
  const bg = tile ? `<rect x="${n(x)}" y="${n(y)}" width="${size}" height="${size}" rx="0.5" fill="${tile}"/>` : ''
  return `${bg}<path d="${d}" fill="${dark}" shape-rendering="crispEdges"/>`
}

// ─── Wines (all particulars as on the current labels) ───────────────────────────
interface Wine { variety: string; name?: string; vintage: string; lot: string; energy: string }

const LIGHT_WINE: Wine = { variety: 'Grüner Veltliner', vintage: '2025', lot: 'L 03025', energy: '304 kJ / 71 kcal' }
const DARK_WINE: Wine = { variety: 'Grüner Veltliner', name: 'Elias', vintage: '2024', lot: 'L 03124', energy: '289 kJ / 69 kcal' }

interface LegalColors { text: string; muted: string; emph: string; rule: string; qrDark: string; qrTile?: string }

/**
 * Mandatory particulars, the same on every alternative. Sizes follow the
 * minimums as far as known (x-height ≥ 1.2 mm; figures of the alcohol ≥ 3 mm
 * and of the nominal volume ≥ 4 mm for 0.75 l); check before printing.
 * Measured in the embedded Schibsted Grotesk: x-height 0.527 em (2.45 mm → 1.29 mm),
 * figure height 0.715 em (4.6 mm → 3.29 mm, 6 mm → 4.29 mm).
 * Alcohol, volume and designation share one field of vision at the bottom.
 */
function legal(w: Wine, x0: number, x1: number, c: LegalColors, top = 91) {
  const mid = x0 + (x1 - x0) * 0.54
  const qrSize = 13
  const t = top
  return [
    text(x0, t + 2.4, 2.1, 's5', c.muted, 'ERZEUGERABFÜLLUNG', { ls: 0.3 }),
    text(x0, t + 5.9, 2.6, 's5', c.emph, 'Weingut Buchart 58'),
    text(x0, t + 9.1, 2.45, 's4', c.text, 'Hauptstraße 58'),
    text(x0, t + 12.3, 2.45, 's4', c.text, '2504 Sooss'),
    text(mid, t + 5.9, 2.45, 's4', c.text, 'Tel. 0664 215 45 92'),
    text(mid, t + 9.1, 2.45, 's4', c.text, 'wein@buchart58.at'),
    text(mid, t + 12.3, 2.45, 's4', c.text, 'www.buchart58.at'),
    line(x0, t + 15.3, x1, t + 15.3, c.rule, 0.15),
    qr(x1 - qrSize, t + 17, qrSize, c.qrDark, c.qrTile),
    text(x0, t + 19.6, 2.45, 's5', c.muted, 'Zutaten und Nährwerte:'),
    text(x0, t + 23, 2.45, 's4', c.text, `Brennwert ${w.energy}`),
    text(x0, t + 26.3, 2.45, 's4', c.text, 'je 100 ml · enthält Sulfite'),
    text(x0, t + 29.6, 2.45, 's4', c.text, `Landwein · trocken · ${w.lot}`),
    text(x0, t + 36.4, 2.5, 's5', c.emph, 'WEINLAND ÖSTERREICH', { ls: 0.45 }),
    text(x0, t + 44.2, 4.6, 's5', c.emph, '12,5 % vol'),
    text(x1, t + 44.2, 6, 's5', c.emph, '0,75 l', { anchor: 'end' }),
  ].join('')
}

// ─── Palettes ───────────────────────────────────────────────────────────────────
const IVORY = '#f4efe1'
const BOTTLE = '#1e3b2c'
const INK_GREEN = '#1b2a21'
const GOLD_FOIL = '#b0914a'
const GOLD_INK = '#7d6226'
const GOLD = '#be9f55'
const GOLD_LIGHT = '#d7c69f'
const GOLD_MUTED = '#a3977a'
const RED = '#9e1919'

const LIGHT_LEGAL: LegalColors = { text: '#37443a', muted: '#6b7468', emph: BOTTLE, rule: '#c9c3ae', qrDark: INK_GREEN }
const DARK_LEGAL: LegalColors = { text: '#bdb294', muted: '#8f876f', emph: GOLD_LIGHT, rule: '#4a4640', qrDark: '#1a1918', qrTile: '#ece4cf' }

// ─── Alternatives ───────────────────────────────────────────────────────────────
interface Design { file: string; title: string; idea: string; body: string }

const LIGHT: Design[] = [
  {
    file: 'h1-haarlinie',
    title: 'H1 Haarlinie',
    idea: 'Reduziert: kein Farbband, Gold-Signet, große Goudy',
    body: [
      `<rect width="${W}" height="${H}" fill="${IVORY}"/>`,
      signet(CX, 9, 15, GOLD_FOIL, 0.35),
      text(CX, 26.5, 2.5, 's5', BOTTLE, 'WEINGUT BUCHART 58', { anchor: 'middle', ls: 0.9 }),
      line(33, 29.5, 47, 29.5, GOLD_FOIL, 0.2),
      text(CX, 52, 10.5, 'gi', INK_GREEN, 'Grüner', { anchor: 'middle' }),
      text(CX, 64, 12.5, 'g', INK_GREEN, 'Veltliner', { anchor: 'middle' }),
      text(CX, 76, 4.6, 'g', BOTTLE, LIGHT_WINE.vintage, { anchor: 'middle', ls: 1.6 }),
      legal(LIGHT_WINE, 8, 72, LIGHT_LEGAL),
    ].join(''),
  },
  {
    file: 'h2-buchruecken',
    title: 'H2 Buchrücken',
    idea: 'Das grüne Band wird zum Buchrücken',
    body: [
      `<rect width="${W}" height="${H}" fill="#efe7cd"/>`,
      `<rect width="14" height="${H}" fill="${BOTTLE}"/>`,
      line(1.6, 0, 1.6, H, GOLD, 0.15),
      line(12.4, 0, 12.4, H, GOLD, 0.15),
      ...[13, 14.6, 125.4, 127].map(y => line(0, y, 14, y, GOLD, 0.25)),
      text(8.8, 70, 5.4, 'g', GOLD_LIGHT, 'Buchart 58', { anchor: 'middle', ls: 0.6, rotate: -90 }),
      signet(27.5, 12, 13, GOLD_FOIL, 0.35),
      text(21, 50, 9.5, 'g', INK_GREEN, 'Grüner'),
      text(21, 61, 9.5, 'g', INK_GREEN, 'Veltliner'),
      text(21, 72, 5, 'g', GOLD_INK, LIGHT_WINE.vintage, { ls: 1.2 }),
      legal(LIGHT_WINE, 21, 74, LIGHT_LEGAL),
    ].join(''),
  },
  {
    file: 'h3-signet',
    title: 'H3 Signet',
    idea: 'Großes Signet in Goldfolie, Buchseiten-Rahmen',
    body: [
      `<rect width="${W}" height="${H}" fill="${IVORY}"/>`,
      `<rect x="3.5" y="3.5" width="73" height="133" fill="none" stroke="${BOTTLE}" stroke-width="0.45"/>`,
      `<rect x="4.8" y="4.8" width="70.4" height="130.4" fill="none" stroke="${BOTTLE}" stroke-width="0.15"/>`,
      signet(CX, 11, 30, GOLD_FOIL, 0.45),
      text(CX, 42, 5.6, 'g', BOTTLE, 'BUCHART 58', { anchor: 'middle', ls: 1.4 }),
      line(28, 46.5, 37.8, 46.5, GOLD_FOIL, 0.2),
      `<path d="M40 45.4 41.1 46.5 40 47.6 38.9 46.5Z" fill="${GOLD_FOIL}"/>`,
      line(42.2, 46.5, 52, 46.5, GOLD_FOIL, 0.2),
      text(CX, 61, 8.6, 'gi', INK_GREEN, 'Grüner Veltliner', { anchor: 'middle' }),
      text(CX, 72, 5, 'g', BOTTLE, LIGHT_WINE.vintage, { anchor: 'middle', ls: 1.4 }),
      legal(LIGHT_WINE, 10, 70, LIGHT_LEGAL, 86),
    ].join(''),
  },
  {
    file: 'h4-achtundfuenfzig',
    title: 'H4 Achtundfünfzig',
    idea: 'Modern: die 58 der Hausnummer als Bildmarke',
    body: [
      `<rect width="${W}" height="${H}" fill="#f3efe4"/>`,
      text(86, 62, 56, 'g', BOTTLE, '58', { anchor: 'end' }),
      text(8, 13, 2.4, 's6', GOLD_INK, 'WEINGUT', { ls: 1 }),
      text(8, 17.6, 3.6, 's6', BOTTLE, 'BUCHART', { ls: 1 }),
      text(8, 76, 6.2, 's6', INK_GREEN, 'Grüner Veltliner'),
      text(8, 83.5, 4.2, 's4', GOLD_INK, LIGHT_WINE.vintage, { ls: 0.6 }),
      legal(LIGHT_WINE, 8, 72, LIGHT_LEGAL),
    ].join(''),
  },
]

const DARK: Design[] = [
  {
    file: 'd1-veredelt',
    title: 'D1 Veredelt',
    idea: 'Gleicher Aufbau, aufgeräumt, Signet in Goldfolie',
    body: [
      `<rect width="${W}" height="${H}" fill="#232221"/>`,
      signet(CX, 9, 14, GOLD, 0.35),
      line(14, 24.6, 66, 24.6, GOLD, 0.2),
      `<rect x="14" y="25.6" width="52" height="10.4" fill="${RED}"/>`,
      line(14, 37, 66, 37, GOLD, 0.2),
      text(CX, 33.2, 6.4, 'g', GOLD_LIGHT, 'Buchart 58', { anchor: 'middle', ls: 0.3 }),
      text(CX, 55, 7.2, 'g', GOLD_LIGHT, DARK_WINE.variety, { anchor: 'middle' }),
      text(CX, 66, 6.4, 'gi', GOLD, DARK_WINE.name ?? '', { anchor: 'middle' }),
      text(CX, 76, 4.4, 'g', GOLD_LIGHT, DARK_WINE.vintage, { anchor: 'middle', ls: 1.4 }),
      legal(DARK_WINE, 8, 72, DARK_LEGAL),
    ].join(''),
  },
  {
    file: 'd2-lesebaendchen',
    title: 'D2 Lesebändchen',
    idea: 'Das rote Band hängt als Lesebändchen von oben',
    body: [
      `<rect width="${W}" height="${H}" fill="#1f1e1c"/>`,
      `<polygon points="60,0 68,0 68,58 64,54.5 60,58" fill="${RED}"/>`,
      text(63.2, 27, 2.3, 's6', GOLD_LIGHT, 'BUCHART 58', { anchor: 'middle', ls: 0.8, rotate: 90 }),
      signet(14.5, 12, 13, GOLD, 0.35),
      text(8, 34, 4.2, 'g', GOLD_LIGHT, 'Weingut Buchart 58'),
      text(8, 54, 9.6, 'g', GOLD_LIGHT, 'Grüner'),
      text(8, 65, 9.6, 'g', GOLD_LIGHT, 'Veltliner'),
      text(8, 77, 7, 'gi', GOLD, DARK_WINE.name ?? ''),
      text(8, 84.5, 4.4, 'g', GOLD_MUTED, DARK_WINE.vintage, { ls: 1.2 }),
      legal(DARK_WINE, 8, 72, DARK_LEGAL),
    ].join(''),
  },
  {
    file: 'd3-elias',
    title: 'D3 Elias',
    idea: 'Der Beiname als Held, Rot nur als Akzent',
    body: [
      `<rect width="${W}" height="${H}" fill="#1b1a19"/>`,
      signet(CX, 9, 11, GOLD, 0.3),
      text(CX, 24, 2.3, 's5', GOLD_MUTED, 'WEINGUT BUCHART 58', { anchor: 'middle', ls: 0.9 }),
      text(CX, 37, 3.2, 's5', GOLD_LIGHT, 'GRÜNER VELTLINER', { anchor: 'middle', ls: 1.1 }),
      text(CX, 62, 24, 'gi', GOLD_LIGHT, DARK_WINE.name ?? '', { anchor: 'middle' }),
      `<rect x="35" y="68" width="10" height="0.7" fill="${RED}"/>`,
      text(CX, 78, 5, 'g', GOLD_LIGHT, DARK_WINE.vintage, { anchor: 'middle', ls: 1.6 }),
      legal(DARK_WINE, 8, 72, DARK_LEGAL),
    ].join(''),
  },
  {
    file: 'd4-ton-in-ton',
    title: 'D4 Ton in Ton',
    idea: 'Schwarz auf Schwarz: Signet als Spot-Lack oder Blindprägung',
    body: [
      `<rect width="${W}" height="${H}" fill="#151514"/>`,
      signet(CX, 10, 48, '#34322f', 1.1),
      text(CX, 58, 5.2, 'g', GOLD_LIGHT, 'BUCHART 58', { anchor: 'middle', ls: 1.6 }),
      line(33, 62.5, 47, 62.5, RED, 0.5),
      text(CX, 74, 6.8, 'g', GOLD_LIGHT, DARK_WINE.variety, { anchor: 'middle' }),
      text(CX, 83, 4.4, 'gi', GOLD_MUTED, `${DARK_WINE.name} · ${DARK_WINE.vintage}`, { anchor: 'middle' }),
      legal(DARK_WINE, 8, 72, DARK_LEGAL),
    ].join(''),
  },
]

// ─── Output ─────────────────────────────────────────────────────────────────────
function svgDocument(body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}"><style>${fontCss(body)}</style>${body}</svg>\n`
}

const ORIGINALS = {
  hell: { file: 'original/gruener-veltliner-2025-etikett.png', title: 'Original: Creme · Grün', idea: 'Grüner Veltliner 2025, buchart58.at' },
  dunkel: { file: 'original/gruener-veltliner-elias-2024-etikett.png', title: 'Original: Kohle · Rot', idea: 'Grüner Veltliner Elias 2024, buchart58.at' },
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 3 })

const rows: string[] = []
for (const [folder, designs] of [['hell', LIGHT], ['dunkel', DARK]] as const) {
  mkdirSync(join(HERE, folder), { recursive: true })
  const original = ORIGINALS[folder]
  const originalData = readFileSync(join(HERE, original.file)).toString('base64')
  const cards = [
    `<figure><img src="data:image/png;base64,${originalData}"/><figcaption><b>${esc(original.title)}</b>${esc(original.idea)}</figcaption></figure>`,
  ]
  for (const design of designs) {
    const svg = svgDocument(design.body)
    writeFileSync(join(HERE, folder, `${design.file}.svg`), svg)
    await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${svg}</body></html>`)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('svg').screenshot({ path: join(HERE, folder, `${design.file}.png`) })
    cards.push(`<figure>${svg}<figcaption><b>${esc(design.title)}</b>${esc(design.idea)}</figcaption></figure>`)
  }
  rows.push(`<section>${cards.join('')}</section>`)
}

const overview = `<!doctype html><html><head><style>
  body{margin:0;padding:32px;background:#e8e5de;font-family:system-ui,sans-serif;color:#2a2722}
  section{display:grid;grid-template-columns:repeat(5,1fr);gap:28px;margin-bottom:40px;align-items:end}
  figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:12px}
  figure svg{height:520px;width:${Math.round((520 * W) / H)}px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
  figure img{height:520px;width:auto;box-shadow:0 10px 30px rgba(0,0,0,.18)}
  figcaption{font-size:14px;line-height:1.35;text-align:center;max-width:240px}
  figcaption b{display:block;font-size:15px;margin-bottom:2px}
</style></head><body>${rows.join('')}</body></html>`
// The overview is for looking at, not for print: lower resolution keeps it small.
const overviewPage = await browser.newPage({ deviceScaleFactor: 1.25, viewport: { width: 1600, height: 1000 } })
await overviewPage.setContent(overview)
await overviewPage.evaluate(() => document.fonts.ready)
await overviewPage.screenshot({ path: join(HERE, 'uebersicht.png'), fullPage: true })

await browser.close()
console.log('Etiketten erzeugt:', LIGHT.length + DARK.length, 'Entwürfe + uebersicht.png')
