import { ColorPicker, parseColor, type ColorPickerValueChangeDetails, type ColorPickerFormatChangeDetails } from '@ark-ui/react/color-picker'
import { Pipette } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

export type PaletteGroup = {
  label: string
  colors: string[]
}

const DEFAULT_PALETTE_GROUPS: PaletteGroup[] = [
  {
    label: 'Ivory & Parchment',
    colors: ['#ffffff', '#fef9f0', '#f5eedc', '#ede0c8', '#e0d0b0', '#c8b890', '#a89870', '#7a6850', '#3c2d1f'],
  },
  {
    label: 'Gold & Amber',
    colors: ['#fef9c3', '#fde68a', '#fbbf24', '#f59e0b', '#d4af37', '#c5a028', '#a07020', '#7a5010', '#4a3008'],
  },
  {
    label: 'Burgundy & Wine',
    colors: ['#fdf2f4', '#f5c6cf', '#e07890', '#c04060', '#9c1f38', '#7c2832', '#722f37', '#501828', '#2d0810'],
  },
  {
    label: 'Midnight & Navy',
    colors: ['#f0f2f8', '#ccd4ec', '#8090cc', '#4060a8', '#1c3878', '#10204a', '#0a1430', '#050918', '#020408'],
  },
  {
    label: 'Bark & Earth',
    colors: ['#fdf6ee', '#e8d4b8', '#c8a880', '#a07848', '#7a5828', '#5a3c1a', '#3c280e', '#20160a', '#000000'],
  },
]

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (hex: string) => void
  showAlpha?: boolean
  presets?: string[]
  paletteGroups?: PaletteGroup[]
  className?: string
}

export function ColorPickerPanel({
  value,
  defaultValue = '#000000',
  onChange,
  showAlpha = false,
  presets = [],
  paletteGroups = DEFAULT_PALETTE_GROUPS,
  className,
}: ColorPickerProps) {
  const [format, setFormat] = useState<ColorFormat>('hex')

  const parsedValue = (() => {
    if (!value) return undefined
    try { return parseColor(value) } catch { return undefined }
  })()

  return (
    <ColorPicker.Root
      inline
      {...(parsedValue
        ? { value: parsedValue }
        : { defaultValue: parseColor(defaultValue) }
      )}
      onValueChange={(details: ColorPickerValueChangeDetails) => {
        try {
          onChange?.(details.value.toString('hex'))
        } catch {
          onChange?.(details.valueAsString)
        }
      }}
      onFormatChange={(details: ColorPickerFormatChangeDetails) => {
        setFormat(details.format as ColorFormat)
      }}
    >
      <ColorPicker.Content className={cn('flex flex-col gap-3', className)}>

        {/* ── 2D Saturation / Brightness Area ──────────────────── */}
        <ColorPicker.Area 
          xChannel="saturation" 
          yChannel="brightness"
          className="relative w-full h-40 rounded-lg cursor-crosshair overflow-hidden border border-border/50"
        >
          <ColorPicker.AreaBackground className="absolute inset-0 w-full h-full" />
          <ColorPicker.AreaThumb className="absolute w-4 h-4 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
        </ColorPicker.Area>

        {/* ── Sliders + Eye Dropper ──────────────────────────── */}
        <div className="flex items-center gap-2">
          <ColorPicker.EyeDropperTrigger className="flex items-center justify-center w-8 h-8 shrink-0 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Pipette className="w-3.5 h-3.5" />
          </ColorPicker.EyeDropperTrigger>

          <div className="flex flex-1 flex-col gap-2">
            {/* Hue */}
            <ColorPicker.ChannelSlider channel="hue" className="relative h-3 w-full">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <ColorPicker.ChannelSliderTrack className="w-full h-full" />
              </div>
              <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-grab shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
            </ColorPicker.ChannelSlider>

            {/* Alpha */}
            {showAlpha && (
              <ColorPicker.ChannelSlider channel="alpha" className="relative h-3 w-full">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <ColorPicker.TransparencyGrid />
                  <ColorPicker.ChannelSliderTrack className="w-full h-full" />
                </div>
                <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-grab shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
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

        {/* ── Preset Swatches (flat) ────────────────────────── */}
        {presets.length > 0 && (
          <ColorPicker.SwatchGroup className="flex flex-wrap gap-1 pt-1 border-t border-border">
            {presets.map((color) => (
              <ColorPicker.SwatchTrigger
                key={color}
                value={color}
                className="w-6 h-6 rounded cursor-pointer ring-1 ring-border hover:ring-2 hover:ring-accent data-[state=checked]:ring-2 data-[state=checked]:ring-accent transition-shadow overflow-hidden"
              >
                <ColorPicker.Swatch value={color} className="w-full h-full" />
              </ColorPicker.SwatchTrigger>
            ))}
          </ColorPicker.SwatchGroup>
        )}

        {/* ── Palette Groups ─────────────────────────────────── */}
        {paletteGroups.length > 0 && (
          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            {paletteGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {group.label}
                </p>
                <ColorPicker.SwatchGroup className="flex flex-wrap gap-1">
                  {group.colors.map((color) => (
                    <ColorPicker.SwatchTrigger
                      key={color}
                      value={color}
                      className="w-6 h-6 rounded cursor-pointer ring-1 ring-border hover:ring-2 hover:ring-accent data-[state=checked]:ring-2 data-[state=checked]:ring-accent transition-shadow overflow-hidden"
                    >
                      <ColorPicker.Swatch value={color} className="w-full h-full" />
                    </ColorPicker.SwatchTrigger>
                  ))}
                </ColorPicker.SwatchGroup>
              </div>
            ))}
          </div>
        )}
      </ColorPicker.Content>

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
