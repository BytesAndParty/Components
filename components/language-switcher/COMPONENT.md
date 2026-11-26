# Language Switcher

A locale picker component designed for the application navbar. It integrates with the Atelier system to manage and persist the user's preferred language.

## Features

- **Atelier Integration:** Consumes and updates the global `locale` via `useAtelier()`.
- **Persistent State:** The `AtelierProvider` persists the locale in `localStorage` (`atelier-locale`).
- **Interactive UI:** Features a globe icon with a rotating animation on hover and a flipping badge that reflects the current locale.
- **Accessible Dropdown:** Ark UI `Select`: in the open list arrow keys, Home/End, typeahead on the language name, Enter and Escape; outside click and focus return to the trigger.
- **Zero-Tailwind Styling:** Uses pure inline styles plus a `<style>` block for keyframes and state selectors, making it highly portable.
- **Visual Feedback:** Micro-animations for the globe and the locale badge during transitions.

## How It Works

The component is an Ark UI `Select.Root` over a list collection built from `languages` (value = locale key, typeahead text = `label`). The value is controlled by the `locale` from `useAtelier()`. The trigger is the globe button with the locale badge (no `ValueText`), labelled via `triggerLabel`. Ark points `aria-labelledby` of the trigger and the list at the id of a `Select.Label`, so `triggerLabel` is also rendered as a visually hidden `Select.Label` (inline style, no `sr-only` because the component has no Tailwind dependency); the `aria-label` on both stays as a fallback. The list portals into `useOverlayContainer()` (falls back to `<body>`), so it stays visible above hosts with their own `z-index` such as the designer's CSS fullscreen. It opens at `bottom-end` and is only mounted while open.

Unlike a native select, arrow left/right, Home/End and typeahead on the focused, closed trigger do nothing: Ark would change the language of the whole UI directly, which is too easy to trigger by accident. Enter, Space and arrow down open the list; with the list open the arrows and typeahead move the highlight and Enter selects.

Hover and keyboard highlight share one style via `[data-highlighted]`, the open trigger via `[data-state="open"]`; both live in the `<style>` block because inline styles would override them.

When a new language is selected, it triggers a 150 ms "flip" animation on the trigger's badge before updating the global `locale` state. This state update then ripples through the `AtelierProvider` to update the DOM (`lang` attribute) and all localized components. `prefers-reduced-motion` is handled once, in the `<style>` block (globe spin and badge flip off).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `languages` | `Record<string, LanguageOption>` | *DE, EN & PL* | Dictionary of available languages with labels and short labels. |
| `triggerLabel` | `string` | *i18n default* | Accessible name of the trigger and the list (hidden label and `aria-label`). |
| `onChange` | `(locale: string) => void` | — | Callback triggered when the language is changed. |
| `className` | `string` | — | CSS class for the wrapper div. |
| `style` | `CSSProperties` | — | Inline styles for the wrapper div. |
| `messages` | `Partial<LanguageSwitcherMessages>` | — | Custom UI strings. |

## Usage

```tsx
import { LanguageSwitcher } from '@components/language-switcher/language-switcher'

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
| `@ark-ui/react` | `Select`, `Portal`, `createListCollection` (subpath imports) |
| `@components/atelier` | Design system context |
| `@components/lib/overlay-container` | Portal target for the list |
| `@components/i18n` | Internal i18n hooks and logic |
