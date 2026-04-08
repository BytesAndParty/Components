# ClickSpark

Wrapper component that spawns radial spark particles at the click position.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Radial burst** | On click, `sparkCount` small circles fly outward from the click point in evenly distributed angles, scaling to 0 and fading out over `duration` ms. |
| **CSS custom properties** | Each spark uses `--spark-x/y` and `--spark-end-x/y` custom properties to drive its unique trajectory via a shared keyframe. |

## How It Works

1. **Click position**: Click coordinates are calculated relative to the container using `getBoundingClientRect()`.
2. **Angle distribution**: Sparks are distributed in a full circle (`360° / sparkCount` per spark). Each spark's end position is calculated via `cos(angle) * radius` / `sin(angle) * radius`.
3. **DOM-based particles**: Spark elements are created as DOM nodes with SVG circles (via DOM API, not innerHTML) and appended to the container. Each spark self-removes after the animation duration.
4. **Lazy keyframe injection**: The `click-spark-fly` keyframe is injected only on the first click, not on mount.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Content to wrap |
| `sparkColor` | `string` | `'var(--accent)'` | Spark color |
| `sparkSize` | `number` | `10` | Each spark's size in px |
| `sparkRadius` | `number` | `15` | Burst radius in px |
| `sparkCount` | `number` | `8` | Number of sparks per click |
| `duration` | `number` | `400` | Animation duration in ms |

## Dependencies

None (React only).

## Security Notes

- Spark SVG elements are created via the DOM API (`document.createElementNS`) instead of `innerHTML` to prevent XSS when `sparkColor` comes from user input.
