# ESLint Migration Plan

Status nach Setup: **102 Findings** (36 Errors, 66 Warnings) im bestehenden Code. Neue Files (shape-card, wine-card, neue Showcase-Sections) sind clean.

Dieser Plan migriert das Repo schrittweise auf einen lint-grünen Stand. Surgical-Changes-Regel gilt: **keine Drive-by-Refactorings** beim Beheben — wenn ein Component-Fix tieferliegende Issues aufdeckt, dokumentieren statt mitzubeheben.

---

## 0. Working Principles

Quellen: [ARTELIER.md](ARTELIER.md), [karpathy-guidelines.md](../__AI-Workflow__/Skills/karpathy-guidelines.md). Diese Prinzipien gelten für **jeden Fix in jeder Phase**:

1. **Think Before Coding** — Vor allem bei `set-state-in-effect` (13 Findings, mehrere legitime Strategien): erst die Strategie benennen (derived state vs. Event-Handler vs. bewusste externe Sync), dann implementieren. Nicht reflexartig in `useMemo` umbauen.

2. **Simplicity First** — Kleinster Fix, der den Lint grün macht. Kein architektonisches Refactoring, um eine Mutations-Warnung loszuwerden — Array vor dem Loop erstellen ist OK, Strukturwechsel ist es nicht.

3. **Surgical Changes** — Eine Komponente, ein Commit. Wenn beim Fixen ein anderes Antipattern auffällt → in dieser MD unter §7 "Spotted, not touched" aufnehmen, nicht mitbeheben.

4. **Iterative Refactoring** — Bricht ein Fix das Verhalten: **nicht patchen**, sondern den Versuch via `git revert` sauber zurücksetzen, bevor der nächste Ansatz kommt. Pro Component-Fix ein eigener Commit, damit das trivial bleibt.

5. **AI Stealth** — Commit-Messages plain (`chore: eslint phase X — <kurz>`), kein `Co-Authored-By: Claude`-Footer, keine Tool-Hinweise.

---

## 1. Setup (✅ erledigt)

- `eslint@10.3.0` + `@eslint/js` + `typescript-eslint@8.59` + `eslint-plugin-react-hooks@7.1` + `eslint-plugin-react-refresh@0.5`
- Flat-Config in [eslint.config.js](eslint.config.js)
- Root: `bun lint` · Workspace-Scripts: `bun --filter <name> lint`
- Plugin-Hooks v7 enthält die React-Compiler-Rules (`purity`, `refs`, `set-state-in-effect/render`, etc.) — das ist der eigentliche Hebel.

---

## 2. Findings nach Rule

| Rule | Count | Kategorie |
|---|---:|---|
| `react-refresh/only-export-components` | 34 | HMR-Hygiene |
| `@typescript-eslint/no-unused-vars` | 24 | Tote Imports/Vars |
| `react-hooks/set-state-in-effect` | 13 | **Compiler-blocker** |
| `react-hooks/refs` | 13 | **Compiler-blocker** |
| `react-hooks/exhaustive-deps` | 8 | Hook-Dependencies |
| `react-hooks/purity` | 5 | **Compiler-blocker** |

**Compiler-Blocker** (insgesamt 31 Findings) sind die wichtigsten — sie markieren Code, den der React Compiler nicht optimieren kann. Solange sie drin sind, läuft der Compiler im Stille-Stillstand für betroffene Components.

---

## 3. Migration in Phasen

### Phase 1 — Trivialer Cleanup (~30 min, Risiko: null)

Auto-fixable + offensichtlich tot. Pure Aufräumarbeit.

**Scope:**
- 24× `@typescript-eslint/no-unused-vars` — ungenutzte Imports/Variablen entfernen
- Ggf. mit `bun lint --fix` (nur 1 von 102 ist auto-fixable, aber unused-imports lassen sich semi-automatisch via IDE-Action killen)

**Files (Top-3 nach Count):**
- [components/password-setup/password-setup.tsx](components/password-setup/password-setup.tsx) — 3
- [wine-showcase/storefront/src/lib/cart-context.ts](wine-showcase/storefront/src/lib/cart-context.ts) — 3
- [components/accent-switcher/accent-switcher.tsx](components/accent-switcher/accent-switcher.tsx) — 2
- + 18 weitere mit je 1-2

**Akzeptanzkriterium:** `bun lint` zeigt 0× `no-unused-vars`.

---

### Phase 2 — Compiler-Blocker (zentral) (~2-3h, Risiko: mittel)

Die 31 Compiler-Findings systematisch beheben. Diese Phase ist der eigentliche Wertgewinn.

