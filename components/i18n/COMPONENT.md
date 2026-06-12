# i18n System

A lightweight, built-in internationalization system for AtelierUI. It handles global translations, component-level localizations, and variable interpolation without external library dependencies.

## Features

- **Hybrid Translation Model:** Supports global translations (`t()`) and component-specific message bundles (`useComponentMessages()`).
- **Variable Interpolation:** Simple `{variable}` syntax for dynamic content.
- **Auto-Persistence:** Saves selected locale to `localStorage`.
- **DOM Integration:** Automatically updates the `lang` attribute and `data-locale` on the `<html>` element.
- **Type-Safe:** Built with TypeScript to ensure all translation keys exist across all supported languages (`de`, `en`).
- **Controlled/Uncontrolled Mode:** Can be used as a standalone provider or controlled by a parent (like `AtelierProvider`).

## How It Works

The system centers around the `I18nProvider`, which maintains the current `locale`. It exposes a `t` function for global strings and a `locale` state.

Components typically store their own translations in a `messages.ts` file using the `ComponentMessages<T>` type. They then consume these translations via the `useComponentMessages` hook, which automatically selects the correct language from the context and allows for prop-level overrides.

Interpolation is handled by a small helper function that replaces curly-brace placeholders with provided values.

## Props

### I18nProvider

| Prop | Type | Default | Description |
|---|---|---|---|
| `locale` | `'de' \| 'en'` | — | Optional controlled locale. Overrides localStorage if provided. |
| `overrides` | `Partial<GlobalMessages>` | — | Global string overrides merged on top of built-in locales. |
| `onLocaleChange` | `(l: Locale) => void` | — | Callback triggered when the locale changes. |
| `storageKey` | `string` | `'design-engine-locale'` | The localStorage key for the locale. |
| `children` | `ReactNode` | — | The application tree. |

## Usage

### Setup

```tsx
import { I18nProvider } from '@components/i18n'

export function App({ children }) {
  return (
    <I18nProvider defaultLocale="en">
      {children}
    </I18nProvider>
  )
}
```

### Component Localization

```tsx
// messages.ts
import { ComponentMessages } from '@components/i18n'

export interface MyComponentMessages {
  title: string
}

export const MESSAGES: ComponentMessages<MyComponentMessages> = {
  de: { title: 'Titel' },
  en: { title: 'Title' }
}

// MyComponent.tsx
import { useComponentMessages } from '@components/i18n'
import { MESSAGES, MyComponentMessages } from './messages'

export function MyComponent({ messages }: { messages?: Partial<MyComponentMessages> }) {
  const m = useComponentMessages(MESSAGES, messages)
  return <h1>{m.title}</h1>
}
```

### Global Translations

```tsx
import { useI18n } from '@components/i18n'

export function Greeting() {
  const { t } = useI18n()
  return <span>{t('greeting.hello', { name: 'User' })}</span>
}
```

## Dependencies

| Package | Purpose |
|---|---|
| `react` | UI Library |
