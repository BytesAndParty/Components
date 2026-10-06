// Gemeinsame Basis der Scrapbook-Komponenten (PaperNote, PolaroidFrame).
// Fix statt Theme-Tokens: Papier und Tape sollen wie physische Objekte wirken
// (SCRAPBOOK-TEXTBOXES.md, Entscheidung #2).

export const PAPER = {
  kraft: { bg: 'oklch(0.80 0.055 76)', ink: 'oklch(0.27 0.035 55)' },
  cream: { bg: 'oklch(0.965 0.016 88)', ink: 'oklch(0.27 0.02 60)' },
  dark:  { bg: 'oklch(0.27 0.014 55)', ink: 'oklch(0.92 0.025 85)' },
} as const

/** Papierkorn als `feTurbulence`-Data-URI für `background-image` (kein Bild-Asset). */
export function paperGrain(freq: number, octaves: number, alpha: number, size: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='${alpha}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function zigzagEnds(teeth: number, depth: number) {
  const left: string[] = []
  const right: string[] = []
  for (let i = 0; i <= teeth; i++) {
    const y = ((i / teeth) * 100).toFixed(1)
    left.push(`${i % 2 ? depth : 0}px ${y}%`)
    right.unshift(`calc(100% - ${i % 2 ? depth : 0}px) ${y}%`)
  }
  return `polygon(${[...left, ...right].join(', ')})`
}

/** Olivgrünes Washi-Tape mit Zackenenden. */
export const WASHI = {
  background: 'linear-gradient(180deg, oklch(1 0 0 / 0.14), transparent 45%), repeating-linear-gradient(90deg, oklch(0.6 0.07 118 / 0.8) 0 3px, oklch(0.64 0.07 118 / 0.72) 3px 7px)',
  clipPath: zigzagEnds(6, 4),
}
