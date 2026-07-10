import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router'
import { TransitionStage } from '@components/view-transition/transition-stage'
import { HeartLike } from '@components/heart-like/heart-like'
import { findSection } from '../sections/registry'
import { useShowcase } from '../showcase-state'

export function SectionPage() {
  const { sectionId } = useParams()
  const section = sectionId ? findSection(sectionId) : undefined
  const { mode, variantId, setVariantId, isFavorite, toggleFavorite } = useShowcase()

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
          // data-stack-variant: Sprungziel für die Varianten-Chips der Command-Bar.
          <article key={v.id} data-stack-variant={v.id} className="border-border border-b">
            <header className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-6 pt-10 pb-3">
              <div>
                <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                  Variante
                </p>
                <h3 className="font-display text-xl">{v.label}</h3>
                {v.description && (
                  <p className="text-muted-foreground mt-1 max-w-xl text-sm">{v.description}</p>
                )}
              </div>
              <HeartLike
                size={24}
                checked={isFavorite(section.id, v.id)}
                onChange={() => toggleFavorite(section.id, v.id)}
              />
            </header>
            <v.Component />
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="pb-32">
      <TransitionStage name="vt-stage" nesting="nearest">
        <active.Component />
      </TransitionStage>
    </div>
  )
}
