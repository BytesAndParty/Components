import { useState, type RefObject } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { useDesignerStore } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { CellarCanvasState } from '../../store/types'

type Status = 'idle' | 'saving' | 'success' | 'error'

const SUCCESS_FLASH_MS = 1500
const ERROR_FLASH_MS   = 2500

export interface SaveButtonProps {
  bridge: RefObject<FabricBridge | null>
  onSave: (state: CellarCanvasState) => Promise<void>
}

/**
 * Async save trigger with idle / saving / success / error states. Disabled
 * when the canvas is clean — there's nothing to save. The dirty flag clears
 * on a successful save so the button greys back out.
 */
export function SaveButton({ bridge, onSave }: SaveButtonProps) {
  const m = useCellarCanvasMessages()
  const [status, setStatus] = useState<Status>('idle')
  const isDirty = useDesignerStore(s => s.isDirty)

  async function handleClick() {
    if (status === 'saving') return
    const state = bridge.current?.serializeState()
    if (!state) return

    setStatus('saving')
    try {
      await onSave(state)
      useDesignerStore.getState().setDirty(false)
      setStatus('success')
      setTimeout(() => setStatus('idle'), SUCCESS_FLASH_MS)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), ERROR_FLASH_MS)
    }
  }

  const disabled = status === 'saving' || (!isDirty && status === 'idle')

  return (
    <button
      data-tour="save-button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors",
        status === 'success'
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
          : status === 'error'
            ? "border-destructive/40 bg-destructive/10 text-destructive"
            : isDirty
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border text-muted-foreground opacity-60",
      )}
      title={isDirty ? m.saveTitleDirty : m.saveTitleClean}
    >
      {status === 'saving' && (<><Loader2 size={12} className="animate-spin" /> {m.saveSaving}</>)}
      {status === 'success' && (<><Check size={12} /> {m.saveSaved}</>)}
      {status === 'error' && m.saveRetry}
      {status === 'idle' && (isDirty ? m.saveIdle : m.saveSaved)}
    </button>
  )
}
