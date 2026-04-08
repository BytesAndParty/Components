# Footer

Configurable footer with link sections, social icons, and reduced-motion-aware entrance animations.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Blur-in entrance** | Each footer section animates in from a blurred, slightly translated state when scrolled into view (`blur(4px) → 0`, `translateY(-8px) → 0`). |
| **Staggered delays** | Sections animate with incrementing delays (0.1s, 0.2s, 0.3s, ...) for a cascading reveal. |
| **Link hover** | Footer links transition their color on hover via CSS transition (200ms). |
| **Reduced motion** | `useReducedMotion()` from framer-motion disables all entrance animations — children render directly without a motion wrapper. |
| **Top highlight** | A subtle centered line at the top of the footer creates a light separation effect with `blur(1px)`. |

## How It Works

1. **Composable data**: Footer sections are defined as an array of `{ label, links: [{ title, href, icon? }] }`. Default content is provided but fully overridable.
2. **AnimatedContainer**: A private wrapper component that uses `motion.div` with `whileInView` + `viewport: { once: true }`. When `prefers-reduced-motion` is active, it renders children directly (no wrapper).
3. **Grid layout**: Two-column grid — brand/copyright on the left, link columns on the right with dynamic column count based on the number of sections.
4. **Gradient background**: A subtle radial gradient at the top (`rgba(255,255,255,0.06)`) adds depth.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `sections` | `FooterSectionData[]` | Default 4 sections | Array of `{ label, links }` |
| `companyName` | `string` | `'Asme'` | Company name in copyright |
| `logo` | `ReactNode` | FrameIcon | Logo element |

## Dependencies

- `framer-motion` — `motion.div`, `useReducedMotion` for entrance animations
- `lucide-react` — FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon (for defaults)
