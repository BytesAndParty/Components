import { useEffect, type CSSProperties, type ReactNode, forwardRef } from 'react'
import {
  DEFAULT_STAGE,
  injectStyles,
} from './vt-utils'

export interface TransitionStageProps {
  /** The name of the transition group. Can be 'match-element' for 2026 auto-naming. */
  name?: string | 'match-element'
  /** 2026: Control how this group nests in the transition tree ('normal', 'nearest', 'contain'). */
  nesting?: 'normal' | 'nearest' | 'contain'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * Container component that sets the view-transition-name on its DOM element.
 * Updated for May 2026 standards with nesting and auto-naming support.
 */
export const TransitionStage = forwardRef<HTMLDivElement, TransitionStageProps>(
  ({
    name = DEFAULT_STAGE,
    nesting = 'nearest',
    className,
    style,
    children,
  }, ref) => {
    useEffect(() => {
      if (name !== 'match-element') {
        injectStyles(name)
      }
    }, [name])

    return (
      <div
        ref={ref}
        className={className}
        style={{
          viewTransitionName: name,
          viewTransitionGroup: nesting, // 2026 hierarchical transitions
          ...style,
        } as CSSProperties}
      >
        {children}
      </div>
    )
  }
)

TransitionStage.displayName = 'TransitionStage'
