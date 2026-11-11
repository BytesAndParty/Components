import { useEffect, type ReactNode } from 'react'
import { Portal } from '@ark-ui/react/portal'
import { Select } from '@ark-ui/react/select'
import { createListCollection } from '@ark-ui/react/collection'
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useOverlayContainer } from '../lib/overlay-container'
import { NumberInput } from '../number-input/number-input'
import { ColorSwatch } from '../color-swatch/color-swatch'
import { useComponentMessages } from '../i18n'
import { MESSAGES } from './messages'
import { ensureFontStylesheet } from './font-loader'
import {
  FONTS,
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

  // The font list previews every family in its own face.
  useEffect(() => {
    void ensureFontStylesheet()
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
        label={m.fontFamily}
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

const FONT_CATEGORIES = ['Serif', 'Display', 'Script', 'Sans-serif'] as const

interface FontItem {
  family: string
  /** `null`: a font outside the list, shown ungrouped at the top. */
  category: string | null
}

const fontItemCls =
  'text-foreground data-highlighted:bg-muted/60 data-[state=checked]:text-accent data-[state=checked]:bg-accent/10 flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm outline-none transition-colors'

/**
 * Font picker on Ark UI's Select: arrow keys, Home/End, type-ahead and Escape
 * come with it. The list mounts on open only, so its previews do not fetch
 * all ten families up front.
 */
function FontSelect({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (v: string) => void
  label: string
}) {
  const overlayContainer = useOverlayContainer()
  // A text may be set in a font outside the list (system fonts on older
  // labels). It is listed as what it is; falling back to the first entry
  // claimed "Playfair Display" for a sans-serif text.
  const unlisted: FontItem[] = FONTS.some(f => f.family === value) ? [] : [{ family: value, category: null }]
  const collection = createListCollection<FontItem>({
    items: [...unlisted, ...FONTS],
    itemToValue: (font) => font.family,
    itemToString: (font) => font.family,
  })

  return (
    <Select.Root
      collection={collection}
      value={[value]}
      onValueChange={(details) => {
        const next = details.value[0]
        if (next) onChange(next)
      }}
      positioning={{ placement: 'bottom-start', gutter: 4 }}
      lazyMount
      unmountOnExit
      className="h-full"
    >
      <Select.Label className="sr-only">{label}</Select.Label>
      <Select.Control className="h-full">
        <Select.Trigger
          className="hover:bg-muted/50 focus-visible:ring-accent/60 flex h-full max-w-50 min-w-40 items-center gap-1.5 px-3 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
          style={{ fontFamily: value }}
        >
          <Select.ValueText className="text-foreground flex-1 truncate text-left text-sm" />
          <Select.Indicator className="text-muted-foreground shrink-0 transition-transform data-[state=open]:rotate-180">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
              <path d="M5 6.5L1.5 3h7L5 6.5z" />
            </svg>
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>

      <Portal container={overlayContainer}>
        <Select.Positioner style={{ zIndex: 50 }}>
          <Select.Content className="bg-card border-border max-h-80 min-w-50 overflow-y-auto rounded-lg border shadow-xl outline-none">
            {unlisted.map(font => (
              <Select.Item key={font.family} item={font} className={fontItemCls} style={{ fontFamily: font.family }}>
                <Select.ItemText>{font.family}</Select.ItemText>
              </Select.Item>
            ))}
            {FONT_CATEGORIES.map(category => (
              <Select.ItemGroup key={category}>
                <Select.ItemGroupLabel className="text-muted-foreground bg-muted/30 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
                  {category}
                </Select.ItemGroupLabel>
                {FONTS.filter(font => font.category === category).map(font => (
                  <Select.Item key={font.family} item={font} className={fontItemCls} style={{ fontFamily: font.family }}>
                    <Select.ItemText>{font.family}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
