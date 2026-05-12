import type { FabricBridge } from '../../engine/fabric-bridge'
import type { WineFieldValues } from '../../CellarCanvas'
import { Plus, QrCode } from 'lucide-react'

interface WineFieldsPanelProps {
  bridge: React.MutableRefObject<FabricBridge | null>
  values?: WineFieldValues
}

export function WineFieldsPanel({ bridge, values = {} }: WineFieldsPanelProps) {
  const fields = [
    { key: 'name',           label: 'Wine Name',   value: values.name },
    { key: 'vintage',        label: 'Vintage',     value: values.vintage },
    { key: 'alcoholPercent', label: 'Alcohol %',   value: values.alcoholPercent },
    { key: 'volumeMl',       label: 'Volume (ml)', value: values.volumeMl },
    { key: 'region',         label: 'Region',      value: values.region },
    { key: 'producer',       label: 'Producer',    value: values.producer },
  ] as const

  const addField = (key: string, label: string, value?: string | number) => {
    const text = value ? String(value) : label
    bridge.current?.addText(text, key)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-2">
        {fields.map((field) => (
          <button
            key={field.key}
            onClick={() => addField(field.key, field.label, field.value)}
            className="group flex items-center justify-between px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg border border-transparent hover:border-border transition-all text-left"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {field.label}
              </span>
              <span className="text-xs truncate max-w-[180px]">
                {field.value || <span className="italic opacity-50">Not set</span>}
              </span>
            </div>
            <Plus size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <button
          onClick={() => bridge.current?.addQRCode(values.nutritionalInfoUrl || 'https://example.com')}
          className="w-full flex items-center gap-3 px-3 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20 transition-all"
        >
          <QrCode size={18} />
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider">Add QR Code</span>
            <span className="text-[10px] opacity-70">EU compliance requirement</span>
          </div>
        </button>
      </div>
    </div>
  )
}
