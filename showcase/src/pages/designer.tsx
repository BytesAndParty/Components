import { useState } from 'react'
import { Section } from '../components/section'
import { ColorPickerPanel } from '@components/color-picker/color-picker'

// ─── Color Picker Demo ───────────────────────────────────────────────────────

function ColorPickerDemo() {
  const [color, setColor] = useState('#722f37')

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="w-64 bg-card border border-border rounded-xl p-3 shadow-sm">
        <ColorPickerPanel
          value={color}
          onChange={setColor}
          showAlpha={false}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-sm text-muted-foreground font-mono">onChange value:</div>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border border-border shadow-sm"
            style={{ background: color }}
          />
          <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
            {color}
          </code>
        </div>

        <div className="mt-2 text-sm text-muted-foreground font-mono">with Alpha:</div>
        <div className="w-64 bg-card border border-border rounded-xl p-3 shadow-sm">
          <ColorPickerPanel
            defaultValue="#d4af37"
            showAlpha
            presets={[]}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function DesignerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Designer Components</h1>
      <p className="text-muted-foreground mb-10">
        Building blocks für den Wine Label Designer.
      </p>

      <Section
        title="Color Picker"
        description="HEX / RGB / HSL Umschalter, Hue + Alpha Sliders, Eye Dropper, Preset Swatches. Vollständig CSS-variablen-basiertes Theming."
      >
        <ColorPickerDemo />
      </Section>
    </div>
  )
}
