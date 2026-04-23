import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

export type VtPreset =
  | 'vt-fade'
  | 'vt-slide-left'
  | 'vt-slide-up'
  | 'vt-scale'
  | 'vt-circular-reveal'
  | 'vt-wine-pour'
  | 'vt-cork-pop'
  | 'vt-grape-burst'

export interface VtPresetMeta {
  id: VtPreset
  label: string
  hint: string
  needsOrigin?: boolean
  wine?: boolean
}

export const VT_PRESETS: VtPresetMeta[] = [
  { id: 'vt-fade', label: 'Fade', hint: 'Klassischer Crossfade zwischen Old- und New-Snapshot.' },
  { id: 'vt-slide-left', label: 'Slide Left', hint: 'Old rutscht nach links raus, New von rechts rein.' },
  { id: 'vt-slide-up', label: 'Slide Up', hint: 'Vertikales Scrollen zwischen den States.' },
  { id: 'vt-scale', label: 'Scale', hint: 'Zoom-out + Zoom-in mit leichtem Spring-Overshoot.' },
  { id: 'vt-circular-reveal', label: 'Circular Reveal', hint: 'Kreisförmige Clip-Path-Expansion ab Klickpunkt.', needsOrigin: true },
  { id: 'vt-wine-pour', label: 'Wine Pour', hint: 'New füllt sich von oben wie Rotwein im Glas, inkl. Tint.', wine: true },
  { id: 'vt-cork-pop', label: 'Cork Pop', hint: 'Old springt raus & rotiert, New schnappt mit Feder ein.', wine: true },
  { id: 'vt-grape-burst', label: 'Grape Burst', hint: 'Radial-Bloom mit Traubenlila-Tint ab Klickpunkt.', needsOrigin: true, wine: true },
]

const STYLE_ID = '__view-transition-preset-styles__'
const DEFAULT_STAGE = 'vt-stage'

