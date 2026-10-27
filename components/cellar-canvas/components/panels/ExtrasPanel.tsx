import { useEffect, useState, type RefObject } from 'react'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import { SignaturePad, useSignaturePad } from '@ark-ui/react/signature-pad'
import { useArkTranslations } from '../../../i18n'
import { useCellarCanvasMessages } from '../../messages-context'
import { ORNAMENTS, type Ornament } from '../../extras/ornaments'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { CellarCanvasMessages } from '../../messages'

export interface ExtrasPanelProps {
  bridge: RefObject<FabricBridge | null>
}

/** Ink of inserted signatures and ornaments — recolourable via the context toolbar. */
const INK = '#1a1a1a'
const SIGNATURE_WIDTH_MM = 40

/**
 * Picks the picker theme to match the current app theme. We watch the
 * `data-theme` attribute on `<html>` because the picker re-themes its
 * categories / hover states / chrome — `Theme.AUTO` would only honour
 * `prefers-color-scheme`, which the controlled atelier theme can
 * deliberately diverge from.
 */
function useDocTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() => readTheme())
  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => setTheme(readTheme()))
    obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return theme
}

function readTheme(): Theme {
  if (typeof document === 'undefined') return Theme.DARK
  return document.documentElement.dataset.theme === 'light' ? Theme.LIGHT : Theme.DARK
}

function ornamentName(m: CellarCanvasMessages, id: Ornament['id']): string {
  if (id === 'divider') return m.ornamentDivider
  if (id === 'leaf')    return m.ornamentLeaf
  if (id === 'grapes')  return m.ornamentGrapes
  return m.ornamentFlourish
}

/**
 * Extras tab: a signature pad, decorative ornaments and the emoji picker.
 *
 * - The signature is drawn on Ark UI's SignaturePad (pointer input) and lands
 *   on the canvas as one compound path (`bridge.addPath`, layer type
 *   `'path'`), so it scales vector-clean and can be recoloured.
 * - Ornaments are SVG line-art from `extras/ornaments.ts`, same path type.
 * - Picked emojis drop onto the canvas as a Textbox via `bridge.addEmoji`,
 *   marked `_extras: true`. The native (system) emoji font keeps the canvas
 *   state tiny (a single codepoint) and scales vector-clean.
 */
export function ExtrasPanel({ bridge }: ExtrasPanelProps) {
  const m = useCellarCanvasMessages()
  const theme = useDocTheme()
  const signatureTranslations = useArkTranslations('signaturePad')
  // Uncontrolled: with a `paths` prop Zag stores no new stroke and reports the
  // old prop value from onDrawEnd, so the signature vanished on pointer-up.
  const signaturePad = useSignaturePad({
    drawing: { fill: 'currentColor', size: 3, simulatePressure: true },
    translations: signatureTranslations,
  })

  function insertSignature() {
    bridge.current?.addPath(signaturePad.paths.join(' '), {
      layerName: m.signatureLayerName,
      widthMm: SIGNATURE_WIDTH_MM,
      fill: INK,
    })
    signaturePad.clear()
  }

  const actionClass =
    'border-border text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-accent/60 flex-1 rounded-lg border px-3 py-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className="flex h-full flex-col gap-6">
      <section className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.signatureHeading}</h4>
          <p className="text-muted-foreground text-xs">{m.signatureHint}</p>
        </div>
        <SignaturePad.RootProvider value={signaturePad}>
          <SignaturePad.Label className="sr-only">{m.signatureHeading}</SignaturePad.Label>
          <SignaturePad.Control className="bg-muted/40 border-border text-foreground relative h-28 touch-none rounded-lg border">
            <SignaturePad.Segment />
            <SignaturePad.Guide className="border-border pointer-events-none absolute right-4 bottom-6 left-4 border-b border-dashed" />
          </SignaturePad.Control>
        </SignaturePad.RootProvider>
        <div className="flex gap-2">
          <button type="button" onClick={() => signaturePad.clear()} disabled={signaturePad.empty} className={actionClass}>
            {m.signatureClear}
          </button>
          <button type="button" onClick={insertSignature} disabled={signaturePad.empty} className={actionClass}>
            {m.signatureInsert}
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.ornamentsHeading}</h4>
        <div className="grid grid-cols-2 gap-2">
          {ORNAMENTS.map((o) => {
            const name = ornamentName(m, o.id)
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => bridge.current?.addPath(o.d, {
                  layerName: name,
                  widthMm: o.widthMm,
                  ...(o.mode === 'fill' ? { fill: INK } : { stroke: INK }),
                })}
                aria-label={name}
                title={name}
                className="bg-muted/50 hover:bg-muted text-foreground focus-visible:ring-accent/60 flex h-14 items-center justify-center rounded-lg px-3 transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
              >
                <svg viewBox={o.viewBox} className="h-7 w-full" aria-hidden>
                  <path
                    d={o.d}
                    fill={o.mode === 'fill' ? 'currentColor' : 'none'}
                    stroke={o.mode === 'stroke' ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex min-h-90 flex-1 flex-col space-y-3">
        <div className="space-y-1">
          <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.emojiHeading}</h4>
          <p className="text-muted-foreground text-xs">{m.emojiHint}</p>
        </div>
        <div className="-mx-4 -mb-4 min-h-0 flex-1">
          <EmojiPicker
            onEmojiClick={(data) => bridge.current?.addEmoji(data.emoji)}
            theme={theme}
            emojiStyle={EmojiStyle.NATIVE}
            lazyLoadEmojis
            width="100%"
            height="100%"
            previewConfig={{ showPreview: false }}
            searchPlaceholder="…"
            autoFocusSearch={false}
          />
        </div>
      </section>
    </div>
  )
}
