import type { FabricBridge } from '../../engine/fabric-bridge'
import type { WineFieldValues } from '../../CellarCanvas'
import { Plus, QrCode, Check } from 'lucide-react'
import { useCellarCanvasMessages } from '../../messages-context'
import type { Layer } from '../../../layer-panel/layer-panel'
import { cn } from '../../../lib/utils'

interface WineFieldsPanelProps {
  bridge: React.MutableRefObject<FabricBridge | null>
  values?: WineFieldValues
  layers?: Layer[]
}

export function WineFieldsPanel({ bridge, values = {}, layers = [] }: WineFieldsPanelProps) {
  const m = useCellarCanvasMessages()
  
  // Track which field keys are already present on the canvas to show indicators.
  const placedFieldKeys = new Set(layers.map(l => l.fieldKey).filter(Boolean))

  const fields = [
    { key: 'name',           label: m.wineFieldName,     value: values.name },
    { key: 'vintage',        label: m.wineFieldVintage,  value: values.vintage },
    { key: 'alcoholPercent', label: m.wineFieldAlcohol,  value: values.alcoholPercent },
    { key: 'volumeMl',       label: m.wineFieldVolume,   value: values.volumeMl },
    { key: 'region',         label: m.wineFieldRegion,   value: values.region },
    { key: 'producer',       label: m.wineFieldProducer, value: values.producer },
  ] as const

  const addField = (key: string, label: string, value?: string | number) => {
    const text = value ? String(value) : label
    bridge.current?.addText(text, key)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-2">
        {fields.map((field) => {
          const isPlaced = placedFieldKeys.has(field.key)
          return (
            <button
              key={field.key}
              onClick={() => addField(field.key, field.label, field.value)}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left",
                isPlaced 
                  ? "bg-primary/5 border-primary/20 hover:bg-primary/10" 
                  : "bg-muted/50 hover:bg-muted border-transparent hover:border-border"
              )}
            >
              <div className="flex flex-col">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider transition-colors",
                  isPlaced ? "text-primary/70" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {field.label}
                </span>
                <span className={cn(
                  "text-xs truncate max-w-[180px]",
                  isPlaced && "text-foreground font-medium"
                )}>
                  {field.value || <span className="italic opacity-50">{m.wineFieldNotSet}</span>}
                </span>
              </div>
              {isPlaced ? (
                <Check size={14} className="text-primary" />
              ) : (
                <Plus size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          )
        })}
      </div>

      <div className="pt-4 border-t border-border">
        {(() => {
          const isQrPlaced = placedFieldKeys.has('qrCode')
          return (
            <button
              onClick={() => bridge.current?.addQRCode(values.nutritionalInfoUrl || 'https://example.com')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-3 rounded-xl border transition-all",
                isQrPlaced
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 hover:border-primary/20"
              )}
            >
              <div className="flex items-center gap-3">
                <QrCode size={18} />
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-bold uppercase tracking-wider">{m.wineFieldQrTitle}</span>
                  <span className="text-[10px] opacity-70">{m.wineFieldQrHint}</span>
                </div>
              </div>
              {isQrPlaced && <Check size={16} />}
            </button>
          )
        })()}
      </div>
    </div>
  )
}
