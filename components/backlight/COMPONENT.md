# Backlight

Wrapper component that renders animated, multi-layered glow blobs behind its children for a luminous backlight effect.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Floating blobs** | Each glow blob follows a unique floating keyframe animation (translate + scale), creating an organic, living glow behind the content. |
| **Speed control** | Animation speed is adjustable per-blob via the `speed` multiplier, with each subsequent blob having a slightly longer cycle for visual variety. |
| **Intensity variation** | Even/odd blobs alternate between 70% and 100% of the configured intensity for depth. |

## How It Works

1. **Blob configuration**: Up to 5 predefined positions (`top`, `left`, `size`) distribute the blobs across the container. The actual count is capped by the `blobs` prop.
2. **Radial gradient**: Each blob is a `<div>` with a `radial-gradient` from the resolved color to transparent, creating a soft-edged glow.
3. **Overflow handling**: The glow layer extends beyond the component bounds by `blur` px (via negative inset) and is clipped by `overflow: hidden` on the glow container, preventing bleed into sibling elements.
4. **Keyframe injection**: Three float keyframe variants are injected once via a `<style>` element with ID deduplication.
5. **Theming**: `color: 'auto'` resolves to `var(--accent, #6366f1)`, integrating with the project's accent system.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Content rendered on top of the glow |
| `blobs` | `number` | `3` | Number of glow blobs (max 5) |
| `color` | `string` | `'auto'` | Glow color (`'auto'` uses `--accent`) |
| `intensity` | `number` | `0.3` | Glow opacity (0–1) |
| `blur` | `number` | `60` | Blur radius in px |
| `animated` | `boolean` | `true` | Enable floating animation |
| `speed` | `number` | `1` | Animation speed multiplier |

## Dependencies

None (React only).
