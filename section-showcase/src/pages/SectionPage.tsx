import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { findSection } from '../sections/registry'

type ViewMode = 'single' | 'stack'

export function SectionPage() {
  const { sectionId } = useParams()
  const section = sectionId ? findSection(sectionId) : undefined

  const [activeId, setActiveId] = useState(section?.variants[0]?.id)
  const [mode, setMode] = useState<ViewMode>('single')

  if (!section) return <Navigate to="/" replace />

  const active = section.variants.find(v => v.id === activeId) ?? section.variants[0]

  return (
    <div>
      {/* Variant control bar */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Section
            </p>
            <h2 className="font-display text-lg leading-tight">{section.label}</h2>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            <ModeButton current={mode} value="single" onClick={() => setMode('single')}>
              Einzeln
            </ModeButton>
            <ModeButton current={mode} value="stack" onClick={() => setMode('stack')}>
              Alle untereinander
            </ModeButton>
          </div>

          {mode === 'single' && (
            <div className="flex flex-wrap gap-1">
              {section.variants.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active.id === v.id
                      ? 'bg-foreground text-background'
                      : 'border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Variant render */}
      {mode === 'single' ? (
        <VariantBlock label={active.label} description={active.description}>
          <active.Component />
        </VariantBlock>
      ) : (
        section.variants.map(v => (
          <VariantBlock key={v.id} label={v.label} description={v.description}>
            <v.Component />
          </VariantBlock>
        ))
      )}
    </div>
  )
}

function VariantBlock({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <article className="border-b border-border">
      <header className="mx-auto max-w-7xl px-6 pb-2 pt-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Variante
        </p>
        <h3 className="font-display text-xl">{label}</h3>
        {description && (
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
        )}
      </header>
      {children}
    </article>
  )
}

function ModeButton({
  current,
  value,
  onClick,
  children,
}: {
  current: ViewMode
  value: ViewMode
  onClick: () => void
  children: React.ReactNode
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded px-3 py-1 text-xs transition-colors ${
        active
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
