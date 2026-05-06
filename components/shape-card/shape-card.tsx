import { useState } from 'react'

export type CornerShape =
  | 'round'
  | 'squircle'
  | 'scoop'
  | 'notch'
  | 'bevel'
  | 'square'

type CornerTuple = readonly [CornerShape, CornerShape, CornerShape, CornerShape]
export type CornerSpec = CornerShape | CornerTuple

type Corner = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

/**
 * Slot that fits exactly into a single notched corner. Use this for tags
 * that read as "puzzle pieces" filling a rectangular cut-out (e.g. "Bio",
 * "Limited", a date stamp). The card's chosen corner is overridden to
 * `corner-shape: notch` with elliptical radius `width × height`, leaving
 * a clean rectangular void that the slot fills.
 */
export interface CornerSlotConfig {
  corner: Corner
  width: number
  height: number
  content: React.ReactNode
}

export interface ShapeCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Single shape for all corners, or a 4-tuple [TL, TR, BR, BL]. */
  shape?: CornerSpec
  /** Border-radius. Number → px. Strings (e.g. "2rem 2rem 1rem 1rem") supported. */
  radius?: number | string
  /**
   * Circular cutout — for floating wax-seal badges that "stamp" the card.
   * Uses a radial-gradient mask + drop-shadow on wrapper.
   */
  cutout?: Corner
  /** Cutout diameter in px. */
  cutoutSize?: number
  /** Distance from corner edge in px. */
  cutoutInset?: number
  /** Visual gap between cutout edge and badge edge in px. */
  cutoutGap?: number
  /** Slot rendered inside the circular cutout. */
  cutoutSlot?: React.ReactNode
  /**
   * Rectangular corner-fit slot — the card's chosen corner is notched to
   * match the slot's width × height; the slot fills that void exactly.
   * Cleaner than `cutout` because native `box-shadow` traces the notched
   * silhouette without needing filter/drop-shadow workarounds.
   */
  cornerSlot?: CornerSlotConfig
  /**
   * Semicircular notch at the *middle of a side* (not a corner). Like a
   * camera-notch or Dynamic-Island silhouette. Pure mask + drop-shadow.
   */
  sideNotch?: {
    side: 'top' | 'right' | 'bottom' | 'left'
    size: number
    /** 0-100, position along the side. Default 50 (centered). */
    position?: number
  }
  /** Subtle lift on hover. Default: true. */
  hoverLift?: boolean
  /** Highlight border-color with accent on hover. Default: true. */
  hoverAccent?: boolean
  children: React.ReactNode
}

const cornerShapeCss = (s: CornerSpec): string =>
  Array.isArray(s) ? s.join(' ') : (s as CornerShape)

const radiusCss = (r: number | string): string =>
  typeof r === 'number' ? `${r}px` : r

function cutoutMask(corner: Corner, r: number, inset: number, gap: number): string {
  const cx = corner.includes('right')
    ? `calc(100% - ${inset + r}px)`
    : `${inset + r}px`
  const cy = corner.includes('bottom')
    ? `calc(100% - ${inset + r}px)`
    : `${inset + r}px`
  return `radial-gradient(circle ${r + gap}px at ${cx} ${cy}, transparent 99%, #000 100%)`
}

function sideNotchMask(side: 'top' | 'right' | 'bottom' | 'left', size: number, position = 50): string {
  const r = size / 2
  const cx =
    side === 'left' ? '0' :
    side === 'right' ? '100%' : `${position}%`
  const cy =
    side === 'top' ? '0' :
    side === 'bottom' ? '100%' : `${position}%`
  return `radial-gradient(circle ${r}px at ${cx} ${cy}, transparent 99%, #000 100%)`
}

function cornerSlotPosition(corner: Corner, w: number, h: number, inset = 0): React.CSSProperties {
  return {
    position: 'absolute',
    width: w,
    height: h,
    top: corner.startsWith('top') ? inset : 'auto',
    bottom: corner.startsWith('bottom') ? inset : 'auto',
    left: corner.endsWith('left') ? inset : 'auto',
    right: corner.endsWith('right') ? inset : 'auto',
    display: 'grid',
    placeItems: 'center',
    zIndex: 2,
  }
}

/** corner → CSS longhand keys for radius + corner-shape (used for cornerSlot). */
const CORNER_KEYS = {
  'top-left':     { radius: 'borderTopLeftRadius',     shape: 'cornerTopLeftShape' },
  'top-right':    { radius: 'borderTopRightRadius',    shape: 'cornerTopRightShape' },
  'bottom-right': { radius: 'borderBottomRightRadius', shape: 'cornerBottomRightShape' },
  'bottom-left':  { radius: 'borderBottomLeftRadius',  shape: 'cornerBottomLeftShape' },
} as const

/**
 * ShapeCard — non-rectangular card primitive built on CSS `corner-shape`.
 *
 * Variants: `round`, `squircle`, `scoop` (concave), `notch` (90° concave),
 * `bevel`, `square`. Per-corner control via tuple. Optional circular cutout
 * for overlaid badges/seals. Browsers without `corner-shape` (Firefox/Safari
 * as of Mai 2026) gracefully fall back to plain `border-radius`.
 */
