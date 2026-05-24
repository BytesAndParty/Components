import { heroSection } from './hero/manifest'
import type { SectionDef } from './types'

/**
 * Central section registry. Add new sections here.
 * Each section ships its own manifest (id, label, variants).
 */
export const sections: SectionDef[] = [
  heroSection,
]

export function findSection(id: string): SectionDef | undefined {
  return sections.find(s => s.id === id)
}
