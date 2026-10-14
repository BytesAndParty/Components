/**
 * Decorative SVG ornaments for the Extras tab. Line-art is drawn as stroke
 * (the hand-drawn look of a family estate's label), only the divider is a
 * filled shape. `viewBox` frames the preview button; on the canvas each
 * ornament is scaled to `widthMm` (see `createPath`).
 */
export interface Ornament {
  id:       'divider' | 'leaf' | 'grapes' | 'flourish'
  d:        string
  viewBox:  string
  widthMm:  number
  mode:     'fill' | 'stroke'
}

/** Full circle as two arcs, for the grapes and the divider dots. */
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`

export const ORNAMENTS: Ornament[] = [
  {
    id: 'divider',
    // Two hairline bars, a dot at each inner end, a diamond in the middle.
    d: [
      'M0 9.5 H36 V10.5 H0 Z',
      'M64 9.5 H100 V10.5 H64 Z',
      circle(39.5, 10, 1.5),
      circle(60.5, 10, 1.5),
      'M50 4 L56 10 L50 16 L44 10 Z',
    ].join(' '),
    viewBox: '-2 0 104 20',
    widthMm: 40,
    mode: 'fill',
  },
  {
    id: 'leaf',
    // Pointed leaf outline, midrib and two pairs of veins.
    d: [
      'M2 20 C14 4 38 4 50 20 C38 36 14 36 2 20 Z',
      'M2 20 L44 20',
      'M18 20 L26 12 M30 20 L37 13',
      'M18 20 L26 28 M30 20 L37 27',
    ].join(' '),
    viewBox: '0 6 52 28',
    widthMm: 16,
    mode: 'stroke',
  },
  {
    id: 'grapes',
    // Six grapes in a 3-2-1 cluster under a curled stem.
    d: [
      'M20 5 C20 1 23 -1 27 -2',
      circle(10, 10, 5), circle(20, 10, 5), circle(30, 10, 5),
      circle(15, 18.7, 5), circle(25, 18.7, 5),
      circle(20, 27.3, 5),
    ].join(' '),
    viewBox: '3 -4 34 38',
    widthMm: 14,
    mode: 'stroke',
  },
  {
    id: 'flourish',
    // Mirrored scrolls joined by a straight line.
    d: [
      'M0 10 C12 10 14 2 22 2 C30 2 30 12 24 12 C19 12 19 6 24 6',
      'M100 10 C88 10 86 2 78 2 C70 2 70 12 76 12 C81 12 81 6 76 6',
      'M30 10 H70',
    ].join(' '),
    viewBox: '-2 0 104 14',
    widthMm: 36,
    mode: 'stroke',
  },
]
