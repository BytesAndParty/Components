import { ColorPicker, parseColor, type ColorPickerValueChangeDetails, type ColorPickerFormatChangeDetails } from '@ark-ui/react/color-picker'
import { Pipette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '../lib/utils'

type ColorFormat = 'hex' | 'rgb' | 'hsl'
type AreaVariant = 'ark-background' | 'manual-background' | 'native-pointer' | 'two-sliders'

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

export function ColorPickerPanel(props: ColorPickerProps) {
  return <ColorPickerPanelNativeArea {...props} />
}

export function ColorPickerPanelArkBackground(props: ColorPickerProps) {
  return <ColorPickerPanelCore {...props} areaVariant="ark-background" />
}

export function ColorPickerPanelManualArea(props: ColorPickerProps) {
  return <ColorPickerPanelCore {...props} areaVariant="manual-background" />
}

export function ColorPickerPanelNativeArea(props: ColorPickerProps) {
  return <ColorPickerPanelCore {...props} areaVariant="native-pointer" />
}

export function ColorPickerPanelTwoSliders(props: ColorPickerProps) {
  return <ColorPickerPanelCore {...props} areaVariant="two-sliders" />
}

export function ColorPickerPanelCore({
  value,
  defaultValue = '#000000',
  onChange,
  showAlpha = false,
  presets = [],
  paletteGroups = DEFAULT_PALETTE_GROUPS,
  className,
  areaVariant,
}: ColorPickerProps & { areaVariant: AreaVariant }) {
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
      <ColorPicker.Label style={visuallyHiddenStyle}>Color</ColorPicker.Label>
      <ColorPicker.Content className={cn('flex flex-col gap-3', className)}>

        {/* ── Current Value ───────────────────────────────────── */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/25 p-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border shadow-sm">
            <ColorPicker.TransparencyGrid size="8px" />
            <ColorPicker.ValueSwatch className="absolute inset-0" respectAlpha={showAlpha} />
          </div>
          <div className="min-w-0">
            <ColorPicker.ValueText
              format="hex"
              className="block truncate font-mono text-sm font-semibold text-foreground"
            />
            <ColorPicker.ValueText
              className="block truncate font-mono text-[11px] text-muted-foreground"
            />
          </div>
        </div>

        <ColorArea variant={areaVariant} />
        <ColorSliders showAlpha={showAlpha} />
        <FormatToggle format={format} onFormatChange={setFormat} />
        <ChannelInputs format={format} showAlpha={showAlpha} />
        <Swatches presets={presets} paletteGroups={paletteGroups} />
      </ColorPicker.Content>

      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  )
}

export function ColorPickerPanelBeforeChanges({
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
        <ColorPicker.Area
          xChannel="saturation"
          yChannel="brightness"
          className="w-full h-40 rounded-lg cursor-crosshair overflow-hidden border border-border/50"
        >
          <ColorPicker.AreaBackground className="w-full h-full" />
          <ColorPicker.AreaThumb className="z-10 h-4 w-4 rounded-full border-2 border-white cursor-grab active:cursor-grabbing shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
        </ColorPicker.Area>

        <ColorSliders showAlpha={showAlpha} />
        <FormatToggle format={format} onFormatChange={setFormat} />
        <ChannelInputs format={format} showAlpha={showAlpha} />
        <Swatches presets={presets} paletteGroups={paletteGroups} />
      </ColorPicker.Content>

      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  )
}

const visuallyHiddenStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

function ColorArea({ variant }: { variant: AreaVariant }) {
  if (variant === 'two-sliders') {
    return <SaturationBrightnessSliders />
  }

  if (variant === 'ark-background') {
    return (
      <ColorPicker.Area
        xChannel="saturation"
        yChannel="brightness"
        className="h-52 w-full touch-none rounded-xl cursor-crosshair overflow-hidden border border-border/70 shadow-inner"
      >
        <ColorPicker.AreaBackground className="w-full h-full" />
        <ColorPicker.AreaThumb className="z-10 h-5 w-5 rounded-full border-2 border-white cursor-grab active:cursor-grabbing shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.35)]" />
      </ColorPicker.Area>
    )
  }

  if (variant === 'manual-background') {
    return (
      <ColorPicker.Context>
        {(api) => {
          const hsb = api.value.toFormat('hsba')
          const hue = getNumericChannel(hsb, 'hue')

          return (
            <ColorPicker.Area
              xChannel="saturation"
              yChannel="brightness"
              className="h-52 w-full touch-none rounded-xl cursor-crosshair overflow-hidden border border-border/70 shadow-inner"
              style={getSaturationBrightnessBackground(hue)}
            >
              <ColorPicker.AreaThumb className="z-10 h-5 w-5 rounded-full border-2 border-white cursor-grab active:cursor-grabbing shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.35)]" />
            </ColorPicker.Area>
          )
        }}
      </ColorPicker.Context>
    )
  }

  return <NativePointerArea />
}

function NativePointerArea() {
  return (
    <ColorPicker.Context>
      {(api) => {
        const hsb = api.value.toFormat('hsba')
        const hue = getNumericChannel(hsb, 'hue')
        const saturation = getNumericChannel(hsb, 'saturation')
        const brightness = getNumericChannel(hsb, 'brightness')

        function setFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
          const rect = event.currentTarget.getBoundingClientRect()
          const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
          const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
          api.setChannelValue('saturation', Math.round(x * 100))
          api.setChannelValue('brightness', Math.round((1 - y) * 100))
        }

        function adjust(saturationDelta: number, brightnessDelta: number) {
          api.setChannelValue('saturation', clamp(saturation + saturationDelta, 0, 100))
          api.setChannelValue('brightness', clamp(brightness + brightnessDelta, 0, 100))
        }

        return (
          <div
            role="group"
            tabIndex={0}
            aria-label="Saturation and brightness"
            className="relative h-52 w-full touch-none rounded-xl cursor-crosshair overflow-hidden border border-border/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
            style={getSaturationBrightnessBackground(hue)}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setFromPointer(event)
            }}
            onPointerMove={(event) => {
              if (event.buttons !== 1) return
              setFromPointer(event)
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 10 : 1
              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                adjust(-step, 0)
              }
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                adjust(step, 0)
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                adjust(0, step)
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                adjust(0, -step)
              }
            }}
          >
            <div
              className="absolute z-10 h-5 w-5 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.35)]"
              style={{ left: `${saturation}%`, top: `${100 - brightness}%` }}
            />
          </div>
        )
      }}
    </ColorPicker.Context>
  )
}

