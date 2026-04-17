# MagicUI – Implementierungsplan

Reihenfolge: Quickwins zuerst, dann standalone, dann komplex.
Konventionen: named exports, inline styles, CSS custom properties, prefers-reduced-motion.
Referenz: MAGICUI-ROADMAP.md (Details), SHOP-UI-COMPONENTS.md (Checklist)

---

## Runde 1 – Quickwins (Updates bestehender Komponenten)

### 1. `ParticlesCard` – Wrapper um bestehende `Particles`
- **File:** `components/particles/particles-card.tsx`
- `position: relative` Container + `<Particles>` als `position: absolute; inset: 0` + `children` mit `z-index: 1`
- Props: alle `ParticlesProps` durchreichen + `children: ReactNode` + `className?` + `style?`
- Showcase: neue Card-Variante auf `cards`-Page

### 2. `AuroraText` – `variant` Prop ergänzen
- **File:** `components/aurora-text/aurora-text.tsx`
- Neue Prop: `variant?: 'aurora' | 'gradient'` (default: `'aurora'`)
- `'aurora'` → bestehendes Verhalten (`alternate`, sanfter Shimmer)
- `'gradient'` → stetiger Loop ohne `alternate`, stärkerer Kontrast für CTAs
- `AuroraTextProps` mit-exportieren (fehlt noch)

### 3. `Backlight` – `interactive` Prop ergänzen
- **File:** `components/backlight/backlight.tsx`
- Neue Prop: `interactive?: boolean` (default: `false`)
- Bei `true`: `mousemove`-Listener auf dem Container → primären Blob zur Cursor-Position bewegen via `transform: translate()`
- Idle-Blob-Animationen bleiben erhalten (laufen parallel)

---

## Runde 2 – Neue standalone Komponenten (leicht)

### 4. `BlurFade`
- **File:** `components/blur-fade/blur-fade.tsx`
- `IntersectionObserver` → bei Sichtbarkeit: `opacity: 0 → 1` + `filter: blur(Xpx) → blur(0)`
- Native CSS `transition`, kein Framer Motion
- Props: `children`, `delay?` (ms), `duration?` (default 600ms), `direction?` (`'up'|'down'|'left'|'right'`), `blur?` (default `'8px'`), `once?` (default `true`)
- `prefers-reduced-motion`: Animation überspringen, direkt sichtbar

### 5. `ShinyText` + `ShinyButton`
- **File:** `components/shiny-text/shiny-text.tsx`
- `ShinyText`: `<span>` mit `background: linear-gradient(...)` + `background-clip: text` + `@keyframes`-Animation auf `background-position`
- `ShinyButton`: fertiger `<button>` mit Shine-Effekt + Accent-Hintergrund, hover opacity
- Kein Framer Motion

### 6. `CursorGlow`
- **File:** `components/cursor-glow/cursor-glow.tsx`
- `position: fixed; inset: 0; pointer-events: none` Container
- `mousemove`-Listener auf `window` → `transform: translate(x, y)` auf Glow-`div`
- Glow: `radial-gradient` mit `--accent`, `blur(60px)`, `opacity: 0.15`
- `prefers-reduced-motion`: nicht rendern

### 7. `NumberTicker` + CartIcon-Integration
- **File:** `components/number-ticker/number-ticker.tsx`
- Pro Ziffer ein `overflow: hidden` Container + vertikales `translateY`-Sliding via CSS `transition`
- Props: `value: number`, `duration?` (default 600ms), `className?`
- **Nach Fertigstellung:** In `components/cart-icon/cart-icon.tsx` das Badge-Element auf `<NumberTicker>` umstellen

---

## Runde 3 – Komplexere Komponenten

### 8. `MorphingText`
- **File:** `components/morphing-text/morphing-text.tsx`
- `setInterval` + zwei überlagerte `<span>`s mit gegenläufigem `filter: blur()` + `opacity`
- Kein Framer Motion
- Props: `texts: string[]`, `duration?` (ms pro Wort, default 2000), `className?`, `style?`

### 9. `MagneticButton variant="beam"` – Border-Beam
- **File:** `components/magnetic-button/magnetic-button.tsx` (Update)
- Neue `variant="beam"` Option
- Implementierung: absolutes `div` mit `conic-gradient` + `border-radius: inherit` + `@keyframes`-Rotation
- Beam rotiert hinter transparentem Innen-`div` → nur Rand leuchtet
- Magnetik bleibt erhalten

### 10. `CircularProgress`
- **File:** `components/circular-progress/circular-progress.tsx`
- SVG `<circle>` mit `strokeDasharray` + `strokeDashoffset` CSS `transition`
- Props: `value` (0–100), `size?` (default 80px), `strokeWidth?` (default 6), `color?` (default `--accent`), `children?` (Label in der Mitte)
- Use-Cases: Checkout-Stepper-Fortschritt, Upload-Progress

### 11. `FileTree`
- **File:** `components/file-tree/file-tree.tsx`
- Composable: `<FileTree>`, `<Folder name defaultOpen?>`, `<File name>`
- Rekursiv, Expand/Collapse via `AnimatePresence height: 0 → auto` (Framer Motion)
- Lucide-Icons: `Folder`, `FolderOpen`, `FileText`

---

## Runde 4 – Aufwändig

### 12. `Dock`
- **File:** `components/dock/dock.tsx`
- Composable: `<Dock>`, `<DockItem icon label href?>`
- Framer Motion `useMotionValue` + `useSpring` + `useTransform` für Magnification
- Scale pro Item aus Distanz zur Maus berechnen
- Props Dock: `magnification?` (default 1.5), `distance?` (default 100px)

---

## Nach jeder Komponente

1. Showcase-Sektion anlegen (passende Page)
2. `COMPONENT.md` anlegen
3. In `SHOP-UI-COMPONENTS.md` als `[x]` markieren
