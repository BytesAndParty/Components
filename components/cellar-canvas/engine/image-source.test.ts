import { describe, it, expect } from 'vitest'
import { imageSourceFromBlob } from './image-source'

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
