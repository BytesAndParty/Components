import { useState, useEffect, type ChangeEvent } from 'react'
import { Section } from '../components/section'
import { ColorPickerPanel } from '@components/color-picker/color-picker'
import { TextToolOptions, type TextFormatValues, defaultTextFormat } from '@components/text-tool-options/text-tool-options'
import { AlignmentBar, type AlignAction } from '@components/alignment-bar/alignment-bar'
import { ValidatorBadge, type ValidationWarning } from '@components/validator-badge/validator-badge'
import { LayerPanel, type Layer } from '@components/layer-panel/layer-panel'
import { ImageCropperModal } from '@components/image-cropper-modal/image-cropper-modal'
import { useDesignEngineHotkey } from '@components/hotkeys/hotkeys-provider'

// ── Color Picker ──────────────────────────────────────────────────────────────

function ColorPickerDemo() {
  const [color, setColor] = useState('#722f37')

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Color Picker</h4>
          <p className="text-xs text-muted-foreground">Hex / RGB / HSL inkl. Alpha-Kanal & Eye Dropper.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md border border-border shadow-sm" style={{ background: color }} />
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">{color}</code>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <ColorPickerPanel value={color} onChange={setColor} showAlpha />
      </div>
    </div>
  )
}

// ── Text Tool Options ─────────────────────────────────────────────────────────

function TextToolOptionsDemo() {
  const [fmt, setFmt] = useState<TextFormatValues>(defaultTextFormat)
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto pb-1">
        <TextToolOptions value={fmt} onChange={(p: Partial<TextFormatValues>) => setFmt((prev: TextFormatValues) => ({ ...prev, ...p }))} />
      </div>
      <div className="p-6 bg-card border border-border rounded-xl">
        <p
          style={{
            fontFamily: fmt.fontFamily, fontSize: fmt.fontSize,
            fontWeight: fmt.bold ? 700 : 400, fontStyle: fmt.italic ? 'italic' : 'normal',
            textDecoration: fmt.underline ? 'underline' : 'none',
            textAlign: fmt.textAlign, letterSpacing: `${fmt.charSpacing / 1000}em`,
            lineHeight: fmt.lineHeight, color: fmt.color,
          }}
        >
          Château des Vignes · Pinot Noir 2021
        </p>
      </div>
    </div>
  )
}

// ── Alignment Bar ─────────────────────────────────────────────────────────────

function AlignmentBarDemo() {
  const [last, setLast] = useState<AlignAction | null>(null)
  return (
    <div className="flex flex-col gap-4">
      <AlignmentBar onAlign={setLast} />
      {last && (
        <p className="text-xs font-mono text-muted-foreground">
          Last action: <span className="text-foreground">{last}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        In Cellar Canvas wird diese Toolbar eingeblendet wenn ≥ 2 Objekte selektiert sind.
      </p>
    </div>
  )
}

// ── Validator Badge ───────────────────────────────────────────────────────────

const MOCK_WARNINGS: ValidationWarning[] = [
  { key: 'alcoholPercent', label: 'Alcohol percentage', description: 'Required by EU Reg. 1308/2013', severity: 'error' },
  { key: 'allergenNote',   label: 'Allergen note',      description: 'Contains sulphites — mandatory', severity: 'error' },
  { key: 'qrCode',         label: 'QR code (nutritional info)', description: 'EU Reg. 2023/2977 requires nutritional declaration', severity: 'warning' },
]

function ValidatorBadgeDemo() {
  const [warnings, setWarnings] = useState<ValidationWarning[]>(MOCK_WARNINGS)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <ValidatorBadge warnings={warnings} />
        <ValidatorBadge warnings={[MOCK_WARNINGS[0]]} />
        <ValidatorBadge warnings={[]} />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setWarnings(MOCK_WARNINGS)}
          className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
        >
          3 Warnungen
        </button>
        <button
          onClick={() => setWarnings(MOCK_WARNINGS.slice(0, 1))}
          className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
        >
          1 Error
        </button>
        <button
          onClick={() => setWarnings([])}
          className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
        >
          Compliant
        </button>
      </div>
    </div>
  )
}

// ── Layer Panel ───────────────────────────────────────────────────────────────

const MOCK_LAYERS: Layer[] = [
  { id: '1', name: 'Wine Name',     type: 'wine-field', visible: true,  locked: false },
  { id: '2', name: 'Vintage 2021',  type: 'wine-field', visible: true,  locked: false },
  { id: '3', name: 'Label Photo',   type: 'image',      visible: true,  locked: false },
  { id: '4', name: 'QR Code',       type: 'qr-code',    visible: true,  locked: true  },
  { id: '5', name: 'Border Frame',  type: 'rect',       visible: false, locked: false },
  { id: '6', name: 'Description',   type: 'text',       visible: true,  locked: false },
]

