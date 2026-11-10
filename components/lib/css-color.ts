let ctx: CanvasRenderingContext2D | null = null

/**
 * Converts a computed CSS color (`oklch(…)`, `color(display-p3 …)`, `rgb(…)`)
 * to sRGB components in 0..1, for consumers that cannot parse CSS colors
 * themselves (WebGL uniforms, three.js `Color`).
 *
 * The browser does the conversion: the color is painted onto a 1×1 canvas and
 * read back. Pass a *computed* value (`getComputedStyle(el).color`), a raw
 * `var(--accent)` is not a valid canvas fill style. Unparseable input yields black.
 */
export function cssColorToRgb(color: string): [number, number, number] {
  if (!ctx) {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    ctx = canvas.getContext('2d', { willReadFrequently: true })
  }
  if (!ctx) return [0, 0, 0]

  // Start from an empty pixel, or a translucent color would blend with the last one.
  ctx.clearRect(0, 0, 1, 1)
  // An invalid assignment keeps the previous fill style, so reset it first.
  ctx.fillStyle = '#000'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}
