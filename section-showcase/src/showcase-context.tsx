import { useEffect, useState, type ReactNode } from 'react'
import { ShowcaseContext, type ShowcaseMode, type Composition } from './showcase-state'
import { loadComposition, saveComposition } from './showcase-state'
import { sections } from './sections/registry'

// Canonical page order — Hero first … Footer last, straight from the registry.
const REGISTRY_ORDER = sections.map(s => s.id)
const registryIndex = (id: string) => REGISTRY_ORDER.indexOf(id)

export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const [variantId, setVariantId] = useState<string | null>(null)
  const [mode, setMode] = useState<ShowcaseMode>('single')
  const [barHidden, setBarHidden] = useState(false)
  const [composition, setComposition] = useState<Composition>(loadComposition)

  // Persist the composition whenever it changes.
  useEffect(() => {
    saveComposition(composition)
  }, [composition])

  function toggleFavorite(sectionId: string, variantId: string) {
    setComposition(prev => {
      const current = prev.favorites[sectionId]
      // Re-hearting the same variant → remove the section's favorite.
      if (current === variantId) {
        const favorites = { ...prev.favorites }
        delete favorites[sectionId]
        return { favorites, order: prev.order.filter(id => id !== sectionId) }
      }
      // New favorite or swap to a different variant of the same section.
      const favorites = { ...prev.favorites, [sectionId]: variantId }
      if (prev.order.includes(sectionId)) {
        return { favorites, order: prev.order }
      }
      // Insert at the registry-correct slot so the default page reads
      // Hero → … → Footer; a manual drag afterwards still overrides this.
      const order = [...prev.order]
      const insertAt = order.filter(id => registryIndex(id) < registryIndex(sectionId)).length
      order.splice(insertAt, 0, sectionId)
      return { favorites, order }
    })
  }

  function isFavorite(sectionId: string, variantId: string) {
    return composition.favorites[sectionId] === variantId
  }

  function favoriteVariant(sectionId: string) {
    return composition.favorites[sectionId]
  }

  function reorderFavorites(order: string[]) {
    setComposition(prev => ({ ...prev, order }))
  }

  function clearFavorites() {
    setComposition({ favorites: {}, order: [] })
  }

  function importComposition(c: Composition) {
    setComposition(c)
  }

  return (
    <ShowcaseContext.Provider
      value={{
        variantId, setVariantId,
        mode, setMode,
        barHidden, setBarHidden,
        composition,
        toggleFavorite, isFavorite, favoriteVariant,
        reorderFavorites, clearFavorites, importComposition,
      }}
    >
      {children}
    </ShowcaseContext.Provider>
  )
}
