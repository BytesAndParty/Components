import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Eye, EyeOff, GripHorizontal, Layers, Moon, Square, Sun,
} from 'lucide-react'
import { useAtelier } from '@components/atelier'
import { sections, findSection } from '../sections/registry'
import {
  SHOWCASE_ACCENTS, accentSwatch, useShowcase,
} from '../showcase-context'

interface DragOffset { x: number; y: number }

export function CommandBar() {
  const { sectionId } = useParams()
  const section = sectionId ? findSection(sectionId) : null
  const navigate = useNavigate()
  const showcase = useShowcase()
  const atelier = useAtelier()

  const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 })
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false)
  const [sectionMenuDirection, setSectionMenuDirection] = useState<'up' | 'down'>('up')
  const sectionMenuRef = useRef<HTMLDivElement>(null)
  const sectionTriggerRef = useRef<HTMLButtonElement>(null)
  const dragStateRef = useRef<{ startX: number; startY: number; base: DragOffset } | null>(null)

  // Flip the section menu to open downward when there isn't enough space above
  // the trigger (e.g. user dragged the bar near the top of the viewport).
  // Estimated height covers index entry + divider + N section rows + padding.
  useLayoutEffect(() => {
    if (!sectionMenuOpen) return
    const trigger = sectionTriggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const estimatedHeight = (sections.length + 1) * 32 + 24
    const margin = 16
    setSectionMenuDirection(rect.top - margin < estimatedHeight ? 'down' : 'up')
  }, [sectionMenuOpen])

  // Close section menu on outside click
  useEffect(() => {
    if (!sectionMenuOpen) return
    function onDocPointerDown(e: PointerEvent) {
      if (!sectionMenuRef.current) return
      if (!sectionMenuRef.current.contains(e.target as Node)) {
        setSectionMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [sectionMenuOpen])

  // Section + variant navigation helpers
  const sectionIdx = section ? sections.findIndex(s => s.id === section.id) : -1
  function gotoSection(delta: 1 | -1) {
    if (sectionIdx < 0) return
    const next = sectionIdx + delta
    if (next < 0 || next >= sections.length) return
    navigate(`/${sections[next].id}`)
  }

  const variants = section?.variants ?? []
  const variantIdx = variants.findIndex(v => v.id === showcase.variantId)
  function gotoVariant(delta: 1 | -1) {
    if (variants.length === 0) return
    const next = variantIdx + delta
    if (next < 0 || next >= variants.length) return
    showcase.setVariantId(variants[next].id)
  }

  // Global hotkeys — defined as named handler so the effect's deps stay honest.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (t && (t.matches('input, textarea, select') || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case 'h':
        case 'H':
          e.preventDefault()
          showcase.setBarHidden(!showcase.barHidden)
          return
        case 'm':
        case 'M':
          if (!section) return
          e.preventDefault()
          showcase.setMode(showcase.mode === 'single' ? 'stack' : 'single')
          return
        case 'ArrowLeft':
          if (variants.length === 0) return
          e.preventDefault()
          gotoVariant(-1)
          return
        case 'ArrowRight':
          if (variants.length === 0) return
          e.preventDefault()
          gotoVariant(1)
          return
        case 'ArrowUp':
          if (sectionIdx < 0) return
          e.preventDefault()
          gotoSection(-1)
          return
        case 'ArrowDown':
          if (sectionIdx < 0) return
          e.preventDefault()
          gotoSection(1)
          return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcase.barHidden, showcase.mode, section?.id, variantIdx, sectionIdx, variants.length])

  // Drag — pointer events on the grip strip
  function onGripPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault()
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      base: offset,
    }
    function onMove(ev: PointerEvent) {
      const s = dragStateRef.current
      if (!s) return
      setOffset({ x: s.base.x + (ev.clientX - s.startX), y: s.base.y + (ev.clientY - s.startY) })
    }
    function onUp() {
      dragStateRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  if (showcase.barHidden) {
    return (
      <button
        type="button"
        onClick={() => showcase.setBarHidden(false)}
        aria-label="Showcase-Steuerung einblenden (H)"
        title="Einblenden (H)"
        className="border-border bg-card/85 text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 fixed right-4 bottom-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg shadow-black/20 backdrop-blur-xl transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Eye size={14} />
      </button>
    )
  }

  return (
    <div
      style={{ transform: `translate3d(calc(-50% + ${offset.x}px), ${offset.y}px, 0)` } satisfies CSSProperties}
      className="fixed bottom-6 left-1/2 z-50 select-none"
    >
      <div className="border-border bg-card/85 flex w-[min(94vw,760px)] flex-col rounded-2xl border shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div
          onPointerDown={onGripPointerDown}
          className="text-muted-foreground/40 flex h-6 cursor-grab items-center justify-center active:cursor-grabbing"
          aria-hidden="true"
        >
          <GripHorizontal size={14} />
        </div>

        <div className="flex flex-wrap items-center gap-2 px-3 pb-3 sm:flex-nowrap">
          <div ref={sectionMenuRef} className="relative">
            <button
              ref={sectionTriggerRef}
              type="button"
              onClick={() => setSectionMenuOpen(o => !o)}
              aria-expanded={sectionMenuOpen}
              aria-haspopup="menu"
              className="border-border bg-background/60 hover:border-accent/40 focus-visible:ring-accent/60 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="font-display tracking-tight">{section?.label ?? 'Übersicht'}</span>
              <ChevronDown size={12} className={`transition-transform ${sectionMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {sectionMenuOpen && (
              <div
                role="menu"
                className={`border-border bg-card/95 absolute left-0 w-60 overflow-hidden rounded-xl border p-1.5 shadow-xl backdrop-blur-xl ${
                  sectionMenuDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                }`}
              >
                <Link
                  to="/"
                  role="menuitem"
                  onClick={() => setSectionMenuOpen(false)}
                  className={`hover:bg-muted flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                    !section ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Übersicht
                  <span className="text-muted-foreground/70 text-[10px] tracking-wider uppercase">Index</span>
                </Link>
                <div className="bg-border/60 my-1 h-px" />
                {sections.map(s => (
                  <Link
                    key={s.id}
                    to={`/${s.id}`}
                    role="menuitem"
                    onClick={() => setSectionMenuOpen(false)}
                    className={`hover:bg-muted flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                      section?.id === s.id ? 'bg-muted/60 text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                    <span className="text-muted-foreground/70 text-[10px] tabular-nums">{s.variants.length}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {section && (
            <>
              <div className="bg-border hidden h-5 w-px sm:block" />

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => gotoVariant(-1)}
                  disabled={variantIdx <= 0}
                  aria-label="Vorherige Variante (←)"
                  title="Vorherige Variante (←)"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex flex-wrap items-center gap-1">
                  {section.variants.map(v => {
                    const active = showcase.variantId === v.id
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => showcase.setVariantId(v.id)}
                        aria-pressed={active}
                        title={v.description ?? v.label}
                        className={`focus-visible:ring-accent/60 rounded-md px-2.5 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                          active
                            ? 'bg-foreground text-background'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {v.label}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => gotoVariant(1)}
                  disabled={variantIdx < 0 || variantIdx >= variants.length - 1}
                  aria-label="Nächste Variante (→)"
                  title="Nächste Variante (→)"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="bg-border hidden h-5 w-px sm:block" />

              <button
                type="button"
                onClick={() => showcase.setMode(showcase.mode === 'single' ? 'stack' : 'single')}
                aria-pressed={showcase.mode === 'stack'}
                aria-label={showcase.mode === 'single' ? 'Alle Varianten zeigen (M)' : 'Einzeln zeigen (M)'}
                title={showcase.mode === 'single' ? 'Alle untereinander (M)' : 'Einzeln (M)'}
                className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md border p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {showcase.mode === 'single' ? <Layers size={14} /> : <Square size={14} />}
              </button>
            </>
          )}

          <div className="flex-1" />

          <div className="border-border flex items-center gap-1 rounded-full border p-1">
            {SHOWCASE_ACCENTS.map(a => {
              const active = atelier.accent === a
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => atelier.setAccent(a)}
                  aria-label={`Akzent ${a}`}
                  aria-pressed={active}
                  className={`focus-visible:ring-accent/60 h-3.5 w-3.5 rounded-full transition-transform focus-visible:ring-2 focus-visible:outline-none ${
                    active ? 'ring-foreground/40 ring-offset-card scale-110 ring-1 ring-offset-2' : ''
                  }`}
                  style={{ background: accentSwatch(a) }}
                />
              )
            })}
          </div>

          <button
            type="button"
            onClick={atelier.toggleTheme}
            aria-label="Theme umschalten"
            title="Theme"
            className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md border p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {atelier.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            type="button"
            onClick={() => showcase.setBarHidden(true)}
            aria-label="Steuerung ausblenden (H)"
            title="Ausblenden (H)"
            className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 rounded-md border p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <EyeOff size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
