# AtelierUI

**Enterprise Design Engine für React 19.** Nicht eine weitere Komponentenbibliothek — ein kohärentes, intelligent vernetztes UI-System mit eingebautem State, i18n, Accessibility und Animationssteuerung.

Entwickelt als Fundament für [Cellar Canvas](./CELLAR-CANVAS.md) und darüber hinaus überall einsetzbar, wo Premium-UX zählt.

```
React 19 · React Compiler · TypeScript · Tailwind CSS 4
TanStack (Query · Form · Table · Hotkeys) · motion/react · Ark UI · Bun
```

---

## Warum kein Copy-Paste?

Die meisten Komponentenbibliotheken enden dort, wo die echten Fragen beginnen: Wie persistiert Theme-State über Reload? Wie verhindert man den Flash of Unstyled Content in Astro? Wie registriert eine Komponente ihren Shortcut automatisch in einer globalen Übersicht? Wie wechselt ein Button seinen Text wenn die Sprache wechselt?

AtelierUI beantwortet all das auf Systemebene — nicht per Konvention, die jeder Consumer selbst umsetzen muss.

---

## Architektur

```
<AtelierProvider>          ← Theme · Accent · Locale · i18n · localStorage · DOM-Sync
  <HotkeysProvider>        ← Globale Shortcut-Registry · useDesignEngineHotkey()
    <QueryClientProvider>  ← TanStack Query für Server State
      <App />
    </QueryClientProvider>
  </HotkeysProvider>
</AtelierProvider>
```

Jede Komponente weiss, in welcher Sprache sie sich befindet, welche Accent-Farbe aktiv ist und welchen Theme-Modus der User gewählt hat — ohne Props-Drilling.

---

## AtelierProvider — Warum unified state?

Bisher existierten Theme, Accent und Sprache als drei voneinander unabhängige Systeme mit je eigenem `localStorage`-Read, MutationObserver und DOM-Sync. Das war ~150 Zeilen Boilerplate, die sich dreifach wiederholten.

`AtelierProvider` kollabiert das auf einen einzigen Hook:

```tsx
const { theme, accent, locale, setTheme, toggleTheme, setAccent, setLocale } = useAtelier()
```

Der Provider schreibt bei jeder Änderung atomisch in `localStorage` und synchronisiert `data-theme`, `data-accent`, `data-locale` und `lang` auf `<html>`. Die drei Switcher-Komponenten (`AnimatedThemeToggler`, `AccentSwitcher`, `LanguageSwitcher`) sind damit zu dünnen Context-Consumern geworden — keine eigene State-Verwaltung mehr nötig.

**Cross-concern reactions** sind erstmals möglich:

```tsx
// Accent automatisch bei Theme-Wechsel zurücksetzen:
const { theme, setAccent } = useAtelier()
useEffect(() => { if (theme === 'light') setAccent('indigo') }, [theme])
```

### FOUC-Prevention für Astro / Next.js

```tsx
// app/layout.tsx oder Layout.astro <head>
import { AtelierInitScript } from '@components/atelier'

<head>
  <AtelierInitScript />  {/* läuft synchron vor dem ersten Paint */}
</head>
```

`AtelierInitScript` rendert ein winziges Inline-Script (~200 Bytes), das `localStorage` liest und alle drei Attribute auf `<html>` setzt — bevor der Browser die erste CSS-Zeile verarbeitet. Kein Flash, kein React erforderlich.

---

## TanStack — Warum Headless-First?

AtelierUI nutzt das TanStack-Ökosystem nicht trotz seiner Komplexität, sondern wegen seiner Prinzipien.

### TanStack Query — Server State ohne Boilerplate

```tsx
// SearchOverlay: 0 Zeilen manuelles Loading/Error-State
const { data: results = [], isLoading } = useQuery({
  queryKey: ['search', query],
  queryFn:  () => api.search(query),
  enabled:  query.length > 0,
  staleTime: 60_000,
})
```

Stale-While-Revalidate, Request-Deduplication, Background-Refetch — alles ohne einen einzigen manuellen `useEffect`.

### TanStack Form — Validierung ohne Schema-Lock-in

```tsx
const form = useForm({
  defaultValues: { email: '' },
  validators: {
    onChange: ({ value }) =>
      !value.email.includes('@') ? 'Ungültige E-Mail' : undefined,
  },
})
```

Kein Zod-Zwang, kein Yup-Zwang. Validierung ist eine Funktion — synchron oder async, auf Field- oder Form-Ebene.

### TanStack Hotkeys — Shortcut-Registry

```tsx
useDesignEngineHotkey('Mod+k', openSearch, {
  label:    'Suche öffnen',
  category: 'Global',
})
```

`useDesignEngineHotkey` wrappt TanStack's `useHotkey` und registriert die Metadaten gleichzeitig in der globalen Registry. Das `ShortcutOverview`-Panel (`?` drücken) befüllt sich damit automatisch — seitenspezifisch, weil Hooks sich beim Unmount deregistrieren.

---

## React Compiler — Warum kein `useMemo`?

```tsx
// ❌ früher nötig
const filtered = useMemo(() => items.filter(isActive), [items, isActive])

// ✅ React Compiler erkennt Abhängigkeiten automatisch
const filtered = items.filter(isActive)
```

`babel-plugin-react-compiler` (stable seit Oktober 2025, `compilationMode: 'all'`) analysiert Code statisch und fügt Memoization exakt dort ein, wo sie Sinn ergibt — ohne false positives, ohne vergessene Dependencies. Konsequenz: kein `useCallback`, kein `useMemo` im Projekt, außer wo externe Bibliotheken explizit stabile Referenzen fordern.

