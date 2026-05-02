import { Popover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '../lib/utils'

export interface ValidationWarning {
  key: string
  label: string
  description?: string
  severity: 'warning' | 'error'
}

export interface ValidatorBadgeProps {
  warnings: ValidationWarning[]
  className?: string
}

export function ValidatorBadge({ warnings, className }: ValidatorBadgeProps) {
  const errors   = warnings.filter(w => w.severity === 'error')
  const hasError = errors.length > 0
  const count    = warnings.length

  if (count === 0) {
    return (
      <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card border border-border text-xs font-medium', className)}>
        <CheckCircle2 size={13} className="text-emerald-500" />
        <span className="text-muted-foreground">EU compliant</span>
      </div>
    )
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-colors',
            hasError
              ? 'bg-destructive/10 border-destructive/40 text-destructive hover:bg-destructive/20'
              : 'bg-amber-500/10 border-amber-500/40 text-amber-500 hover:bg-amber-500/20',
            className,
          )}
        >
          {hasError
            ? <AlertCircle size={13} />
            : <AlertTriangle size={13} />
          }
          <span>{count} missing field{count !== 1 ? 's' : ''}</span>
        </button>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner style={{ zIndex: 50 }}>
          <Popover.Content>
            <div className="w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  {hasError
                    ? <AlertCircle size={14} className="text-destructive" />
                    : <AlertTriangle size={14} className="text-amber-500" />
                  }
                  <span className="text-sm font-semibold text-foreground">
                    EU Label Compliance
                  </span>
                </div>
                <Popover.CloseTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Popover.CloseTrigger>
              </div>

              {/* Warning list */}
              <ul className="divide-y divide-border">
                {warnings.map(w => (
                  <li key={w.key} className="flex items-start gap-3 px-4 py-3">
                    <div className={cn(
                      'mt-0.5 shrink-0',
                      w.severity === 'error' ? 'text-destructive' : 'text-amber-500',
                    )}>
                      {w.severity === 'error'
                        ? <AlertCircle size={13} />
                        : <AlertTriangle size={13} />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{w.label}</p>
                      {w.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{w.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-muted/30 border-t border-border">
                <p className="text-[11px] text-muted-foreground">
                  EU Regulation 2023/2977 — required fields for wine sold in the EU.
                </p>
              </div>
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
