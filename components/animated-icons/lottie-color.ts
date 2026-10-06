/** RGBA in 0..1 — the unit Lottie uses for color values. */
export type LottieRgba = [number, number, number, number]

type ColorProp = { a?: number; k?: unknown }

function isStaticBlack(c: ColorProp): c is { a?: 0; k: number[] } {
  return !c.a && Array.isArray(c.k) && c.k.length >= 3 && c.k.slice(0, 3).every((v) => v === 0)
}

/**
 * Returns a copy of a Lottie animation in which every static black fill and
 * stroke is replaced by `rgba`. The icons in `_resources_/` are drawn in black;
 * other colors (e.g. the red badge of the notification icon) stay untouched.
 */
export function recolorLottie(data: unknown, rgba: LottieRgba): Record<string, unknown> {
  const copy = structuredClone(data) as Record<string, unknown>
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (!node || typeof node !== 'object') return
    const shape = node as { ty?: unknown; c?: ColorProp }
    if ((shape.ty === 'fl' || shape.ty === 'st') && shape.c && isStaticBlack(shape.c)) {
      shape.c.k = [...rgba]
    }
    Object.values(node).forEach(walk)
  }
  walk(copy)
  return copy
}

let probe: CanvasRenderingContext2D | null = null

/**
 * Resolves the computed CSS `color` of `el` — `currentColor`, `var(--accent)`,
 * oklch, anything the browser understands — to Lottie RGBA by painting one
 * pixel. Canvas `fillStyle` accepts every CSS color, `getImageData` hands back
 * sRGB bytes, so no color-space math is needed here.
 */
export function resolveCssColor(el: Element): LottieRgba {
  if (!probe) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    probe = canvas.getContext('2d', { willReadFrequently: true })
  }
  if (!probe) return [0, 0, 0, 1]
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = getComputedStyle(el).color
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255, a / 255]
}
