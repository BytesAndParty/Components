# Umsetzungsplan: Nächste Schritte

Stand: April 2026

---

## Aktueller Stand

**47 Komponenten** fertig in `components/`. Showcase-App läuft mit 8 Seiten.

### Zuletzt abgeschlossen

| Komponente | Ordner | Dep |
|---|---|---|
| Cart Icon + Badge | `cart-icon/` | – |
| Add-to-Cart Button | `add-to-cart-button/` | – |
| Cart Drawer / Floating Cart | `floating-cart/` | – |
| SplashCursor (WebGL) | `splash-cursor/` | – |
| Light Rays (WebGL) | `light-rays/` | – |
| BounceCards / Image Gallery | `bounce-cards/` | `gsap` ✅ |
| Particles | `particles/` | – |
| Animierte Icons (CSS-SVG) | `animated-icons/` | – |
| ProductTag + ProductTagGroup | `product-tag/` | – |

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

## Phase 4: Showcase Polish

- Alle neuen Komponenten in Showcase-Seiten integrieren
- Shop-Seite erweitern mit Cart-Flow-Demo
- `data.ts` erweitern für neue Gruppen
- Mobile Responsiveness aller Showcase-Seiten prüfen
