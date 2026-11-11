import { createContext, useContext, type RefObject } from 'react'

/**
 * Where the overlays of the components below mount (popovers, dialogs, select
 * lists). Without a provider they portal to `<body>`, which is right for a
 * normal page.
 *
 * A host that lifts itself above the page with its own stacking context (a
 * CSS-fullscreen editor at `z-index: 9999`) provides its own element instead:
 * overlays portaled to `<body>` would open behind it, invisible, and a modal
 * dialog would still block every click.
 *
 * Pass the result straight to Ark UI: `<Portal container={useOverlayContainer()}>`.
 */
const OverlayContainerContext = createContext<RefObject<HTMLElement | null> | undefined>(undefined)

export const OverlayContainerProvider = OverlayContainerContext.Provider

export function useOverlayContainer(): RefObject<HTMLElement | null> | undefined {
  return useContext(OverlayContainerContext)
}
