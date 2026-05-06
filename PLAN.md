# Design Engine — Implementation Plan

> Letztes Update: 2026-05-02 (nach LanguageSwitcher)

> Branch: `main` — 8 Commits seit Session-Start

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

- [ ] **@dnd-kit/core Migration** für `LayerPanel` — Framer Motion `Reorder.Group` hat bekannte Touch/Scroll-Konflikte auf iOS. `@dnd-kit/core` ist stabiler für Production-Drag-and-Drop (relevant sobald Cellar Canvas auf Tablet läuft)
- [ ] **Ark UI `translations`-Bridge** — Ark UI DatePicker, Select, Combobox etc. haben ein eingebautes `translations`-Prop für ARIA-Labels. Wenn diese Komponenten hinzukommen, sollte der `I18nProvider` automatisch die passenden Ark-Translations liefern. Bridge-Pattern: `useArkTranslations('dialog')` → Ark-kompatibles Objekt
- [x] **HotkeysProvider Context-Split** — Read-Context (nur `registry`) von Write-Context (`register`, `unregister`) trennen. Lesende Komponenten (ShortcutOverview) sollen nicht bei jeder Shortcut-Registrierung neu rendern (erledigt)

### 🔵 i18n — Noch nicht migrierte Komponenten

Folgende Komponenten haben user-facing Strings, aber noch kein `messages?`-Prop:

- [x] `toast` — Action-Labels (via Consumer), Dismiss-Button (erledigt)
- [x] `form-input` — Required-Label, i18n-Prop (erledigt)
- [x] `color-picker` — Format-Switcher, Paletten-Labels, Eyedropper & Slider A11y (erledigt)
- [x] `navbar` — Mobile-Toggle & Close aria-labels (erledigt)
- [x] `tooltip` — aria-label & A11y linkage (erledigt)
- [ ] `breadcrumb` — aria-label "Breadcrumb navigation"
- [ ] `slider` — aria-label, value-Formatierung
- [ ] `rating` — aria-label, star-Beschreibung

---

## Komponenten-Status

Legende: ✅ Vollständig · 🔶 Teilweise · ⬜ Ausstehend · 🆕 Neu in dieser Session

### Design Engine — Neue Komponenten (diese Session)

| Komponente | motion/react | i18n | Hotkeys | A11y | Status |
|---|---|---|---|---|---|
| `alignment-bar` | n/a | ✅ | n/a | 🔶 roving-tabIndex fehlt | 🔶 |
| `hotkeys/provider` | n/a | n/a | ✅ | ✅ | ✅ |
| `hotkeys/shortcut-overview` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `image-cropper-modal` | n/a | ✅ | n/a | ✅ | ✅ |
| `layer-panel` | ✅ | ✅ | n/a | 🔶 keyboard-reorder, aria-selected fehlen | 🔶 |
| `number-input` | n/a | n/a | n/a | 🔶 label-Assoziation fehlt | 🔶 |
| `text-tool-options` | n/a | ✅ | n/a | 🔶 aria-pressed, FontSelect-ARIA fehlen | 🔶 |
| `validator-badge` | n/a | ✅ | n/a | 🔶 Severity nur via Farbe | 🔶 |

### Bestehende Komponenten — Refactored (diese Session)

| Komponente | motion/react | i18n | Hotkeys | A11y | Status |
|---|---|---|---|---|---|
| `back-to-top` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `search-overlay` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `form-input` | n/a | ⬜ | n/a | 🔶 | 🔶 |

### Bestehende Komponenten — Motion-Migration (Phase 1, nur Import)

> Diese Komponenten wurden auf `motion/react` umgestellt, aber noch nicht für i18n oder A11y überarbeitet.

| Komponente | motion/react | i18n | Hotkeys | A11y | Status |
|---|---|---|---|---|---|
| `animated-search` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `animated-weather-icons` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `autocomplete-cell` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `dock` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `file-tree` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `footer-section` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `navbar` | ✅ | ⬜ | n/a | 🔶 | 🔶 |
| `scroll-rotate` | ✅ | n/a | n/a | ⬜ | 🔶 |
| `search-morph` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `stepper` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `stepper-vertical` | ✅ | ⬜ | n/a | ⬜ | 🔶 |
| `text-rotate` | ✅ | n/a | n/a | ⬜ | 🔶 |
| `text-scramble` | ✅ | n/a | n/a | ⬜ | 🔶 |
| `toast` | ✅ | ⬜ | n/a | 🔶 | 🔶 |
| `tooltip` | ✅ | n/a | n/a | 🔶 | 🔶 |
| `velocity-scroll` | ✅ | n/a | n/a | ⬜ | 🔶 |

