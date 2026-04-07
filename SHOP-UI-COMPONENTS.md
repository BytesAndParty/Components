# Shop & Homepage UI Components

UI-Elemente mit Micro-Interactions fuer eine Homepage mit Online-Shop.
Backend: **Medusa.js** | Payment: **Stripe**

---

## Navigation & Header

- [x] **Navbar** -- UIkit-style, transparent, mega-dropdown, mobile menu → `components/navbar/`
- [ ] **Mega-Menu / Dropdown** -- Staggered reveal, blur-in
- [ ] **Cart Icon + Badge** -- Lottie-Icon fehlt noch, Badge bounce bei Add-to-Cart
- [x] **Scroll Progress** -- Progress bar below navbar ~~(MagicUI)~~ → `components/scroll-progress/`

## Hero / Landing

- [ ] **Parallax Hero Image** -- Scroll-gesteuerte Tiefe
- [ ] **Animated CTA Button** -- Ripple, shimmer border, pulse
- [ ] **Countdown / Launch Timer** -- Flip-Clock Digits
- [x] **SparklesText** -- Glitzereffekt auf Headline → `components/sparkles-text/`
- [x] **Highlighter** -- Text-Highlighting fuer Weinbeschreibungen → `components/highlighter/`
- [ ] **SplashCursor** -- Fluid-Cursor-Effekt (ReactBits)
- [ ] **Particles** -- Testweise auf Card oder Section (ReactBits)

## Produkte & Shop

- [x] **Product Card** -- Hover: tilt, glow, quick-view slide-up → `components/hover-3d-card/` (3D tilt + glare)
- [ ] **Backlight** -- Glow hinter Produktbildern, Farbe aus Bild abgeleitet (MagicUI)
- [ ] **Light Rays** -- Ambient glow auf Product Cards (MagicUI)
- [ ] **Pixel Image** -- Pixelate-to-sharp reveal fuer Produktbilder (MagicUI)
- [ ] **BounceCards / Image Gallery** -- Produkt-Bildergalerie mit snap-scroll, zoom, lightbox (ReactBits + gsap)
- [ ] **Add-to-Cart Button** -- Icon morpht zum Checkmark
- [x] **Confetti Button** -- Subtiler Confetti-Effekt am Button bei Add-to-Cart → `components/confetti/`
- [x] **ClickSpark** -- Spark-Effekt bei Klick auf Card oder Section → `components/click-spark/`
- [ ] **Color/Variant Swatch Picker** -- Tap-ripple, active-ring animiert
- [ ] **Size Selector** -- Pill-toggle mit sliding indicator
- [ ] **Price Display** -- Number-roll bei Variantenwechsel
- [x] **Rating Stars** -- Fill-animation, hover-preview → `components/rating/`
- [ ] **Quick-View Modal** -- Spring-open vom Card-Origin
- [ ] **Stock Badge** -- Pulse-dot "Nur noch 3 verfuegbar"

## Warenkorb & Checkout (Medusa + Stripe)

- [ ] **Cart Drawer / Slide-Panel** -- Spring-slide, backdrop blur (visuelles Layer ueber Medusa-Daten)
- [x] **Stepper** -- Wein-Etikett Bestellflow: Etikett waehlen, Flasche zuordnen → `components/stepper/`

## Trust & Social Proof

- [ ] **Logo Ticker / Marquee** -- Infinite scroll, pause-on-hover
- [ ] **Animated Counter** -- Number-roll "1.234+ Kunden"
- [ ] **Review Card** -- Staggered fade-in on scroll

## Allgemein / Seitenuebergreifend

- [x] **Banner / Announcement Bar** -- Dismissible, localStorage persist → `components/banner/`
- [ ] **Skeleton Loader** -- Shimmer-pulse beim Laden
- [ ] **Scroll-to-Top Button** -- Fade-in ab Threshold, magnetic hover
- [ ] **Cookie Banner** -- Slide-up mit spring
- [ ] **Tooltip** -- Fade + scale mit Pfeil-Tracking
- [ ] **Tabs** -- Sliding underline / active-pill
- [ ] **Accordion / Collapsible** -- Spring height-animation
- [ ] **Assisted Password Confirmation** -- Zeichen-genaues Feedback bei Passworteingabe (framer-motion)
