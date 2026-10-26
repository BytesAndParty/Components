# Hotkeys System

A global shortcut registry and management system built on top of TanStack Hotkeys. It provides a bridge between functional shortcuts and a visual overview for the user.

## Features

- **Global Registry:** Automatically tracks all active shortcuts across the application.
- **Visual Overview:** A modal dialog (triggered by `?`) showing all registered shortcuts grouped by category.
- **Intelligent Disabling:** Shortcuts are automatically disabled on touch-only devices where keyboard interaction is unavailable.
- **Rich Metadata:** Supports labels, descriptions, and categories for better user orientation.
- **Context-Aware:** Shortcuts registered within components are automatically added to the registry on mount and removed on unmount.

## How It Works

The system consists of three main parts:

1. **`HotkeysProvider`:** Maintains a `Map` of active shortcuts.
2. **`useDesignEngineHotkey`:** A wrapper around TanStack's `useHotkey`. It handles the functional shortcut registration while simultaneously pushing metadata to the provider's registry. It also checks for fine-pointer capabilities (via `useDeviceCapabilities`) to prevent registration on touch devices. It takes one chord (string or `RawHotkeyChord` object, no sequences); the registry stores it as the normalized chord string from `normalizeHotkey` (e.g. `Mod+Shift+Z`).
3. **`ShortcutOverview`:** A visual component that consumes the registry and renders a categorized list of all active shortcuts. Key labels come from the library's `formatForDisplay`, so they match the platform (`⇧ ⌘ Z` on macOS, `Ctrl Shift Z` on Windows/Linux).

Categories supported: `Global`, `Navigation`, `Actions`, `Context`.

## Props

### HotkeysProvider

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The application tree. |

### useDesignEngineHotkey (hook)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `key` | `RegisterableHotkeyChord` | — | One chord: string (`'Mod+K'`) or object (`{ key: 'K', mod: true }`). |
| `callback` | `(event: KeyboardEvent) => void` | — | Runs when the chord fires. |
| `metadata` | `{ label, description?, category }` | — | Entry for the `ShortcutOverview`. |
| `options` | `UseHotkeyChordOptions` | — | Passed to `useHotkey` (`ignoreInputs`, `preventDefault`, `eventType`, `target`, …). `enabled` is combined with the fine-pointer check. |

### ShortcutOverview

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional CSS classes for the dialog. |
| `messages` | `Partial<ShortcutOverviewMessages>` | — | Custom UI strings. |

## Usage

### Setup

```tsx
import { HotkeysProvider } from '@components/hotkeys/hotkeys-provider'
import { ShortcutOverview } from '@components/hotkeys/shortcut-overview'

export function Layout({ children }) {
  return (
    <HotkeysProvider>
      {children}
      <ShortcutOverview />
    </HotkeysProvider>
  )
}
```

### Registering a Hotkey

```tsx
import { useDesignEngineHotkey } from '@components/hotkeys/hotkeys-context'

export function SearchButton() {
  const openSearch = () => { /* ... */ }

  useDesignEngineHotkey('Mod+k', openSearch, {
    label: 'Search',
    description: 'Open the global search overlay',
    category: 'Global'
  })

  return <button onClick={openSearch}>Search (⌘K)</button>
}
```

## Dependencies

| Package | Purpose |
|---|---|
| `@tanstack/react-hotkeys` `^0.17.0` (alpha) | Core hotkey management, `normalizeHotkey`/`formatForDisplay` for the overview |
| `react` | UI Library |
| `@components/lib` | Device capabilities check |
| `@components/i18n` | UI strings management |
