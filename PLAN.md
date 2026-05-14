# Design Engine — Implementation Plan

> Letztes Update: 2026-05-12 (Form-Primitives-Batch + Reconcile)

> Branch: `main`

---

## Architektur-Entscheidungen (festgehalten)

| Thema | Entscheidung |
|---|---|
| **i18n** | Option C — Komponenten bundeln `de`/`en` Defaults, Consumer überschreibt via `messages?` Prop oder `I18nProvider overrides` |
| **Animation** | `motion/react` (ehemals `framer-motion`) — `useReducedMotion()` für JS-Animationen |
| **Mobile** | Cellar Canvas = Desktop-only. Graceful degradation via CSS hover-guards + `useDeviceCapabilities` |
| **Shortcuts** | TanStack Hotkeys (Alpha) — eigenes Registry-System drüber (`useDesignEngineHotkey`) für ShortcutOverview |
| **React Compiler** | Aktiv (`compilationMode: 'all'`) — kein manuelles `useMemo`/`useCallback` |
| **State** | TanStack Query (Server), TanStack Form (Forms), lokaler useState für UI-State |

---

## Offene Aufgaben

### 🔴 Accessibility — Priorität hoch

- [x] **NumberInput** — `<span>` statt `<label>` für das Label-Element → kein htmlFor/id-Pairing mit dem Input (erledigt)
- [x] **TextToolOptions / ToggleBtn** — `aria-pressed={active}` fehlt auf Bold, Italic, Underline, Align-Buttons (erledigt)
- [x] **TextToolOptions / FontSelect** — `aria-haspopup="listbox"`, `aria-expanded`, `role="listbox"` + `role="option"` fehlen (erledigt)
- [x] **AlignmentBar** — Roving-tabIndex-Pattern fehlt (Arrow-Key-Navigation innerhalb der Toolbar nach WAI-ARIA Toolbar-Pattern) (erledigt)
- [x] **LayerPanel** — Drag-Handle nicht per Tastatur bedienbar (Shift+↑↓ für Reorder), `aria-selected` auf Rows, `aria-label` auf `<ul>` (erledigt)
- [x] **ValidatorBadge** — Error vs Warning nur durch Farbe unterschieden — screen reader-taugliche Severity-Kennzeichnung fehlt (z.B. visually-hidden prefix) (erledigt)

### 🟡 Code-Qualität

- [x] **hotkeys-provider.tsx** — Read-Context (registry) und Write-Context (register/unregister) trennen (erledigt)
- [x] **designer.tsx:194** — `URL.createObjectURL(blob)` wird bei erneutem Crop nicht revoked (kleiner Memory-Leak im Demo) (erledigt)
- [x] **search-overlay.tsx:93** — `description: "Öffnet die globale Spotlight-Suche"` ist hartkodiertes Deutsch, nicht im i18n-System (erledigt)

### 🔵 Features & Infrastruktur

- [x] **Data Table** — Implement accessible, high-performance table using TanStack Table (erledigt)
- [x] **@dnd-kit/core Migration** für `LayerPanel` — Erledigt (stabilere Interaktion auf Touch-Geräten)
- [x] **Ark UI `translations`-Bridge** — Erledigt (automatisierte i18n für Ark-Komponenten)
- [x] **HotkeysProvider Context-Split** — Read-Context (nur `registry`) von Write-Context (`register`, `unregister`) trennen. Lesende Komponenten (ShortcutOverview) sollen nicht bei jeder Shortcut-Registrierung neu rendern (erledigt)

### 🔵 i18n — Noch nicht migrierte Komponenten

Folgende Komponenten haben user-facing Strings, aber noch kein `messages?`-Prop:

- [x] `toast` — Action-Labels (via Consumer), Dismiss-Button (erledigt)
- [x] `form-input` — Required-Label, i18n-Prop (erledigt)
- [x] `color-picker` — Format-Switcher, Paletten-Labels, Eyedropper & Slider A11y (erledigt)
- [x] `navbar` — Mobile-Toggle & Close aria-labels (erledigt)
- [x] `tooltip` — aria-label & A11y linkage (erledigt)
- [x] `breadcrumb` — aria-label & more-label (erledigt)
- [x] `slider` — aria-label & localized formatting (erledigt)
- [x] `rating` — aria-label, star-Beschreibung (erledigt)

---

## Komponenten-Status

Legende: ✅ Vollständig · 🔶 Teilweise · ⬜ Ausstehend · 🆕 Neu in dieser Session