function getSaturationBrightnessBackground(hue: number): CSSProperties {
  return {
    background: [
      'linear-gradient(to top, #000, rgba(0, 0, 0, 0))',
      `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
    ].join(', '),
  }
}

function SaturationBrightnessSliders() {
  return (
    <ColorPicker.Context>
      {(api) => {
        const hsb = api.value.toFormat('hsba')
        const hue = getNumericChannel(hsb, 'hue')
        const saturation = getNumericChannel(hsb, 'saturation')
        const brightness = getNumericChannel(hsb, 'brightness')
        const noSaturation = rgbString(hsbToRgb(hue, 0, brightness))
        const fullSaturation = rgbString(hsbToRgb(hue, 100, brightness))
        const noBrightness = rgbString(hsbToRgb(hue, saturation, 0))
        const fullBrightness = rgbString(hsbToRgb(hue, saturation, 100))

        return (
          <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-3">
            <NativeColorSlider
              label="Saturation"
              value={saturation}
              onChange={(next) => api.setChannelValue('saturation', next)}
              background={`linear-gradient(to right, ${noSaturation}, ${fullSaturation})`}
            />
            <NativeColorSlider
              label="Brightness"
              value={brightness}
              onChange={(next) => api.setChannelValue('brightness', next)}
              background={`linear-gradient(to right, ${noBrightness}, ${fullBrightness})`}
            />
          </div>
        )
      }}
    </ColorPicker.Context>
  )
}

function NativeColorSlider({
  label,
  value,
  onChange,
  background,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  background: string
}) {
  function setFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    onChange(Math.round(x * 100))
  }

  function adjust(delta: number) {
    onChange(clamp(value + delta, 0, 100))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        className="relative h-5 w-full touch-none rounded-full border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
        style={{ background }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setFromPointer(event)
        }}
        onPointerMove={(event) => {
          if (event.buttons !== 1) return
          setFromPointer(event)
        }}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 10 : 1
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            adjust(-step)
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            adjust(step)
          }
          if (event.key === 'Home') {
            event.preventDefault()
            onChange(0)
          }
          if (event.key === 'End') {
            event.preventDefault()
            onChange(100)
          }
        }}
      >
        <div
          className="absolute top-1/2 h-5 w-5 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_5px_rgba(0,0,0,0.3)]"
          style={{ left: `${value}%` }}
        />
      </div>
    </div>
  )
}

function ColorSliders({ showAlpha }: { showAlpha: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <ColorPicker.EyeDropperTrigger
        aria-label="Pick color from screen"
        className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Pipette className="w-3.5 h-3.5" />
      </ColorPicker.EyeDropperTrigger>

      <div className="flex flex-1 flex-col gap-2">
        <ColorPicker.ChannelSlider channel="hue" className="relative h-4 w-full touch-none">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <ColorPicker.ChannelSliderTrack
              className="w-full h-full"
              style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
            />
          </div>
          <ColorPicker.ChannelSliderThumb className="absolute top-1/2 h-4 w-4 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-grab shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_5px_rgba(0,0,0,0.3)]" />
        </ColorPicker.ChannelSlider>

        {showAlpha && (
          <ColorPicker.ChannelSlider channel="alpha" className="relative h-4 w-full touch-none">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <ColorPicker.TransparencyGrid />
              <ColorPicker.ChannelSliderTrack className="w-full h-full" />
            </div>
            <ColorPicker.ChannelSliderThumb className="absolute top-1/2 h-4 w-4 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-grab shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_5px_rgba(0,0,0,0.3)]" />
          </ColorPicker.ChannelSlider>
        )}
      </div>
    </div>
  )
}

function FormatToggle({
  format,
  onFormatChange,
}: {
  format: ColorFormat
  onFormatChange: (format: ColorFormat) => void
}) {
  return (
    <div className="flex gap-0.5 p-0.5 bg-muted rounded-md">
      {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onFormatChange(f)}
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
  )
}

function ChannelInputs({ format, showAlpha }: { format: ColorFormat; showAlpha: boolean }) {
  return (
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
  )
}

function Swatches({
  presets,
  paletteGroups,
}: {
  presets: string[]
  paletteGroups: PaletteGroup[]
}) {
  return (
    <>
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
    </>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getNumericChannel(
  color: { getChannelValue: (channel: 'hue' | 'saturation' | 'brightness') => string | number },
  channel: 'hue' | 'saturation' | 'brightness',
) {
  return clamp(parseFloat(String(color.getChannelValue(channel))) || 0, 0, channel === 'hue' ? 360 : 100)
}

function hsbToRgb(hue: number, saturation: number, brightness: number) {
  const h = ((hue % 360) + 360) % 360
  const s = clamp(saturation, 0, 100) / 100
  const v = clamp(brightness, 0, 100) / 100
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbString({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r}, ${g}, ${b})`
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

// ────────────────────────────────────────────────────────────────────────────
// Pure custom variant — zero Ark UI dependency, pure React state + native pointer events
// ────────────────────────────────────────────────────────────────────────────

type Hsba = { h: number; s: number; b: number; a: number }

function hexToHsba(input: string): Hsba {
  const raw = input.trim().replace(/^#/, '')
  if (!/^[0-9a-f]{3,8}$/i.test(raw)) return { h: 0, s: 0, b: 0, a: 1 }
  const expand = (s: string) => s.split('').map((c) => c + c).join('')
  let str = raw
  if (str.length === 3) str = expand(str)
  else if (str.length === 4) str = expand(str)
  if (str.length !== 6 && str.length !== 8) return { h: 0, s: 0, b: 0, a: 1 }
  const r = parseInt(str.slice(0, 2), 16) / 255
  const g = parseInt(str.slice(2, 4), 16) / 255
  const bl = parseInt(str.slice(4, 6), 16) / 255
  const a = str.length === 8 ? parseInt(str.slice(6, 8), 16) / 255 : 1
  const max = Math.max(r, g, bl)
  const min = Math.min(r, g, bl)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - bl) / d) % 6
    else if (max === g) h = (bl - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return {
    h: Math.round(h),
    s: max === 0 ? 0 : Math.round((d / max) * 100),
    b: Math.round(max * 100),
    a,
  }
}

function hsbaToHex({ h, s, b, a }: Hsba, withAlpha: boolean): string {
  const rgb = hsbToRgb(h, s, b)
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  const alpha = withAlpha && a < 1 ? toHex(Math.round(a * 255)) : ''
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${alpha}`
}

const TRANSPARENCY_GRID_BG: CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 75%),' +
    'linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 4px',
}

export function ColorPickerPanelPureCustom({
  value,
  defaultValue = '#000000',
  onChange,
  showAlpha = false,
  presets = [],
  paletteGroups = DEFAULT_PALETTE_GROUPS,
  className,
}: ColorPickerProps) {
  const [hsba, setHsba] = useState<Hsba>(() => hexToHsba(value ?? defaultValue))
  const [hexDraft, setHexDraft] = useState<string>(() => hsbaToHex(hexToHsba(value ?? defaultValue), showAlpha))
  const lastEmittedRef = useRef<string>(hexDraft)

  useEffect(() => {
    if (value === undefined) return
    if (value.toLowerCase() === lastEmittedRef.current.toLowerCase()) return
    const next = hexToHsba(value)
    setHsba(next)
    setHexDraft(hsbaToHex(next, showAlpha))
  }, [value, showAlpha])

  function commit(next: Hsba) {
    setHsba(next)
    const hex = hsbaToHex(next, showAlpha)
    setHexDraft(hex)
    lastEmittedRef.current = hex
    onChange?.(hex)
  }

  const rgb = hsbToRgb(hsba.h, hsba.s, hsba.b)
  const currentHex = hsbaToHex(hsba, showAlpha)
  const pureHueRgb = hsbToRgb(hsba.h, 100, 100)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Current Value */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/25 p-2">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border shadow-sm">
          <div className="absolute inset-0" style={TRANSPARENCY_GRID_BG} />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: showAlpha ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hsba.a})` : currentHex }}
          />
        </div>
        <div className="min-w-0">
          <div className="block truncate font-mono text-sm font-semibold text-foreground">
            {currentHex.toUpperCase()}
          </div>
          <div className="block truncate font-mono text-[11px] text-muted-foreground">
            rgb({rgb.r}, {rgb.g}, {rgb.b}){showAlpha ? `, ${hsba.a.toFixed(2)}` : ''}
          </div>
        </div>
      </div>

      <Custom2DArea hsba={hsba} onCommit={commit} />

      <div className="flex flex-col gap-2">
        <CustomHueSlider hue={hsba.h} onChange={(h) => commit({ ...hsba, h })} />
        {showAlpha && (
          <CustomAlphaSlider alpha={hsba.a} solidRgb={rgb} onChange={(a) => commit({ ...hsba, a })} />
        )}
      </div>

      {/* Hex input */}
      <div className="flex gap-1.5">
        <div className="flex flex-1 flex-col gap-0.5">
          <input
            type="text"
            value={hexDraft}
            onChange={(event) => {
              const next = event.target.value
              setHexDraft(next)
              const stripped = next.trim().replace(/^#/, '')
              const validLengths = showAlpha ? [3, 4, 6, 8] : [3, 6]
              if (validLengths.includes(stripped.length) && /^[0-9a-f]+$/i.test(stripped)) {
                const parsed = hexToHsba(next)
                const reformat = hsbaToHex(parsed, showAlpha)
                setHsba(parsed)
                lastEmittedRef.current = reformat
                onChange?.(reformat)
              }
            }}
            onBlur={() => setHexDraft(currentHex)}
            spellCheck={false}
            className="w-full px-1.5 py-1.5 text-xs font-mono text-center bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring uppercase"
          />
          <span className="text-[10px] font-medium text-muted-foreground text-center">Hex</span>
        </div>
        <NumericChannelField label="R" value={rgb.r} max={255} onChange={(r) => commit(hexToHsba(rgbToHex(r, rgb.g, rgb.b, hsba.a, showAlpha)))} />
        <NumericChannelField label="G" value={rgb.g} max={255} onChange={(g) => commit(hexToHsba(rgbToHex(rgb.r, g, rgb.b, hsba.a, showAlpha)))} />
        <NumericChannelField label="B" value={rgb.b} max={255} onChange={(b) => commit(hexToHsba(rgbToHex(rgb.r, rgb.g, b, hsba.a, showAlpha)))} />
        {showAlpha && (
          <NumericChannelField
            label="A"
            value={Math.round(hsba.a * 100)}
            max={100}
            onChange={(a) => commit({ ...hsba, a: clamp(a, 0, 100) / 100 })}
          />
        )}
      </div>

      <CustomSwatches
        presets={presets}
        paletteGroups={paletteGroups}
        currentHex={currentHex.slice(0, 7).toLowerCase()}
        onPick={(hex) => commit({ ...hexToHsba(hex), a: hsba.a })}
      />

      {/* Pure-hue echo strip — visual confirmation of current hue independent of saturation */}
      <div
        className="h-1 w-full rounded-full"
        style={{ backgroundColor: `rgb(${pureHueRgb.r}, ${pureHueRgb.g}, ${pureHueRgb.b})` }}
        aria-hidden
      />
    </div>
  )
}

function Custom2DArea({ hsba, onCommit }: { hsba: Hsba; onCommit: (next: Hsba) => void }) {
  const ref = useRef<HTMLDivElement | null>(null)

  function setFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const node = ref.current ?? event.currentTarget
    const rect = node.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    onCommit({ ...hsba, s: Math.round(x * 100), b: Math.round((1 - y) * 100) })
  }

  function adjust(deltaSat: number, deltaBri: number) {
    onCommit({
      ...hsba,
      s: clamp(hsba.s + deltaSat, 0, 100),
      b: clamp(hsba.b + deltaBri, 0, 100),
    })
  }

  return (
    <div
      ref={ref}
      role="application"
      tabIndex={0}
      aria-label="Saturation and brightness"
      aria-roledescription="2d slider"
      aria-valuetext={`saturation ${hsba.s}, brightness ${hsba.b}`}
      className="relative h-52 w-full touch-none rounded-xl cursor-crosshair overflow-hidden border border-border/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      style={getSaturationBrightnessBackground(hsba.h)}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        setFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return
        setFromPointer(event)
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 1
        if (event.key === 'ArrowLeft') { event.preventDefault(); adjust(-step, 0) }
        if (event.key === 'ArrowRight') { event.preventDefault(); adjust(step, 0) }
        if (event.key === 'ArrowUp') { event.preventDefault(); adjust(0, step) }
        if (event.key === 'ArrowDown') { event.preventDefault(); adjust(0, -step) }
      }}
    >
      <div
        className="absolute z-10 h-5 w-5 rounded-full border-2 border-white pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.35)]"
        style={{
          left: `${hsba.s}%`,
          top: `${100 - hsba.b}%`,
          translate: '-50% -50%',
          backgroundColor: hsbaToHex(hsba, false),
        }}
      />
    </div>
  )
}

