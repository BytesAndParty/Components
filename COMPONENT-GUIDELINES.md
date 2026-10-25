---
paths:
  - "components/**/*"
  - "components-showcase/src/**/*"
  - "section-showcase/src/**/*"
  - "vendure-showcase/storefront/src/**/*"
  - "launcher/src/**/*"
---

# Component Guidelines

Regeln für jede neue oder umgebaute Komponente unter `components/**` und für den React-Code, der sie einsetzt. Claude lädt die Datei über den Symlink `.claude/rules/component-guidelines.md`, deshalb bleibt sie an diesem Ort.

## 1. Gestaltung

Minimal, mit Microinteractions: Jeder Klick und jeder Hover bekommt eine kleine, spürbare Antwort (`scale`, `translate`, Schatten, SVG-Stroke). Ein Button ohne Reaktion gilt als Bug. Darüber hinaus gibt es keine feste Design-Richtung, die kommt aus dem Einsatzprojekt.

## 2. Theming-Engine

- **Quelle der Wahrheit:** `components-showcase/src/styles.css` (`@theme inline`-Block).
- **Farben:** ausschließlich `oklch(L C H)`-Tokens, keine Hex-Konstanten in Komponenten. Semantisch konsumieren: `bg-card`, `text-muted-foreground`, `border-border`, `text-accent`, nicht `bg-zinc-900` o. Ä. So reagiert jede Komponente auf Theme und Akzent.
- **Modi:**
  - Dark = Default (`:root`)
  - Light = `[data-theme="light"]` am `<html>`
  - Akzent = `data-accent="…"` am `<html>`, Werte aus `<AccentSwitcher>`. Die Übergänge interpoliert der `AccentSwitcher` zentral per `requestAnimationFrame`; Komponenten bauen das nicht selbst nach.
- **Tailwind-v4-Falle:** Komponenten leben außerhalb des Vite-Roots. Damit ihre Klassen kompiliert werden, braucht jede `styles.css`, die Komponenten nutzt, ein `@source` mit dem relativen Pfad auf `components/**/*.{ts,tsx}` (in den Showcases `../../components/…`, in der Storefront `../../../components/…`; bei neuen Workspaces nachziehen). Symptom, wenn es fehlt: die Klasse steht im Markup, aber es gibt keine Regel, das Element fällt zusammen (z. B. `h-40` ergibt 0 px), ohne Konsolenfehler.

## 3. Datei-Anatomie

```
components/<kebab-name>/
├── <kebab-name>.tsx     # Komponente als named export, kein Default-Export
├── messages.ts          # nur wenn UI-Strings vorkommen (siehe §6)
├── COMPONENT.md         # Pflicht
└── STATUS.md            # optional, für komplexe Komponenten
```

- Das Komponenten-File enthält Typen, Komponente, optionale Sub-Komponenten und Helper. Erst bei nennenswerter Größe in Unter-Files splitten.
- Keine `index.ts`-Reexports im Component-Folder. Konsumenten importieren explizit: `import { Slider } from '@components/slider/slider'`.
- **`COMPONENT.md`** enthält: Features, How It Works (Architektur-Entscheidungen), Props als Tabelle mit Defaults, Usage-Beispiele (Showcase und Integration), Dependencies (npm-Pakete).
- **`STATUS.md`** hält laufende Bugs, Workarounds und das technische Entscheidungs-Log getrennt von der stabilen Doku.

## 4. Styling-Patterns

Drei zugelassene Wege, in dieser Reihenfolge:

### a) Tailwind-Utilities (Default)
Statische Layouts, Spacing, Typo, Farben über semantische Tokens. Mit `cn()` aus [`components/lib/utils.ts`](./components/lib/utils.ts) kombinieren statt händischem `clsx`/`twMerge`.

### b) Inline-Style + CSS-Variablen (Dynamik)
Werte, die sich pro Interaktion ändern (Mausposition, Progress, Index), gehen als CSS-Variable über das `style`-Attribut, nicht als neu generierte Klasse. Das verhindert Klassen-Explosion und schont den Style-Recalc.

```tsx
<div style={{ '--mouse-x': `${x}px`, '--progress': pct } as CSSProperties} />
```

### c) Dynamische Keyframe-Injection (Self-contained Animationen)
Komponentenspezifische `@keyframes` werden einmal pro Page-Load in den `<head>` injiziert, dedupliziert per `STYLE_ID` (siehe [`components/timeline/timeline.tsx`](./components/timeline/timeline.tsx)). Die Komponente bleibt portierbar, braucht kein Tailwind-Plugin und ist SSR-safe.

```tsx
const STYLE_ID = '__<name>-styles__';
function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `@keyframes … { … }`;
  document.head.appendChild(el);
}
// in useEffect aufrufen, nicht im Render
```

## 5. Animation

- **Library:** `motion/react`. Eigenes `requestAnimationFrame` nur, wenn motion nicht reicht (z. B. Farb-Interpolation im `AccentSwitcher`).
- **Springs:** `{ type: 'spring', stiffness: 150, damping: 20 }` (weich) oder `{ stiffness: 300, damping: 30 }` (kurz und präzise, z. B. Layout-Reorder).
- **`prefers-reduced-motion`** ist Pflicht, über genau einen Weg pro Komponente:
  - In motion-Komponenten: `useReducedMotion()` (siehe [`footer-section.tsx`](./components/footer-section/footer-section.tsx)), Variants/Layout/Transitions konditional abschalten.
  - Bei reinem CSS: `@media (prefers-reduced-motion: reduce) { … animation: none !important; }` im injizierten Style-Block (siehe [`timeline.tsx`](./components/timeline/timeline.tsx)).
