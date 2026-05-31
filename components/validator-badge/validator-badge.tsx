import { Popover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages, interpolate, useArkTranslations } from '../i18n'
import { MESSAGES, type ValidatorBadgeMessages } from './messages'

export type { ValidatorBadgeMessages }

export interface ValidationWarning {
  key: string
  label: string
  description?: string
  severity: 'warning' | 'error'
}

export interface ValidatorBadgeProps {
  warnings: ValidationWarning[]
  className?: string
  messages?: Partial<ValidatorBadgeMessages>
}

export function ValidatorBadge({ warnings, className, messages }: ValidatorBadgeProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const popoverTranslations = useArkTranslations('popover')
  const errors   = warnings.filter(w => w.severity === 'error')
  const hasError = errors.length > 0
  const count    = warnings.length

  if (count === 0) {
    return (
      <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card border border-border text-xs font-medium', className)}>
        <CheckCircle2 size={13} className="text-emerald-500" />
        <span className="text-muted-foreground">{m.compliant}</span>
      </div>
    )
  }

  return (
    <Popover.Root translations={popoverTranslations}>
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
          <span className="sr-only">
            {hasError ? m.error : m.warning}:
          </span>
          {hasError
            ? <AlertCircle size={13} />
            : <AlertTriangle size={13} />
          }
          <span>{interpolate(m.missingFields, { count })}</span>
        </button>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner style={{ zIndex: 50 }}>
          <Popover.Content>
            <div className="bg-card border-border w-72 overflow-hidden rounded-xl border shadow-xl">
              {/* Header */}
              <div className="border-border flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  {hasError
                    ? <AlertCircle size={14} className="text-destructive" />
                    : <AlertTriangle size={14} className="text-amber-500" />
                  }
                  <span className="text-foreground text-sm font-semibold">
                    {m.panelTitle}
                  </span>
                </div>
                <Popover.CloseTrigger asChild>
                  <button
                    type="button"
                    aria-label={m.close}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Popover.CloseTrigger>
              </div>

              {/* Warning list */}
              <ul className="divide-border divide-y">
                {warnings.map(w => (
                  <li key={w.key} className="flex items-start gap-3 px-4 py-3">
                    <div className={cn(
                      'mt-0.5 shrink-0',
                      w.severity === 'error' ? 'text-destructive' : 'text-amber-500',
                    )}>
                      <span className="sr-only">
                        {w.severity === 'error' ? m.error : m.warning}:
                      </span>
                      {w.severity === 'error'
                        ? <AlertCircle size={13} />
                        : <AlertTriangle size={13} />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium">{w.label}</p>
                      {w.description && (
                        <p className="text-muted-foreground mt-0.5 text-xs">{w.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="bg-muted/30 border-border border-t px-4 py-2.5">
                <p className="text-muted-foreground text-[11px]">
                  {m.footer}
                </p>
              </div>
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
