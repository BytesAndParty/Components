# i18n System

A lightweight, built-in internationalization system for AtelierUI. It handles global translations, component-level localizations, and variable interpolation without external library dependencies.

## Features

- **Hybrid Translation Model:** Supports global translations (`t()`) and component-specific message bundles (`useComponentMessages()`).
- **Variable Interpolation:** Simple `{variable}` syntax for dynamic content.
- **Auto-Persistence:** Saves selected locale to `localStorage`.
- **DOM Integration:** Automatically updates the `lang` attribute and `data-locale` on the `<html>` element.
- **Type-Safe:** Built with TypeScript to ensure every translation key exists in the required languages (`de`, `en`). Further locales (`pl`) are optional per component and fall back to English.
- **Controlled/Uncontrolled Mode:** Can be used as a standalone provider or controlled by a parent (like `AtelierProvider`).

## How It Works

The system centers around the `I18nProvider`, which maintains the current `locale`. It exposes a `t` function for global strings and a `locale` state.

Components typically store their own translations in a `messages.ts` file using the `ComponentMessages<T>` type. They then consume these translations via the `useComponentMessages` hook, which automatically selects the correct language from the context and allows for prop-level overrides.

Interpolation is handled by a small helper function that replaces curly-brace placeholders with provided values.

### Locales and fallback

`Locale` is `'de' | 'en' | 'pl'`. `ComponentMessages<T>` requires `de` and `en`; every other locale is optional. A component without messages for the current locale shows its English ones (`useComponentMessages` falls back to `en`), and so do the global strings of `t()` (there is no global `pl` file yet). That is intended: only the components below have Polish texts, everything else appears in English when `pl` is selected.

| Where | Has `pl` | Source |
|---|---|---|
| `language-switcher` (messages and the `pl` entry in `DEFAULT_LANGUAGES`) | yes | from Buchart58 |
| `add-to-cart-button`, `product-tag`, `number-input`, `timeline` | yes | from Buchart58 |
| `booking-calendar` (messages incl. plural forms, `pl-PL` for calendar and price) | yes | from Buchart58 |
| `search-overlay`, `autocomplete-cell` | yes | written here |
| `ark-bridge.ts`: `popover`, `imageCropper`, `datePicker` | yes | written here |

**All Polish texts are machine drafts.** A Polish speaker should proofread them before they go live. Each `pl` block carries a comment saying so.

`useArkTranslations()` picks `ARK_DE`, `ARK_PL` or `ARK_EN`; any other locale gets the English texts.

### Plural forms

`pluralize(locale, count, forms)` picks a word form via `Intl.PluralRules`. `forms` is either a plain string (returned as is) or `{ one, few?, many?, other }`. Polish needs three forms for whole numbers: `one` = 1, `few` = 2–4, 22–24, … (not 12–14), `many` = 0, 5–21, 25–31, …; `other` covers fractions. German and English only use `one` and `other`, so their messages can stay strings. Example: `booking-calendar`'s `seatsLeft` (1 miejsce, 2 miejsca, 5 miejsc, 22 miejsca).

## Props

### I18nProvider

| Prop | Type | Default | Description |
|---|---|---|---|
| `locale` | `'de' \| 'en' \| 'pl'` | — | Optional controlled locale. Overrides localStorage if provided. |
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