- **Stagger-Delays** (`delay: i * 0.01`) pro Property setzen (`opacity`, `x`), nicht auf der obersten Ebene des `transition`-Objekts: Dort vererben sie sich an `layout` und verschlucken Reorder-Animationen.
- **`AnimatePresence`** für Mount/Unmount-Sequenzen. `initial={false}`, wenn die Komponente beim ersten Render nicht mitanimieren soll.

## 6. i18n

- Jede Komponente mit UI-Text liefert `messages.ts` und eine `messages?: Partial<XMessages>`-Prop.
- Konsum über `useComponentMessages(MESSAGES, messages)` aus `@components/i18n`.
- Locales: mindestens `de` + `en`. Platzhalter in `{name}`-Syntax, ersetzt per `.replace()` am Einsatzpunkt.
- Ein Key, den der Code nicht verwendet, fliegt raus (oder bekommt seine UI).

## 7. Accessibility

Barrierefreiheit ist das Fundament jeder Komponente, nicht ein Zusatz.

- **Tastatur:** Jede interaktive Stelle ist per `Tab`/`Enter`/`Space`/Pfeiltasten bedienbar, auch wenn sie wie ein `<div>` aussieht. Nicht-native Buttons: `role="button"` + `tabIndex={0}` + `onKeyDown`. Bei zusammengesetzten Widgets das passende WAI-ARIA-Pattern.
- **ARIA:** Korrekte Rollen und Zustände (`role="slider"`, `role="grid"`, `aria-sort`, `aria-pressed`, `aria-expanded`, `aria-valuemin/max/now`), `<th scope="col">`, `aria-label`, wenn es kein sichtbares Label gibt.
- **Fokus:** `focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2`. Die Default-Outline nur mit Ersatz entfernen.
- **Touch-Targets:** mindestens 44 × 44 px. Pointer-Events statt reiner Maus-Events.
- **Reduced Motion:** siehe §5.

## 8. Komponenten-API

- **Props** direkt in der Funktionssignatur destrukturieren.
- **Mitgebrachte Intelligenz:** Shortcuts registriert die Komponente selbst über `useDesignEngineHotkey` (taucht damit in der `?`-Übersicht auf, auf Touch-Geräten automatisch aus), UI-Texte kommen über i18n (§6), Formularfelder nutzen die native Validierung (`required` & Co.).
- **Controlled/Uncontrolled:** Form- und Selection-Komponenten können beides (siehe [`Checkbox`](./components/checkbox/checkbox.tsx), [`Slider`](./components/slider/slider.tsx)):
  ```tsx
  const isControlled = value !== undefined;
  const v = isControlled ? value : internal;
  ```
- **`size`-Prop:** Wenn es Größenvarianten gibt, dann `'sm' | 'md' | 'lg'` mit einer `sizes`-Map aus numerischen Tokens.
- **`variant`-Prop:** Nur, wenn ein Consumer einen klaren zweiten visuellen Modus braucht (siehe `Toast`, `MagneticButton`).
- **`className`/`style`:** Der äußere Wrapper akzeptiert beides für Layout-Anpassungen. Innere Slots nur über eigene Props (`wrapperClassName`, `inputClassName`, …).
- **`children` vs. Render-Props:** Strukturierte Slots als Props (`leftIcon`, `rightIcon`), freie Inhalte als `children`. TanStack-Stil (Header/Cell als Funktionen) passt bei datengetriebenen Komponenten.
- **Refs:** `forwardRef` nur bei einem echten Consumer-Use-Case (Form-Libs, Fokus-Steuerung).

## 9. Anti-Patterns

- Manuelles `useMemo`/`useCallback` ohne nachgewiesenen Grund: Der React Compiler memoisiert selbst. Greift er nicht, liegt meist ein Verstoß gegen die Rules of React vor, den man behebt statt drumherum zu memoisieren.
- Mutationen während des Renders und `ref.current`-Zugriffe außerhalb von Effekten und Event-Handlern. Side Effects gehören in `useEffect` oder Event-Handler.
- `useEffect` für Dinge, die ein Event-Handler erledigen kann.
- Same-Hue-Pills (`bg-yellow-100` + `text-yellow-700`) brechen den Kontrast im Light-Mode. Stattdessen `bg-{c}-500/10` + `text-{c}-700 dark:text-{c}-300` + `ring-1 ring-inset`.
- `prefers-reduced-motion` doppelt behandeln (Hook und CSS gleichzeitig).

## 10. Showcase-Pflicht

Jede Komponente bekommt einen Eintrag im Showcase (`components-showcase/src/pages/<topic>.tsx` oder eigene Seite) mit:

- Golden-Path-Demo mit realistischen Daten.
- Edge-Cases: Empty State, Loading, Error, Disabled, lange Inhalte.
- Bei Komponenten mit `variant`: ein Block pro Variante.
- Bei URL-State (DataTable, Filter, Pagination): `useSearchParams`-Demo wie in [`pages/data.tsx`](./components-showcase/src/pages/data.tsx).

## 11. Technische Fallen

- **Gradient-Text mit engem Leading:** `background-clip: text` bemalt nur die Element-Box, bei `leading-[0.88]` werden Unterlängen („g", „y") abgeschnitten. Gelöst in `ShinyText`/`AuroraText` (Padding + negatives Margin); neue Gradient-Text-Stellen nutzen dasselbe Muster.
- **`clip-path` nie auf dem IntersectionObserver-Target:** Chromium rechnet die eigene `clip-path` in die Intersection ein. Mit `inset(100%)` gibt es nie eine Intersection, das Reveal startet nie. Den Clip auf einen inneren Wrapper legen (Referenz: `RevealImage`).
