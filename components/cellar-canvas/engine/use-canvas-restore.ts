import { useEffect, type RefObject } from 'react'
import { useDesignerStore } from '../store/designer-store'
import type { FabricBridge } from './fabric-bridge'
import type { CellarCanvasState } from '../store/types'

// Bridge construction races canvas mount. `useFabricCanvas` writes the bridge
// to its ref inside a useEffect, so we wait one frame before talking to it.
const BRIDGE_READY_DELAY_MS = 100

/**
 * Mount-time canvas restoration. `initialState` (passed by the embedder) wins
 * over the localStorage draft. After restoring, fits the label into the
 * viewport and clears the dirty flag — restoration is not a user edit.
 *
 * Re-runs only when dimensions change (canvas is recreated). Fullscreen
 * toggling needs a re-fit too (the wrapper resizes), but must NOT re-run this
 * restore — it used to sit in the same effect, so entering fullscreen
 * silently reloaded `initialState`/the localStorage draft and discarded
 * whatever the user had just changed. See the sibling effect in
 * `CellarCanvas.tsx` for the fullscreen-only re-fit.
 */
export function useCanvasRestore(
  bridge:       RefObject<FabricBridge | null>,
  initialState: CellarCanvasState | object | undefined,
  storageKey:   string | null,
  deps:         { widthMm: number; heightMm: number }
) {
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const b = bridge.current
      if (!b) return

      if (initialState) {
        await b.restoreState(initialState)
      } else if (storageKey) {
        const stored = typeof localStorage !== 'undefined'
          ? localStorage.getItem(storageKey)
          : null
        if (stored) {
          try {
            await b.restoreState(JSON.parse(stored))
          } catch {
            // Corrupted draft — start fresh.
          }
        }
      }

      // Seeds the undo stack with exactly the state now on screen — restored
      // or still-empty. Without this, undoing past the user's first edit
      // could land on whatever the canvas looked like a moment before restore
      // ran (see FabricBridge.resetHistory doc).
      b.resetHistory()
      b.zoomToFit()
      useDesignerStore.getState().setDirty(false)
    }, BRIDGE_READY_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [bridge, initialState, storageKey, deps.widthMm, deps.heightMm])
}
