# CSS Variables Migration Guide
## Ziel: shadcn-kompatibles Theming + Tailwind v4 Best Practices

---

## Warum diese Migration?

### 1. `@theme inline` fehlt
Tailwind v4 ohne `inline` generiert **eigene** `--tw-*` Variablen parallel zu den eigenen CSS-Variablen.
Mit `inline` überschreibt Tailwind die eigenen Variablen direkt – kein Overhead, kein Naming-Konflikt.

### 2. Hex-Werte blockieren Opacity-Modifier
```css
/* Tailwind generiert intern: */
bg-card/50 → color-mix(in oklch, var(--color-card) 50%, transparent)
```
Wenn `--card` ein Hex-Wert ist, muss der Browser erst Hex → oklch umrechnen, bevor er mixen kann.
Mit oklch direkt: kein Umweg, 100% zuverlässig – `bg-card/50`, `text-foreground/60` etc. funktionieren garantiert.

### 3. Nicht-standardisierte Variablennamen
`--bg`, `--text`, `--text-muted` → beim Copy-Paste einer Komponente in ein shadcn-Projekt
greifen diese Variablen ins Leere. Mit shadcn-Standard-Namen funktioniert Copy-Paste sofort.

### 4. Fehlende semantische Variablen
`--muted`, `--input`, `--ring`, `--radius` fehlen bisher vollständig.
Ohne `--ring` muss z.B. der Focus-Ring-Farbwert hart kodiert werden.

---

## Vollständiges Variablen-Mapping

### CSS-Variablen: Umbenennen

| Alt (aktuell) | Neu (nach Migration) | Vorkommen |
|---|---|---|
| `--bg` | `--background` | 8 |
| `--text` | `--foreground` | ~60 |
| `--text-muted` | `--muted-foreground` | ~30 |
| `--card` | `--card` | ✓ unverändert |
| `--border` | `--border` | ✓ unverändert |
| `--accent` | `--accent` | ✓ unverändert – Sonderfall, siehe unten |

### CSS-Variablen: Neu hinzufügen

