import React, { createContext, useContext } from 'react'
import { useHotkey, HotkeyOptions } from '@tanstack/react-hotkeys'
import { useDeviceCapabilities } from '../lib/use-device-capabilities'

export interface HotkeyMetadata {
  key: string
  label: string
  description?: string
  category: 'Global' | 'Navigation' | 'Actions' | 'Context'
}

interface HotkeysRegistryContextValue {
  registry: Map<string, HotkeyMetadata>
}

interface HotkeysActionsContextValue {
  register: (id: string, metadata: HotkeyMetadata) => void
  unregister: (id: string) => void
}

export const HotkeysRegistryContext = createContext<HotkeysRegistryContextValue | null>(null)
export const HotkeysActionsContext = createContext<HotkeysActionsContextValue | null>(null)

export function useHotkeysRegistry() {
  const context = useContext(HotkeysRegistryContext)
  if (!context) {
    throw new Error('useHotkeysRegistry must be used within a HotkeysProvider')
  }
  return context
}

function useHotkeysActions() {
  const context = useContext(HotkeysActionsContext)
  if (!context) {
    throw new Error('useHotkeysActions must be used within a HotkeysProvider')
  }
  return context
}

type RegisterableHotkey = Parameters<typeof useHotkey>[0]

/**
 * Display string for the ShortcutOverview. Handles the string syntax and the
 * RawHotkey object form (kept as a general escape hatch for keys the string
 * syntax cannot express).
 */
function hotkeyDisplayString(key: RegisterableHotkey): string {
  if (typeof key === 'string') return key
  return [
    key.mod && 'Mod',
    key.ctrl && 'Control',
    key.shift && 'Shift',
    key.alt && 'Alt',
    key.meta && 'Meta',
    key.key,
  ].filter(Boolean).join('+')
}

/** Wraps TanStack useHotkey, registers metadata for ShortcutOverview, and auto-disables on touch devices. */
export function useDesignEngineHotkey(
  key: RegisterableHotkey,
  callback: (event: KeyboardEvent) => void,
  metadata: Omit<HotkeyMetadata, 'key'>,
  options?: HotkeyOptions
) {
  const { register, unregister } = useHotkeysActions()
  const { hasFinePointer } = useDeviceCapabilities()
  const id = React.useId()

  useHotkey(key, callback, { ...options, enabled: hasFinePointer && (options?.enabled ?? true) })

  // `key` may be an inline object literal — depend on the derived display
  // string so re-renders don't churn the registration.
  const displayKey = hotkeyDisplayString(key)

  // Decompose `metadata` deps so callers can pass new object literals
  // without triggering re-registration. The rule wants the whole
  // `metadata` object as a dep, but that would un-stabilize every
  // call site that builds metadata inline.
  React.useEffect(() => {
    if (!hasFinePointer) return
    register(id, { key: displayKey, ...metadata })
    return () => unregister(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, displayKey, metadata.label, metadata.description, metadata.category, register, unregister, hasFinePointer])
}
