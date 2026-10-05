import * as fabric from 'fabric'
import { mmToPx } from '../engine/units'
import { attach, CORNER_STYLE } from '../engine/object-factory'
import type { WineFieldValues } from '../CellarCanvas'

/**
 * Rudimentary starting layouts for the label. Each template is a plain
 * function returning live (canvas-detached) Fabric objects built the same
 * way the toolbar's insert actions are — `attach()` gives them the same
 * `id`/`_type`/`_fieldKey` metadata, so wine-field text stays wired into the
 * existing `initialWineFields` sync in `CellarCanvas.tsx`: switching the
 * selected wine updates a placed template's text exactly like it would for
 * a manually-inserted field.
 *
 * `TemplateContext.wineFields` supplies the initial text so a freshly-applied
 * template already shows real data. A field without a value is left out —
 * the same rule as the Wine Data panel: placeholder text like "Weinname"
 * would end up on the printed label.
 */
export interface TemplateContext {
  widthMm:    number
  heightMm:   number
  bleedPx:    number
  wineFields: WineFieldValues
}

export interface WineLabelTemplate {
  id:   'classic' | 'modern' | 'minimal'
  build: (ctx: TemplateContext) => fabric.Object[]
}

interface TextOptions {
  fontSize:   number
  align?:     'left' | 'center' | 'right'
  fieldKey?:  string
  layerName?: string
  fill?:      string
  widthMm?:   number
  leftMm?:    number
}

/** Full-label-width Textbox with `textAlign` doing the centring — no manual text-width math needed. */
function labelText(ctx: TemplateContext, yMm: number, text: string, opts: TextOptions): fabric.Textbox {
  const { bleedPx, widthMm } = ctx
  const boxWidthMm = opts.widthMm ?? widthMm
  const leftMm = opts.leftMm ?? (widthMm - boxWidthMm) / 2
  const textbox = new fabric.Textbox(text, {
    originX: 'left',
    originY: 'top',
    left: bleedPx + mmToPx(leftMm),
    top: bleedPx + mmToPx(yMm),
    width: mmToPx(boxWidthMm),
    fontSize: opts.fontSize,
    fontFamily: 'sans-serif',
    fill: opts.fill ?? '#1a1a1a',
    textAlign: opts.align ?? 'left',
    // Wine-field text is bound to the wine data, not edited on the canvas.
    editable: !opts.fieldKey,
  })
  return attach(textbox, {
    _layerName: opts.layerName ?? text,
    _type: opts.fieldKey ? 'wine-field' : 'text',
    _fieldKey: opts.fieldKey,
  })
}

/** Wine-field text for `wineFields[key]`; null without a value (left out of the template). */
function fieldText(
  ctx: TemplateContext,
  yMm: number,
  key: keyof WineFieldValues,
  opts: Omit<TextOptions, 'fieldKey'>,
): fabric.Textbox | null {
  const value = ctx.wineFields[key]
  if (value === undefined || value === '') return null
  return labelText(ctx, yMm, String(value), { ...opts, fieldKey: key })
}

function rule(ctx: TemplateContext, yMm: number, widthMmLine: number, color = '#722f37'): fabric.Line {
  const { bleedPx, widthMm } = ctx
  const xStart = bleedPx + mmToPx((widthMm - widthMmLine) / 2)
  const y = bleedPx + mmToPx(yMm)
  const line = new fabric.Line([xStart, y, xStart + mmToPx(widthMmLine), y], {
    originX: 'left',
    originY: 'top',
    stroke: color,
    strokeWidth: 1,
    ...CORNER_STYLE,
  })
  return attach(line, { _layerName: 'Trennlinie', _type: 'line' })
}

function accentBar(ctx: TemplateContext, color = '#722f37'): fabric.Rect {
  const { bleedPx, heightMm } = ctx
  const rect = new fabric.Rect({
    originX: 'left',
    originY: 'top',
    left: bleedPx + mmToPx(8),
    top: bleedPx + mmToPx(8),
    width: mmToPx(3),
    height: mmToPx(heightMm - 16),
    fill: color,
    ...CORNER_STYLE,
  })
  return attach(rect, { _layerName: 'Akzentbalken', _type: 'rect' })
}

/** Centred title, small vintage/region line, thin rule near the bottom — the "Maison" reference look. */
function buildClassic(ctx: TemplateContext): fabric.Object[] {
  const { heightMm } = ctx

  return [
    fieldText(ctx, heightMm * 0.30, 'name', {
      fontSize: 26, align: 'center', layerName: 'Weinname',
    }),
    fieldText(ctx, heightMm * 0.30 + 13, 'vintage', {
      fontSize: 12, align: 'center', layerName: 'Jahrgang', fill: '#4a4a4a',
    }),
    fieldText(ctx, heightMm * 0.30 + 22, 'region', {
      fontSize: 12, align: 'center', layerName: 'Region', fill: '#4a4a4a',
    }),
    rule(ctx, heightMm * 0.85, 28),
  ].filter((obj) => obj !== null)
}

/** Left-aligned block with a vertical accent bar — the "spine" layout. */
function buildModern(ctx: TemplateContext): fabric.Object[] {
  return [
    accentBar(ctx),
    fieldText(ctx, 22, 'name', {
      fontSize: 20, align: 'left', layerName: 'Weinname',
      leftMm: 18, widthMm: ctx.widthMm - 26,
    }),
    fieldText(ctx, 40, 'vintage', {
      fontSize: 11, align: 'left', layerName: 'Jahrgang', fill: '#4a4a4a',
      leftMm: 18, widthMm: ctx.widthMm - 26,
    }),
    fieldText(ctx, 50, 'region', {
      fontSize: 11, align: 'left', layerName: 'Region', fill: '#4a4a4a',
      leftMm: 18, widthMm: ctx.widthMm - 26,
    }),
  ].filter((obj) => obj !== null)
}

/** Just the name and vintage, generously centred — most of the label stays empty on purpose. */
function buildMinimal(ctx: TemplateContext): fabric.Object[] {
  const { heightMm } = ctx

  return [
    fieldText(ctx, heightMm / 2 - 12, 'name', {
      fontSize: 22, align: 'center', layerName: 'Weinname',
    }),
    fieldText(ctx, heightMm / 2 + 6, 'vintage', {
      fontSize: 11, align: 'center', layerName: 'Jahrgang', fill: '#6a6a6a',
    }),
  ].filter((obj) => obj !== null)
}

export const WINE_LABEL_TEMPLATES: WineLabelTemplate[] = [
  { id: 'classic', build: buildClassic },
  { id: 'modern',  build: buildModern },
  { id: 'minimal', build: buildMinimal },
]
