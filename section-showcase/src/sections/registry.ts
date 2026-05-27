import { heroSection } from './hero/manifest'
import { featuresSection } from './features/manifest'
import { showcaseSection } from './showcase/manifest'
import { ctaSection } from './cta/manifest'
import { pricingSection } from './pricing/manifest'
import { timelineSection } from './timeline/manifest'
import type { SectionDef } from './types'

/**
 * Central section registry. Add new sections here.
 * Each section ships its own manifest (id, label, variants).
 */
export const sections: SectionDef[] = [
  heroSection,
  featuresSection,
  showcaseSection,
  ctaSection,
  pricingSection,
  timelineSection,
]

export function findSection(id: string): SectionDef | undefined {
  return sections.find(s => s.id === id)
}
