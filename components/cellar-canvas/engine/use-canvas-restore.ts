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
 * Re-runs when dimensions change (canvas is recreated) or when fullscreen
 * toggles (the wrapper resizes and the previous fit becomes stale).
 */
export function useCanvasRestore(
  bridge:       RefObject<FabricBridge | null>,
  initialState: CellarCanvasState | object | undefined,
  storageKey:   string | null,
  deps:         { widthMm: number; heightMm: number; isFullscreen: boolean }
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

      b.zoomToFit()
      useDesignerStore.getState().setDirty(false)
    }, BRIDGE_READY_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [bridge, initialState, storageKey, deps.widthMm, deps.heightMm, deps.isFullscreen])
}
