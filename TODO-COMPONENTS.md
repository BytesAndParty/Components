# Component Backlog

## Velocity Scroll (Testimonials)

- **Status**: Built (`velocity-scroll/velocity-scroll.tsx`), in Showcase
- **Reference**: MagicUI `scroll-based-velocity`
- **Install**: `bunx --bun shadcn@latest add @magicui/scroll-based-velocity`
  (not used, built standalone)
- **Notes**: Uses `useScroll` + `useVelocity` + `useSpring` from framer-motion.
  Two rows of testimonial cards scrolling in opposite directions, speed reacts
  to page scroll velocity.

## Assisted Password Confirmation

- **Status**: Pending
- **Reference**: https://21st.dev/r/ln-dev7/assisted-password-confirmation
- **Install**:
  `npx shadcn@latest add https://21st.dev/r/ln-dev7/assisted-password-confirmation`
- **Notes**: Password confirmation with real-time per-character visual feedback
  (green/red highlighting behind masked dots). Shake animation when exceeding
  length, scale bounce on full match, border color transition to green. Uses
  framer-motion.

## SparklesText

- **Status**: Pending
- **Reference**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/sparkles-text`
- **Usage**:
    ```tsx
    import { SparklesText } from "@/registry/magicui/sparkles-text";
    <SparklesText>Magic UI</SparklesText>;
    ```

## Highlighter

- **Status**: Pending
- **Reference**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/highlighter`
- **Notes**: Verwenden fuer einen Text der eine Weinsorte beschreibt, mit
  Highlighting auf wichtigen Woertern.
- **Usage**:
    ```tsx
    import { Highlighter } from "@/registry/magicui/highlighter"
    <Highlighter action="underline" color="#FF9800">underlined text</Highlighter>
    <Highlighter action="highlight" color="#87CEFA">highlighted text</Highlighter>
    ```

## Light Rays

- **Status**: Pending
- **Reference**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/light-rays`
- **Notes**: AUF DEN CARDS VERWENDEN. Drop-in ambient glow effect, fills parent
  container with animated light rays from above.
- **Usage**:
    ```tsx
    import { LightRays } from "@/registry/magicui/light-rays";
    <div className="relative overflow-hidden rounded-lg border">
    	<div className="relative z-10">...content...</div>
    	<LightRays />
    </div>;
    ```

## Scroll Progress

- **Status**: Pending
- **Reference**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/scroll-progress`
- **Notes**: Progress bar below navbar showing page scroll position.
- **Usage**:
    ```tsx
    import { ScrollProgress } from "@/registry/magicui/scroll-progress";
    <ScrollProgress className="top-[65px]" />;
    ```

## Pixel Image

- **Status**: Pending
- **Reference**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/pixel-image`
- **Usage**:
    ```tsx
    import { PixelImage } from "@/registry/magicui/pixel-image";
    <PixelImage
    	src="/image.jpg"
    	customGrid={{ rows: 4, cols: 6 }}
    	grayscaleAnimation
    />;
    ```

## Backlight (Image)

- **Status**: Pending
- **Reference**: MagicUI
- **Install**: `bunx --bun shadcn@latest add @magicui/backlight`
- **Notes**: Fancy gradient glow hinter Bildern.
- **Usage**:
    ```tsx
    import { Backlight } from "@/registry/magicui/backlight";
    <Backlight className="w-full">
    	<img src="..." className="rounded-xl" />
    </Backlight>;
    ```

## Confetti Button

- **Status**: Pending
- **Reference**:
  https://bhq-ui-component-library-steel.vercel.app/buttons/confetti-button
- **Install**: `npx shadcn-ui@latest add button` (base), dann Confetti-Logik
  drauf
- **Notes**: Zwei Varianten recherchieren:
    1. Fullscreen confetti on click (ganzer Screen)
    2. Kleiner/subtiler Confetti-Effekt nur am Button selbst (bevorzugt)

ich möcchte außerdem ggf folgende library verwenden: https://useanimations.com/

machen wir mal mit einer übersicht über alle animirten icons, die wir von hier
verwenden könnten so wie bei den regen symbolen
