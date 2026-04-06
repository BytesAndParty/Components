import { useEffect, useState } from 'react'

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

export interface AutocompleteSuggestion {
  id: number | string
  key: string
  label: string
}

interface AutocompleteCellProps {
  value: string
  suggestions: AutocompleteSuggestion[]
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef?: (el: HTMLInputElement | null) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

/**
 * An input field with filtered autocomplete suggestions.
 */
export function AutocompleteCell({
  value,
  suggestions,
  onChange,
  onKeyDown,
  inputRef,
  onFocus,
  onBlur,
  placeholder = '–',
  className,
}: AutocompleteCellProps) {
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)

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
    : suggestions

  useEffect(() => {
    setHighlightIndex(0)
  }, [value])

  function selectItem(item: AutocompleteSuggestion) {
    onChange(item.key)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (filtered.length > 0 && value.length > 0) {
        const exactMatch = filtered.find((s) => s.key.toLowerCase() === value.toLowerCase())
        if (!exactMatch) {
          e.preventDefault()
          const idx = Math.min(highlightIndex, filtered.length - 1)
          onChange(filtered[idx].key)
          setOpen(false)
          return
        }
        onChange(exactMatch.key)
      }
      setOpen(false)
      onKeyDown?.(e)
      return
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

  function handleBlur() {
    setTimeout(() => {
      setOpen(false)
      onBlur?.()
    }, 150)
  }

  return (
    <div className={cn('relative w-full', className)}>
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
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-2 text-sm font-mono outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent rounded-md transition-shadow"
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-1.5 w-64 bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-border animate-in fade-in zoom-in-95 duration-100">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                'w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition-colors',
                i === highlightIndex
                  ? 'bg-accent/10 text-accent'
                  : 'hover:bg-white/5 text-foreground'
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                selectItem(item)
              }}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              <span className="font-mono text-[10px] bg-white/5 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50 shrink-0">
                {item.key}
              </span>
              <span className="truncate opacity-80">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
