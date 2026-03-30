# GlowCard

A card wrapper with a cursor-following border glow effect.

## Dependencies

- `react`
- shadcn `Card` component
- `cn()` utility (clsx + tailwind-merge)

## Installation

Copy `glow-card.tsx` to your `src/components/ui/` directory and copy `glow-card.css` to your styles folder.

Import the CSS once in your app entry:

```tsx
import '@/styles/glow-card.css';
```

## Usage

```tsx
import { GlowCard } from '@/components/ui/glow-card';

<GlowCard className="bg-card/60" glowRadius={280}>
  <div className="p-6">Content</div>
</GlowCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Card content |
| `glowRadius` | `number` | `250` | Glow size in pixels |
| `className` | `string` | - | Additional classes |
| `...CardProps` | `React.ComponentProps<typeof Card>` | - | All shadcn `Card` props |

## Theme Tokens

This component expects CSS variables compatible with your theme, for example:

```css
:root {
  --theme-primary: 16 185 129;
  --theme-accent: 20 184 166;
}
```
