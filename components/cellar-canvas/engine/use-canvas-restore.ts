import { useEffect, type RefObject } from 'react'
import { useDesignerStore } from '../store/designer-store'
import type { FabricBridge } from './fabric-bridge'
import type { CellarCanvasState } from '../store/types'

/** Reads the autosaved draft; null when absent, unreadable or storage is blocked. */
function readDraft(storageKey: string | null): object | null {
  if (!storageKey || typeof localStorage === 'undefined') return null
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? (JSON.parse(stored) as object) : null
  } catch {
    // Corrupted draft or storage access denied (private mode) — start fresh.
    return null
  }
}

/**
 * Mount-time canvas restoration. `initialState` (passed by the embedder) wins
 * over the localStorage draft. After restoring, the scene becomes the undo
 * baseline, the label is fitted into the viewport and the dirty flag cleared —
 * restoration is not a user edit.
 *
 * Runs straight in the effect: `useFabricCanvas` is called earlier in the same
 * component, so its effect has already written the bridge ref. No timer — the
 * former 100 ms delay raced the bridge's own initial snapshot, and Undo right
 * after a reload could wipe the restored draft.
 *
 * Re-runs only when dimensions change (canvas is recreated). Never on view
 * toggles like fullscreen: a re-run would reload the debounced localStorage
 * draft over the live canvas and drop the edits of the last second. See the
 * sibling effect in `CellarCanvas.tsx` for the fullscreen-only re-fit.
 */
export function useCanvasRestore(
  bridge:       RefObject<FabricBridge | null>,
  initialState: CellarCanvasState | object | undefined,
  storageKey:   string | null,
  deps:         { widthMm: number; heightMm: number }
) {
  useEffect(() => {
    const b = bridge.current
    if (!b) return
    let cancelled = false

    const restore = async () => {
      const state = initialState ?? readDraft(storageKey)
      if (state) {
        try {
          await b.restoreState(state)
        } catch {
          // Unloadable scene — keep the empty canvas.
        }
      }
      if (cancelled) return
      b.resetHistory()
      b.zoomToFit()
      useDesignerStore.getState().setDirty(false)
    }
    void restore()

    return () => {
      cancelled = true
    }
  }, [bridge, initialState, storageKey, deps.widthMm, deps.heightMm])
}
