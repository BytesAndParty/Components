# Component Guidelines

Verbindliche Spielregeln für jede neue (oder umgebaute) Komponente unter `components/**`.
Querverweise statt Doppeln:
- [`CLAUDE.md`](./CLAUDE.md) — Engine-Philosophie, TanStack, React-Compiler-Regeln, A11y-Foundation
- [`ARTELIER.md`](./ARTELIER.md) — Bun, Lint-Stack, Doc-Lifecycle, COMPONENT.md-Pflichtfelder
- [`KARPATHY.md`](./KARPATHY.md) — Code-Disziplin (Surgical, Simplicity, Goal-Driven)

---

## 1. Design-Sprache: „Fancy Minimal"

Jede Komponente bedient diese vier Tokens — nicht alle gleichzeitig, aber bewusst gewählt:

| Token | Verwendung |
|---|---|
| **Micro-Elasticity** | Spring-Animationen für State-Changes. Default-Spring: `{ type: 'spring', stiffness: 150, damping: 20 }` (lang/weich) oder `{ stiffness: 300, damping: 30 }` (kurz/präzise, z. B. Layout-Reorder). |
| **Liquid Transitions** | Bei Auswahl-/Toggle-States morphende Formen oder Gooey-Filter — keine harten Step-Änderungen. |
| **Glassmorphism** | Overlays nutzen `backdrop-filter: blur(…)` + dünne Borders (`0.5px`/`1px`). Hintergründe via `color-mix(in oklch, var(--card) 80%, transparent)`. |
| **Adaptive Feedback** | Jeder Klick/Hover liefert eine physische Antwort: `scale`, `translateX`, `box-shadow`-Glow, SVG-Stroke-Draw, …  „Tote" Buttons sind Bugs. |

## 2. Theming-Engine

- **Quelle der Wahrheit:** `components-showcase/src/styles.css` (`@theme inline`-Block).
- **Farben:** ausschließlich `oklch(L C H)`-Tokens. Keine Hex-Konstanten in Komponenten.
- **Konsumiere semantisch:** `bg-card`, `text-muted-foreground`, `border-border`, `text-accent` — **nicht** `bg-zinc-900` o. Ä.
- **Modi:**
  - Dark = Default (`:root`)
  - Light = `[data-theme="light"]` am `<html>`
  - Akzent = `data-accent="…"` am `<html>` — Werte aus `<AccentSwitcher>`. Animation der Übergänge erfolgt zentral via `requestAnimationFrame`-Interpolation, **nicht** pro Komponente neu erfinden.
- **Tailwind v4-Falle:** Komponenten leben außerhalb des Vite-Roots. Damit ihre Klassen kompiliert werden, muss `styles.css` ein `@source "../../components/**/*.{ts,tsx}"` enthalten. (Bereits gesetzt — bei neuen Workspaces nachziehen.)

## 3. Datei-Anatomie

```
components/<kebab-name>/
├── <kebab-name>.tsx     # Komponente, Default-Export NICHT verwenden; named export
├── messages.ts          # nur wenn UI-Strings vorkommen (siehe §6)
└── COMPONENT.md         # Pflicht — Inhalt siehe ARTELIER.md §4
```

- Komponenten-File enthält Typen, Komponente, optionale Sub-Komponenten und Helper. Erst bei nennenswerter Größe in Unter-Files splitten.
- **Keine** `index.ts`-Reexports im Component-Folder. Konsumenten importieren explizit: `import { Slider } from '@components/slider/slider'`.

## 4. Styling-Patterns

Drei zugelassene Wege — in dieser Präferenz-Reihenfolge:

### a) Tailwind-Utilities (Default)
Statische Layouts, Spacing, Typo, Farben über semantische Tokens. Mit `cn()` aus [`components/lib/utils.ts`](./components/lib/utils.ts) kombinieren — niemals händisches `clsx`/`twMerge`.

### b) Inline-Style + CSS-Variablen (Dynamik)
Werte, die sich pro Interaktion ändern (Mausposition, Progress, Index), gehen als CSS-Variable über das `style`-Attribut — nicht als neu generierte Klasse.

```tsx
<div style={{ '--mouse-x': `${x}px`, '--progress': pct } as CSSProperties} />
```

Verhindert Klassen-Explosion und schont den Style-Recalc.

