import { createContext, useContext } from 'react'

export type ShowcaseMode = 'single' | 'stack'
export type ShowcaseAccent = 'indigo' | 'amber' | 'emerald' | 'rose' | 'bordeaux'

export const SHOWCASE_ACCENTS: readonly ShowcaseAccent[] = [
  'indigo', 'amber', 'emerald', 'rose', 'bordeaux',
] as const

/**
 * The composed page: one favorited variant per section type, plus the order in
 * which favorited sections stack on the preview page.
 */
export interface Composition {
  /** sectionId → favorited variantId (exactly one variant per section type). */
  favorites: Record<string, string>
  /** sectionIds in page order — only favorited sections appear here. */
  order: string[]
}

export const EMPTY_COMPOSITION: Composition = { favorites: {}, order: [] }

export interface ShowcaseState {
  variantId: string | null
  setVariantId: (id: string | null) => void
  mode: ShowcaseMode
  setMode: (m: ShowcaseMode) => void
  barHidden: boolean
  setBarHidden: (h: boolean) => void

  // ── Composition (favorites) ──────────────────────────────
  composition: Composition
  /** Toggle a variant's favorite. Re-hearting another variant of the same
   *  section swaps it (one per type); re-hearting the same one removes it. */
  toggleFavorite: (sectionId: string, variantId: string) => void
  /** Is this exact section+variant the current favorite? */
  isFavorite: (sectionId: string, variantId: string) => boolean
  /** The favorited variantId for a section, if any. */
  favoriteVariant: (sectionId: string) => string | undefined
  /** Replace the page order (drag-and-drop reorder). */
  reorderFavorites: (order: string[]) => void
  /** Drop all favorites. */
  clearFavorites: () => void
  /** Replace the whole composition (e.g. adopt a shared URL into the editor). */
  importComposition: (c: Composition) => void
}

export const ShowcaseContext = createContext<ShowcaseState | null>(null)

export function useShowcase(): ShowcaseState {
  const ctx = useContext(ShowcaseContext)
  if (!ctx) throw new Error('useShowcase must be used inside <ShowcaseProvider>')
  return ctx
}

// ── Persistence ────────────────────────────────────────────
const STORAGE_KEY = 'section-showcase:composition'

export function loadComposition(): Composition {
  if (typeof localStorage === 'undefined') return EMPTY_COMPOSITION
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_COMPOSITION
    const parsed = JSON.parse(raw) as Partial<Composition>
    if (!parsed.favorites || !Array.isArray(parsed.order)) return EMPTY_COMPOSITION
    return { favorites: parsed.favorites, order: parsed.order }
  } catch {
    return EMPTY_COMPOSITION
  }
}

export function saveComposition(c: Composition): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
  } catch {
    /* quota / private mode — favorites just won't persist */
  }
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
