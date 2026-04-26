import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight, Loader2 } from 'lucide-react'

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

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
  className?: string
  isLoading?: boolean
}

export function AutocompleteCell({
  value,
  suggestions,
  onChange,
  onKeyDown,
  inputRef: externalRef,
  onFocus,
  onBlur,
  placeholder = 'Suchen...',
  className,
  isLoading = false,
}: AutocompleteCellProps) {
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = externalRef || internalRef

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

  useEffect(() => {
    setHighlightIndex(0)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectItem(item: AutocompleteSuggestion) {
    onChange(item.key)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (open && filtered.length > 0 && value.length > 0) {
        const exactMatch = filtered.find((s) => s.key.toLowerCase() === value.toLowerCase())
        if (!exactMatch) {
          e.preventDefault()
          const idx = Math.min(highlightIndex, filtered.length - 1)
          onChange(filtered[idx].key)
          setOpen(false)
          return
        }
      }
    }

    if (open && filtered.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        selectItem(filtered[highlightIndex])
        return
      }
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
    }

    onKeyDown?.(e)
  }

  return (
    <div ref={containerRef} className={cn('relative w-full group', className)}>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 transition-colors focus-within:border-accent">
        <span className="shrink-0 text-muted-foreground transition-colors group-focus-within:text-accent">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            e.target.select()
            setOpen(true)
            onFocus?.()
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-1.5 w-full bg-card border border-accent rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-border"
          >
            <div className="py-1">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    'w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-3 transition-colors',
                    i === highlightIndex
                      ? 'bg-accent text-white'
                      : 'hover:bg-white/5 text-foreground'
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    selectItem(item)
                  }}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.subLabel && (
                      <span className={cn(
                        'text-[10px] truncate opacity-70',
                        i === highlightIndex ? 'text-white' : 'text-muted-foreground'
                      )}>
                        {item.subLabel}
                      </span>
                    )}
                  </div>
                  <ChevronRight className={cn(
                    'h-3.5 w-3.5 shrink-0 opacity-40 transition-[opacity,transform]',
                    i === highlightIndex && 'translate-x-0.5 opacity-100'
                  )} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
