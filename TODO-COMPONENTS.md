# TODO Components

Offene Komponenten die noch gebaut werden muessen.

---

## Confetti Button

- **Status**: Verbesserung nötig – aktuelle Implementierung in `components/confetti/` (fireConfetti fullscreen + ConfettiButton lokal)
- **Reference**: https://bhq-ui-component-library-steel.vercel.app/buttons/confetti-button
- **Notes**: Zwei Varianten:
    1. Fullscreen confetti on click (ganzer Screen) – multi-burst implementiert, Spread verbessern
    2. Kleiner/subtiler Confetti-Effekt nur am Button selbst (bevorzugt) – vorhanden

---

## Assisted Password Confirmation

- **Status**: Pending
- **Reference**: https://21st.dev/r/ln-dev7/assisted-password-confirmation
- **Notes**: Password confirmation with real-time per-character visual feedback
  (green/red highlighting behind masked dots). Shake animation when exceeding
  length, scale bounce on full match, border color transition to green. Uses
  framer-motion.

---

## Light Rays (MagicUI)

- **Status**: Pending
- **Notes**: AUF DEN CARDS VERWENDEN. Drop-in ambient glow effect, fills parent
  container with animated light rays from above.
- **Usage**:
    ```tsx
    <div className="relative overflow-hidden rounded-lg border">
      <div className="relative z-10">...content...</div>
      <LightRays />
    </div>
    ```

---

## Pixel Image

- **Status**: Pending
- **Notes**: Pixelate-to-sharp reveal für Produktbilder.
- **Usage**:
    ```tsx
    <PixelImage src="/image.jpg" customGrid={{ rows: 4, cols: 6 }} grayscaleAnimation />
    ```

---

## Backlight (Image)

- **Status**: Pending
- **Notes**: Fancy gradient glow hinter Bildern.
- **Usage**:
    ```tsx
    <Backlight className="w-full">
      <img src="..." className="rounded-xl" />
    </Backlight>
    ```

---

## BounceCards / Image Gallery

- **Status**: Pending
- **Dep**: `gsap`
- **Notes**: Unterhalb einer Bildergalerie verwenden. Klick auf Thumbnail → großes Bild oben wechselt.
- **Usage**:
    ```tsx
    <BounceCards
      images={images}
      containerWidth={500}
      containerHeight={250}
      animationDelay={1}
      animationStagger={0.08}
      easeType="elastic.out(1, 0.5)"
      transformStyles={transformStyles}
      enableHover={false}
    />
    ```

---

## Particles

- **Status**: Pending
- **Reference**: https://reactbits.dev/backgrounds/particles
- **Notes**: Testweise auf eine Card oder Section. Canvas-basiert.
- **Usage**:
    ```tsx
    <Particles
      particleColors={["#ffffff"]}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover
    />
    ```

---

## Light Rays (ReactBits WebGL)

- **Status**: Pending
- **Dep**: `ogl`
- **Notes**: Reihe mit 3 Weinen (`_public_/wine-default.png`), on hover Light Rays Effekt.
- **Usage**:
    ```tsx
    <LightRays
      raysOrigin="top-center"
      raysColor="#ffffff"
      raysSpeed={1}
      lightSpread={0.5}
      rayLength={3}
      followMouse={true}
      mouseInfluence={0.1}
    />
    ```

---

## SplashCursor

- **Status**: Pending
- **Reference**: https://reactbits.dev/animations/splash-cursor
- **Notes**: Fullscreen WebGL fluid-simulation cursor effect. Performance-kritisch auf mobilen Geräten.
  `position: fixed`, `z-index: 50`, `pointer-events: none`.
  Konfigurierbar: SIM_RESOLUTION, DYE_RESOLUTION, SPLAT_RADIUS, SPLAT_FORCE, CURL, etc.
