import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router'
import { findSection } from '../sections/registry'
import { useShowcase } from '../showcase-context'

export function SectionPage() {
  const { sectionId } = useParams()
  const section = sectionId ? findSection(sectionId) : undefined
  const { mode, variantId, setVariantId } = useShowcase()

  // Reset variant to the section's first when the URL section changes (or when
  // the current variantId is foreign to this section's variant list).
  const firstVariantId = section?.variants[0]?.id ?? null
  const variantIsKnown = !!section?.variants.some(v => v.id === variantId)
  useEffect(() => {
    if (firstVariantId && !variantIsKnown) {
      setVariantId(firstVariantId)
    }
  }, [firstVariantId, variantIsKnown, setVariantId])

  if (!section) return <Navigate to="/" replace />

  const active = section.variants.find(v => v.id === variantId) ?? section.variants[0]

  if (mode === 'stack') {
    return (
      <div className="pb-32">
        {section.variants.map(v => (
          <article key={v.id} className="border-border border-b">
            <header className="mx-auto max-w-7xl px-6 pt-10 pb-3">
              <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                Variante
              </p>
              <h3 className="font-display text-xl">{v.label}</h3>
              {v.description && (
                <p className="text-muted-foreground mt-1 max-w-xl text-sm">{v.description}</p>
              )}
            </header>
            <v.Component />
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="pb-32">
      <active.Component />
    </div>
  )
}