function injectStyles(stageName: string) {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const css = `
    ::view-transition-group(${stageName}) { animation-duration: .6s; }
    ::view-transition-old(${stageName}),
    ::view-transition-new(${stageName}) { mix-blend-mode: normal; backface-visibility: hidden; }

    @keyframes vt-fade-out { to { opacity: 0 } }
    @keyframes vt-fade-in  { from { opacity: 0 } }
    html:active-view-transition-type(vt-fade) ::view-transition-old(${stageName}),
    html[data-vt="vt-fade"] ::view-transition-old(${stageName}) { animation: vt-fade-out .35s ease both; }
    html:active-view-transition-type(vt-fade) ::view-transition-new(${stageName}),
    html[data-vt="vt-fade"] ::view-transition-new(${stageName}) { animation: vt-fade-in .35s ease both; }

    @keyframes vt-slide-out-l { to { transform: translateX(-30%); opacity: 0 } }
    @keyframes vt-slide-in-r  { from { transform: translateX(30%); opacity: 0 } }
    html:active-view-transition-type(vt-slide-left) ::view-transition-old(${stageName}),
    html[data-vt="vt-slide-left"] ::view-transition-old(${stageName}) { animation: vt-slide-out-l .45s cubic-bezier(.4,0,.2,1) both; }
    html:active-view-transition-type(vt-slide-left) ::view-transition-new(${stageName}),
    html[data-vt="vt-slide-left"] ::view-transition-new(${stageName}) { animation: vt-slide-in-r .45s cubic-bezier(.4,0,.2,1) both; }

    @keyframes vt-slide-up-out { to { transform: translateY(-20%); opacity: 0 } }
    @keyframes vt-slide-up-in  { from { transform: translateY(20%); opacity: 0 } }
    html:active-view-transition-type(vt-slide-up) ::view-transition-old(${stageName}),
    html[data-vt="vt-slide-up"] ::view-transition-old(${stageName}) { animation: vt-slide-up-out .5s cubic-bezier(.4,0,.2,1) both; }
    html:active-view-transition-type(vt-slide-up) ::view-transition-new(${stageName}),
    html[data-vt="vt-slide-up"] ::view-transition-new(${stageName}) { animation: vt-slide-up-in .5s cubic-bezier(.4,0,.2,1) both; }

    @keyframes vt-scale-out { to { transform: scale(.92); opacity: 0 } }
    @keyframes vt-scale-in  { from { transform: scale(.94); opacity: 0 } }
    html:active-view-transition-type(vt-scale) ::view-transition-old(${stageName}),
    html[data-vt="vt-scale"] ::view-transition-old(${stageName}) { animation: vt-scale-out .35s ease-out both; }
    html:active-view-transition-type(vt-scale) ::view-transition-new(${stageName}),
    html[data-vt="vt-scale"] ::view-transition-new(${stageName}) { animation: vt-scale-in .45s cubic-bezier(.34,1.56,.64,1) both; }

    html:active-view-transition-type(vt-circular-reveal) ::view-transition-old(${stageName}),
    html[data-vt="vt-circular-reveal"] ::view-transition-old(${stageName}) { animation: vt-fade-out .4s ease both; }
    html:active-view-transition-type(vt-circular-reveal) ::view-transition-new(${stageName}),
    html[data-vt="vt-circular-reveal"] ::view-transition-new(${stageName}) { animation: none; }

    @keyframes vt-wine-sink {
      0%   { transform: translateY(0);  opacity: 1; filter: saturate(1) }
      100% { transform: translateY(8%); opacity: 0; filter: saturate(1.6) hue-rotate(-10deg) }
    }
    @keyframes vt-wine-pour {
      0%   { clip-path: inset(0 0 100% 0); filter: brightness(.78) saturate(1.55) sepia(.22) hue-rotate(-14deg) }
      25%  { filter: brightness(.85) saturate(1.35) sepia(.15) hue-rotate(-10deg) }
      70%  { filter: brightness(.97) saturate(1.08) }
      100% { clip-path: inset(0 0 0 0); filter: none }
    }
    html:active-view-transition-type(vt-wine-pour) ::view-transition-old(${stageName}),
    html[data-vt="vt-wine-pour"] ::view-transition-old(${stageName}) { animation: vt-wine-sink .55s cubic-bezier(.6,0,.4,1) both; }
    html:active-view-transition-type(vt-wine-pour) ::view-transition-new(${stageName}),
    html[data-vt="vt-wine-pour"] ::view-transition-new(${stageName}) { animation: vt-wine-pour .95s cubic-bezier(.5,.05,.15,1) both; }

    @keyframes vt-cork-out {
      0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 1 }
      100% { transform: translateY(-14%) scale(1.12) rotate(5deg); opacity: 0 }
    }
    @keyframes vt-cork-in {
      0%   { transform: scale(.72); opacity: 0; filter: blur(10px) }
      55%  { transform: scale(1.07); opacity: 1; filter: blur(0) }
      80%  { transform: scale(.97) }
      100% { transform: scale(1) }
    }
    html:active-view-transition-type(vt-cork-pop) ::view-transition-old(${stageName}),
    html[data-vt="vt-cork-pop"] ::view-transition-old(${stageName}) { animation: vt-cork-out .45s cubic-bezier(.55,-.2,.75,.1) both; }
    html:active-view-transition-type(vt-cork-pop) ::view-transition-new(${stageName}),
    html[data-vt="vt-cork-pop"] ::view-transition-new(${stageName}) { animation: vt-cork-in .7s cubic-bezier(.34,1.56,.64,1) both; }

    @keyframes vt-grape-tint {
      0%   { filter: saturate(1.9) hue-rotate(-28deg) brightness(.88) contrast(1.12) }
      60%  { filter: saturate(1.25) hue-rotate(-10deg) brightness(.96) }
      100% { filter: none }
    }
    html:active-view-transition-type(vt-grape-burst) ::view-transition-old(${stageName}),
    html[data-vt="vt-grape-burst"] ::view-transition-old(${stageName}) { animation: vt-fade-out .35s ease both; }
    html:active-view-transition-type(vt-grape-burst) ::view-transition-new(${stageName}),
    html[data-vt="vt-grape-burst"] ::view-transition-new(${stageName}) { animation: vt-grape-tint .75s ease-out both; }

    @media (prefers-reduced-motion: reduce) {
      ::view-transition-old(${stageName}),
      ::view-transition-new(${stageName}) { animation-duration: .001ms !important; animation: none !important; }
    }
  `

  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = css
  document.head.appendChild(el)
}

export interface RunViewTransitionOptions {
  origin?: { x: number; y: number }
  stageName?: string
}

interface ViewTransitionLike {
  ready?: Promise<void>
  finished?: Promise<void>
}

export function runViewTransition(
  type: VtPreset,
  update: () => void,
  options: RunViewTransitionOptions = {}
): ViewTransitionLike | null {
  const stageName = options.stageName ?? DEFAULT_STAGE
  injectStyles(stageName)

  if (typeof document === 'undefined') { update(); return null }
  const doc = document as Document & {
    startViewTransition?: (arg: unknown) => ViewTransitionLike
  }
  if (typeof doc.startViewTransition !== 'function') { update(); return null }

  const commit = () => flushSync(update)

  // Always set data-vt so CSS [data-vt="..."] selectors work in all browsers.
  // The :active-view-transition-type() selector only works in browsers that
  // support the types option — both paths are needed for cross-browser compat.
  document.documentElement.dataset.vt = type

  let transition: ViewTransitionLike | undefined
  try {
    transition = doc.startViewTransition({ update: commit, types: [type] })
  } catch {
    transition = doc.startViewTransition(commit)
  }

  transition?.finished?.finally(() => {
    delete document.documentElement.dataset.vt
  })

  if (transition && options.origin && (type === 'vt-circular-reveal' || type === 'vt-grape-burst')) {
    const { x, y } = options.origin
    transition.ready?.then(() => {
      const endR = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0 at ${x}px ${y}px)`,
            `circle(${endR}px at ${x}px ${y}px)`,
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

export interface TransitionStageProps {
  name?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function TransitionStage({
  name = DEFAULT_STAGE,
  className,
  style,
  children,
}: TransitionStageProps) {
  useEffect(() => { injectStyles(name) }, [name])
  return (
    <div
      className={className}
      style={{
        viewTransitionName: name,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
