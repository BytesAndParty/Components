# Shop & Homepage UI Components

UI-Elemente mit Micro-Interactions fuer eine Homepage mit Online-Shop.
Backend: **Medusa.js** | Payment: **Stripe**

---

## Navigation & Header

- [x] **Navbar** -- UIkit-style, transparent, mega-dropdown, mobile menu → `components/navbar/`
- [x] **Mega-Menu / Dropdown** -- Staggered reveal, blur-in (integrated in Navbar)
- [x] **Cart Icon + Badge** -- SVG cart, badge bounce, box-arc animation bei Add-to-Cart → `components/cart-icon/`
- [x] **Scroll Progress** -- Progress bar below navbar → `components/scroll-progress/`
- [x] **Dock** -- macOS-style Magnification-Nav für Mobile Bottom-Bar → `components/dock/`

## Hero / Landing

- [ ] **Parallax Hero Image** -- Scroll-gesteuerte Tiefe
- [x] **Animated CTA Button** -- Shimmer-Border + Shiny-Text; siehe `magnetic-button` variants
- [x] **Countdown / Launch Timer** -- Flip-Clock Digits → `components/countdown/`
- [x] **SparklesText** -- Glitzereffekt auf Headline → `components/sparkles-text/`
- [x] **Highlighter** -- Text-Highlighting fuer Weinbeschreibungen → `components/highlighter/`
- [x] **SplashCursor** -- WebGL Fluid-Cursor-Effekt → `components/splash-cursor/`
- [x] **CursorGlow** -- Leichter CSS-Cursor-Glow (dauerhaft, Layout-Level) → `components/cursor-glow/`
- [x] **Particles** -- Canvas-basiert, Mouse-Repulsion → `components/particles/`
- [x] **ParticlesCard** -- Particles als Card-Hintergrund-Wrapper → `components/particles/particles-card.tsx`
- [x] **BlurFade** -- Viewport-Einblend-Wrapper (blur + opacity) → `components/blur-fade/`
- [x] **LightRays** -- WebGL-Shader Lichtstrahlen → `components/light-rays/`

## Text & Typografie

- [x] **AuroraText** -- Animierter Gradient-Shimmer auf Text → `components/aurora-text/`
- [x] **AuroraText `variant="gradient"`** -- Stetiger Gradient-Loop als CTA-Variante
- [x] **TextRotate** -- Framer Motion Slide-Rotation zwischen Texten → `components/text-rotate/`
- [x] **TextScramble** -- Scramble-Reveal bei Scroll-in-View → `components/text-scramble/`
- [x] **VelocityScroll** -- Scroll-Velocity Marquee / Logo-Ticker → `components/velocity-scroll/`
- [x] **MorphingText** -- CSS-Blur-Überblend zwischen Strings → `components/morphing-text/`
- [x] **ShinyText** -- Metallic Shine-Animation + ShinyButton CTA → `components/shiny-text/`

## Produkte & Shop

- [x] **Product Card** -- Hover: tilt, glow, quick-view slide-up → `components/hover-3d-card/`
- [x] **Backlight** -- Glow hinter Produktbildern → `components/backlight/`
- [x] **Backlight `interactive`-Prop** -- Cursor-Tracking zusätzlich zu Blob-Animationen
- [x] **AmbientImage** -- Ambient Glow aus Bildfarben abgeleitet → `components/ambient-image/`
- [x] **Pixel Image** -- Pixelate-to-sharp reveal fuer Produktbilder → `components/pixel-image/`
- [x] **BounceCards / Image Gallery** -- Produkt-Bildergalerie → `components/bounce-cards/`
- [x] **Add-to-Cart Button** -- Cart roll-through, fill, checkmark morph → `components/add-to-cart-button/`
- [x] **Confetti Button** -- Subtiler Confetti-Effekt bei Add-to-Cart → `components/confetti/`
- [x] **ClickSpark** -- Spark-Effekt bei Klick auf Card oder Section → `components/click-spark/`
- [ ] **Color/Variant Swatch Picker** -- Tap-ripple, active-ring animiert
- [ ] **Size Selector** -- Pill-toggle mit sliding indicator
- [x] **Price Display** -- Number-roll bei Variantenwechsel → `components/pricing-interaction/`
- [x] **Rating Stars** -- Fill-animation, hover-preview → `components/rating/`
- [ ] **Quick-View Modal** -- Spring-open vom Card-Origin
- [x] **Stock Badge / Product Tags** -- Pulse-dot, shimmer, 8 Varianten → `components/product-tag/`

## Warenkorb & Checkout

- [x] **Cart Drawer / Slide-Panel** -- Floating FAB mit gestackten Thumbnails → `components/floating-cart/`
- [x] **Stepper (horizontal)** -- Wein-Etikett Bestellflow mit Slide-Animation → `components/stepper/stepper.tsx`
- [x] **Stepper (vertikal)** -- Alle Schritte sichtbar, aktiver expandiert, Connected-List → `components/stepper/stepper-vertical.tsx`
- [x] **NumberTicker** -- Slot-Rollen bei Zahlenwechsel; Integration in CartIcon-Badge → `components/number-ticker/`
- [x] **CircularProgress** -- SVG-Kreis-Fortschrittsanzeige für Checkout-Flow → `components/circular-progress/`

## Buttons & Interactive

- [x] **MagneticButton** -- Magnetischer Hover-Effekt, 7 Varianten → `components/magnetic-button/`
- [x] **MagneticButton `variant="beam"`** -- Rotierender Border-Beam
- [x] **HeartFavorite** -- Favorite-Toggle mit Bounce → `components/heart-favorite/`
- [x] **Checkbox** -- Animierte Checkbox, 3 Größen → `components/checkbox/`
- [x] **Switch** -- Toggle-Switch, 3 Größen → `components/switch/`

## Trust & Social Proof

- [x] **Logo Ticker / Marquee** -- Infinite scroll, pause-on-hover → bereits via `VelocityScroll` abgedeckt
- [x] **AnimatedCounter** -- Number-roll "1.234+ Kunden" → `components/number-ticker/`
- [ ] **Review Card** -- Staggered fade-in on scroll

## Allgemein / Seitenübergreifend

- [x] **Banner / Announcement Bar** -- Dismissible, localStorage persist → `components/banner/`
- [x] **Toast System** -- Context + Hook, 4 Varianten → `components/toast/`
- [ ] **Skeleton Loader** -- Shimmer-pulse beim Laden
- [ ] **Scroll-to-Top Button** -- Fade-in ab Threshold, magnetic hover
- [ ] **Cookie Banner** -- Slide-up mit spring
- [ ] **Tooltip** -- Fade + scale mit Pfeil-Tracking
- [ ] **Tabs** -- Sliding underline / active-pill
- [ ] **Accordion / Collapsible** -- Spring height-animation
- [x] **FileTree** -- Rekursiver Dateibaum mit Expand/Collapse → `components/file-tree/`
- [x] **Breadcrumb** -- Shadcn-Style, composable API → `components/breadcrumb/`
- [x] **Assisted Password Confirmation** -- Zeichen-genaues Feedback → `components/password-confirmation/`
- [x] **Password Setup** -- Stärke-Anzeige, Anforderungs-Checks → `components/password-setup/`
