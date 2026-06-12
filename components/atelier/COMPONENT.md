# Atelier System

The backbone of the AtelierUI Design Engine. A unified context provider that synchronizes theme, accent color, and locale state across the entire application and the DOM.

## Features

- **Unified Design State:** Manages `theme` (dark/light), `accent` color, and `locale` in a single provider.
- **Auto-Persistence:** All changes are automatically saved to `localStorage` under the `atelier-` namespace.
- **DOM Synchronization:** Updates `data-theme`, `data-accent`, `data-locale`, `lang`, and the `.dark` class on `<html>` instantly.
- **FOUC Prevention:** Includes `AtelierInitScript` for server-side frameworks to prevent "Flash of Unstyled Content".
- **Built-in i18n:** Wraps `I18nProvider` and exposes a shorthand `t()` function.
- **Cross-Concern Reactions:** Allows components to react to theme changes (e.g., resetting accent color).

## How It Works

`AtelierProvider` acts as the single source of truth for the design system's identity. Instead of having separate providers for theme, accent, and language, they are collapsed into one to reduce boilerplate and enable atomic updates.

On mount, the provider reads from `localStorage`. When state changes, it performs a surgical update to the `<html>` element's attributes. This allows CSS variables and Tailwind utilities to react instantly to the new state.

`AtelierInitScript` is a tiny, synchronous inline script (<200 bytes) that should be placed in the `<head>` of your document. It replicates the reading of `localStorage` before the first paint, ensuring the page loads with the correct visual state.

## Props

### AtelierProvider

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultTheme` | `'dark' \| 'light'` | `'dark'` | Initial theme if no saved state exists. |
| `defaultAccent` | `string` | `'indigo'` | Initial accent color if no saved state exists. |
| `defaultLocale` | `'de' \| 'en'` | `'de'` | Initial locale if no saved state exists. |
| `overrides` | `Partial<GlobalMessages>` | — | Global translation overrides for the i18n system. |
| `children` | `ReactNode` | — | The application tree. |

### AtelierInitScript

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultTheme` | `string` | `'dark'` | Fallback theme for the inline script. |
| `defaultAccent` | `string` | `'indigo'` | Fallback accent for the inline script. |
| `defaultLocale` | `string` | `'de'` | Fallback locale for the inline script. |

## Usage

### Root Integration

```tsx
import { AtelierProvider, AtelierInitScript } from '@components/atelier'

export function App({ children }) {
  return (
    <AtelierProvider>
      {/* For SSR environments like Astro or Next.js */}
      <AtelierInitScript />
      
      {children}
    </AtelierProvider>
  )
}
```

### Consuming State

```tsx
import { useAtelier } from '@components/atelier'

export function ThemeToggle() {
  const { theme, toggleTheme } = useAtelier()
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

## Dependencies

| Package | Purpose |
|---|---|
| `react` | UI Library |
| `@local/i18n` | Internal i18n system (AtelierProvider wraps it) |
