# TextScramble

A text reveal effect that scrambles characters and resolves into the final string.

## Dependencies

- `react`
- `framer-motion` (`useInView`)

## Installation

Copy `text-scramble.tsx` to `src/components/ui/` or `src/components/`.

## Usage

```tsx
import { TextScramble } from '@/components/ui/text-scramble';

<TextScramble
  text="Building fast, reliable products"
  delay={150}
  speed={28}
  className="font-mono text-2xl"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Final text |
| `className` | `string` | `""` | Optional classes |
| `delay` | `number` | `0` | Start delay in ms |
| `speed` | `number` | `30` | Scramble interval in ms |
| `placeholder` | `string` | `'0'` | Initial placeholder char |
| `chars` | `string` | `A-Za-z0-9@#$%&*` | Random scramble charset |
| `onComplete` | `() => void` | - | Callback after animation |
