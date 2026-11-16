import type { ReactNode } from 'react'
import { Tabs } from '@ark-ui/react/tabs'

export interface DemoTab {
  value: string
  label: string
  content: ReactNode
}

/** Bundles related variants of one component into tabs; only the active tab is mounted. */
export function DemoTabs({ tabs }: { tabs: DemoTab[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value} lazyMount unmountOnExit>
      <Tabs.List className="border-border relative mb-8 flex gap-1 border-b">
        {tabs.map(tab => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="text-muted-foreground hover:text-foreground data-selected:text-foreground focus-visible:ring-accent/60 min-h-11 cursor-pointer px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator
          className="bg-accent absolute bottom-0 h-0.5 rounded-full motion-safe:transition-[left,width] motion-safe:duration-200"
          style={{ left: 'var(--left)', width: 'var(--width)' }}
        />
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content key={tab.value} value={tab.value}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
