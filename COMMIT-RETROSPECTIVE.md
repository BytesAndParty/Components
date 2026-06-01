# Commit-Retrospektive: Letzte 50 Commits (24.05.–31.05.2026)

Eine didaktische Analyse der jüngsten Codebase-Entwicklung mit Fokus auf wiederkehrende ESLint-Fixes. Ziel: aus alltäglicher Arbeit Senior-Dev-Patterns ableiten.

## Thematische Cluster

| Thema | ~Commits | Was es ist |
|---|---|---|
| **cellar-canvas** (Etiketten-Designer) | ~15 | Fabric.js-basierter Editor: Crop, Bleed, Undo/Redo, Onboarding-Tour, i18n, PDF-Export, Smart Guides |
| **vendure-showcase / storefront** | ~7 | Wine-Shop UI: Detail-Page, Facet-Filter, AtelierProvider (Theme), i18n, Accent-Picker |
| **section-showcase** | ~6 | Premium Section-Varianten, Command Bar, TypeScript-Gate |
| **data-table** | ~5 | TanStack Table: Sort/Pagination URL-driven, Auto-Size, Resize, Row-Selection |
| **ESLint Hygiene** | **3** | Drei aufeinanderfolgende Cleanup-Wellen |
| **Refactors/Type-Fixes** | ~6 | Ark UI v5 Migration, i18n-Typen, Module-Resolution, NestJS-Imports |
| **Misc** | ~3 | Rename `wine-showcase → vendure-showcase`, Docs |

**Großes Bild:** Eine **Design Engine** mit drei parallelen Use-Cases:

1. `components/` als Library,
2. `cellar-canvas` als komplexe Domain-App,
3. `vendure-showcase` als realer Konsument.

Das ist gesund — Komponenten werden gegen echte Anwendungsfälle getestet, nicht nur gegen sich selbst.

---

## Die drei ESLint-Commits — was wirklich passiert ist

Die drei Wellen haben jeweils einen **anderen Aufräumtyp** abgearbeitet. Es ist kein "immer dasselbe", sondern ein **schrittweises Härten der Lint-Regeln**.

### Welle 1 — `e11fbd8` "25 baseline warnings (react-refresh + any)"

**Wiederkehrendes Muster: Context aus Provider-Datei extrahieren**

Die `react-refresh/only-export-components`-Regel verlangt, dass Files die JSX exportieren **nur** Komponenten exportieren. Das ist HMR-Voraussetzung: React kann bei Fast Refresh sonst nicht entscheiden, ob es den State erhalten oder den ganzen Modul-Graph neu mounten muss.

```ts
// VORHER: components/i18n/provider.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

export const I18nContext = createContext(...)          // non-component export
export function useI18n() { ... }                       // non-component export
export function useComponentMessages(...) { ... }       // non-component export
export function I18nProvider({ children }) { ... }      // component
```

```ts
// NACHHER: components/i18n/i18n-context.ts  (neue Datei, .ts statt .tsx)
export const I18nContext = createContext(...)
export function useI18n() { return useContext(I18nContext) }
export function useComponentMessages(...) { ... }

// components/i18n/provider.tsx — nur noch die Komponente
import { I18nContext } from './i18n-context'
export function I18nProvider({ children }) { ... }
```

**Einschätzung:** Sehr sinnvoll. Das ist eine echte Architektur-Verbesserung, keine kosmetische:

- Hooks/Context lassen sich ohne Provider-Import (und damit ohne den ganzen JSX-Baum) in Tests benutzen.
- HMR funktioniert wieder sauber.
- Klare Separation: Daten-Layer (`-context.ts`) vs. UI-Layer (`provider.tsx`).

**Sr.-Dev-Insight:** Wenn ein Lint-Rule dich zu einer Strukturänderung zwingt, frag immer "**Was lehrt mich diese Regel?**" Hier: die Regel zwingt dich, eine Schicht-Trennung sichtbar zu machen, die sowieso konzeptionell da ist. Das ist genau der Wert von ESLint-Regeln — nicht "Code sieht hübsch aus", sondern "Architektur-Verstöße werden hart".

