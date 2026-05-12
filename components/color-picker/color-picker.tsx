import { Pipette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type ColorPickerMessages } from './messages'

type ColorFormat = 'hex' | 'rgb' | 'hsl'
...
export function ColorPickerPanel({
  value,
  defaultValue = '#000000',
  onChange,
  showAlpha = false,
  presets = [],
  paletteGroups,
  className,
  messages,
}: ColorPickerProps) {
  const [hsba, setHsba] = useState<Hsba>(() => hexToHsba(value ?? defaultValue))
  const [hexDraft, setHexDraft] = useState<string>(() => hsbaToHex(hexToHsba(value ?? defaultValue), showAlpha))
  const [format, setFormat] = useState<ColorFormat>('hex')
  const lastEmittedRef = useRef<string>(hexDraft)
  const eyedropperSupported = isEyeDropperSupported()
  const m = useComponentMessages(MESSAGES, messages)
  const finalPaletteGroups = paletteGroups ?? getDefaultPaletteGroups(m)

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
  const hsl = hsbToHsl(hsba.h, hsba.s, hsba.b)
  const currentHex = hsbaToHex(hsba, showAlpha)
  const pureHueRgb = hsbToRgb(hsba.h, 100, 100)

  async function pickFromScreen() {
    const promise = openEyeDropper()
    if (!promise) return
    try {
      const result = await promise
      commit({ ...hexToHsba(result.sRGBHex), a: hsba.a })
    } catch {
      /* user cancelled */
    }
  }

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

      <Custom2DArea hsba={hsba} onCommit={commit} messages={m} />

      <div className="flex items-center gap-2">
        {eyedropperSupported && (
          <button
            type="button"
            onClick={pickFromScreen}
            aria-label={m.eyedropper}
            className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <CustomHueSlider hue={hsba.h} onChange={(h) => commit({ ...hsba, h })} messages={m} />
          {showAlpha && (
            <CustomAlphaSlider alpha={hsba.a} solidRgb={rgb} onChange={(a) => commit({ ...hsba, a })} messages={m} />
          )}
        </div>
      </div>

      <PureFormatToggle format={format} onFormatChange={setFormat} messages={m} />

      {format === 'hex' && (
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
            <span className="text-[10px] font-medium text-muted-foreground text-center">{m.formatHex}</span>
          </div>
          {showAlpha && (
            <NumericChannelField
              label="A"
              value={Math.round(hsba.a * 100)}
              max={100}
              onChange={(a) => commit({ ...hsba, a: clamp(a, 0, 100) / 100 })}
            />
          )}
        </div>
      )}

      {format === 'rgb' && (
        <div className="flex gap-1.5">
          <NumericChannelField label="R" grow value={rgb.r} max={255} onChange={(r) => commit(hexToHsba(rgbToHex(r, rgb.g, rgb.b, hsba.a, showAlpha)))} />
          <NumericChannelField label="G" grow value={rgb.g} max={255} onChange={(g) => commit(hexToHsba(rgbToHex(rgb.r, g, rgb.b, hsba.a, showAlpha)))} />
          <NumericChannelField label="B" grow value={rgb.b} max={255} onChange={(b) => commit(hexToHsba(rgbToHex(rgb.r, rgb.g, b, hsba.a, showAlpha)))} />
          {showAlpha && (
            <NumericChannelField
              label="A"
              value={Math.round(hsba.a * 100)}
              max={100}
              onChange={(a) => commit({ ...hsba, a: clamp(a, 0, 100) / 100 })}
            />
          )}
        </div>
      )}

      {format === 'hsl' && (
        <div className="flex gap-1.5">
          <NumericChannelField label="H" grow value={hsl.h} max={360} onChange={(h) => {
            const next = hslToHsb(h, hsl.s, hsl.l)
            commit({ ...hsba, ...next })
          }} />
          <NumericChannelField label="S" grow value={hsl.s} max={100} onChange={(s) => {
            const next = hslToHsb(hsl.h, s, hsl.l)
            commit({ ...hsba, ...next })
          }} />
          <NumericChannelField label="L" grow value={hsl.l} max={100} onChange={(l) => {
            const next = hslToHsb(hsl.h, hsl.s, l)
            commit({ ...hsba, ...next })
          }} />
          {showAlpha && (
            <NumericChannelField
              label="A"
              value={Math.round(hsba.a * 100)}
              max={100}
              onChange={(a) => commit({ ...hsba, a: clamp(a, 0, 100) / 100 })}
            />
          )}
        </div>
      )}

      <CustomSwatches
        presets={presets}
        paletteGroups={finalPaletteGroups}
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

// ── 2D area ──────────────────────────────────────────────────────────────

function Custom2DArea({ hsba, onCommit, messages }: { hsba: Hsba; onCommit: (next: Hsba) => void; messages: ColorPickerMessages }) {
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
      aria-label={messages.saturationBrightness}
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

// ── Sliders ──────────────────────────────────────────────────────────────

function CustomHueSlider({ hue, onChange, messages }: { hue: number; onChange: (hue: number) => void; messages: ColorPickerMessages }) {
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
      aria-label={messages.hue}
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
  messages,
}: {
  alpha: number
  solidRgb: { r: number; g: number; b: number }
  onChange: (alpha: number) => void
  messages: ColorPickerMessages
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
      aria-label={messages.alpha}
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

// ── Inputs & format toggle ───────────────────────────────────────────────

function NumericChannelField({
  label,
  value,
  max,
  onChange,
  grow = false,
}: {
  label: string
  value: number
  max: number
  onChange: (next: number) => void
  grow?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', grow ? 'flex-1' : 'w-12')}>
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

function PureFormatToggle({
  format,
  onFormatChange,
  messages,
}: {
  format: ColorFormat
  onFormatChange: (format: ColorFormat) => void
  messages: ColorPickerMessages
}) {
  const formatLabels: Record<ColorFormat, string> = {
    hex: messages.formatHex,
    rgb: messages.formatRgb,
    hsl: messages.formatHsl,
  }

  return (
    <div className="flex gap-0.5 p-0.5 bg-muted rounded-md">
      {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onFormatChange(f)}
          aria-pressed={format === f}
          className={cn(
            'flex-1 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
            format === f
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {formatLabels[f]}
        </button>
      ))}
    </div>
  )
}

// ── Swatches ─────────────────────────────────────────────────────────────

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

// ── Color math & helpers ─────────────────────────────────────────────────

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getSaturationBrightnessBackground(hue: number): CSSProperties {
  return {
    background: [
      'linear-gradient(to top, #000, rgba(0, 0, 0, 0))',
      `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
    ].join(', '),
  }
}

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

  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function hsbToHsl(h: number, s: number, b: number): { h: number; s: number; l: number } {
  const sN = s / 100
  const bN = b / 100
  const l = bN * (1 - sN / 2)
  const sl = l === 0 || l === 1 ? 0 : (bN - l) / Math.min(l, 1 - l)
  return { h: Math.round(h), s: Math.round(sl * 100), l: Math.round(l * 100) }
}

function hslToHsb(h: number, s: number, l: number): { h: number; s: number; b: number } {
  const sN = clamp(s, 0, 100) / 100
  const lN = clamp(l, 0, 100) / 100
  const v = lN + sN * Math.min(lN, 1 - lN)
  const sb = v === 0 ? 0 : 2 * (1 - lN / v)
  return { h: clamp(h, 0, 360), s: Math.round(sb * 100), b: Math.round(v * 100) }
}

function rgbToHex(r: number, g: number, b: number, a: number, withAlpha: boolean): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  const alpha = withAlpha && a < 1 ? toHex(Math.round(a * 255)) : ''
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`
}

// ── Eyedropper API ───────────────────────────────────────────────────────

type EyeDropperResult = { sRGBHex: string }
type EyeDropperApi = { open(options?: { signal?: AbortSignal }): Promise<EyeDropperResult> }

function isEyeDropperSupported(): boolean {
  return typeof window !== 'undefined' && 'EyeDropper' in window
}

function openEyeDropper(): Promise<EyeDropperResult> | null {
  if (!isEyeDropperSupported()) return null
  const Ctor = (window as unknown as { EyeDropper: new () => EyeDropperApi }).EyeDropper
  return new Ctor().open()
}