### Design Engine — Neue Komponenten (diese Session)

| Komponente | motion/react | i18n | Hotkeys | A11y | Status |
|---|---|---|---|---|---|
| `alignment-bar` | n/a | ✅ | n/a | ✅ | ✅ |
| `hotkeys/provider` | n/a | n/a | ✅ | ✅ | ✅ |
| `hotkeys/shortcut-overview` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `data-table` | n/a | ✅ | n/a | ✅ | ✅ |
| `image-cropper-modal` | n/a | ✅ | n/a | ✅ | ✅ |
| `layer-panel` | ✅ | ✅ | n/a | ✅ | ✅ |
| `number-input` | n/a | n/a | n/a | ✅ | ✅ |
| `text-tool-options` | n/a | ✅ | n/a | ✅ | ✅ |
| `validator-badge` | n/a | ✅ | n/a | ✅ | ✅ |

### Bestehende Komponenten — Refactored (diese Session)

| Komponente | motion/react | i18n | Hotkeys | A11y | Status |
|---|---|---|---|---|---|
| `back-to-top` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `search-overlay` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `form-input` | n/a | ✅ | n/a | ✅ | ✅ |
| `toast` | ✅ | ✅ | n/a | ✅ | ✅ |
| `tooltip` | ✅ | ✅ | n/a | ✅ | ✅ |
| `breadcrumb` | n/a | ✅ | n/a | ✅ | ✅ |
| `color-picker` | n/a | ✅ | n/a | ✅ | ✅ |
| `slider` | n/a | ✅ | n/a | ✅ | ✅ |
| `rating` | n/a | ✅ | n/a | ✅ | ✅ |
| `navbar` | ✅ | ✅ | n/a | ✅ | ✅ |
| `checkbox` | n/a | n/a | n/a | ✅ | ✅ |
| `switch` | n/a | n/a | n/a | ✅ | ✅ |
| `heart-like` | n/a | ✅ | n/a | ✅ | ✅ |
| `animated-theme-toggler` | n/a | ✅ | n/a | ✅ | ✅ |
| `accent-switcher` | n/a | ✅ | n/a | ✅ | ✅ |
| `jelly-button` | n/a | n/a | n/a | ✅ | ✅ |
| `magnetic-button` | n/a | n/a | n/a | ✅ | ✅ |
| `animated-search` | ✅ | ✅ | n/a | ✅ | ✅ |
| `autocomplete-cell` | ✅ | ✅ | n/a | ✅ | ✅ |
| `dock` | ✅ | ✅ | n/a | ✅ | ✅ |
| `file-tree` | ✅ | n/a | n/a | ✅ | ✅ |
| `footer-section` | ✅ | ✅ | n/a | ✅ | ✅ |
| `search-morph` | ✅ | ✅ | n/a | ✅ | ✅ |
| `stepper` | ✅ | ✅ | n/a | ✅ | ✅ |
| `stepper-vertical` | ✅ | ✅ | n/a | ✅ | ✅ |
| `animated-weather-icons` | ✅ | n/a | n/a | ✅ | ✅ |
| `add-to-cart-button` | n/a | ✅ | n/a | ✅ | ✅ |
| `cart-icon` | n/a | ✅ | n/a | ✅ | ✅ |
| `floating-cart` | n/a | ✅ | n/a | ✅ | ✅ |
| `product-tag` | n/a | ✅ | n/a | ✅ | ✅ |
| `product-badge` | n/a | ✅ | n/a | ✅ | ✅ |
| `banner` | n/a | ✅ | n/a | ✅ | ✅ |
| `sticky-banner` | ✅ | ✅ | n/a | ✅ | ✅ |
| `gooey-input` | n/a | ✅ | n/a | ✅ | ✅ |
| `password-setup` | n/a | ✅ | n/a | ✅ | ✅ |
| `password-confirmation` | n/a | ✅ | n/a | ✅ | ✅ |
| `use-image-upload` | n/a | ✅ | n/a | ✅ | ✅ |
| `pricing-interaction` | n/a | ✅ | n/a | ✅ | ✅ |
| `countdown` | n/a | ✅ | n/a | ✅ | ✅ |
| `timeline` | n/a | ✅ | n/a | ✅ | ✅ |
| `bounce-loader` | n/a | ✅ | n/a | ✅ | ✅ |
| `circular-progress` | n/a | ✅ | n/a | ✅ | ✅ |
| `number-ticker` | n/a | n/a | n/a | ✅ | ✅ |
| `scroll-progress` | n/a | ✅ | n/a | ✅ | ✅ |
| `ambient-image` | n/a | n/a | n/a | ✅ | ✅ |
| `animated-icons` | ✅ | n/a | n/a | ✅ | ✅ |
| `images-slider` | n/a | ✅ | n/a | ✅ | ✅ |
| `paragraph` | n/a | ✅ | n/a | ✅ | ✅ |

