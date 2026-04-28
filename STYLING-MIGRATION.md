# Styling Migration Plan

## Ziel

Komponenten-Styling auf einen sauberen Hybridansatz umstellen:
- **Tailwind** für Struktur, Layout, statische States, Breakpoints
- **Inline styles** nur für animations-getriebene, dynamische Werte

Portabilität wird zugunsten von sauberem, responsivem Layout geopfert.
Tailwind v4 + `tailwind-merge` sind als Dependency vorausgesetzt.

---

## Regel: Was wohin gehört

| Was | Werkzeug | Beispiel |
|---|---|---|
| Flex/Grid/Gap/Padding/Margin | Tailwind | `className="flex flex-col gap-2 p-4"` |
| Responsive Breakpoints | Tailwind | `className="flex-col md:flex-row"` |
| Hover / Focus / Active | Tailwind | `className="hover:opacity-80 transition-opacity"` |
| Statische Farben & Border | Tailwind + CSS Vars | `className="border border-border rounded-lg"` |
| Animations-State (position, size, transform) | `style={{}}` | `style={{ left: \`${pct}%\` }}` |
| Dynamische CSS-Variablen übergeben | `style={{}}` | `style={{ '--offset': \`${x}px\` }}` |
| Theming-Variablen referenzieren | Tailwind arbitrary | `className="text-[var(--accent)]"` oder CSS Var direkt |
| Keyframe-Animationen | injected CSS (STYLE_ID) | bleibt wie bisher |

---

## Dependencies pro Komponente

```ts
import { cn } from '../lib/utils' // clsx + tailwind-merge
```

`cn()` wird in jeder migrierten Komponente für conditional classes genutzt.
Die `lib/utils` Datei existiert bereits im Showcase — für standalone-Nutzung muss sie mitgeliefert werden.

---

## Migrations-Strategie

### Neue Komponenten
Direkt im Hybridansatz schreiben. Kein inline style für Strukturelles.

### Bestehende Komponenten — Priorität

**Hoch** (viel strukturelles Inline-Styling, responsive relevant):
- `Stepper` / `VerticalStepper` — Layout der Step-Cards, Connector-Abstände
- `Timeline` — Grid-Layout, Column-Sizing, Breakpoint für mobile (Stack statt Grid)
- `AutocompleteCell` — bereits Tailwind, nur aufräumen

**Mittel** (gemischt, Animation-State dominiert aber Struktur vorhanden):
- `Slider` — Track-Container, Label-Row
- `AnimatedSearch` — Container-Layout
- `GooeyInput` — Wrapper

**Niedrig** (Animation-State dominiert fast vollständig, Aufwand > Nutzen):
- `Dock`, `GlowCard`, `MagneticButton`, `AddToCartButton`
- Alle Effekt-Komponenten (Particles, SplashCursor, LightRays, etc.)

---

## Responsive Breakpoints — Grundsätze

Komponenten sind grundsätzlich **container-agnostisch** — sie füllen ihren Eltern-Container.
Breakpoint-Logik gehört in die Komponente nur wenn das interne Layout sich ändern muss:

```
Mobile-first Standard-Breakpoints (Tailwind v4):
  sm  640px
  md  768px
  lg  1024px
```

Konkrete Kandidaten für interne Breakpoints:
- `Stepper` → horizontal auf `md+`, vertikal auf `sm`
- `Timeline` → Year-Column auf `sm` ausblenden oder inline stellen
- `VerticalStepper` → bereits vertikal, passt

---

## Was sich NICHT ändert

- CSS-Variablen-System (`--accent`, `--foreground`, `--border`, etc.) bleibt vollständig erhalten
- Dark/Light Mode über `[data-theme="light"]` bleibt
- Keyframe-Injektion via `STYLE_ID` bleibt für Animationen
- Framer Motion bleibt für Spring-Physik
- Inline styles bleiben für alle dynamisch berechneten Werte