function CustomHueSlider({ hue, onChange }: { hue: number; onChange: (hue: number) => void }) {
  const ref = useRef<HTMLDivElement | null>(null)

  function setFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const node = ref.current ?? event.currentTarget
    const rect = node.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    onChange(Math.round(x * 360))
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      className="relative h-4 w-full touch-none rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
      style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        setFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return
        setFromPointer(event)
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 1
        if (event.key === 'ArrowLeft') { event.preventDefault(); onChange(clamp(hue - step, 0, 360)) }
        if (event.key === 'ArrowRight') { event.preventDefault(); onChange(clamp(hue + step, 0, 360)) }
      }}
    >
      <div
        className="absolute top-1/2 h-4 w-4 rounded-full border-2 border-white pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_5px_rgba(0,0,0,0.3)]"
        style={{ left: `${(hue / 360) * 100}%`, translate: '-50% -50%' }}
      />
    </div>
  )
}

function CustomAlphaSlider({
  alpha,
  solidRgb,
  onChange,
}: {
  alpha: number
  solidRgb: { r: number; g: number; b: number }
  onChange: (alpha: number) => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  function setFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const node = ref.current ?? event.currentTarget
    const rect = node.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    onChange(Number(x.toFixed(3)))
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Alpha"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={Number(alpha.toFixed(2))}
      className="relative h-4 w-full touch-none rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
      style={TRANSPARENCY_GRID_BG}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        setFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return
        setFromPointer(event)
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 0.1 : 0.01
        if (event.key === 'ArrowLeft') { event.preventDefault(); onChange(clamp(alpha - step, 0, 1)) }
        if (event.key === 'ArrowRight') { event.preventDefault(); onChange(clamp(alpha + step, 0, 1)) }
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(${solidRgb.r}, ${solidRgb.g}, ${solidRgb.b}, 0), rgba(${solidRgb.r}, ${solidRgb.g}, ${solidRgb.b}, 1))`,
        }}
      />
      <div
        className="absolute top-1/2 h-4 w-4 rounded-full border-2 border-white pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_5px_rgba(0,0,0,0.3)]"
        style={{ left: `${alpha * 100}%`, translate: '-50% -50%' }}
      />
    </div>
  )
}

function NumericChannelField({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (next: number) => void
}) {
  return (
    <div className="flex w-12 flex-col gap-0.5">
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(event) => {
          const parsed = parseInt(event.target.value, 10)
          if (!Number.isNaN(parsed)) onChange(clamp(parsed, 0, max))
        }}
        className="w-full px-1.5 py-1.5 text-xs font-mono text-center bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="text-[10px] font-medium text-muted-foreground text-center">{label}</span>
    </div>
  )
}

function CustomSwatches({
  presets,
  paletteGroups,
  currentHex,
  onPick,
}: {
  presets: string[]
  paletteGroups: PaletteGroup[]
  currentHex: string
  onPick: (hex: string) => void
}) {
  return (
    <>
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 border-t border-border">
          {presets.map((color) => (
            <SwatchButton key={color} color={color} active={color.toLowerCase() === currentHex} onPick={onPick} />
          ))}
        </div>
      )}
      {paletteGroups.length > 0 && (
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          {paletteGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.colors.map((color) => (
                  <SwatchButton key={color} color={color} active={color.toLowerCase() === currentHex} onPick={onPick} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function SwatchButton({
  color,
  active,
  onPick,
}: {
  color: string
  active: boolean
  onPick: (hex: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(color)}
      aria-label={`Select ${color}`}
      aria-pressed={active}
      className={cn(
        'w-6 h-6 rounded cursor-pointer ring-1 ring-border hover:ring-2 hover:ring-accent transition-shadow overflow-hidden',
        active && 'ring-2 ring-accent',
      )}
      style={{ backgroundColor: color }}
    />
  )
}

function rgbToHex(r: number, g: number, b: number, a: number, withAlpha: boolean): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  const alpha = withAlpha && a < 1 ? toHex(Math.round(a * 255)) : ''
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`
}