#### 2a. `react-hooks/refs` (13 Findings)

`ref.current` darf nur in Effects oder Event-Handlern gelesen/gesetzt werden, nicht im Render-Body.

**Hotspot:**
- [components/pixel-image/pixel-image.tsx](components/pixel-image/pixel-image.tsx) — **10** (90% der Findings konzentriert hier)
- [components/password-setup/password-setup.tsx](components/password-setup/password-setup.tsx) — 2
- [components/number-input/number-input.tsx](components/number-input/number-input.tsx) — 1

→ Pixel-image isoliert als Sub-Task: einmal richtig refactoren, dann sind 10 Findings weg.

#### 2b. `react-hooks/set-state-in-effect` (13 Findings)

`setState()` synchron im Effect-Body → cascading renders. Lösung: derived state bevorzugen (`useMemo`/Compiler), oder Effect-Logik in Event-Handler verschieben, oder bewusst markieren wenn unvermeidbar (externe Synchronisation).

**Verteilung:** je 1 Finding über 13 Components (countdown, blur-fade, sticky-banner, sparkles-text, ambient-image, autocomplete-cell, text-scramble, ThemeToggle, Providers, …). Jeder Fix lokal, niedrige Cross-Component-Kopplung.

#### 2c. `react-hooks/purity` (5 Findings)

Mutationen während Render. Meist: `array.push` / `Object.assign` auf in Render erstellten Strukturen.

**Files:**
- [components/animated-icons/animated-icons.tsx](components/animated-icons/animated-icons.tsx) — 1
- [components/accent-switcher/accent-switcher.tsx](components/accent-switcher/accent-switcher.tsx) — 1
- [components/pixel-image/pixel-image.tsx](components/pixel-image/pixel-image.tsx) — 1
- [showcase/src/pages/feedback.tsx](showcase/src/pages/feedback.tsx) — 1
- [showcase/src/pages/navigation.tsx](showcase/src/pages/navigation.tsx) — 1

**Akzeptanzkriterium:** `bun lint` zeigt 0× `react-hooks/refs`, 0× `react-hooks/set-state-in-effect`, 0× `react-hooks/purity`. Bei jedem Component-Fix: Build + Smoke-Test der Showcase-Seite.

---

### Phase 3 — Hook-Dependencies (~45 min, Risiko: niedrig)

8× `react-hooks/exhaustive-deps`. Klassisches Problem.

**Files:**
- [wine-showcase/storefront/src/components/react/Providers.tsx](wine-showcase/storefront/src/components/react/Providers.tsx) — 4 (alle in einem File, vermutlich das gleiche Pattern)
- [components/atelier/provider.tsx](components/atelier/provider.tsx) — 1
- [components/hotkeys/hotkeys-provider.tsx](components/hotkeys/hotkeys-provider.tsx) — 1
- [components/i18n/provider.tsx](components/i18n/provider.tsx) — 1
- [components/accent-switcher/accent-switcher.tsx](components/accent-switcher/accent-switcher.tsx) — 1

Strategie: jede missing dep einzeln bewerten — meist hinzufügen; in seltenen Fällen `useEffectEvent`-Pattern wenn Stale-Closure-Problem.

**Akzeptanzkriterium:** 0× `exhaustive-deps`.

---

### Phase 4 — HMR-Hygiene (~1h, Risiko: niedrig, optional)

34× `react-refresh/only-export-components` — Components mit Mixed Exports (Component + Constants/Utils im selben File). HMR triggert dann full reload statt Fast Refresh.

Keine **Korrektheits**-Frage, sondern DX. Zwei Strategien:

1. **Splitten:** Constants/Utils in separates File ziehen (sauber, mehr Files).
2. **`{ allowConstantExport: true }`** — Konstanten dürfen mit raus. Bereits aktiv in unserer Config — Findings die übrig bleiben sind echte gemixte Helper.

**Hotspot:**
- [components/animated-icons/animated-icons.tsx](components/animated-icons/animated-icons.tsx) — **14** (wahrscheinlich ein Icon-Set: viele Sub-Components in einem File)
- [components/hotkeys/hotkeys-provider.tsx](components/hotkeys/hotkeys-provider.tsx) — 3
- + verteilte 1-2er

→ Phase 4 ist optional und kann weiter geschoben werden. Die Compiler-Wirksamkeit hängt nicht davon ab.

**Akzeptanzkriterium:** 0× `react-refresh/only-export-components` ODER bewusste Akzeptanz mit `// eslint-disable-next-line` + Begründung.

---

## 4. Ausführung

### Reihenfolge