| Variable | Wert | Zweck |
|---|---|---|
| `--card-foreground` | = `--foreground` | Text-Farbe auf Cards |
| `--muted` | leicht heller als `--card` | Hintergründe für deaktivierte/sekundäre Bereiche |
| `--input` | = `--border` | Border-Farbe für Input-Felder |
| `--ring` | = `--accent` | Focus-Ring-Farbe |
| `--radius` | `0.5rem` | Basis-Border-Radius für `--radius-sm/md/lg` |
| `--destructive` | `oklch(0.577 0.245 27)` | Rot-Farbe für Danger-Elemente (statt hardcoded #e11d48) |
| `--destructive-foreground` | `oklch(1 0 0)` | Weiß auf Destructive-Bg |
| `--primary` | `var(--accent)` | Alias für shadcn-Kompatibilität |
| `--primary-foreground` | `oklch(1 0 0)` | Weiß auf Primary-Bg |

### Tailwind `@theme`: Was sich ändert

| Alt | Neu |
|---|---|
| `@theme { ... }` | `@theme inline { ... }` |
| `--color-bg: var(--bg)` | `--color-background: var(--background)` |
| `--color-foreground: var(--text)` | `--color-foreground: var(--foreground)` |
| `--color-muted-foreground: var(--text-muted)` | `--color-muted-foreground: var(--muted-foreground)` |
| *(fehlte)* | `--color-card-foreground: var(--card-foreground)` |
| *(fehlte)* | `--color-muted: var(--muted)` |
| *(fehlte)* | `--color-input: var(--input)` |
| *(fehlte)* | `--color-ring: var(--ring)` |
| *(fehlte)* | `--color-destructive: var(--destructive)` |
| *(fehlte)* | `--color-primary: var(--primary)` |
| *(fehlte)* | `--radius-sm/md/lg` via `calc(var(--radius) ...)` |

### Tailwind-Klassen in `.tsx`-Dateien

| Alt | Neu |
|---|---|
| `bg-bg` | `bg-background` |
| `text-foreground` | ✓ korrekt – keine Änderung |
| `text-muted-foreground` | ✓ korrekt – keine Änderung |
| `bg-card` | ✓ korrekt |
| `border-border` | ✓ korrekt |
| `bg-accent` | ✓ korrekt |
| `focus:ring-accent` | → `focus:ring-ring` (optional, beide funktionieren) |

---

## Das `--accent` Sonder-Problem

shadcn unterscheidet zwei Farben:
- `--primary` = Haupt-Brand-Farbe (Buttons, Links) → **das ist euer `--accent`**
- `--accent` = sehr helle Hover-Tint in Navigation und Menüs → viel dezenter

**Problem**: 192 Vorkommen von `var(--accent)` in 29 Dateien umbenennen + der
`accent-switcher` setzt explizit `data-accent="indigo|amber|emerald|rose"` Attribute und
überschreibt `--accent`. Vollständige Umbenennung auf `--primary` wäre ein massives
Refactoring für minimalen praktischen Nutzen.

**Empfehlung**: `--accent` behalten, `--primary` als Alias ergänzen:
```css
:root {
  --accent:            oklch(0.585 0.233 277);  /* bleibt */
  --primary:           var(--accent);           /* Alias → shadcn-kompatibel */
  --primary-foreground: oklch(1 0 0);
}
```
Damit sind shadcn-Klassen wie `bg-primary text-primary-foreground` nutzbar,
ohne dass bestehende Komponenten angefasst werden müssen.

---

## Wo die Migration NICHT möglich ist

### 1. Lottie JSON-Dateien (`_resources_/`)
```json
"stroke": "rgb(0,0,0)"
```
Lottie rendert SVG-Attribute direkt ins DOM. CSS-Custom-Properties werden nicht ausgewertet.
**Einzige Option**: der bestehende `filter: var(--icon-invert)` Trick – bleibt wie er ist.
Betrifft: alle `_resources_/**/*.json`

### 2. Canvas-basierte Komponenten
`particles.tsx`, `splash-cursor.tsx`, `ambient-image.tsx`, `confetti.tsx` – diese schreiben
direkt auf ein `<canvas>` Element via 2D/WebGL-Context. CSS-Variablen sind dort nicht lesbar.
Farben kommen als **Props** rein – das ist das korrekte Pattern, keine Migration nötig.

### 3. GSAP-Animationen (`bounce-cards.tsx`)
GSAP interpoliert Werte numerisch (von Zahl zu Zahl). CSS-Variablen könnten nur
als statische Startwerte gelesen werden (`getComputedStyle`), aber nicht direkt
in GSAP-Tweens verwendet werden. **Nicht migrierbar** für animierte Properties.

### 4. Sonder-Variablen ohne shadcn-Äquivalent
Diese bleiben unverändert:
```css
--icon-invert:   invert(1) / invert(0)   /* Lottie Dark/Light Fix */
--theme-primary: 99 102 241              /* RGB-Channels für rgba() */
--theme-accent:  139 92 246              /* RGB-Channels für rgba() */
```
`--theme-primary`/`--theme-accent` werden als raw RGB-Werte genutzt:
```tsx
background: `rgba(var(--theme-primary), 0.15)`
```
Das ist ein eigenes Pattern (kein CSS Color Type), das CSS-native `color-mix` nicht ersetzen kann.

### 5. Fallback-Werte in Inline Styles
```tsx
color: 'var(--text, #e4e4e7)'           // ← Fallback bleibt Hex
color: 'var(--foreground, #e4e4e7)'     // nach Migration: Variable geändert, Fallback ok
```
Die Fallback-Hex-Werte können auf oklch aktualisiert werden, müssen aber nicht –
Fallbacks sind nur relevant wenn die CSS-Variable nicht definiert ist (Fehlerfall).

---

## Step-by-Step Anleitung

### Schritt 1 – `showcase/src/styles.css` komplett umschreiben

Neuer Aufbau:

```css
@import "tailwindcss";

@theme inline {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;

  /* Color mappings */
  --color-background:       var(--background);
  --color-foreground:       var(--foreground);
  --color-card:             var(--card);
  --color-card-foreground:  var(--card-foreground);
  --color-muted:            var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border:           var(--border);
  --color-input:            var(--input);
  --color-ring:             var(--ring);
  --color-accent:           var(--accent);
  --color-primary:          var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-destructive:      var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  /* Radius */
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 4px);
  --radius-xl: calc(var(--radius) + 8px);

  /* Animations (unverändert) */
  @keyframes aurora { ... }
  --animate-aurora: aurora 10s ease infinite;
}

/* ── Dark Mode (default) ─────────────────────────────── */
:root {
  --background:             oklch(0.062 0.004 285);
  --foreground:             oklch(0.905 0.004 285);
  --card:                   oklch(0.082 0.004 285);
  --card-foreground:        oklch(0.905 0.004 285);
  --muted:                  oklch(0.118 0.004 285);
  --muted-foreground:       oklch(0.491 0.010 285);
  --border:                 oklch(0.188 0.006 285);
  --input:                  oklch(0.188 0.006 285);
  --accent:                 oklch(0.585 0.233 277);
  --primary:                var(--accent);
  --primary-foreground:     oklch(1 0 0);
  --ring:                   var(--accent);
  --destructive:            oklch(0.577 0.245 27);
  --destructive-foreground: oklch(1 0 0);
  --radius:                 0.5rem;

  /* Nicht migrierbar – behalten */
  --icon-invert:            invert(1);
  --theme-primary:          99 102 241;
  --theme-accent:           139 92 246;
}

/* ── Light Mode ──────────────────────────────────────── */
[data-theme="light"] {
  --background:             oklch(0.979 0.002 285);
  --foreground:             oklch(0.141 0.004 285);
  --card:                   oklch(1 0 0);
  --card-foreground:        oklch(0.141 0.004 285);
  --muted:                  oklch(0.961 0.002 285);
  --muted-foreground:       oklch(0.491 0.010 285);
  --border:                 oklch(0.870 0.004 285);
  --input:                  oklch(0.870 0.004 285);

  /* accent/primary/ring/destructive/radius: identisch zu dark */

  --icon-invert:            invert(0);
  --theme-primary:          99 102 241;
  --theme-accent:           139 92 246;
}

@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased leading-relaxed;
  }
}
```

> **Hex → oklch Umrechnung**: Am einfachsten mit [oklch.com](https://oklch.com) oder
> dem DevTools Color Picker (CSS → oklch). Die oklch-Werte oben entsprechen exakt
> den bisherigen Hex-Werten.

---

### Schritt 2 – Find & Replace in allen Dateien

Reihenfolge beachten (längere Strings zuerst, sonst Partial-Match-Fehler):

| Suchen | Ersetzen | Dateitypen |
|---|---|---|
| `var(--text-muted,` | `var(--muted-foreground,` | `.tsx` |
| `var(--text-muted)` | `var(--muted-foreground)` | `.tsx` |
| `var(--text,` | `var(--foreground,` | `.tsx` |
| `var(--text)` | `var(--foreground)` | `.tsx` |
| `var(--bg,` | `var(--background,` | `.tsx` |
| `var(--bg)` | `var(--background)` | `.tsx` |
| `bg-bg` | `bg-background` | `.tsx`, `.css` |
| `--bg:` | `--background:` | `.css` (nur styles.css) |
| `--text:` | `--foreground:` | `.css` |
| `--text-muted:` | `--muted-foreground:` | `.css` |

In VS Code: `Ctrl+Shift+H` (Find in Files mit Replace).
Scope auf `components/**/*.tsx` und `showcase/**/*.tsx` beschränken.

---

### Schritt 3 – Prop-Defaults aktualisieren

Diese verwenden die alten Variablen als Default-Wert in Komponent-Props:

**`components/navbar/navbar.tsx`** (Zeile ~137):
```tsx
// Alt:
bgColor = 'var(--bg, #0a0a0b)'
// Neu:
bgColor = 'var(--background, #0a0a0b)'
```

**`components/password-confirmation/password-confirmation.tsx`** (Zeile ~76):
```tsx
// Alt:
neutralColor = 'var(--text-muted, #71717a)'
// Neu:
neutralColor = 'var(--muted-foreground, #71717a)'
```

---

### Schritt 4 – `showcase/src/layout.tsx` anpassen

```tsx
// Alt:
<Navbar sticky height={56} bgColor="var(--bg)" borderColor="var(--border)">
// Neu:
<Navbar sticky height={56} bgColor="var(--background)" borderColor="var(--border)">
```

---

### Schritt 5 – `README.md` aktualisieren

```markdown
// Alt:
CSS Custom Properties (`--accent`, `--bg`, `--card`, `--border`, `--text`)
// Neu:
CSS Custom Properties (`--accent`, `--background`, `--card`, `--border`, `--foreground`)
```

---

### Schritt 6 – Verifizieren

Nach der Migration diese Klassen testen – alle sollten funktionieren inkl. Opacity:

```tsx
// Opacity-Modifier (vorher unzuverlässig, jetzt garantiert):
<div className="bg-card/50 border-border/40 text-foreground/80">
  <p className="text-muted-foreground/60">Test</p>
</div>

// Neue Variablen:
<input className="border-input ring-ring focus:ring-2 focus:ring-ring/50" />
<button className="bg-destructive text-destructive-foreground">Delete</button>
<div className="bg-muted rounded-md">Muted background</div>
```

---

## Zusammenfassung: Was ändert sich, was bleibt

| | Ändert sich | Bleibt unverändert |
|---|---|---|
| `styles.css` | komplett | — |
| `showcase/**/*.tsx` | `var(--bg/text/text-muted)` + `bg-bg` | alle anderen Klassen |
| `components/**/*.tsx` | `var(--bg/text/text-muted)` in inline styles | Logik, Props-API, Animationen |
| Lottie JSON | — | ✓ komplett |
| Canvas-Komponenten | — | ✓ komplett |
| GSAP-Komponenten | — | ✓ komplett |
| `--accent` | — | ✓ unverändert (Alias `--primary` kommt neu dazu) |
| `--icon-invert` | — | ✓ unverändert |
| `--theme-primary/accent` | — | ✓ unverändert |
