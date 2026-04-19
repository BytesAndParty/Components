# Lens

Magnifying lens overlay — hover-follow or click-toggle. Zooms any DOM content (images, maps, code snippets) inside a circular ring that tracks the cursor.

## Modes

| Mode | Behavior |
|---|---|
| `hover` (default) | Lens appears while pointer is inside container, follows cursor live. |
| `toggle` | Click to pin the lens at cursor position; click again to hide. `cursor: zoom-in`. |

## How It Works

1. **Content duplication**: The container renders `children` twice — once at natural size, once inside the circular lens at `transform: scale(zoom) translate(...)`. The translate is calculated so the point under the cursor stays centered in the lens.
2. **Size via ResizeObserver**: Container dimensions are tracked in state (not read during render) — complies with React Compiler purity rules.
3. **Fade-in**: The lens appears with a 160 ms scale-from-center animation on each show.
4. **Ring color**: Default uses `var(--accent)`, so the ring auto-matches the active palette.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content to magnify |
| `mode` | `'hover' \| 'toggle'` | `'hover'` | Activation mode |
| `zoom` | `number` | `1.6` | Scale factor for lens content |
| `lensSize` | `number` | `170` | Lens diameter in px |
| `ringWidth` | `number` | `2` | Ring border width in px |
| `ringColor` | `string` | `'var(--accent)'` | Ring border color |

## Usage

```tsx
<Lens>
  <img src="/product.jpg" alt="Product" />
</Lens>

<Lens mode="toggle" zoom={2.2} lensSize={220}>
  <img src="/label.jpg" alt="Wine label" />
</Lens>
```

## Dependencies

- None (React only)

## Notes

- For crisp zoom on images, use the highest-resolution source you can afford — the lens zooms the rendered DOM, so a low-res `<img>` will pixelate.
- `children` are duplicated in the DOM. If children contain interactive elements or side-effecting components, prefer a simple image/svg inside the Lens.
