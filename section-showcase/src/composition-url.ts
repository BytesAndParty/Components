import { findSection } from './sections/registry'
import { EMPTY_COMPOSITION, type Composition } from './showcase-state'

/**
 * URL codec for a composition. The order is carried by the param itself —
 * an ordered list of `sectionId:variantId` pairs — so a single string encodes
 * both the chosen variant per section and the page order:
 *
 *   hero:v4,features:v2,footer:v3
 *
 * Colons and commas are valid query sub-delimiters, so the link stays readable.
 */
export function encodeComposition(c: Composition): string {
  return c.order
    .map(id => {
      const variantId = c.favorites[id]
      return variantId ? `${id}:${variantId}` : null
    })
    .filter((pair): pair is string => pair !== null)
    .join(',')
}

/**
 * Parse a composition param back into state, validating every pair against the
 * registry. Unknown sections/variants are dropped (stale or hand-edited links
 * degrade to whatever still resolves), and one-variant-per-section is enforced
 * (first occurrence wins).
 */
export function decodeComposition(param: string | null): Composition {
  if (!param) return EMPTY_COMPOSITION
  const order: string[] = []
  const favorites: Record<string, string> = {}
  for (const pair of param.split(',')) {
    const [sectionId, variantId] = pair.split(':')
    if (!sectionId || !variantId) continue
    if (favorites[sectionId]) continue
    const section = findSection(sectionId)
    if (!section?.variants.some(v => v.id === variantId)) continue
    favorites[sectionId] = variantId
    order.push(sectionId)
  }
  return { favorites, order }
}
