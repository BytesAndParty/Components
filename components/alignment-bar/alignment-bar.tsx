import {
  AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter,
} from 'lucide-react'
import { cn } from '../lib/utils'

export type AlignAction =
  | 'align-left' | 'align-center-h' | 'align-right'
  | 'align-top'  | 'align-center-v' | 'align-bottom'
  | 'distribute-h' | 'distribute-v'

export interface AlignmentBarProps {
  onAlign: (action: AlignAction) => void
  disabled?: boolean
  className?: string
}

const BUTTONS: { action: AlignAction; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; title: string }[] = [
  { action: 'align-left',     Icon: AlignStartHorizontal,          title: 'Align left' },
  { action: 'align-center-h', Icon: AlignCenterHorizontal,         title: 'Align center horizontal' },
  { action: 'align-right',    Icon: AlignEndHorizontal,            title: 'Align right' },
  { action: 'align-top',      Icon: AlignStartVertical,            title: 'Align top' },
  { action: 'align-center-v', Icon: AlignCenterVertical,           title: 'Align center vertical' },
  { action: 'align-bottom',   Icon: AlignEndVertical,              title: 'Align bottom' },
  { action: 'distribute-h',   Icon: AlignHorizontalDistributeCenter, title: 'Distribute horizontally' },
  { action: 'distribute-v',   Icon: AlignVerticalDistributeCenter,  title: 'Distribute vertically' },
]

export function AlignmentBar({ onAlign, disabled = false, className }: AlignmentBarProps) {
  return (
    <div
      className={cn(
        'flex items-center h-9 bg-card border border-border rounded-lg text-sm select-none',
        disabled && 'opacity-40 pointer-events-none',
        className,
      )}
    >
      {BUTTONS.map(({ action, Icon, title }, i) => (
        <div key={action} className="flex items-center">
          {/* Divider between align group and distribute group */}
          {i === 6 && <div className="w-px h-5 bg-border mx-0.5" />}
          <button
            type="button"
            title={title}
            onClick={() => onAlign(action)}
            className="flex items-center justify-center w-8 h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Icon size={13} strokeWidth={1.75} />
          </button>
        </div>
      ))}
    </div>
  )
}
