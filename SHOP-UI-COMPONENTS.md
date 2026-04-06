# Shop & Homepage UI Components

UI-Elemente mit Micro-Interactions fuer eine Homepage mit Online-Shop.
Backend: **Medusa.js** | Payment: **Stripe**

> [x] = vorhanden | [-] = von Medusa/Stripe abgedeckt | [ ] = offen

---

## Navigation & Header

- [x] **AnimatedSearch** -- Icon morpht zum Input
- [x] **MagneticButton** -- Cursor-magnetisch
- [x] **Breadcrumb** -- Animated trail
- [x] **Animated Icons (Lottie)** -- Home, Search/X, Menu, Filter, Notification, Visibility, Checkmark, Copy, Loading, Maximize, Share, Trash
- [ ] **Mega-Menu / Dropdown** -- Staggered reveal, blur-in
- [ ] **Cart Icon + Badge** -- Lottie-Icon fehlt noch, Badge bounce bei Add-to-Cart

## Hero / Landing

- [x] **TextRotate** -- Wort-Wechsel mit Physik
- [x] **AuroraText** -- Gradient-Shimmer auf Headline
- [x] **TextScramble** -- Decode-Effekt
- [ ] **Parallax Hero Image** -- Scroll-gesteuerte Tiefe
- [ ] **Animated CTA Button** -- Ripple, shimmer border, pulse
- [ ] **Countdown / Launch Timer** -- Flip-Clock Digits

## Produkte & Shop

- [x] **Wishlist/Favorite** -- Heart burst (HeartFavorite)
- [ ] **Product Card** -- Hover: tilt, glow, quick-view slide-up
- [ ] **Add-to-Cart Button** -- Icon morpht zum Checkmark, confetti
- [ ] **Image Gallery / Carousel** -- Snap-scroll, zoom-on-hover, lightbox
- [ ] **Color/Variant Swatch Picker** -- Tap-ripple, active-ring animiert
- [ ] **Size Selector** -- Pill-toggle mit sliding indicator
- [ ] **Price Display** -- Number-roll bei Variantenwechsel
- [ ] **Rating Stars** -- Fill-animation, hover-preview
- [ ] **Quick-View Modal** -- Spring-open vom Card-Origin
- [ ] **Stock Badge** -- Pulse-dot "Nur noch 3 verfuegbar"

## Warenkorb & Checkout (groesstteils Medusa + Stripe)

- [-] **Cart Logic** -- Medusa Cart API
- [-] **Checkout Flow** -- Medusa Checkout + Stripe Payment Element
- [-] **Payment Method Picker** -- Stripe Elements
- [-] **Shipping Berechnung** -- Medusa Shipping API
- [-] **Order Confirmation** -- Medusa Order API
- [ ] **Cart Drawer / Slide-Panel** -- Spring-slide, backdrop blur (visuelles Layer ueber Medusa-Daten)
- [ ] **Stepper / Progress Bar** -- Step-zu-Step slide mit active-glow (optional, Medusa hat eigenen Flow)
- [x] **PricingInteraction** -- Period-Toggle mit Preis-Morph

## Trust & Social Proof

- [x] **VelocityScroll Testimonials** -- Scroll-reaktive Geschwindigkeit
- [ ] **Logo Ticker / Marquee** -- Infinite scroll, pause-on-hover
- [ ] **Animated Counter** -- Number-roll "1.234+ Kunden"
- [ ] **Review Card** -- Staggered fade-in on scroll

## Allgemein / Seitenuebergreifend

- [x] **Toast / Notification** -- Slide-in + auto-dismiss
- [x] **Switch / Checkbox** -- Spring-toggle
- [x] **Footer** -- Staggered link reveal on scroll
- [ ] **Skeleton Loader** -- Shimmer-pulse beim Laden
- [ ] **Scroll-to-Top Button** -- Fade-in ab Threshold, magnetic hover
- [ ] **Cookie Banner** -- Slide-up mit spring
- [ ] **Tooltip** -- Fade + scale mit Pfeil-Tracking
- [ ] **Tabs** -- Sliding underline / active-pill
- [ ] **Accordion / Collapsible** -- Spring height-animation
