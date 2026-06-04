import { useState, type ReactNode } from 'react'
import { ShowcaseContext, type ShowcaseMode } from './showcase-state'

export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const [variantId, setVariantId] = useState<string | null>(null)
  const [mode, setMode] = useState<ShowcaseMode>('single')
  const [barHidden, setBarHidden] = useState(false)

  return (
    <ShowcaseContext.Provider
      value={{
        variantId, setVariantId,
        mode, setMode,
        barHidden, setBarHidden,
      }}
    >
      {children}
    </ShowcaseContext.Provider>
  )
}