---

## motion/react — Warum nicht CSS-Animationen allein?

```tsx
import { motion, useReducedMotion } from 'motion/react'

const shouldReduce = useReducedMotion()

<motion.div
  animate={{ y: shouldReduce ? 0 : -8 }}
  whileHover={hasFinePointer ? { scale: 1.02 } : undefined}
/>
```

`motion/react` (ehemals `framer-motion`, umbenannt in v12) liefert zwei Dinge, die CSS allein nicht kann: erstens `useReducedMotion()` als reaktiven Hook der OS-Accessibility-Einstellungen widerspiegelt, zweitens Hardware-beschleunigte Layout-Animationen via WAAPI.

Der globale CSS hover-guard sorgt dafür, dass alle Tailwind `hover:`-Utilities nur auf echten Pointer-Devices feuern:

```css
/* styles.css — ein Eintrag deckt das gesamte Projekt ab */
@custom-variant hover {
  @media (hover: hover) and (pointer: fine) {
    &:hover { @slot; }
  }
}
```

---

## i18n — Warum built-in?

Weil "add i18n later" in der Praxis "rewrite every component later" bedeutet.

AtelierUI verwendet **Option C** — Hybrid-Ansatz: Komponenten bündeln ihre eigenen `de`/`en` Defaults, Consumer können jeden String überschreiben.

```tsx
// Komponente liefert typsichere Defaults
const LAYER_MESSAGES = {
  de: { deleteLayer: 'Ebene löschen', dragHandle: 'Zum Sortieren ziehen' },
  en: { deleteLayer: 'Delete layer',  dragHandle: 'Drag to reorder' },
} satisfies ComponentMessages<LayerPanelMessages>

// Consumer überschreibt einzelne Keys via Prop …
<LayerPanel messages={{ de: { deleteLayer: 'Layer entfernen' } }} />

// … oder global via Provider
<AtelierProvider overrides={{ 'action.delete': 'Löschen' }}>
```

Kein externes i18n-Framework nötig. Typ-Sicherheit: `de.ts` ist gegen `en.ts` getyped — fehlende Keys sind Compile-Fehler.

---

## `useDeviceCapabilities`

```tsx
const { hasHover, hasFinePointer, isTouch, prefersReducedMotion } = useDeviceCapabilities()
```

Fasst `@media (hover: hover)`, `@media (pointer: fine)` und `useReducedMotion()` reaktiv zusammen. Verwendet intern in `useDesignEngineHotkey`, um Shortcuts auf Touch-Geräten automatisch zu deaktivieren — Keyboard-Shortcuts auf einem Smartphone zu registrieren wäre sinnlos.

---

## Quick Start

```bash
# Showcase starten
cd showcase && bun install && bun run dev

# Production Build
cd showcase && bun run build
```

`AtelierProvider` an die Wurzel des Component-Trees:

```tsx
import { AtelierProvider, AtelierInitScript } from '@components/atelier'
import { HotkeysProvider } from '@components/hotkeys/hotkeys-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Root({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AtelierProvider>
        <HotkeysProvider>
          {children}
        </HotkeysProvider>
      </AtelierProvider>
    </QueryClientProvider>
  )
}
```

---

## Komponenten

76 Komponenten. Vollständiger Status inkl. Refactoring-Fortschritt in [PLAN.md](./PLAN.md).

### Design Engine (Cellar Canvas)
`alignment-bar` · `color-picker` · `image-cropper-modal` · `layer-panel` · `number-input` · `text-tool-options` · `validator-badge`

### System & Theming
`atelier/provider` · `atelier/init-script` · `hotkeys/provider` · `hotkeys/shortcut-overview` · `i18n/provider` · `language-switcher` · `accent-switcher` · `animated-theme-toggler`

### Navigation & Layout
`navbar` · `back-to-top` · `breadcrumb` · `scroll-progress` · `sticky-banner` · `footer-section`

### Inputs & Forms
`form-input` · `search-overlay` · `number-input` · `slider` · `switch` · `checkbox` · `rating` · `gooey-input` · `password-setup` · `password-confirmation`

### Feedback & Overlays
`toast` · `tooltip` · `validator-badge` · `circular-progress` · `stepper`

### E-Commerce
`add-to-cart-button` · `cart-icon` · `floating-cart` · `product-badge` · `product-tag` · `pricing-interaction`

### Animation & Visual
`animated-search` · `aurora-text` · `blur-fade` · `bounce-cards` · `click-spark` · `confetti` · `cursor-glow` · `dock` · `glow-card` · `heart-like` · `lens` · `light-rays` · `magnetic-button` · `morphing-text` · `particles` · `shiny-text` · `sparkles-text` · `splash-cursor` · `velocity-scroll`

---

## Conventions

| Thema | Entscheidung |
|---|---|
| Package Manager | Bun |
| Exports | Named Exports only — kein Default Export |
| State | `useAtelier()` für Design System · TanStack Query für Server State · `useState` für lokalen UI State |
| Styling | Tailwind CSS 4 + CSS Custom Properties (`--accent`, `--background`, `--border` …) |
| Animationen | `motion/react` für JS-Animationen · CSS `transition` für einfache States (mit hover-guard) |
| Memoization | Keine manuelle — React Compiler übernimmt |
| i18n | `useComponentMessages()` in allen Komponenten mit user-facing Strings |
| Accessibility | WAI-ARIA · vollständige Tastatursteuerung · `aria-label` auf allen interaktiven Elementen |
| Mobile | `useDeviceCapabilities()` · hover-guards · Shortcuts deaktiviert auf Touch |
