import React, { createContext, useContext } from 'react'
import {
  normalizeHotkey,
  useHotkey,
  type RegisterableHotkeyChord,
  type UseHotkeyChordOptions,
} from '@tanstack/react-hotkeys'
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

/**
 * Wraps TanStack useHotkey, registers metadata for ShortcutOverview, and auto-disables on touch devices.
 * Takes one chord: a string (`'Mod+K'`) or a RawHotkeyChord object (`{ key: 'K', mod: true }`).
 */
export function useDesignEngineHotkey(
  key: RegisterableHotkeyChord,
  callback: (event: KeyboardEvent) => void,
  metadata: Omit<HotkeyMetadata, 'key'>,
  options?: UseHotkeyChordOptions
) {
  const { register, unregister } = useHotkeysActions()
  const { hasFinePointer } = useDeviceCapabilities()
  const id = React.useId()

  useHotkey(key, callback, { ...options, enabled: hasFinePointer && (options?.enabled ?? true) })

  // `key` may be an inline object literal — depend on the normalized chord
  // string (e.g. 'Mod+Shift+Z') so re-renders don't churn the registration.
  const displayKey = normalizeHotkey(key)

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