1. Phase 1 (trivial cleanup) — quick win, schafft Übersicht.
2. Phase 2 (Compiler-Blocker) — der eigentliche Wert. Pro Component: lint clean → build → manueller Smoke-Test.
3. Phase 3 (deps) — kann parallel mit Phase 2 laufen, da Files überlappen.
4. Phase 4 (HMR) — optional, später.

### Per Phase

```bash
# vor Beginn: snapshot
git switch -c chore/eslint-phase-1
bun lint > /tmp/before.txt

# Arbeit

# Akzeptanz:
bun lint              # Phase-Ziel erreicht?
bun --filter components-showcase build   # smoke
bun --filter wine-showcase-storefront build
git commit -m "chore: eslint phase X — <kurz>"
```

### Was nicht zu tun ist

- **Keine Drive-by-Refactorings.** Wenn beim Fixen ein anderes Antipattern auffällt → Issue aufnehmen, nicht mit-fixen.
- **Keine Massen-`eslint-disable`.** Nur file-/line-spezifisch und mit Begründung.
- **Keine Compiler-Blocker still aushebeln** durch `// eslint-disable-next-line react-hooks/...`. Wenn Code wirklich unvermeidbar so aussehen muss, dann mit ausführlichem Kommentar dokumentieren.

---

## 5. CI-Integration (nach Phase 2)

Sobald Compiler-Blocker = 0, in CI verdrahten:

```yaml
# Beispiel GitHub Actions step
- run: bun install
- run: bun lint
```

PRs müssen lint-grün sein. Erlaubt sind dann nur Warnings (`react-refresh/...` bis Phase 4 fertig).

