import { useEffect } from 'react'
import { Portal } from '@ark-ui/react/portal'
import { Tour, useTour, type TourIntlTranslations } from '@ark-ui/react/tour'

// Ark UI v5 doesn't re-export StatusChangeDetails; inline the shape (sourced from @zag-js/tour 1.40.0).
type StatusChangeDetails = { status: 'idle' | 'started' | 'skipped' | 'completed' | 'dismissed' | 'not-found' }
import { X } from 'lucide-react'
import { interpolate } from '../../../i18n'
import { useCellarCanvasMessages } from '../../messages-context'
import { useDesignerStore } from '../../store/designer-store'
import { cn } from '../../../lib/utils'

export interface OnboardingTourProps {
  /** When true, the tour never auto-starts. Manual restarts still work. */
  disabled?: boolean
  /**
   * localStorage key for the "tour completed" flag. Pass `null` to opt out of
   * persistence (e.g. for tests). Default: `'cellar-canvas-tour-completed'`.
   */
  storageKey?: string | null
  /**
   * Whether the final "save" step is part of the tour. The save button only
   * renders when the host passes `onSave` — without it the step's
   * `[data-tour="save-button"]` target does not exist and Zag aborts the
   * tour with a `not-found` status. Default: true.
   */
  includeSaveStep?: boolean
}

const DEFAULT_STORAGE_KEY = 'cellar-canvas-tour-completed'

// Stacking for backdrop, spotlight and positioner, as Zag's docs prescribe:
// Zag sets `--tour-layer` per part (0, 1, 2) and gives tooltip steps an inline
// `z-index: calc(var(--tour-layer) + var(--tour-z-index))` on the positioner,
// which overrides any z-index class. 10000 keeps the tour above CellarCanvas's
// fullscreen shell (inline z-index 9999).
const TOUR_Z_INDEX = '[--tour-z-index:10000] z-[calc(var(--tour-layer)_+_var(--tour-z-index))]'

/**
 * First-run guided tour. Five steps walking new users through canvas,
 * wine-fields tab, layer panel and save button. Steps target DOM nodes
 * via `[data-tour]` attributes — see `CanvasHeader.tsx` and `RightPanel.tsx`.
 *
 * Auto-starts on mount unless `disabled` or the localStorage flag is set.
 * Completing or skipping the tour writes the flag, so the next mount stays
 * quiet.
 */
