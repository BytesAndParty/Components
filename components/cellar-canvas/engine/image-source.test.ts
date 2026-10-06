import { describe, it, expect } from 'vitest'
import { imageSourceFromBlob, encodingPlan, keepSmaller } from './image-source'

describe('imageSourceFromBlob', () => {
  it('converts a blob into a data URL with the correct mime type', async () => {
    const blob = new Blob([Uint8Array.from([0x89, 0x50, 0x4e, 0x47])], { type: 'image/png' })

    const url = await imageSourceFromBlob(blob)

    expect(url).toMatch(/^data:image\/png;base64,/)
  })

  it('round-trips the original bytes', async () => {
    const bytes = Uint8Array.from([0, 1, 2, 253, 254, 255])
    const blob = new Blob([bytes], { type: 'image/webp' })

    const url = await imageSourceFromBlob(blob)

    const base64 = url.split(',')[1]
    const decoded = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    expect(Array.from(decoded)).toEqual(Array.from(bytes))
  })

  it('never produces a blob: URL', async () => {
    const blob = new Blob(['x'], { type: 'image/jpeg' })

    const url = await imageSourceFromBlob(blob)

    expect(url.startsWith('blob:')).toBe(false)
  })
})

describe('encodingPlan', () => {
  it('keeps transparency as PNG, whatever the source', () => {
    expect(encodingPlan('image/png', true)).toEqual(['image/png'])
    expect(encodingPlan('image/webp', true)).toEqual(['image/png'])
  })

  it('sends lossy sources straight to JPEG', () => {
    expect(encodingPlan('image/jpeg', false)).toEqual(['image/jpeg'])
    expect(encodingPlan('image/webp', false)).toEqual(['image/jpeg'])
    expect(encodingPlan('image/avif', false)).toEqual(['image/jpeg'])
  })

  it('tries PNG first for opaque lossless sources, JPEG only as fallback', () => {
    expect(encodingPlan('image/png', false)).toEqual(['image/png', 'image/jpeg'])
    expect(encodingPlan('image/gif', false)).toEqual(['image/png', 'image/jpeg'])
  })
})

describe('keepSmaller', () => {
  const blobOf = (bytes: number) => new Blob([new Uint8Array(bytes)])

  it('keeps the original when the re-encode is not smaller', () => {
    const original = blobOf(100)
    expect(keepSmaller(original, blobOf(100), false)).toBe(original)
    expect(keepSmaller(original, blobOf(150), false)).toBe(original)
  })

  it('takes a smaller re-encode', () => {
    const encoded = blobOf(60)
    expect(keepSmaller(blobOf(100), encoded, false)).toBe(encoded)
  })

  it('always takes the result of a downscale', () => {
    const encoded = blobOf(150)
    expect(keepSmaller(blobOf(100), encoded, true)).toBe(encoded)
  })

  it('falls back to the original when encoding failed', () => {
    const original = blobOf(100)
    expect(keepSmaller(original, null, true)).toBe(original)
  })
})
