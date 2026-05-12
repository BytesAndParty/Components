import { useState, useEffect, useRef } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useHotkeysRegistry, useDesignEngineHotkey, HotkeyMetadata } from './hotkeys-provider'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type ShortcutOverviewMessages } from './messages'

// ── Component ─────────────────────────────────────────────────────────────────

export function ShortcutOverview({
  className,
  messages,
}: ShortcutOverviewProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const { registry } = useHotkeysRegistry()
  const [isVisible, setIsVisible] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  function closeOverview() {
    setIsVisible(false)
  }

  // ? key toggles the overview — also registers itself in the shortcut list
  useDesignEngineHotkey(
    '?',
    () => setIsVisible((visible: boolean) => !visible),
    { label: 'Shortcuts anzeigen', description: 'Übersicht öffnen / schließen', category: 'Global' }
  )

  // Escape closes when open — not in registry since it's implicit
  useHotkey('Escape', closeOverview)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isVisible) {
      if (!dialog.open) dialog.showModal()
      return
    }

    if (!dialog.open) return

    const requestClose = (dialog as HTMLDialogElement & { requestClose?: () => void }).requestClose
    if (requestClose) {
      requestClose.call(dialog)
    } else {
      dialog.close()
    }
  }, [isVisible])

  const groupedHotkeys = Array.from(registry.values()).reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = []
    acc[curr.category].push(curr)
    return acc
  }, {} as Record<string, HotkeyMetadata[]>)

  const categories = ['Global', 'Navigation', 'Actions', 'Context'] as const

  return (
    <>
      <ShortcutOverviewDialogStyles />
      <dialog
        ref={dialogRef}
        aria-label={m.title}
        className={cn('atelier-shortcuts-dialog', className)}
        onClose={() => setIsVisible(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeOverview()
        }}
      >
        <div className="relative bg-card/95 border border-border rounded-3xl shadow-2xl p-8 overflow-y-auto backdrop-blur-xl max-h-[calc(100dvh-3rem)]">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">{m.title}</h2>
              <p className="text-muted-foreground mt-1">
                {m.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="px-3 py-1.5 bg-muted border border-border rounded-full text-xs text-muted-foreground font-medium">
                <kbd className="font-bold text-foreground">?</kbd> {m.openHint}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map(category => {
              const items = groupedHotkeys[category]
              if (!items || items.length === 0) return null

              return (
                <div key={category} className="space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent opacity-80">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div
                        key={`${item.key}-${idx}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/60 hover:border-border transition-all duration-150"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="text-sm font-semibold text-foreground truncate">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {item.key.split('+').map((k, i) => (
                            <kbd
                              key={i}
                              className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-muted border border-border rounded-md text-[10px] font-bold text-foreground"
                            >
                              {k === 'Mod' ? '⌘' : k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </dialog>
    </>
  )
}

function ShortcutOverviewDialogStyles() {
  return (
    <style>{`
      .atelier-shortcuts-dialog {
        width: min(64rem, calc(100vw - 3rem));
        max-width: none;
        border: 0;
        padding: 0;
        margin: auto;
        background: transparent;
        color: inherit;
        overflow: visible;
        opacity: 0;
        transform: translateY(1rem) scale(0.96);
        transition:
          opacity 180ms ease,
          transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
          overlay 220ms ease allow-discrete,
          display 220ms ease allow-discrete;
        transition-behavior: allow-discrete;
      }

      .atelier-shortcuts-dialog:open {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .atelier-shortcuts-dialog::backdrop {
        background-color: rgb(0 0 0 / 0);
        backdrop-filter: blur(0);
        transition:
          background-color 180ms ease,
          backdrop-filter 220ms ease,
          overlay 220ms ease allow-discrete,
          display 220ms ease allow-discrete;
        transition-behavior: allow-discrete;
      }

      .atelier-shortcuts-dialog:open::backdrop {
        background-color: rgb(0 0 0 / 0.6);
        backdrop-filter: blur(24px);
      }

      @starting-style {
        .atelier-shortcuts-dialog:open {
          opacity: 0;
          transform: translateY(1rem) scale(0.96);
        }

        .atelier-shortcuts-dialog:open::backdrop {
          background-color: rgb(0 0 0 / 0);
          backdrop-filter: blur(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .atelier-shortcuts-dialog,
        .atelier-shortcuts-dialog::backdrop {
          transition: none;
        }
      }
    `}</style>
  )
}
