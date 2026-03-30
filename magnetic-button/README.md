# MagneticButton

A button with a subtle magnetic hover motion following the cursor.

## Dependencies

- `react`
- shadcn `Button` component
- `cn()` utility (clsx + tailwind-merge)

## Installation

Copy `magnetic-button.tsx` to `src/components/ui/` and copy `magnetic-button.css` to your styles folder.

Import the CSS once in your app entry:

```tsx
import '@/styles/magnetic-button.css';
```

## Usage

```tsx
import { MagneticButton } from '@/components/ui/magnetic-button';

<MagneticButton strength={0.28}>
  Hire me
</MagneticButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strength` | `number` | `0.3` | Cursor pull intensity |
| `className` | `string` | - | Additional classes |
| `...ButtonProps` | `React.ComponentProps<typeof Button>` | - | All shadcn `Button` props |