export function OnboardingTour({
  disabled = false,
  storageKey = DEFAULT_STORAGE_KEY,
  includeSaveStep = true,
}: OnboardingTourProps) {
  const m = useCellarCanvasMessages()

  const steps = [
    {
      id:          'welcome',
      type:        'dialog' as const,
      title:       m.tourWelcomeTitle,
      description: m.tourWelcomeBody,
    },
    {
      id:          'canvas',
      type:        'floating' as const,
      target:      () => document.querySelector<HTMLElement>('[data-tour="canvas-area"]'),
      placement:   'center' as const,
      title:       m.tourCanvasTitle,
      description: m.tourCanvasBody,
    },
    {
      id:          'wine-fields',
      type:        'tooltip' as const,
      target:      () => document.querySelector<HTMLElement>('[data-tour="wine-data-tab"]'),
      placement:   'left' as const,
      title:       m.tourWineFieldsTitle,
      description: m.tourWineFieldsBody,
    },
    {
      id:          'layers',
      type:        'tooltip' as const,
      target:      () => document.querySelector<HTMLElement>('[data-tour="layers-section"]'),
      placement:   'left' as const,
      title:       m.tourLayersTitle,
      description: m.tourLayersBody,
    },
    ...(includeSaveStep ? [{
      id:          'save',
      type:        'tooltip' as const,
      target:      () => document.querySelector<HTMLElement>('[data-tour="save-button"]'),
      placement:   'bottom' as const,
      title:       m.tourSaveTitle,
      description: m.tourSaveBody,
    }] : []),
  ]

  const translations: TourIntlTranslations = {
    nextStep: m.tourNext,
    prevStep: m.tourBack,
    skip:     m.tourSkip,
    close:    m.tourSkip,
    // Zag passes the zero-based step index as `current`.
    progressText: ({ current, total }) =>
      interpolate(m.tourProgress, { current: current + 1, total }),
  }

  const tour = useTour({
    steps,
    translations,
    onStatusChange(details: StatusChangeDetails) {
      // Persist "seen" on any terminal status so the tour stays dismissed
      // across reloads — completed AND skipped/dismissed both count.
      if (
        storageKey &&
        (details.status === 'completed' ||
          details.status === 'dismissed' ||
          details.status === 'skipped')
      ) {
        try { localStorage.setItem(storageKey, '1') } catch { /* storage disabled */ }
      }
    },
  })

  // Auto-start on first mount when not yet seen. We avoid running the start
  // logic inside useTour's onMount because the flag should be re-checked
  // every time CellarCanvas mounts (e.g. SPA navigation).
  useEffect(() => {
    if (disabled) return
    if (storageKey) {
      try {
        if (localStorage.getItem(storageKey)) return
      } catch { /* storage disabled — start anyway */ }
    }
    // Slight delay so target queries land after Fabric has laid out the
    // canvas wrapper. Without it, the first step jumps once the canvas
    // resizes into its final box.
    const t = setTimeout(() => tour.start(), 400)
    return () => clearTimeout(t)
    // tour.start is stable across renders; depending on it would cause the
    // effect to re-run as the step state advances.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, storageKey])

  // The header's help button restarts the tour. The tour instance lives
  // here, so it registers its start function in the store while mounted.
  useEffect(() => {
    const { setStartTour } = useDesignerStore.getState()
    setStartTour(() => tour.start())
    return () => setStartTour(null)
    // Same as above: tour.start is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tour.Root tour={tour}>
      <Portal>
        <Tour.Backdrop className={cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/40 backdrop-blur-[2px]", TOUR_Z_INDEX)} />
        {/* Zag only measures the target for tooltip steps; on the floating
            step the spotlight would show a stale rect from an earlier step. */}
        {tour.step?.type === 'tooltip' && (
          <Tour.Spotlight className={cn("ring-primary/60 ring-offset-background rounded-xl ring-2 ring-offset-2", TOUR_Z_INDEX)} />
        )}
        <Tour.Positioner
          className={cn(
            TOUR_Z_INDEX,
            // Zag only positions tooltip steps; dialog and floating steps get
            // no position at all. Both use placement `center` here, so centre
            // them in the viewport. The full-size layer lets clicks through,
            // only the card catches them (the floating step has no backdrop).
            "data-[type=dialog]:pointer-events-none data-[type=dialog]:fixed data-[type=dialog]:inset-0 data-[type=dialog]:flex data-[type=dialog]:items-center data-[type=dialog]:justify-center data-[type=dialog]:p-4",
            "data-[type=floating]:pointer-events-none data-[type=floating]:fixed data-[type=floating]:inset-0 data-[type=floating]:flex data-[type=floating]:items-center data-[type=floating]:justify-center data-[type=floating]:p-4",
          )}
        >
          <Tour.Content
            className={cn(
              "bg-card border border-border rounded-2xl shadow-2xl max-w-sm p-5 flex flex-col gap-3 pointer-events-auto",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Tour.Title className="text-foreground text-sm font-semibold">
                {tour.step?.title}
              </Tour.Title>
              <Tour.CloseTrigger
                className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 rounded p-1 transition-colors"
                aria-label={m.tourSkip}
              >
                <X size={14} />
              </Tour.CloseTrigger>
            </div>
            <Tour.Description className="text-muted-foreground text-xs leading-relaxed">
              {tour.step?.description}
            </Tour.Description>
            <div className="flex items-center justify-between pt-2">
              <Tour.ProgressText className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase" />
              <div className="flex items-center gap-2">
                {!tour.firstStep && (
                  <button
                    type="button"
                    onClick={() => tour.prev()}
                    className="text-muted-foreground hover:text-foreground px-3 py-1.5 text-xs transition-colors"
                  >
                    {m.tourBack}
                  </button>
                )}
                {tour.lastStep ? (
                  <button
                    type="button"
                    {...tour.getActionTriggerProps({ action: { label: m.tourDone, action: 'dismiss' } })}
                    className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
                  >
                    {m.tourDone}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => tour.next()}
                    className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
                  >
                    {m.tourNext}
                  </button>
                )}
              </div>
            </div>
            <Tour.Arrow className="fill-card stroke-border">
              <Tour.ArrowTip />
            </Tour.Arrow>
          </Tour.Content>
        </Tour.Positioner>
      </Portal>
    </Tour.Root>
  )
}