---

### Welle 2 — `7c75744` "useCallback/useMemo cleanup"

**Wiederkehrendes Muster: Manuelle Memoization entfernen**

```tsx
// VORHER: components/animated-search/animated-search.tsx
import { useState, useRef, useEffect, useCallback } from 'react';

const open = useCallback(() => {
  setIsOpen(true);
}, []);

const close = useCallback(() => {
  setIsOpen(false);
  setValue('');
  onChange?.('');
}, [onChange]);
```

```tsx
// NACHHER
import { useState, useRef, useEffect } from 'react';

function open() {
  setIsOpen(true);
}

function close() {
  setIsOpen(false);
  setValue('');
  onChange?.('');
}
```

**Warum:** Das Projekt nutzt **React 19 + React Compiler** (laut CLAUDE.md). Der Compiler memoized automatisch — handgeschriebene `useCallback`/`useMemo` sind doppelte Arbeit, schaden lesbar **und** können tatsächlich langsamer sein (zusätzliche Allocation für das Dependency-Array). Die ESLint-Regel `no-restricted-imports` blockt jetzt den Import beider Hooks aus React.

**Einschätzung:** Goldrichtig, mit einer Bedingung: man muss wissen, dass der React Compiler im Build aktiv ist (`babel-plugin-react-compiler` in der Vite-Config). Sonst löscht man hier echte Optimierungen.

**Sr.-Dev-Insight:** Das ist ein klassisches Beispiel für **"Convention follows Tooling"**. Wenn ein Tool ein Problem deterministisch löst, ist manuelle Lösung im Code Lärm. Lerne, solche Wechsel zu erkennen — sie kommen alle 2-3 Jahre (z.B. CSS Custom Properties machten SASS-Variablen obsolet, `Intl.NumberFormat` machte moment.js-Currency obsolet, React Compiler macht `useMemo` obsolet).

---

### Welle 3 — `00a388c` "jsx-a11y errors"

**Drei wiederkehrende Patterns:**

**Pattern A: `<div onClick>` → `<button>`**

```tsx
// VORHER (floating-cart.tsx)
<div onClick={() => onItemClick?.(item.id)} style={{ cursor: 'pointer', ... }}>

// NACHHER
<button
  type="button"
  onClick={() => onItemClick?.(item.id)}
  aria-label={item.label ?? 'Produkt'}
  style={{ ..., padding: 0, border: 'none', background: 'transparent' }}
>
```

Das ist nicht nur Lint-Kosmetik — ein `<button>` ist fokussierbar, drückt Space/Enter, wird von Screenreadern als "Knopf" angekündigt, und das `aria-label` macht das Bild-only-Element zugänglich.

**Pattern B: ARIA-Vollständigkeit für Container-Rollen**

```tsx
// file-tree.tsx
<li
  role="treeitem"
  aria-expanded={open}
  aria-level={level}
  aria-selected={false}    // jetzt vollständige treeitem-Semantik
>
```

`role="treeitem"` ohne `aria-selected` ist semantisch unvollständig — Screenreader wissen sonst nicht, ob das Element selektiert werden kann.

**Pattern C: Bewusste Ausnahmen mit Begründung**

```tsx
// Wo der Bypass wirklich richtig ist: scoped disable mit Reason
// eslint-disable-next-line jsx-a11y/no-static-element-interactions
// backdrop click-to-close — Esc handles keyboard
<div className="backdrop" onClick={onClose} />
```

**Einschätzung:** Vorbildlich — die Commit-Message dokumentiert sogar pro Datei *warum*. Das ist genau die richtige Balance: Regeln sind Default, Ausnahmen sind erklärt.

