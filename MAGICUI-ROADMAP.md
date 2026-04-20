# MagicUI Integration – Roadmap (Rev. 2)

> Stand: 2026-04-17. Analyse nach Bestandsaufnahme aller existierenden Komponenten.
> Vollständige Checklist aller Shop-UI-Elemente: **SHOP-UI-COMPONENTS.md**

---

## Bestandsaufnahme – Was ist bereits da?

Vor der Planung wurde der komplette `components/`-Ordner gesichtet.
Mehrere MagicUI-Targets sind ganz oder teilweise **bereits implementiert**:

| Geplant (MagicUI) | Existiert bereits als | Bewertung |
|---|---|---|
| `@magicui/sparkles-text` | `sparkles-text/sparkles-text.tsx` | **vollständig – SKIP** |
| `@magicui/particles` | `particles/particles.tsx` | **vollständig – nur Wrapper fehlt** |
| `@magicui/animated-gradient-text` | `aurora-text/aurora-text.tsx` | **überschneidend – als Variant mergen** |
| `@magicui/pointer` | `splash-cursor/splash-cursor.tsx` | **verwandt aber anderes Gewicht – beide behalten** |
| `@magicui/animated-circular-progress-bar` | `scroll-progress/scroll-progress.tsx` | **andere Form – trotzdem neu bauen** |
| Logo Ticker (MagicUI) | `velocity-scroll/velocity-scroll.tsx` | **vollständig – SKIP** |
| Animated Counter | `number-ticker` (geplant) | **selbe Komponente für Cart-Badge + Counter** |

Zusätzliche Komponenten im Bestand, die **nicht im alten Roadmap** standen:
`click-spark`, `highlighter`, `hover-3d-card`, `bounce-cards`, `ambient-image`,
`light-rays`, `banner`, `pixel-image`, `rating`, `navbar`, `product-badge`, `product-tag`,
`password-setup`, `password-confirmation`, `floating-cart`, `splash-cursor`,
`stepper-vertical` *(heute neu gebaut)*, `scroll-progress`

---

## Entscheidungen pro Komponente

### ✅ SKIP – `@magicui/sparkles-text`

`components/sparkles-text/sparkles-text.tsx` ist **fertig** und deckt denselben
Anwendungsfall vollständig ab (4-Zacken-SVG-Funken, interval-basiert, `enabled?`-Prop,
CSS-Keyframe-Injection). Kein Handlungsbedarf.

---

### ✅ WRAPPER – `@magicui/particles` → `ParticlesCard`

`components/particles/particles.tsx` ist eine vollwertige Canvas-Implementierung mit
Mouse-Repulsion und ResizeObserver. Die **Komponente selbst wird nicht neu gebaut.**

Was fehlt: eine `ParticlesCard`-Wrapper-Komponente, die `Particles` als Hintergrund
unter beliebigen `children` legt.

**Ziel:** `components/particles/particles-card.tsx`

```tsx
// Nutzung:
<ParticlesCard>
  <h2>Premium Weinkollektion</h2>
</ParticlesCard>
```

Technisch: `position: relative` Container + `Particles` als absolutes `inset-0` Layer +
`children` mit `position: relative; z-index: 1`.

**Aufwand:** sehr gering (~30 Zeilen)

---

### MERGE – `@magicui/animated-gradient-text` → Variant in `AuroraText`

`AuroraText` arbeitet bereits mit `linear-gradient` + `background-clip: text` +
animierter `background-position`. Das ist exakt dieselbe Technik wie `animated-gradient-text`.

**Unterschied im Detail:**
- `AuroraText`: `background-size: 200% auto`, `alternate`-Direction → weicher Shimmer
- MagicUI `animated-gradient-text`: normaler `linear` Loop, oft + Badge-Wrapper-Element

**Entscheidung:** Kein separates Modul. Stattdessen wird `AuroraText` um eine
`variant`-Prop erweitert:
- `variant="aurora"` (default) → aktuelles Verhalten
- `variant="gradient"` → stetiger Loop ohne `alternate`, für knalligere CTAs

Außerdem wird der Export-Konvention angepasst: `AuroraTextProps` wird mit-exportiert
(fehlt noch).

**Aufwand:** gering (Props-Erweiterung, kein neues File)

---

### BEIDE BEHALTEN – `@magicui/pointer` + `splash-cursor`

`SplashCursor` ist eine **WebGL-Fluid-Simulation** (900+ Zeilen Shader-Code).
Sehr dramatisch, hohe GPU-Last, nur für besondere Hero-Sections geeignet.

`@magicui/pointer` ist ein **leichter CSS-Glow** der dem Cursor folgt – kein WebGL,
kein Canvas, minimale Performance-Kosten. Ideal als dauerhafter globaler Effekt im Layout.

