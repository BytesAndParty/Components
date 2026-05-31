import type { ReactNode } from 'react'
import { Popover } from '@ark-ui/react/popover'
import { Portal } from '@ark-ui/react/portal'
import { cn } from '../lib/utils'
import { ColorPickerPanel, type PaletteGroup } from '../color-picker/color-picker'
import { useComponentMessages, useArkTranslations } from '../i18n'
import { MESSAGES, type ColorSwatchMessages } from './messages'

export type { ColorSwatchMessages }

export interface ColorSwatchProps {
  /** Current colour as hex string (`#rrggbb` or `#rrggbbaa` when alpha). */
  value: string
  onChange: (hex: string) => void
  /** Optional leading badge (e.g. `A` for text colour, `■` for fill). */
  label?: ReactNode
  /** Tooltip / aria-label for the trigger button. Falls back to the i18n string. */
  title?: string
  /** Forwarded to the underlying `ColorPickerPanel`. */
  showAlpha?: boolean
  presets?: string[]
  paletteGroups?: PaletteGroup[]
  className?: string
  messages?: Partial<ColorSwatchMessages>
}

/** Cellar Canvas default presets — wine-cellar palette. */
const DEFAULT_PRESETS = [
  '#000000', '#ffffff', '#722f37', '#d4af37',
  '#4a0e1a', '#f5f0e8', '#2c1810', '#c5a028',
]

/**
 * Compact colour-picker trigger: a tiny coloured pill in a button that opens
 * the full `ColorPickerPanel` in a popover. Shared by `TextToolOptions`
 * (text colour) and `ContextToolbar` (shape fill) so both call sites stay
 * visually and behaviourally consistent.
 */
export function ColorSwatch({
  value,
  onChange,
  label,
  title,
  showAlpha,
  presets = DEFAULT_PRESETS,
  paletteGroups = [],
  className,
  messages,
}: ColorSwatchProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const popoverTranslations = useArkTranslations('popover')

  return (
    <Popover.Root translations={popoverTranslations}>
      <Popover.Trigger asChild>
        <button
          type="button"
          title={title ?? m.trigger}
          aria-label={title ?? m.trigger}
          className={cn(
            'flex items-center gap-1.5 px-3 h-full hover:bg-muted/50 transition-colors',
            className,
          )}
        >
          {label && (
            <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              {label}
            </span>
          )}
          <span
            className="border-border/50 h-1.5 w-4 rounded-full border shadow-sm"
            style={{ background: value }}
          />
        </button>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner style={{ zIndex: 50 }}>
          <Popover.Content>
            <div className="bg-card border-border w-72 rounded-xl border p-3 shadow-xl">
              <ColorPickerPanel
                value={value}
                onChange={onChange}
                showAlpha={showAlpha}
                presets={presets}
                paletteGroups={paletteGroups}
              />
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
