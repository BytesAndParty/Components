import { mmToPx } from '../../engine/units'
import type { CanvasViewport } from '../../engine/use-canvas-sync'

const THICKNESS = 20
/** Label steps in mm; the smallest one at least MIN_LABEL_GAP px apart wins. */
const STEPS_MM = [1, 2, 5, 10, 20, 50, 100, 200, 500]
const MIN_LABEL_GAP = 48

export interface CanvasRulersProps {
  viewport: CanvasViewport
  /** Scene px of the label's top-left corner (the workspace bleed) — the rulers' zero. */
  originPx: number
}

/**
 * Millimetre rulers along the top and left edge of the canvas area. Zero sits
 * at the label's top-left corner, so readings match the Properties Panel. The
 * tick spacing follows the zoom (1/2/5 mm series). Purely visual:
 * `pointer-events: none` and hidden from assistive tech.
 */
export function CanvasRulers({ viewport, originPx }: CanvasRulersProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <Axis
        orientation="horizontal"
        length={viewport.width}
        offset={viewport.tx}
        zoom={viewport.zoom}
        originPx={originPx}
      />
      <Axis
        orientation="vertical"
        length={viewport.height}
        offset={viewport.ty}
        zoom={viewport.zoom}
        originPx={originPx}
      />
      <div
        className="bg-card/90 border-border absolute top-0 left-0 border-r border-b backdrop-blur-sm"
        style={{ width: THICKNESS, height: THICKNESS }}
      />
    </div>
  )
}

function Axis({
  orientation,
  length,
  offset,
  zoom,
  originPx,
}: {
  orientation: 'horizontal' | 'vertical'
  length: number
  offset: number
  zoom: number
  originPx: number
}) {
  const pxPerMm = mmToPx(1) * zoom
  const step = STEPS_MM.find(s => s * pxPerMm >= MIN_LABEL_GAP) ?? STEPS_MM[STEPS_MM.length - 1]
  // 1-2-5 series: steps starting with 2 split in halves, the others in fifths.
  const minor = step / (String(step).startsWith('2') ? 2 : 5)
  // Screen px ↔ mm relative to the label corner.
  const toScreen = (mm: number) => offset + (originPx + mmToPx(mm)) * zoom
  const toMm = (screen: number) => ((screen - offset) / zoom - originPx) / mmToPx(1)

  const ticks: { pos: number; mm: number; major: boolean }[] = []
  const first = Math.ceil(toMm(THICKNESS) / minor)
  const last = Math.floor(toMm(length) / minor)
  for (let i = first; i <= last; i++) {
    const mm = i * minor
    // Rounded against float drift (0.1 + 0.2), so major ticks are detected.
    const major = Math.abs(Math.round(mm / step) * step - mm) < 1e-6
    ticks.push({ pos: toScreen(mm), mm: Math.round(mm * 100) / 100, major })
  }

  const horizontal = orientation === 'horizontal'
  return (
    <svg
      className="bg-card/90 border-border text-muted-foreground absolute top-0 left-0 backdrop-blur-sm"
      style={
        horizontal
          ? { width: length, height: THICKNESS, borderBottomWidth: 1 }
          : { width: THICKNESS, height: length, borderRightWidth: 1 }
      }
    >
      {ticks.map(({ pos, mm, major }) => {
        const size = major ? THICKNESS * 0.55 : THICKNESS * 0.25
        return (
          <g key={mm}>
            <line
              x1={horizontal ? pos : THICKNESS - size}
              y1={horizontal ? THICKNESS - size : pos}
              x2={horizontal ? pos : THICKNESS}
              y2={horizontal ? THICKNESS : pos}
              stroke="currentColor"
              strokeWidth={1}
              opacity={major ? 0.8 : 0.4}
            />
            {major && (
              <text
                // Rotated -90°, glyphs extend left of the baseline: x = 11
                // keeps them inside the 20 px strip.
                x={horizontal ? pos + 3 : 11}
                y={horizontal ? 9 : pos - 3}
                fill="currentColor"
                fontSize={9}
                className="font-mono"
                transform={horizontal ? undefined : `rotate(-90 11 ${pos - 3})`}
              >
                {mm}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
