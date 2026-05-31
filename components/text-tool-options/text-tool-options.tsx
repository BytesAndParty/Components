import React, { useState, useEffect, useRef, useId, type ReactNode } from 'react'
import { Portal } from '@ark-ui/react/portal'
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { NumberInput } from '../number-input/number-input'
import { ColorSwatch } from '../color-swatch/color-swatch'
import { useComponentMessages } from '../i18n'
import { MESSAGES } from './messages'
import {
  FONTS,
  GOOGLE_FONTS_URL,
  defaultTextFormat,
  type TextFormatValues,
  type TextToolOptionsMessages,
} from './types'

export type { TextFormatValues } from './types'

export interface TextToolOptionsProps {
  value?: Partial<TextFormatValues>
  onChange?: (patch: Partial<TextFormatValues>) => void
  className?: string
  messages?: Partial<TextToolOptionsMessages>
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TextToolOptions({ value, onChange, className, messages }: TextToolOptionsProps) {
  const fmt = { ...defaultTextFormat, ...value }
  const m = useComponentMessages(MESSAGES, messages)

  function set<K extends keyof TextFormatValues>(key: K, val: TextFormatValues[K]) {
    onChange?.({ [key]: val })
  }

  const alignTitles: Record<typeof fmt.textAlign, string> = {
    left: m.alignLeft,
    center: m.alignCenter,
    right: m.alignRight,
    justify: m.alignJustify,
  }

  // Load Google Fonts once
  useEffect(() => {
    const id = 'cellar-canvas-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = GOOGLE_FONTS_URL
    document.head.appendChild(link)
  }, [])

  return (
    <div
      className={cn(
        'flex items-center h-9 gap-0 bg-card border border-border rounded-lg text-sm select-none',
        className,
      )}
    >
      {/* ── Font Family ───────────────────────────────────────── */}
      <FontSelect
        value={fmt.fontFamily}
        onChange={(v) => set('fontFamily', v)}
      />

      <Divider />

      {/* ── Font Size ─────────────────────────────────────────── */}
      <div className="hover:bg-muted/50 flex h-full items-center px-2 transition-colors">
        <NumberInput
          value={fmt.fontSize}
          onChange={(v) => set('fontSize', v)}
          min={6} max={200} step={1}
          unit="px"
        />
      </div>

      <Divider />

      {/* ── Bold / Italic / Underline ─────────────────────────── */}
      <div className="flex h-full items-center">
        <ToggleBtn
          active={fmt.bold}
          onClick={() => set('bold', !fmt.bold)}
          title={m.bold}
        >
          <Bold size={13} strokeWidth={2.5} />
        </ToggleBtn>
        <ToggleBtn
          active={fmt.italic}
          onClick={() => set('italic', !fmt.italic)}
          title={m.italic}
        >
          <Italic size={13} strokeWidth={2.5} />
        </ToggleBtn>
        <ToggleBtn
          active={fmt.underline}
          onClick={() => set('underline', !fmt.underline)}
          title={m.underline}
        >
          <Underline size={13} strokeWidth={2.5} />
        </ToggleBtn>
      </div>

      <Divider />

      {/* ── Alignment ─────────────────────────────────────────── */}
      <div className="flex h-full items-center">
        {(['left', 'center', 'right', 'justify'] as const).map((align) => {
          const Icon = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify }[align]
          return (
            <ToggleBtn
              key={align}
              active={fmt.textAlign === align}
              onClick={() => set('textAlign', align)}
              title={alignTitles[align]}
            >
              <Icon size={13} strokeWidth={2} />
            </ToggleBtn>
          )
        })}
      </div>

      <Divider />

      {/* ── Letter Spacing ────────────────────────────────────── */}
      <div className="hover:bg-muted/50 flex h-full items-center px-2 transition-colors">
        <NumberInput
          value={fmt.charSpacing}
          onChange={(v) => set('charSpacing', v)}
          min={-200} max={800} step={10}
          label="LS"
        />
      </div>

      {/* ── Line Height ───────────────────────────────────────── */}
      <div className="hover:bg-muted/50 border-border flex h-full items-center border-l px-2 transition-colors">
        <NumberInput
          value={fmt.lineHeight}
          onChange={(v) => set('lineHeight', v)}
          min={0.5} max={4} step={0.1} decimals={1}
          label="LH"
        />
      </div>

      <Divider />

      {/* ── Color ─────────────────────────────────────────────── */}
      <ColorSwatch value={fmt.color} onChange={(v) => set('color', v)} title={m.textColor} label="A" />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return <div className="bg-border mx-0.5 h-5 w-px shrink-0" />
}

function ToggleBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean
  onClick: () => void
  title?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center w-8 h-full transition-colors',
        active
          ? 'text-accent bg-accent/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
      )}
    >
      {children}
    </button>
  )
}

function FontSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const current = FONTS.find(f => f.family === value) ?? FONTS[0]
  const listboxId = useId()

  function handleOpen() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setOpen((prev: boolean) => !prev)
  }

  return (
    <div className="h-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        className="hover:bg-muted/50 flex h-full max-w-[200px] min-w-[160px] items-center gap-1.5 px-3 transition-colors"
        style={{ fontFamily: current.family }}
      >
        <span className="text-foreground flex-1 truncate text-left text-sm">
          {current.family}
        </span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
          className={cn('text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')}
        >
          <path d="M5 6.5L1.5 3h7L5 6.5z" />
        </svg>
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            id={listboxId}
            role="listbox"
            className="bg-card border-border fixed z-50 min-w-[200px] overflow-hidden rounded-lg border shadow-xl"
            style={{ top: pos.top, left: pos.left }}
          >
            {(['Serif', 'Display', 'Script', 'Sans-serif'] as const).map(cat => {
              const fontsInCat = FONTS.filter(f => f.category === cat)
              if (!fontsInCat.length) return null
              return (
                <div key={cat} role="presentation">
                  <div className="text-muted-foreground bg-muted/30 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
                    {cat}
                  </div>
                  {fontsInCat.map(font => (
                    <button
                      key={font.family}
                      type="button"
                      role="option"
                      aria-selected={value === font.family}
                      onClick={() => { onChange(font.family); setOpen(false) }}
                      className={cn(
                        'w-full flex items-center px-3 py-2 text-sm text-left transition-colors hover:bg-muted/60',
                        value === font.family ? 'text-accent bg-accent/10' : 'text-foreground',
                      )}
                      style={{ fontFamily: font.family }}
                    >
                      {font.family}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </Portal>
      )}
    </div>
  )
}
