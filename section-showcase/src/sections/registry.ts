import { navSection } from './nav/manifest'
import { heroSection } from './hero/manifest'
import { featuresSection } from './features/manifest'
import { showcaseSection } from './showcase/manifest'
import { storeSection } from './store/manifest'
import { ctaSection } from './cta/manifest'
import { pricingSection } from './pricing/manifest'
import { timelineSection } from './timeline/manifest'
import { testimonialsSection } from './testimonials/manifest'
import { gallerySection } from './gallery/manifest'
import { footerSection } from './footer/manifest'
import type { SectionDef } from './types'

/**
 * Central section registry. Add new sections here.
 * Each section ships its own manifest (id, label, variants).
 */
export const sections: SectionDef[] = [
  navSection,
  heroSection,
  featuresSection,
  showcaseSection,
  storeSection,
  ctaSection,
  pricingSection,
  timelineSection,
  testimonialsSection,
  gallerySection,
  footerSection,
]

export function findSection(id: string): SectionDef | undefined {
  return sections.find(s => s.id === id)
}
