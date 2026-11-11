import { useState, type RefObject } from 'react'
import { Check, Loader2, Save } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { barButtonCls } from '../shared/button-styles'
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
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        barButtonCls,
        'border px-3 disabled:opacity-100',
        status === 'success'
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600'
          : status === 'error'
            ? 'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive'
            : isDirty
              ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
              : 'border-border text-muted-foreground/70',
      )}
      title={isDirty ? m.saveTitleDirty : m.saveTitleClean}
    >
      {status === 'saving' && (<><Loader2 size={14} className="animate-spin" aria-hidden /> {m.saveSaving}</>)}
      {status === 'success' && (<><Check size={14} aria-hidden /> {m.saveSaved}</>)}
      {status === 'error' && m.saveRetry}
      {status === 'idle' && (isDirty
        ? (<><Save size={14} aria-hidden /> {m.saveIdle}</>)
        : (<><Check size={14} aria-hidden /> {m.saveSaved}</>))}
    </button>
  )
}
