import { useRef, type ChangeEvent, type RefObject } from 'react'
import { SegmentGroup } from '@ark-ui/react/segment-group'
import { ImageUp } from 'lucide-react'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
import { useCellarCanvasMessages } from '../../messages-context'
import { prepareImageSource } from '../../engine/image-source'
import { reportImageError } from '../../store/designer-store'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { LabelBackground } from '../../store/types'

export interface BackgroundPanelProps {
  bridge:     RefObject<FabricBridge | null>
  background: LabelBackground
}

type Mode = 'color' | 'image'

/**
 * Label-paper controls: solid colour or an image (cover). Choosing "Image"
 * opens the file picker; the mode switches only once a file is picked, so
 * cancelling keeps the current paper.
 *
 * A gradient paper can still arrive from an older draft or `initialState`
 * (the engine keeps rendering and exporting it). It shows as "Colour" with its
 * start colour; picking a colour replaces it.
 */
export function BackgroundPanel({ bridge, background }: BackgroundPanelProps) {
  const m = useCellarCanvasMessages()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mode: Mode = typeof background !== 'string' && background.type === 'image' ? 'image' : 'color'
  // The colour a mode switch starts from.
  const baseColor =
    typeof background === 'string' ? background : background.type === 'gradient' ? background.from : '#ffffff'

  const set = (bg: LabelBackground) => bridge.current?.setBackground(bg)

  function switchMode(next: string | null) {
    if (next === mode) return
    if (next === 'color') set(baseColor)
    if (next === 'image') fileInputRef.current?.click()
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      void prepareImageSource(file).then(src => set({ type: 'image', src })).catch(reportImageError)
    }
    // Reset so picking the same file twice in a row still fires change.
    e.target.value = ''
  }

  const modes: { value: Mode; label: string }[] = [
    { value: 'color', label: m.bgModeColor },
    { value: 'image', label: m.bgModeImage },
  ]

  return (
    <div className="space-y-3">
      <SegmentGroup.Root
        value={mode}
        onValueChange={(d) => switchMode(d.value)}
        className="bg-card border-border flex rounded-lg border p-0.5"
      >
        <SegmentGroup.Label className="sr-only">{m.bgModeLabel}</SegmentGroup.Label>
        {modes.map(({ value, label }) => (
          <SegmentGroup.Item
            key={value}
            value={value}
            className="text-muted-foreground data-[state=checked]:bg-muted data-[state=checked]:text-foreground has-[input:focus-visible]:ring-accent/60 flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-xs transition-colors has-[input:focus-visible]:ring-2 pointer-coarse:py-3"
          >
            <SegmentGroup.ItemText>{label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemControl />
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFile}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />

      {mode === 'color' && (
        <div className="bg-card border-border flex h-9 items-center justify-between rounded-lg border px-1">
          <span className="text-muted-foreground pl-2 text-xs">{m.bgFill}</span>
          <ColorSwatch value={baseColor} onChange={set} label="■" title={m.bgFillTitle} />
        </div>
      )}

      {typeof background !== 'string' && background.type === 'image' && (
        <div className="space-y-2">
          <div
            aria-hidden
            className="border-border h-24 rounded-lg border bg-cover bg-center"
            style={{ backgroundImage: `url("${background.src}")` }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-accent/60 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-[color,background-color,transform] focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] pointer-coarse:min-h-11"
          >
            <ImageUp size={14} aria-hidden />
            {m.bgImageReplace}
          </button>
        </div>
      )}
    </div>
  )
}
