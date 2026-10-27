import { useRef, type ChangeEvent, type RefObject } from 'react'
import { SegmentGroup } from '@ark-ui/react/segment-group'
import { ImageUp } from 'lucide-react'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
import { NumberInput } from '../shared'
import { useCellarCanvasMessages } from '../../messages-context'
import { prepareImageSource } from '../../engine/image-source'
import { reportImageError } from '../../store/designer-store'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { LabelBackground } from '../../store/types'

export interface BackgroundPanelProps {
  bridge:     RefObject<FabricBridge | null>
  background: LabelBackground
}

type Mode = 'color' | 'gradient' | 'image'

/** Second gradient stop when switching from a plain colour — a warm paper tone. */
const DEFAULT_GRADIENT_TO = '#e8e1d4'

/**
 * Label-paper controls: solid colour, two-stop linear gradient or an image
 * (cover). Choosing "Image" opens the file picker; the mode switches only once
 * a file is picked, so cancelling keeps the current paper.
 */
export function BackgroundPanel({ bridge, background }: BackgroundPanelProps) {
  const m = useCellarCanvasMessages()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mode: Mode = typeof background === 'string' ? 'color' : background.type
  // The colour a mode switch starts from.
  const baseColor =
    typeof background === 'string' ? background : background.type === 'gradient' ? background.from : '#ffffff'

  const set = (bg: LabelBackground) => bridge.current?.setBackground(bg)

  function switchMode(next: string | null) {
    if (next === mode) return
    if (next === 'color') set(baseColor)
    if (next === 'gradient') set({ type: 'gradient', from: baseColor, to: DEFAULT_GRADIENT_TO, angle: 180 })
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
    { value: 'color',    label: m.bgModeColor },
    { value: 'gradient', label: m.bgModeGradient },
    { value: 'image',    label: m.bgModeImage },
  ]

  return (
    <section className="space-y-3">
      <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.bgHeading}</h4>

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
            className="text-muted-foreground data-[state=checked]:bg-muted data-[state=checked]:text-foreground has-[input:focus-visible]:ring-accent/60 flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-xs transition-colors has-[input:focus-visible]:ring-2"
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

      {typeof background === 'string' && (
        <div className="bg-card border-border flex h-9 items-center justify-between rounded-lg border px-1">
          <span className="text-muted-foreground pl-2 text-xs">{m.bgFill}</span>
          <ColorSwatch value={background} onChange={set} label="■" title={m.bgFillTitle} />
        </div>
      )}

      {typeof background !== 'string' && background.type === 'gradient' && (
        <div className="space-y-2">
          <div className="bg-card border-border flex h-9 items-center justify-between rounded-lg border px-1">
            <span className="text-muted-foreground pl-2 text-xs">{m.bgGradientFrom}</span>
            <ColorSwatch
              value={background.from}
              onChange={(from) => set({ ...background, from })}
              label="■"
              title={m.bgGradientFrom}
            />
          </div>
          <div className="bg-card border-border flex h-9 items-center justify-between rounded-lg border px-1">
            <span className="text-muted-foreground pl-2 text-xs">{m.bgGradientTo}</span>
            <ColorSwatch
              value={background.to}
              onChange={(to) => set({ ...background, to })}
              label="■"
              title={m.bgGradientTo}
            />
          </div>
          <NumberInput
            label={m.bgGradientAngle}
            value={background.angle}
            onChange={(angle) => set({ ...background, angle })}
            min={0} max={360} step={15}
            unit="°"
            className="justify-between pl-2"
          />
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
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-accent/60 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ImageUp size={14} aria-hidden />
            {m.bgImageReplace}
          </button>
        </div>
      )}
    </section>
  )
}