**Wo kritisch zu sein wäre:** Bei `floating-cart` werden über `style={{ padding: 0, border: 'none', background: 'transparent' }}` Browser-Defaults zurückgesetzt. Das ist jetzt überall im Codebase verstreut. Ein Sr. Dev hätte das in eine `<UnstyledButton>`-Primitive ausgelagert (1 Datei, 10 Zeilen, einmal `<button class="reset">…`) und in der CSS-Layer mit `@layer base { .reset { all: unset; cursor: pointer } }` gelöst. Verhindert, dass die nächsten 5 `<button>`-Umstellungen wieder copy-paste-style-Reset bekommen.

---

## War das alles sinnvoll? — Ehrliche Bewertung

| Aspekt | Bewertung | Begründung |
|---|---|---|
| Schrittweise Wellen statt Big Bang | gut | Drei kleine Commits, jeder reviewbar. Ein 200-Datei-PR ist nicht mehr reviewbar. |
| Commit-Messages | sehr gut | Erstklassig — was, warum, verifiziert (`bun lint shows 0`). Solche Messages lassen einen in 6 Monaten verstehen, *warum* eine `aria-selected={false}` da steht. |
| Verifizierung dokumentiert | gut | "bun run build green; bun lint reports 0 problems" — beweist, dass die Arbeit fertig ist, nicht nur "angefangen". |
| Mischung "Auto-Fix + manuell + intentional disable" | gut | Auto-Fix für tailwind classnames-order ist Lärm-Reduktion. Manuelle Fixes wo Semantik nötig. Disable+Reason wo Regel falsch ist. |
| **Code-Style-Inkonsistenz** | bedenklich | In `floating-cart` jetzt `<button style={{padding:0, border:'none', background:'transparent'}}>` als Pattern — kommt 5× wieder. Hier fehlt eine Primitive. |
| **Ein gemeinsamer Commit hätte gereicht** | nein | Pro Sub-Step committen ist Projekt-Convention. Das ist konsistent. |

---

## Lessons Learned: Was den Senior ausmacht

1. **Lies Lint-Regeln als Architektur-Hinweise**, nicht als nervige Pflicht. `react-refresh/only-export-components` ist im Kern ein Schicht-Trennungs-Argument.

2. **Verstehe dein Tooling.** `useCallback` entfernen ist nur richtig, *weil* React Compiler aktiv ist. Das Wissen darüber **muss** man im Kopf haben, bevor man den Sweep macht — sonst löscht man echte Optimierungen.

3. **Dokumentiere bewusste Ausnahmen.** `eslint-disable-next-line <rule> -- <reason>` ist das Senior-Pattern. Niemals nackte Disables.

4. **Wenn dieselbe Boilerplate 3× geschrieben wird, baue eine Primitive.** Bei der jsx-a11y-Welle: nach dem 3. `<button style={{padding:0, border:'none', background:'transparent'}}>` hätte man stoppen und `<ResetButton>` extrahieren sollen.

5. **Commit-Messages sind das Reviewer-Tool des zukünftigen Ichs.** Die Messages hier sind besser als 90 % vom Branchen-Durchschnitt — auch dann so schreiben, wenn niemand reviewt.

6. **Verifikation gehört in die Message**, nicht nur in den CI-Run. "Verified: bun run build green; bun lint 0 problems" macht den Commit für sich allein vertretbar — auch in 5 Jahren ohne CI-Logs.

7. **Erkenne den Unterschied zwischen Routine-Aufräumen und Architektur-Arbeit.**
   - Welle 1 (Context-Split) war **Architektur-Arbeit getarnt als Lint-Fix**.
   - Welle 2 (Memoization) war **echtes Lärm-Aufräumen dank Tooling-Wechsel**.
   - Welle 3 (a11y) war **echte Produktverbesserung** (Tastatur-User können den Cart jetzt benutzen).

   Drei verschiedene Hebel-Größen — gleicher Commit-Prefix `chore(eslint)`. Das ist normal, aber gut zu erkennen.

---

# Teil 2: Zoom-Out — Der größere Verlauf (Commits 50–250)

