import { createContext, useContext, useState, type ReactNode } from 'react'

export type ShowcaseMode = 'single' | 'stack'
export type ShowcaseAccent = 'indigo' | 'amber' | 'emerald' | 'rose' | 'bordeaux'

export const SHOWCASE_ACCENTS: readonly ShowcaseAccent[] = [
  'indigo', 'amber', 'emerald', 'rose', 'bordeaux',
] as const

interface ShowcaseState {
  variantId: string | null
  setVariantId: (id: string | null) => void
  mode: ShowcaseMode
  setMode: (m: ShowcaseMode) => void
  barHidden: boolean
  setBarHidden: (h: boolean) => void
}

const ShowcaseContext = createContext<ShowcaseState | null>(null)

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

export function useShowcase(): ShowcaseState {
  const ctx = useContext(ShowcaseContext)
  if (!ctx) throw new Error('useShowcase must be used inside <ShowcaseProvider>')
  return ctx
}

export function accentSwatch(a: ShowcaseAccent): string {
  switch (a) {
    case 'indigo':   return 'oklch(0.585 0.233 277)'
    case 'amber':    return 'oklch(0.555 0.146 49)'
    case 'emerald':  return 'oklch(0.511 0.086 186.4)'
    case 'rose':     return 'oklch(0.585 0.22 5)'
    case 'bordeaux': return 'oklch(0.42 0.15 18)'
  }
}
