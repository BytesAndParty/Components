import React, { useState, ReactNode } from 'react'
import {
  HotkeysRegistryContext,
  HotkeysActionsContext,
  type HotkeyMetadata,
} from './hotkeys-context'

export function HotkeysProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Map<string, HotkeyMetadata>>(new Map())

  const register = useCallback((id: string, metadata: HotkeyMetadata) => {
    setRegistry(prev => {
      const next = new Map(prev)
      next.set(id, metadata)
      return next
    })
  }, [])

  const unregister = useCallback((id: string) => {
    setRegistry(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const registryValue = React.useMemo(() => ({ registry }), [registry])
  const actionsValue = React.useMemo(() => ({ register, unregister }), [register, unregister])

  return (
    <HotkeysRegistryContext.Provider value={registryValue}>
      <HotkeysActionsContext.Provider value={actionsValue}>
        {children}
      </HotkeysActionsContext.Provider>
    </HotkeysRegistryContext.Provider>
  )
}
