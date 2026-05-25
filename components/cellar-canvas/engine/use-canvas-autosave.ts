import { useEffect, type RefObject } from 'react'
import type { FabricBridge } from './fabric-bridge'
import type { CellarCanvasState } from '../store/types'

const DEBOUNCE_MS = 1000

/**
 * Debounced (1s) draft persistence + `onChange` notifier. Writes the serialized
 * canvas state to localStorage under `storageKey` (or skips storage entirely
 * when `null`) and fires `onChange` so the embedding app can mirror to its
 * own store. Triggered by add / remove / modify events plus the custom
 * `cellar:property-changed` channel.
 */
export function useCanvasAutosave(
  bridge:     RefObject<FabricBridge | null>,
  storageKey: string | null,
  onChange?:  (state: CellarCanvasState) => void
) {
  useEffect(() => {
    const b = bridge.current
    if (!b) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const flush = () => {
      const state = b.serializeState()
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(state))
        } catch {
          // Quota exceeded / private mode / storage disabled — silent.
        }
      }
      onChange?.(state)
    }

    const debounced = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(flush, DEBOUNCE_MS)
    }

    const canvas = b.canvas
    canvas.on('object:added',    debounced)
    canvas.on('object:removed',  debounced)
    canvas.on('object:modified', debounced)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(canvas as any).on('cellar:property-changed', debounced)

    return () => {
      if (timer) clearTimeout(timer)
      canvas.off('object:added',    debounced)
      canvas.off('object:removed',  debounced)
      canvas.off('object:modified', debounced)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).off('cellar:property-changed', debounced)
    }
  }, [bridge, storageKey, onChange])
}
