import { describe, it, expect } from 'vitest'
import { fitImageToLabel } from './object-factory'

// The default label: 90 × 120 mm = mmToPx(90) × mmToPx(120).
const LABEL_W = 340
const LABEL_H = 454

const fit = (width: number, height: number) => fitImageToLabel(width, height, LABEL_W, LABEL_H)

describe('fitImageToLabel', () => {
  it('covers the label with artwork in its exact format', () => {
    const p = fit(1063, 1417)
    expect(p.fills).toBe(true)
    expect(p.scale).toBeCloseTo(0.3204, 4)
    expect(p.left).toBeCloseTo(-0.3, 1)
    expect(p.top).toBeCloseTo(0, 1)
  })

  it('covers the label with artwork that brings 3 mm of print bleed', () => {
    const p = fit(1134, 1488)
    expect(p.fills).toBe(true)
    expect(p.scale).toBeCloseTo(0.3051, 4)
    expect(p.left).toBeCloseTo(-3, 1)
    expect(p.top).toBeCloseTo(0, 1)
  })

  it('fits a landscape photo inside the label, centred vertically', () => {
    const p = fit(2400, 1800)
    expect(p.fills).toBe(false)
    expect(p.scale).toBeCloseTo(0.1417, 4)
    expect(p.left).toBeCloseTo(0, 1)
    expect(p.top).toBeCloseTo(99.5, 1)
  })

  it('fits a square image inside the label, centred vertically', () => {
    const p = fit(1000, 1000)
    expect(p.fills).toBe(false)
    expect(p.scale).toBeCloseTo(0.34, 4)
    expect(p.left).toBeCloseTo(0, 1)
    expect(p.top).toBeCloseTo(57, 1)
  })

  it('never enlarges a small image of another format past its own pixels', () => {
    const p = fit(50, 50)
    expect(p.fills).toBe(false)
    expect(p.scale).toBe(1)
    expect(p.left).toBeCloseTo(145, 1)
    expect(p.top).toBeCloseTo(202, 1)
  })

  it('enlarges a small image in the label format until it covers the label', () => {
    const p = fit(90, 120)
    expect(p.fills).toBe(true)
    expect(p.scale).toBeCloseTo(3.7833, 4)
  })

  it('yields no NaN for an image without dimensions', () => {
    const p = fit(0, 0)
    expect(p.fills).toBe(false)
    expect(p.scale).toBe(1)
    expect(Number.isNaN(p.left)).toBe(false)
    expect(Number.isNaN(p.top)).toBe(false)
  })

  // The aspect ratio may differ from the label's by up to 4 %. At 4540 px
  // height (ten times the label), every 34 px of width is 1 % of ratio.
  it.each([
    { case: 'too wide, just inside', width: 3535, fills: true },   // +3.97 %
    { case: 'too wide, just outside', width: 3537, fills: false }, // +4.03 %
    { case: 'too narrow, just inside', width: 3265, fills: true },  // -3.97 %
    { case: 'too narrow, just outside', width: 3263, fills: false }, // -4.03 %
  ])('treats an image $case the 4 % tolerance as label format: $fills', ({ width, fills }) => {
    expect(fit(width, 4540).fills).toBe(fills)
  })

  const sizes: [number, number][] = [
    [1063, 1417], [1134, 1488], [90, 120], [3535, 4540], [3265, 4540],
    [2400, 1800], [1000, 1000], [50, 50], [3537, 4540], [3263, 4540], [400, 3000], [5000, 400],
  ]

  it.each(sizes)('places %i × %i centred, covering or inside the label', (width, height) => {
    const p = fit(width, height)
    const w = width * p.scale
    const h = height * p.scale
    const eps = 1e-9

    expect(p.left + w / 2).toBeCloseTo(LABEL_W / 2, 6)
    expect(p.top + h / 2).toBeCloseTo(LABEL_H / 2, 6)
    if (p.fills) {
      expect(w).toBeGreaterThanOrEqual(LABEL_W - eps)
      expect(h).toBeGreaterThanOrEqual(LABEL_H - eps)
    } else {
      expect(w).toBeLessThanOrEqual(LABEL_W + eps)
      expect(h).toBeLessThanOrEqual(LABEL_H + eps)
      expect(p.scale).toBeLessThanOrEqual(1)
    }
  })
})
