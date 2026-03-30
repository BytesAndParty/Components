# Components Library

Reusable UI components for personal projects.

## Available Components

| Component | Path | Notes |
|---|---|---|
| `accent-switcher` | `accent-switcher/` | Theme mode + accent palette picker |
| `glow-card` | `glow-card/` | Cursor-following border glow effect |
| `magnetic-button` | `magnetic-button/` | Magnetic hover button motion |
| `text-scramble` | `text-scramble/` | Scramble/reveal text animation |
| `scroll-rotate` | `scroll-rotate/` | Scroll-based rotation wrapper + decorative SVG |

Each component folder contains:
- `*.tsx` component source
- `README.md` with usage and props
- optional `*.css` if extra styles are required

## Quick Install

Copy component files into your project (typically `src/components/ui/`):

```bash
cp /Users/robert.stickler/Development/__Components__/glow-card/glow-card.tsx src/components/ui/
cp /Users/robert.stickler/Development/__Components__/magnetic-button/magnetic-button.tsx src/components/ui/
cp /Users/robert.stickler/Development/__Components__/text-scramble/text-scramble.tsx src/components/ui/
cp /Users/robert.stickler/Development/__Components__/scroll-rotate/scroll-rotate.tsx src/components/ui/
cp /Users/robert.stickler/Development/__Components__/accent-switcher/accent-switcher.tsx src/components/ui/
```

If the component has a CSS file, copy and import it once in your app styles/entry:

```bash
cp /Users/robert.stickler/Development/__Components__/glow-card/glow-card.css src/styles/
cp /Users/robert.stickler/Development/__Components__/magnetic-button/magnetic-button.css src/styles/
```

```tsx
import '@/styles/glow-card.css';
import '@/styles/magnetic-button.css';
```

## Dependency Matrix

| Component | Extra dependencies |
|---|---|
| `accent-switcher` | `lucide-react`, `@radix-ui/react-dropdown-menu`, shadcn `Button`, shadcn `DropdownMenu`, `cn()` |
| `glow-card` | shadcn `Card`, `cn()` |
| `magnetic-button` | shadcn `Button`, `cn()` |
| `text-scramble` | `framer-motion` (`useInView`) |
| `scroll-rotate` | `framer-motion` (`motion`, `useScroll`, `useTransform`) |

## Assumptions

These components assume a shadcn-style setup with path aliases like:
- `@/components/ui/*`
- `@/lib/utils`

If your project uses different paths, adjust imports after copying.

## Recommended Next Step

When this collection grows, add a small index per component category (theme, effects, motion) and semantic version tags in this folder.
