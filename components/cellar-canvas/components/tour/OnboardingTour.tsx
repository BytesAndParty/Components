import { useEffect, useMemo } from 'react'
import { Portal } from '@ark-ui/react/portal'
import { Tour, useTour } from '@ark-ui/react/tour'
import { X } from 'lucide-react'
import { useCellarCanvasMessages } from '../../messages-context'
import { cn } from '../../../lib/utils'

export interface OnboardingTourProps {
  /** When true, the tour never auto-starts. Manual restarts still work. */
  disabled?: boolean
  /**
   * localStorage key for the "tour completed" flag. Pass `null` to opt out of
   * persistence (e.g. for tests). Default: `'cellar-canvas-tour-completed'`.
   */
  storageKey?: string | null
}

const DEFAULT_STORAGE_KEY = 'cellar-canvas-tour-completed'

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
}: OnboardingTourProps) {
  const m = useCellarCanvasMessages()

  const steps = useMemo(() => ([
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
    {
      id:          'save',
      type:        'tooltip' as const,
      target:      () => document.querySelector<HTMLElement>('[data-tour="save-button"]'),
      placement:   'bottom' as const,
      title:       m.tourSaveTitle,
      description: m.tourSaveBody,
    },
  ]), [m])

  const translations = useMemo(() => ({
    nextStep: m.tourNext,
    prevStep: m.tourBack,
    skip:     m.tourSkip,
    close:    m.tourSkip,
  }), [m])

  const tour = useTour({
    steps,
    translations,
    onStatusChange(details) {
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

  return (
    <Tour.Root tour={tour}>
      <Portal>
        <Tour.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Tour.Spotlight className="rounded-xl ring-2 ring-primary/60 ring-offset-2 ring-offset-background" />
        <Tour.Positioner className="z-50">
          <Tour.Content
            className={cn(
              "bg-card border border-border rounded-2xl shadow-2xl max-w-sm p-5 flex flex-col gap-3",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Tour.Title className="text-sm font-semibold text-foreground">
                {tour.step?.title}
              </Tour.Title>
              <Tour.CloseTrigger
                className="text-muted-foreground hover:text-foreground transition-colors -mt-1 -mr-1 p-1 rounded"
                aria-label={m.tourSkip}
              >
                <X size={14} />
              </Tour.CloseTrigger>
            </div>
            <Tour.Description className="text-xs leading-relaxed text-muted-foreground">
              {tour.step?.description}
            </Tour.Description>
            <div className="flex items-center justify-between pt-2">
              <Tour.ProgressText className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground" />
              <div className="flex items-center gap-2">
                {!tour.firstStep && (
                  <button
                    type="button"
                    onClick={() => tour.prev()}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {m.tourBack}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (tour.lastStep ? tour.dismiss() : tour.next())}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  {tour.lastStep ? m.tourDone : m.tourNext}
                </button>
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