**Entscheidung:** Beide behalten als unterschiedliche Intensitätsstufen.

```
splash-cursor  →  dramatischer Effekt, bewusst eingesetzt (z.B. Wine-Shop Hero)
cursor-glow    →  subtiler Ambient-Effekt, immer aktiv im Layout
```

**Neues File:** `components/cursor-glow/cursor-glow.tsx`
Implementierung: `mousemove`-Listener + `transform: translate()` auf einem
`position: fixed` Radial-Gradient-`div`.

---

### NEU – `@magicui/blur-fade` → `BlurFade`

Kein vergleichbares Äquivalent im Bestand. `BlurFade` ist ein allgemeiner
**Viewport-Einblend-Wrapper** (IntersectionObserver + `filter: blur` + `opacity`).

Kein Framer Motion nötig – native CSS `transition` reicht.

**File:** `components/blur-fade/blur-fade.tsx`

**Props:** `delay?`, `duration?` (default 600ms), `direction?` (`up`|`down`|`left`|`right`),
`blur?` (default `8px`), `once?` (default `true`)

**Aufwand:** gering

---

### NEU – `@magicui/border-beam` → neue Variante in `MagneticButton`

Kein Äquivalent im Bestand. `Highlighter` ist für Text, nicht für Button-Ränder.

**Entscheidung:** `variant="beam"` in `components/magnetic-button/magnetic-button.tsx`
hinzufügen – **kein separates File**, da der Beam nur ein optisches Overlay ist und
die Button-Logik (inkl. Magnetik) erhalten bleibt.

Implementierung: absolutes `div` mit `conic-gradient` + `border-radius: inherit` +
`@keyframes`-Rotation. Der Gradient rotiert hinter einem leicht transparenten
Innen-`div`, sodass nur der Rand leuchtet.

**Aufwand:** mittel (ins bestehende `magnetic-button.tsx` integrieren)

---

### NEU – `@magicui/animated-shiny-text` → `ShinyText` + `ShinyButton`

Kein Äquivalent im Bestand. Kein Framer Motion nötig.

**File:** `components/shiny-text/shiny-text.tsx`

Zwei Exports:
- `ShinyText` – `<span>` mit Shine-Animation (wiederverwendbar)
- `ShinyButton` – fertige Button-Variante mit Shine + Accent-Hintergrund

Implementierung: `background: linear-gradient(...)` + `background-clip: text` +
`@keyframes`-Animation auf `background-position`.

**Aufwand:** gering

---

### NEU – `@magicui/morphing-text` → `MorphingText`

`TextRotate` (Framer Motion Slide) und `MorphingText` (CSS-Filter Blur-Überblend)
sind **visuell völlig verschieden** – beide haben ihren Platz.

**File:** `components/morphing-text/morphing-text.tsx`

Implementierung: `setInterval` + zwei überlagerte `<span>`s, die gegenläufig
`filter: blur()` + `opacity` animieren. **Kein Framer Motion.**

**Props:** `texts: string[]`, `duration?` (ms pro Wort, default 2000),
`className?`, `style?`

**Aufwand:** mittel

---

### AUFTEILUNG – `@magicui/backlight` → Update + `interactive`-Prop

Unsere `Backlight`-Komponente nutzt animierte Radial-Gradient-Blobs (CSS-only, kein Canvas).
MagicUIs Version nutzt wahrscheinlich einen Cursor-Tracking-Ansatz.

**Entscheidung:** Kein Ersatz, sondern **Erweiterung** der bestehenden Komponente:
- Bestehende Blob-Animationen bleiben (Idle-State)
- Neue `interactive?: boolean`-Prop aktiviert Mouse-Tracking
- Bei `interactive=true`: `mousemove`-Listener bewegt den primären Blob zur Cursor-Position

`LightRays` (WebGL-Shader) bleibt eine völlig separate Komponente – anderes visuelles
Konzept (gerichtete Strahlen vs. diffuser Glow).

**Aufwand:** gering (ins bestehende `backlight.tsx` integrieren)

---

### NEU – `@magicui/number-ticker` → `NumberTicker` + Integration `CartIcon` + Trust-Counter

Kein Äquivalent im Bestand. `ScrollProgress` ist linear/horizontal – anderer Use-Case.
In `SHOP-UI-COMPONENTS.md` taucht dieselbe Anforderung unter zwei Einträgen auf:
„Cart Icon Badge" und „Animated Counter (1.234+ Kunden)" – **eine Komponente, zwei Einsatzorte.**

**File:** `components/number-ticker/number-ticker.tsx`

Zwei Schritte:
1. `NumberTicker`-Komponente bauen (vertikales Slot-Machine-Rollen pro Ziffer)
2. Im `CartIcon`-Badge: statische Zahl durch `<NumberTicker value={itemCount} />` ersetzen

