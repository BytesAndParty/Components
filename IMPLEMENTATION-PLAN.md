# Umsetzungsplan: TODO-COMPONENTS

Basierend auf der Analyse von `TODO-COMPONENTS.md` und `SHOP-UI-COMPONENTS.md`.  
Gruppierung nach **Phasen** mit Abhängigkeiten, geschätztem Aufwand und neuen Dependencies.

---

## Legende

| Symbol | Bedeutung |
|---|---|
| 🟢 | Einfach – Copy/Install + Anpassung |
| 🟡 | Mittel – Eigenentwicklung mit bekanntem Pattern |
| 🔴 | Komplex – Neue Architektur oder große Library |
| 📦 | Neue Dependency |

---

## Phase 1: Quick Wins (shadcn/MagicUI Installationen)

Komponenten, die per `npx shadcn` oder `bunx shadcn` direkt installierbar sind und nur minimale Anpassung an das bestehende Theming brauchen.

### 1.1 SparklesText ✅
- **Status**: Fertig → `components/sparkles-text/` (Pure React, keine MagicUI-Dep)
- **Showcase**: Text-Seite

### 1.2 Highlighter ✅
- **Status**: Fertig → `components/highlighter/` (Pure React, IntersectionObserver)
- **Showcase**: Text-Seite (Weinbeschreibung mit highlight + underline)

### 1.3 Scroll Progress ✅
- **Status**: Fertig → `components/scroll-progress/` (Pure React, scaleX transform)
- **Showcase**: Navigation-Seite

### 1.4 Pixel Image 🟢
- **Quelle**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/pixel-image`
- **Aufwand**: Gering
- **Neue Deps**: Keine
- **Showcase**: Cards-Seite (Produktbild-Demo)

### 1.5 Backlight (Image) 🟢
- **Quelle**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/backlight`
- **Aufwand**: Gering – Hinter Produktbilder legen
- **Neue Deps**: Keine
- **Showcase**: Cards-Seite

### 1.6 Light Rays (MagicUI Version) 🟢
- **Quelle**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/light-rays`
- **Aufwand**: Gering – Auf Product Cards als Overlay
- **Neue Deps**: Keine
- **Showcase**: Cards-Seite

---

## Phase 2: ReactBits-Komponenten (Copy + Anpassung)

Erfordern manuelle Integration, da ReactBits kein offizielles shadcn-Registry hat. Code von der Webseite holen und in `components/` integrieren.

### 2.1 Light Rays (ReactBits WebGL Version) 🟡
- **Quelle**: ReactBits (https://reactbits.dev)
- **Install**: Manuell – Code kopieren
- 📦 **Neue Dep**: `ogl` (WebGL-Library)
- **Aufwand**: Mittel – WebGL-Code an Projekt anpassen, als React-Komponente wrappen
- **Verwendung**: Hover-Effekt auf Wein-Reihe (3 Weinflaschen)
- **Showcase**: Neue "Shop"-Demo-Seite oder Cards-Seite

### 2.2 ClickSpark ✅
- **Status**: Fertig → `components/click-spark/` (Pure React, contained overflow:hidden)
- **Showcase**: Cards-Seite

### 2.3 SplashCursor 🔴
- **Quelle**: ReactBits
- **Install**: `bunx --bun shadcn@latest add @react-bits/SplashCursor-JS-CSS`
- **Aufwand**: Hoch – WebGL Fluid-Simulation, Performance-Tuning nötig
- **Hinweis**: Fullscreen-Overlay (`position: fixed`, `z-index: 50`, `pointer-events: none`)
- **Showcase**: Global (Layout) – aber Performance auf mobilen Geräten testen!
- **Risiko**: Kann auf schwachen Geräten GPU-intensiv sein

### 2.4 Particles 🟡
- **Quelle**: ReactBits (https://reactbits.dev/backgrounds/particles)
- **Aufwand**: Mittel – Canvas-basiert, testweise auf eine Card
- **Showcase**: Cards-Seite (eine spezielle Demo-Card)

### 2.5 Stepper ✅
- **Status**: Fertig → `components/stepper/` (Framer Motion, Composable API)
- **Shop-Relevanz**: Kernkomponente für den Etikett-Bestellprozess
- **Showcase**: Shop-Seite (Etikett → Flasche → Bestätigung)

### 2.6 BounceCards / Image Gallery 🟡
- **Quelle**: ReactBits
- 📦 **Neue Dep**: `gsap`
- **Aufwand**: Mittel – GSAP-Integration, Klick-to-Lightbox-Logik
- **Erweiterung**: Klick auf Thumbnail → großes Bild oben wechselt
- **Showcase**: Cards-Seite

---

## Phase 3: Eigenentwicklungen (Neue Komponenten)

### 3.1 Assisted Password Confirmation 🟡
- **Quelle**: 21st.dev (https://21st.dev/r/ln-dev7/assisted-password-confirmation)
- **Install**: `npx shadcn@latest add https://21st.dev/r/ln-dev7/assisted-password-confirmation`
- 📦 **Neue Dep**: `framer-motion` (bereits vorhanden)
- **Aufwand**: Mittel – Install, dann an Theming anpassen
- **Features**: Zeichen-genaues Feedback (grün/rot), Shake bei Überlänge, Scale-Bounce bei Match
- **Showcase**: Inputs-Seite

### 3.2 Confetti Button ✅
- **Status**: Fertig → `components/confetti/` (Pure React Canvas, keine canvas-confetti Dep)
- **Beide Varianten**: `fireConfetti()` fullscreen (multi-burst) + `ConfettiButton` lokal
- **Showcase**: Feedback-Seite

