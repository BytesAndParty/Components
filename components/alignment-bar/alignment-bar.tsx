import { useState, useRef } from 'react'
import {
  AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import type { ComponentMessages } from '../i18n'

export type AlignAction =
  | 'align-left' | 'align-center-h' | 'align-right'
  | 'align-top'  | 'align-center-v' | 'align-bottom'
  | 'distribute-h' | 'distribute-v'

export type AlignmentBarMessages = {
  alignLeft: string
  alignCenterH: string
  alignRight: string
  alignTop: string
  alignCenterV: string
  alignBottom: string
  distributeH: string
  distributeV: string
  ariaLabel: string
}

const ALIGNMENT_BAR_MESSAGES = {
  de: {
    alignLeft: 'Links ausrichten',
    alignCenterH: 'Horizontal zentrieren',
    alignRight: 'Rechts ausrichten',
    alignTop: 'Oben ausrichten',
    alignCenterV: 'Vertikal zentrieren',
    alignBottom: 'Unten ausrichten',
    distributeH: 'Horizontal verteilen',
    distributeV: 'Vertikal verteilen',
    ariaLabel: 'Objekt-Ausrichtung',
  },
  en: {
    alignLeft: 'Align left',
    alignCenterH: 'Align center horizontal',
    alignRight: 'Align right',
    alignTop: 'Align top',
    alignCenterV: 'Align center vertical',
    alignBottom: 'Align bottom',
    distributeH: 'Distribute horizontally',
    distributeV: 'Distribute vertically',
    ariaLabel: 'Object alignment',
  },
} as const satisfies ComponentMessages<AlignmentBarMessages>

const BUTTON_TITLES: Record<AlignAction, keyof AlignmentBarMessages> = {
  'align-left':     'alignLeft',
  'align-center-h': 'alignCenterH',
  'align-right':    'alignRight',
  'align-top':      'alignTop',
  'align-center-v': 'alignCenterV',
  'align-bottom':   'alignBottom',
  'distribute-h':   'distributeH',
  'distribute-v':   'distributeV',
}

const BUTTONS: { action: AlignAction; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { action: 'align-left',     Icon: AlignStartHorizontal },
  { action: 'align-center-h', Icon: AlignCenterHorizontal },
  { action: 'align-right',    Icon: AlignEndHorizontal },
  { action: 'align-top',      Icon: AlignStartVertical },
  { action: 'align-center-v', Icon: AlignCenterVertical },
  { action: 'align-bottom',   Icon: AlignEndVertical },
  { action: 'distribute-h',   Icon: AlignHorizontalDistributeCenter },
  { action: 'distribute-v',   Icon: AlignVerticalDistributeCenter },
]

export interface AlignmentBarProps {
  onAlign: (action: AlignAction) => void
  disabled?: boolean
  className?: string
  messages?: Partial<AlignmentBarMessages>
}

export function AlignmentBar({ onAlign, disabled = false, className, messages }: AlignmentBarProps) {
  const m = useComponentMessages(ALIGNMENT_BAR_MESSAGES, messages)
  const [focusIndex, setFocusIndex] = useState(0)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    let nextIndex = focusIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (focusIndex + 1) % BUTTONS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (focusIndex - 1 + BUTTONS.length) % BUTTONS.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = BUTTONS.length - 1
    } else {
      return
    }

    setFocusIndex(nextIndex)
    buttonRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      role="toolbar"
      aria-label={m.ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex items-center h-9 bg-card border border-border rounded-lg text-sm select-none',
        disabled && 'opacity-40 pointer-events-none',
        className,
      )}
    >
      {BUTTONS.map(({ action, Icon }, i) => (
        <div key={action} className="flex items-center">
          {/* Divider between align group and distribute group */}
          {i === 6 && <div className="w-px h-5 bg-border mx-0.5" />}
          <button
            ref={el => { buttonRefs.current[i] = el }}
            type="button"
            tabIndex={focusIndex === i ? 0 : -1}
            title={m[BUTTON_TITLES[action]]}
            onClick={() => {
              setFocusIndex(i)
              onAlign(action)
            }}
            className="flex items-center justify-center w-8 h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:bg-muted focus-visible:text-foreground outline-none"
          >
            <Icon size={13} strokeWidth={1.75} />
          </button>
        </div>
      ))}
    </div>
  )
}
