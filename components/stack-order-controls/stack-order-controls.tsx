import { BringToFront, SendToBack, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type StackOrderControlsMessages } from './messages'

export type { StackOrderControlsMessages }

export interface StackOrderControlsProps {
  /** Move the selection to the very top of the canvas stack. */
  onBringToFront?: () => void
  /** Step the selection one layer up. */
  onBringForward?: () => void
  /** Step the selection one layer down. */
  onSendBackward?: () => void
  /** Move the selection to the very bottom of the canvas stack. */
  onSendToBack?: () => void
  /** Disables every button — typically when nothing is selected. */
  disabled?: boolean
  /** Limit the rendered buttons. Omit to show all four. */
  visible?: ReadonlyArray<'front' | 'forward' | 'backward' | 'back'>
  className?: string
  messages?: Partial<StackOrderControlsMessages>
}

const BUTTON_ORDER = ['front', 'forward', 'backward', 'back'] as const
type ButtonKey = (typeof BUTTON_ORDER)[number]

const ICONS: Record<ButtonKey, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  front:    BringToFront,
  forward:  ArrowUp,
  backward: ArrowDown,
  back:     SendToBack,
}

const TITLE_KEYS: Record<ButtonKey, keyof StackOrderControlsMessages> = {
  front:    'bringToFront',
  forward:  'bringForward',
  backward: 'sendBackward',
  back:     'sendToBack',
}

export function StackOrderControls({
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  disabled = false,
  visible = BUTTON_ORDER,
  className,
  messages,
}: StackOrderControlsProps) {
  const m = useComponentMessages(MESSAGES, messages)

  const handlers: Record<ButtonKey, (() => void) | undefined> = {
    front:    onBringToFront,
    forward:  onBringForward,
    backward: onSendBackward,
    back:     onSendToBack,
  }

  return (
    <div
      role="toolbar"
      aria-label={m.ariaLabel}
      className={cn(
        'flex items-center h-9 bg-card border border-border rounded-lg text-sm select-none',
        className,
      )}
    >
      {BUTTON_ORDER.filter(k => visible.includes(k)).map((key, idx, arr) => {
        const Icon = ICONS[key]
        const handler = handlers[key]
        const title = m[TITLE_KEYS[key]]
        const isLast = idx === arr.length - 1

        return (
          <button
            key={key}
            type="button"
            onClick={handler}
            disabled={disabled || !handler}
            title={title}
            aria-label={title}
            className={cn(
              'flex items-center justify-center w-8 h-full transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground',
              !isLast && 'border-r border-border',
            )}
          >
            <Icon size={13} strokeWidth={2.25} />
          </button>
        )
      })}
    </div>
  )
}
