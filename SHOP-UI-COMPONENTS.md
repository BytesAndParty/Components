# Shop & Homepage UI Components

UI-Elemente mit Micro-Interactions fuer eine Homepage mit Online-Shop.
Backend: **Medusa.js** | Payment: **Stripe**

---

## Navigation & Header

- [x] **Navbar** -- UIkit-style, transparent, mega-dropdown, mobile menu → `components/navbar/`
- [ ] **Mega-Menu / Dropdown** -- Staggered reveal, blur-in
- [x] **Cart Icon + Badge** -- SVG cart, badge bounce, box-arc animation bei Add-to-Cart → `components/cart-icon/`
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
- [x] **Backlight** -- Glow hinter Produktbildern, Farbe aus Bild abgeleitet → `components/backlight/`
- [x] **Light Rays** -- Ambient glow auf Product Cards → `components/light-rays/`
- [x] **Pixel Image** -- Pixelate-to-sharp reveal fuer Produktbilder → `components/pixel-image/`
- [ ] **BounceCards / Image Gallery** -- Produkt-Bildergalerie mit snap-scroll, zoom, lightbox (ReactBits + gsap)
- [x] **Add-to-Cart Button** -- Cart roll-through, fill, checkmark morph → `components/add-to-cart-button/`
- [x] **Confetti Button** -- Subtiler Confetti-Effekt am Button bei Add-to-Cart → `components/confetti/`
- [x] **ClickSpark** -- Spark-Effekt bei Klick auf Card oder Section → `components/click-spark/`
- [ ] **Color/Variant Swatch Picker** -- Tap-ripple, active-ring animiert
- [ ] **Size Selector** -- Pill-toggle mit sliding indicator
- [x] **Price Display** -- Number-roll bei Variantenwechsel → `components/pricing-interaction/`
- [x] **Rating Stars** -- Fill-animation, hover-preview → `components/rating/`
- [ ] **Quick-View Modal** -- Spring-open vom Card-Origin
- [x] **Stock Badge / Product Tags** -- Pulse-dot, shimmer, 8 Varianten (new, sale, low-stock, …) → `components/product-tag/`

## Warenkorb & Checkout (Medusa + Stripe)

- [x] **Cart Drawer / Slide-Panel** -- Quickbeam-style floating FAB mit gestackten Thumbnails → `components/floating-cart/`
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
- [x] **Assisted Password Confirmation** -- Zeichen-genaues Feedback bei Passworteingabe → `components/password-confirmation/`
