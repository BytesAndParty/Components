import { Popover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages, interpolate } from '../i18n'
import type { ComponentMessages } from '../i18n'

export type ValidatorBadgeMessages = {
  compliant: string
  missingFields: string
  panelTitle: string
  footer: string
  close: string
  error: string
  warning: string
}

const VALIDATOR_BADGE_MESSAGES = {
  de: {
    compliant: 'EU-konform',
    missingFields: '{count} Feld{count} fehlt',
    panelTitle: 'EU Label Compliance',
    footer: 'EU-Verordnung 2023/2977 — Pflichtfelder für Wein in der EU.',
    close: 'Schließen',
    error: 'Fehler',
    warning: 'Warnung',
  },
  en: {
    compliant: 'EU compliant',
    missingFields: '{count} missing field{count}',
    panelTitle: 'EU Label Compliance',
    footer: 'EU Regulation 2023/2977 — required fields for wine sold in the EU.',
    close: 'Close',
    error: 'Error',
    warning: 'Warning',
  },
} as const satisfies ComponentMessages<ValidatorBadgeMessages>

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
  const m = useComponentMessages(VALIDATOR_BADGE_MESSAGES, messages)
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
            <div className="w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  {hasError
                    ? <AlertCircle size={14} className="text-destructive" />
                    : <AlertTriangle size={14} className="text-amber-500" />
                  }
                  <span className="text-sm font-semibold text-foreground">
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
              <ul className="divide-y divide-border">
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