Das Repo hat insgesamt **393 Commits**. Die jüngsten 3 ESLint-Commits sind kein Ausreißer, sondern der **vorläufige Abschluss einer monatelangen, systematischen Härtung**. Hier die großen Linien aus dem tieferen Verlauf:

## A) Die *eigentliche* ESLint-Migration lief in Phasen 1 → 4

Vor dem `00a388c`-Commit gab es bereits ein vollständig durchstrukturiertes Migrations-Programm:

```
0bf5b1b chore(lint): set up eslint flat config with react-hooks v7 + typescript-eslint
20ad3cc chore: eslint phase 1 — remove unused imports
7e63497 chore: eslint phase 1 — remove dead local vars
99c46a9 chore: eslint phase 1 — prefix unused args with _
1e7f50a docs: eslint migration — phase 1 done
c1b4fbb chore: eslint phase 2a — pixel-image refs via useMemo
6b8b03b chore: eslint phase 2a — password-setup refs
0fbe0b0 chore: eslint phase 2a — number-input refs
5914b8f chore: eslint phase 2b — blur-fade derived initial state
2b319fb chore: eslint phase 2b — reset-on-prop-change effects
2785607 chore: eslint phase 2b — hydrate-from-DOM/storage effects
5ff8910 chore: eslint phase 2b — i18n controlled-prop sync
3b3153c chore: eslint phase 2b — timer/async sync effects
32e1083 chore: eslint phase 2c — animated-icons useId() for SVG gradients
2d981ec chore: eslint phase 2c — pin showcase countdown targets
50ab935 chore: eslint phase 2c — disable intentional impurity calls
4f6c268 chore: eslint phase 3 — drop unnecessary particles dep
13b3fb5 chore: eslint phase 3 — stabilize Providers actions via useMemo
5f4762f chore: eslint phase 3 — document mount-only / intentional dep skips
dce26c0 docs: eslint migration — phase 4 partial + pre-CI/CI/Astro changelog
```

**Das ist exemplarisch.** Jede Phase hatte:

- Einen klaren *Scope* (Phase 1 = unused, Phase 2a = refs, Phase 2b = effects, Phase 2c = impure-pure, Phase 3 = deps/hooks, Phase 4 = CI).
- Eine `ESLINT-MIGRATION.md` als laufenden Plan.
- Einen abschließenden `docs: ... phase X done`-Commit.
- Verifikation, dass die Public-API unangetastet bleibt (z.B. `_`-Prefix für ungenutzte Props statt Löschung).

**Beispiel: Phase 2b "reset-on-prop-change"** — wiederkehrendes Pattern in 5 Komponenten:

```tsx
// VORHER (ambient-image.tsx) — ESLint warnt "set-state-in-effect"
useEffect(() => {
  setColors(null)
  setLoaded(false)
}, [src])

// NACHHER — Pattern blieb, aber Begründung dokumentiert + lokales Disable
// Re-extract when src changes — reset derived state from new prop.
// Canonical alternative would be `key={src}` at the parent; keeping
// this local so the API stays uncontrolled.
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setColors(null)
  setLoaded(false)
}, [src])
```

**Einschätzung:** Vorbildlich. Statt das Anti-Pattern zu *verstecken* oder zu *eliminieren um den Preis einer API-Änderung*, wurde es **bewusst dokumentiert**. Der Reviewer in 2 Jahren versteht sofort, *warum* die Regel hier nicht greift. Das ist Senior-Niveau.

**Sr.-Dev-Insight:** Eine Migration in numerierten Phasen mit Doku-Datei ist überlegen einem 200-Datei-Sweep. Wenn Phase 2b einen Bug einführt, kannst du `git revert <range>` chirurgisch zurücknehmen. Großer Sweep = atomarer Verlust.

---

## B) Der monatelange A11y + i18n-Sweep über ~50 Komponenten

Zwischen Commits ~150 und ~100 läuft ein systematischer Durchgang durch **fast jede Komponente** — immer mit demselben Pattern:

