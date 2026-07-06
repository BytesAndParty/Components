import { useState, useEffect, useRef } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useHotkeysRegistry, useDesignEngineHotkey, HotkeyMetadata } from './hotkeys-context'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type ShortcutOverviewMessages } from './messages'

export interface ShortcutOverviewProps {
  className?: string;
  messages?: Partial<ShortcutOverviewMessages>;
}

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

  // Mod+/ toggles the overview — also registers itself in the shortcut list
  useDesignEngineHotkey(
    'Mod+/',
    () => setIsVisible((visible: boolean) => !visible),
    { label: 'Shortcuts anzeigen', description: 'Übersicht öffnen / schließen', category: 'Global' }
  )

  // Escape closes when open — not in registry since it's implicit
  useHotkey('Escape', closeOverview, { enabled: isVisible })

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
      {/* Click-on-backdrop close: keyboard users dismiss via Escape (native
          dialog) — no additional key handler needed on the wrapper. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        aria-label={m.title}
        className={cn('atelier-shortcuts-dialog', className)}
        onClose={() => setIsVisible(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeOverview()
        }}
      >
        <div className="bg-card/95 border-border relative max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-3xl border p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <h2 className="text-foreground text-3xl font-bold tracking-tight">{m.title}</h2>
              <p className="text-muted-foreground mt-1">
                {m.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="bg-muted border-border text-muted-foreground rounded-full border px-3 py-1.5 text-xs font-medium">
                <kbd className="text-foreground font-bold">?</kbd> {m.openHint}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {categories.map(category => {
              const items = groupedHotkeys[category]
              if (!items || items.length === 0) return null

              return (
                <div key={category} className="space-y-4">
                  <h3 className="text-accent text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div
                        key={`${item.key}-${idx}`}
                        className="bg-muted/30 border-border/50 hover:bg-muted/60 hover:border-border flex items-center justify-between rounded-xl border p-3 transition-all duration-150"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="text-foreground truncate text-sm font-semibold">{item.label}</div>
                          {item.description && (
                            <div className="text-muted-foreground mt-0.5 truncate text-xs">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {item.key.split('+').map((k, i) => (
                            <kbd
                              key={i}
                              className="bg-muted border-border text-foreground flex h-6 min-w-[24px] items-center justify-center rounded-md border px-1.5 text-[10px] font-bold"
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
