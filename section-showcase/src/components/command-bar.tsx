import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import {
  ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight,
  Eye, EyeOff, GripHorizontal, Heart, Layers, Moon, SlidersHorizontal, Square, Sun, X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useAtelier } from '@components/atelier'
import { HeartLike } from '@components/heart-like/heart-like'
import { runViewTransition } from '@components/view-transition/run-view-transition'
import { sections, findSection } from '../sections/registry'
import {
  SHOWCASE_ACCENTS, accentSwatch, useShowcase,
} from '../showcase-state'
import { encodeComposition } from '../composition-url'
import { CompositionTray } from './composition-tray'

// Reserved view-transition-names keep the floating bar (and its hidden-state
// toggle) out of the document-level root crossfade when a variant slide runs.
const PIN_BAR_STYLE = { viewTransitionName: 'showcase-command-bar' } as CSSProperties
const PIN_HIDDEN_TOGGLE_STYLE = { viewTransitionName: 'showcase-command-bar-toggle' } as CSSProperties

interface DragOffset { x: number; y: number }

export function CommandBar() {
  const { sectionId } = useParams()
  const section = sectionId ? findSection(sectionId) : null
  const navigate = useNavigate()
  const showcase = useShowcase()
  const atelier = useAtelier()

  const location = useLocation()
  const isPreview = location.pathname === '/preview'

  const reduceMotion = useReducedMotion()
  const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 })
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false)
  const [sectionMenuDirection, setSectionMenuDirection] = useState<'up' | 'down'>('up')
  const [trayOpen, setTrayOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const sectionMenuRef = useRef<HTMLDivElement>(null)
  const sectionTriggerRef = useRef<HTMLButtonElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{ startX: number; startY: number; base: DragOffset } | null>(null)

  // Active variant the heart toggles — the one on screen in single mode.
  const activeVariantId = showcase.variantId ?? section?.variants[0]?.id ?? null
  const favoriteCount = showcase.composition.order.length

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

  // Close favorites tray on outside click
  useEffect(() => {
    if (!trayOpen) return
    function onDocPointerDown(e: PointerEvent) {
      if (!trayRef.current) return
      if (!trayRef.current.contains(e.target as Node)) {
        setTrayOpen(false)
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [trayOpen])

  // Mobile control panel: close on Escape, lock body scroll while open.
  useEffect(() => {
    if (!panelOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPanelOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [panelOpen])

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

  // The design each section is currently set to — shown in the section menus so
  // you always see the active/chosen variant, not just a count. The active
  // section reflects the live variant on screen; others show their favorited
  // design (falling back to the default first variant). `chosen` marks the label
  // in accent when it equals the section's favorite (i.e. it's part of the page).
  function currentDesign(s: (typeof sections)[number]) {
    const isActive = s.id === section?.id
    const vId = isActive
      ? showcase.variantId ?? s.variants[0]?.id
      : showcase.favoriteVariant(s.id) ?? s.variants[0]?.id
    const variant = s.variants.find(v => v.id === vId) ?? s.variants[0]
    return { label: variant?.label ?? '', chosen: !!variant && showcase.favoriteVariant(s.id) === variant.id }
  }

  // Direction-aware view transition for variant swaps.
  // delta < 0 → previous variant: new slides in from the LEFT (vt-slide-right).
  // delta > 0 → next variant: new slides in from the RIGHT (vt-slide-left).
  // Stack mode shows all variants at once, so the slide is unnecessary.
  function switchVariant(nextId: string, delta: number) {
    if (delta === 0 || showcase.mode === 'stack') {
      showcase.setVariantId(nextId)
      return
    }
    const preset = delta < 0 ? 'vt-slide-right' : 'vt-slide-left'
    runViewTransition(preset, () => showcase.setVariantId(nextId))
  }

  function gotoVariant(delta: 1 | -1) {
    if (variants.length === 0) return
    const next = variantIdx + delta
    if (next < 0 || next >= variants.length) return
    switchVariant(variants[next].id, delta)
  }

  function openPreview() {
    setPanelOpen(false)
    const s = encodeComposition(showcase.composition)
    navigate(s ? `/preview?s=${s}` : '/preview')
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

  // The preview route renders the composed page chrome-free; it carries its
  // own "back to edit" control, so the command bar steps aside entirely.
  if (isPreview) return null

  if (showcase.barHidden) {
    return (
      <button
        type="button"
        onClick={() => showcase.setBarHidden(false)}
        aria-label="Showcase-Steuerung einblenden (H)"
        title="Einblenden (H)"
        style={PIN_HIDDEN_TOGGLE_STYLE}
        className="border-border bg-card/85 text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 fixed right-4 bottom-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg shadow-black/20 backdrop-blur-xl transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
      >
        <Eye size={14} />
      </button>
    )
  }

  return (
    <>
    {/* ---------- Desktop / tablet: floating bottom bar (sm and up) ---------- */}
    <div
      style={{
        transform: `translate3d(calc(-50% + ${offset.x}px), ${offset.y}px, 0)`,
        ...PIN_BAR_STYLE,
      } satisfies CSSProperties}
      className="fixed bottom-6 left-1/2 z-50 hidden select-none sm:block"
    >
      <div className="border-border bg-card/85 flex w-[min(96vw,900px)] flex-col rounded-2xl border shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div
          onPointerDown={onGripPointerDown}
          className="text-muted-foreground/40 flex h-6 cursor-grab items-center justify-center active:cursor-grabbing"
          aria-hidden="true"
        >
          <GripHorizontal size={14} />
        </div>

        <div className="flex items-center justify-start gap-2 px-3 pb-3">
          <div ref={sectionMenuRef} className="relative">
            <button
              ref={sectionTriggerRef}
              type="button"
              onClick={() => setSectionMenuOpen(o => !o)}
              aria-expanded={sectionMenuOpen}
              aria-haspopup="menu"
              className="border-border bg-background/60 hover:border-accent/40 focus-visible:ring-accent/60 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:min-h-11"
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
                {sections.map(s => {
                  const d = currentDesign(s)
                  return (
                  <Link
                    key={s.id}
                    to={`/${s.id}`}
                    role="menuitem"
                    onClick={() => setSectionMenuOpen(false)}
                    className={`hover:bg-muted flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                      section?.id === s.id ? 'bg-muted/60 text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="shrink-0">{s.label}</span>
                    <span className={`truncate text-[10px] tracking-wider uppercase ${d.chosen ? 'text-accent' : 'text-muted-foreground/60'}`}>
                      {d.label}
                    </span>
                  </Link>
                  )
                })}
              </div>
            )}
          </div>

          {section && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showcase.setMode(showcase.mode === 'single' ? 'stack' : 'single')}
                aria-pressed={showcase.mode === 'stack'}
                aria-label={showcase.mode === 'single' ? 'Alle Varianten zeigen (M)' : 'Einzeln zeigen (M)'}
                title={showcase.mode === 'single' ? 'Alle untereinander (M)' : 'Einzeln (M)'}
                className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex items-center justify-center rounded-md border p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
              >
                {showcase.mode === 'single' ? <Layers size={14} /> : <Square size={14} />}
              </button>

              {activeVariantId && (
                <HeartLike
                  size={22}
                  checked={showcase.isFavorite(section.id, activeVariantId)}
                  onChange={() => showcase.toggleFavorite(section.id, activeVariantId)}
                />
              )}
            </div>
          )}

          <div className="hidden flex-1 sm:block" />

          <div className="flex items-center gap-2">
            <div ref={trayRef} className="relative">
              <button
                type="button"
                onClick={() => setTrayOpen(o => !o)}
                aria-expanded={trayOpen}
                aria-haspopup="dialog"
                aria-label={`Favoriten (${favoriteCount})`}
                title="Deine Seite"
                className="border-border hover:border-accent/40 focus-visible:ring-accent/60 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:min-h-11"
              >
                <Heart
                  size={14}
                  className={favoriteCount > 0 ? 'text-accent fill-accent' : 'text-muted-foreground'}
                />
                <span className="tabular-nums">{favoriteCount}</span>
              </button>
              {trayOpen && <CompositionTray onClose={() => setTrayOpen(false)} />}
            </div>

            <div className="bg-border hidden h-5 w-px sm:block" />

            <div className="border-border flex items-center gap-1 rounded-full border p-1 max-sm:gap-1.5 max-sm:p-1.5">
              {SHOWCASE_ACCENTS.map(a => {
                const active = atelier.accent === a
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => atelier.setAccent(a)}
                    aria-label={`Akzent ${a}`}
                    aria-pressed={active}
                    className={`focus-visible:ring-accent/60 h-3.5 w-3.5 rounded-full transition-transform focus-visible:ring-2 focus-visible:outline-none max-sm:h-5 max-sm:w-5 ${
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
              className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex items-center justify-center rounded-md border p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
            >
              {atelier.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <button
              type="button"
              onClick={() => showcase.setBarHidden(true)}
              aria-label="Steuerung ausblenden (H)"
              title="Ausblenden (H)"
              className="border-border text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex items-center justify-center rounded-md border p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
            >
              <EyeOff size={14} />
            </button>
          </div>
        </div>

        {section && (
          <div className="border-border flex items-center gap-1 border-t px-3 py-2.5">
            <button
              type="button"
              onClick={() => gotoVariant(-1)}
              disabled={variantIdx <= 0}
              aria-label="Vorherige Variante (←)"
              title="Vorherige Variante (←)"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex shrink-0 items-center justify-center rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 max-sm:h-11 max-sm:w-11"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
              {section.variants.map((v, idx) => {
                const active = showcase.variantId === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => switchVariant(v.id, idx - variantIdx)}
                    aria-pressed={active}
                    title={v.description ?? v.label}
                    className={`focus-visible:ring-accent/60 shrink-0 rounded-md px-3 py-1.5 text-xs whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:py-2.5 ${
                      active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
              className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex shrink-0 items-center justify-center rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 max-sm:h-11 max-sm:w-11"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>

    {/* ---------- Mobile: launcher + slide-in side panel (below sm) ---------- */}
    <div className="sm:hidden">
      {!panelOpen && (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          aria-label="Showcase-Steuerung öffnen"
          className="border-border bg-card/85 text-foreground focus-visible:ring-accent/60 fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg shadow-black/25 backdrop-blur-xl focus-visible:ring-2 focus-visible:outline-none"
        >
          <SlidersHorizontal size={18} />
          {favoriteCount > 0 && (
            <span className="bg-accent text-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums">
              {favoriteCount}
            </span>
          )}
        </button>
      )}

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              aria-hidden
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Showcase-Steuerung"
              initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 34 }}
              className="border-border bg-card/95 fixed inset-y-0 right-0 z-50 flex w-[min(86vw,340px)] flex-col overflow-y-auto border-l shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              <div className="border-border bg-card/95 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 backdrop-blur-xl">
                <span className="font-display text-sm tracking-tight">Steuerung</span>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  aria-label="Schließen"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-6 p-4">
                {/* Section */}
                <div>
                  <p className="text-muted-foreground/70 mb-2 text-[10px] font-medium tracking-wider uppercase">Section</p>
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/"
                      onClick={() => setPanelOpen(false)}
                      className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-sm transition-colors ${!section ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}
                    >
                      Übersicht
                      <span className="text-muted-foreground/70 text-[10px] tracking-wider uppercase">Index</span>
                    </Link>
                    {sections.map(s => {
                      const d = currentDesign(s)
                      return (
                      <Link
                        key={s.id}
                        to={`/${s.id}`}
                        onClick={() => setPanelOpen(false)}
                        className={`flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors ${section?.id === s.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}
                      >
                        <span className="shrink-0">{s.label}</span>
                        <span className={`truncate text-[10px] tracking-wider uppercase ${d.chosen ? 'text-accent' : 'text-muted-foreground/60'}`}>
                          {d.label}
                        </span>
                      </Link>
                      )
                    })}
                  </div>
                </div>

                {section && (
                  <>
                    {/* Variants */}
                    <div>
                      <p className="text-muted-foreground/70 mb-2 text-[10px] font-medium tracking-wider uppercase">Variante</p>
                      <div className="flex flex-wrap gap-1.5">
                        {section.variants.map((v, idx) => {
                          const active = showcase.variantId === v.id
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => switchVariant(v.id, idx - variantIdx)}
                              aria-pressed={active}
                              className={`inline-flex min-h-11 items-center rounded-lg border px-3 text-xs transition-colors ${active ? 'border-accent bg-foreground text-background' : 'border-border text-muted-foreground hover:text-foreground'}`}
                            >
                              {v.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* View mode */}
                    <div>
                      <p className="text-muted-foreground/70 mb-2 text-[10px] font-medium tracking-wider uppercase">Ansicht</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => showcase.setMode('single')}
                          aria-pressed={showcase.mode === 'single'}
                          className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${showcase.mode === 'single' ? 'border-accent bg-foreground text-background' : 'border-border text-muted-foreground'}`}
                        >
                          <Square size={15} /> Einzeln
                        </button>
                        <button
                          type="button"
                          onClick={() => showcase.setMode('stack')}
                          aria-pressed={showcase.mode === 'stack'}
                          className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${showcase.mode === 'stack' ? 'border-accent bg-foreground text-background' : 'border-border text-muted-foreground'}`}
                        >
                          <Layers size={15} /> Alle
                        </button>
                      </div>
                    </div>

                    {/* Favorite current variant */}
                    {activeVariantId && (
                      <button
                        type="button"
                        onClick={() => showcase.toggleFavorite(section.id, activeVariantId)}
                        aria-pressed={showcase.isFavorite(section.id, activeVariantId)}
                        className="border-border text-muted-foreground hover:text-foreground flex min-h-11 items-center justify-center gap-2 rounded-lg border text-sm transition-colors"
                      >
                        <Heart size={15} className={showcase.isFavorite(section.id, activeVariantId) ? 'text-accent fill-accent' : 'text-muted-foreground'} />
                        {showcase.isFavorite(section.id, activeVariantId) ? 'Favorit — gemerkt' : 'Als Favorit merken'}
                      </button>
                    )}
                  </>
                )}

                {/* Accent */}
                <div>
                  <p className="text-muted-foreground/70 mb-2 text-[10px] font-medium tracking-wider uppercase">Akzent</p>
                  <div className="flex flex-wrap gap-2">
                    {SHOWCASE_ACCENTS.map(a => {
                      const active = atelier.accent === a
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => atelier.setAccent(a)}
                          aria-label={`Akzent ${a}`}
                          aria-pressed={active}
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform ${active ? 'ring-foreground/40 ring-offset-card scale-110 ring-2 ring-offset-2' : ''}`}
                          style={{ background: accentSwatch(a) }}
                        >
                          {active && <Check size={14} className="text-background" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Theme */}
                <button
                  type="button"
                  onClick={atelier.toggleTheme}
                  className="border-border text-muted-foreground hover:text-foreground flex min-h-11 items-center justify-center gap-2 rounded-lg border text-sm transition-colors"
                >
                  {atelier.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  {atelier.theme === 'dark' ? 'Helles Theme' : 'Dunkles Theme'}
                </button>
              </div>

              {/* Footer: preview composed page */}
              <div className="border-border bg-card/95 sticky bottom-0 z-10 mt-auto border-t p-4 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={openPreview}
                  disabled={favoriteCount === 0}
                  className="bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-accent/60 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-40"
                >
                  Deine Seite ({favoriteCount}) ansehen
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
    </>
  )
}