export function ShapeCard({
  shape = 'round',
  radius = 16,
  cutout,
  cutoutSize = 64,
  cutoutInset = 16,
  cutoutGap = 6,
  cutoutSlot,
  cornerSlot,
  sideNotch,
  hoverLift = true,
  hoverAccent = true,
  children,
  className,
  style,
  ...props
}: ShapeCardProps) {
  const [hover, setHover] = useState(false)

  const hasCircleCutout = Boolean(cutout) && !cornerSlot && !sideNotch
  const hasCornerSlot = Boolean(cornerSlot)
  const hasSideNotch = Boolean(sideNotch) && !cornerSlot
  const r = cutoutSize / 2

  const mask =
    hasCircleCutout && cutout
      ? cutoutMask(cutout, r, cutoutInset, cutoutGap)
      : hasSideNotch && sideNotch
        ? sideNotchMask(sideNotch.side, sideNotch.size, sideNotch.position)
        : undefined

  // For the inner (card-color) layer: same mask, but cut 1px deeper so a
  // 1px ring of border-color shows along the masked edge.
  const innerMask =
    hasCircleCutout && cutout
      ? cutoutMask(cutout, r, cutoutInset, cutoutGap + 1)
      : hasSideNotch && sideNotch
        ? sideNotchMask(sideNotch.side, sideNotch.size + 2, sideNotch.position)
        : undefined

  const isMasked = Boolean(mask)
  const borderColor =
    hoverAccent && hover
      ? 'color-mix(in oklch, var(--accent) 60%, var(--border))'
      : 'color-mix(in oklch, var(--border) 70%, var(--accent) 30%)'

  const circleSlotStyle = hasCircleCutout && cutout
    ? cornerSlotPosition(cutout, cutoutSize, cutoutSize, cutoutInset)
    : null

  const cornerSlotStyle = hasCornerSlot && cornerSlot
    ? cornerSlotPosition(cornerSlot.corner, cornerSlot.width, cornerSlot.height, 0)
    : null

  const shellStyle: React.CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    transform: hoverLift && hover ? 'translateY(-3px)' : 'translateY(0)',
    transition: 'transform 320ms cubic-bezier(0.2, 0.7, 0.1, 1)',
    filter: (hasCircleCutout || hasSideNotch)
      ? 'drop-shadow(0 1px 2px oklch(0 0 0 / 0.2)) drop-shadow(0 18px 28px -12px oklch(0 0 0 / 0.45))'
      : undefined,
    ...style,
  }

  // Non-masked path: single div with native CSS border. Most efficient.
  const singleStyle: Record<string, unknown> = {
    background: 'var(--card)',
    color: 'var(--card-foreground)',
    border: '1px solid',
    borderColor,
    borderRadius: radiusCss(radius),
    cornerShape: cornerShapeCss(shape),
    boxShadow: hover
      ? '0 24px 48px -20px oklch(0 0 0 / 0.4)'
      : '0 12px 24px -16px oklch(0 0 0 / 0.3)',
    transition: 'box-shadow 320ms ease, border-color 320ms ease',
    overflow: 'hidden',
  }

  if (hasCornerSlot && cornerSlot) {
    const keys = CORNER_KEYS[cornerSlot.corner]
    singleStyle[keys.radius] = `${cornerSlot.width}px ${cornerSlot.height}px`
    singleStyle[keys.shape] = 'notch'
  }

  // Masked path: two stacked layers. Outer = border color + mask; inner =
  // card surface, inset 1px via padding + mask cut 1px bigger. The 1px ring
  // of outer (border) color shows through the gap, both along the rect edges
  // *and* along the mask curve.
  const outerLayerStyle: Record<string, unknown> = {
    background: borderColor,
    borderRadius: radiusCss(radius),
    cornerShape: cornerShapeCss(shape),
    padding: 1,
    overflow: 'hidden',
    transition: 'background 320ms ease',
    WebkitMask: mask,
    mask,
  }

  const innerCardStyle: Record<string, unknown> = {
    background: 'var(--card)',
    color: 'var(--card-foreground)',
    width: '100%',
    height: '100%',
    borderRadius: radiusCss(radius),
    cornerShape: cornerShapeCss(shape),
    overflow: 'hidden',
    WebkitMask: innerMask,
    mask: innerMask,
  }

  return (
    <div
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={shellStyle}
      {...props}
    >
      {isMasked ? (
        <div style={outerLayerStyle as React.CSSProperties}>
          <div style={innerCardStyle as React.CSSProperties}>{children}</div>
        </div>
      ) : (
        <div style={singleStyle as React.CSSProperties}>{children}</div>
      )}

      {hasCircleCutout && cutoutSlot && circleSlotStyle && (
        <div style={circleSlotStyle}>{cutoutSlot}</div>
      )}

      {hasCornerSlot && cornerSlot && cornerSlotStyle && (
        <div style={cornerSlotStyle}>{cornerSlot.content}</div>
      )}
    </div>
  )
}
