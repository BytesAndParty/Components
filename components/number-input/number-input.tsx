import { useState, useEffect, useRef, useId } from 'react'
import { cn } from '../lib/utils'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  decimals?: number
  unit?: string
  label?: string
  className?: string
}

export function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  decimals = 0,
  unit,
  label,
  className,
}: NumberInputProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nudgeRef = useRef<(dir: 1 | -1) => void>(() => {})
  const inputId = useId()

  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const display = decimals > 0 ? value.toFixed(decimals) : String(value)

  function commit(raw: string) {
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) onChange(clamp(parsed))
    setEditing(false)
  }

  function nudge(dir: 1 | -1) {
    onChange(clamp(parseFloat((value + dir * step).toFixed(decimals + 2))))
  }
  nudgeRef.current = nudge

  // Non-passive wheel listener so preventDefault() actually prevents page scroll
  useEffect(() => {
    const el = buttonRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      nudgeRef.current(e.deltaY < 0 ? 1 : -1)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [editing])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.currentTarget.blur(); return }
    if (e.key === 'Escape') { setEditing(false); return }
    if (e.key === 'ArrowUp')   { e.preventDefault(); nudge(1) }
    if (e.key === 'ArrowDown') { e.preventDefault(); nudge(-1) }
  }

  return (
    <div className={cn('group relative flex items-center gap-0', className)}>
      {label && (
        <label 
          htmlFor={inputId}
          className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1 select-none cursor-pointer"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Decrement */}
        <button
          type="button"
          tabIndex={-1}
          onPointerDown={(e) => { e.preventDefault(); nudge(-1) }}
          className="flex items-center justify-center w-5 h-full text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 select-none"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <path d="M4 5.5L1 2.5h6L4 5.5z" />
          </svg>
        </button>

        {/* Input */}
        {editing ? (
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-10 text-center text-xs font-mono bg-transparent text-foreground focus:outline-none"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <button
            id={inputId}
            ref={buttonRef}
            type="button"
            onDoubleClick={() => { setDraft(display); setEditing(true) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDraft(display); setEditing(true) }
              if (e.key === 'ArrowUp')   { e.preventDefault(); nudge(1) }
              if (e.key === 'ArrowDown') { e.preventDefault(); nudge(-1) }
            }}
            className="w-10 text-center text-xs font-mono text-foreground cursor-ns-resize select-none hover:text-foreground transition-colors"
          >
            {display}{unit && <span className="text-muted-foreground">{unit}</span>}
          </button>
        )}

        {/* Increment */}
        <button
          type="button"
          tabIndex={-1}
          onPointerDown={(e) => { e.preventDefault(); nudge(1) }}
          className="flex items-center justify-center w-5 h-full text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 select-none"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <path d="M4 2.5L7 5.5H1L4 2.5z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
