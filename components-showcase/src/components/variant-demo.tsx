import { useState, type ReactNode } from 'react'
import { SegmentGroup } from '@ark-ui/react/segment-group'
import { Select } from '@ark-ui/react/select'
import { createListCollection } from '@ark-ui/react/collection'
import { cn } from '@components/lib/utils'

export interface VariantOption<T extends string = string> {
  value: T
  label: string
  /** Props of this option, shown under the stage, e.g. `variant="shimmer"`. */
  snippet?: string
}

export interface VariantAxis<T extends string = string> {
  label: string
  options: VariantOption<T>[]
  defaultValue?: T
}

// Above this many options an axis renders as a compact Select instead of a segment group.
const MAX_SEGMENTS = 6

/**
 * One instance of a component plus a switcher for its variants. The instance is remounted on
 * every switch, so mount, scroll-in and in-view animations replay. A second axis can be fixed
 * or depend on the first value; a second value missing from the new list falls back to the
 * axis default.
 */
export function VariantDemo<A extends string, B extends string = never>({
  label = 'variant',
  options,
  defaultValue,
  secondary,
  render,
  className,
}: {
  label?: string
  options: VariantOption<A>[]
  defaultValue?: A
  secondary?: VariantAxis<B> | ((value: A) => VariantAxis<B> | undefined)
  render: (value: A, secondaryValue: B | undefined) => ReactNode
  /** Stage layout; pass a `min-h-*` that fits the tallest option so the page does not jump. */
  className?: string
}) {
  const [value, setValue] = useState<A>(defaultValue ?? options[0].value)
  const [picked, setPicked] = useState<B>()
  const axis2 = typeof secondary === 'function' ? secondary(value) : secondary
  const option1 = options.find(o => o.value === value) ?? options[0]
  const option2 = axis2 && (
    axis2.options.find(o => o.value === picked)
    ?? axis2.options.find(o => o.value === axis2.defaultValue)
    ?? axis2.options[0]
  )
  const snippet = [option1.snippet, option2?.snippet].filter(Boolean).join(' · ')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        <AxisSwitch axis={{ label, options }} value={value} onChange={setValue} />
        {axis2 && option2 && <AxisSwitch axis={axis2} value={option2.value} onChange={setPicked} />}
      </div>
      <div key={`${value}|${option2?.value ?? ''}`} className={cn('flex min-h-40 items-center justify-center', className)}>
        {render(value, option2?.value)}
      </div>
      {snippet && (
        <p className="text-muted-foreground mt-4 text-xs">
          <code>{snippet}</code>
        </p>
      )}
    </div>
  )
}

function AxisSwitch<T extends string>({ axis, value, onChange }: {
  axis: VariantAxis<T>
  value: T
  onChange: (value: T) => void
}) {
  if (axis.options.length > MAX_SEGMENTS) {
    const collection = createListCollection({ items: axis.options })
    return (
      <Select.Root
        collection={collection}
        value={[value]}
        onValueChange={details => {
          const next = details.value[0]
          if (next) onChange(next as T)
        }}
        positioning={{ placement: 'bottom-start', gutter: 4 }}
        lazyMount
        unmountOnExit
        className="flex items-center gap-3"
      >
        <Select.Label className="text-muted-foreground text-xs">{axis.label}</Select.Label>
        <Select.Control>
          <Select.Trigger className="border-border bg-card hover:bg-muted/50 focus-visible:ring-accent/60 flex min-h-11 min-w-44 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none">
            <Select.ValueText className="text-foreground truncate" />
            <Select.Indicator className="text-muted-foreground transition-transform data-[state=open]:rotate-180">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                <path d="M5 6.5L1.5 3h7L5 6.5z" />
              </svg>
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner style={{ zIndex: 50 }}>
          <Select.Content className="bg-card border-border max-h-80 min-w-44 overflow-y-auto rounded-lg border p-1 shadow-xl outline-none">
            {axis.options.map(option => (
              <Select.Item
                key={option.value}
                item={option}
                className="text-muted-foreground data-highlighted:bg-muted data-highlighted:text-foreground data-[state=checked]:text-foreground flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md px-3 text-sm"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="text-accent">✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    )
  }

  return (
    <SegmentGroup.Root
      value={value}
      onValueChange={details => {
        if (details.value) onChange(details.value as T)
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <SegmentGroup.Label className="text-muted-foreground text-xs">{axis.label}</SegmentGroup.Label>
      <div className="bg-muted/50 relative flex flex-wrap rounded-lg p-1">
        <SegmentGroup.Indicator
          className="bg-accent/15 ring-accent/40 absolute rounded-md ring-1 ring-inset motion-safe:transition-[left,top,width,height] motion-safe:duration-200"
          style={{ left: 'var(--left)', top: 'var(--top)', width: 'var(--width)', height: 'var(--height)' }}
        />
        {axis.options.map(option => (
          <SegmentGroup.Item
            key={option.value}
            value={option.value}
            className="text-muted-foreground hover:text-foreground data-[state=checked]:text-foreground has-[input:focus-visible]:ring-accent/60 relative flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md px-3 text-sm transition-colors has-[input:focus-visible]:ring-2"
          >
            <SegmentGroup.ItemText>{option.label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemControl />
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        ))}
      </div>
    </SegmentGroup.Root>
  )
}
