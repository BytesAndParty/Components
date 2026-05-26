import { createContext, useContext } from 'react'
import type { CellarCanvasMessages } from './messages'

/**
 * Resolved messages (defaults + per-instance overrides) shared with every
 * cellar-canvas subcomponent. Created once in `CellarCanvas` via
 * `useComponentMessages(MESSAGES, overrides)` and provided through this
 * context so subcomponents don't need to receive `messages` as a prop.
 */
const MessagesContext = createContext<CellarCanvasMessages | null>(null)

export const MessagesProvider = MessagesContext.Provider

export function useCellarCanvasMessages(): CellarCanvasMessages {
  const ctx = useContext(MessagesContext)
  if (!ctx) {
    throw new Error(
      'useCellarCanvasMessages must be used inside <CellarCanvas>. ' +
      'Subcomponents are not exported for standalone use.',
    )
  }
  return ctx
}
