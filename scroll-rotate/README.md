# ScrollRotate

Rotate any element based on page scroll progress.

## Dependencies

- `react`
- `framer-motion` (`motion`, `useScroll`, `useTransform`)

## Installation

Copy `scroll-rotate.tsx` to `src/components/ui/` or `src/components/`.

## Usage

```tsx
import { ScrollRotate, RotatingDecoration } from '@/components/ui/scroll-rotate';

<ScrollRotate speed={1.5} className="inline-block">
  <Logo />
</ScrollRotate>

<RotatingDecoration className="absolute -top-10 -right-10" />
```

## Props

### `ScrollRotate`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Element to rotate |
| `className` | `string` | `""` | Optional classes |
| `speed` | `number` | `1` | Rotation multiplier (1 = 360deg over full page scroll) |

### `RotatingDecoration`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Optional classes |
