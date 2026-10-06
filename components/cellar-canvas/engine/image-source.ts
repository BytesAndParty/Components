/**
 * Converts a Blob/File into a data URL for use as a Fabric image `src`.
 *
 * Always prefer this over `URL.createObjectURL`: Fabric serializes the `src`
 * verbatim into history snapshots and the localStorage autosave, and re-fetches
 * it on every `loadFromJSON` (undo/redo, restore). A `blob:` URL dies with the
 * session — or earlier, if revoked — leaving dead image references. A data URL
 * survives both.
 */
export function imageSourceFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Longest edge (px) of an image placed on a label. 300 dpi across 200 mm is
 * ~2362 px — enough for every label size we print, while a photo's data URL
 * stays around 1 MB instead of the 10–30 MB a phone photo or 4096 px PNG crop
 * produces. Every snapshot (autosave, each undo step) carries the full data
 * URL, so unbounded images blow the localStorage quota and the heap.
 */
export const MAX_IMAGE_EDGE_PX = 2400

/** Images within bounds and below this size keep their original bytes. */
const PASS_THROUGH_BYTES = 1024 * 1024

const JPEG_QUALITY = 0.9

/** Lossy formats: re-encoding them as JPEG loses nothing a print would show. */
const LOSSY_TYPES = new Set(['image/jpeg', 'image/webp', 'image/avif'])

/**
 * An opaque lossless encode above this size is a photo, not a logo or line
 * art — it falls back to JPEG to keep autosave and undo snapshots small.
 */
export const MAX_LOSSLESS_BYTES = 1.5 * 1024 * 1024

export type ImageEncoding = 'image/png' | 'image/jpeg'

/**
 * Formats to try, in order. The first result within `MAX_LOSSLESS_BYTES`
 * wins, otherwise the last one. Transparency forces PNG; lossy sources go
 * straight to JPEG; opaque lossless sources (PNG logos, line art) try PNG
 * first so edges stay crisp in print, and only heavy ones become JPEG.
 */
export function encodingPlan(sourceType: string, hasAlpha: boolean): ImageEncoding[] {
  if (hasAlpha) return ['image/png']
  if (LOSSY_TYPES.has(sourceType)) return ['image/jpeg']
  return ['image/png', 'image/jpeg']
}

/**
 * Within the edge cap a re-encode must pay off: the original is kept unless
 * the result is smaller. A downscaled image always takes the result.
 */
export function keepSmaller(original: Blob, encoded: Blob | null, downscaled: boolean): Blob {
  if (!encoded) return original
  return downscaled || encoded.size < original.size ? encoded : original
}

/**
 * Entry point for every user-supplied image (file picker, drag & drop, paste,
 * replace, cropper output): caps the longest edge at `maxEdgePx` and
 * re-encodes per `encodingPlan`, never ending up larger than the original
 * (`keepSmaller`), then returns a data URL (see `imageSourceFromBlob`). SVGs
 * pass through untouched (vector, small); so do images the browser can't
 * decode, which keeps the previous behaviour instead of dropping the upload.
 */
export async function prepareImageSource(
  blob: Blob,
  maxEdgePx: number = MAX_IMAGE_EDGE_PX,
): Promise<string> {
  if (blob.type === 'image/svg+xml') return imageSourceFromBlob(blob)

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(blob)
  } catch {
    return imageSourceFromBlob(blob)
  }

  try {
    const scale = Math.min(1, maxEdgePx / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && blob.size <= PASS_THROUGH_BYTES) return imageSourceFromBlob(blob)

    const width  = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return imageSourceFromBlob(blob)
    ctx.drawImage(bitmap, 0, 0, width, height)

    // JPEG has no alpha channel — only formats that can carry one get scanned.
    const hasAlpha = blob.type !== 'image/jpeg' && hasTransparency(ctx, width, height)
    const plan = encodingPlan(blob.type, hasAlpha)
    let encoded: Blob | null = null
    for (const [i, type] of plan.entries()) {
      encoded = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, JPEG_QUALITY))
      if (encoded && (encoded.size <= MAX_LOSSLESS_BYTES || i === plan.length - 1)) break
    }
    return imageSourceFromBlob(keepSmaller(blob, encoded, scale < 1))
  } finally {
    bitmap.close()
  }
}

function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = ctx.getImageData(0, 0, width, height)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true
  }
  return false
}
