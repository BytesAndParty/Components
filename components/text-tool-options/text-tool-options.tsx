import { useState, useEffect, useRef } from 'react'
import { Popover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { NumberInput } from '../number-input/number-input'
import { ColorPickerPanel } from '../color-picker/color-picker'
import { useComponentMessages } from '../i18n'
import type { ComponentMessages } from '../i18n'

// ── Font catalogue ────────────────────────────────────────────────────────────

const FONTS = [
  { family: 'Playfair Display',    category: 'Serif' },
  { family: 'Cormorant Garamond',  category: 'Serif' },
  { family: 'Lora',                category: 'Serif' },
  { family: 'EB Garamond',         category: 'Serif' },
  { family: 'Libre Baskerville',   category: 'Serif' },
  { family: 'Cinzel',              category: 'Display' },
  { family: 'Great Vibes',         category: 'Script' },
  { family: 'Dancing Script',      category: 'Script' },
  { family: 'Montserrat',          category: 'Sans-serif' },
  { family: 'Inter',               category: 'Sans-serif' },
]

const GOOGLE_FONTS_URL =
  `https://fonts.googleapis.com/css2?${FONTS.map(f =>
    `family=${f.family.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400`
  ).join('&')}&display=swap`

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TextFormatValues {
  fontFamily:   string
  fontSize:     number
  bold:         boolean
  italic:       boolean
  underline:    boolean
  textAlign:    'left' | 'center' | 'right' | 'justify'
  charSpacing:  number   // Fabric units: 1/1000 em  (range: -200…800)
  lineHeight:   number   // multiplier: 0.8…3.0
  color:        string   // hex
}

export const defaultTextFormat: TextFormatValues = {
  fontFamily:  'Playfair Display',
  fontSize:    24,
  bold:        false,
  italic:      false,
  underline:   false,
  textAlign:   'left',
  charSpacing: 0,
  lineHeight:  1.2,
  color:       '#000000',
}

export type TextToolOptionsMessages = {
  bold: string
  italic: string
  underline: string
  alignLeft: string
  alignCenter: string
  alignRight: string
  alignJustify: string
  textColor: string
}

const TEXT_TOOL_OPTIONS_MESSAGES = {
  de: {
    bold: 'Fett (Strg+B)',
    italic: 'Kursiv (Strg+I)',
    underline: 'Unterstrichen (Strg+U)',
    alignLeft: 'Linksbündig',
    alignCenter: 'Zentriert',
    alignRight: 'Rechtsbündig',
    alignJustify: 'Blocksatz',
    textColor: 'Textfarbe',
  },
  en: {
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Justify',
    textColor: 'Text color',
  },
} as const satisfies ComponentMessages<TextToolOptionsMessages>

export interface TextToolOptionsProps {
  value?: Partial<TextFormatValues>
  onChange?: (patch: Partial<TextFormatValues>) => void
  className?: string
  messages?: Partial<TextToolOptionsMessages>
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TextToolOptions({ value, onChange, className, messages }: TextToolOptionsProps) {
  const fmt = { ...defaultTextFormat, ...value }
  const m = useComponentMessages(TEXT_TOOL_OPTIONS_MESSAGES, messages)

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
      <div className="flex items-center px-2 h-full hover:bg-muted/50 transition-colors">
        <NumberInput
          value={fmt.fontSize}
          onChange={(v) => set('fontSize', v)}
          min={6} max={200} step={1}
          unit="px"
        />
      </div>

      <Divider />

      {/* ── Bold / Italic / Underline ─────────────────────────── */}
      <div className="flex items-center h-full">
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
      <div className="flex items-center h-full">
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
      <div className="flex items-center px-2 h-full hover:bg-muted/50 transition-colors">
        <NumberInput
          value={fmt.charSpacing}
          onChange={(v) => set('charSpacing', v)}
          min={-200} max={800} step={10}
          label="LS"
        />
      </div>

      {/* ── Line Height ───────────────────────────────────────── */}
      <div className="flex items-center px-2 h-full hover:bg-muted/50 transition-colors border-l border-border">
        <NumberInput
          value={fmt.lineHeight}
          onChange={(v) => set('lineHeight', v)}
          min={0.5} max={4} step={0.1} decimals={1}
          label="LH"
        />
      </div>

      <Divider />

      {/* ── Color ─────────────────────────────────────────────── */}
      <ColorSwatch color={fmt.color} onChange={(v) => set('color', v)} title={m.textColor} />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return <div className="w-px h-5 bg-border shrink-0 mx-0.5" />
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
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
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
        className="flex items-center gap-1.5 px-3 h-full hover:bg-muted/50 transition-colors min-w-[160px] max-w-[200px]"
        style={{ fontFamily: current.family }}
      >
        <span className="text-sm text-foreground truncate flex-1 text-left">
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
            className="fixed z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden min-w-[200px]"
            style={{ top: pos.top, left: pos.left }}
          >
            {(['Serif', 'Display', 'Script', 'Sans-serif'] as const).map(cat => {
              const fontsInCat = FONTS.filter(f => f.category === cat)
              if (!fontsInCat.length) return null
              return (
                <div key={cat}>
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted/30">
                    {cat}
                  </div>
                  {fontsInCat.map(font => (
                    <button
                      key={font.family}
                      type="button"
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

function ColorSwatch({ color, onChange, title }: { color: string; onChange: (v: string) => void; title?: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          title={title}
          className="flex items-center gap-1.5 px-3 h-full hover:bg-muted/50 transition-colors"
        >
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">A</span>
          <span
            className="w-4 h-1.5 rounded-full border border-border/50 shadow-sm"
            style={{ background: color }}
          />
        </button>
      </Popover.Trigger>

      <Portal>
      <Popover.Positioner style={{ zIndex: 50 }}>
        <Popover.Content>
          <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
            <ColorPickerPanel
              value={color}
              onChange={onChange}
              presets={[
                '#000000', '#ffffff', '#722f37', '#d4af37',
                '#4a0e1a', '#f5f0e8', '#2c1810', '#c5a028',
              ]}
            />
          </div>
        </Popover.Content>
      </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
