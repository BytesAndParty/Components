# Language Switcher

A locale picker component designed for the application navbar. It integrates with the Atelier system to manage and persist the user's preferred language.

## Features

- **Atelier Integration:** Consumes and updates the global `locale` via `useAtelier()`.
- **Persistent State:** Syncs with the centralized i18n storage (`design-engine-locale`).
- **Interactive UI:** Features a globe icon with a rotating animation on hover and a flipping badge that reflects the current locale.
- **Accessible Dropdown:** Follows WAI-ARIA patterns for listboxes, including keyboard dismiss and focus management.
- **Zero-Dependency Styling:** Uses pure inline styles and injected CSS keyframes, making it highly portable.
- **Visual Feedback:** Micro-animations for the globe and the locale badge during transitions.

## How It Works

The component uses a standard `button` trigger that opens a `div`-based listbox. It listens for clicks outside the component to automatically close the menu.

When a new language is selected, it triggers a "flip" animation on the trigger's badge before updating the global `locale` state. This state update then ripples through the `AtelierProvider` to update the DOM (`lang` attribute) and all localized components.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `languages` | `Record<string, LanguageOption>` | *DE & EN* | Dictionary of available languages with labels and short labels. |
| `triggerLabel` | `string` | *i18n default* | Aria-label for the trigger button. |
| `onChange` | `(locale: string) => void` | — | Callback triggered when the language is changed. |
| `className` | `string` | — | CSS class for the wrapper div. |
| `style` | `CSSProperties` | — | Inline styles for the wrapper div. |
| `messages` | `Partial<LanguageSwitcherMessages>` | — | Custom UI strings. |

## Usage

```tsx
import { LanguageSwitcher } from '@components/language-switcher'

export function Navbar() {
  return (
    <nav>
      {/* ... */}
      <LanguageSwitcher />
    </nav>
  )
}
```

## Dependencies

| Package | Purpose |
|---|---|
| `react` | UI Library |
| `@local/atelier` | Design system context |
| `@local/i18n` | Internal i18n hooks and logic |