### Neu hinzugefügt

| Komponente | motion/react | i18n | A11y | Status |
|---|---|---|---|---|
| `language-switcher` | n/a | ✅ via context | ✅ | ✅ |

### Bestehende Komponenten — Noch nicht angepasst

> Enthalten keine `framer-motion`-Imports. Brauchen ggf. i18n und A11y-Überarbeitung.

| Komponente | i18n nötig | A11y-Audit nötig | Status |
|---|---|---|---|
| `accent-switcher` | ⬜ | ⬜ | ⬜ |
| `add-to-cart-button` | ⬜ | ⬜ | ⬜ |
| `ambient-image` | n/a | ⬜ | ⬜ |
| `animated-icons` | n/a | ⬜ | ⬜ |
| `animated-theme-toggler` | ⬜ | ⬜ | ⬜ |
| `aurora-text` | n/a | n/a | ⬜ |
| `backlight` | n/a | n/a | ⬜ |
| `banner` | ✅ | ⬜ | ⬜ |
| `blur-fade` | n/a | n/a | ⬜ |
| `bounce-cards` | n/a | ⬜ | ⬜ |
| `bounce-loader` | n/a | n/a | ⬜ |
| `breadcrumb` | ✅ | ✅ | ⬜ |
| `cart-icon` | ⬜ | ⬜ | ⬜ |
| `checkbox` | ⬜ | ✅ | ⬜ |
| `circular-progress` | ⬜ | ⬜ | ⬜ |
| `click-spark` | n/a | n/a | ⬜ |
| `color-picker` | ✅ | ✅ | ⬜ |
| `confetti` | n/a | n/a | ⬜ |
| `countdown` | ⬜ | ⬜ | ⬜ |
| `cursor-glow` | n/a | n/a | ⬜ |
| `floating-cart` | ✅ | ✅ | ⬜ |
| `glow-card` | n/a | ⬜ | ⬜ |
| `gooey-input` | ✅ | ✅ | ⬜ |
| `heart-like` | ⬜ | ⬜ | ⬜ |
| `highlighter` | n/a | n/a | ⬜ |
| `hover-3d-card` | n/a | ⬜ | ⬜ |
| `images-slider` | ⬜ | ✅ | ⬜ |
| `jelly-button` | ⬜ | ⬜ | ⬜ |
| `lens` | n/a | ⬜ | ⬜ |
| `light-rays` | n/a | n/a | ⬜ |
| `magnetic-button` | ⬜ | ⬜ | ⬜ |
| `morphing-text` | n/a | n/a | ⬜ |
| `number-ticker` | n/a | ⬜ | ⬜ |
| `paragraph` | n/a | n/a | ⬜ |
| `particles` | n/a | n/a | ⬜ |
| `password-confirmation` | ✅ | ✅ | ⬜ |
| `password-setup` | ✅ | ✅ | ⬜ |
| `pixel-image` | n/a | ⬜ | ⬜ |
| `pricing-interaction` | ✅ | ✅ | ⬜ |
| `product-badge` | ⬜ | ⬜ | ⬜ |
| `product-tag` | ⬜ | ⬜ | ⬜ |
| `rating` | ✅ | ✅ | ⬜ |
| `scroll-progress` | n/a | ⬜ | ⬜ |
| `shiny-text` | n/a | n/a | ⬜ |
| `slider` | ✅ | ✅ | ⬜ |
| `sparkles-text` | n/a | n/a | ⬜ |
| `splash-cursor` | n/a | n/a | ⬜ |
| `sticky-banner` | ✅ | ⬜ | ⬜ |
| `switch` | ✅ | ✅ | ⬜ |
| `timeline` | ⬜ | ⬜ | ⬜ |
| `use-image-upload` | ✅ | ✅ | ⬜ |
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
| Ark UI `translations`-Bridge | ⬜ Ausstehend |
| `@dnd-kit/core` LayerPanel Migration | ⬜ Ausstehend |
| HotkeysProvider Context-Split | ⬜ Ausstehend |

---

## Statistik

- **Komponenten gesamt:** 76
- **Vollständig refactored (✅):** 5
- **Teilweise refactored (🔶):** 26
- **Ausstehend (⬜):** 45
