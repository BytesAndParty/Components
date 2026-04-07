# Umsetzungsplan: Nächste Schritte

Stand: April 2026

---

## Aktueller Stand

**38 Komponenten** fertig in `components/`. Showcase-App läuft mit 8 Seiten (Index, Cards, Text, Icons, Inputs, Feedback, Navigation, Shop).

### Fertig (in SHOP-UI-COMPONENTS.md als ✅ markiert)

| Komponente | Ordner |
|---|---|
| Navbar | `navbar/` |
| Scroll Progress | `scroll-progress/` |
| SparklesText | `sparkles-text/` |
| Highlighter | `highlighter/` |
| Product Card (3D Tilt + Glare) | `hover-3d-card/` |
| Backlight | `backlight/` |
| Light Rays | `light-rays/` |
| Pixel Image | `pixel-image/` |
| Confetti Button | `confetti/` |
| ClickSpark | `click-spark/` |
| Price Display (Number-Roll) | `pricing-interaction/` |
| Rating Stars | `rating/` |
| Stepper | `stepper/` |
| Banner / Announcement Bar | `banner/` |
| Password Confirmation | `password-confirmation/` |

---

## Phase 1: Cart System (NÄCHSTER SCHRITT)

Basierend auf `cart.icon.md` – zwei zusammengehörige Komponenten:

### 1.1 Cart Icon + Badge (Header)
- **Ziel**: SVG-basiertes Cart-Icon im Header mit animiertem Badge-Counter
- **Animation**: Box-fliegt-in-Cart bei Add-to-Cart, Badge bounce
- **Referenz**: speckyboy.com Snippet (ion-icon Cart + Box-Arc-Animation)
- **Umsetzung**: React-Komponente mit CSS-Keyframes, kein Lottie nötig

### 1.2 Add-to-Cart Button (Produktseite)
- **Ziel**: Button mit SVG-Checkmark-Morph nach Klick
- **Referenz**: Dribbble Aaron Iker (Cart fährt durch, Checkmark erscheint)
- **Alternative**: Quickbeam-Style floating Cart (Produkt-Thumbnail fliegt zum FAB)
- **Entscheidung**: Beide Stile als Varianten bauen

### 1.3 Cart Drawer / Slide-Panel
- **Ziel**: Side-Panel mit Warenkorb-Inhalt
- **Animation**: Spring-slide von rechts, backdrop blur
- **Hinweis**: Nur visuelles Layer – Daten kommen später von Medusa.js

---

## Phase 2: Fehlende Shop-Komponenten

### 2.1 BounceCards / Image Gallery 🟡
- 📦 **Neue Dep**: `gsap`
- Produkt-Bildergalerie: Klick auf Thumbnail → großes Bild wechselt
- ReactBits-Style, manuell integrieren

### 2.2 Particles 🟡
- Canvas-basierte Partikel auf Card oder Section
- ReactBits-Source kopieren und anpassen

### 2.3 SplashCursor 🔴
- WebGL Fluid-Simulation Cursor-Effekt
- Performance-kritisch auf mobilen Geräten
- Erst testen, dann entscheiden ob global oder nur auf Desktop

---

## Phase 3: Fehlende Allgemeine Komponenten

| Komponente | Schwierigkeit | Notizen |
|---|---|---|
| Mega-Menu / Dropdown | 🟡 | Staggered reveal, blur-in – Erweiterung der Navbar |
| Parallax Hero Image | 🟡 | Scroll-gesteuerte Tiefe |
| Animated CTA Button | 🟢 | Ripple, shimmer border, pulse |
| Countdown / Launch Timer | 🟡 | Flip-Clock Digits |
| Color/Variant Swatch Picker | 🟡 | Tap-ripple, active-ring |
| Size Selector | 🟢 | Pill-toggle mit sliding indicator |
| Quick-View Modal | 🟡 | Spring-open vom Card-Origin |
| Stock Badge | 🟢 | Pulse-dot "Nur noch 3 verfügbar" |
| Logo Ticker / Marquee | 🟢 | Infinite scroll, pause-on-hover (velocity-scroll Variante?) |
| Animated Counter | 🟢 | Number-roll (pricing-interaction Pattern wiederverwenden) |
| Review Card | 🟡 | Staggered fade-in on scroll |
| Skeleton Loader | 🟢 | Shimmer-pulse |
| Scroll-to-Top Button | 🟢 | Fade-in, magnetic hover |
| Cookie Banner | 🟡 | Slide-up, spring, localStorage |
| Tooltip | 🟡 | Fade + scale, Pfeil-Tracking |
| Tabs | 🟡 | Sliding underline / active-pill |
| Accordion / Collapsible | 🟡 | Spring height-animation |

---

## Phase 4: Fehlende Lottie Icons

Aus `MISSING-ICONS.md`:

**Prio 1**: Cart/Shopping Bag, Arrow/Chevron
**Prio 2**: User/Account, Star, Plus/Minus, Truck, Tag/Discount

→ Entweder von useanimations.com holen oder durch eigene SVG-Animationen ersetzen (wie beim Cart Icon in Phase 1).

---

## Phase 5: Showcase Polish

- Alle neuen Komponenten in Showcase-Seiten integrieren
- Shop-Seite erweitern mit Cart-Flow-Demo
- `data.ts` erweitern für neue Gruppen
- Mobile Responsiveness aller Showcase-Seiten prüfen

---

## Empfohlene Reihenfolge

```
Phase 1 (Cart System)         → Shop-kritisch, Plan steht in cart.icon.md
  ↓
Phase 2.1 (BounceCards)       → Bildergalerie für Produktseiten
  ↓
Phase 3 Quick Wins            → Stock Badge, Skeleton, Scroll-to-Top, CTA Button
  ↓
Phase 3 Medium                → Mega-Menu, Tabs, Accordion, Tooltip
  ↓
Phase 2.2 (Particles)         → Deko-Feature
  ↓
Phase 2.3 (SplashCursor)      → Letztes, Performance-Test nötig
  ↓
Phase 4 (Icons)               → Laufend parallel ergänzen
  ↓
Phase 5 (Showcase)            → Abschluss & Polish
```

---

## Neue Dependencies (noch zu installieren)

| Package | Phase | Verwendet für |
|---|---|---|
| `gsap` | 2 | BounceCards / Image Gallery |
| `ogl` | 2 | Light Rays (ReactBits WebGL) – optional |
