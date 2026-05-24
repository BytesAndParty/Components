import type { ComponentType } from 'react'

export interface SectionVariant {
  id: string                  // url-safe: 'v1', 'editorial', ...
  label: string               // human label shown in the switcher
  description?: string        // one-line note about the design idea
  Component: ComponentType
}

export interface SectionDef {
  id: string                  // url-safe section name: 'hero', 'features', ...
  label: string               // navigation label
  description?: string        // one-line section summary
  variants: SectionVariant[]
}
