# ShinyText & ShinyButton

A metallic shine effect for text and buttons that uses a moving linear gradient.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Moving Shine** | A bright highlight sweep across the text or button in a continuous loop. |
| **Hover Shimmer** | On buttons, the shine effect can be more pronounced or change speed on hover. |

## How It Works

1. **Background Clip**: `ShinyText` uses `background-clip: text` combined with a `linear-gradient` to create the metallic look.
2. **Keyframe Animation**: Animates `background-position` to create the "sweep" effect.
3. **Zero Runtime**: Pure CSS animation, no Javascript overhead for the effect itself.

## Props (ShinyText)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | | Text content |
| `speed` | `number` | `1` | Animation speed multiplier |
| `className` | `string` | | |

## Props (ShinyButton)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | | Button content |
| `variant` | `'primary'\|'outline'` | `'primary'` | Visual style |

## Dependencies

None.
