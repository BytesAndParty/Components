import { flushSync } from 'react-dom'
import {
  type VtPreset,
  DEFAULT_STAGE,
  injectStyles,
} from './vt-utils'

export interface RunViewTransitionOptions {
  origin?: { x: number; y: number }
  stageName?: string
  /** 2026: Scopes the transition to a specific element instead of the whole document. */
  scope?: HTMLElement
}

/**
 * Minimal interface to represent the standard ViewTransition object based on May 2026 standards.
 */
export interface ViewTransitionLike {
  ready: Promise<void>
  finished: Promise<void>
  updateCallbackDone: Promise<void>
  types?: Set<string>
  skipTransition(): void
  waitUntil?(promise: Promise<unknown>): void
  /** 2026: Reference to the element this transition is scoped to. */
  readonly scope?: HTMLElement | Document
}

/**
 * Options for starting a view transition.
 */
export interface StartViewTransitionOptions {
  update?: () => Promise<void> | void
  types?: string[]
}

/**
 * Standardized way to trigger a View Transition with various presets.
 * Supports the native Types API (2024+) and Scoped Transitions (2026).
 */
export function runViewTransition(
  type: VtPreset,
  update: () => void,
  options: RunViewTransitionOptions = {}
): ViewTransitionLike | null {
  const stageName = options.stageName ?? DEFAULT_STAGE
  injectStyles(stageName)

  if (typeof document === 'undefined') {
    update()
    return null
  }

  // 2026: Use element-level scoping if provided, otherwise fall back to document.
  const root = options.scope ?? document
  const starter = root as {
    startViewTransition?: (options?: StartViewTransitionOptions | (() => void)) => ViewTransitionLike
  }

  if (typeof starter.startViewTransition !== 'function') {
    update()
    return null
  }

  const commit = () => flushSync(update)

  // Set transition data for CSS targeting.
  // Note: For scoped transitions, we apply this to the scope element.
  const targetEl = options.scope ?? document.documentElement
  targetEl.dataset.vt = type

  let transition: ViewTransitionLike | undefined
  try {
    // Try modern object-based API with types
    transition = starter.startViewTransition({ update: commit, types: [type] })
  } catch {
    // Fallback to legacy callback-only API
    transition = starter.startViewTransition(commit)
  }

  transition?.finished.finally(() => {
    delete targetEl.dataset.vt
  })


  // Handle radial/origin-based reveals
  if (transition && options.origin && (type === 'vt-circular-reveal' || type === 'vt-grape-burst')) {
    const { x: vX, y: vY } = options.origin
    transition.ready.then(() => {
      // 2026 Scoped logic: coordinates must be relative to the scope element
      let localX = vX
      let localY = vY
      let width = window.innerWidth
      let height = window.innerHeight

      if (options.scope) {
        const rect = options.scope.getBoundingClientRect()
        localX = vX - rect.left
        localY = vY - rect.top
        width = rect.width
        height = rect.height
      }

      const endR = Math.hypot(Math.max(localX, width - localX), Math.max(localY, height - localY))
      
      targetEl.animate(
        {
          clipPath: [
            `circle(0 at ${localX}px ${localY}px)`,
            `circle(${endR}px at ${localX}px ${localY}px)`,
          ],
        },
        {
          duration: type === 'vt-grape-burst' ? 780 : 520,
          easing: type === 'vt-grape-burst' ? 'cubic-bezier(.2,.7,.1,1)' : 'ease-out',
          pseudoElement: `::view-transition-new(${stageName})`,
        }
      )
    })
  }

  return transition ?? null
}