### 3.3 Rating Stars ✅
- **Status**: Fertig → `components/rating/` (Pure React, controlled/uncontrolled, pop animation)
- **Showcase**: Feedback-Seite (interactive + readonly + sizes)

### 3.4 Hover 3D Card ✅
- **Status**: Fertig → `components/hover-3d-card/` (Pure React, cursor-tracking perspective tilt + glare)
- **Showcase**: Cards-Seite (3 Varianten mit Patterns)

### 3.5 Banner / Announcement Bar ✅
- **Status**: Fertig → `components/banner/` (Pure React, dismissible, localStorage persist)
- **Showcase**: Navigation-Seite (2 Varianten)

---

## Phase 4: Komplexe Shop-Komponenten

### 4.1 Navbar (UIkit-Style) ✅
- **Status**: Fertig → `components/navbar/` (Framer Motion, Composable API)
- **Features**: Transparent mode, mega-dropdown, icon buttons + badge, mobile menu
- **Showcase**: Navigation-Seite (UIkit-style: transparent, uppercase, minimal)

### 4.2 Cart Icon + Add-to-Cart Animation 🔴
- **Quelle**: cart.icon.md (speckyboy.com Referenz)
- **Aufwand**: Hoch – Zwei Teile:
  1. **Header Cart Icon** mit Badge-Bounce (Box-fliegt-in-Cart Animation)
  2. **Add-to-Cart Button** mit SVG-Checkmark-Morph
- **Hinweis**: Lottie-Icon fehlt noch (siehe MISSING-ICONS.md Prio 1)
- **Showcase**: Navigation-Seite + Feedback-Seite

### 4.3 Product Card (Komplett) 🔴
- **Aufwand**: Hoch – Vereint mehrere Effekte:
  - Tilt-on-hover (wie Hover 3D)
  - Glow-Effekt (existierendes GlowCard-Pattern)
  - Quick-View Slide-up
  - Backlight / Light Rays
  - Rating Stars
  - Price Display mit Number-Roll
- **Abhängigkeiten**: Phase 1 (Backlight, Light Rays), Phase 3 (Rating Stars)
- **Showcase**: Eigene "Products"-Demo-Seite

---

## Phase 5: Infrastruktur & Fehlende Icons

### 5.1 Fehlende Lottie Icons 🟡
Laut `MISSING-ICONS.md`:
- **Prio 1**: Cart/Shopping Bag, Arrow/Chevron
- **Prio 2**: User/Account, Star, Plus/Minus, Truck, Tag/Discount
- **Quelle**: useanimations.com
- **Aufwand**: Pro Icon gering, aber Lottie-JSON muss gefunden/erstellt werden

### 5.2 Showcase Erweiterung 🟡
- Neue Seite(n) im Router für Shop-spezifische Demos
- `data.ts` erweitern um neue Gruppen
- Phase 4 Komponenten brauchen eine eigene "Shop" Demo-Seite

---

## Dependency Übersicht (Neue Packages)

| Package | Phase | Verwendet für |
|---|---|---|
| `gsap` | 2 | BounceCards / Image Gallery |
| `ogl` | 2 | Light Rays (ReactBits WebGL) |
| `canvas-confetti` | 3 | ~~Confetti Button~~ → Eigene Canvas-Lösung, keine Dep nötig |
| MagicUI (copy-paste) | 1 | SparklesText, Highlighter, ScrollProgress, PixelImage, Backlight, LightRays |
| ReactBits (copy-paste) | 2 | ClickSpark, SplashCursor, Particles, Stepper, BounceCards |

---

## Empfohlene Reihenfolge

```
Phase 1 (MagicUI)        → Schnelle Ergebnisse, kein Risiko
  ↓
Phase 3.5 (Banner)       → Einfach, sofort sichtbar im Shop
  ↓
Phase 3.1 (Password)     → Eigene Inputs-Seite füllen
  ↓
Phase 2.5 (Stepper)      → Shop-kritisch (Etikett-Flow)
  ↓
Phase 3.3 (Rating Stars) → Shop-kritisch (Produktseiten)
  ↓
Phase 3.4 (Hover 3D)     → Cool-Faktor, pure CSS
  ↓
Phase 2.6 (BounceCards)  → Bildergalerie + gsap installieren
  ↓
Phase 2.1 (Light Rays)   → WebGL-Effekt für Wein-Reihe
  ↓
Phase 2.2 (ClickSpark)   → Deko-Feature
Phase 2.4 (Particles)    → Deko-Feature
  ↓
Phase 3.2 (Confetti)     → Add-to-Cart Celebration
  ↓
Phase 2.3 (SplashCursor) → Performance-kritisch, am Ende testen
  ↓
Phase 4 (Navbar, Cart, ProductCard) → Komplexe Shop-Bausteine
  ↓
Phase 5 (Icons + Showcase) → Abschluss & Polish
```

---

## Offene Fragen

1. **UIkit Navbar**: Soll der UIkit-Style 1:1 nachgebaut werden oder reicht ein ähnliches Mega-Menu?
2. **SplashCursor Performance**: Soll der Effekt global sein oder nur auf bestimmten Seiten?
3. **MagicUI shadcn Registry**: Muss geprüft werden ob `bunx shadcn` mit dem bestehenden Projekt-Setup (kein offizielles shadcn init) kompatibel ist – ggf. manuelles Kopieren nötig.
4. **Confetti**: Fullscreen oder lokal am Button? (TODO sagt "lokal bevorzugt")
5. **BounceCards Lightbox**: Eigenes Overlay oder externe Library (z.B. `yet-another-react-lightbox`)?
