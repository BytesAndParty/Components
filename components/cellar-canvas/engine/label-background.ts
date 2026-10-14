import type { LabelBackground } from '../store/types'

/** Scene-px rectangle. */
export interface Box {
  left: number
  top: number
  width: number
  height: number
}

/** Shape check for persisted state: a colour string or a known gradient/image object. */
export function isLabelBackground(value: unknown): value is LabelBackground {
  if (typeof value === 'string') return true
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  if (o.type === 'gradient') {
    return typeof o.from === 'string' && typeof o.to === 'string' && typeof o.angle === 'number'
  }
  if (o.type === 'image') return typeof o.src === 'string'
  return false
}

export function sameBackground(a: LabelBackground, b: LabelBackground): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Start and end point of a CSS `linear-gradient(<angle>deg, …)` over `box`.
 * 0° runs bottom → top, 90° left → right, and the line is long enough for the
 * corners to get the first and last colour — what the browser does, so the
 * export matches the on-screen backdrop.
 */
export function gradientLine(angleDeg: number, box: Box) {
  const rad = (angleDeg * Math.PI) / 180
  const dx = Math.sin(rad)
  const dy = -Math.cos(rad)
  const half = (Math.abs(box.width * dx) + Math.abs(box.height * dy)) / 2
  const cx = box.left + box.width / 2
  const cy = box.top + box.height / 2
  return { x1: cx - dx * half, y1: cy - dy * half, x2: cx + dx * half, y2: cy + dy * half }
}

/** CSS for the on-screen paper (the React backdrop behind the canvas). */
export function backgroundStyle(bg: LabelBackground) {
  if (typeof bg === 'string') return { backgroundColor: bg }
  if (bg.type === 'gradient') {
    return { backgroundImage: `linear-gradient(${bg.angle}deg, ${bg.from}, ${bg.to})` }
  }
  // White paper under transparent image areas, like the export.
  return {
    backgroundColor: '#ffffff',
    backgroundImage: `url("${bg.src}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}
