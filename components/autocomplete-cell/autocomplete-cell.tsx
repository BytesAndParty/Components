import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Combobox, useCombobox } from '@ark-ui/react/combobox'
import { createListCollection } from '@ark-ui/react/collection'
import { Portal } from '@ark-ui/react/portal'
import { Search, X, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useOverlayContainer } from '../lib/overlay-container'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type AutocompleteMessages } from './messages'

export interface AutocompleteSuggestion {
  id: number | string
  key: string
  label: string
  subLabel?: string
}

export interface AutocompleteCellProps {
  value: string
  suggestions: AutocompleteSuggestion[]
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef?: React.RefObject<HTMLInputElement>
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  messages?: Partial<AutocompleteMessages>
  className?: string
  isLoading?: boolean
}

// Keys the open list handles itself; everything else reaches the caller's onKeyDown.
const LIST_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Escape'])

const STYLE_ID = '__autocomplete-cell-styles__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = `
    @keyframes autocomplete-cell-in {
      from { opacity: 0; transform: translateY(4px) scale(0.98); }
    }
    @keyframes autocomplete-cell-out {
      to { opacity: 0; transform: translateY(2px) scale(0.98); }
    }
    .autocomplete-cell-list[data-state="open"] { animation: autocomplete-cell-in 0.15s ease-out; }
    .autocomplete-cell-list[data-state="closed"] { animation: autocomplete-cell-out 0.15s ease-out; }
  `
  document.head.appendChild(el)
}

export function AutocompleteCell({
  value,
  suggestions,
  onChange,
  onKeyDown,
  inputRef: externalRef,
  onFocus,
  onBlur,
  placeholder: _placeholder,
  messages,
  className,
  isLoading = false,
}: AutocompleteCellProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const reduceMotion = useReducedMotion()
  const overlayContainer = useOverlayContainer()
  const [open, setOpen] = useState(false)

  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = externalRef || internalRef
  const placeholder = _placeholder ?? m.placeholder

  useEffect(() => { injectStyles() }, [])

  const filtered = value
    ? suggestions
        .filter(
          (s) =>
            s.key.toLowerCase().includes(value.toLowerCase()) ||
            s.label.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const q = value.toLowerCase()
          const rank = (s: AutocompleteSuggestion) => {
            if (s.key.toLowerCase().startsWith(q)) return 0
            if (s.label.toLowerCase().startsWith(q)) return 1
            if (s.key.toLowerCase().includes(q)) return 2
            return 3
          }
          return rank(a) - rank(b)
        })
    : []

  const isOpen = open && filtered.length > 0

  const combobox = useCombobox<AutocompleteSuggestion>({
    collection: createListCollection({
      items: filtered,
      itemToValue: (s) => String(s.id),
      itemToString: (s) => s.label,
    }),
    // Free text: the input value is the cell value. Picking an item writes
    // its label into the input (and thus into onChange); no selection is kept.
    inputValue: value,
    onInputValueChange: (details) => onChange(details.inputValue),
    value: [],
    allowCustomValue: true,
    open: isOpen,
    onOpenChange: (details) => setOpen(details.open),
    // Arrow keys on a closed list belong to the caller (table navigation).
    openOnKeyPress: false,
    inputBehavior: 'autohighlight',
    loopFocus: false,
    positioning: { placement: 'bottom-start', gutter: 6 },
  })

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab' && !e.shiftKey && isOpen && value.length > 0) {
      const exactMatch = filtered.find((s) => s.label.toLowerCase() === value.toLowerCase())
      if (!exactMatch) {
        e.preventDefault()
        onChange((combobox.highlightedItem ?? filtered[0]).label)
        setOpen(false)
        return
      }
    }

    // Typing after arrow navigation can clear the highlight without changing the list
    // (zag only re-highlights when the items change). Enter then takes the top match, like Tab.
    if (e.key === 'Enter' && isOpen && !combobox.highlightedItem) {
      e.preventDefault()
      onChange(filtered[0].label)
      setOpen(false)
      return
    }

    if (isOpen && LIST_KEYS.has(e.key)) return

    onKeyDown?.(e)
  }

  return (
    <Combobox.RootProvider
      value={combobox}
      lazyMount
      unmountOnExit
      className={cn('relative w-full group', className)}
    >
      {/* Ark points aria-labelledby of the list at this label; it also labels the input. */}
      <Combobox.Label className="sr-only">{placeholder}</Combobox.Label>

      <Combobox.Control className="border-border bg-card focus-within:border-ring focus-within:ring-ring/20 flex items-center gap-2 rounded-lg border px-3.5 transition-all duration-200 focus-within:ring-1">
        <span className="text-muted-foreground group-focus-within:text-accent shrink-0 transition-colors">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>

        <Combobox.Input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            e.target.select()
            onFocus?.()
          }}
          onBlur={() => {
            // A closed list can leave `open` set (no results, then focus left).
            // Reset it so later results do not reopen the list, which would
            // pull focus back. An open list closes itself on focus-outside.
            if (!isOpen) setOpen(false)
            onBlur?.()
          }}
          placeholder={placeholder}
          className="text-foreground placeholder:text-muted-foreground/40 min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              aria-label={m.clearLabel}
              className="text-muted-foreground hover:text-foreground shrink-0 rounded-full p-1 transition-colors hover:bg-foreground/5"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </Combobox.Control>

      <Portal container={overlayContainer}>
        <Combobox.Positioner style={{ zIndex: 50 }}>
          <Combobox.Content
            aria-label={m.suggestionsLabel}
            className={cn(
              'bg-card border-accent/50 scrollbar-thumb-accent/20 hover:scrollbar-thumb-accent/40 max-h-60 w-full scrollbar-thin overflow-y-auto rounded-lg border shadow-2xl outline-none',
              !reduceMotion && 'autocomplete-cell-list'
            )}
          >
            <div className="py-1">
              {filtered.map((item) => (
                <Combobox.Item
                  key={item.id}
                  item={item}
                  className="group/option text-foreground data-highlighted:bg-accent data-highlighted:text-white flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors"
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">{item.label}</span>
                    {item.subLabel && (
                      <span className="text-muted-foreground/80 group-data-highlighted/option:text-white/90 truncate text-[10px] transition-opacity">
                        {item.subLabel}
                      </span>
                    )}
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 opacity-20 transition-[opacity,transform] group-data-highlighted/option:translate-x-0.5 group-data-highlighted/option:opacity-100"
                  />
                </Combobox.Item>
              ))}
            </div>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.RootProvider>
  )
}