Optional: pre-commit via `lint-staged`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": "eslint --max-warnings 0"
  }
}
```

---

## 6. Tracking

| Phase | Status | Owner | Findings vorher | nachher |
|---|---|---|---:|---:|
| 1 — Trivial cleanup | ✅ | claude | 24 | 0 |
| 2a — `refs` | ✅ | claude | 13 | 0 |
| 2b — `set-state-in-effect` | ✅ | claude | 13 | 0 |
| 2c — `purity` | ☐ | — | 5 | — |
| 3 — `exhaustive-deps` | ☐ | — | 8 | — |
| 4 — HMR (optional) | ☐ | — | 34 | — |
| 5 — Doku in techstack-base | ✅ | claude | — | 4 docs + README |
| **Gesamt** | — | — | **102** | **0** |

---

## 7. Spotted, not touched

Antipatterns, die beim Lint-Fixen auffallen, aber bewusst **nicht** mitgefixt werden (Surgical-Changes-Regel). Pro Eintrag: File, kurze Beschreibung, ggf. Phase.

- **[components/accent-switcher/accent-switcher.tsx](components/accent-switcher/accent-switcher.tsx)** (Phase 1) — Props `defaultPalette` und `accentAttribute` sind im Type definiert + per Default belegt, werden aber im Component-Body nicht benutzt. Lint-Fix: nur Binding mit `_` prefixed (`defaultPalette: _defaultPalette`). Follow-up: entweder Verhalten implementieren oder Props aus dem Type entfernen.
- **[components/toast/toast.tsx](components/toast/toast.tsx)** (Phase 1) — Props `index` und `total` (`ToastItemProps`) sind ungenutzt. Vermutlich war dort mal Stagger-Layout oder "X of Y"-Anzeige geplant. Lint-Fix: `_`-prefixed. Follow-up: Feature implementieren oder aus Interface streichen.
- **[components/particles/COMPONENT.md](components/particles/COMPONENT.md) ↔ [particles.tsx](components/particles/particles.tsx)** (Phase 1) — Doku verspricht `particleSpread` "scales initial distribution", aber im Code wird die Prop in `createParticles` nie verwendet (Partikel-x/y sind `Math.random() * width/height`). Der `const spread = particleSpread * 20` war Tot­code, den Phase 1 entfernt hat. Pre-existing Doku-Drift. Follow-up: entweder Spread-Logik implementieren oder Prop + Doku-Eintrag streichen.

---

## 8. Changelog

Chronologische Einträge zu Fortschritt, Entscheidungen, Reverts. Jeder Eintrag mit Datum.

- **2026-05-06** — §0 Working Principles ergänzt (Karpathy + ARTELIER). Tracking um Phase 5 (Doku) und Sections §7/§8 erweitert.
- **2026-05-06** — Phase 5 gestartet: `__AI-Workflow__/Skills/techstack-base/` wird angelegt, ESLint-Stack-Dokus für die installierten Versionen werden archiviert.
- **2026-05-06** — Phase 5 ✅ erledigt. Angelegt:
  - [`techstack-base/README.md`](../__AI-Workflow__/Skills/techstack-base/README.md) — Index + Konventionen.
  - [`techstack-base/eslint/eslint-flat-config.md`](../__AI-Workflow__/Skills/techstack-base/eslint/eslint-flat-config.md) — ESLint v10.3.0.
  - [`techstack-base/eslint/eslint-plugin-react-hooks.md`](../__AI-Workflow__/Skills/techstack-base/eslint/eslint-plugin-react-hooks.md) — v7.1.1 inkl. Compiler-Rules.
  - [`techstack-base/eslint/eslint-plugin-react-refresh.md`](../__AI-Workflow__/Skills/techstack-base/eslint/eslint-plugin-react-refresh.md) — v0.5.2.
  - [`techstack-base/eslint/typescript-eslint.md`](../__AI-Workflow__/Skills/techstack-base/eslint/typescript-eslint.md) — v8.59.2.
- **2026-05-06** — Phase 1 ✅ erledigt (24 → 0 Findings, 3 Commits):
  - **Step 1** (`20ad3cc`) — 10 Files: ungenutzte Imports entfernt (form-input, images-slider, password-confirmation, password-setup, pixel-image, search-overlay, navigation, text, vendure-config, cart-context).
  - **Step 2** (`7e63497`) — particles.tsx (`hexToRgba`-Helper + `spread`-Const), stepper.tsx (`isPending`).
  - **Step 3** (`99c46a9`) — `_`-Prefix für ungenutzte Args/Destructured-Props (accent-switcher, toast, atelier/provider, password-setup, inputs page). Zwei §7-Einträge ergänzt für accent-switcher und toast (echte Dead-Props, follow-up nötig).
  - User-Präferenz festgehalten: Commit pro Sub-Step in einer Phase ([feedback memory](../../.claude/projects/-Users-robert-stickler-Development---Components--/memory/feedback_commit_per_step.md)).
- **2026-05-06** — Phase 2a ✅ erledigt (13 → 0 Findings, 3 Commits):
  - **Step 1** (`c1b4fbb`) — pixel-image: Fisher-Yates shuffle aus `useRef`+render-mutation auf `useMemo` umgestellt. Eliminiert alle 10 refs-Findings + 1 purity-Finding (Math.random() im useMemo OK).
  - **Step 2** (`6b8b03b`) — password-setup `FancyDotInput`: `lastCharRef.current`-Write in `useEffect` verschoben. Read in Render bleibt mit `eslint-disable-next-line` + Begründung (offizieller usePrevious-Pattern für one-shot Animation-Trigger).
  - **Step 3** (`0fbe0b0`) — number-input: `nudgeRef.current = nudge` aus Render in deps-losen `useEffect` verschoben (bridge für stale-closure im einmaligen non-passive wheel-listener).
  - COMPONENT.md-Check: Verhalten unverändert in allen vier betroffenen Components, keine Doku-Updates nötig. Eine pre-existing Doku-Drift in `particles` (Prop `particleSpread` ist im Code nie wirklich angewandt) als §7-Eintrag aufgenommen.
- **2026-05-07** — Phase 2b ✅ erledigt (13 → 0 Findings, 5 Commits, gruppiert nach Pattern):
  - **Step 1** (`5914b8f`) — blur-fade: `prefersReduced` von in-render-`matchMedia` auf `useState`-Lazy-Init umgestellt; `visible` kann initial `true` sein für reduced-motion-User. Echte Code-Verbesserung (kein Disable nötig). Bonus: ein purity-Finding auch behoben.
  - **Step 2** (`2b319fb`) — Reset-on-prop-change-Pattern (5 Files: ambient-image, autocomplete-cell, password-confirmation, sparkles-text, text-scramble). Disable + Begründung. Alternative `key`-Reset würde public API zerschießen.
  - **Step 3** (`2785607`) — Hydrate-from-DOM/storage (3 Files: sticky-banner, ThemeToggle, accent-switcher-v-dualsvg). Lazy-Init nicht möglich wegen SSR. Disable + Begründung.
  - **Step 4** (`5ff8910`) — i18n/provider: controlled-prop sync. Disable + Begründung (Uncontrolled-default-API muss bleiben).
  - **Step 5** (`3b3153c`) — Timer/async (countdown wall-clock, floating-cart FAB-visibility, Providers cart-refresh). Disable + Begründung.
  - Erkenntnis: die Rule feuert nur 1× pro `useEffect`, nicht pro `setState`-Call innerhalb. Bei mehreren setStates pro Effect reicht ein einziger `eslint-disable-next-line` an der ersten Stelle.