function LayerPanelDemo() {
  const [layers, setLayers]     = useState<Layer[]>(MOCK_LAYERS)
  const [selected, setSelected] = useState<string[]>(['1'])

  function toggle<K extends 'visible' | 'locked'>(id: string, key: K) {
    setLayers((prev: Layer[]) => prev.map((l: Layer) => l.id === id ? { ...l, [key]: !l[key] } : l))
  }

  useDesignEngineHotkey(
    'Delete',
    () => {
      if (selected.length === 0) return
      setLayers((prev: Layer[]) => prev.filter((l: Layer) => !selected.includes(l.id)))
      setSelected([])
    },
    { label: 'Ebene löschen', description: 'Ausgewählte Ebene(n) entfernen', category: 'Actions' }
  )

  useDesignEngineHotkey(
    'Escape',
    () => setSelected([]),
    { label: 'Auswahl aufheben', description: 'Alle Ebenen deselektieren', category: 'Navigation' }
  )

  return (
    <div className="flex flex-col gap-2 max-w-xs">
      <LayerPanel
        layers={layers}
        selectedIds={selected}
        onReorder={setLayers}
        onSelect={(id) => setSelected([id])}
        onVisibilityToggle={(id) => toggle(id, 'visible')}
        onLockToggle={(id) => toggle(id, 'locked')}
        onRename={(id, name) => setLayers((prev: Layer[]) => prev.map((l: Layer) => l.id === id ? { ...l, name } : l))}
        onDelete={(id) => setLayers((prev: Layer[]) => prev.filter((l: Layer) => l.id !== id))}
      />
      <p className="text-xs text-muted-foreground">
        Doppelklick zum Umbenennen · Drag am Grip zum Sortieren · <kbd className="text-[10px] bg-muted px-1 rounded">Delete</kbd> löscht Auswahl
      </p>
    </div>
  )
}

// ── Image Cropper Modal ───────────────────────────────────────────────────────

function ImageCropperDemo() {
  const [open, setOpen]           = useState(false)
  const [imageSrc, setImageSrc]   = useState<string | undefined>()
  const [cropped, setCropped]     = useState<string | undefined>()

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (cropped && cropped.startsWith('blob:')) {
        URL.revokeObjectURL(cropped)
      }
    }
  }, [cropped])

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      setImageSrc(ev.target?.result as string)
      setOpen(true)
    }
    reader.readAsDataURL(file)
  }

  function handleCrop(blob: Blob) {
    if (cropped && cropped.startsWith('blob:')) {
      URL.revokeObjectURL(cropped)
    }
    setCropped(URL.createObjectURL(blob))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="cursor-pointer px-4 py-2 text-sm font-medium bg-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          Upload & Crop
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {imageSrc && (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors text-foreground"
          >
            Re-open Cropper
          </button>
        )}
      </div>

      {cropped && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-mono">Cropped result:</p>
          <img src={cropped} alt="Cropped" className="max-w-xs rounded-lg border border-border shadow-sm" />
        </div>
      )}

      <ImageCropperModal
        open={open}
        onOpenChange={setOpen}
        imageSrc={imageSrc}
        aspectRatio={3 / 4}
        onCrop={handleCrop}
      />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DesignerPage() {
  // Page-level designer shortcuts — press ? to see them all
  useDesignEngineHotkey('Mod+z', () => {}, {
    label: 'Rückgängig', description: 'Letzte Aktion rückgängig machen', category: 'Actions'
  })
  useDesignEngineHotkey('Mod+Shift+z', () => {}, {
    label: 'Wiederholen', description: 'Letzte Aktion wiederholen', category: 'Actions'
  })
  useDesignEngineHotkey('Mod+d', () => {}, {
    label: 'Duplizieren', description: 'Ausgewählte Objekte duplizieren', category: 'Actions'
  })
  useDesignEngineHotkey('Mod+a', () => {}, {
    label: 'Alle auswählen', description: 'Alle Objekte auf dem Canvas selektieren', category: 'Actions'
  })
  useDesignEngineHotkey('Mod+g', () => {}, {
    label: 'Gruppieren', description: 'Auswahl zu einer Gruppe zusammenfassen', category: 'Actions'
  })
  useDesignEngineHotkey('[', () => {}, {
    label: 'Ebene nach hinten', description: 'Ausgewählte Ebene eine Stufe nach hinten', category: 'Context'
  })
  useDesignEngineHotkey(']', () => {}, {
    label: 'Ebene nach vorne', description: 'Ausgewählte Ebene eine Stufe nach vorne', category: 'Context'
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Designer Components</h1>
      <p className="text-muted-foreground mb-10">
        Atomic building blocks für Cellar Canvas — den Wine Label Designer.
      </p>

      <Section title="Text Tool Options" description="Font, Größe, Bold/Italic/Underline, Ausrichtung, Letter-Spacing, Line-Height, Farbe. Schriftarten in ihrem eigenen Stil im Dropdown.">
        <TextToolOptionsDemo />
      </Section>

      <Section title="Alignment Bar" description="Erscheint wenn ≥ 2 Objekte selektiert sind. 6 Ausrichtungs- + 2 Verteilungs-Actions.">
        <AlignmentBarDemo />
      </Section>

      <Section title="Layer Panel" description="Ebenen-Liste mit Drag-to-Reorder, Visibility, Lock, Rename, Delete. Framer Motion Reorder.Group.">
        <LayerPanelDemo />
      </Section>

      <Section title="EU Compliance Validator" description="Zeigt fehlende Pflichtfelder gemäß EU-Verordnung 2023/2977. Rot = Error, Gelb = Warning, Grün = Compliant.">
        <ValidatorBadgeDemo />
      </Section>

      <Section title="Image Cropper Modal" description="Ark UI ImageCropper in einem Dialog mit FocusTrap. Zoom-Slider, Flip, Rotation. Upload-Trigger + Crop-Callback.">
        <ImageCropperDemo />
      </Section>

      <Section title="Color Picker" description="HEX / RGB / HSL, Hue + Alpha Sliders, Eye Dropper, Preset Swatches.">
        <ColorPickerDemo />
      </Section>
    </div>
  )
}