```
feat(switch): add focus-visible ring, aria-label/labelledby/describedby support
feat(checkbox): add focus-visible ring, aria-label/labelledby/describedby support
feat(heart-like): i18n via messages, state-dependent aria-label, focus-visible ring
feat(animated-theme-toggler): add aria-label, aria-pressed and i18n
feat(jelly-button): default type=button, focus-visible ring layered into shadow
feat(magnetic-button): default type=button, focus-visible outline via injected styles
feat(accent-switcher): i18n labels, WAI-ARIA menu pattern with keyboard nav
feat(autocomplete-cell): full WAI-ARIA combobox pattern
feat(dock): toolbar role, real button/anchor elements, i18n toolbar label
feat(stepper): i18n button labels + step counter, semantic ol/li with aria-current
feat(images-slider): WAI-ARIA carousel pattern + i18n carousel/slide/loading
... (~30 weitere)
```

**Das wiederkehrende Trio pro Komponente:**

1. `focus-visible` Ring (Tastatur-User sehen den Fokus, Maus-User nicht).
2. `aria-label` / `aria-labelledby` / `aria-describedby` (Screenreader haben einen Namen).
3. i18n via `useComponentMessages(MESSAGES, override)` (lokalisierbar, kein hartcodiertes Englisch).

Das Beste am Pattern: es ist **mechanisch wiederholbar**. Sobald du es einmal an `switch` verstanden hast, kannst du es an `checkbox` in 10 Minuten anwenden.

```tsx
// Pattern, das sich ~50× wiederholt:
import { useComponentMessages } from '../i18n';
import { MESSAGES, type SwitchMessages } from './messages';

export interface SwitchProps {
  // ...
  /** i18n overrides for trigger label and current-item suffix. */
  messages?: Partial<SwitchMessages>;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export function Switch({ messages, ...props }: SwitchProps) {
  const m = useComponentMessages(MESSAGES, messages);
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={props['aria-label'] ?? m.label}
      className="focus-visible:ring-2 focus-visible:ring-accent ..."
    >
      ...
    </button>
  );
}
```

**Einschätzung:** Eine Library, die das **vorne** in jedem Component-API mitliefert, ist auf einem völlig anderen Niveau als 99 % der "shadcn-ähnlichen" Projekte. Die meisten Showcases haben i18n als nachgereichten Hack und a11y als Lippenbekenntnis. Hier ist beides **Konvention pro Komponente**.

**Sr.-Dev-Insight:** Wenn du ein wiederkehrendes Pattern in 30 Komponenten erkennst, ist das ein Indiz für ein **Mini-Framework**. Hier: `useComponentMessages` + sibling `messages.ts` + `Partial<XxxMessages>`-Override-Prop. Das ist nicht in einer Library dokumentiert — es ist *deine* Konvention. Genau solche Konventionen sind das, was eine "Design Engine" ausmacht.

---

## C) Dependency Modernization — Lib-Wechsel statt patchen

Über einen Zeitraum von ~3 Wochen wurden alte Libs systematisch ersetzt:

```
0e8d29a refactor(bounce-cards): replace gsap with motion's animate()
5d01d43 refactor(lottie): migrate from lottie-react to @lottiefiles/dotlottie-react
1a27b6f chore(deps): remove unused framer-motion + autoprefixer + postcss
9df158a chore(deps): drop @radix-ui/react-dropdown-menu (dead code)
45e053b chore(deps): remove unused jspdf dependency
e106f00 chore: migrate to Tailwind 4 and refactor components to self-contained modules
87d0233 chore(deps): bump fabric 6.9.1 -> 7.4.0 + migrate engine to v7 API
```

**Einschätzung:** Goldwert. Die meisten Projekte schleppen tote Deps jahrelang mit. Hier wird **proaktiv** abgespeckt. Das hat drei Effekte:

1. **Bundle-Size schrumpft.** `framer-motion` zu `motion` zu ersetzen ist nicht-trivial, aber halbiert die Animation-Runtime.
2. **Security-Surface schrumpft.** Jede unbenutzte Dep ist ein potenzieller Supply-Chain-Angriff (siehe auch `8e65d9a chore(security): harden CI supply chain`).
3. **Mental load schrumpft.** Wer `gsap` *und* `motion` *und* `framer-motion` gleichzeitig im Codebase hat, muss bei jeder Animation überlegen, welche zu nehmen ist. Ein Tool pro Job.

**Sr.-Dev-Insight:** "Wir migrieren von X zu Y" ist ein Commit-Typ, den Mid-Devs vermeiden, weil es "keine Features bringt". Sr. Devs erkennen: jede Dep ist eine *strategische Wette*, die regelmäßig überprüft gehört. Wenn `gsap` 2014 die richtige Wahl war und `motion` es 2026 ist, ist der Sweep ein Pflichtthema, kein Luxus.

---

## D) Extract-on-Second-Use — Library wächst organisch

```
3023802 feat(stack-order-controls): new standalone reorder-buttons component
8665f1c feat(color-swatch): extract popover-wrapped picker as shared component
```

Aus der Commit-Message: *"about to be copy-pasted into ContextToolbar for shape fill. Pulled it out into components/color-swatch/ ..."*

**Das ist die "Rule of Three" in Aktion**, perfekt gemacht: Nicht beim ersten Use abstrahieren (vorzeitig), aber **rechtzeitig vor dem zweiten** — also genau in dem Moment, wo Copy-Paste droht. Das ist das **Senior-Timing**.

**Sr.-Dev-Insight (zur Erinnerung von Welle 3 weiter oben):** Das Anti-Pattern dazu ist genau das, was bei `<button style={{padding:0, border:'none', background:'transparent'}}>` jetzt im jsx-a11y-Sweep passiert ist — fünfmal copy-paste statt einmal `<ResetButton>`. Die Disziplin von `color-swatch` wurde hier nicht angewandt. Das ist die **wertvollste Lektion** für dich: erkenne die Wiederholung, *bevor* du den dritten Copy-Paste machst.

---

## E) TanStack-Adoption als Architektur-Signatur

```
905503c refactor: integrate TanStack Hotkeys and Query, and add new UI essentials
c729e96 refactor(hotkeys): split context into registry and actions for better performance
2da3f34 feat(wine-showcase/cart): replace context with TanStack Query hooks + optimistic mutations
e3424a9 feat(data-table): controllable sorting + pagination, URL-driven demo
```

Konkret beim Cart: Statt einer hand-gerollten React-Context-Lösung mit `useReducer` werden TanStack-Query-Hooks mit dem **kompletten Optimistic-Update-Pattern** verwendet:

```ts
// useAddToCart — Auszug aus dem Pattern
const useAddToCart = () => useMutation({
  mutationFn: (variantId: string) => api.addToCart(variantId),
  onMutate: async (variantId) => {
    await queryClient.cancelQueries({ queryKey: ['cart'] })
    const previous = queryClient.getQueryData(['cart'])
    queryClient.setQueryData(['cart'], optimisticUpdate(previous, variantId))
    return { previous }
  },
  onError: (_err, _vars, ctx) => {
    if (ctx?.previous) queryClient.setQueryData(['cart'], ctx.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  },
})
```

**Einschätzung:** Das ist *Lehrbuch*. `cancelQueries → snapshot → optimistic → rollback → invalidate` ist das vollständige Five-Step-Pattern, das die meisten Devs nur halb implementieren ("ich rufe einfach `setQueryData` und gut"). Hier ist es richtig.

**Sr.-Dev-Insight:** Wenn du zwischen "selbst bauen" und "Library" abwägst, schau auf die *zweite Ableitung*: Library löst nicht nur den Basis-Fall, sondern auch Rollback, Race-Conditions, Stale-While-Revalidate. Selbstgebaut wird das fast nie sauber.

---

## F) Was sich über 393 Commits *nicht* geändert hat

