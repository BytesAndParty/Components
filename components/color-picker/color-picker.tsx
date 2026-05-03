import { ColorPicker, parseColor, type ColorValueChangeDetails, type ColorFormatChangeDetails } from '@ark-ui/react/color-picker'
import { Pipette } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

const WINE_LABEL_PRESETS = [
  '#ffffff', '#f5f0e8', '#fef3c7', '#fde68a',
  '#d4af37', '#c5a028', '#8b4513', '#722f37',
  '#4a0e1a', '#2c1810', '#1a0a0a', '#000000',
  '#f8f0e3', '#e8d5b7', '#c19a6b', '#6b4f2a',
]

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (hex: string) => void
  showAlpha?: boolean
  presets?: string[]
  className?: string
}

export function ColorPickerPanel({
  value,
  defaultValue = '#000000',
  onChange,
  showAlpha = false,
  presets = WINE_LABEL_PRESETS,
  className,
}: ColorPickerProps) {
  const [format, setFormat] = useState<ColorFormat>('hex')

  const parsedValue = (() => {
    if (!value) return undefined
    try { return parseColor(value) } catch { return undefined }
  })()

  return (
    <ColorPicker.Root
      {...(parsedValue
        ? { value: parsedValue }
        : { defaultValue: parseColor(defaultValue) }
      )}
      onValueChange={(details: ColorValueChangeDetails) => {
        // Emit hex; if format is non-hex and direct conversion fails,
        // use valueAsString (Ark UI always provides a valid CSS string)
        try {
          onChange?.(details.value.toString('hex'))
        } catch {
          onChange?.(details.valueAsString)
        }
      }}
      onFormatChange={(details: ColorFormatChangeDetails) => {
        setFormat(details.format as ColorFormat)
      }}
    >
      <div className={cn('flex flex-col gap-3', className)}>

        {/* ── 2D Saturation / Lightness Area ──────────────────── */}
        <ColorPicker.Area className="relative w-full h-36 rounded-md overflow-hidden cursor-crosshair">
          <ColorPicker.AreaBackground className="absolute inset-0" />
          <ColorPicker.AreaThumb className="absolute w-4 h-4 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
        </ColorPicker.Area>

        {/* ── Sliders + Eye Dropper ──────────────────────────── */}
        <div className="flex items-center gap-2">
          <ColorPicker.EyeDropperTrigger className="flex items-center justify-center w-8 h-8 shrink-0 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Pipette className="w-3.5 h-3.5" />
          </ColorPicker.EyeDropperTrigger>

          <div className="flex flex-1 flex-col gap-2">
            {/* Hue */}
            <ColorPicker.ChannelSlider channel="hue" className="relative h-3 w-full rounded-full overflow-hidden">
              <ColorPicker.ChannelSliderTrack
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)' }}
              />
              <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white -translate-y-1/2 -translate-x-1/2 cursor-grab shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
            </ColorPicker.ChannelSlider>

            {/* Alpha */}
            {showAlpha && (
              <ColorPicker.ChannelSlider channel="alpha" className="relative h-3 w-full rounded-full overflow-hidden">
                <ColorPicker.TransparencyGrid className="absolute inset-0 [--size:6px]" />
                <ColorPicker.ChannelSliderTrack className="absolute inset-0" />
                <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white -translate-y-1/2 -translate-x-1/2 cursor-grab shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
              </ColorPicker.ChannelSlider>
            )}
          </div>
        </div>

        {/* ── Format Toggle ──────────────────────────────────── */}
        <div className="flex gap-0.5 p-0.5 bg-muted rounded-md">
          {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={cn(
                'flex-1 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded transition-colors',
                format === f
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Channel Inputs ─────────────────────────────────── */}
        <div className="flex gap-1.5">
          {format === 'hex' && (
            <>
              <ChannelField channel="hex" label="Hex" grow />
              {showAlpha && <ChannelField channel="alpha" label="A" />}
            </>
          )}
          {format === 'rgb' && (
            <>
              <ChannelField channel="red"   label="R" grow />
              <ChannelField channel="green" label="G" grow />
              <ChannelField channel="blue"  label="B" grow />
              {showAlpha && <ChannelField channel="alpha" label="A" />}
            </>
          )}
          {format === 'hsl' && (
            <>
              <ChannelField channel="hue"        label="H" grow />
              <ChannelField channel="saturation" label="S" grow />
              <ChannelField channel="lightness"  label="L" grow />
              {showAlpha && <ChannelField channel="alpha" label="A" />}
            </>
          )}
        </div>

        {/* ── Preset Swatches ────────────────────────────────── */}
        {presets.length > 0 && (
          <ColorPicker.SwatchGroup className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
            {presets.map((color) => (
              <ColorPicker.SwatchTrigger
                key={color}
                value={color}
                className="w-6 h-6 rounded cursor-pointer ring-1 ring-border hover:ring-2 hover:ring-accent transition-shadow overflow-hidden"
              >
                <ColorPicker.Swatch value={color} className="w-full h-full" />
              </ColorPicker.SwatchTrigger>
            ))}
          </ColorPicker.SwatchGroup>
        )}
      </div>

      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  )
}

// ── Internal helper ────────────────────────────────────────────
function ChannelField({
  channel,
  label,
  grow = false,
}: {
  channel: string
  label: string
  grow?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', grow ? 'flex-1' : 'w-12')}>
      <ColorPicker.ChannelInput
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        channel={channel as any}
        className="w-full px-1.5 py-1.5 text-xs font-mono text-center bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <span className="text-[10px] font-medium text-muted-foreground text-center">{label}</span>
    </div>
  )
}
