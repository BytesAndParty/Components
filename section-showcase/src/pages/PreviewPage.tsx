import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Check, ChevronLeft, Link2 } from 'lucide-react'
import { findSection } from '../sections/registry'
import { useShowcase } from '../showcase-state'
import { decodeComposition, encodeComposition } from '../composition-url'

export function PreviewPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { composition: stored, importComposition } = useShowcase()
  const [copied, setCopied] = useState(false)

  // The URL is the source of truth so the page is shareable; fall back to the
  // editor's stored composition when visited without a param.
  const param = searchParams.get('s')
  const fromUrl = param ? decodeComposition(param) : null
  const composition = fromUrl ?? stored

  // Canonicalize: if we fell back to stored state, write it into the URL so the
  // address bar (and the copied link) is always the shareable version.
  useEffect(() => {
    if (param || stored.order.length === 0) return
    const s = encodeComposition(stored)
    if (s) setSearchParams({ s }, { replace: true })
  }, [param, stored, setSearchParams])

  // Resolve the ordered favorites into renderable sections, skipping stale ids.
  const blocks = composition.order.flatMap(sectionId => {
    const section = findSection(sectionId)
    const variant = section?.variants.find(v => v.id === composition.favorites[sectionId])
    if (!section || !variant) return []
    return [{ key: sectionId, Component: variant.Component }]
  })

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked (insecure context / permission) — no-op */
    }
  }

  // Editing a shared link adopts its composition into the editor first, so the
  // visitor continues from what they were looking at.
  function edit() {
    if (fromUrl && fromUrl.order.length > 0) importComposition(fromUrl)
    navigate('/')
  }

  if (blocks.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl tracking-tight">Noch nichts zusammengestellt</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Markier ein paar Varianten mit dem Herz, dann erscheint hier deine Seite.
        </p>
        <Link
          to="/"
          className="border-border hover:border-accent/60 focus-visible:ring-accent/60 mt-2 rounded-lg border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Zum Showcase
        </Link>
      </div>
    )
  }

  return (
    <>
      {blocks.map(({ key, Component }) => (
        <Component key={key} />
      ))}

      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={edit}
          aria-label="Zurück zum Bearbeiten"
          title="Zurück zum Bearbeiten"
          className="border-border bg-elevated text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex items-center gap-1.5 rounded-full border py-2 pr-3.5 pl-2.5 text-sm shadow-lg shadow-black/20 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronLeft size={15} />
          Bearbeiten
        </button>

        <button
          type="button"
          onClick={copyLink}
          aria-label="Teilbaren Link kopieren"
          title="Link kopieren"
          className="border-border bg-elevated text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex items-center gap-1.5 rounded-full border py-2 pr-3.5 pl-2.5 text-sm shadow-lg shadow-black/20 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {copied ? <Check size={15} className="text-accent" /> : <Link2 size={15} />}
          {copied ? 'Kopiert' : 'Link'}
        </button>
      </div>
    </>
  )
}