Das ist die interessanteste Beobachtung. Trotz massiver technischer Umwälzungen (Astro-Migration, TanStack, Tailwind v4, Fabric v7, React Compiler, Ark UI v5) bleibt das Repo:

- **Commit-Granular.** Selten ein Commit mit mehr als 1 Thema.
- **Phasen-getrieben.** Migrationen haben Phase 1, 2a, 2b, ... und einen Doku-Commit am Phasen-Ende.
- **Verifikations-belegt.** Fast jede Commit-Message hat ein "Verified: ..." oder "bun lint shows 0".
- **API-bewusst.** Selbst Lint-Fixes werden so gemacht, dass Public-Props stabil bleiben (`_`-Prefix-Pattern).

Das ist *Disziplin*. Und Disziplin über 393 Commits ist genau das, was Sr.-Dev-Arbeit von Mid-Dev-Arbeit unterscheidet.

---

## Die 4 erweiterten Lessons (zusätzlich zu den 7 oben)

8. **Migrations laufen in numerierten Phasen mit Doku-Datei.** "Phase 2b — reset-on-prop-change effects" + `ESLINT-MIGRATION.md` schlägt einen 200-Datei-Sweep jedes Mal. Wenn du mal eine größere Refactor-Aufgabe bekommst, schlag aktiv eine `MIGRATION.md` und Phasen-Commits vor — das ist exakt das Signal, das eine Sr.-Dev-Beförderung rechtfertigt.

9. **Wiederkehrende Patterns über N Komponenten = Mini-Framework.** `useComponentMessages` + `messages.ts` + `Partial<XxxMessages>`-Override ist hier *nicht* eine Library, sondern *eure Konvention*. Lerne, solche Konventionen zu **erkennen, zu benennen, und in einer COMPONENT.md festzuhalten**. Das ist genau das, was `9b331e4 docs(artelier): mandate COMPONENT.md for all components` im Repo getan hat.

10. **Deps sind strategische Wetten, keine Setzlinge.** Plane *aktiv* Dep-Reviews. "gsap → motion" ist nicht "wir wollten Sachen brechen", sondern "die richtige Wahl von 2014 ist nicht die richtige Wahl von 2026". Jeder Sr. Dev hat eine mentale Liste "was haben wir, was sollten wir nicht mehr haben".

11. **Library wächst beim zweiten Use — nicht beim ersten, nicht beim dritten.** Der `color-swatch`-Commit ist das perfekte Timing. Lerne, im Code-Review den Moment zu erkennen: "Hier wird gleich Copy-Paste passieren — wir extrahieren *jetzt*." Genau dieser Instinkt ist beim `<button>`-Reset-Style-Pattern in Welle 3 *nicht* angewandt worden, und genau das ist die Lücke, an der du arbeiten kannst.

---

## Zusammenfassung: Wo das Repo steht

Das ist kein typisches "Component-Library"-Repo. Es ist eine **Design Engine** mit:

- 393 Commits über mehrere Monate
- 3 Multi-App-Konsumenten (`components-showcase`, `section-showcase`, `vendure-showcase`) + 1 Domain-App (`cellar-canvas`)
- Vollständigem i18n + a11y pro Komponente als Konvention
- Phasen-getriebener ESLint-Migration mit Doku
- Aktiver Dep-Modernisierung (gsap, lottie, framer-motion, fabric, ark-ui)
- TanStack-zentrierter State-Architektur
- React Compiler-bewussten Konventionen (keine manuelle Memoization)

**Das Niveau, auf dem hier gearbeitet wird, ist bereits Sr.-Dev-Niveau.** Was zur Beförderung fehlt, ist nicht "mehr Code schreiben", sondern **bewusst benennen, was hier passiert** — also: solche Retrospektiven schreiben, Konventionen in COMPONENT.md festhalten, Phasen-Pläne vor Migrationen vorschlagen, Dep-Reviews quartalsweise anstoßen. Das sind die Tätigkeiten, die einen Sr. Dev von einem fleißigen Mid Dev unterscheiden.