### c) Dynamische Keyframe-Injection (Self-contained Animationen)
Komponentenspezifische `@keyframes` werden einmal pro Page-Load in den `<head>` injiziert, dedupliziert per `STYLE_ID`. Pattern (siehe [`components/timeline/timeline.tsx:35`](./components/timeline/timeline.tsx#L35)):

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
// in useEffect aufrufen, NICHT im Render
```

Vorteil: Komponente bleibt portierbar, kein Tailwind-Plugin nötig, SSR-safe.

## 5. Animation

- **Library:** `motion/react` (nicht `framer-motion`). Per-Komponenten-Custom-RAF nur, wenn motion nicht reicht (z. B. Color-Interpolation im `AccentSwitcher`).
- **`prefers-reduced-motion`** ist Pflicht. Zwei Wege:
  - In motion-Komponenten: `useReducedMotion()`-Hook (siehe [`footer-section.tsx`](./components/footer-section/footer-section.tsx)) — Variants/Layout/Transitions konditional deaktivieren.
  - Bei reinem CSS: `@media (prefers-reduced-motion: reduce) { … animation: none !important; }` im injizierten Style-Block (siehe [`timeline.tsx`](./components/timeline/timeline.tsx)).
- **Stagger-Delays** (`delay: i * 0.01`) niemals auf der Top-Level eines `transition`-Objekts — sie vererben sich an `layout` und verschlucken Reorder-Animationen. Immer pro Property setzen (`opacity`, `x`).
- **`AnimatePresence`** für Mount/Unmount-Sequenzen. `initial={false}`, wenn die Komponente nicht beim ersten Render mit-animieren soll.

## 6. i18n

- Jede Komponente mit UI-Text liefert `messages.ts` + `messages?: Partial<XMessages>`-Prop.
- Konsum via `useComponentMessages(MESSAGES, messages)` aus `@components/i18n`.
- Locales: mindestens `de` + `en`. Platzhalter: `{name}`-Syntax, Substitution per `.replace()` am Einsatzpunkt.
- Tote Strings sind Doku-Schulden — wenn ein Key im Code nicht referenziert wird, raus damit (oder UI dafür liefern).

## 7. Accessibility-Pflichtprogramm

CLAUDE.md §2 sagt: A11y ist Fundament. Konkret heißt das:

- **Tastatur:** Jede interaktive Stelle ist via `Tab`/`Enter`/`Space`/Pfeiltasten bedienbar — auch wenn sie wie ein `<div>` aussieht. Nicht-native Buttons → `role="button"` + `tabIndex={0}` + `onKeyDown`.
- **ARIA:** Korrekte Rollen (`role="slider"`, `role="grid"`, `aria-sort`, `aria-pressed`, `aria-expanded`, `aria-valuemin/max/now`). `<th scope="col">`. `aria-label` wenn kein sichtbares Label.
- **Focus-Indikatoren:** `focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2`. Default-Outline darf nicht einfach entfernt werden, ohne Ersatz.
- **Reduced Motion:** siehe §5.
- **Touch-Targets:** mind. 44×44 px. Pointer-Events nutzen, nicht Maus-Events allein.

## 8. Komponenten-API

- **Controlled/Uncontrolled:** Form-/Selection-Komponenten exponieren **beides**. Pattern (siehe [`Checkbox`](./components/checkbox/checkbox.tsx), [`Slider`](./components/slider/slider.tsx)):
  ```tsx
  const isControlled = value !== undefined;
  const v = isControlled ? value : internal;
  ```
- **`size`-Prop**: Wenn es überhaupt Größenvarianten gibt → `'sm' | 'md' | 'lg'`, gespeichert in einer `sizes`-Map mit numerischen Tokens. Nicht eigene Strings („small", „medium") erfinden.
- **`variant`-Prop**: Optional. Nur dort verwenden, wo der Plan oder ein Consumer einen klaren zweiten visuellen Mode fordert (siehe `Toast`, `MagneticButton`). Nicht spekulativ.
- **`className`/`style`**: Outer-Wrapper akzeptiert beides für Layout-Anpassung. Inner-Slots nur als dedizierte Props (`wrapperClassName`, `inputClassName`, …).
- **`children` vs. Render-Props**: Strukturierte Slots als Props (`leftIcon`, `rightIcon`), freie Inhalte als `children`. TanStack-Stil (Header/Cell als Funktionen) ist bei datengetriebenen Komponenten OK.
- **Refs:** `forwardRef` nur, wenn ein Consumer-Use-Case existiert (z. B. Form-Libs, Focus-Steuerung). Nicht prophylaktisch.

## 9. Verboten / Anti-Patterns

- ❌ Manuelles `useMemo`/`useCallback` ohne nachweislichen Grund (React Compiler erledigt das; siehe CLAUDE.md §1).
- ❌ Mutationen während des Renders, `ref.current`-Zugriffe außerhalb von Effekten/Event-Handlern.
- ❌ Eigene Hex-Farben statt CSS-Variablen.
- ❌ Same-Hue-Pills (`bg-yellow-100` + `text-yellow-700`): Light-Mode-Kontrast bricht. Stattdessen `bg-{c}-500/10` + `text-{c}-700 dark:text-{c}-300` + `ring-1 ring-inset`.
- ❌ Externe Headless-Lib zusätzlich installieren, wenn das Projekt bereits eine hat (Ark UI ist gesetzt — keine Radix/Headless-UI parallel).
- ❌ `useEffect` für Sachen, die Event-Handler erledigen können.
- ❌ Doppelte Polyfills für `prefers-reduced-motion` — entweder Hook ODER CSS, nicht beides.

## 10. Showcase-Pflicht

Jede Komponente bekommt einen Eintrag im Showcase (`components-showcase/src/pages/<topic>.tsx` oder dediziert), inkl.:

- **Golden-Path-Demo** mit realistischen Daten.
- **Edge-Cases**: Empty State, Loading, Error, Disabled, lange Inhalte.
- Bei Komponenten mit `variant`: pro Variant ein Block.
- Wenn URL-State relevant (DataTable, Filter, Pagination): `useSearchParams`-getriebene Demo wie in [`pages/data.tsx`](./components-showcase/src/pages/data.tsx).

## 11. Quality-Gate vor PR

1. `bun lint` — 0 Errors. Bekannte Motion-bezogene `Compilation Skipped`-Warnings sind OK.
2. TypeScript: keine neuen Fehler in der eigenen Komponente. (Pre-existing `moduleResolution`-Noise ignorieren.)
3. Manuelle Checks im Showcase:
   - Tab durch die Komponente — alles fokussierbar, sichtbarer Ring.
   - Dark ⇄ Light Toggle — keine Kontrast-Brüche.
   - Akzent-Switch — übernimmt sofort.
   - Reduced Motion (DevTools → Rendering) — keine Springs.
4. `COMPONENT.md` reflektiert den aktuellen Stand (Props, Usage, Dependencies).

---

**Diese Datei ersetzt die früheren `NEXT-COMPONENTS-PLAN.md` und `COMPONENTS-STYLING-EVALUATION.md`.** Plan-Listen für konkrete neue Komponenten gehen in PRs/Issues, nicht in dieses Repo-Root.