### Bestehende Komponenten — Motion-Migration (Phase 1, nur Import)

> Diese Komponenten wurden auf `motion/react` umgestellt, aber noch nicht für i18n oder A11y überarbeitet.

| Komponente | motion/react | i18n | Hotkeys | A11y | Status |
|---|---|---|---|---|---|
| `scroll-rotate` | ✅ | n/a | n/a | ⬜ | 🔶 |
| `text-rotate` | ✅ | n/a | n/a | ⬜ | 🔶 |
| `text-scramble` | ✅ | n/a | n/a | ⬜ | 🔶 |
| `velocity-scroll` | ✅ | n/a | n/a | ⬜ | 🔶 |

### Neu hinzugefügt

| Komponente | motion/react | i18n | A11y | Status |
|---|---|---|---|---|
| `language-switcher` | n/a | ✅ via context | ✅ | ✅ |

### Bestehende Komponenten — Noch nicht angepasst

> Enthalten keine `framer-motion`-Imports. Brauchen ggf. i18n und A11y-Überarbeitung.

| Komponente | i18n nötig | A11y-Audit nötig | Status |
|---|---|---|---|
| `aurora-text` | n/a | n/a | ⬜ |
| `backlight` | n/a | n/a | ⬜ |
| `blur-fade` | n/a | n/a | ⬜ |
| `bounce-cards` | n/a | ⬜ | ⬜ |
| `click-spark` | n/a | n/a | ⬜ |
| `confetti` | n/a | n/a | ⬜ |
| `cursor-glow` | n/a | n/a | ⬜ |
| `glow-card` | n/a | ⬜ | ⬜ |
| `highlighter` | n/a | n/a | ⬜ |
| `hover-3d-card` | n/a | ⬜ | ⬜ |
| `lens` | n/a | ⬜ | ⬜ |
| `light-rays` | n/a | n/a | ⬜ |
| `morphing-text` | n/a | n/a | ⬜ |
| `particles` | n/a | n/a | ⬜ |
| `pixel-image` | n/a | ⬜ | ⬜ |
| `shiny-text` | n/a | n/a | ⬜ |
| `sparkles-text` | n/a | n/a | ⬜ |
| `splash-cursor` | n/a | n/a | ⬜ |
| `view-transition` | n/a | n/a | ⬜ |

---

## Infrastruktur-Status

| Was | Status |
|---|---|
| `motion/react` Migration | ✅ Alle 20 betroffenen Komponenten migriert |
| React Compiler (`compilationMode: 'all'`) | ✅ Aktiv seit Phase 1 |
| `useDeviceCapabilities` Hook | ✅ Fertig — hasHover, hasFinePointer, isTouch, prefersReducedMotion |
| `I18nProvider` + `useI18n` | ✅ Fertig — Option C, de/en, type-safe |
| `useComponentMessages` Pattern | ✅ In 8 Komponenten implementiert |
| CSS hover-guard (`@custom-variant hover`) | ✅ Globaler Schutz für alle `hover:`-Utilities |
| CSS `prefers-reduced-motion` global | ✅ Alle `*`-Elemente abgedeckt |
| Locale-Switcher in Navbar | ✅ `LanguageSwitcher` Komponente — Globe-Icon, Badge-Flip-Animation, localStorage, data-locale |
| Vite Config — Subpath-Alias-System | ✅ Stabil, alle Packages explizit aliased |
| `useDesignEngineHotkey` + ShortcutOverview | ✅ Fertig — `?`-Key, Shift-Hold, Escape |
| **AtelierProvider** (unified theme+accent+locale) | ✅ — `useAtelier()`, `AtelierInitScript` für FOUC |
| Ark UI `translations`-Bridge | ✅ |
| `@dnd-kit/core` LayerPanel Migration | ✅ |
| HotkeysProvider Context-Split | ✅ |

---

## Statistik

- **Komponenten gesamt:** 76
- **Vollständig refactored (✅):** 49
- **Teilweise refactored (🔶):** 4
- **Ausstehend (⬜):** 23