Implementierung: Pro Ziffer ein `overflow: hidden`-Container + vertikales CSS-`transform:
translateY()` mit `transition`. Kein Framer Motion nötig.

**Props:** `value: number`, `duration?` (ms, default 600), `className?`

**Aufwand:** mittel

---

### NEU – `@magicui/animated-circular-progress-bar` → `CircularProgress`

`ScrollProgress` ist horizontal/linear. Ein SVG-Kreis ist visuell und semantisch
eine eigene Kategorie.

**File:** `components/circular-progress/circular-progress.tsx`

Implementierung: SVG `<circle>` mit `strokeDasharray` + `strokeDashoffset`-Transition.
Framer Motion optional, CSS-Transition reicht.

Innen: optionaler Label-Slot (`children` oder `label`-Prop).

**Use-Cases:** Stepper-Fortschritt im Checkout, Upload-Progress bei `use-image-upload`,
Bestellstatus.

**Aufwand:** mittel

---

### NEU – `@magicui/dock` → `Dock`

`navbar/navbar.tsx` ist eine Standard-Navigationsleiste (noch nicht im Detail gelesen,
aber aus dem Namen ableitbar). Ein Dock mit **Magnification-Effekt** ist etwas anderes
und kein sinnvoller Variant einer Navbar.

**Entscheidung:** Eigenes Modul `components/dock/dock.tsx`.

Composable API:
```tsx
<Dock>
  <DockItem icon={<Home />} label="Home" href="/" />
  <DockItem icon={<Search />} label="Suche" href="/search" />
  <DockItem icon={<CartIcon />} label="Warenkorb" />
</Dock>
```

Implementierung: Framer Motion `useMotionValue` + `useSpring` + `useTransform` auf
Mouse-X für den Scale-Effekt (pro Item wird Scale aus der Distanz zur Maus berechnet).

**Aufwand:** hoch (komplexe Framer Motion Logik)

---

### NEU – `@magicui/file-tree` → `FileTree`

Kein Äquivalent im Bestand. Composable, rekursiv.

**File:** `components/file-tree/file-tree.tsx`

```tsx
<FileTree>
  <Folder name="components" defaultOpen>
    <File name="backlight.tsx" />
    <Folder name="magnetic-button">
      <File name="magnetic-button.tsx" />
    </Folder>
  </Folder>
</FileTree>
```

Expand/Collapse via `AnimatePresence height: 0 → auto`.
Lucide-Icons: `Folder`, `FolderOpen`, `File`.

**Aufwand:** mittel

---

## Konsolidierte Übersicht

| # | Aktion | Ziel | Was passiert | Aufwand |
|---|---|---|---|---|
| — | SKIP | `sparkles-text` | Bereits fertig | – |
| 1 | WRAPPER | `particles` | `ParticlesCard` als Wrapper | XS |
| 2 | MERGE | `aurora-text` | `variant="gradient"` hinzufügen | XS |
| 3 | NEU | `cursor-glow` | Leichter CSS-Cursor-Glow | S |
| 4 | NEU | `blur-fade` | Viewport-Einblend-Wrapper | S |
| 5 | UPDATE | `backlight` | `interactive`-Prop (Cursor-Tracking) | S |
| 6 | NEU | `shiny-text` | `ShinyText` + `ShinyButton` | S |
| 7 | UPDATE | `magnetic-button` | `variant="beam"` Border-Beam | M |
| 8 | NEU | `number-ticker` | Slot-Rollen + CartIcon-Integration | M |
| 9 | NEU | `morphing-text` | CSS-Blur-Überblend zwischen Texten | M |
| 10 | NEU | `circular-progress` | SVG-Kreis-Fortschrittsanzeige | M |
| 11 | NEU | `file-tree` | Rekursiver Dateibaum mit Expand | M |
| 12 | NEU | `dock` | Magnification-Dock-Navigation | L |

### Implementierungs-Reihenfolge (nach Impact/Aufwand)

```
Runde 1 (Quickwins):
  particles-card wrapper → aurora-text gradient-variant → backlight interactive-prop

Runde 2 (neue standalone):
  blur-fade → shiny-text → cursor-glow → number-ticker

Runde 3 (komplexere):
  morphing-text → border-beam in magnetic-button → circular-progress → file-tree

Runde 4 (aufwändig):
  dock
```

---

## Konventions-Checkliste pro neuem Modul

- [ ] Named Export, kein Default Export
- [ ] Props-Interface mit `export interface XxxProps`
- [ ] CSS Custom Properties (`--accent`, `--foreground`, `--border`, `--card`, ...)
- [ ] Inline Styles primär (keine `.css`-Dateien)
- [ ] `prefers-reduced-motion` abgedeckt
- [ ] Showcase-Sektion angelegt
- [ ] `COMPONENT.md` angelegt
